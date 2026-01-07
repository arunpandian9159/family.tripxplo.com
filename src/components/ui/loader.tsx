'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Plane } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'plane';
  text?: string;
  className?: string;
}

const sizeConfig = {
  sm: { container: 'w-6 h-6', icon: 'w-4 h-4', dot: 'w-1.5 h-1.5' },
  md: { container: 'w-10 h-10', icon: 'w-6 h-6', dot: 'w-2 h-2' },
  lg: { container: 'w-16 h-16', icon: 'w-8 h-8', dot: 'w-2.5 h-2.5' },
};

export function Loader({ size = 'md', variant = 'spinner', text, className }: LoaderProps) {
  const config = sizeConfig[size];

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={cn('rounded-full bg-emerald-500 animate-bounce', config.dot)}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-slate-500">{text}</p>}
      </div>
    );
  }

  if (variant === 'plane') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className="relative">
          <div
            className={cn(
              'rounded-full border-4 border-emerald-100 animate-pulse',
              config.container
            )}
          />
          <div
            className={cn(
              'absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin',
              config.container
            )}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Plane className={cn('text-emerald-500', config.icon)} />
          </div>
        </div>
        {text && <p className="text-sm text-slate-500">{text}</p>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-emerald-500', config.icon)} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}

// Full page loader
interface PageLoaderProps {
  title?: string;
  subtitle?: string;
}

export function PageLoader({
  title = 'Loading',
  subtitle = 'Please wait a moment...',
}: PageLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{subtitle}</p>
      <div className="flex items-center gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoader({ className }: { className?: string }) {
  return <Loader2 className={cn('w-4 h-4 animate-spin', className)} />;
}
