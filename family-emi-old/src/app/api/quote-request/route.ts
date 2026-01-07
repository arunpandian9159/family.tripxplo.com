import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

interface QuoteRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination?: string;
  familyType?: string;
  travelMonth?: string;
  adults?: number;
  children?: number;
  infants?: number;
  budget?: string;
  message?: string;
  session_id?: string;
  utm_source?: string;
}

export async function POST(request: Request) {
  try {
    console.log("📝 Quote request received...");

    const body: QuoteRequestData = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      destination,
      familyType,
      travelMonth,
      adults,
      children,
      infants,
      budget,
      message,
      session_id,
      utm_source,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format (Indian mobile)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Create quote record
    const quoteData = {
      customer_name: `${firstName} ${lastName}`,
      customer_email: email.toLowerCase(),
      customer_phone: cleanPhone,
      destination: destination || null,
      family_type: familyType || null,
      travel_month: travelMonth || null,
      no_of_adults: adults || 2,
      no_of_children: children || 0,
      no_of_infants: infants || 0,
      budget_range: budget || null,
      customer_message: message || null,
      session_id: session_id || null,
      utm_source: utm_source || "direct",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await quoteDB
      .from("public_family_quotes")
      .insert(quoteData)
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating quote:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to submit quote request",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Quote created successfully:", data.id);

    return NextResponse.json({
      success: true,
      message:
        "Quote request submitted successfully! Our team will contact you shortly.",
      quote_id: data.id,
      reference: `QR-${data.id.slice(0, 8).toUpperCase()}`,
    });
  } catch (error) {
    console.error("❌ Quote request error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
