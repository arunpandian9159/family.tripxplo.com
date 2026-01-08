"use client";
import React from "react";
import Wishlist from "./Wishlist";
import { Heart } from "lucide-react";

const ExploreWishList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-coral-50/20 to-slate-50/50 pb-20 pt-16">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-coral-200/20 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-20 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-coral-500 to-coral-400 rounded-2xl shadow-lg shadow-coral-500/25">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Your favorite packages saved for later
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="relative max-w-6xl mx-auto px-4 lg:px-8 pt-8">
        <Wishlist />
      </div>
    </div>
  );
};

export default ExploreWishList;
