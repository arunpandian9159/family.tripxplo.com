import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatIndianNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
};

export function roundOffPrice(amount: number) {
  return Math.round(amount);
}

export const formatIndianCurrency = (amount: number): string => {
  return `₹ ${formatIndianNumber(amount)}`;
};
