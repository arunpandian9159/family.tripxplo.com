"use client";

import { setFilterCategory } from "@/app/store/features/filterCategorySlice";
import { useAppSelector } from "@/app/store/store";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

interface FilterCategoryListProps {
  label: string;
}
const FilterCategoryList = ({ label }: FilterCategoryListProps) => {
  const dispatch = useDispatch();
  const category = useAppSelector(
    (state) => state.filterCategory.filterCategory
  );

  useEffect(() => {
    // Ideally this shouldn't be here as it resets on every mount of every item,
    // but if it's meant to set default, it should be in the parent.
    // I will leave it for now but it might cause issues if many items mount.
    // Actually, I'll comment it out or it will reset constantly.
    // If "All Packages" is default, it should be set in initial state or parent.
    // dispatch(setFilterCategory("All Packages"));
  }, [dispatch]);

  return (
    <button
      onClick={() => dispatch(setFilterCategory(label))}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap",
        category === label
          ? "bg-gold-50 border-gold-200 text-gold-700 shadow-sm"
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
      )}
    >
      {label}
    </button>
  );
};

export default FilterCategoryList;
