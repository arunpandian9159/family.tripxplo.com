"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect /register to home page
// Registration is now handled via AuthModal popup
export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Store a flag to open auth modal on home
    sessionStorage.setItem("openAuthModal", "register");
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );
}
