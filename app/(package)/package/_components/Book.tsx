"use client";
import React, { useState, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ChevronUp,
  ChevronDown,
  Shield,
  Zap,
  Gift,
  Users,
  Receipt,
  CreditCard,
  Sparkles,
  Calendar,
  Check,
  Clock,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatIndianCurrency } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/features/userSlice";
import { useAuth } from "@/app/hooks/useAuth";
import LoginModal from "./LoginModal";
import EMISlider from "./EMISlider";

// EMI Quick Select Options
const EMI_QUICK_OPTIONS = [
  { months: 3, label: "3", popular: false, savings: "Fastest" },
  { months: 6, label: "6", popular: true, savings: "Best Value" },
  { months: 12, label: "12", popular: false, savings: "Low EMI" },
];

export default function Book({
  packageId,
  price,
  adult,
  child,
  packagePrice,
  gstPrice,
  gstPer,
  perPerson,
}: {
  packageId?: string;
  price?: number;
  adult?: number;
  child?: number;
  packagePrice?: number;
  gstPrice?: number;
  gstPer?: number;
  perPerson?: number;
}) {
  const safePrice = price || 0;
  const safePackagePrice = packagePrice || 0;
  const safeGstPrice = gstPrice || 0;
  const safeGstPer = gstPer || 0;
  const safeAdult = adult || 2;
  const safeChild = child || 0;
  const safePerPerson =
    perPerson || Math.round(safePrice / (safeAdult + safeChild * 0.5) || 0);
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, refetch } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // EMI State
  const [showEMI, setShowEMI] = useState(false);
  const [selectedEMIMonths, setSelectedEMIMonths] = useState(6);
  const [isCustomEMI, setIsCustomEMI] = useState(false);

  // Calculate EMI based on selected months
  const emiAmount = useMemo(() => {
    return Math.ceil(safePrice / selectedEMIMonths);
  }, [safePrice, selectedEMIMonths]);

  const handleQuickEMISelect = (months: number) => {
    setSelectedEMIMonths(months);
    setIsCustomEMI(false);
  };

  const handleCustomEMIChange = (value: number) => {
    setSelectedEMIMonths(value);
    setIsCustomEMI(true);
  };

  async function handlePackageClick() {
    if (!isAuthenticated && !isLoading) {
      setShowLoginModal(true);
    } else {
      if (!isLoading && isAuthenticated) {
        dispatch(setUser(user));
        router.push(`${packageId}/booking-overview`);
      }
    }
  }

  async function handleLoginSuccess() {
    const result = await refetch();
    setShowLoginModal(false);
    if (result.data?.result) {
      dispatch(setUser(result.data.result));
    }
    router.push(`${packageId}/booking-overview`);
  }

  // EMI Section JSX (inline, not a separate component)
  const renderEMISection = (isMobile = false) => (
    <div
      className={`${isMobile ? "p-4 border-t border-slate-100" : "px-6 pb-4"}`}
    >
      {/* EMI Toggle Header - Enhanced with preview */}
      <button
        onClick={() => setShowEMI(!showEMI)}
        className="w-full group relative overflow-hidden p-4 bg-gradient-to-r from-amber-50 via-gold-50 to-amber-50 rounded-2xl border-2 border-gold-200 hover:border-gold-400 transition-all duration-300 hover:shadow-lg hover:shadow-gold-100"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-gold-400 to-amber-500 rounded-xl shadow-lg shadow-gold-200">
                <Wallet size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">Prepaid EMI</p>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Easy Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mini EMI Preview */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400">Starting</span>
              <span className="text-sm font-bold text-gold-600">
                {formatIndianCurrency(Math.ceil(safePrice / 12))}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </span>
            </div>
            <ChevronDown
              size={20}
              className={`text-gold-500 transition-transform duration-300 ${
                showEMI ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* EMI Options Panel */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          showEMI ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-5">
          {/* Featured EMI Price Display */}
          <div className="relative overflow-hidden p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute top-2 right-2">
              <Sparkles size={20} className="text-gold-400 animate-pulse" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gold-400" />
                <span className="text-xs font-medium text-gold-300 uppercase tracking-widest">
                  Your Monthly EMI
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                    <span className="text-lg font-medium text-slate-400">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    for {selectedEMIMonths} months
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="px-3 py-1.5 bg-gold-500/20 backdrop-blur rounded-lg border border-gold-500/30">
                    <span className="text-xs font-bold text-gold-300">
                      {selectedEMIMonths} MONTHS
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Total: {formatIndianCurrency(safePrice)}
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Payment Progress</span>
                  <span>1 of {selectedEMIMonths}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${100 / selectedEMIMonths}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Select Options */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar size={12} />
              Choose Duration
            </p>
            <div className="grid grid-cols-3 gap-3">
              {EMI_QUICK_OPTIONS.map((option) => (
                <button
                  key={option.months}
                  onClick={() => handleQuickEMISelect(option.months)}
                  className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedEMIMonths === option.months && !isCustomEMI
                      ? "border-gold-400 bg-gradient-to-br from-gold-50 to-amber-50 shadow-lg shadow-gold-200/50"
                      : "border-slate-200 bg-white hover:border-gold-200 hover:bg-gold-50/30 hover:shadow-md"
                  }`}
                >
                  {option.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-gold-500 to-amber-500 text-white text-[10px] font-bold rounded-full uppercase shadow-lg shadow-gold-300/50 flex items-center gap-1">
                      <Sparkles size={10} />
                      Popular
                    </span>
                  )}

                  {/* Selection indicator */}
                  {selectedEMIMonths === option.months && !isCustomEMI && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`text-3xl font-black ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-600"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-500"
                          : "text-slate-400"
                      }`}
                    >
                      months
                    </span>
                    <div className="w-full pt-2 mt-1 border-t border-slate-100">
                      <span
                        className={`text-xs font-bold block ${
                          selectedEMIMonths === option.months && !isCustomEMI
                            ? "text-gold-600"
                            : "text-slate-600"
                        }`}
                      >
                        {formatIndianCurrency(
                          Math.ceil(safePrice / option.months)
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        per month
                      </span>
                    </div>
                  </div>

                  {/* Savings badge */}
                  <div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      selectedEMIMonths === option.months && !isCustomEMI
                        ? "bg-gold-100 text-gold-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {option.savings}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range Slider */}
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={12} />
                Custom Duration
              </p>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isCustomEMI
                    ? "bg-gradient-to-r from-gold-100 to-amber-100 border border-gold-300"
                    : "bg-slate-100"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    isCustomEMI ? "text-gold-700" : "text-slate-500"
                  }`}
                >
                  {selectedEMIMonths}
                </span>
                <span
                  className={`text-xs ${
                    isCustomEMI ? "text-gold-500" : "text-slate-400"
                  }`}
                >
                  Months
                </span>
              </div>
            </div>

            {/* EMI Slider - Extracted Component */}
            <EMISlider
              value={selectedEMIMonths}
              onChange={handleCustomEMIChange}
              min={3}
              max={16}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-6 py-6 bg-gradient-to-br from-gold-500 via-gold-400 to-amber-400 text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-lg" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
            <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-75" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Gift size={14} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-white/90 uppercase tracking-widest">
                  Package Price
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight">
                      {formatIndianCurrency(safePerPerson)}
                    </span>
                    <span className="text-base text-white/70 font-medium">
                      / person
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mt-2 font-medium">
                    Total: {formatIndianCurrency(safePrice)}{" "}
                    <span className="text-white/60">(incl. taxes)</span>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users size={18} />
                  </div>
                  <span className="text-[10px] text-white/70">
                    {safeAdult + safeChild} pax
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick EMI Preview - Always visible */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-500/20 rounded-lg">
                  <CreditCard size={16} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Or pay in EMI
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-bold text-white">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                    <span className="text-[10px] text-gold-400 ml-1">
                      × {selectedEMIMonths}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 space-y-3">
            {/* Travelers */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-sm text-slate-600">Travelers</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {safeAdult} Adult{safeAdult > 1 ? "s" : ""}
                {safeChild > 0
                  ? `, ${safeChild} Child${safeChild > 1 ? "ren" : ""}`
                  : ""}
              </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Base Price</span>
                <span className="text-sm font-medium text-slate-700">
                  {formatIndianCurrency(safePackagePrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Taxes & Fees ({safeGstPer}%)
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {formatIndianCurrency(safeGstPrice)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-slate-400" />
                <span className="font-bold text-slate-900">Total Amount</span>
              </div>
              <span className="text-2xl font-black text-slate-900">
                {formatIndianCurrency(safePrice)}
              </span>
            </div>
          </div>

          {/* EMI Section - Inline */}
          {renderEMISection()}

          {/* CTA */}
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={handlePackageClick}
              className="relative w-full py-4 overflow-hidden gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-gold-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/40 active:scale-[0.98] group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative flex items-center justify-center gap-2">
                <Zap size={20} className="animate-pulse" />
                <span className="text-lg">Book Now</span>
              </div>
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield size={14} className="text-green-500" />
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Sparkles size={14} className="text-gold-500" />
                <span className="text-xs">No Hidden Charges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-2xl border border-gold-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-gold-400 to-amber-500 rounded-xl shadow-lg shadow-gold-200">
              <Gift size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                No Last Minute Rush
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Reserve with just{" "}
                <span className="font-bold text-gold-600">₹1 Rupee!</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)]">
        <div className="p-4 flex items-center justify-between gap-4">
          {/* Price Section */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    {formatIndianCurrency(safePerPerson)}
                  </span>
                  <span className="text-xs text-slate-500">/person</span>
                  <ChevronUp size={16} className="text-slate-400" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">
                    Total: {formatIndianCurrency(safePrice)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gold-100 text-gold-600 rounded font-medium">
                    EMI available
                  </span>
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader className="border-b border-slate-100 pb-4">
                <DrawerTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Receipt size={20} className="text-gold-500" />
                  Price Breakdown
                </DrawerTitle>
              </DrawerHeader>
              <div className="overflow-y-auto">
                <div className="p-6 space-y-4">
                  {/* Per Person Price */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border border-gold-200">
                    <span className="font-medium text-gold-700">
                      Per Person
                    </span>
                    <span className="text-xl font-bold text-gold-600">
                      {formatIndianCurrency(safePerPerson)}
                    </span>
                  </div>

                  {/* Travelers */}
                  <div className="flex items-center justify-between py-3 border-b border-dashed border-slate-200">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-slate-500">Travelers</span>
                    </div>
                    <span className="font-medium text-slate-800">
                      {safeAdult} Adult{safeAdult > 1 ? "s" : ""}
                      {safeChild > 0
                        ? `, ${safeChild} Child${safeChild > 1 ? "ren" : ""}`
                        : ""}
                    </span>
                  </div>

                  {/* Base Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Base Price</span>
                    <span className="font-medium text-slate-800">
                      {formatIndianCurrency(safePackagePrice)}
                    </span>
                  </div>

                  {/* Taxes */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Taxes & Fees ({safeGstPer}%)
                    </span>
                    <span className="font-medium text-slate-800">
                      {formatIndianCurrency(safeGstPrice)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-slate-200">
                    <span className="text-lg font-bold text-slate-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatIndianCurrency(safePrice)}
                    </span>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-2 pt-4 text-slate-400">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-xs">Secure & Safe Payments</span>
                  </div>
                </div>

                {/* EMI Section for Mobile Drawer - Inline */}
                {renderEMISection(true)}
              </div>
            </DrawerContent>
          </Drawer>

          {/* Book Button */}
          <button
            onClick={handlePackageClick}
            className="flex-1 max-w-[180px] py-3.5 gold-gradient text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
