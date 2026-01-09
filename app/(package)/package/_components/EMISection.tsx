"use client";
import React from "react";
import { Shield, CreditCard, Calendar, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatIndianCurrency } from "@/lib/utils";

// EMI Quick Select Options
const EMI_QUICK_OPTIONS = [
  { months: 3, label: "3 Mo", popular: false },
  { months: 6, label: "6 Mo", popular: true },
  { months: 12, label: "12 Mo", popular: false },
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
      {/* EMI Toggle Header */}
      <button
        onClick={() => setShowEMI(!showEMI)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-gold-50 rounded-xl border border-gold-200 hover:border-gold-300 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-100 rounded-lg">
            <CreditCard size={18} className="text-gold-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">
              Prepaid EMI Available
            </p>
            <p className="text-xs text-gold-600">Flexible payment options</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-gold-500 transition-transform duration-300 ${
            showEMI ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* EMI Options Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showEMI ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4">
          {/* Quick Select Options */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Popular Plans
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EMI_QUICK_OPTIONS.map((option) => (
                <button
                  key={option.months}
                  onClick={() => handleQuickEMISelect(option.months)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedEMIMonths === option.months && !isCustomEMI
                      ? "border-gold-400 bg-gradient-to-br from-gold-50 to-amber-50 shadow-md shadow-gold-100"
                      : "border-slate-200 bg-white hover:border-gold-200 hover:bg-gold-50/50"
                  }`}
                >
                  {option.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold-500 text-white text-[10px] font-bold rounded-full uppercase">
                      Popular
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-lg font-bold ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-600"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`text-xs ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-500"
                          : "text-slate-400"
                      }`}
                    >
                      {formatIndianCurrency(
                        Math.ceil(safePrice / option.months)
                      )}
                      /mo
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Custom Duration
              </p>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  isCustomEMI
                    ? "bg-gold-100 text-gold-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {selectedEMIMonths} Months
              </span>
            </div>

            <div className="relative px-1">
              {/* Shadcn Slider */}
              <Slider
                value={[selectedEMIMonths]}
                onValueChange={handleCustomEMIChange}
                min={3}
                max={16}
                step={1}
                className="w-full cursor-pointer [&>span:first-child]:bg-gold-200 [&>span:first-child]:cursor-pointer [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-gold-400 [&>span:first-child>span]:to-gold-500 [&>span:last-child]:border-gold-500 [&>span:last-child]:bg-white [&>span:last-child]:shadow-lg [&>span:last-child]:shadow-gold-500/30 [&>span:last-child]:cursor-pointer"
              />

              {/* Range Labels */}
              <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-medium">
                <span>3 mo</span>
                <span>4 mo</span>
                <span>5 mo</span>
                <span>7 mo</span>
                <span>8 mo</span>
                <span>9 mo</span>
                <span>11 mo</span>
                <span>13 mo</span>
                <span>14 mo</span>
                <span>16 mo</span>
              </div>
            </div>
          </div>

          {/* EMI Summary */}
          <div className="p-4 bg-gradient-to-r from-gold-500 to-amber-500 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gold-100 uppercase tracking-wider">
                  Your Monthly EMI
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {formatIndianCurrency(emiAmount)}
                  </span>
                  <span className="text-sm text-gold-100">
                    × {selectedEMIMonths} months
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar size={24} />
              </div>
            </div>

            {/* EMI Details */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gold-100">Total Amount</p>
                <p className="text-sm font-semibold">
                  {formatIndianCurrency(safePrice)}
                </p>
              </div>
            </div>
          </div>

          {/* EMI Benefits */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-emerald-500" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <CreditCard size={12} className="text-blue-500" />
              All Cards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
