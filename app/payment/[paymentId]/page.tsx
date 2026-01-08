"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { paymentApi } from "@/lib/api-client";
import {
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Lock,
  IndianRupee,
  Loader2,
  XCircle,
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await paymentApi.getStatus(paymentId);
        if (response.success && response.data) {
          setPaymentDetails(response.data as PaymentDetails);
        } else {
          setError("Payment not found");
        }
      } catch (err) {
        console.error("Error fetching payment:", err);
        setError("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  const handlePayment = async () => {
    if (!paymentDetails) return;

    setProcessing(true);
    try {
      const response = await paymentApi.process({
        paymentId: paymentDetails.paymentId,
        paymentMethod: selectedMethod,
      });

      if (response.success) {
        toast.success("Payment successful!");
        // Redirect to booking confirmation
        router.push(`/booking/transaction/${paymentDetails.orderId}`);
      } else {
        toast.error(response.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Payment Error
          </h1>
          <p className="text-slate-600 mb-6">
            {error || "Payment details not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "upi" as PaymentMethod,
      name: "UPI",
      icon: Smartphone,
      desc: "GPay, PhonePe, Paytm",
    },
    {
      id: "card" as PaymentMethod,
      name: "Card",
      icon: CreditCard,
      desc: "Credit/Debit Card",
    },
    {
      id: "netbanking" as PaymentMethod,
      name: "Net Banking",
      icon: Building2,
      desc: "All major banks",
    },
    {
      id: "wallet" as PaymentMethod,
      name: "Wallet",
      icon: Wallet,
      desc: "Paytm, Amazon Pay",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-rose-50/20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Secure Payment
              </h1>
              <p className="text-xs text-slate-500">
                Order #{paymentDetails.orderId}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Payment Methods */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="hidden"
                    />
                    <div
                      className={`p-2.5 rounded-lg ${
                        selectedMethod === method.id
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {method.name}
                      </p>
                      <p className="text-sm text-slate-500">{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  100% Secure Payments
                </p>
                <p className="text-xs text-emerald-600">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[360px] mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                    Payment Summary
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatIndianCurrency(paymentDetails.amount)}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-1">Total Payable</p>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Order ID</span>
                  <span className="text-sm font-medium text-slate-800">
                    {paymentDetails.orderId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Currency</span>
                  <span className="text-sm font-medium text-slate-800">
                    {paymentDetails.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Payment Method</span>
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {selectedMethod === "upi"
                      ? "UPI"
                      : selectedMethod === "netbanking"
                        ? "Net Banking"
                        : selectedMethod}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Amount</span>
                    <span className="text-xl font-bold text-slate-900 flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {paymentDetails.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay {formatIndianCurrency(paymentDetails.amount)}
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center mt-4">
                  By proceeding, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
