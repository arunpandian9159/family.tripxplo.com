"use client";

import { cn } from "@/lib/utils";
import React from "react";

// Base Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  onClick,
  hoverable = false,
  padding = "md",
  style,
}: CardProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      style={style}
      className={cn(
        "bg-white rounded-2xl border border-slate-100 overflow-hidden",
        paddingClasses[padding],
        hoverable &&
          "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        onClick && "w-full text-left",
        className
      )}
    >
      {children}
    </Comp>
  );
}

// Card Header
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

// Card Title
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  className,
  as: Tag = "h3",
}: CardTitleProps) {
  return (
    <Tag className={cn("text-lg font-semibold text-slate-900", className)}>
      {children}
    </Tag>
  );
}

// Card Description
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-slate-500 mt-1", className)}>{children}</p>
  );
}

// Card Content
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

// Card Footer
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-slate-100", className)}>
      {children}
    </div>
  );
}

// Feature Card - A styled variant for showcasing features
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card hoverable className={cn("group", className)}>
      <div className="p-3 w-14 h-14 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center mb-4 group-hover:bg-gold-100 transition-colors">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}

// Stats Card
interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium mt-2",
                trend.positive ? "text-green-600" : "text-red-500"
              )}
            >
              {trend.positive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
