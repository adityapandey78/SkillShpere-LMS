const express = require("express");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
  enrollInFreeCourse,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);
router.post("/free-enroll", enrollInFreeCourse);

module.exports = router;
