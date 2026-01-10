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
  Loader2,
  XCircle,
  Calendar,
  Sparkles,
  Zap,
  Clock,
  Receipt,
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface PaymentDetails {
  paymentId?: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  // EMI fields
  emiMonths?: number;
  emiAmount?: number;
  totalAmount?: number;
  currentEmiNumber?: number;
}

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
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
      let finalPaymentId =
        (paymentDetails as any).paymentId ||
        (paymentId.startsWith("pay_") ? paymentId : null);

      // If we don't have a paymentId (likely a booking ID URL), initialize a session
      if (!finalPaymentId) {
        console.log(
          "No payment session found, initializing one for booking:",
          paymentDetails.orderId
        );
        const payRes = await paymentApi.payEmi({
          bookingId: paymentDetails.orderId,
          installmentNumber: paymentDetails.currentEmiNumber || 1,
        });

        if (payRes.success && payRes.data) {
          finalPaymentId = (payRes.data as any).paymentId;
        } else {
          toast.error(payRes.message || "Failed to initialize payment session");
          setProcessing(false);
          return;
        }
      }

      const response = await paymentApi.process({
        paymentId: finalPaymentId,
        paymentMethod: selectedMethod,
      });

      if (response.success) {
        toast.success("EMI Payment successful!");
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
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
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
            className="px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Default EMI values if not provided
  const emiMonths = paymentDetails.emiMonths || 6;
  const emiAmount = paymentDetails.emiAmount || paymentDetails.amount;
  const totalAmount = paymentDetails.totalAmount || emiAmount * emiMonths;
  const currentEmiNumber = paymentDetails.currentEmiNumber || 1;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/30 to-amber-50/20">
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
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900">EMI Payment</h1>
              <p className="text-xs text-slate-500">
                Order #{paymentDetails.orderId}
              </p>
            </div>
            <div className="px-3 py-1.5 bg-gold-100 rounded-full">
              <span className="text-xs font-bold text-gold-700">
                EMI {currentEmiNumber} of {emiMonths}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Left Column - EMI Info & Payment Methods */}
          <div className="lg:flex-1">
            {/* EMI Progress Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="absolute top-3 right-3">
                <Sparkles size={18} className="text-gold-400 animate-pulse" />
              </div>

              <div className="relative">
                {/* EMI Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/20 rounded-full border border-gold-500/30 mb-4">
                  <Wallet size={14} className="text-gold-400" />
                  <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                    Prepaid EMI Payment
                  </span>
                </div>

                {/* Current EMI Amount */}
                <div className="mb-4">
                  <p className="text-sm text-slate-400 mb-1">
                    Current EMI Amount
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                    <span className="text-slate-400">
                      EMI {currentEmiNumber}/{emiMonths}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Payment Progress</span>
                    <span>
                      {currentEmiNumber} of {emiMonths} EMIs
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(currentEmiNumber / emiMonths) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* EMI Summary */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500">Monthly EMI</p>
                    <p className="text-lg font-bold text-white">
                      {formatIndianCurrency(emiAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Package</p>
                    <p className="text-lg font-bold text-white">
                      {formatIndianCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-gold-500" />
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-gold-400 bg-gold-50"
                        : "border-slate-200 hover:border-gold-200"
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
                          ? "bg-gold-500 text-white"
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
                      <CheckCircle2 className="w-5 h-5 text-gold-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gold-50 rounded-xl p-4 flex items-center gap-3 border border-gold-200">
              <div className="p-2 bg-gold-100 rounded-lg">
                <Shield className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gold-800">
                  100% Secure Payments
                </p>
                <p className="text-xs text-gold-600">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[360px] mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
                <div className="absolute top-3 right-3">
                  <Sparkles size={14} className="text-gold-400 animate-pulse" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-gold-400" />
                    <span className="text-xs font-medium text-gold-300 uppercase tracking-wider">
                      EMI Payment
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    EMI {currentEmiNumber} of {emiMonths}
                  </p>
                </div>
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
                  <span className="text-sm text-slate-500">EMI Duration</span>
                  <span className="text-sm font-medium text-slate-800">
                    {emiMonths} Months
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

                {/* EMI Schedule */}
                <div className="p-3 bg-gold-50 rounded-xl border border-gold-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-gold-600" />
                    <span className="text-xs font-semibold text-gold-700 uppercase">
                      EMI Schedule
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gold-700">
                      {emiMonths} EMIs of
                    </span>
                    <span className="text-sm font-bold text-gold-700">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">
                      Total Package Value
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {formatIndianCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt size={16} className="text-gold-500" />
                      <span className="font-bold text-slate-900">Pay Now</span>
                    </div>
                    <span className="text-xl font-black text-slate-900">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="relative w-full py-4 overflow-hidden gold-gradient text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Pay EMI - {formatIndianCurrency(emiAmount)}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Lock size={12} className="text-green-500" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Shield size={12} className="text-gold-500" />
                    <span className="text-xs">Encrypted</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center mt-4">
                  By proceeding, you agree to our Terms of Service
                </p>
              </div>
            </div>

            {/* Next EMI Info */}
            {currentEmiNumber < emiMonths && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 rounded-lg">
                    <Clock size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Next EMI Due
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatIndianCurrency(emiAmount)} on next month
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
