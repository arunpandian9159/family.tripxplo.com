'use client';
import { verifyGoogleAccessToken } from '@/app/utils/api/verifyGoogleSignin';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface GoogleSignInProps {
  onSuccess?: () => void;
}

const GoogleSignIn = ({ onSuccess }: GoogleSignInProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isVerifying, setIsVerifying] = useState(false);
  const hasVerified = useRef(false);

  // Check for pending Google auth on mount
  useEffect(() => {
    const verifyAndRedirect = async () => {
      // Guard conditions
      if (
        status !== 'authenticated' ||
        !(session as any)?.accessToken ||
        isVerifying ||
        hasVerified.current
      ) {
        return;
      }

      // Check if there's a pending Google auth redirect
      const pendingAuth = localStorage.getItem('pendingGoogleAuth');
      const redirectUrl = localStorage.getItem('googleAuthRedirect');

      if (!pendingAuth) {
        // User was already logged in, not a fresh Google auth
        return;
      }

      // Clear the flags immediately to prevent re-running
      localStorage.removeItem('pendingGoogleAuth');
      localStorage.removeItem('googleAuthRedirect');

      hasVerified.current = true;
      setIsVerifying(true);

      try {
        // Verify the Google token with our backend
        await verifyGoogleAccessToken((session as any).accessToken);

        toast.success('Signed in successfully!');

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }

        // Small delay to let toast show
        setTimeout(() => {
          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            router.refresh();
          }
        }, 500);
      } catch (error) {
        console.error('Google auth verification failed:', error);
        toast.error('Sign in failed. Please try again.');
        hasVerified.current = false;
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAndRedirect();
  }, [status, session, isVerifying, onSuccess, router]);

  const handleSignIn = () => {
    // Store flags in localStorage before redirecting to Google
    localStorage.setItem('pendingGoogleAuth', 'true');

    // Store the current URL for redirect after auth
    if (typeof window !== 'undefined') {
      localStorage.setItem('googleAuthRedirect', window.location.href);
    }

    // Start Google OAuth flow - NextAuth will handle the redirect
    signIn('google');
  };

  if (isVerifying) {
    return (
      <div className="flex w-full gap-3 items-center justify-center p-3 border border-slate-200 rounded-xl bg-slate-50">
        <span className="w-5 h-5 border-2 border-slate-300 border-t-coral-500 rounded-full animate-spin" />
        <span className="font-medium text-slate-700">Completing sign in...</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex w-full gap-3 items-center justify-center p-3 border border-slate-200 cursor-pointer rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors touch-manipulation"
      onClick={handleSignIn}
    >
      <span className="relative w-6 h-6">
        <Image
          fill
          sizes="24px"
          className="object-contain"
          alt="Google"
          src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
        />
      </span>
      <span className="font-medium text-slate-700">Continue with Google</span>
    </button>
  );
};

export default GoogleSignIn;
