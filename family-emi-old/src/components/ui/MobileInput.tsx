"use client";

import { cn } from "@/lib/utils";

interface MobileInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function MobileInput({
  value,
  onChange,
  error,
  disabled,
  placeholder = "Enter 10-digit mobile number",
}: MobileInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <div className="relative flex">
        <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-semibold">
          +91
        </span>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          maxLength={10}
          pattern="[0-9]{10}"
          disabled={disabled}
          className={cn(
            "flex-1 px-4 py-3.5 rounded-r-xl border-2 transition-all",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 focus:border-teal-500",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20",
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
          placeholder={placeholder}
        />
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
