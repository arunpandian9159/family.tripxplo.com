import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

interface PackageData {
  id: string;
  destination_category?: string;
  destination?: string;
  family_type_id?: string;
  family_type_name?: string;
  total_price?: number;
  subtotal?: number;
  nights?: number;
  public_display_title?: string;
  quote_name?: string;
  hotel_name?: string;
  hotel_category?: string;
  room_type?: string;
  meal_plan?: string;
  inclusions?: string[];
  exclusions?: string[];
  highlights?: string[];
  description?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, try family_type_prices table
    let pkg: PackageData | null = null;

    const { data: priceData, error: priceError } = await quoteDB
      .from("family_type_prices")
      .select("*")
      .eq("id", id)
      .single();

    if (!priceError && priceData) {
      pkg = priceData as PackageData;
    }

    // If not found, try quote_mappings
    if (!pkg) {
      const { data: mappingData, error: mappingError } = await quoteDB
        .from("quote_mappings")
        .select("*")
        .eq("id", id)
        .single();

      if (!mappingError && mappingData) {
        pkg = mappingData as PackageData;
      }
    }

    // If still not found, try quotes table
    if (!pkg) {
      const { data: quoteData, error: quoteError } = await quoteDB
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single();

      if (!quoteError && quoteData) {
        pkg = quoteData as PackageData;
      }
    }

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    // Calculate EMI options
    const totalPrice = pkg.total_price || pkg.subtotal || 25000;
    const emiOptions = [
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

    // Generate itinerary days
    const nights = pkg.nights || 3;
    const days = nights + 1;
    const destination = pkg.destination_category || pkg.destination || "Travel";
    const itinerary = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title:
        i === 0
          ? "Arrival & Check-in"
          : i === days - 1
          ? "Departure"
          : `Day ${i + 1} - Sightseeing`,
      description:
        i === 0
          ? `Arrive at ${destination}. Transfer to hotel and check-in. Relax and explore nearby areas.`
          : i === days - 1
          ? "Check-out from hotel. Transfer to airport/railway station for departure."
          : `Full day sightseeing in ${destination}. Visit local attractions and enjoy included activities.`,
      meals: i === days - 1 ? ["Breakfast"] : ["Breakfast", "Dinner"],
    }));

    // Format package details
    const packageDetails = {
      id: pkg.id,
      title:
        pkg.public_display_title || pkg.quote_name || `${destination} Package`,
      destination: destination,
      duration: `${nights}N/${days}D`,
      nights,
      days,
      image: `/rectangle-14.png`,
      totalPrice,
      familyType: pkg.family_type_name || pkg.family_type_id,
      description:
        pkg.description ||
        `Experience the beauty of ${destination} with our carefully curated package.`,

      // Hotel details
      hotel: {
        name: pkg.hotel_name || "Premium Hotel",
        category: pkg.hotel_category || "4 Star",
        roomType: pkg.room_type || "Deluxe Room",
      },

      // Meal plan
      mealPlan: pkg.meal_plan || "Breakfast & Dinner",

      // Inclusions & Exclusions
      inclusions: pkg.inclusions || [
        "Flights (Round Trip)",
        "Airport Transfers",
        "Hotel Accommodation",
        "Daily Breakfast & Dinner",
        "Sightseeing as per itinerary",
        "All taxes included",
      ],
      exclusions: pkg.exclusions || [
        "Personal expenses",
        "Tips & gratuities",
        "Travel insurance",
        "Anything not mentioned in inclusions",
      ],

      // Highlights
      highlights: pkg.highlights || [
        `Explore ${destination}`,
        "Comfortable hotel stay",
        "Guided sightseeing tours",
        "Hassle-free transfers",
      ],

      // EMI Options
      emiOptions,

      // Itinerary
      itinerary,

      // Offer
      offerBadge: totalPrice > 40000 ? "15% OFF" : "Best Value",
      offerType: totalPrice > 40000 ? "discount" : "bestValue",
    };

    return NextResponse.json({ success: true, package: packageDetails });
  } catch (error) {
    console.error("Package details error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
