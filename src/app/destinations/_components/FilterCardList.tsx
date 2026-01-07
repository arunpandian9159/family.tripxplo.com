'use client';

import { useState } from 'react';
import { Building, CarFront, MapPin, Calendar } from 'lucide-react';
import { LuDices } from 'react-icons/lu';
import Image from 'next/image';
import type { FeaturedPackage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatIndianNumber } from '@/lib/format';
import { PlanBadge } from '@/components/ui/badge';

const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

interface FilterCardListProps {
  package: FeaturedPackage;
  viewMode?: 'grid' | 'list';
  onClick?: () => void;
}

const FilterCardList = ({ package: pkg, viewMode = 'grid', onClick }: FilterCardListProps) => {
  const price = pkg.price || 0;

  if (viewMode === 'list') {
    return (
      <div
        className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row h-auto cursor-pointer"
        onClick={onClick}
      >
        {/* List View - Image Section */}
        <div className="relative w-full sm:w-[280px] md:w-[320px] aspect-4/3 sm:aspect-4/5 md:aspect-auto md:h-full min-h-[250px] overflow-hidden shrink-0">
          <Image
            src={
              pkg.images?.[0]
                ? pkg.images[0].startsWith('http')
                  ? pkg.images[0]
                  : NEXT_PUBLIC_IMAGE_URL + pkg.images[0]
                : '/home.png'
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 280px, 320px"
            alt={pkg.name}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 sm:hidden" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {pkg.planName && <PlanBadge plan={pkg.planName} />}
          </div>

          <div className="absolute top-3 right-3 sm:hidden">
            <div
              className="bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-md border border-white/20 flex items-center gap-1.5"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {pkg.noOfNights}N/{pkg.noOfDays}D
              </span>
            </div>
          </div>
        </div>

        {/* List View - Content Section */}
        <div className="p-5 flex flex-col grow min-w-0">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <div className="hidden sm:flex items-center gap-2 mb-2">
                <div className="bg-[#15ab8b]/20 backdrop-blur-md text-[#15ab8b] px-3 py-1 rounded-lg font-semibold text-sm shadow-md border border-[#15ab8b]/20 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {pkg.noOfNights}N/{pkg.noOfDays}D
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 transition-colors mb-2">
                {pkg.name}
              </h3>

              {/* Destinations with Nights */}
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#15ab8b] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {pkg.destinations
                        ?.filter(d => d.noOfNights > 0)
                        .slice(0, 3)
                        .map((d, i, arr) => (
                          <span key={d.id} className="text-sm text-slate-600 font-medium">
                            {d.name} - {d.noOfNights}N
                            {i < arr.length - 1 && <span className="text-slate-400 mx-0.5">,</span>}
                          </span>
                        ))}
                      {pkg.destinations &&
                        pkg.destinations.filter(d => d.noOfNights > 0).length > 3 && (
                          <span className="text-sm text-slate-400 font-medium">...</span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 my-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Building size={18} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Hotels
                </span>
                <span className="text-sm font-bold text-slate-700">{pkg.hotelCount || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CarFront size={18} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Transfer
                </span>
                <span className="text-sm font-bold text-slate-700">{pkg.vehicleCount || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <LuDices size={18} className="text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Activities
                </span>
                <span className="text-sm font-bold text-slate-700">{pkg.activityCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="text-sm text-slate-500 font-semibold block mb-1">Starts from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  ₹{formatIndianNumber(price)}
                </span>
                <span className="text-sm text-slate-400 font-medium line-through decoration-slate-300 decoration-2">
                  ₹{formatIndianNumber(Math.round(price * 1.25))}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">/person</span>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                onClick?.();
              }}
              className="px-6 py-3 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white text-sm font-semibold rounded-xl hover:from-[#0f8a6f] hover:to-[#15ab8b] transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center gap-2"
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden">
        <Image
          src={
            pkg.images?.[0]
              ? pkg.images[0].startsWith('http')
                ? pkg.images[0]
                : NEXT_PUBLIC_IMAGE_URL + pkg.images[0]
              : '/home.png'
          }
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          alt={pkg.name}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity" />

        {/* Top Badges: Plan & Duration */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex items-center gap-2">
            {pkg.planName && <PlanBadge plan={pkg.planName} />}
            {/* Duration Badge */}
            <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md font-semibold text-[11px] border border-white/20 flex items-center gap-1 shadow-sm">
              <Calendar className="w-3 h-3" />
              <span>
                {pkg.noOfNights}N/{pkg.noOfDays}D
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Info - Package Name */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-linear-to-t from-black/80 via-black/30 to-transparent">
          <h3
            className="text-lg font-bold text-white leading-snug line-clamp-1 transition-colors"
            title={pkg.name}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {pkg.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow gap-4">
        {/* Destinations List */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#15ab8b] shrink-0 mt-1" />
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {pkg.destinations
                ?.filter(d => d.noOfNights > 0)
                .slice(0, 3)
                .map((d, i, arr) => (
                  <span key={d.id}>
                    {d.name} ({d.noOfNights}N)
                    {i < arr.length - 1 && <span className="text-slate-300 mx-2">•</span>}
                  </span>
                ))}
              {pkg.destinations && pkg.destinations.filter(d => d.noOfNights > 0).length > 3 && (
                <span className="text-slate-400 ml-1 text-xs">
                  +{pkg.destinations.length - 3} more
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 bg-slate-50/50 rounded-xl px-2">
          <div className="flex flex-col items-center justify-center text-center gap-1">
            <Building size={16} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Hotels
              </span>
              <span className="text-xs font-bold text-slate-700">{pkg.hotelCount || 0}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-r border-slate-200">
            <CarFront size={16} className="text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Transfers
              </span>
              <span className="text-xs font-bold text-slate-700">{pkg.vehicleCount || 0}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1">
            <LuDices size={16} className="text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Activities
              </span>
              <span className="text-xs font-bold text-slate-700">{pkg.activityCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Starts from</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">₹{formatIndianNumber(price)}</span>
              <span className="text-xs text-slate-400 font-medium line-through">
                ₹{formatIndianNumber(Math.round(price * 1.25))}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">per person</span>
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              onClick?.();
            }}
            className="px-4 py-2 lg:px-2.5 lg:py-2.5 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white text-xs font-bold uppercase tracking-wide rounded-xl lg:rounded-lg hover:from-[#0f8a6f] hover:to-[#15ab8b] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center gap-1.5 lg:gap-1"
          >
            View Details
            <svg
              className="w-3 h-3 lg:w-2.5 lg:h-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterCardList;
