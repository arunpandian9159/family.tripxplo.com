"use client";

import React from "react";
import { Plane } from "lucide-react";

export default function PackagesLoadingFull() {
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-slate-50">
      {/* Animated Logo Container */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 rounded-full border-4 border-gold-100 animate-pulse" />

        {/* Spinning ring */}
        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-gold-500 animate-spin" />

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/30">
            <Plane className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Finding your perfect trip
        </h3>
        <p className="text-sm text-slate-500">Please wait a moment...</p>
      </div>

      {/* Loading dots */}
      <div className="flex items-center gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gold-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
