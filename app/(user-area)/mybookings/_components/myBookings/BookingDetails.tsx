"use client";

import {
  Building,
  Utensils,
  CarFront,
  IndianRupee,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  ArrowRight,
  AlertCircle,
  Loader2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";
import { cn, formatIndianNumber } from "@/lib/utils";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface Destination {
  destinationId: string;
  destinationName: string;
  noOfNight: number;
}

interface BookingProps {
  bookingId: string;
  packageName: string;
  packageImg: string[];
  planName?: string;
  noOfNight: number;
  noOfDays: number;
  destination?: Destination[];
  hotelCount?: number;
  activityCount?: number;
  vehicleCount?: number;
  finalPrice: number;
  fullStartDate?: string;
  fullEndDate?: string;
  status: string;
  emiDetails?: {
    totalTenure: number;
    monthlyAmount: number;
    schedule: {
      installmentNumber: number;
      amount: number;
      status: string;
      dueDate: string;
    }[];
  };
}

const statusConfig = {
  confirmed: {
    bg: "bg-gold-500",
    bgLight: "bg-gold-50",
    text: "text-gold-600",
    border: "border-gold-200",
    icon: Check,
    label: "Confirmed",
    message: "Your booking is confirmed",
    animate: false,
  },
  waiting: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: Loader2,
    label: "Waiting",
    message: "Payment success - Hotel confirmation pending",
    animate: true,
  },
  failed: {
    bg: "bg-red-500",
    bgLight: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: AlertCircle,
    label: "Failed",
    message: "Booking failed - Please try again",
    animate: false,
  },
  pending: {
    bg: "bg-slate-400",
    bgLight: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: Clock,
    label: "Pending",
    message: "Payment pending",
    animate: false,
  },
};

const planConfig = {
  Gold: {
    gradient: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600",
    ring: "ring-amber-400/50",
    shadow: "shadow-amber-500/20",
  },
  Silver: {
    gradient: "bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500",
    ring: "ring-slate-400/50",
    shadow: "shadow-slate-500/20",
  },
  Platinum: {
    gradient: "bg-gradient-to-r from-red-700 via-red-400 to-red-600",
    ring: "ring-red-600/50",
    shadow: "shadow-red-700/20",
  },
};

