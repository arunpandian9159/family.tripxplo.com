import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert string to title case
export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Alias for titleCase if used elsewhere
export const titleCase = toTitleCase;

// Get destination icon class (FontAwesome)
export function getDestinationIcon(destination: string): string {
  const dest = destination.toLowerCase();
  if (dest.includes("kashmir")) return "fa-mountain";
  if (dest.includes("goa")) return "fa-umbrella-beach";
  if (dest.includes("manali")) return "fa-snowflake";
  if (dest.includes("kerala")) return "fa-water";
  if (dest.includes("rajasthan")) return "fa-monument";
  if (dest.includes("andaman")) return "fa-island-tropical";
  if (dest.includes("dubai")) return "fa-building";
  if (dest.includes("thailand")) return "fa-vihara";
  if (dest.includes("singapore")) return "fa-city";
  if (dest.includes("europe")) return "fa-landmark";
  return "fa-map-marker-alt";
}

// Get destination image URL
export function getDestinationImage(destination: string): string {
  const destLower = destination.toLowerCase();

  const imageMap: Record<string, string> = {
    kashmir: "/rectangle-14.png",
    goa: "/rectangle-14.png",
    manali: "/rectangle-14.png",
    kerala: "/rectangle-14.png",
    rajasthan: "/rectangle-14.png",
    andaman: "/rectangle-14.png",
    himachal: "/rectangle-14.png",
    uttarakhand: "/rectangle-14.png",
  };

  for (const [key, value] of Object.entries(imageMap)) {
    if (destLower.includes(key)) {
      return value;
    }
  }

  return "/rectangle-14.png";
}

// Family type interface
export interface FamilyType {
  id: string;
  family_id?: string;
  name: string;
  family_type?: string;
  composition: string;
  no_of_adults?: number;
  no_of_child?: number;
  no_of_children?: number;
  no_of_infants?: number;
}

// Helper to generate composition string
function generateComposition(
  adults: number,
  children: number,
  infants: number
): string {
  const parts = [];
  if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
  if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
  return parts.join(" + ");
}

// Detect family type based on traveler counts (synchronous fallback)
export function detectFamilyType(travelers: {
  adults: number;
  children?: number;
  child?: number;
  infants?: number;
}): FamilyType {
  const adults = travelers.adults || 0;
  const children = (travelers.children || 0) + (travelers.child || 0);
  const infants = travelers.infants || 0;

  let name = "Custom Family";
  let id = "custom";

  // Exact matching logic (simplified for common cases)
  if (adults === 1 && children === 0) {
    name = "Solo Traveler";
    id = "solo";
  } else if (adults === 2 && children === 0) {
    name = "Stellar Duo";
    id = "couple";
  } else if (adults === 2 && children === 1) {
    name = "Nuclear Family";
    id = "2a1c";
  } else if (adults === 2 && children === 2) {
    name = "Perfect Family";
    id = "2a2c";
  } else if (adults === 3) {
    name = "Trio Family";
    id = "3a";
  } else if (adults === 4) {
    name = "Grand Family";
    id = "4a";
  } else if (adults + children > 6) {
    name = "Large Group";
    id = "group";
  }

  return {
    name,
    composition: generateComposition(adults, children, infants),
    id,
    no_of_adults: adults,
    no_of_children: children,
    no_of_infants: infants,
  };
}

// Async version that fetches from database API
export async function detectFamilyTypeAsync(travelers: {
  adults: number;
  children?: number;
  child?: number;
  infants?: number;
}): Promise<FamilyType> {
  const adults = travelers.adults || 2;
  const children = travelers.children || 0;
  const child = travelers.child || 0;
  const infants = travelers.infants || 0;

  try {
    const response = await fetch("/api/family-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adults, children, child, infants }),
    });

    if (!response.ok) {
      console.warn("Family type API returned error, using fallback");
      return detectFamilyType(travelers);
    }

    const data = await response.json();

    if (data.success && data.matched) {
      return {
        id: data.matched.family_id || data.matched.id || "custom",
        family_id: data.matched.family_id,
        name: data.matched.family_type || data.matched.name || "Custom Family",
        family_type: data.matched.family_type,
        composition:
          data.matched.composition ||
          generateComposition(adults, children + child, infants),
        no_of_adults: data.matched.no_of_adults,
        no_of_child: data.matched.no_of_child,
        no_of_children: data.matched.no_of_children,
        no_of_infants: data.matched.no_of_infants,
      };
    }

    // Use fallback if no match
    if (data.fallback) {
      return {
        id: data.fallback.id || "custom",
        name: data.fallback.name || "Custom Family",
        composition:
          data.fallback.composition ||
          generateComposition(adults, children + child, infants),
      };
    }

    return detectFamilyType(travelers);
  } catch (error) {
    console.error("Error detecting family type from API:", error);
    return detectFamilyType(travelers);
  }
}

