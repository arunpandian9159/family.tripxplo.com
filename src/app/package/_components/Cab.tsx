'use client';
import React from 'react';
import Image from 'next/image';
import { Car, Users, Briefcase, Snowflake } from 'lucide-react';
import type { VehicleDetail } from '@/lib/types';

const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

interface CabProps {
  vehicle: VehicleDetail;
}

export default function Cab({ vehicle }: CabProps) {
  const vehicleImage = vehicle.image || '';
  const hasImage = vehicleImage && vehicleImage.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Vehicle Image */}
        <div className="relative w-full md:w-48 h-40 md:h-auto shrink-0">
          {hasImage ? (
            <Image
              src={
                vehicleImage.startsWith('http')
                  ? vehicleImage
                  : `${NEXT_PUBLIC_IMAGE_URL}${vehicleImage}`
              }
              alt={vehicle.vehicleName || 'Vehicle'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-amber-50 to-orange-100 flex items-center justify-center">
              <Car className="w-12 h-12 text-amber-400" />
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="flex-1 p-5">
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            {vehicle.vehicleName || 'Vehicle'}
          </h3>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Seater */}
            {vehicle.seater && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{vehicle.seater} Seater</span>
              </div>
            )}

            {/* Luggage */}
            {vehicle.luggage && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="font-medium">{vehicle.luggage} Bags</span>
              </div>
            )}

            {/* AC */}
            {vehicle.isAc && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-sm">
                <Snowflake className="w-3.5 h-3.5" />
                <span className="font-medium">AC</span>
              </div>
            )}
          </div>

          {/* Transfer Info */}
          {vehicle.transferInfo && vehicle.transferInfo.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Transfers</p>
              <div className="flex flex-wrap gap-2">
                {vehicle.transferInfo.slice(0, 3).map((info, idx) => (
                  <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {info}
                  </span>
                ))}
                {vehicle.transferInfo.length > 3 && (
                  <span className="text-xs text-slate-400">
                    +{vehicle.transferInfo.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Inclusions */}
          {vehicle.inclusion && vehicle.inclusion.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Included</p>
              <p className="text-sm text-slate-600">{vehicle.inclusion.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
