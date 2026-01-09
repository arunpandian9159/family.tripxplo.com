"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronUp, Shield, Zap, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatIndianCurrency } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/features/userSlice";
import { useAuth } from "@/app/hooks/useAuth";
import LoginModal from "./LoginModal";

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
          <div className="relative px-6 py-5 bg-gradient-to-r from-gold-600 to-gold-700 text-white overflow-hidden">
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

          {/* CTA */}
          <div className="px-6 pb-6">
            <button
              onClick={handlePackageClick}
              className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-600 text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
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
                <span className="text-xs">•</span>
                <span className="text-xs">No Hidden Charges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-4 p-4 bg-gold-50 rounded-xl border border-gold-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold-100 rounded-lg">
              <Gift size={16} className="text-gold-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gold-800">
                No Last Minute Rush
              </p>
              <p className="text-xs text-gold-600 mt-0.5">
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
            </DrawerContent>
          </Drawer>

          {/* Book Button */}
          <button
            onClick={handlePackageClick}
            className="flex-1 max-w-[180px] py-3.5 bg-gradient-to-r from-gold-600 to-gold-700 text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 active:scale-[0.98] transition-transform"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
