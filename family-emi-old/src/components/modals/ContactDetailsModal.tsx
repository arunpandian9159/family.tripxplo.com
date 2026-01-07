"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/context/SearchContext";
import { MobileInput } from "@/components/ui";

export default function ContactDetailsModal() {
  const {
    isContactModalOpen,
    closeContactModal,
    openPaymentModal,
    setContactDetails,
    selectedPackage,
  } = useSearch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (mobileNumber.length !== 10)
      newErrors.mobileNumber = "Enter 10-digit mobile number";
    if (!validateEmail(email)) newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Save contact details
    setContactDetails({
      firstName,
      lastName,
      mobileNumber,
      email,
    });

    // Move to payment modal
    setTimeout(() => {
      setIsSubmitting(false);
      openPaymentModal();
    }, 500);
  };

  if (!isContactModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeContactModal}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-user-edit text-teal-500"></i>
                Contact Details
              </h3>
              <p className="text-sm text-gray-500">Step 1 of 2</p>
            </div>
            <button
              onClick={closeContactModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <i className="fas fa-times text-gray-500"></i>
            </button>
          </div>

          {/* Package Summary */}
          {selectedPackage && (
            <div className="px-6 py-3 bg-teal-50 border-b border-teal-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                  <i className="fas fa-suitcase-rolling text-teal-600"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedPackage.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedPackage.destination} • {selectedPackage.duration}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-teal-500"></i>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-teal-500"
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-teal-500"></i>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-teal-500"
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-phone text-teal-500"></i>
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <MobileInput
                value={mobileNumber}
                onChange={setMobileNumber}
                error={errors.mobileNumber}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-envelope text-teal-500"></i>
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-teal-500"
                }`}
                placeholder="john.doe@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeContactModal}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Submit & Continue
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
