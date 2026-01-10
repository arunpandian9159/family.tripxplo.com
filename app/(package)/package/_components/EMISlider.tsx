"use client";
import React from "react";
import { Slider } from "@/components/ui/slider";

interface EMISliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function EMISlider({
  value,
  onChange,
  min = 3,
  max = 16,
  step = 1,
}: EMISliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="relative px-2 py-1 bg-slate-50 rounded-xl">
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className="w-full cursor-pointer [&>span:first-child]:h-2 [&>span:first-child]:bg-slate-200 [&>span:first-child]:cursor-pointer [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-gold-400 [&>span:first-child>span]:to-amber-500 [&>span:last-child]:h-6 [&>span:last-child]:w-6 [&>span:last-child]:border-2 [&>span:last-child]:border-gold-500 [&>span:last-child]:bg-white [&>span:last-child]:shadow-xl [&>span:last-child]:shadow-gold-500/30 [&>span:last-child]:cursor-pointer"
      />

      {/* Range Labels */}
      <div className="flex justify-between mt-4 px-1">
        <span className="text-xs font-medium text-slate-400">{min} mo</span>
        <span className="text-xs font-medium text-slate-400">{max} mo</span>
      </div>
    </div>
  );
}
