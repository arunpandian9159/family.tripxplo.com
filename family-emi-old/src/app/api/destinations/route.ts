import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

export async function GET() {
  try {
    // Method 1: Try family_type_prices table (destination_category)
    const { data: pricesData, error: pricesError } = await quoteDB
      .from("family_type_prices")
      .select("destination_category")
      .eq("is_public_visible", true)
      .not("destination_category", "is", null)
      .limit(50);

    if (!pricesError && pricesData && pricesData.length > 0) {
      // Get unique destination categories
      const destinationMap = new Map<
        string,
        { destination: string; packages_available: number }
      >();
      pricesData.forEach((item) => {
        if (item.destination_category && item.destination_category.trim()) {
          const category = item.destination_category;
          if (!destinationMap.has(category)) {
            destinationMap.set(category, {
              destination: category,
              packages_available: 0,
            });
          }
          const current = destinationMap.get(category);
          if (current) {
            current.packages_available++;
          }
        }
      });

      const destinations = Array.from(destinationMap.values()).sort((a, b) =>
        a.destination.localeCompare(b.destination)
      );

      return NextResponse.json({ success: true, data: destinations });
    }

    // Method 2: Try quote_mappings table
    const { data: mappingsData, error: mappingsError } = await quoteDB
      .from("quote_mappings")
      .select("destination")
      .not("destination", "is", null)
      .limit(50);

    if (!mappingsError && mappingsData && mappingsData.length > 0) {
      const destinations = [
        ...new Set(mappingsData.map((item) => item.destination)),
      ]
        .filter((dest) => dest && dest.trim() !== "")
        .map((dest) => ({
          destination: dest,
          packages_available: mappingsData.filter(
            (item) => item.destination === dest
          ).length,
        }))
        .sort((a, b) => a.destination.localeCompare(b.destination));

      return NextResponse.json({ success: true, data: destinations });
    }

    // Method 3: Try quotes table
    const { data: quotesData, error: quotesError } = await quoteDB
      .from("quotes")
      .select("destination")
      .not("destination", "is", null)
      .limit(50);

    if (!quotesError && quotesData && quotesData.length > 0) {
      const destinations = [
        ...new Set(quotesData.map((item) => item.destination)),
      ]
        .filter((dest) => dest && dest.trim() !== "")
        .map((dest) => ({
          destination: dest,
          packages_available: quotesData.filter(
            (item) => item.destination === dest
          ).length,
        }))
        .sort((a, b) => a.destination.localeCompare(b.destination));

      return NextResponse.json({ success: true, data: destinations });
    }

    // Fallback: Return popular destinations
    const fallbackDestinations = [
      { destination: "Kashmir", packages_available: 0 },
      { destination: "Goa", packages_available: 0 },
      { destination: "Manali", packages_available: 0 },
      { destination: "Kerala", packages_available: 0 },
      { destination: "Rajasthan", packages_available: 0 },
      { destination: "Himachal Pradesh", packages_available: 0 },
      { destination: "Uttarakhand", packages_available: 0 },
      { destination: "Andaman", packages_available: 0 },
    ];

    return NextResponse.json({ success: true, data: fallbackDestinations });
  } catch (error) {
    console.error("Destinations error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
