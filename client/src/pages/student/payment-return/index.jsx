import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { trackEvent } from "@/lib/pulsar";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  const [error, setError] = useState(null);

  useEffect(() => {
    async function capturePayment() {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      // PayPal sent us back without the ids, or the order we started is gone
      // from this tab's storage. Either way we can't finish the capture.
      if (!paymentId || !payerId) {
        setError("PayPal didn't return a payment reference. If you were charged, contact support before paying again.");
        return;
      }

      if (!orderId) {
        setError("We couldn't match this payment to your order. If you were charged, contact support before paying again.");
        return;
      }

      try {
        const response = await captureAndFinalizePaymentService(paymentId, payerId, orderId);

        if (response?.success) {
          trackEvent("course_purchased", {
            orderId,
            courseId: response?.data?.courseId,
            title: response?.data?.courseTitle,
            pricing: response?.data?.coursePricing,
            method: "paypal",
          });
          sessionStorage.removeItem("currentOrderId");
          navigate("/student/student-courses");
          return;
        }

        // 200 with success:false — the server explained why.
        const message = response?.message || "The payment couldn't be confirmed.";
        console.error("[payment] capture returned success:false", { orderId, paymentId, response });
        setError(message);
        toast({ title: "Payment not completed", description: message, variant: "destructive" });
      } catch (err) {
        // The interceptor already logged and toasted; keep the message on screen
        // so the user isn't left staring at a spinner.
        console.error("[payment] capture failed", { orderId, paymentId, payerId, error: err });
        setError(err?.userMessage || "The payment couldn't be confirmed. Please try again.");
      }
    }

    capturePayment();
  }, [payerId, paymentId, navigate, toast]);

  if (error) {
    return (
      <Card className="max-w-lg mx-auto mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Payment not completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-400">
            Reference: {paymentId || "none"} · Open the browser console for the full error.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/student/courses")}>Back to courses</Button>
            <Button variant="outline" onClick={() => navigate("/student/student-courses")}>
              My courses
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing payment... Please wait
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalPaymentReturnPage;