// Fetch all family types from database
export async function fetchAllFamilyTypes(): Promise<FamilyType[]> {
  try {
    const response = await fetch("/api/family-types");

    if (!response.ok) {
      console.warn("Failed to fetch family types from API");
      return [];
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data.map(
        (ft: {
          family_id?: string;
          id?: string;
          family_type?: string;
          name?: string;
          composition?: string;
          no_of_adults?: number;
          no_of_child?: number;
          no_of_children?: number;
          no_of_infants?: number;
        }) => ({
          id: ft.family_id || ft.id || "custom",
          family_id: ft.family_id,
          name: ft.family_type || ft.name || "Custom Family",
          family_type: ft.family_type,
          composition: ft.composition || "",
          no_of_adults: ft.no_of_adults,
          no_of_child: ft.no_of_child,
          no_of_children: ft.no_of_children,
          no_of_infants: ft.no_of_infants,
        })
      );
    }

    return [];
  } catch (error) {
    console.error("Error fetching family types:", error);
    return [];
  }
}

// Generate a unique session ID
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a booking reference
export function generateBookingReference(): string {
  const prefix = "EMI";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate a quote reference
export function generateQuoteReference(quoteId: string): string {
  return `QR-${quoteId.slice(0, 8).toUpperCase()}`;
}

// Format currency (Indian Rupees)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format currency without symbol
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format date and time for display
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format travel date for API submission
export function formatTravelDate(dateString: string): string | null {
  if (!dateString) return null;

  // If already in YYYY-MM-DD format
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  } catch {
    console.warn("Could not parse travel date:", dateString);
  }

  return null;
}

// Validate Indian mobile number
export function validateMobileNumber(number: string): boolean {
  const cleanNumber = number.replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(cleanNumber);
}

// Validate email address
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate PIN (4 digits)
export function validatePIN(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

// Clean phone number to 10 digits
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

// Calculate EMI amount
export function calculateEMI(totalPrice: number, months: number): number {
  return Math.ceil(totalPrice / months);
}

// Calculate advance payment (20% of total)
export function calculateAdvancePayment(totalPrice: number): number {
  return Math.round(totalPrice * 0.2);
}

// Get month name from number (1-12)
export function getMonthName(monthNumber: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1] || "";
}

// Get short month name
export function getShortMonthName(monthNumber: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1] || "";
}

// Format YYYY-MM string to "Month Year"
export function formatMonth(ym: string): string {
  if (!ym) return "";
  const [year, month] = ym.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

// Get next 12 months for travel date selection
export function getNext12Months(): Array<{ value: string; label: string }> {
  const months: Array<{ value: string; label: string }> = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = `${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
    months.push({ value, label });
  }

  return months;
}

// Calculate days until a date
export function daysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get URL parameters
export function getUrlParam(param: string): string | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get UTM source from URL
export function getUtmSource(): string {
  return getUrlParam("utm_source") || "direct";
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

// Capitalize first letter
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Sleep/delay function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if running on client side
export function isClient(): boolean {
  return typeof window !== "undefined";
}

// Check if running in development mode
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

// Check if running in production mode
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

// Get payment status badge color
export function getPaymentStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    completed: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    partial: "text-blue-600 bg-blue-100",
    failed: "text-red-600 bg-red-100",
    refunded: "text-gray-600 bg-gray-100",
  };

  return statusColors[status.toLowerCase()] || "text-gray-600 bg-gray-100";
}

// Generate random color from seed
export function seededColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return "U";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
