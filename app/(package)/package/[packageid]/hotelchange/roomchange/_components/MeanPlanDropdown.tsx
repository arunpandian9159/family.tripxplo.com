import React, { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { HotelMealType } from "@/app/types/hotel";

interface MealPlanSelectorProps {
  selectedMealPlan: HotelMealType;
  mealPlans: HotelMealType[];
  onSelect: (mealPlan: HotelMealType) => void;
}

const getMealPlanFullName = (mealPlan: string): string => {
  // First, try to match the full name if it's already provided
  if (mealPlan.includes("Plan")) {
    return mealPlan;
  }

  // Map abbreviated codes to full names
  const mealPlanMap: Record<string, string> = {
    CP: "Continental Plan",
    MAP: "Modified American Plan",
    AP: "American Plan",
    EP: "European Plan",
    cp: "Continental Plan",
    map: "Modified American Plan",
    ap: "American Plan",
    ep: "European Plan",
  };

  // Get the full plan name
  const fullPlanName = mealPlanMap[mealPlan] || mealPlan;

  // Map full names to user-friendly descriptions
  const userFriendlyNames: Record<string, string> = {
    "Continental Plan": "Breakfast Only",
    "Modified American Plan": "Breakfast and Dinner",
    "American Plan": "All Meals Included",
    "European Plan": "Room Only (No Meals)",
  };

  return userFriendlyNames[fullPlanName] || fullPlanName;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const MealPlanSelector: React.FC<MealPlanSelectorProps> = ({
  selectedMealPlan,
  mealPlans,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-2 justify-center items-center px-3 py-2 ml-3
    bg-gradient-to-r from-[#1EC089] to-[#1EC089] 
    hover:from-[#1EC089] hover:to-[#1EC089]
    rounded-full shadow-md hover:shadow-lg
    transform hover:scale-105 transition-all duration-300
    group"
      >
        <Pencil
          size={13}
          className="text-white group-hover:rotate-12 transition-transform duration-300"
        />
        <span className="text-white text-[11px] font-semibold tracking-wide">
          Change Plan
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 right-[-120px] mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="py-1">
              {mealPlans.map((mealPlan, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelect(mealPlan);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        selectedMealPlan.mealPlan === mealPlan.mealPlan &&
                        selectedMealPlan.totalAdultPrice ===
                          mealPlan.totalAdultPrice
                          ? "text-[#4BCDA1]"
                          : "text-gray-700"
                      }`}
                    >
                      {getMealPlanFullName(mealPlan.mealPlan)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(
                        mealPlan.totalAdultPrice + mealPlan.gstAdultPrice
                      )}
                    </p>
                  </div>
                  {selectedMealPlan.mealPlan === mealPlan.mealPlan &&
                    selectedMealPlan.totalAdultPrice ===
                      mealPlan.totalAdultPrice && (
                      <Check className="w-4 h-4 text-[#4BCDA1]" />
                    )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MealPlanSelector;
