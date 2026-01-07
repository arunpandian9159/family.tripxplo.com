"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "card" | "upi" | "netbanking";

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    selectedPackage,
    selectedEMIPlan,
    contactDetails,
  } = useSearch();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!agreedToTerms) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment successful! Your booking is confirmed. (Demo)");
      closePaymentModal();
    }, 2000);
  };

  if (
    !isPaymentModalOpen ||
    !selectedPackage ||
    !selectedEMIPlan ||
    !contactDetails
  ) {
    return null;
  }

  // Generate payment schedule
  const paymentSchedule = Array.from(
    { length: selectedEMIPlan.months },
    (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return {
        month: i + 1,
        date: date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        amount: selectedEMIPlan.monthlyAmount,
      };
    }
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePaymentModal}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Progress */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Complete Payment
              </h3>
              <button
                onClick={closePaymentModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-teal-600">
                <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs">
                  <i className="fas fa-check"></i>
                </div>
                <span className="text-sm font-medium">Contact</span>
              </div>
              <div className="flex-1 h-0.5 bg-teal-500"></div>
              <div className="flex items-center gap-2 text-teal-600">
                <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200"></div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-sm">Confirm</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Package Summary */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="fas fa-suitcase-rolling text-teal-500"></i>
                Package Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Package</span>
                  <p className="font-medium">{selectedPackage.title}</p>
                </div>
                <div>
                  <span className="text-gray-500">Destination</span>
                  <p className="font-medium">{selectedPackage.destination}</p>
                </div>
                <div>
                  <span className="text-gray-500">Duration</span>
                  <p className="font-medium">{selectedPackage.duration}</p>
                </div>
                <div>
                  <span className="text-gray-500">Travelers</span>
                  <p className="font-medium">As per selection</p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <i className="fas fa-user text-blue-500"></i>
                Customer Details
              </h4>
              <p className="text-gray-700">
                {contactDetails.firstName} {contactDetails.lastName}
              </p>
              <p className="text-sm text-gray-600">
                +91 {contactDetails.mobileNumber} • {contactDetails.email}
              </p>
            </div>

            {/* EMI Summary */}
            <div className="p-4 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 text-white">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <i className="fas fa-credit-card"></i>
                EMI Plan Summary
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/70 text-xs">Monthly EMI</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(selectedEMIPlan.monthlyAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-xs">Duration</p>
                  <p className="text-xl font-bold">
                    {selectedEMIPlan.months} Months
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-xs">Total Amount</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      selectedEMIPlan.totalAmount +
                        selectedEMIPlan.processingFee
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-teal-500"></i>
                Payment Schedule
              </h4>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600">EMI</th>
                      <th className="px-4 py-2 text-left text-gray-600">
                        Due Date
                      </th>
                      <th className="px-4 py-2 text-right text-gray-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentSchedule.map((payment) => (
                      <tr
                        key={payment.month}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-2 font-medium">
                          EMI {payment.month}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {payment.date}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="fas fa-wallet text-teal-500"></i>
                Select Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "upi" as PaymentMethod,
                    icon: "fa-mobile-alt",
                    label: "UPI",
                  },
                  {
                    id: "card" as PaymentMethod,
                    icon: "fa-credit-card",
                    label: "Card",
                  },
                  {
                    id: "netbanking" as PaymentMethod,
                    icon: "fa-university",
                    label: "Net Banking",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === method.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <i
                      className={`fas ${method.icon} text-xl ${
                        paymentMethod === method.id
                          ? "text-teal-600"
                          : "text-gray-400"
                      }`}
                    ></i>
                    <span
                      className={`text-sm font-medium ${
                        paymentMethod === method.id
                          ? "text-teal-700"
                          : "text-gray-600"
                      }`}
                    >
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <i className="fas fa-shield-alt text-green-500"></i>
                100% Secure
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <i className="fas fa-lock text-green-500"></i>
                256-bit SSL
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <i className="fas fa-check-circle text-green-500"></i>
                PCI Compliant
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 mt-0.5"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms-conditions"
                  className="text-teal-600 hover:underline"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/refund-policy"
                  className="text-teal-600 hover:underline"
                >
                  Refund Policy
                </a>
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-gray-500 text-sm">First EMI Amount</span>
                <p className="text-xl font-bold text-teal-600">
                  {formatCurrency(selectedEMIPlan.monthlyAmount)}
                </p>
              </div>
              <button
                onClick={handlePayment}
                disabled={!agreedToTerms || isProcessing}
                className="px-8 py-3 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Pay {formatCurrency(selectedEMIPlan.monthlyAmount)}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
