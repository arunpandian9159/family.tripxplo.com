'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface FilterCategoryListProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterCategoryList = ({ label, isActive, onClick }: FilterCategoryListProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
        isActive
          ? 'bg-[#15ab8b] text-white shadow-md shadow-emerald-500/20'
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
      )}
    >
      {label}
    </button>
  );
};

export default FilterCategoryList;