export default function BookingDetails({ pkg }: { pkg: BookingProps }) {
  const router = useRouter();

  function pushPath(bookId: string) {
    router.push("/bookingdetails/" + bookId);
  }

  // Get image URL with fallback
  const imageUrl = pkg?.packageImg?.[0]
    ? NEXT_PUBLIC_IMAGE_URL + pkg.packageImg[0]
    : "/home.png";

  // Format destinations for display
  const destinations = pkg?.destination || [];

  // Get status configuration
  const status =
    statusConfig[pkg?.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;

  // Get plan configuration
  const plan = pkg?.planName
    ? planConfig[pkg.planName as keyof typeof planConfig]
    : null;

  const emiSchedule = pkg?.emiDetails?.schedule || [];
  const nextPendingEmi = emiSchedule.find((s: any) => s.status === "pending");
  const emiAmount = pkg?.emiDetails?.monthlyAmount || 0;
  const hasEmi = emiSchedule.length > 0;

  const handlePayEmi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nextPendingEmi) {
      toast.error("No pending EMI found");
      return;
    }

    try {
      const { paymentApi } = await import("@/lib/api-client");
      const res = await paymentApi.payEmi({
        bookingId: pkg.bookingId,
        installmentNumber: nextPendingEmi.installmentNumber,
      });

      if (res.success && res.data && (res.data as any).paymentUrl) {
        window.location.href = (res.data as any).paymentUrl;
      } else {
        toast.error(res.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      onClick={() => pushPath(pkg?.bookingId)}
      className={cn(
        "group bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        plan ? `ring-2 ${plan.ring}` : "border-slate-100 hover:border-slate-200"
      )}
    >
      {/* Main Content */}
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            fill
            alt={pkg?.packageName || "Package"}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          {/* Plan Badge */}
          {pkg?.planName && plan && (
            <div
              className={cn(
                "absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg",
                plan.gradient,
                plan.shadow
              )}
            >
              {pkg.planName}
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-auto sm:top-3 sm:right-3 sm:left-auto">
            <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
              <Clock className="w-3.5 h-3.5" />
              {pkg?.noOfNight || 0}N / {pkg?.noOfDays || 0}D
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {/* Title & Status Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-gold-500 transition-colors flex-1">
              {pkg?.packageName || "Package"}
            </h3>

            {/* Status Badge */}
            <span
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
                status.bg
              )}
            >
              <StatusIcon
                className={cn("w-3.5 h-3.5", status.animate && "animate-spin")}
              />
              {status.label}
            </span>
          </div>

          {/* Destinations */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
            {destinations.length > 0 ? (
              <>
                {destinations.slice(0, 3).map((dest, index) => (
                  <span
                    key={index}
                    className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-full"
                  >
                    {dest.destinationName}
                    {dest.noOfNight > 0 && (
                      <span className="text-slate-400 ml-1">
                        ({dest.noOfNight}N)
                      </span>
                    )}
                  </span>
                ))}
                {destinations.length > 3 && (
                  <span className="text-xs text-slate-400">
                    +{destinations.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-slate-500">
                {pkg?.noOfNight || 0} Nights Trip
              </span>
            )}
          </div>

          {/* Features Row */}
          <div className="flex items-center gap-4 py-3 border-t border-slate-100 mb-4">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building size={16} className="text-blue-500" />
              </div>
              <span className="text-xs font-medium">
                {pkg?.hotelCount || 0} Hotels
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Utensils size={16} className="text-emerald-500" />
              </div>
              <span className="text-xs font-medium">
                {pkg?.activityCount || 0} Activities
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <CarFront size={16} className="text-amber-500" />
              </div>
              <span className="text-xs font-medium">
                {pkg?.vehicleCount || 0} Cabs
              </span>
            </div>
          </div>

          {/* Price & Date Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="flex flex-col gap-1">
              {/* Travel Date */}
              <div className="flex items-center gap-1.5 text-slate-500 px-1">
                <CalendarDays className="w-4 h-4 text-gold-400" />
                <span className="text-[11px] font-bold uppercase tracking-tight">
                  {pkg?.fullStartDate || "Date TBD"}
                </span>
              </div>

              {/* Price */}
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none ml-1">
                  Total Amount
                </span>
                <div className="flex items-baseline gap-0.5">
                  <IndianRupee
                    className="w-4 h-4 text-slate-900"
                    strokeWidth={2.5}
                  />
                  <span className="text-xl font-bold text-slate-900">
                    {formatIndianNumber(pkg?.finalPrice || 0)}
                  </span>
                </div>
              </div>
            </div>

            {hasEmi && (
              <div className="flex flex-col items-center px-4 mt-8 border-l border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">
                  Current Monthly
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">
                    {formatIndianNumber(emiAmount)}
                  </span>
                  <button
                    onClick={handlePayEmi}
                    className="px-3 py-1 bg-emerald-500 text-white text-[12px] font-black uppercase rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pushPath(pkg?.bookingId);
                }}
                className="px-5 py-2.5 gold-gradient text-white text-[10px] font-black uppercase rounded-xl hover:opacity-90 transition-all shadow-md shadow-gold-500/20 hover:shadow-lg hover:shadow-gold-500/30 active:scale-[0.98] flex items-center gap-1.5"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message Bar */}
      <div
        className={cn(
          "px-4 sm:px-5 py-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-tight",
          status.bgLight,
          status.text,
          "border-t",
          status.border
        )}
      >
        <StatusIcon
          className={cn("w-4 h-4", status.animate && "animate-spin")}
        />
        {status.message}
      </div>
    </div>
  );
}
