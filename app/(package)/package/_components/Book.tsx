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
  Gift,
  CreditCard,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { formatIndianCurrency } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/features/userSlice";
import { useAuth } from "@/app/hooks/useAuth";
import LoginModal from "./LoginModal";

// EMI Quick Select Options
const EMI_QUICK_OPTIONS = [
  { months: 3, label: "3 Mo", popular: false },
  { months: 6, label: "6 Mo", popular: true },
  { months: 12, label: "12 Mo", popular: false },
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

  const handleCustomEMIChange = (value: number[]) => {
    setSelectedEMIMonths(value[0]);
    setIsCustomEMI(true);
  };

  async function handlePackageClick() {
    if (!isAuthenticated && !isLoading) {
      // Show login modal instead of redirecting
      setShowLoginModal(true);
    } else {
      if (!isLoading && isAuthenticated) {
        dispatch(setUser(user));
        router.push(`${packageId}/booking-overview`);
      }
    }
  }

  async function handleLoginSuccess() {
    // Refetch user data after successful login
    const result = await refetch();
    setShowLoginModal(false);

    // Navigate to booking overview with the refetched user data
    if (result.data?.result) {
      dispatch(setUser(result.data.result));
    }
    router.push(`${packageId}/booking-overview`);
  }

  // EMI Section Component (Reusable for both desktop and mobile)
  const EMISection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`${isMobile ? "p-4 border-t border-slate-100" : "px-6 pb-4"}`}
    >
      {/* EMI Toggle Header */}
      <button
        onClick={() => setShowEMI(!showEMI)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-gold-50 rounded-xl border border-gold-200 hover:border-gold-300 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-100 rounded-lg">
            <CreditCard size={18} className="text-gold-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">
              Prepaid EMI Available
            </p>
            <p className="text-xs text-gold-600">Flexible payment options</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-gold-500 transition-transform duration-300 ${
            showEMI ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* EMI Options Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showEMI ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4">
          {/* Quick Select Options */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Popular Plans
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EMI_QUICK_OPTIONS.map((option) => (
                <button
                  key={option.months}
                  onClick={() => handleQuickEMISelect(option.months)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedEMIMonths === option.months && !isCustomEMI
                      ? "border-gold-400 bg-gradient-to-br from-gold-50 to-amber-50 shadow-md shadow-gold-100"
                      : "border-slate-200 bg-white hover:border-gold-200 hover:bg-gold-50/50"
                  }`}
                >
                  {option.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold-500 text-white text-[10px] font-bold rounded-full uppercase">
                      Popular
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-lg font-bold ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-600"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`text-xs ${
                        selectedEMIMonths === option.months && !isCustomEMI
                          ? "text-gold-500"
                          : "text-slate-400"
                      }`}
                    >
                      {formatIndianCurrency(
                        Math.ceil(safePrice / option.months)
                      )}
                      /mo
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Custom Duration
              </p>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  isCustomEMI
                    ? "bg-gold-100 text-gold-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {selectedEMIMonths} Months
              </span>
            </div>

            <div className="relative px-1">
              {/* Shadcn Slider */}
              <Slider
                value={[selectedEMIMonths]}
                onValueChange={handleCustomEMIChange}
                min={3}
                max={16}
                step={1}
                className="w-full [&_[data-slot=track]]:bg-gold-200 [&_[data-slot=range]]:bg-gradient-to-r [&_[data-slot=range]]:from-gold-400 [&_[data-slot=range]]:to-gold-500 [&_[data-slot=thumb]]:border-gold-500 [&_[data-slot=thumb]]:bg-white [&_[data-slot=thumb]]:shadow-lg [&_[data-slot=thumb]]:shadow-gold-500/30 [&_[data-slot=thumb]]:hover:scale-110 [&_[data-slot=thumb]]:transition-transform"
              />

              {/* Range Labels */}
              <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-medium">
                <span>3 mo</span>
                <span>6 mo</span>
                <span>9 mo</span>
                <span>12 mo</span>
                <span>16 mo</span>
              </div>
            </div>
          </div>

          {/* EMI Summary */}
          <div className="p-4 bg-gradient-to-r from-gold-500 to-amber-500 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gold-100 uppercase tracking-wider">
                  Your Monthly EMI
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {formatIndianCurrency(emiAmount)}
                  </span>
                  <span className="text-sm text-gold-100">
                    × {selectedEMIMonths} months
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar size={24} />
              </div>
            </div>

            {/* EMI Details */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gold-100">Total Amount</p>
                <p className="text-sm font-semibold">
                  {formatIndianCurrency(safePrice)}
                </p>
              </div>
            </div>
          </div>

          {/* EMI Benefits */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-emerald-500" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <CreditCard size={12} className="text-blue-500" />
              All Cards
            </span>
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
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-gold-500 to-gold-400 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={16} className="text-gold-200" />
                <span className="text-xs font-medium text-gold-100 uppercase tracking-wider">
                  Starting From
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatIndianCurrency(safePerPerson)}
                </span>
                <span className="text-sm text-white/80">/ person</span>
              </div>
              <p className="text-xs text-gold-100 mt-1">
                Total: {formatIndianCurrency(safePrice)} (taxes included)
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 space-y-4">
            {/* Per Person Price */}
            <div className="flex items-center justify-between py-3 bg-gold-50 rounded-xl px-4 -mx-2">
              <span className="text-sm font-medium text-gold-700">
                Per Person
              </span>
              <span className="text-lg font-bold text-gold-600">
                {formatIndianCurrency(safePerPerson)}
              </span>
            </div>

            {/* Travelers */}
            <div className="flex items-center justify-between py-3 border-b border-dashed border-slate-200">
              <span className="text-sm text-slate-500">Travelers</span>
              <span className="text-sm font-medium text-slate-800">
                {safeAdult} Adult{safeAdult > 1 ? "s" : ""}
                {safeChild > 0
                  ? `, ${safeChild} Child${safeChild > 1 ? "ren" : ""}`
                  : ""}
              </span>
            </div>

            {/* Base Price */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Base Price</span>
              <span className="text-sm font-medium text-slate-800">
                {formatIndianCurrency(safePackagePrice)}
              </span>
            </div>

            {/* Taxes */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Taxes & Fees ({safeGstPer}%)
              </span>
              <span className="text-sm font-medium text-slate-800">
                {formatIndianCurrency(safeGstPrice)}
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-bold text-slate-900">
                {formatIndianCurrency(safePrice)}
              </span>
            </div>
          </div>

          {/* EMI Section */}
          <EMISection />

          {/* CTA */}
          <div className="px-6 pb-6">
            <button
              onClick={handlePackageClick}
              className="w-full py-4 gold-gradient text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              Book Now
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield size={14} />
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-xs">₹</span>
                <span className="text-xs">No Hidden Charges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Gift size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">
                No Last Minute Rush
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Reserve with Just ₹1 Rupee!
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
                <span className="text-xs text-slate-500">
                  Total: {formatIndianCurrency(safePrice)}
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-b border-slate-100">
                <DrawerTitle className="text-lg font-bold text-slate-900">
                  Price Breakdown
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-4">
                {/* Per Person Price */}
                <div className="flex items-center justify-between py-3 bg-gold-50 rounded-xl px-4">
                  <span className="font-medium text-gold-700">Per Person</span>
                  <span className="text-lg font-bold text-gold-600">
                    {formatIndianCurrency(safePerPerson)}
                  </span>
                </div>

                {/* Travelers */}
                <div className="flex items-center justify-between py-3 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Travelers</span>
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
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-slate-900">
                    {formatIndianCurrency(safePrice)}
                  </span>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 text-slate-400">
                  <Shield size={14} />
                  <span className="text-xs">Secure & Safe Payments</span>
                </div>
              </div>

              {/* EMI Section for Mobile Drawer */}
              <EMISection isMobile />
            </DrawerContent>
          </Drawer>

          {/* Book Button */}
          <button
            onClick={handlePackageClick}
            className="flex-1 max-w-[180px] py-3.5 gold-gradient text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 active:scale-[0.98] transition-transform"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
