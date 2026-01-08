"use client";

import useRoutes from "@/app/hooks/useRoutes";
import { useAuth } from "@/app/hooks/useAuth";
import React, { useState, useEffect } from "react";
import NavItems from "./NavItems";
import NavMenu from "./NavMenu";
import { LogIn, UserCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AuthModal from "../home/AuthModal";

const DesktopNavBar = () => {
  const routes = useRoutes();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"signin" | "register">(
    "signin",
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    setAuthModalView("signin");
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav
        className={cn(
          "hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100"
            : "bg-white border-b border-slate-200",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="TripXplo Logo"
                width={140}
                height={45}
                priority
                className="w-auto h-9 object-contain"
              />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 mr-4">
                {routes.map((route) => (
                  <NavItems
                    key={route.label}
                    label={route.label}
                    href={route.href}
                    active={route.active}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-slate-200 mx-2" />

              {/* Login / Account */}
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <NavMenu
                    label="Account"
                    icon={UserCircleIcon}
                    href="/account"
                  />
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <LogIn className="w-5 h-5 text-slate-500" />
                    <span className="hidden xl:inline">Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </>
  );
};

export default DesktopNavBar;
