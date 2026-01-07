import { cn } from '@/lib/utils';
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-slate-200 rounded-lg animate-pulse',
        'bg-linear-to-r from-slate-200 via-slate-100 to-slate-200',
        'bg-size-[200%_100%]',
        className
      )}
    />
  );
}

// Card Skeleton
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100 overflow-hidden', className)}>
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Package Card Skeleton (specific for this app)
export function SkeletonPackageCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm',
        className
      )}
    >
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="p-4 space-y-4">
        <div>
          <Skeleton className="h-5 w-4/5 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex justify-between py-3 border-y border-slate-100">
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
