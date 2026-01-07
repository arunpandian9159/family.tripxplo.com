'use client';
import React from 'react';
import { Inclusion } from '@/app/types/pack';
import { NEXT_PUBLIC_IMAGE_URL } from '@/app/utils/constants/apiUrls';
import Image from 'next/image';
import { Check, Sparkles } from 'lucide-react';

const Inclusions = ({ inclusions }: { inclusions: Inclusion[] }) => {
  if (!inclusions || !Array.isArray(inclusions) || inclusions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex p-3 bg-slate-100 rounded-full mb-3">
          <Check size={20} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-400">No inclusions listed</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {inclusions.map((inc, index) => {
        if (!inc || typeof inc !== 'object') return null;
        const name = inc?.name || 'Inclusion';
        const image = inc?.image || '';

        return (
          <div
            key={inc?._id || index}
            className="group flex flex-col items-center justify-center p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 text-center gap-3 hover:shadow-md hover:border-emerald-200 transition-all duration-300"
          >
            <div className="relative w-10 h-10 p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
              {image ? (
                <Image
                  src={NEXT_PUBLIC_IMAGE_URL + image}
                  alt={name}
                  fill
                  className="object-contain p-1.5"
                />
              ) : (
                <Check className="w-full h-full text-emerald-500" />
              )}
            </div>
            <span className="text-xs font-semibold text-emerald-800 line-clamp-2 leading-tight">
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Inclusions;
