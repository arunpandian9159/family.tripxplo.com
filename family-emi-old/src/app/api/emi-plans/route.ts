import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

// Get all EMI plans
export async function GET() {
  try {
    console.log("🔍 Fetching EMI plans...");

    const { data, error } = await quoteDB
      .from("family_type_emi_plans")
      .select("*")
      .order("emi_months", { ascending: true });

    if (error) {
      console.error("❌ Error fetching EMI plans:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("❌ EMI plans error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// Create EMI plans
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, familyPriceId, totalPrice } = body;

    if (action === "create-essential") {
      // Create 3 essential EMI plans (3, 6, 12 months)
      console.log("🔧 Creating essential EMI plans...");

      const basePrice = totalPrice || 30000;

      const essentialPlans = [
        {
          family_price_id: familyPriceId,
          emi_months: 3,
          monthly_amount: Math.round(basePrice / 3),
          total_amount: basePrice,
          processing_fee: Math.round(basePrice * 0.02),
          total_interest: 0,
          is_featured: false,
          marketing_label: "Quick Pay",
        },
        {
          family_price_id: familyPriceId,
          emi_months: 6,
          monthly_amount: Math.round(basePrice / 6),
          total_amount: basePrice,
          processing_fee: Math.round(basePrice * 0.03),
          total_interest: 0,
          is_featured: true,
          marketing_label: "Best Value",
        },
        {
          family_price_id: familyPriceId,
          emi_months: 12,
          monthly_amount: Math.round(basePrice / 12),
          total_amount: basePrice,
          processing_fee: Math.round(basePrice * 0.05),
          total_interest: 0,
          is_featured: false,
          marketing_label: "Low Monthly",
        },
      ];

      const { data, error } = await quoteDB
        .from("family_type_emi_plans")
        .insert(essentialPlans)
        .select();

      if (error) {
        console.error("❌ Error creating EMI plans:", error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Essential EMI plans created successfully",
        data: data || [],
        count: data?.length || 0,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ EMI plans creation error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
