"use client";
import React from "react";
import {
  Shield,
  CreditCard,
  Calendar,
  ChevronDown,
  Sparkles,
  Check,
  Clock,
  Wallet,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatIndianCurrency } from "@/lib/utils";

// EMI Quick Select Options
const EMI_QUICK_OPTIONS = [
  { months: 3, label: "3", popular: false, savings: "Fastest" },
  { months: 6, label: "6", popular: true, savings: "Best Value" },
  { months: 12, label: "12", popular: false, savings: "Low EMI" },
];

interface EMISectionProps {
  isMobile?: boolean;
  showEMI: boolean;
  setShowEMI: (value: boolean) => void;
  selectedEMIMonths: number;
  setSelectedEMIMonths: (value: number) => void;
  isCustomEMI: boolean;
  setIsCustomEMI: (value: boolean) => void;
  safePrice: number;
  emiAmount: number;
}

export default function EMISection({
  isMobile = false,
  showEMI,
  setShowEMI,
  selectedEMIMonths,
  setSelectedEMIMonths,
  isCustomEMI,
  setIsCustomEMI,
  safePrice,
  emiAmount,
}: EMISectionProps) {
  const handleQuickEMISelect = (months: number) => {
    setSelectedEMIMonths(months);
    setIsCustomEMI(false);
  };

  const handleCustomEMIChange = (value: number[]) => {
    setSelectedEMIMonths(value[0]);
    setIsCustomEMI(true);
  };

  return (
    <div
      className={`${isMobile ? "p-4 border-t border-slate-100" : "px-6 pb-4"}`}
    >
      {/* EMI Toggle Header - Enhanced with preview */}
      <button
        onClick={() => setShowEMI(!showEMI)}
        className="w-full group relative overflow-hidden p-4 bg-gradient-to-r from-amber-50 via-gold-50 to-amber-50 rounded-2xl border-2 border-gold-200 hover:border-gold-400 transition-all duration-300 hover:shadow-lg hover:shadow-gold-100"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-gold-400 to-amber-500 rounded-xl shadow-lg shadow-gold-200">
                <Wallet size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">Prepaid EMI</p>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Easy Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mini EMI Preview */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400">Starting</span>
              <span className="text-sm font-bold text-gold-600">
                {formatIndianCurrency(Math.ceil(safePrice / 12))}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </span>
            </div>
            <ChevronDown
              size={20}
              className={`text-gold-500 transition-transform duration-300 ${
                showEMI ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* EMI Options Panel */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          showEMI ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-5">
          {/* Featured EMI Price Display */}
          <div className="relative overflow-hidden p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute top-2 right-2">
              <Sparkles size={20} className="text-gold-400 animate-pulse" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gold-400" />
                <span className="text-xs font-medium text-gold-300 uppercase tracking-widest">
                  Your Monthly EMI
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                    <span className="text-lg font-medium text-slate-400">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    for {selectedEMIMonths} months
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="px-3 py-1.5 bg-gold-500/20 backdrop-blur rounded-lg border border-gold-500/30">
                    <span className="text-xs font-bold text-gold-300">
                      {selectedEMIMonths} MONTHS
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Total: {formatIndianCurrency(safePrice)}
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Payment Progress</span>
                  <span>1 of {selectedEMIMonths}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${100 / selectedEMIMonths}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Select Options */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar size={12} />
              Choose Duration
            </p>
            <div className="grid grid-cols-3 gap-3">
              {EMI_QUICK_OPTIONS.map((option) => (
                <button
                  key={option.months}
                  onClick={() => handleQuickEMISelect(option.months)}
                  className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedEMIMonths === option.months && !isCustomEMI
                      ? "border-gold-400 bg-gradient-to-br from-gold-50 to-amber-50 shadow-lg shadow-gold-200/50"
                      : "border-slate-200 bg-white hover:border-gold-200 hover:bg-gold-50/30 hover:shadow-md"
                  }`}
                >
                  {option.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-gold-500 to-amber-500 text-white text-[10px] font-bold rounded-full uppercase shadow-lg shadow-gold-300/50 flex items-center gap-1">
                      <Sparkles size={10} />
                      Popular
                    </span>
                  )}

                  {/* Selection indicator */}
                  {selectedEMIMonths === option.months && !isCustomEMI && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`text-3xl font-black ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-600"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-500"
                          : "text-slate-400"
                      }`}
                    >
                      months
                    </span>
                    <div className="w-full pt-2 mt-1 border-t border-slate-100">
                      <span
                        className={`text-xs font-bold block ${
                          selectedEMIMonths === option.months && !isCustomEMI
                            ? "text-gold-600"
                            : "text-slate-600"
                        }`}
                      >
                        {formatIndianCurrency(
                          Math.ceil(safePrice / option.months)
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        per month
                      </span>
                    </div>
                  </div>

                  {/* Savings badge */}
                  <div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      selectedEMIMonths === option.months && !isCustomEMI
                        ? "bg-gold-100 text-gold-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {option.savings}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range Slider */}
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={12} />
                Custom Duration
              </p>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isCustomEMI
                    ? "bg-gradient-to-r from-gold-100 to-amber-100 border border-gold-300"
                    : "bg-slate-100"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    isCustomEMI ? "text-gold-700" : "text-slate-500"
                  }`}
                >
                  {selectedEMIMonths}
                </span>
                <span
                  className={`text-xs ${
                    isCustomEMI ? "text-gold-500" : "text-slate-400"
                  }`}
                >
                  Months
                </span>
              </div>
            </div>

            <div className="relative px-2 py-1 bg-slate-50 rounded-xl">
              {/* Shadcn Slider */}
              <Slider
                value={[selectedEMIMonths]}
                onValueChange={handleCustomEMIChange}
                min={3}
                max={16}
                step={1}
                className="w-full cursor-pointer [&>span:first-child]:h-2 [&>span:first-child]:bg-slate-200 [&>span:first-child]:cursor-pointer [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-gold-400 [&>span:first-child>span]:to-amber-500 [&>span:last-child]:h-6 [&>span:last-child]:w-6 [&>span:last-child]:border-2 [&>span:last-child]:border-gold-500 [&>span:last-child]:bg-white [&>span:last-child]:shadow-xl [&>span:last-child]:shadow-gold-500/30 [&>span:last-child]:cursor-pointer"
              />

              {/* Range Labels */}
              <div className="flex justify-between mt-4 px-1">
                <span className="text-xs font-medium text-slate-400">3 mo</span>
                <span className="text-xs font-medium text-slate-400">
                  16 mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
