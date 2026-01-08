"use client";

import React from "react";
import {
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Users,
  Building,
  Utensils,
  CarFront,
  IndianRupee,
  Copy,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { cn, formatIndianNumber } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

interface BookingDetailsProps {
  events: { heading: string; subHeading: string; status?: string }[];
  pack: {
    bookingId?: string;
    packageImg?: string[];
    packageName?: string;
    hotelCount?: number;
    activityCount?: number;
    vehicleCount?: number;
    startFrom?: string;
    finalPrice?: number;
    destination?: {
      destinationId: string;
      destinationName: string;
      noOfNight: number;
    }[];
    noOfNight?: number;
    noOfDays?: number;
    noAdult?: number;
    noChild?: number;
    fullStartDate?: string;
    fullEndDate?: string;
    balanceAmount?: number;
    planName?: string;
    status?: string;
  };
}

const planConfig = {
  Gold: {
    gradient: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600",
    text: "text-amber-600",
    bg: "bg-amber-50",
  },
  Silver: {
    gradient: "bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500",
    text: "text-slate-600",
    bg: "bg-slate-50",
  },
  Platinum: {
    gradient: "bg-gradient-to-r from-emerald-700 via-red-400 to-emerald-600",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

const statusConfig = {
  confirmed: {
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    bgLight: "bg-emerald-50",
  },
  failed: {
    bg: "bg-red-500",
    text: "text-red-600",
    bgLight: "bg-red-50",
  },
  pending: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    bgLight: "bg-amber-50",
  },
  waiting: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    bgLight: "bg-amber-50",
  },
};

const BookingDetails = ({ events, pack }: BookingDetailsProps) => {
  const [copied, setCopied] = useState(false);

  // Get image URL with fallback
  const imageUrl = pack?.packageImg?.[0]
    ? NEXT_PUBLIC_IMAGE_URL + pack.packageImg[0]
    : "/home.png";

  // Get total guests from booking data
  const totalAdults = pack?.noAdult || 0;
  const totalChildren = pack?.noChild || 0;

  // Filter destinations with nights
  const destinations =
    pack?.destination?.filter((dest: any) => dest.noOfNight > 0) || [];

  // Get plan config
  const plan = pack?.planName
    ? planConfig[pack.planName as keyof typeof planConfig]
    : null;

  // Get status config
  const status = pack?.status
    ? statusConfig[pack.status as keyof typeof statusConfig]
    : statusConfig.pending;

  // Copy booking ID
  const copyBookingId = async () => {
    if (pack?.bookingId) {
      await navigator.clipboard.writeText(pack.bookingId);
      setCopied(true);
      toast.success("Booking ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Booking ID Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm font-medium">
                Booking ID:
              </span>
              <span className="text-slate-900 font-semibold">
                {pack?.bookingId || "N/A"}
              </span>
            </div>
            <button
              onClick={copyBookingId}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Package Info Section */}
        <div className="p-5">
          <div className="flex gap-4">
            {/* Image */}
            <div className="relative w-28 h-24 flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                fill
                className="object-cover"
                alt={pack?.packageName || "package image"}
                unoptimized
              />
              {/* Plan Badge */}
              {pack?.planName && plan && (
                <div
                  className={cn(
                    "absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-[10px] font-bold",
                    plan.gradient
                  )}
                >
                  {pack.planName}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-900 line-clamp-2 mb-2">
                {pack?.packageName}
              </h3>

              {/* Features Row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                    <Building size={12} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-medium">
                    {pack?.hotelCount || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                    <Utensils size={12} className="text-emerald-500" />
                  </div>
                  <span className="text-xs font-medium">
                    {pack?.activityCount || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                    <CarFront size={12} className="text-amber-500" />
                  </div>
                  <span className="text-xs font-medium">
                    {pack?.vehicleCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-slate-400">Total</span>
              <div className="flex items-baseline">
                <IndianRupee className="w-4 h-4 text-slate-900" />
                <span className="text-xl font-bold text-slate-900">
                  {formatIndianNumber(pack?.finalPrice || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-5" />

        {/* Trip Details */}
        <div className="p-5 space-y-3">
          {/* Destinations */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {destinations.length > 0 ? (
                  destinations.map((dest: any, i: number) => (
                    <span
                      key={i}
                      className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full"
                    >
                      {dest.destinationName}
                      <span className="text-emerald-500 ml-1">
                        ({dest.noOfNight}N)
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    {pack?.noOfNight}N Trip
                  </span>
                )}
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pack?.noOfNight}N/{pack?.noOfDays}D
            </span>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-purple-500" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {totalAdults} Adult{totalAdults !== 1 && "s"}
              {totalChildren > 0 &&
                ` + ${totalChildren} Child${totalChildren !== 1 ? "ren" : ""}`}
            </span>
          </div>

          {/* Travel Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <CalendarDays size={16} className="text-blue-500" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {pack?.fullStartDate || "Date TBD"}
              {pack?.fullEndDate && ` - ${pack.fullEndDate}`}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-5" />

        {/* Timeline Section */}
        <div className="p-5">
          <h4 className="text-sm font-semibold text-slate-900 mb-4">
            Booking Timeline
          </h4>

          <div className="relative">
            {events.map((event: any, index: number) => {
              const isCompleted = event.status === "completed";
              const isFailed = event.status === "failed";
              const isActive = event.status === "active";
              const isLast = index === events.length - 1;

              return (
                <div key={index} className="flex gap-4">
                  {/* Timeline Line & Dot */}
                  <div className="flex flex-col items-center">
                    {/* Dot */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                        isCompleted && "bg-emerald-500",
                        isFailed && "bg-red-500",
                        isActive && "bg-amber-500 animate-pulse",
                        !isCompleted && !isFailed && !isActive && "bg-slate-200"
                      )}
                    >
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                      {isFailed && (
                        <AlertCircle className="w-4 h-4 text-white" />
                      )}
                      {isActive && (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      )}
                      {!isCompleted && !isFailed && !isActive && (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {/* Line */}
                    {!isLast && (
                      <div
                        className={cn(
                          "w-0.5 h-12 my-1",
                          isCompleted
                            ? "bg-emerald-500"
                            : isFailed
                            ? "bg-red-300"
                            : "bg-slate-200 border-l-2 border-dashed border-slate-300"
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("pb-6", isLast && "pb-0")}>
                    <h5
                      className={cn(
                        "font-semibold text-sm",
                        isCompleted && "text-emerald-600",
                        isFailed && "text-red-600",
                        isActive && "text-amber-600",
                        !isCompleted &&
                          !isFailed &&
                          !isActive &&
                          "text-slate-400"
                      )}
                    >
                      {event.heading}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {event.subHeading}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Balance Amount Alert (if applicable) */}
        {pack?.balanceAmount && pack.balanceAmount > 0 && (
          <div className="mx-5 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Balance Amount Due
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Pay before your travel date
                </p>
              </div>
              <div className="flex items-baseline">
                <IndianRupee className="w-4 h-4 text-amber-800" />
                <span className="text-xl font-bold text-amber-800">
                  {formatIndianNumber(pack.balanceAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Banner */}
      <div
        className={cn(
          "mt-4 p-4 rounded-xl flex items-center justify-center gap-3",
          status?.bgLight || "bg-slate-50"
        )}
      >
        {pack?.status === "confirmed" && (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">
              Your booking is confirmed! Have a great trip.
            </span>
          </>
        )}
        {pack?.status === "waiting" && (
          <>
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            <span className="text-sm font-semibold text-amber-700">
              Payment received. Waiting for hotel confirmation.
            </span>
          </>
        )}
        {pack?.status === "pending" && (
          <>
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">
              Payment pending. Complete payment to confirm booking.
            </span>
          </>
        )}
        {pack?.status === "failed" && (
          <>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-red-700">
              Booking failed. Please try again.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
