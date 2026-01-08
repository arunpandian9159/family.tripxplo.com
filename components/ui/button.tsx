import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
        primary:
          "bg-gradient-to-r from-coral-500 to-coral-400 text-white hover:from-coral-600 hover:to-coral-500 shadow-md shadow-coral-500/20 hover:shadow-lg hover:shadow-coral-500/30",
        secondary:
          "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:from-emerald-600 hover:to-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline:
          "border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        link: "text-coral-500 underline-offset-4 hover:underline",
        glass:
          "bg-white/80 backdrop-blur-md border border-white/40 text-slate-700 hover:bg-white/90 shadow-sm",
        // Legacy variants
        exploreButton:
          "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:opacity-90",
        search:
          "bg-coral-500 text-white hover:bg-coral-600 rounded-b-xl rounded-t-none",
        explore:
          "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:opacity-90 -mb-1 rounded-b-lg rounded-t-none",
      },
      size: {
        default: "h-11 px-5 py-2",
        xs: "h-8 px-3 text-xs rounded-lg",
        sm: "h-9 px-4 text-sm rounded-lg",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10 rounded-full p-0",
        "icon-sm": "h-8 w-8 rounded-full p-0",
        "icon-lg": "h-12 w-12 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
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
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
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
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// Icon Button - simplified variant
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "primary" | "secondary";
  size?: "sm" | "default" | "lg";
  label: string; // For accessibility
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, variant = "ghost", size = "default", label, className, ...props },
    ref,
  ) => {
    const sizeMap = {
      sm: "icon-sm" as const,
      default: "icon" as const,
      lg: "icon-lg" as const,
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={sizeMap[size]}
        className={className}
        aria-label={label}
        {...props}
      >
        {icon}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";

export { Button, IconButton, buttonVariants };
