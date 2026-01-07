import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const crmDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_CRM ||
    process.env.CRM_DB_URL ||
    "https://tlfwcnikdlwoliqzavxj.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_CRM ||
    process.env.CRM_ANON_KEY ||
    ""
);

// Helper function to format family composition
function formatFamilyComposition(familyType: {
  no_of_adults?: number;
  no_of_child?: number;
  no_of_children?: number;
  no_of_infants?: number;
}): string {
  const parts = [];
  if (familyType.no_of_adults && familyType.no_of_adults > 0) {
    parts.push(
      `${familyType.no_of_adults} Adult${familyType.no_of_adults > 1 ? "s" : ""}`
    );
  }
  if (familyType.no_of_child && familyType.no_of_child > 0) {
    parts.push(`${familyType.no_of_child} Child (2-5 yrs)`);
  }
  if (familyType.no_of_children && familyType.no_of_children > 0) {
    parts.push(`${familyType.no_of_children} Children (6-11 yrs)`);
  }
  if (familyType.no_of_infants && familyType.no_of_infants > 0) {
    parts.push(
      `${familyType.no_of_infants} Infant${familyType.no_of_infants > 1 ? "s" : ""}`
    );
  }
  return parts.join(" + ");
}

// GET all family types
export async function GET() {
  try {
    console.log("📊 Fetching family types from CRM database...");

    const { data, error } = await crmDB
      .from("family_type")
      .select("*")
      .order("family_type", { ascending: true });

    if (error) {
      console.error("Error fetching family types:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch family types" },
        { status: 500 }
      );
    }

    // Format data with composition string
    const formattedData = (data || []).map((ft) => ({
      ...ft,
      composition: formatFamilyComposition(ft),
    }));

    console.log(`✅ Loaded ${formattedData.length} family types from database`);

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Family types error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// POST - Detect family type based on traveler counts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adults = 2, children = 0, child = 0, infants = 0 } = body;

    console.log("🔍 Detecting family type for:", {
      adults,
      children,
      child,
      infants,
    });

    // Fetch all family types from database
    const { data: familyTypes, error } = await crmDB
      .from("family_type")
      .select("*")
      .order("family_type", { ascending: true });

    if (error) {
      console.error("Error fetching family types:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch family types" },
        { status: 500 }
      );
    }

    if (!familyTypes || familyTypes.length === 0) {
      console.log("⚠️ No family types found in database");
      return NextResponse.json({
        success: true,
        matched: null,
        fallback: {
          id: "custom",
          name: "Custom Family",
          composition: formatFamilyComposition({
            no_of_adults: adults,
            no_of_child: child,
            no_of_children: children,
            no_of_infants: infants,
          }),
        },
      });
    }

    // Exact match first - using correct field mapping from database
    let match = familyTypes.find(
      (ft) =>
        ft.no_of_adults === adults &&
        (ft.no_of_child || 0) === child &&
        (ft.no_of_children || 0) === children &&
        (ft.no_of_infants || 0) === infants
    );

    // If no exact match, try matching with combined children count
    if (!match) {
      const totalChildren = children + child;
      match = familyTypes.find(
        (ft) =>
          ft.no_of_adults === adults &&
          (ft.no_of_child || 0) + (ft.no_of_children || 0) === totalChildren &&
          (ft.no_of_infants || 0) === infants
      );
    }

    // If still no match, find closest match by adults and total children
    if (!match) {
      match = familyTypes.find(
        (ft) =>
          ft.no_of_adults === adults &&
          (ft.no_of_child || 0) + (ft.no_of_children || 0) >=
            children + child &&
          (ft.no_of_infants || 0) >= infants
      );
    }

    // If still no match, find by adults only
    if (!match) {
      match = familyTypes.find((ft) => ft.no_of_adults === adults);
    }

    // Default to first family type (Stellar Duo) if no match
    if (!match) {
      match =
        familyTypes.find((ft) => ft.family_id === "SD") || familyTypes[0];
    }

    // Ensure match has composition
    if (match) {
      match.composition = formatFamilyComposition(match);
    }

    console.log("✅ Family type matched:", {
      family_id: match?.family_id,
      family_type: match?.family_type,
      composition: match?.composition,
    });

    return NextResponse.json({
      success: true,
      matched: match,
      request: { adults, children, child, infants },
    });
  } catch (error) {
    console.error("Family type detection error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
