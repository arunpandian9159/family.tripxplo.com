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
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { cn, formatIndianNumber, formatIndianCurrency } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    noOfAdult?: number;
    noOfChild?: number;
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
    hotelMeal?: any[];
    vehicleDetail?: any[];
    activity?: any[];
    emiDetails?: {
      totalTenure: number;
      monthlyAmount: number;
      totalAmount: number;
      paidCount: number;
      nextDueDate: string;
      schedule: {
        installmentNumber: number;
        dueDate: string;
        amount: number;
        status: string;
      }[];
    };
  };
}

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
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Get image URL with fallback
  const imageUrl = pack?.packageImg?.[0]
    ? NEXT_PUBLIC_IMAGE_URL + pack.packageImg[0]
    : "/home.png";

  // Get total guests from booking data
  const totalAdults = pack?.noOfAdult || pack?.noAdult || 0;
  const totalChildren = pack?.noOfChild || pack?.noChild || 0;

  // Get counts - try multiple field names
  const hotelCount = pack?.hotelCount || pack?.hotels?.length || 0;
  const activityCount = pack?.activityCount || pack?.activities?.length || 0;
  const vehicleCount = pack?.vehicleCount || pack?.vehicles?.length || 0;

  // EMI calculations
  const hasEmi = pack?.emiMonths && pack.emiMonths > 0;
  const emiMonths = pack?.emiMonths || 6;
  const emiAmount = pack?.emiAmount || 0;
  const totalEmiAmount = pack?.totalEmiAmount || pack?.finalPrice || 0;
  const paidEmis = pack?.paidEmis || pack?.currentEmiNumber || 1;
  const remainingEmis = emiMonths - paidEmis;

  const status = pack?.status
    ? statusConfig[pack.status as keyof typeof statusConfig]
    : statusConfig.pending;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Receipt Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative">
        {/* Status Header */}
        <div className="px-8 py-5 bg-emerald-50/50 border-b border-emerald-100/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em]">
              Transaction Confirmed
            </span>
          </div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Main Info Section */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-full md:w-40 h-40 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 flex-shrink-0">
              <Image
                src={imageUrl}
                fill
                className="object-cover"
                alt={pack?.packageName || "package"}
                unoptimized
              />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                {pack?.packageName}
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CalendarDays size={14} className="text-gold-500" />
                  {pack?.noOfNight}N / {pack?.noOfDays}D
                </span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Users size={14} className="text-gold-500" />
                  {totalAdults} Adult{totalAdults > 1 ? "s" : ""}
                  {totalChildren > 0 &&
                    ` & ${totalChildren} Child${
                      totalChildren > 1 ? "ren" : ""
                    }`}
                </span>
              </div>
              <div className="flex items-center gap-8 pt-4 border-t border-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100/30">
                    <Building size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">
                      Hotels
                    </p>
                    <p className="text-base font-black text-slate-900 tracking-tighter">
                      {hotelCount.toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/30">
                    <Sparkles size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">
                      Activities
                    </p>
                    <p className="text-base font-black text-slate-900 tracking-tighter">
                      {activityCount.toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100/30">
                    <CarFront size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">
                      Cabs
                    </p>
                    <p className="text-base font-black text-slate-900 tracking-tighter">
                      {vehicleCount.toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="pt-8 border-t border-slate-50 space-y-4">
            <div className="flex justify-between items-center px-4">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Package Value
              </span>
              <span className="text-slate-900 text-lg font-black tracking-tighter">
                {formatIndianCurrency(pack?.finalPrice || 0)}
              </span>
            </div>

            {hasEmi ? (
              <div className="p-6 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-gold-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      Prepaid EMI Active
                    </p>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                      {formatIndianCurrency(emiAmount)}{" "}
                      <span className="text-slate-500 text-sm font-bold">
                        /mo
                      </span>
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      1st Installment of {formatIndianCurrency(emiAmount)} Paid
                      Today
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-right min-w-[120px]">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
                      Tenure
                    </p>
                    <p className="text-white font-black">{emiMonths} Months</p>
                    <div className="h-px bg-white/10 my-2" />
                    <p className="text-gold-400 text-[9px] font-black uppercase tracking-widest">
                      {remainingEmis} Remaining
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-emerald-500 rounded-[2.5rem] text-center shadow-xl shadow-emerald-500/10">
                <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">
                  Full Payment Received
                </p>
                <h2 className="text-3xl font-black text-white tracking-tighter">
                  {formatIndianCurrency(pack?.finalPrice || 0)}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dates Alert */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-6 group">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-amber-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-gold-500/20 group-hover:rotate-6 transition-transform">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Your Trip Starts On
            </p>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">
              {pack?.fullStartDate || "Date TBD"}
            </h4>
          </div>
        </div>
        <button
          onClick={() => router.push("/mybookings")}
          className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors shadow-black/10"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default BookingDetails;
