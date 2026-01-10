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
  Shield,
  Zap,
  Users,
  Sparkles,
  Calendar,
  Check,
  Wallet,
  Info,
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
  { months: 3, label: "3 mo" },
  { months: 6, label: "6 mo", popular: true },
  { months: 12, label: "12 mo" },
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
  const [selectedEMIMonths, setSelectedEMIMonths] = useState(6);
  const [showCustomSlider, setShowCustomSlider] = useState(false);

  // Calculate EMI based on selected months
  const emiAmount = useMemo(() => {
    return Math.ceil(safePrice / selectedEMIMonths);
  }, [safePrice, selectedEMIMonths]);

  const handleQuickEMISelect = (months: number) => {
    setSelectedEMIMonths(months);
    setShowCustomSlider(false);
  };

  const handleCustomEMIChange = (value: number) => {
    setSelectedEMIMonths(value);
  };

  async function handlePackageClick() {
    // TODO: Remove this bypass after development - Authentication temporarily disabled
    // if (!isAuthenticated && !isLoading) {
    //   setShowLoginModal(true);
    // } else {
    //   if (!isLoading && isAuthenticated) {
    //     dispatch(setUser(user));
    //     router.push(`${packageId}/booking-overview`);
    //   }
    // }

    // TEMPORARY: Direct navigation for development testing
    router.push(`${packageId}/booking-overview`);
  }

  async function handleLoginSuccess() {
    const result = await refetch();
    setShowLoginModal(false);
    if (result.data?.result) {
      dispatch(setUser(result.data.result));
    }
    router.push(`${packageId}/booking-overview`);
  }

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
          {/* EMI Header - Primary Focus */}
          <div className="relative px-6 py-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute top-3 right-3">
              <Sparkles size={18} className="text-gold-400 animate-pulse" />
            </div>

            <div className="relative">
              {/* Prepaid EMI Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gold-500/20 to-amber-500/20 rounded-full border border-gold-500/30 mb-4">
                <Wallet size={14} className="text-gold-400" />
                <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  Prepaid EMI Package
                </span>
              </div>

              {/* EMI Price - Main Focus */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                    <span className="text-lg font-medium text-slate-400">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    for {selectedEMIMonths} months • 0% Interest
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="p-2.5 bg-gold-500/20 rounded-xl backdrop-blur-sm">
                    <Users size={18} className="text-gold-400" />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {safeAdult + safeChild} pax
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick EMI Duration Selection */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} />
                EMI Duration
              </p>
              <button
                onClick={() => setShowCustomSlider(!showCustomSlider)}
                className="text-xs text-gold-600 font-medium hover:text-gold-700 transition-colors"
              >
                {showCustomSlider ? "Hide" : "Custom"}
              </button>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {EMI_QUICK_OPTIONS.map((option) => (
                <button
                  key={option.months}
                  onClick={() => handleQuickEMISelect(option.months)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedEMIMonths === option.months && !showCustomSlider
                      ? "border-gold-400 bg-white shadow-md shadow-gold-200/50"
                      : "border-slate-200 bg-white hover:border-gold-200"
                  }`}
                >
                  {option.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold-500 text-white text-[9px] font-bold rounded-full">
                      POPULAR
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-lg font-bold ${
                        selectedEMIMonths === option.months && !showCustomSlider
                          ? "text-gold-600"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatIndianCurrency(
                        Math.ceil(safePrice / option.months)
                      )}
                    </span>
                  </div>
                  {selectedEMIMonths === option.months && !showCustomSlider && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Slider - Collapsible */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showCustomSlider
                  ? "max-h-32 opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">3 months</span>
                <div className="px-3 py-1 bg-gold-100 rounded-full">
                  <span className="text-sm font-bold text-gold-700">
                    {selectedEMIMonths} months
                  </span>
                </div>
                <span className="text-xs text-slate-400">16 months</span>
              </div>
              <EMISlider
                value={selectedEMIMonths}
                onChange={handleCustomEMIChange}
                min={3}
                max={16}
              />
            </div>
          </div>

          {/* Total Package Price - Secondary */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-slate-400" />
                <span className="text-sm text-slate-500">Total Package</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-slate-800">
                  {formatIndianCurrency(safePrice)}
                </span>
                <span className="text-xs text-slate-400 ml-1">incl. taxes</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
              <span>
                {formatIndianCurrency(safePerPerson)}/person • {safeAdult} Adult
                {safeAdult > 1 ? "s" : ""}
                {safeChild > 0
                  ? `, ${safeChild} Child${safeChild > 1 ? "ren" : ""}`
                  : ""}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="p-6">
            <button
              onClick={handlePackageClick}
              className="relative w-full py-4 overflow-hidden gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-gold-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/40 active:scale-[0.98] group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative flex items-center justify-center gap-2">
                <Zap size={20} className="animate-pulse" />
                <span className="text-lg">Book with EMI</span>
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
                <span className="text-xs">0% Interest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reserve Info */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-2xl border border-gold-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-gold-400 to-amber-500 rounded-xl shadow-md">
              <Wallet size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Reserve with just ₹1
              </p>
              <p className="text-xs text-slate-500">
                Pay the rest in easy EMIs
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
                    {formatIndianCurrency(emiAmount)}
                  </span>
                  <span className="text-xs text-gold-600 font-medium">
                    /mo EMI
                  </span>
                  <ChevronUp size={16} className="text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">
                  {selectedEMIMonths} months • Total{" "}
                  {formatIndianCurrency(safePrice)}
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader className="border-b border-slate-100 pb-4">
                <DrawerTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wallet size={20} className="text-gold-500" />
                  Prepaid EMI Details
                </DrawerTitle>
              </DrawerHeader>
              <div className="overflow-y-auto">
                <div className="p-5 space-y-5">
                  {/* EMI Price Card */}
                  <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
                    <div className="relative">
                      <p className="text-xs text-gold-400 uppercase tracking-wider mb-2">
                        Your Monthly EMI
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black bg-gradient-to-r from-gold-300 to-amber-400 bg-clip-text text-transparent">
                          {formatIndianCurrency(emiAmount)}
                        </span>
                        <span className="text-slate-400">/month</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        for {selectedEMIMonths} months • 0% Interest
                      </p>
                    </div>
                  </div>

                  {/* EMI Duration Selection */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Calendar size={12} />
                      Choose Duration
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {EMI_QUICK_OPTIONS.map((option) => (
                        <button
                          key={option.months}
                          onClick={() => handleQuickEMISelect(option.months)}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            selectedEMIMonths === option.months
                              ? "border-gold-400 bg-gold-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          {option.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold-500 text-white text-[9px] font-bold rounded-full">
                              POPULAR
                            </span>
                          )}
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className={`text-base font-bold ${
                                selectedEMIMonths === option.months
                                  ? "text-gold-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {formatIndianCurrency(
                                Math.ceil(safePrice / option.months)
                              )}
                            </span>
                          </div>
                          {selectedEMIMonths === option.months && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Slider */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-400">3</span>
                        <span className="text-sm font-bold text-slate-700">
                          {selectedEMIMonths} months
                        </span>
                        <span className="text-xs text-slate-400">16</span>
                      </div>
                      <EMISlider
                        value={selectedEMIMonths}
                        onChange={handleCustomEMIChange}
                        min={3}
                        max={16}
                      />
                    </div>
                  </div>

                  {/* Total Package Info */}
                  <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Total Package
                      </span>
                      <span className="font-bold text-slate-800">
                        {formatIndianCurrency(safePrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {safeAdult} Adult{safeAdult > 1 ? "s" : ""}
                        {safeChild > 0
                          ? ` + ${safeChild} Child${safeChild > 1 ? "ren" : ""}`
                          : ""}
                      </span>
                      <span>{formatIndianCurrency(safePerPerson)}/person</span>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-3 py-2">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Shield size={12} className="text-green-500" />
                      <span className="text-xs">Secure</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Sparkles size={12} className="text-gold-500" />
                      <span className="text-xs">0% Interest</span>
                    </div>
                  </div>
                </div>
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
