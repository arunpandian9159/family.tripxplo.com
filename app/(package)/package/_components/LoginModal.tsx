"use client";
import React, { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "@/app/utils/api/login";
import { setUser } from "@/app/store/features/userSlice";
import toast from "react-hot-toast";
import GoogleSignIn from "@/components/ui/gogglesignin";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Plane,
  X,
  Shield,
  CheckCircle2,
} from "lucide-react";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: yup.InferType<typeof loginSchema>) => {
    try {
      setLoading(true);
      const response = await login(values.email, values.password);

      // Save user to Redux store
      if (response?.data?.result?.user) {
        dispatch(setUser(response.data.result.user));
      }

      toast.success("Welcome back!");
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    toast.success("Signed in with Google!");
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl p-0 border-0 bg-white [&>button]:hidden
          fixed inset-0 translate-x-0 translate-y-0
          sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]
          w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[95vw] sm:max-w-4xl
          rounded-none sm:rounded-2xl overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex flex-col sm:flex-row h-full sm:min-h-[600px] overflow-y-auto sm:overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel - Decorative (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-700 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
              <div className="absolute top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center w-full p-8">
              <div className="max-w-xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Almost There!
                </h2>
                <p className="text-emerald-100 text-sm">
                  Sign in to complete your booking and access exclusive member
                  benefits.
                </p>

                {/* Benefits */}
                <div className="mt-8 space-y-3 text-left">
                  {[
                    "Exclusive member discounts",
                    "Easy booking management",
                    "24/7 travel support",
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-white/90 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 relative sm:overflow-y-auto min-h-0">
            {/* Close Button - Enhanced for mobile */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center transition-colors z-10 touch-manipulation"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex-1 flex flex-col justify-start sm:justify-center max-w-sm mx-auto w-full pt-12 sm:pt-0 pb-6 sm:pb-0">
              {/* Mobile Header - Compact gradient banner */}
              <div className="sm:hidden mb-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-white truncate">
                      Sign in to Book
                    </h2>
                    <p className="text-xs text-white/80 truncate">
                      Access your account
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden sm:block lg:block mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  Sign in to Continue
                </h2>
                <p className="text-slate-500 text-sm">
                  Enter your credentials to proceed with booking
                </p>
              </div>

              {/* Google Sign In */}
              <GoogleSignIn onSuccess={handleGoogleSuccess} />

              {/* Divider */}
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                    Or with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="modal-email"
                    className="block text-sm font-medium text-slate-700 mb-1 sm:mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="modal-email"
                      {...register("email")}
                      className={cn(
                        "w-full pl-9 sm:pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                        "transition-all duration-200 touch-manipulation",
                        errors.email &&
                          "border-red-500 bg-red-50 focus:ring-red-500/20"
                      )}
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="modal-password"
                    className="block text-sm font-medium text-slate-700 mb-1 sm:mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      id="modal-password"
                      {...register("password")}
                      className={cn(
                        "w-full pl-9 sm:pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                        "transition-all duration-200 touch-manipulation",
                        errors.password &&
                          "border-red-500 bg-red-50 focus:ring-red-500/20"
                      )}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors py-1 touch-manipulation"
                    onClick={onClose}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button - Touch optimized */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In & Book
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link - Touch optimized */}
              <p className="mt-4 sm:mt-6 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors py-1 px-1 touch-manipulation"
                  onClick={() => {
                    onClose();
                    sessionStorage.setItem("openAuthModal", "register");
                    router.push("/");
                  }}
                >
                  Create account
                </button>
              </p>

              {/* Trust Badge */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-slate-400 pb-safe">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Your data is secure with us</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
