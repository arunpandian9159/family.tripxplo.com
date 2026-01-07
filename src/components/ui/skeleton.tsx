import { cn } from '@/lib/utils';
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-slate-200 rounded-lg animate-shimmer',
        'bg-linear-to-r from-slate-200 via-slate-100 to-slate-200',
        'bg-[length:200%_100%]',
        className
      )}
    />
  );
}

// Card Skeleton
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100 overflow-hidden', className)}>
      <Skeleton className="aspect-[4/3] rounded-none" />
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

// Profile Skeleton
export function SkeletonProfile({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// List Item Skeleton
export function SkeletonListItem({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)}>
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// Text Skeleton
export function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && 'w-3/4' // Last line is shorter
          )}
        />
      ))}
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
      <Skeleton className="aspect-[4/3] rounded-none" />
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
