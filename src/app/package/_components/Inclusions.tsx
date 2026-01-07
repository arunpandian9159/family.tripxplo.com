'use client';
import React from 'react';
import { Check } from 'lucide-react';
import type { InclusionExclusion } from '@/lib/types';

interface InclusionsProps {
  inclusions?: InclusionExclusion[];
}

export default function Inclusions({ inclusions }: InclusionsProps) {
  if (!inclusions || inclusions.length === 0) {
    return <p className="text-sm text-slate-400 italic">No inclusions specified</p>;
  }

  return (
    <ul className="space-y-3">
      {inclusions.map((item, idx) => (
        <li key={item.inclusionId || idx} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-emerald-600" />
          </div>
          <span className="text-sm text-slate-700">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
