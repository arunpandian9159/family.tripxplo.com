import { createClient } from "@supabase/supabase-js";

// CRM Database
const crmUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL_CRM ||
  "https://tlfwcnikdlwoliqzavxj.supabase.co";
const crmKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_CRM || "";

// Quote Database
const quoteUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
  "https://lkqbrlrmrsnbtkoryazq.supabase.co";
const quoteKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || "";

export const crmDB = createClient(crmUrl, crmKey);
export const quoteDB = createClient(quoteUrl, quoteKey);

// Types
interface PackageData {
  id: string;
  destination?: string;
  destination_category?: string;
  family_type_name?: string;
  family_type_id?: string;
  total_price?: number;
  subtotal?: number;
  package_duration_days?: number;
  duration_days?: number;
  nights?: number;
  no_of_adults?: number;
  no_of_children?: number;
  no_of_child?: number;
  no_of_infants?: number;
  family_count?: number;
  hotel_cost?: number;
  vehicle_cost?: number;
  hotel_name?: string;
  hotel_category?: string;
  room_type?: string;
  meal_plan?: string;
  travel_date?: string;
  created_at?: string;
  additional_costs?: {
    meal_cost_per_person?: number;
    ferry_cost?: number;
    activity_cost_per_person?: number;
    guide_cost_per_day?: number;
  };
  quote_mapping_data?: {
    additional_costs?: {
      meal_cost_per_person?: number;
      ferry_cost?: number;
      activity_cost_per_person?: number;
      guide_cost_per_day?: number;
    };
  };
}

interface EMIOption {
  months: number;
  monthlyAmount: number;
  totalAmount: number;
  processingFee: number;
  label: string;
  isFeatured: boolean;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string[];
}

interface CostBreakdownItem {
  item: string;
  cost: number;
  description: string;
}

