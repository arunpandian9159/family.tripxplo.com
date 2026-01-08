"use client";
import React from "react";
import { X, AlertCircle } from "lucide-react";
import { Exclusion } from "@/app/types/pack";

const Exclusions = ({ exclusions }: { exclusions: Exclusion[] }) => {
  if (!exclusions || !Array.isArray(exclusions) || exclusions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex p-3 bg-slate-100 rounded-full mb-3">
          <X size={20} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-400">No exclusions listed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exclusions.map((exc, i) => {
        if (!exc || typeof exc !== "object") return null;
        const name = exc?.name || "Exclusion";

        return (
          <div
            key={exc?._id || i}
            className="group flex items-start gap-3 p-3 bg-gradient-to-br from-emerald-50 to-red-50 rounded-xl border border-emerald-300 hover:shadow-sm hover:border-emerald-400 transition-all duration-300"
          >
            <div className="flex-shrink-0 p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
              <X size={14} className="text-emerald-700" />
            </div>
            <span className="text-sm text-emerald-900 font-medium leading-relaxed">
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Exclusions;
