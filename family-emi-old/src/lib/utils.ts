import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert string to title case
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Format currency in INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format month display
export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });
}

// Get destination icon
export function getDestinationIcon(destination: string): string {
  const iconMap: Record<string, string> = {
    goa: "fa-umbrella-beach",
    andaman: "fa-water",
    munnar: "fa-mountain",
    alleppey: "fa-ship",
    kerala: "fa-tree",
    kashmir: "fa-snowflake",
    manali: "fa-mountain",
    shimla: "fa-mountain",
    rajasthan: "fa-gopuram",
    agra: "fa-monument",
    delhi: "fa-city",
    mumbai: "fa-building",
    bangalore: "fa-city",
    chennai: "fa-city",
    kolkata: "fa-city",
    hyderabad: "fa-gopuram",
    pune: "fa-city",
    jaipur: "fa-gopuram",
    udaipur: "fa-gopuram",
    jodhpur: "fa-gopuram",
  };

  const lower = destination.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) {
      return icon;
    }
  }

  return "fa-map-marker-alt";
}

// Family types data
export const FAMILY_TYPES = [
  {
    id: "SD",
    name: "Stellar Duo",
    composition: "2 Adults",
    adults: 2,
    children: 0,
    child: 0,
    infants: 0,
  },
  {
    id: "BB",
    name: "Baby Bliss",
    composition: "2 Adults, 1 Infant",
    adults: 2,
    children: 0,
    child: 0,
    infants: 1,
  },
  {
    id: "TD",
    name: "Tiny Delight",
    composition: "2 Adults, 1 Child (2-5)",
    adults: 2,
    children: 0,
    child: 1,
    infants: 0,
  },
  {
    id: "FN",
    name: "Family Nest",
    composition: "2 Adults, 2 Children (6-11)",
    adults: 2,
    children: 2,
    child: 0,
    infants: 0,
  },
  {
    id: "HH",
    name: "Happy Household",
    composition: "2 Adults, 3 Children",
    adults: 2,
    children: 3,
    child: 0,
    infants: 0,
  },
];

// Detect family type based on traveler composition
export function detectFamilyType(travelers: {
  adults: number;
  children: number;
  child: number;
  infants: number;
}): { id: string; name: string; composition: string } {
  const { adults, children, child, infants } = travelers;

  // Find matching family type
  const match = FAMILY_TYPES.find(
    (ft) =>
      ft.adults === adults &&
      ft.children === children &&
      ft.child === child &&
      ft.infants === infants
  );

  if (match) {
    return { id: match.id, name: match.name, composition: match.composition };
  }

  // Generate custom composition string
  const parts = [];
  if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  if (children > 0)
    parts.push(`${children} Child${children > 1 ? "ren" : ""} (6-11)`);
  if (child > 0) parts.push(`${child} Child (2-5)`);
  if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);

  return {
    id: "CUSTOM",
    name: "Custom Group",
    composition: parts.join(", ") || "No travelers selected",
  };
}

// Generate session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Calculate EMI options
export function calculateEMIOptions(totalAmount: number): {
  months: number;
  emiAmount: number;
  processingFee: number;
  totalWithFee: number;
  label: string;
}[] {
  return [
    {
      months: 3,
      emiAmount: Math.ceil(totalAmount / 3),
      processingFee: 999,
      totalWithFee: totalAmount + 999,
      label: "Quick Pay",
    },
    {
      months: 6,
      emiAmount: Math.ceil(totalAmount / 6),
      processingFee: 996,
      totalWithFee: totalAmount + 996,
      label: "Best Value",
    },
    {
      months: 9,
      emiAmount: Math.ceil(totalAmount / 9),
      processingFee: 900,
      totalWithFee: totalAmount + 900,
      label: "Flexible",
    },
    {
      months: 12,
      emiAmount: Math.ceil(totalAmount / 12),
      processingFee: 996,
      totalWithFee: totalAmount + 996,
      label: "Low Monthly",
    },
  ];
}