// Helper function to generate UUID
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Database service with all API methods
export const databaseService = {
  // Get all family types from CRM database (using correct table name: family_type)
  async getFamilyTypes() {
    try {
      const { data, error } = await crmDB
        .from("family_type")
        .select("*")
        .order("family_type", { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching family types:", error);
      return { success: false, data: [], error };
    }
  },

  // Get all destinations from Quote database
  async getDestinations() {
    try {
      // Try family_type_prices first
      const { data: pricesData, error: pricesError } = await quoteDB
        .from("family_type_prices")
        .select("destination_category")
        .eq("is_public_visible", true)
        .not("destination_category", "is", null);

      if (!pricesError && pricesData && pricesData.length > 0) {
        const uniqueDestinations = [
          ...new Set(pricesData.map((p) => p.destination_category)),
        ]
          .filter((d) => d && d.trim())
          .map((d) => ({ destination: d }));
        return { success: true, data: uniqueDestinations };
      }

      // Fallback to quote_mappings
      const { data: mappingsData, error: mappingsError } = await quoteDB
        .from("quote_mappings")
        .select("destination")
        .not("destination", "is", null);

      if (!mappingsError && mappingsData && mappingsData.length > 0) {
        const uniqueDestinations = [
          ...new Set(mappingsData.map((p) => p.destination)),
        ]
          .filter((d) => d && d.trim())
          .map((d) => ({ destination: d }));
        return { success: true, data: uniqueDestinations };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return { success: false, data: [], error };
    }
  },

  // Search packages based on criteria
  async searchPackages(params: {
    destination?: string;
    familyType?: string;
    travelMonth?: string;
  }) {
    try {
      // Try family_type_prices first
      let query = quoteDB
        .from("family_type_prices")
        .select("*")
        .eq("is_public_visible", true);

      if (params.destination) {
        query = query.ilike("destination_category", `%${params.destination}%`);
      }

      if (params.familyType) {
        query = query.ilike("family_type_id", `%${params.familyType}%`);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (!error && data && data.length > 0) {
        return { success: true, data: data };
      }

      // Fallback to quote_mappings
      let mappingsQuery = quoteDB.from("quote_mappings").select("*");

      if (params.destination) {
        mappingsQuery = mappingsQuery.ilike(
          "destination",
          `%${params.destination}%`
        );
      }

      const { data: mappingsData, error: mappingsError } =
        await mappingsQuery.order("created_at", { ascending: false });

      if (!mappingsError && mappingsData) {
        return { success: true, data: mappingsData };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error("Error searching packages:", error);
      return { success: false, data: [], error };
    }
  },

  // Get package details by ID
  async getPackageDetails(packageId: string) {
    try {
      // Try family_type_prices first
      const { data: priceData, error: priceError } = await quoteDB
        .from("family_type_prices")
        .select("*")
        .eq("id", packageId)
        .single();

      if (!priceError && priceData) {
        return { success: true, data: priceData };
      }

      // Try quote_mappings
      const { data: mappingData, error: mappingError } = await quoteDB
        .from("quote_mappings")
        .select("*")
        .eq("id", packageId)
        .single();

      if (!mappingError && mappingData) {
        return { success: true, data: mappingData };
      }

      // Try quotes
      const { data: quoteData, error: quoteError } = await quoteDB
        .from("quotes")
        .select("*")
        .eq("id", packageId)
        .single();

      if (!quoteError && quoteData) {
        return { success: true, data: quoteData };
      }

      return { success: false, data: null, error: "Package not found" };
    } catch (error) {
      console.error("Error fetching package details:", error);
      return { success: false, data: null, error };
    }
  },

  // Submit quote request
  async submitQuoteRequest(quoteData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    destination?: string;
    familyType?: string;
    travelMonth?: string;
  }) {
    try {
      const { data, error } = await quoteDB
        .from("public_family_quotes")
        .insert([
          {
            customer_name: `${quoteData.firstName} ${quoteData.lastName}`,
            customer_email: quoteData.email,
            customer_phone: quoteData.phone,
            destination: quoteData.destination,
            family_type: quoteData.familyType,
            travel_month: quoteData.travelMonth,
            created_at: new Date().toISOString(),
            status: "pending",
          },
        ]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error submitting quote request:", error);
      return { success: false, error };
    }
  },

  // User authentication - Login (using correct table: mobile_users)
  async loginUser(mobileNumber: string, pin: string) {
    try {
      const { data, error } = await quoteDB
        .from("mobile_users")
        .select("*")
        .eq("mobile_number", mobileNumber)
        .single();

      if (error) throw error;
      if (!data) throw new Error("User not found");

      // Simple PIN verification (in production, use bcrypt)
      if (data.pin_hash !== pin) {
        throw new Error("Invalid PIN");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, data: null, error };
    }
  },

  // User authentication - Register (using correct table: mobile_users)
  async registerUser(userData: {
    name: string;
    email: string;
    mobileNumber: string;
    pin: string;
  }) {
    try {
      const nameParts = userData.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data, error } = await quoteDB.from("mobile_users").insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: userData.email.toLowerCase(),
          mobile_number: userData.mobileNumber,
          pin_hash: userData.pin, // In production, hash with bcrypt
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, error };
    }
  },

  // Get EMI transactions
  async getEMITransactions() {
    try {
      const { data, error } = await quoteDB
        .from("prepaid_emi_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching EMI transactions:", error);
      return { success: false, data: [], error };
    }
  },

  // Get EMI plans
  async getEMIPlans() {
    try {
      const { data, error } = await quoteDB
        .from("family_type_emi_plans")
        .select("*")
        .order("emi_months", { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching EMI plans:", error);
      return { success: false, data: [], error };
    }
  },

  // Get family type prices
  async getFamilyTypePrices() {
    try {
      const { data, error } = await quoteDB
        .from("family_type_prices")
        .select("*")
        .eq("is_public_visible", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching family type prices:", error);
      return { success: false, data: [], error };
    }
  },
};

// Helper Functions (migrated from backup databaseService.js)

// Detect family type based on traveler counts
export function detectFamilyType(
  adults: number,
  children: number,
  infants: number
): string {
  const totalMembers = adults + children + infants;

  // Exact matching patterns
  if (adults === 2 && children === 0 && infants === 0) return "Couple";
  if (adults === 2 && children === 1 && infants === 0) return "2A1C";
  if (adults === 2 && children === 2 && infants === 0) return "2A2C";
  if (adults === 2 && children === 1 && infants === 1) return "2A1C1I";
  if (adults === 2 && children === 2 && infants === 1) return "2A2C1I";
  if (adults === 3 && children === 0 && infants === 0) return "3A";
  if (adults === 3 && children === 1 && infants === 0) return "3A1C";
  if (adults === 4 && children === 0 && infants === 0) return "4A";
  if (adults === 4 && children === 1 && infants === 0) return "4A1C";
  if (adults === 4 && children === 2 && infants === 0) return "4A2C";

  // Default based on composition
  if (totalMembers <= 2) return "Couple";
  if (totalMembers <= 4) return "Small Family";
  if (totalMembers <= 6) return "Medium Family";
  return "Large Family";
}

// Generate EMI options based on total price
export function generateEMIOptions(totalPrice: number): EMIOption[] {
  return [
    {
      months: 3,
      monthlyAmount: Math.ceil(totalPrice / 3),
      totalAmount: Math.ceil(totalPrice / 3) * 3,
      processingFee: 0,
      label: "Quick Pay",
      isFeatured: false,
    },
    {
      months: 6,
      monthlyAmount: Math.ceil(totalPrice / 6),
      totalAmount: Math.ceil(totalPrice / 6) * 6,
      processingFee: 0,
      label: "Best Value",
      isFeatured: true,
    },
    {
      months: 9,
      monthlyAmount: Math.ceil(totalPrice / 9),
      totalAmount: Math.ceil(totalPrice / 9) * 9,
      processingFee: 0,
      label: "Flexible",
      isFeatured: false,
    },
    {
      months: 12,
      monthlyAmount: Math.ceil(totalPrice / 12),
      totalAmount: Math.ceil(totalPrice / 12) * 12,
      processingFee: 0,
      label: "Low Monthly",
      isFeatured: false,
    },
  ];
}

// Generate detailed itinerary based on package data
export function generateDetailedItinerary(
  packageData: PackageData
): ItineraryDay[] {
  const destination =
    packageData.destination ||
    packageData.destination_category ||
    "Destination";
  const nights =
    packageData.package_duration_days ||
    packageData.duration_days ||
    packageData.nights ||
    5;
  const itinerary: ItineraryDay[] = [];

  // Day 1 - Arrival
  itinerary.push({
    day: 1,
    title: `Arrival in ${destination}`,
    description: `Arrive at ${destination} airport/railway station. Meet and greet by our representative. Transfer to hotel and check-in. Rest of the day at leisure. Overnight stay at hotel.`,
    meals: ["Dinner"],
  });

  // Middle days - Sightseeing
  const dest = destination.toLowerCase();
  for (let day = 2; day <= nights; day++) {
    let dayTitle = "";
    let dayDescription = "";

    if (dest.includes("kashmir")) {
      if (day === 2) {
        dayTitle = "Srinagar Local Sightseeing";
        dayDescription =
          "After breakfast, visit Mughal Gardens - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Enjoy Shikara ride in Dal Lake. Visit local markets. Overnight stay at hotel.";
      } else if (day === 3) {
        dayTitle = "Srinagar to Gulmarg";
        dayDescription =
          "After breakfast, drive to Gulmarg (2 hours). Enjoy Gondola ride (Phase 1 & 2). Experience snow activities. Return to Srinagar. Overnight stay at hotel.";
      } else {
        dayTitle = "Pahalgam Excursion";
        dayDescription =
          "After breakfast, full day excursion to Pahalgam. Visit Betaab Valley, Aru Valley, and Chandanwari. Return to Srinagar. Overnight stay at hotel.";
      }
    } else if (dest.includes("goa")) {
      if (day === 2) {
        dayTitle = "North Goa Sightseeing";
        dayDescription =
          "After breakfast, visit North Goa beaches - Calangute, Baga, Anjuna. Visit Fort Aguada. Enjoy water sports. Overnight stay at hotel.";
      } else if (day === 3) {
        dayTitle = "South Goa Sightseeing";
        dayDescription =
          "After breakfast, visit South Goa beaches - Colva, Benaulim. Visit Old Goa churches. Spice plantation tour. Overnight stay at hotel.";
      } else {
        dayTitle = "Leisure Day";
        dayDescription =
          "Day at leisure. Enjoy beach activities, shopping, or optional tours. Overnight stay at hotel.";
      }
    } else if (dest.includes("manali")) {
      if (day === 2) {
        dayTitle = "Manali Local Sightseeing";
        dayDescription =
          "After breakfast, visit Hadimba Temple, Vashisht Temple, Tibetan Monastery, and Mall Road. Overnight stay at hotel.";
      } else if (day === 3) {
        dayTitle = "Solang Valley Excursion";
        dayDescription =
          "After breakfast, visit Solang Valley. Enjoy adventure activities like paragliding, zorbing. Return to hotel. Overnight stay.";
      } else {
        dayTitle = "Rohtang Pass / Atal Tunnel";
        dayDescription =
          "After breakfast, drive to Rohtang Pass or Atal Tunnel. Enjoy snow activities. Return to hotel. Overnight stay.";
      }
    } else if (dest.includes("kerala")) {
      if (day === 2) {
        dayTitle = "Munnar Sightseeing";
        dayDescription =
          "After breakfast, visit tea plantations, Mattupetty Dam, Echo Point, and Flower Garden. Overnight stay at hotel.";
      } else if (day === 3) {
        dayTitle = "Alleppey Houseboat";
        dayDescription =
          "After breakfast, check out and drive to Alleppey. Board the houseboat for a backwater cruise. Enjoy traditional Kerala cuisine. Overnight stay on houseboat.";
      } else {
        dayTitle = "Kovalam Beach";
        dayDescription =
          "After breakfast, drive to Kovalam. Relax at the beach. Visit Trivandrum. Overnight stay at hotel.";
      }
    } else {
      dayTitle = `${destination} Sightseeing - Day ${day - 1}`;
      dayDescription = `After breakfast, proceed for sightseeing tour of ${destination}. Visit major attractions and local markets. Return to hotel. Overnight stay at hotel.`;
    }

    itinerary.push({
      day,
      title: dayTitle,
      description: dayDescription,
      meals: ["Breakfast", "Dinner"],
    });
  }

  // Last day - Departure
  itinerary.push({
    day: nights + 1,
    title: "Departure",
    description: `After breakfast, check-out from hotel. Transfer to airport/railway station for onward journey. Tour ends with sweet memories.`,
    meals: ["Breakfast"],
  });

  return itinerary;
}

// Generate cost breakdown
export function generateCostBreakdown(
  packageData: PackageData
): CostBreakdownItem[] {
  const breakdown: CostBreakdownItem[] = [];

  if (packageData.hotel_cost && packageData.hotel_cost > 0) {
    breakdown.push({
      item: "Accommodation",
      cost: packageData.hotel_cost,
      description: `${
        packageData.package_duration_days || packageData.nights || 5
      } nights hotel stay`,
    });
  }

  if (packageData.vehicle_cost && packageData.vehicle_cost > 0) {
    breakdown.push({
      item: "Transportation",
      cost: packageData.vehicle_cost,
      description: "Private vehicle for transfers and sightseeing",
    });
  }

  if (packageData.additional_costs) {
    const costs = packageData.additional_costs;
    const familyCount = packageData.family_count || 4;

    if (costs.meal_cost_per_person && costs.meal_cost_per_person > 0) {
      breakdown.push({
        item: "Meals",
        cost: costs.meal_cost_per_person * familyCount,
        description: `Meals for ${familyCount} persons`,
      });
    }

    if (costs.ferry_cost && costs.ferry_cost > 0) {
      const ferryPersons =
        (packageData.no_of_adults || 2) +
        (packageData.no_of_children || 0) +
        (packageData.no_of_child || 0);
      breakdown.push({
        item: "Ferry",
        cost: costs.ferry_cost * ferryPersons,
        description: `Ferry tickets for ${ferryPersons} persons (excluding infants)`,
      });
    }

    if (costs.activity_cost_per_person && costs.activity_cost_per_person > 0) {
      breakdown.push({
        item: "Activities",
        cost: costs.activity_cost_per_person * familyCount,
        description: `Activities for ${familyCount} persons`,
      });
    }

    if (costs.guide_cost_per_day && costs.guide_cost_per_day > 0) {
      const days = packageData.package_duration_days || packageData.nights || 5;
      breakdown.push({
        item: "Guide",
        cost: costs.guide_cost_per_day * days,
        description: `Professional guide for ${days} days`,
      });
    }
  }

  // Add other charges if total doesn't match
  const calculatedTotal = breakdown.reduce((sum, item) => sum + item.cost, 0);
  const actualTotal = packageData.total_price || 0;
  if (calculatedTotal > 0 && calculatedTotal !== actualTotal) {
    breakdown.push({
      item: "Other charges",
      cost: actualTotal - calculatedTotal,
      description: "Taxes, service charges, and other fees",
    });
  }

  return breakdown;
}

// Check if ferry is included
export function isFerryIncluded(packageData: PackageData): boolean {
  if (
    packageData.additional_costs &&
    packageData.additional_costs.ferry_cost &&
    packageData.additional_costs.ferry_cost > 0
  ) {
    return true;
  }
  if (
    packageData.quote_mapping_data?.additional_costs?.ferry_cost &&
    packageData.quote_mapping_data.additional_costs.ferry_cost > 0
  ) {
    return true;
  }
  return false;
}

// Check if guide is included
export function isGuideIncluded(packageData: PackageData): boolean {
  if (
    packageData.additional_costs &&
    packageData.additional_costs.guide_cost_per_day &&
    packageData.additional_costs.guide_cost_per_day > 0
  ) {
    return true;
  }
  if (
    packageData.quote_mapping_data?.additional_costs?.guide_cost_per_day &&
    packageData.quote_mapping_data.additional_costs.guide_cost_per_day > 0
  ) {
    return true;
  }
  // Include guide for premium packages
  return (packageData.total_price || 0) > 60000;
}

// Get included activities based on destination
export function getIncludedActivities(packageData: PackageData): string[] {
  const activities: string[] = [];
  const hasActivityCost =
    packageData.additional_costs?.activity_cost_per_person &&
    packageData.additional_costs.activity_cost_per_person > 0;

  if (hasActivityCost) {
    const destination = (
      packageData.destination ||
      packageData.destination_category ||
      ""
    ).toLowerCase();

    if (destination.includes("kashmir")) {
      activities.push("Shikara ride in Dal Lake", "Gondola ride in Gulmarg");
    } else if (destination.includes("goa")) {
      activities.push("Water sports activities", "Beach activities");
    } else if (destination.includes("manali")) {
      activities.push("Adventure activities", "Local sightseeing");
    } else if (destination.includes("andaman")) {
      activities.push("Snorkeling", "Island hopping");
    } else if (destination.includes("kerala")) {
      activities.push("Houseboat cruise", "Spice plantation tour");
    } else {
      activities.push("Local activities and experiences");
    }
  }

  return activities;
}

// Generate package description
export function generatePackageDescription(packageData: PackageData): string {
  const destination =
    packageData.destination ||
    packageData.destination_category ||
    "your destination";
  const nights =
    packageData.package_duration_days ||
    packageData.duration_days ||
    packageData.nights ||
    5;
  const familyType = packageData.family_type_name || "families";

  let description = `Experience the beauty and charm of ${destination} with our specially crafted ${nights}-night family package. `;
  description += `Perfect for ${familyType.toLowerCase()}, this package offers a perfect blend of comfort, adventure, and relaxation. `;

  const dest = destination.toLowerCase();
  if (dest.includes("kashmir")) {
    description +=
      "Explore the paradise on earth with its pristine lakes, snow-capped mountains, and beautiful gardens. ";
  } else if (dest.includes("goa")) {
    description +=
      "Enjoy the sun, sand, and sea with beautiful beaches, vibrant nightlife, and Portuguese heritage. ";
  } else if (dest.includes("manali")) {
    description +=
      "Discover the hill station beauty with adventure activities, scenic landscapes, and pleasant weather. ";
  } else if (dest.includes("kerala")) {
    description +=
      "Experience God's own country with backwaters, spice plantations, and cultural heritage. ";
  } else if (dest.includes("rajasthan")) {
    description +=
      "Explore the royal heritage with magnificent forts, palaces, and vibrant culture. ";
  }

  description +=
    "All arrangements are made to ensure a memorable and hassle-free vacation for your family.";

  return description;
}

// Get package validity
export function getPackageValidity(packageData: PackageData): string {
  if (packageData.travel_date) {
    return `Valid for travel: ${new Date(
      packageData.travel_date
    ).toLocaleDateString()}`;
  }
  if (packageData.created_at) {
    const validUntil = new Date(packageData.created_at);
    validUntil.setMonth(validUntil.getMonth() + 6);
    return `Valid until: ${validUntil.toLocaleDateString()}`;
  }
  return "Valid for booking";
}

// Get package type based on price
export function getPackageTypeByPrice(price: number): string {
  if (price > 80000) return "Luxury";
  if (price > 50000) return "Premium";
  if (price > 30000) return "Deluxe";
  return "Standard";
}

// Get offer badge based on price
export function getOfferBadge(price: number): string {
  if (price > 60000) return "20% OFF";
  if (price > 40000) return "15% OFF";
  if (price > 25000) return "10% OFF";
  return "Best Value";
}

// Extract hotel details from package
export function extractHotelDetails(packageData: PackageData): {
  name: string;
  category: string;
  roomType: string;
} {
  return {
    name: packageData.hotel_name || "Premium Hotel",
    category: packageData.hotel_category || "4 Star",
    roomType: packageData.room_type || "Deluxe Room",
  };
}

// Extract meal plan details
export function extractMealPlanDetails(packageData: PackageData): {
  plan: string;
  details: string[];
} {
  const mealPlan = packageData.meal_plan || "MAP";
  const details: string[] = [];

  if (
    mealPlan.toLowerCase().includes("ap") ||
    mealPlan.toLowerCase().includes("all")
  ) {
    details.push("Breakfast", "Lunch", "Dinner");
  } else if (mealPlan.toLowerCase().includes("map")) {
    details.push("Breakfast", "Dinner");
  } else if (
    mealPlan.toLowerCase().includes("cp") ||
    mealPlan.toLowerCase().includes("bb")
  ) {
    details.push("Breakfast");
  } else if (mealPlan.toLowerCase().includes("ep")) {
    // No meals
  } else {
    details.push("Breakfast", "Dinner"); // Default
  }

  return { plan: mealPlan, details };
}

// Get detailed inclusions
export function extractDetailedInclusions(packageData: PackageData): string[] {
  const inclusions: string[] = [];

  // Hotel accommodation
  const nights = packageData.package_duration_days || packageData.nights || 5;
  const hotelName = packageData.hotel_name || "selected hotel";
  inclusions.push(`${nights} nights accommodation at ${hotelName}`);

  // Transfers
  inclusions.push("Airport/Railway station transfers");
  inclusions.push("All sightseeing by private AC vehicle");

  // Meals
  const mealInfo = extractMealPlanDetails(packageData);
  if (mealInfo.details.length > 0) {
    inclusions.push(`Daily ${mealInfo.details.join(" and ").toLowerCase()}`);
  }

  // Ferry if included
  if (isFerryIncluded(packageData)) {
    inclusions.push("Ferry tickets (adults and children)");
  }

  // Guide if included
  if (isGuideIncluded(packageData)) {
    inclusions.push("Professional tour guide");
  }

  // Activities
  const activities = getIncludedActivities(packageData);
  if (activities.length > 0) {
    inclusions.push(...activities);
  } else {
    inclusions.push("All sightseeing as per itinerary");
  }

  // Additional inclusions based on price
  const totalPrice = packageData.total_price || 0;
  if (totalPrice > 50000) {
    inclusions.push("Welcome drink on arrival");
  }
  if (totalPrice > 80000) {
    inclusions.push("Complimentary Wi-Fi");
    inclusions.push("24/7 customer support");
  }

  inclusions.push("All applicable taxes");

  return inclusions;
}

// Get detailed exclusions
export function extractDetailedExclusions(packageData: PackageData): string[] {
  const exclusions: string[] = [];

  if (!isFerryIncluded(packageData)) {
    exclusions.push("Ferry tickets");
  }

  if (!isGuideIncluded(packageData)) {
    exclusions.push("Tour guide charges");
  }

  exclusions.push(
    "Airfare (can be arranged separately)",
    "Personal expenses like laundry, telephone calls, tips, etc.",
    "Travel insurance",
    "Any meals not mentioned in inclusions",
    "Entry fees to monuments and parks",
    "Camera fees at monuments",
    "Medical expenses",
    "Any expenses arising due to unforeseen circumstances",
    "Anything not mentioned in inclusions"
  );

  return exclusions;
}

// Format package for frontend display
export function formatPackageForFrontend(packageData: PackageData) {
  const totalPrice = packageData.total_price || packageData.subtotal || 25000;
  const nights = packageData.package_duration_days || packageData.nights || 3;
  const destination =
    packageData.destination || packageData.destination_category || "Travel";

  return {
    id: packageData.id,
    title: `${destination} Package`,
    destination,
    duration: `${nights}N/${nights + 1}D`,
    nights,
    days: nights + 1,
    image: `/rectangle-14.png`,
    totalPrice,
    emiAmount: Math.ceil(totalPrice / 6),
    emiMonths: 6,
    inclusions: ["Flights", "Hotels", "Meals", "Sightseeing"],
    offerBadge: getOfferBadge(totalPrice),
    offerType: totalPrice > 40000 ? "discount" : "bestValue",
    familyType: packageData.family_type_name || packageData.family_type_id,
    hotel: extractHotelDetails(packageData),
    mealPlan: packageData.meal_plan || "Breakfast & Dinner",
    emiOptions: generateEMIOptions(totalPrice),
  };
}

// Export helper for generating UUID
export { generateUUID };
