import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

interface SearchParams {
  destination?: string;
  familyType?: string;
  family_type?: string;
  travelMonth?: string;
  travel_month?: string;
  adults?: number;
  children?: number;
  infants?: number;
  session_id?: string;
  utm_source?: string;
}

interface PackageResult {
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
  meal_plan?: string;
}

export async function POST(request: Request) {
  try {
    console.log("🔍 Package search request received...");

    const body: SearchParams = await request.json();
    const { destination, familyType, family_type, adults, children, infants } =
      body;

    const selectedFamilyType = familyType || family_type;

    // Method 1: Try family_type_prices table
    let query = quoteDB
      .from("family_type_prices")
      .select("*")
      .eq("is_public_visible", true);

    if (destination) {
      query = query.ilike("destination_category", `%${destination}%`);
    }

    if (selectedFamilyType) {
      query = query.or(
        `family_type_id.ilike.%${selectedFamilyType}%,family_type_name.ilike.%${selectedFamilyType}%`
      );
    }

    const { data: pricesData, error: pricesError } = await query
      .order("public_display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(20);

    if (!pricesError && pricesData && pricesData.length > 0) {
      const packages = (pricesData as PackageResult[]).map((pkg) => ({
        id: pkg.id,
        title:
          pkg.public_display_title ||
          pkg.quote_name ||
          `${pkg.destination_category || "Travel"} Package`,
        destination: pkg.destination_category || pkg.destination,
        duration: `${pkg.nights || 3}N/${(pkg.nights || 3) + 1}D`,
        nights: pkg.nights || 3,
        days: (pkg.nights || 3) + 1,
        image: `/rectangle-14.png`,
        totalPrice: pkg.total_price || pkg.subtotal || 25000,
        emiAmount: Math.ceil((pkg.total_price || pkg.subtotal || 25000) / 6),
        emiMonths: 6,
        emiOptions: [
          {
            months: 3,
            amount: Math.ceil((pkg.total_price || pkg.subtotal || 25000) / 3),
            label: "Quick Pay",
          },
          {
            months: 6,
            amount: Math.ceil((pkg.total_price || pkg.subtotal || 25000) / 6),
            label: "Best Value",
            featured: true,
          },
          {
            months: 12,
            amount: Math.ceil((pkg.total_price || pkg.subtotal || 25000) / 12),
            label: "Low Monthly",
          },
        ],
        inclusions: ["Flights", "Hotels", "Meals", "Sightseeing"],
        offerBadge:
          (pkg.total_price || pkg.subtotal || 0) > 40000
            ? "15% OFF"
            : "Best Value",
        offerType:
          (pkg.total_price || pkg.subtotal || 0) > 40000
            ? "discount"
            : "bestValue",
        familyType: pkg.family_type_name || pkg.family_type_id,
        hotel: pkg.hotel_name,
        mealPlan: pkg.meal_plan,
      }));

      console.log(
        `✅ Found ${packages.length} packages from family_type_prices`
      );

      return NextResponse.json({
        success: true,
        packages,
        total: packages.length,
        search_params: {
          destination,
          family_type: selectedFamilyType,
          adults,
          children,
          infants,
        },
      });
    }

    // Method 2: Try quote_mappings table
    let mappingsQuery = quoteDB.from("quote_mappings").select("*");

    if (destination) {
      mappingsQuery = mappingsQuery.ilike("destination", `%${destination}%`);
    }

    const { data: mappingsData, error: mappingsError } = await mappingsQuery
      .order("created_at", { ascending: false })
      .limit(20);

    if (!mappingsError && mappingsData && mappingsData.length > 0) {
      const packages = (mappingsData as PackageResult[]).map((pkg) => ({
        id: pkg.id,
        title: pkg.quote_name || `${pkg.destination || "Travel"} Package`,
        destination: pkg.destination,
        duration: `${pkg.nights || 3}N/${(pkg.nights || 3) + 1}D`,
        nights: pkg.nights || 3,
        days: (pkg.nights || 3) + 1,
        image: `/rectangle-14.png`,
        totalPrice: pkg.total_price || 25000,
        emiAmount: Math.ceil((pkg.total_price || 25000) / 6),
        emiMonths: 6,
        inclusions: ["Flights", "Hotels", "Meals", "Sightseeing"],
        offerBadge: (pkg.total_price || 0) > 40000 ? "15% OFF" : "Best Value",
        offerType: (pkg.total_price || 0) > 40000 ? "discount" : "bestValue",
        familyType: pkg.family_type_name,
      }));

      console.log(`✅ Found ${packages.length} packages from quote_mappings`);

      return NextResponse.json({
        success: true,
        packages,
        total: packages.length,
        search_params: {
          destination,
          family_type: selectedFamilyType,
        },
      });
    }

    // No results found
    console.log("⚠️ No packages found");

    return NextResponse.json({
      success: true,
      packages: [],
      total: 0,
      message: "No packages found matching your criteria",
    });
  } catch (error) {
    console.error("❌ Package search error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
