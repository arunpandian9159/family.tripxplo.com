import React, { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { HotelMealType } from '@/app/types/hotel';

interface MealPlanSelectorProps {
  selectedMealPlan: HotelMealType;
  mealPlans: HotelMealType[];
  onSelect: (mealPlan: HotelMealType) => void;
}

const getMealPlanFullName = (mealPlan: string): string => {
  // First, try to match the full name if it's already provided
  if (mealPlan.includes('Plan')) {
    return mealPlan;
  }

  // Map abbreviated codes to full names
  const mealPlanMap: Record<string, string> = {
    CP: 'Continental Plan',
    MAP: 'Modified American Plan',
    AP: 'American Plan',
    EP: 'European Plan',
    cp: 'Continental Plan',
    map: 'Modified American Plan',
    ap: 'American Plan',
    ep: 'European Plan',
  };

  // Get the full plan name
  const fullPlanName = mealPlanMap[mealPlan] || mealPlan;

  // Map full names to user-friendly descriptions
  const userFriendlyNames: Record<string, string> = {
    'Continental Plan': 'Breakfast Only',
    'Modified American Plan': 'Breakfast and Dinner',
    'American Plan': 'All Meals Included',
    'European Plan': 'Room Only (No Meals)',
  };

  return userFriendlyNames[fullPlanName] || fullPlanName;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
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
      {/* bg-linear-to-r from-[#FF5F5F] to-[#FF7865] hover:from-[#FF7865] hover:to-[#FF5F5F]  transform hover:scale-105 transition-all duration-300
    group */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // style={{ background: "rgba(106, 119, 139, 0.12)" }}
        className={`flex gap-1 items-center justify-center ${
          isOpen ? 'bg-[#ff5f5f]  shadow-md' : 'bg-[#6A778B1F] '
        } items-center  ml-2 p-1 py-2
  
    
    rounded-[10px] hover:shadow-sm
    `}
      >
        <Pencil
          size={13}
          className={`${
            isOpen ? 'text-white' : 'text-[#667386]'
          }  group-hover:rotate-12 transition-transform duration-300`}
        />
        <span
          className={`${
            isOpen ? 'text-white font-bold text-[11px]' : 'text-[#667386] text-[9px]'
          } tracking-wide`}
        >
          Change Plan
        </span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10 " onClick={() => setIsOpen(false)} />
          <div
            style={{ boxShadow: ' var(--Gray-5, #E0E0E0)' }}
            className="absolute border-[#FF5F5F] z-20 -right-7 md:-right-32   mt-1 w-56 md:w-80  bg-white border rounded-[12px] shadow-lg "
          >
            <div className="py-1">
              {mealPlans.map((mealPlan, index) => (
                <>
                  {' '}
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
                          selectedMealPlan.totalAdultPrice === mealPlan.totalAdultPrice
                            ? 'text-[#FF5F5F]'
                            : 'text-[#5D6670]'
                        }`}
                      >
                        {getMealPlanFullName(mealPlan.mealPlan)}
                      </p>
                      {/* <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(
                        mealPlan.totalAdultPrice + mealPlan.gstAdultPrice
                      )}
                    </p> */}
                    </div>
                    {selectedMealPlan.mealPlan === mealPlan.mealPlan &&
                      selectedMealPlan.totalAdultPrice === mealPlan.totalAdultPrice && (
                        <Check className="w-4 h-4  text-[#FF5F5F]" />
                      )}
                  </button>
                  {index != mealPlans.length - 1 && (
                    <>
                      <hr className="text-[#E4E5E7] flex mx-3 " />
                    </>
                  )}
                </>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MealPlanSelector;
