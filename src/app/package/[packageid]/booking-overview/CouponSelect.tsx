'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import toast from 'react-hot-toast';

interface CouponSelectProps {
  setCoupon: React.Dispatch<React.SetStateAction<string | null>>;
  setShowAllCoupons?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCoupon: string;
  couponCode: string;
  couponId: string;
  couponName: string;
  couponDescription: string;
  couponValueType: string;
  couponValue: number;
  couponValidateDate: string;
  applyCoupon: (btn: any) => Promise<void>;
  closeAlert?: () => void;
}

const CouponSelect: React.FC<CouponSelectProps> = ({
  selectedCoupon,
  couponCode,
  setShowAllCoupons,
  couponId,
  couponName,
  couponDescription,
  couponValueType,
  couponValue,
  couponValidateDate,
  setCoupon,
  applyCoupon,
  closeAlert,
}) => {
  const handleApplyCoupon = async (id: string) => {
    setShowAllCoupons?.(false);
    setCoupon(id);
    await applyCoupon(id);
    // setTimeout(() => {
    // //   console.log("close");
    //   closeAlert();
    // }, 800);
    closeAlert?.();
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
  };

  const isSelected = selectedCoupon === couponId;

  const discountDisplay =
    couponValueType === 'percentage' ? `${couponValue}% discount` : `₹${couponValue} discount`;

  return (
    <div
      className={cn(
        'border-2 border-dotted w-full p-4 rounded-lg flex items-center max-h-64',
        isSelected && 'border-[#FF7865]'
      )}
    >
      <div className="flex justify-between w-full">
        <div className="flex flex-col space-y-2">
          <h1 className="font-semibold text-[#FF7865]">{couponName.toUpperCase()}</h1>
          <h1 className="text-xs text-muted-foreground w-4/5">
            {couponDescription ? (
              couponDescription
            ) : (
              <span>
                Use the code {couponName.toUpperCase()} at checkout to receive a {discountDisplay}.
              </span>
            )}
          </h1>
        </div>
        <div className="flex space-x-2">
          {isSelected ? (
            <button
              className="text-xs font-semibold text-red-500 rounded-lg"
              onClick={handleRemoveCoupon}
            >
              Remove
            </button>
          ) : (
            <button
              className="text-xs font-semibold text-[#FF7865] rounded-lg"
              onClick={() => handleApplyCoupon(couponCode)}
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponSelect;
