"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect /sign-in to home page
// Authentication is now handled via AuthModal popup
export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Store a flag to open auth modal on home
    sessionStorage.setItem("openAuthModal", "signin");
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );
}
