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
    (state) => state.filterCategory.filterCategory,
  );

  return (
    <div className="">
      <div
        onClick={() => dispatch(setFilterCategory(label))}
        className={cn(
          "border  text-[#AFAFAF] bg-[FFF] font-Poppins font-medium not-italic leading-normal tracking-[0.8px] stroke-[#AFAFAF] stroke-2 rounded-[8px] p-2 mr-2",
          category === label &&
            "bg-[#FFF] stroke-[#27B182] border border-[#27B182] text-[#1EC089] filter drop-shadow",
        )}
        style={{
          filter: "drop-shadow(2px 4px 14.3px rgba(30, 192, 137, 0.17))",
        }}
      >
        <div className="">
          {category !== null && (
            <div className=" flex text-[11px]  p-[2px] ">
              {label}
              <div className="hidden">{category}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCategoryList;
