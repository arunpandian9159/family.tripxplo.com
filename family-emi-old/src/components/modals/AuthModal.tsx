"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { PinInput, MobileInput } from "@/components/ui";

type AuthStep = "login" | "signup1" | "signup2";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, isLoading } =
    useAuth();
  const [step, setStep] = useState<AuthStep>("login");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login form state
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPin, setLoginPin] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPin, setSignupPin] = useState("");
  const [signupConfirmPin, setSignupConfirmPin] = useState("");

  const resetForms = () => {
    setLoginMobile("");
    setLoginPin("");
    setSignupName("");
    setSignupEmail("");
    setSignupMobile("");
    setSignupPin("");
    setSignupConfirmPin("");
    setErrors({});
    setStep("login");
  };

  const handleClose = () => {
    closeAuthModal();
    setTimeout(resetForms, 300);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (loginMobile.length !== 10) {
      setErrors({ loginMobile: "Please enter a valid 10-digit mobile number" });
      return;
    }
    if (loginPin.length !== 4) {
      setErrors({ loginPin: "Please enter a 4-digit PIN" });
      return;
    }

    const result = await login(loginMobile, loginPin);
    if (!result.success) {
      setErrors({ loginPin: result.error || "Login failed" });
    }
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!signupName.trim()) newErrors.signupName = "Name is required";
    if (!validateEmail(signupEmail))
      newErrors.signupEmail = "Invalid email address";
    if (signupMobile.length !== 10)
      newErrors.signupMobile = "Enter 10-digit mobile number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep("signup2");
  };

  const handleSignupStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (signupPin.length !== 4) newErrors.signupPin = "PIN must be 4 digits";
    if (signupPin !== signupConfirmPin)
      newErrors.signupConfirmPin = "PINs do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register({
      name: signupName,
      email: signupEmail,
      mobileNumber: signupMobile,
      pin: signupPin,
    });

    if (!result.success) {
      setErrors({ signupConfirmPin: result.error || "Registration failed" });
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-mobile-alt text-teal-500"></i>
              {step === "login" && "Login to TripXplo"}
              {step === "signup1" && "Create Account"}
              {step === "signup2" && "Set Your PIN"}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <i className="fas fa-times text-gray-500"></i>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Login Form */}
            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-phone text-teal-500"></i>
                    Mobile Number
                  </label>
                  <MobileInput
                    value={loginMobile}
                    onChange={setLoginMobile}
                    error={errors.loginMobile}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-lock text-teal-500"></i>
                    4-Digit PIN
                  </label>
                  <PinInput
                    value={loginPin}
                    onChange={setLoginPin}
                    error={errors.loginPin}
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      Login
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-600">
                  New user?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("signup1")}
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    Register
                  </button>
                </div>
              </form>
            )}

            {/* Signup Step 1 */}
            {step === "signup1" && (
              <form onSubmit={handleSignupStep1} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-user text-teal-500"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {errors.signupName && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.signupName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-envelope text-teal-500"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {errors.signupEmail && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.signupEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-phone text-teal-500"></i>
                    Mobile Number
                  </label>
                  <MobileInput
                    value={signupMobile}
                    onChange={setSignupMobile}
                    error={errors.signupMobile}
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-arrow-right"></i>
                  Continue
                </button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("login")}
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}

            {/* Signup Step 2 */}
            {step === "signup2" && (
              <form onSubmit={handleSignupStep2} className="space-y-4">
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Create your 4-digit PIN for secure login
                  </p>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user-circle text-teal-500 text-xl"></i>
                    <span className="font-medium text-gray-800">
                      {signupName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">{signupEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("signup1")}
                    className="text-teal-600 text-sm font-medium mt-2 hover:underline"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Change
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-lock text-teal-500"></i>
                    Create 4-Digit PIN
                  </label>
                  <PinInput
                    value={signupPin}
                    onChange={setSignupPin}
                    error={errors.signupPin}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-lock text-teal-500"></i>
                    Confirm PIN
                  </label>
                  <PinInput
                    value={signupConfirmPin}
                    onChange={setSignupConfirmPin}
                    error={errors.signupConfirmPin}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("signup1")}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
