"use client";
import { useState } from "react";
import { Search, Star, ArrowUpDown, X } from "lucide-react";

interface FilterHotelProps {
  hotelCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "rating" | "price_low" | "price_high" | null;
  onSortChange: (sort: "rating" | "price_low" | "price_high" | null) => void;
}

const FilterHotel = ({
  hotelCount,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: FilterHotelProps) => {
  const sortOptions = [
    { key: "rating" as const, label: "Top Rated", icon: Star },
    { key: "price_low" as const, label: "Price: Low", icon: ArrowUpDown },
    { key: "price_high" as const, label: "Price: High", icon: ArrowUpDown },
  ];

  return (
    <div className="px-4 lg:px-10 mb-4">
      {/* Header */}
      <h1 className="text-slate-700 text-center font-semibold text-lg lg:text-2xl mb-4">
        Select from {hotelCount} available hotels
      </h1>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2 justify-center">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = sortBy === option.key;
            return (
              <button
                key={option.key}
                onClick={() => onSortChange(isActive ? null : option.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon size={14} className={isActive ? "fill-current" : ""} />
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">
                  {option.key === "rating"
                    ? "★"
                    : option.key === "price_low"
                      ? "↓₹"
                      : "↑₹"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterHotel;
