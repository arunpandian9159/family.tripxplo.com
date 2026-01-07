"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-teal-50 hover:bg-teal-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
          {getInitials(user.name)}
        </div>
        <span className="hidden md:block font-medium text-gray-700 max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <i
          className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                +91 {user.mobileNumber}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Open profile modal
                }}
                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <i className="fas fa-user text-gray-400 w-5"></i>
                My Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Open bookings modal
                }}
                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <i className="fas fa-suitcase text-gray-400 w-5"></i>
                My Bookings
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Open wishlist modal
                }}
                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <i className="fas fa-heart text-gray-400 w-5"></i>
                Wishlist
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <i className="fas fa-sign-out-alt w-5"></i>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
