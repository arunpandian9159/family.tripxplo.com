import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
        primary:
          'bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white hover:from-[#0f8a6f] hover:to-[#15ab8b] shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30',
        secondary:
          'bg-linear-to-r from-emerald-500 to-emerald-400 text-white hover:from-emerald-600 hover:to-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        outline:
          'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
        ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        link: 'text-[#15ab8b] underline-offset-4 hover:underline',
        glass:
          'bg-white/80 backdrop-blur-md border border-white/40 text-slate-700 hover:bg-white/90 shadow-sm',
      },
      size: {
        default: 'h-11 px-5 py-2',
        xs: 'h-8 px-3 text-xs rounded-lg',
        sm: 'h-9 px-4 text-sm rounded-lg',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 rounded-full p-0',
        'icon-sm': 'h-8 w-8 rounded-full p-0',
        'icon-lg': 'h-12 w-12 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
