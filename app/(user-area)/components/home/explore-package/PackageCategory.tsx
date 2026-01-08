"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";

import { setPkgCategory } from "@/app/store/features/pkgCategorySlice";
import { useAppSelector } from "@/app/store/store";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api-client";

interface Category {
  id: string;
  categoryName: string;
  image: string;
}

const PackageCategory = () => {
  const dispatch = useDispatch();
  const { pkgCategory } = useAppSelector((state) => state.pkgCategory);

  const [packageData, setPackageData] = useState<Category[]>([]);
  const [pack, setPack] = useState("Trending");

  async function fetchData() {
    try {
      const response = await apiRequest<Category[]>("packages/categories");

      if (response.success && response.data) {
        setPackageData(response.data);
      } else if ((response as any).result) {
        // Fallback for backward compatibility
        setPackageData((response as any).result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    dispatch(setPkgCategory(categoryName));
  };

  return (
    <div className="flex py-3 space-x-5 overflow-x-auto px-2">
      {packageData.map((cat: Category) => (
        <div key={cat.id}>
          <div
            onClick={() => handleCategoryClick(cat.categoryName)}
            className={cn(
              "cursor-pointer flex items-center space-x-3 whitespace-nowrap rounded-lg px-3 py-2 border transition shadow-sm hover:text-[#1EC089] hover:bg-neutral-50",
              cat.categoryName === pkgCategory &&
                "ring-1 ring-[#1EC089] text-[#1EC089] shadow-sm",
            )}
          >
            <div className="relative w-4 h-4">
              <Image
                fill
                className="object-cover"
                alt={cat.categoryName}
                src={`https://tripemilestone.in-maa-1.linodeobjects.com/${cat.image}`}
              />
            </div>
            <h1 className="text-[14px] cursor-pointer">{cat.categoryName}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageCategory;
