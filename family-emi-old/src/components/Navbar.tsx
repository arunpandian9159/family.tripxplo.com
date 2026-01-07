"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://tripemilestone.in-maa-1.linodeobjects.com/logo%2Ftripxplo-logo-crop.png"
              alt="TripXplo"
              width={160}
              height={45}
              className="h-[45px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#packages"
              className="text-gray-700 font-medium hover:text-teal-600 transition-colors"
            >
              Packages
            </Link>
            <Link
              href="#about"
              className="text-gray-700 font-medium hover:text-teal-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 font-medium hover:text-teal-600 transition-colors"
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <i className="fas fa-user text-sm"></i>
                <span>Signup/Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i
              className={cn(
                "fas text-xl text-gray-700 transition-transform duration-300",
                isMobileMenuOpen ? "fa-times" : "fa-bars"
              )}
            ></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-80 opacity-100 pb-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
            <Link
              href="#packages"
              className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              href="#about"
              className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="px-4 py-2">
                <UserMenu />
              </div>
            ) : (
              <button
                className="mx-4 mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-400"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal();
                }}
              >
                <i className="fas fa-user text-sm"></i>
                <span>Signup/Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
