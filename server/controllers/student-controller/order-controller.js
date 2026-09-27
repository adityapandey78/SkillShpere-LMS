const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// paypal-rest-sdk is callback-based; wrap the two calls we need in promises.
const createPayPalPayment = (json) =>
  new Promise((resolve, reject) =>
    paypal.payment.create(json, (error, payment) => (error ? reject(error) : resolve(payment)))
  );

const executePayPalPayment = (paymentId, payerId) =>
  new Promise((resolve, reject) =>
    paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) =>
      error ? reject(error) : resolve(payment)
    )
  );

// Adds the course to the student's list only if it isn't already there, so a
// replayed capture (a browser refresh on the return URL) can't duplicate it.
async function enrollStudentOnce(userId, entry) {
  const result = await StudentCourses.updateOne(
    { userId, "courses.courseId": { $ne: entry.courseId } },
    { $push: { courses: entry } }
  );

  // matchedCount 0 means either the student has no document yet, or they are
  // already enrolled. Only the first case needs a new document.
  if (result.matchedCount === 0) {
    const existing = await StudentCourses.findOne({ userId });
    if (!existing) await StudentCourses.create({ userId, courses: [entry] });
  }
}

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      paymentMethod,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
    } = req.body;

    // Price comes from the database, never from the request body — otherwise a
    // client can set its own price on the PayPal order.
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const amount = parseFloat(course.pricing).toFixed(2);
    // PayPal's REST API does not accept INR. Override per environment if needed.
    const currency = process.env.PAYPAL_CURRENCY || "USD";

    const paymentInfo = await createPayPalPayment({
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/student/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/student/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: course.title,
                sku: courseId,
                price: amount,
                currency,
                quantity: 1,
              },
            ],
          },
          amount: { currency, total: amount },
          description: course.title,
        },
      ],
    });

    // Status and paymentId are set here, not taken from the body, so the order
    // starts pending and carries the PayPal id we later verify against.
    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      orderDate,
      paymentId: paymentInfo.id,
      payerId: null,
      instructorId,
      instructorName,
      courseImage,
      courseTitle: course.title,
      courseId,
      coursePricing: String(course.pricing),
    });

    await newlyCreatedCourseOrder.save();

    const approveUrl = paymentInfo.links.find((link) => link.rel == "approval_url").href;

    res.status(201).json({
      success: true,
      data: { approveUrl, orderId: newlyCreatedCourseOrder._id },
    });
  } catch (err) {
    // PayPal SDK errors keep their detail on err.response (name, message,
    // details[]), not on err.message — log the whole thing or you get nothing.
    const paypalError = err.response || err;
    console.error("[order/create] failed:", err.message || err);
    console.error("[order/create] paypal response:", JSON.stringify(paypalError, null, 2));

    const detail =
      paypalError?.details?.[0]?.issue ||
      paypalError?.name ||
      err.message ||
      "unknown error";

    res.status(500).json({
      success: false,
      message: `Could not start the PayPal payment (${detail}).`,
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!paymentId || !payerId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "paymentId, payerId and orderId are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Replayed capture (refresh on the return URL): the order is already paid,
    // so report success without charging or enrolling again.
    if (order.orderStatus === "confirmed") {
      return res.status(200).json({
        success: true,
        message: "Order already confirmed",
        data: order,
      });
    }

    // The payment must be the one this order created. Without this check any
    // logged-in user could confirm someone else's order.
    if (order.paymentId !== paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment does not belong to this order",
      });
    }

    // Ask PayPal to actually take the money. Until this succeeds the order is
    // not paid, whatever the client claims.
    let payment;
    try {
      payment = await executePayPalPayment(paymentId, payerId);
    } catch (err) {
      console.error("PayPal execute failed:", err.message || err);
      return res.status(402).json({
        success: false,
        message: "Payment could not be confirmed with PayPal",
      });
    }

    if (payment.state !== "approved") {
      return res.status(402).json({
        success: false,
        message: `Payment not approved (state: ${payment.state})`,
      });
    }

    // Guard against the approved amount differing from what we charged for.
    const paidAmount = payment?.transactions?.[0]?.amount?.total;
    const expectedAmount = parseFloat(order.coursePricing).toFixed(2);
    if (paidAmount !== expectedAmount) {
      console.error(`Amount mismatch on order ${orderId}: paid ${paidAmount}, expected ${expectedAmount}`);
      return res.status(402).json({
        success: false,
        message: "Paid amount does not match the course price",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = payerId;

    await order.save();

    await enrollStudentOnce(order.userId, {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    });

    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.error("Capture order error:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Free course enrollment — no payment, but the same duplicate guard applies.
const enrollInFreeCourse = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
    } = req.body;

    // The course must actually be free, otherwise this route is a way around
    // checkout entirely.
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (Number(course.pricing) > 0) {
      return res.status(400).json({
        success: false,
        message: "This course is paid — please use checkout",
      });
    }

    const existingEnrollment = await StudentCourses.findOne({
      userId: userId,
      "courses.courseId": courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    await enrollStudentOnce(userId, {
      courseId: courseId,
      title: courseTitle,
      instructorId: instructorId,
      instructorName: instructorName,
      dateOfPurchase: new Date(),
      courseImage: courseImage,
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: {
          studentId: userId,
          studentName: userName,
          studentEmail: userEmail,
          paidAmount: 0,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in free course!",
      data: { courseId: courseId, enrolled: true },
    });
  } catch (err) {
    console.error("Free enroll error:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Some error occurred while enrolling in free course!",
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder, enrollInFreeCourse };
