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
  meal_plan?: string;
  created_at?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination");
    const familyType = searchParams.get("familyType");

    // Method 1: Try family_type_prices table
    let query = quoteDB
      .from("family_type_prices")
      .select("*")
      .eq("is_public_visible", true);

    // Filter by destination category
    if (destination) {
      query = query.ilike("destination_category", `%${destination}%`);
    }

    // Filter by family type if provided
    if (familyType) {
      query = query.ilike("family_type_id", `%${familyType}%`);
    }

    const { data: pricesData, error: pricesError } = await query
      .order("public_display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(20);

    if (!pricesError && pricesData && pricesData.length > 0) {
      const packages = (pricesData as PackageData[]).map((pkg) => ({
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

      return NextResponse.json({
        success: true,
        packages,
        total: packages.length,
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
      const packages = mappingsData.map((pkg: PackageData) => ({
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

      return NextResponse.json({
        success: true,
        packages,
        total: packages.length,
      });
    }

    // Method 3: Try quotes table
    let quotesQuery = quoteDB.from("quotes").select("*");

    if (destination) {
      quotesQuery = quotesQuery.ilike("destination", `%${destination}%`);
    }

    const { data: quotesData, error: quotesError } = await quotesQuery
      .order("created_at", { ascending: false })
      .limit(20);

    if (!quotesError && quotesData && quotesData.length > 0) {
      const packages = quotesData.map((pkg: PackageData) => ({
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
      }));

      return NextResponse.json({
        success: true,
        packages,
        total: packages.length,
      });
    }

    // Return empty array if no data found
    return NextResponse.json({
      success: true,
      packages: [],
      total: 0,
    });
  } catch (error) {
    console.error("Packages search error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
