"use client";

import { setPkgCategory } from "@/app/store/features/pkgCategorySlice";
import { useAppSelector } from "@/app/store/store";
import { cn } from "@/lib/utils";
import React from "react";
import { useDispatch } from "react-redux";

interface PackageCategoryListProps {
  label: string;
}

const PackageCategoryList: React.FC<PackageCategoryListProps> = ({ label }) => {
  const dispatch = useDispatch();
  const category = useAppSelector((state) => state.pkgCategory.pkgCategory);

  const handleCategoryChange = (label: string) => {
    dispatch(setPkgCategory(label));
  };

  return (
    <div
      onClick={() => dispatch(setPkgCategory(label))}
      className={cn(
        "  border-[#909BA8] border-solid border rounded-[8px] p-2  text-[#909BA8]",
        category === label &&
          "text-[#1EC089] bg-white border-[2px] border-solid border-[#27B182] ",
      )}
      style={{ boxShadow: "2px 4px 14.3px 0px rgba(30, 192, 137, 0.19)" }}
    >
      <div className="">
        {category !== null && (
          <h1 className="text-[9px] font-Poppins not-italic font-semibold leading-normal tracking-[0.1px]">
            {label} <span className="hidden">{category}</span>
          </h1>
        )}
      </div>
    </div>
  );
};

export default PackageCategoryList;
