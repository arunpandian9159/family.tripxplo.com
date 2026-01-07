'use client';
import React from 'react';
import { X } from 'lucide-react';
import type { InclusionExclusion } from '@/lib/types';

interface ExclusionsProps {
  exclusions?: InclusionExclusion[];
}

export default function Exclusions({ exclusions }: ExclusionsProps) {
  if (!exclusions || exclusions.length === 0) {
    return <p className="text-sm text-slate-400 italic">No exclusions specified</p>;
  }

  return (
    <ul className="space-y-3">
      {exclusions.map((item, idx) => (
        <li key={item.exclusionId || idx} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <X className="w-3 h-3 text-red-600" />
          </div>
          <span className="text-sm text-slate-700">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
