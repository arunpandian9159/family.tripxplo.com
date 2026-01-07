'use client';
import React from 'react';
import { MapPin, Clock, Users, Building2 } from 'lucide-react';
import { PlanBadge } from '@/components/ui/badge';

interface Destination {
  destinationId: string;
  destinationName: string;
  noOfNight: number;
}

interface PackageHighlightProps {
  plan?: string;
  destinations?: Destination[];
  noOfDays?: number;
  noOfNights?: number;
  totalAdult?: number;
  totalChild?: number;
  hotelCount?: number;
  startsFrom?: string;
}

export default function PackageHighlight({
  plan,
  destinations,
  noOfDays,
  noOfNights,
  totalAdult,
  totalChild,
  hotelCount,
  startsFrom,
}: PackageHighlightProps) {
  return (
    <div className="space-y-6">
      {/* Plan Badge and Destinations */}
      <div className="flex flex-wrap items-center gap-3">
        {plan && <PlanBadge plan={plan} />}

        {startsFrom && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
            <MapPin className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-sm font-semibold">Starts @ {startsFrom}</span>
          </div>
        )}
      </div>

      {/* Destinations Route */}
      {destinations && destinations.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <MapPin className="w-5 h-5 text-[#15ab8b] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Destinations</p>
            <div className="flex flex-wrap items-center gap-2">
              {destinations
                .filter(d => d.noOfNight > 0)
                .map((dest, index, arr) => (
                  <React.Fragment key={dest.destinationId}>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
                      {dest.destinationName}
                      <span className="text-xs text-[#15ab8b] font-bold">({dest.noOfNight}N)</span>
                    </span>
                    {index < arr.length - 1 && <span className="text-slate-300">→</span>}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Duration */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Duration</p>
            <p className="text-lg font-bold text-blue-900">
              {noOfNights}N / {noOfDays}D
            </p>
          </div>
        </div>

        {/* Travelers */}
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">
              Travelers
            </p>
            <p className="text-lg font-bold text-purple-900">
              {totalAdult} Adults{totalChild && totalChild > 0 ? `, ${totalChild} Child` : ''}
            </p>
          </div>
        </div>

        {/* Hotels */}
        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Hotels</p>
            <p className="text-lg font-bold text-emerald-900">{hotelCount || 0} Stays</p>
          </div>
        </div>

        {/* Plan */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 font-bold">★</span>
          </div>
          <div>
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Plan</p>
            <p className="text-lg font-bold text-amber-900">{plan || 'Standard'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
