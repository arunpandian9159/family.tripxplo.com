import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        gold: 'bg-amber-100 text-amber-700',
        silver: 'bg-slate-200 text-slate-600',
        platinum: 'bg-slate-800 text-white',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        outline: 'border border-slate-200 bg-transparent text-slate-600',
        glass: 'bg-white/80 backdrop-blur-sm text-slate-700 border border-white/40',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Plan Badge - For package plans
interface PlanBadgeProps {
  plan: 'Gold' | 'Silver' | 'Platinum' | string;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const variant =
    plan === 'Gold'
      ? 'gold'
      : plan === 'Silver'
        ? 'silver'
        : plan === 'Platinum'
          ? 'platinum'
          : 'default';

  return (
    <Badge variant={variant} className={className}>
      {plan}
    </Badge>
  );
}

// Status Badge
interface StatusBadgeProps {
  status: 'success' | 'pending' | 'failed' | 'cancelled' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    success: { variant: 'success' as const, label: 'Confirmed' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    failed: { variant: 'error' as const, label: 'Failed' },
    cancelled: { variant: 'default' as const, label: 'Cancelled' },
  };

  const { variant, label } = config[status as keyof typeof config] || {
    variant: 'default' as const,
    label: status,
  };

  return (
    <Badge variant={variant} className={className}>
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' && 'bg-green-500',
          variant === 'warning' && 'bg-yellow-500',
          variant === 'error' && 'bg-red-500',
          variant === 'default' && 'bg-slate-400'
        )}
      />
      {label}
    </Badge>
  );
}
