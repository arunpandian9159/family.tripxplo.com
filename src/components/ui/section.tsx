'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  id?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
};

export function Section({
  children,
  className,
  title,
  subtitle,
  action,
  id,
  padding = 'md',
}: SectionProps) {
  return (
    <section id={id} className={cn(paddingClasses[padding], className)}>
      {(title || subtitle || action) && (
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-slate-500 text-base md:text-lg max-w-2xl">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// Section Header Component for more control
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-8 md:mb-12', align === 'center' && 'text-center', className)}>
      <div
        className={cn(
          'flex gap-4',
          align === 'center'
            ? 'flex-col items-center'
            : 'flex-col md:flex-row md:items-end md:justify-between'
        )}
      >
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                'text-slate-500 text-base md:text-lg',
                align === 'center' ? 'max-w-xl mx-auto' : 'max-w-2xl'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
