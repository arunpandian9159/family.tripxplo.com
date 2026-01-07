"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
}

export default function PinInput({
  value,
  onChange,
  length = 4,
  error,
  disabled,
}: PinInputProps) {
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type={showPin ? "text" : "password"}
          value={value}
          onChange={handleChange}
          maxLength={length}
          pattern={`[0-9]{${length}}`}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3.5 pr-12 rounded-xl border-2 text-center text-xl tracking-[0.5em] font-bold transition-all",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 focus:border-teal-500",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20",
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
          placeholder="••••"
        />
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          <i className={`fas ${showPin ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <i className="fas fa-exclamation-circle text-xs"></i>
          {error}
        </p>
      )}
    </div>
  );
}
