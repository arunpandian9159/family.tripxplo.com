'use client';
import React from 'react';
import { ChevronUp, Shield, Zap, Gift, CreditCard } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/format';

interface BookProps {
  packageId?: string;
  price?: number;
  adult?: number;
  child?: number;
  packagePrice?: number;
  gstPrice?: number;
  gstPer?: number;
  perPerson?: number;
}

export default function Book({
  packageId,
  price,
  adult,
  child,
  packagePrice,
  gstPrice,
  gstPer,
  perPerson,
}: BookProps) {
  const safePrice = price || 0;
  const safePackagePrice = packagePrice || 0;
  const safeGstPrice = gstPrice || 0;
  const safeGstPer = gstPer || 0;
  const safeAdult = adult || 2;
  const safeChild = child || 0;
  const safePerPerson = perPerson || Math.round(safePrice / (safeAdult + safeChild * 0.5) || 0);

  // Calculate EMI (6 months no-cost EMI)
  const emiAmount = safePrice > 0 ? Math.round(safePrice / 6) : 0;

  async function handlePackageClick() {
    // For now, just show an alert - booking functionality to be implemented
    alert('Booking functionality coming soon! Please contact us for bookings.');
  }

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-6 py-5 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={16} className="text-emerald-200" />
                <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                  Starting From
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatIndianCurrency(safePerPerson)}</span>
                <span className="text-sm text-white/80">/ person</span>
              </div>
              <p className="text-xs text-emerald-100 mt-1">
                Total: {formatIndianCurrency(safePrice)} (taxes included)
              </p>
            </div>
          </div>

          {/* EMI Banner */}
          {emiAmount > 0 && (
            <div className="px-6 py-3 bg-linear-to-r from-[#15ab8b]/10 to-[#1ec9a5]/10 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#15ab8b]" />
                <div>
                  <span className="text-sm font-semibold text-slate-900">EMI Available: </span>
                  <span className="text-sm font-bold text-[#15ab8b]">
                    {formatIndianCurrency(emiAmount)}/month
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">No-cost EMI on select cards • 6 months</p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="p-6 space-y-4">
            {/* Per Person Price */}
            <div className="flex items-center justify-between py-3 bg-emerald-50 rounded-xl px-4 -mx-2">
              <span className="text-sm font-medium text-emerald-700">Per Person</span>
              <span className="text-lg font-bold text-emerald-600">
                {formatIndianCurrency(safePerPerson)}
              </span>
            </div>

            {/* Travelers */}
            <div className="flex items-center justify-between py-3 border-b border-dashed border-slate-200">
              <span className="text-sm text-slate-500">Travelers</span>
              <span className="text-sm font-medium text-slate-800">
                {safeAdult} Adult{safeAdult > 1 ? 's' : ''}
                {safeChild > 0 ? `, ${safeChild} Child${safeChild > 1 ? 'ren' : ''}` : ''}
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
              <span className="text-sm text-slate-500">Taxes & Fees ({safeGstPer}%)</span>
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
              className="w-full py-4 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] hover:from-[#0f8a6f] hover:to-[#15ab8b] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
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
        <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CreditCard size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Easy EMI Options</p>
              <p className="text-xs text-emerald-600 mt-0.5">Pay in easy monthly installments!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)]">
        <div className="p-4 flex items-center justify-between gap-4">
          {/* Price Section */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">
                {formatIndianCurrency(safePerPerson)}
              </span>
              <span className="text-xs text-slate-500">/person</span>
            </div>
            <span className="text-xs text-slate-500">Total: {formatIndianCurrency(safePrice)}</span>
            {emiAmount > 0 && (
              <span className="text-xs text-[#15ab8b] font-medium">
                EMI: {formatIndianCurrency(emiAmount)}/mo
              </span>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={handlePackageClick}
            className="flex-1 max-w-[180px] py-3.5 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
