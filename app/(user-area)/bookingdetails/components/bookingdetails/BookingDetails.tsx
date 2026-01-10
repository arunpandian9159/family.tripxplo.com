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

  // EMI schedule from pack
  const emiSchedule = pack?.emiDetails?.schedule || [];
  const nextPendingEmi = emiSchedule.find((s: any) => s.status === "pending");

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRIMARY MANAGEMENT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Package Card */}
          <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="relative w-full md:w-64 h-56 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200">
                   <Image src={imageUrl} fill className="object-cover transition-transform hover:scale-105 duration-700" alt={pack?.packageName || "package"} unoptimized />
                   <div className={cn("absolute top-4 left-4 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md", status?.bg)}>
                      {pack?.status}
                   </div>
                </div>

                <div className="flex-1 py-4 pr-4">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tight">
                            {pack?.packageName}
                         </h3>
                         <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gold-500" />
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{pack?.startFrom || "Location TBD"}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-50">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                         <p className="text-lg font-bold text-slate-800">{pack?.noOfNight}N/{pack?.noOfDays}D</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Guests</p>
                         <p className="text-lg font-bold text-slate-800">{totalAdults} Adult{totalAdults > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking ID</p>
                         <div className="flex items-center gap-2 cursor-pointer group" onClick={copyBookingId}>
                            <p className="text-lg font-bold text-gold-600 group-hover:underline">{pack?.bookingId?.slice(0, 8)}</p>
                            <Copy size={12} className="text-slate-300 group-hover:text-gold-500" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* EMI Management Hub */}
          {hasEmi && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-gold-50/20">
                  <div>
                     <h4 className="text-xl font-black text-slate-900 tracking-tight">Financial Timeline</h4>
                     <p className="text-sm text-slate-500 font-medium">Monthly prepaid installments schedule</p>
                  </div>
                  <div className="px-4 py-2 bg-slate-900 rounded-2xl text-white">
                     <span className="text-xs font-black uppercase tracking-tighter">{paidEmis} / {emiMonths} Settled</span>
                  </div>
               </div>
               
               <div className="p-0">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/30">
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Installment</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {emiSchedule.map((item: any, i: number) => (
                             <tr key={i} className={cn("group transition-colors hover:bg-slate-50/50", item.status === 'pending' && "bg-amber-50/10")}>
                                <td className="px-8 py-6 text-sm font-black text-slate-300 group-hover:text-slate-900">{item.installmentNumber.toString().padStart(2, '0')}</td>
                                <td className="px-8 py-6 text-sm font-bold text-slate-600">
                                   {new Date(item.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-8 py-6 text-sm font-black text-slate-900">{formatIndianCurrency(item.amount)}</td>
                                <td className="px-8 py-6 text-center">
                                   <span className={cn(
                                     "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                     item.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                     item.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                     "bg-red-50 text-red-600 border-red-100"
                                   )}>
                                      {item.status === 'paid' ? <CheckCircle2 size={10}/> : <Clock size={10}/>}
                                      {item.status}
                                   </span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {nextPendingEmi && (
                 <div className="m-8 p-6 bg-slate-900 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-400">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                          <Wallet className="text-gold-400" size={24}/>
                       </div>
                       <div>
                          <p className="text-white font-black text-lg">Next EMI # {nextPendingEmi.installmentNumber}</p>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Due on {new Date(nextPendingEmi.dueDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <button className="w-full sm:w-auto px-10 py-4 gold-gradient text-white text-sm font-black rounded-2xl shadow-xl shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                       Pay {formatIndianCurrency(nextPendingEmi.amount)}
                    </button>
                 </div>
               )}
            </div>
          )}

          {/* Booking Progress */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
             <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Sparkles size={20} className="text-gold-500" />
                Trip Lifecycle
             </h4>
             <div className="relative pl-6">
                {events.map((event: any, index: number) => (
                  <div key={index} className="flex gap-6 pb-12 relative group last:pb-0">
                     {!(index === events.length - 1) && (
                       <div className={cn("absolute left-[11px] top-8 w-[2px] h-full transition-all duration-500", 
                          event.status === 'completed' ? "bg-gold-500" : "bg-slate-100")}/>
                     )}
                     <div className={cn("relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-md transition-all duration-500", 
                        event.status === 'completed' ? "bg-gold-500 scale-125 shadow-gold-500/30" : "bg-slate-200")}>
                        {event.status === 'completed' && <Check size={10} className="text-white"/>}
                     </div>
                     <div className="pt-0.5">
                        <h5 className={cn("text-sm font-black tracking-tight", event.status === 'completed' ? "text-slate-900" : "text-slate-400")}>
                           {event.heading}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{event.subHeading}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY SIDEBAR */}
        <div className="space-y-8">
           
           {/* Price Breakdown Sidebar */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm sticky top-8">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pricing Summary</h4>
              
              <div className="space-y-5">
                 <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                    <span className="text-slate-500 text-sm font-bold">Package Value</span>
                    <span className="text-slate-900 font-black tracking-tight">{formatIndianCurrency(pack?.totalPackagePrice || 0)}</span>
                 </div>

                 {hasEmi ? (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-4">
                         <span className="text-slate-500 text-xs font-bold uppercase">Total EMI Paid</span>
                         <span className="text-emerald-600 font-black">{formatIndianCurrency(paidEmis * emiAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center px-4">
                         <span className="text-slate-500 text-xs font-bold uppercase">Balance Pay</span>
                         <span className="text-gold-600 font-black">{formatIndianCurrency(totalEmiAmount - (paidEmis * emiAmount))}</span>
                      </div>
                      <div className="h-px bg-slate-50 my-4" />
                      <div className="p-5 bg-slate-900 rounded-[2rem] text-center shadow-xl shadow-slate-200 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full blur-xl group-hover:bg-gold-500/20 transition-all" />
                         <p className="text-gold-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Monthly</p>
                         <h2 className="text-3xl font-black text-white tracking-tighter">{formatIndianCurrency(emiAmount)}</h2>
                      </div>
                   </div>
                 ) : (
                   <div className="p-5 bg-emerald-500 rounded-[2rem] text-center text-white shadow-xl shadow-emerald-200">
                      <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">Full Amount Paid</p>
                      <h2 className="text-3xl font-black tracking-tighter">{formatIndianCurrency(pack?.finalPrice || 0)}</h2>
                   </div>
                 )}
              </div>

              {/* Inclusions Detail */}
              <div className="mt-10 border-t border-slate-50 pt-8">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Confirmed Inclusions</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100/50 transition-transform group-hover:scale-110">
                             <Building size={16} className="text-blue-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Premium Hotels</span>
                       </div>
                       <span className="text-xs font-black text-slate-400">{hotelCount} Units</span>
                    </div>
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100/50 transition-transform group-hover:scale-110">
                             <Utensils size={16} className="text-emerald-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Planned Meals</span>
                       </div>
                       <span className="text-xs font-black text-slate-400">Included</span>
                    </div>
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100/50 transition-transform group-hover:scale-110">
                             <CarFront size={16} className="text-amber-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Private Transfers</span>
                       </div>
                       <span className="text-xs font-black text-slate-400">{vehicleCount} Cabs</span>
                    </div>
                 </div>
              </div>

              {/* Cancellation Policy Sidebar */}
              <div className="mt-10 pt-8 border-t border-slate-50">
                 <div className="p-6 bg-red-50/50 rounded-[2rem] border border-red-100/50">
                    <div className="flex items-center gap-3 mb-4">
                       <AlertCircle size={20} className="text-red-500" />
                       <h5 className="text-sm font-black text-red-900 uppercase tracking-tighter">Cancellation Policy</h5>
                    </div>
                    <p className="text-[11px] text-red-700/80 font-bold leading-relaxed mb-6">
                       Standard 20% processing fee applied on refunded amount for cancellations made before travel.
                    </p>
                    <button className="w-full py-4 bg-white border-2 border-red-100 text-red-500 text-[10px] font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all uppercase tracking-widest group">
                       Request Cancellation
                       <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
