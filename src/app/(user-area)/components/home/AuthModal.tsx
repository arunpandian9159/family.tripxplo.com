'use client';
import React, { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
} from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultView?: 'signin' | 'register';
}

const loginSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const registerSchema = yup.object().shape({
  name: yup.string().min(3, 'Name must be at least 3 characters long').required('Name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  mobileNo: yup
    .string()
    .min(10, 'Mobile Number must be at least 10 digits long')
    .required('Mobile Number is required'),
  gender: yup.string().min(4, 'Gender is required').required('Gender is required'),
});

const AuthModal = ({ isOpen, onClose, onSuccess, defaultView = 'signin' }: AuthModalProps) => {
  const [view, setView] = useState<'signin' | 'register'>(defaultView);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const registerForm = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onLoginSubmit = async (values: yup.InferType<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(values);
      if (response.success) {
        onSuccess?.();
        onClose();
        router.refresh();
      }
    } catch (error: any) {
      loginForm.setError('root', {
        message: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: yup.InferType<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(values);
      if (response.success) {
        // Auto login after registration
        const loginResponse = await authApi.login({
          email: values.email,
          password: values.password,
        });
        if (loginResponse.success) {
          onSuccess?.();
          onClose();
          router.refresh();
        }
      }
    } catch (error: any) {
      registerForm.setError('root', {
        message: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    // Implement Google OAuth
    console.log('Google login');
  };

  const switchView = (newView: 'signin' | 'register') => {
    setView(newView);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 bg-white">
        {/* Header with gradient */}
        <div className="relative bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {view === 'signin' ? 'Welcome Back!' : 'Join Family Tripxplo'}
            </h2>
          </div>
          <p className="text-emerald-50 text-sm">
            {view === 'signin'
              ? 'Sign in to continue your journey'
              : 'Start planning your dream family vacation'}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {view === 'signin' ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...loginForm.register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {loginForm.formState.errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{loginForm.formState.errors.root.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>

              {/* Switch to Register */}
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('register')}
                  className="text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('name')}
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('mobileNo')}
                    type="tel"
                    placeholder="9876543210"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {registerForm.formState.errors.mobileNo && (
                  <p className="mt-1 text-sm text-red-500">
                    {registerForm.formState.errors.mobileNo.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    {...registerForm.register('gender')}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {registerForm.formState.errors.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {registerForm.formState.errors.gender.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {registerForm.formState.errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">
                    {registerForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <CheckCircle2 className="w-5 h-5" />}
              </button>

              {/* Switch to Login */}
              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('signin')}
                  className="text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
