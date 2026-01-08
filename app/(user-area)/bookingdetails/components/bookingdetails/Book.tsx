"use client";

import React from "react";
import {
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { formatIndianNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BookingData {
  bookingId?: string;
  finalPrice?: number;
  balanceAmount?: number;
  perPerson?: number;
  status?: string;
  isPrepaid?: boolean;
}

interface BookProps {
  booking?: BookingData;
}

export default function Book({ booking }: BookProps) {
  const router = useRouter();

  // Show balance amount if there's still amount due, otherwise show final price
  const displayPrice =
    booking?.balanceAmount && booking.balanceAmount > 0
      ? booking.balanceAmount
      : booking?.finalPrice || 0;

  const isPaid = booking?.isPrepaid || booking?.balanceAmount === 0;
  const isConfirmed = booking?.status === "confirmed";

  const handleClick = () => {
    if (isPaid || isConfirmed) {
      // Navigate to my bookings
      router.push(`/mybookings`);
    } else {
      // Navigate to payment page
      console.log("Proceed to payment for booking:", booking?.bookingId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
      <div className="section-container">
        <div className="flex items-center justify-between py-4">
          {/* Price Section */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <IndianRupee
                className="w-5 h-5 text-slate-900"
                strokeWidth={2.5}
              />
              <span className="text-2xl font-bold text-slate-900">
                {formatIndianNumber(displayPrice)}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {isPaid || isConfirmed
                ? "Fully Paid"
                : booking?.balanceAmount && booking.balanceAmount > 0
                  ? "Balance Due"
                  : "Total Amount"}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClick}
            className={cn(
              "px-6 py-3 font-semibold rounded-xl transition-all flex items-center gap-2 active:scale-[0.98]",
              isPaid || isConfirmed
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30"
                : "bg-gradient-to-r from-coral-500 to-coral-400 text-white shadow-md shadow-coral-500/20 hover:shadow-lg hover:shadow-coral-500/30",
            )}
          >
            {isPaid || isConfirmed ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                View Bookings
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay Now
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
