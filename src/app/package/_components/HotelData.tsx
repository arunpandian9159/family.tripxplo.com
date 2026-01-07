'use client';
import React from 'react';
import Image from 'next/image';
import { MapPin, Clock, Utensils, Snowflake } from 'lucide-react';
import type { HotelMeal } from '@/lib/types';

const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://tripxplo.com/images/';

interface HotelDataProps {
  hotel: HotelMeal;
  index: number;
}

// Meal plan display mapping
const mealPlanLabels: Record<string, string> = {
  ep: 'Room Only',
  cp: 'Breakfast',
  map: 'Breakfast + Dinner',
  ap: 'All Meals',
};

export default function HotelData({ hotel, index }: HotelDataProps) {
  const hotelImage = hotel.image || '';
  const hasImage = hotelImage && hotelImage.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
          {hasImage ? (
            <Image
              src={
                hotelImage.startsWith('http') ? hotelImage : `${NEXT_PUBLIC_IMAGE_URL}${hotelImage}`
              }
              alt={hotel.hotelName || 'Hotel'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <span className="text-4xl">🏨</span>
            </div>
          )}

          {/* Night badge */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-[#15ab8b] text-white text-xs font-bold rounded-lg">
            Night {index}
          </div>
        </div>

        {/* Hotel Details */}
        <div className="flex-1 p-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {/* Hotel Name */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {hotel.hotelName || 'Hotel'}
              </h3>

              {/* Location */}
              {hotel.location?.address && (
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 text-[#15ab8b]" />
                  <span>{hotel.location.address}</span>
                </div>
              )}

              {/* Room Type */}
              {hotel.hotelRoomType && (
                <p className="text-sm text-slate-600 mb-3">
                  Room: <span className="font-medium">{hotel.hotelRoomType}</span>
                </p>
              )}

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Duration */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">{hotel.noOfNight} Night(s)</span>
                </div>

                {/* Meal Plan */}
                {hotel.mealPlan && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">
                    <Utensils className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {mealPlanLabels[hotel.mealPlan.toLowerCase()] || hotel.mealPlan.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* AC */}
                {hotel.isAc && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-sm">
                    <Snowflake className="w-3.5 h-3.5" />
                    <span className="font-medium">AC Room</span>
                  </div>
                )}
              </div>
            </div>

            {/* Date Range */}
            {hotel.fullStartDate && hotel.fullEndDate && (
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Check-in/out</p>
                <p className="text-sm font-medium text-slate-700">
                  {new Date(hotel.fullStartDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' → '}
                  {new Date(hotel.fullEndDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
