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
import {
  Mail,
  Lock,
  ArrowRight,
  Plane,
  X,
  User,
  Phone,
  CheckCircle2,
  Shield,
  Users,
} from "lucide-react";
import { authApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultView?: "signin" | "register";
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/,
      "Password must be at least 6 characters with letters and numbers"
    )
    .required("Password is required"),
  fullName: yup
    .string()
    .min(4, "Full Name must be at least 4 characters long")
    .required("Full Name is required"),
  mobileNo: yup
    .string()
    .min(10, "Mobile Number must be at least 10 digits long")
    .required("Mobile Number is required"),
  gender: yup
    .string()
    .min(4, "Gender is required")
    .required("Gender is required"),
});

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultView = "signin",
}: AuthModalProps) {
  const [view, setView] = useState<"signin" | "register">(defaultView);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Login form
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Register form
  const registerForm = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onLoginSubmit = async (values: yup.InferType<typeof loginSchema>) => {
    try {
      setLoading(true);
      const response = await login(values.email, values.password);

      if (response?.data?.result?.user) {
        dispatch(setUser(response.data.result.user));
      }

      toast.success("Welcome back!");
      loginForm.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (
    values: yup.InferType<typeof registerSchema>
  ) => {
    try {
      setLoading(true);
      const response = await authApi.register({
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.mobileNo,
      });

      if (response.success) {
        toast.success("Registration Successful! Please verify your email.");
        localStorage.setItem("registeredUser", JSON.stringify(values));
        registerForm.reset();
        onClose();
        router.push("/register/verify-otp");
      } else {
        if (response.message?.includes("email")) {
          toast.error("Email id already exists");
        } else {
          toast.error(response.message || "Something went wrong");
        }
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error?.response?.data?.errorMessage === "Validation Error: email") {
        toast.error("Email id already exists");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    toast.success("Signed in with Google!");
    onSuccess?.();
    onClose();
  };

  const switchView = (newView: "signin" | "register") => {
    setView(newView);
    loginForm.reset();
    registerForm.reset();
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
          className="flex flex-col sm:flex-row h-full sm:min-h-[600px] sm:max-h-[90vh] overflow-y-auto sm:overflow-hidden"
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
                  {view === "signin" ? "Welcome Back!" : "Join TripXplo!"}
                </h2>
                <p className="text-emerald-100 text-sm">
                  {view === "signin"
                    ? "Sign in to access exclusive travel packages and manage your bookings."
                    : "Create an account to unlock amazing travel deals and experiences."}
                </p>

                {/* Benefits */}
                <div className="mt-8 space-y-3 text-left">
                  {(view === "signin"
                    ? [
                        "Exclusive member discounts",
                        "Easy booking management",
                        "24/7 travel support",
                      ]
                    : [
                        "200+ handcrafted destinations",
                        "Best price guarantee",
                        "Personalized recommendations",
                      ]
                  ).map((benefit, i) => (
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
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center transition-colors z-10 touch-manipulation"
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
                      {view === "signin" ? "Sign In" : "Create Account"}
                    </h2>
                    <p className="text-xs text-white/80 truncate">
                      {view === "signin"
                        ? "Access your account"
                        : "Join TripXplo today"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden sm:block lg:block mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {view === "signin" ? "Sign In" : "Create Account"}
                </h2>
                <p className="text-slate-500 text-sm">
                  {view === "signin"
                    ? "Enter your credentials to access your account"
                    : "Fill in your details to get started"}
                </p>
              </div>

              {/* Sign In Form */}
              {view === "signin" && (
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="signin-email"
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
                        id="signin-email"
                        {...loginForm.register("email")}
                        className={cn(
                          "w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          loginForm.formState.errors.email &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="signin-password"
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
                        id="signin-password"
                        {...loginForm.register("password")}
                        className={cn(
                          "w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          loginForm.formState.errors.password &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {loginForm.formState.errors.password.message}
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
                    className="w-full py-3.5 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <div onClick={handleGoogleSuccess}>
                    <GoogleSignIn />
                  </div>
                </form>
              )}

              {/* Register Form */}
              {view === "register" && (
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-2.5 sm:space-y-3"
                >
                  {/* Full Name Field */}
                  <div>
                    <label
                      htmlFor="register-fullName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="register-fullName"
                        {...registerForm.register("fullName")}
                        className={cn(
                          "w-full pl-9 pr-4 py-2.5 sm:py-2.5 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          registerForm.formState.errors.fullName &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                    {registerForm.formState.errors.fullName && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {registerForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="register-email"
                        {...registerForm.register("email")}
                        className={cn(
                          "w-full pl-9 pr-4 py-2.5 sm:py-2.5 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          registerForm.formState.errors.email &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        id="register-password"
                        {...registerForm.register("password")}
                        className={cn(
                          "w-full pl-9 pr-4 py-2.5 sm:py-2.5 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          registerForm.formState.errors.password &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number Field */}
                  <div>
                    <label
                      htmlFor="register-mobileNo"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="register-mobileNo"
                        {...registerForm.register("mobileNo")}
                        className={cn(
                          "w-full pl-9 pr-4 py-2.5 sm:py-2.5 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          registerForm.formState.errors.mobileNo &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                        placeholder="9876543210"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                    {registerForm.formState.errors.mobileNo && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {registerForm.formState.errors.mobileNo.message}
                      </p>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label
                      htmlFor="register-gender"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Gender
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        id="register-gender"
                        {...registerForm.register("gender")}
                        className={cn(
                          "w-full pl-9 pr-4 py-2.5 sm:py-2.5 rounded-xl border bg-slate-50 text-slate-900 text-base sm:text-sm appearance-none",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white",
                          "transition-all duration-200 touch-manipulation",
                          registerForm.formState.errors.gender &&
                            "border-red-500 bg-red-50 focus:ring-red-500/20"
                        )}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {registerForm.formState.errors.gender && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {registerForm.formState.errors.gender.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button - Touch optimized */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3 touch-manipulation min-h-[48px]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <div onClick={handleGoogleSuccess}>
                    <GoogleSignIn />
                  </div>
                </form>
              )}

              {/* Switch View Link - Touch optimized */}
              <p className="mt-4 sm:mt-6 text-center text-sm text-slate-600">
                {view === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchView("register")}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors py-1 px-1 touch-manipulation"
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchView("signin")}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors py-1 px-1 touch-manipulation"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>

              {/* Trust Badge */}
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-slate-400 pb-safe">
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
