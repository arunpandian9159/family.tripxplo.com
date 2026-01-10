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
  Copy,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  Wallet,
  Sparkles,
  CreditCard,
  Receipt,
} from "lucide-react";
import Image from "next/image";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { cn, formatIndianNumber, formatIndianCurrency } from "@/lib/utils";
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
    // Alternative field names from API
    hotels?: any[];
    activities?: any[];
    vehicles?: any[];
    startFrom?: string;
    finalPrice?: number;
    totalPackagePrice?: number;
    destination?: {
      destinationId?: string;
      destinationName?: string;
      name?: string;
      noOfNight?: number;
      nights?: number;
    }[];
    destinations?: {
      destinationId?: string;
      destinationName?: string;
      name?: string;
      noOfNight?: number;
      nights?: number;
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
    // EMI fields
    emiMonths?: number;
    emiAmount?: number;
    totalEmiAmount?: number;
    currentEmiNumber?: number;
    paidEmis?: number;
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

  // Get counts - try multiple field names
  const hotelCount = pack?.hotelCount || pack?.hotels?.length || 0;
  const activityCount = pack?.activityCount || pack?.activities?.length || 0;
  const vehicleCount = pack?.vehicleCount || pack?.vehicles?.length || 0;

  // Get destinations - try multiple field structures
  const rawDestinations = pack?.destination || pack?.destinations || [];
  const destinations = rawDestinations
    .map((dest: any) => ({
      name: dest?.destinationName || dest?.name || "",
      nights: dest?.noOfNight || dest?.nights || 0,
    }))
    .filter((dest: any) => dest.nights > 0 && dest.name);

  // Get plan config
  const plan = pack?.planName
    ? planConfig[pack.planName as keyof typeof planConfig]
    : null;

  // Get status config
  const status = pack?.status
    ? statusConfig[pack.status as keyof typeof statusConfig]
    : statusConfig.pending;

  // EMI calculations
  const hasEmi = pack?.emiMonths && pack.emiMonths > 0;
  const emiMonths = pack?.emiMonths || 6;
  const emiAmount = pack?.emiAmount || 0;
  const totalEmiAmount = pack?.totalEmiAmount || pack?.finalPrice || 0;
  const paidEmis = pack?.paidEmis || pack?.currentEmiNumber || 1;
  const remainingEmis = emiMonths - paidEmis;

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
      {/* Receipt Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden relative">
        {/* Ticket Perforation Effect */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full border-r-2 border-slate-100 -translate-y-1/2" />
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full border-l-2 border-slate-100 -translate-y-1/2" />

        {/* Status Header */}
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-700 font-bold text-sm uppercase tracking-wider">
              Payment Successful
            </span>
          </div>
          <span className="text-slate-400 text-xs font-medium">
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Main Info */}
        <div className="p-6">
          <div className="flex gap-6 mb-8">
            <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={imageUrl}
                fill
                className="object-cover"
                alt={pack?.packageName || "package image"}
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                {pack?.packageName}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-blue-500" />
                  {pack?.noOfNight}N / {pack?.noOfDays}D
                </span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold flex items-center gap-1.5">
                  <Users size={14} className="text-purple-500" />
                  {totalAdults} Adults
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Package Total</span>
              <span className="text-slate-900 font-bold">
                {formatIndianCurrency(pack?.totalPackagePrice || 0)}
              </span>
            </div>

            {hasEmi ? (
              <div className="p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gold-400 text-xs font-bold uppercase">
                      Prepaid EMI Plan
                    </span>
                    <span className="text-gold-400 text-xs font-bold uppercase">
                      {emiMonths} Months
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {formatIndianCurrency(emiAmount)}
                        <span className="text-slate-400 text-sm font-normal ml-1">
                          /month
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        First installment of {formatIndianCurrency(emiAmount)}{" "}
                        paid today
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Remaining</p>
                      <p className="text-sm font-bold text-white">
                        {remainingEmis} EMIs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center py-2 px-4 bg-emerald-50 rounded-xl">
                <span className="text-emerald-700 font-semibold">
                  Amount Paid
                </span>
                <span className="text-emerald-700 font-extrabold text-xl">
                  {formatIndianCurrency(pack?.finalPrice || 0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="px-6 pb-8">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Confirmed Inclusions
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <Building size={18} className="text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  {hotelCount} Hotels
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <Utensils size={18} className="text-emerald-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  {activityCount} Activities
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <CarFront size={18} className="text-amber-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  {vehicleCount} Cabs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed Dates Alert */}
      <div className="mt-6 flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <CalendarDays className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Trip Starts On
          </p>
          <p className="text-sm font-extrabold text-slate-800">
            {pack?.fullStartDate || "Date TBD"}
          </p>
        </div>
        <div className="ml-auto">
          <button className="p-2 hover:bg-slate-50 rounded-lg text-gold-500">
            <Sparkles size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
