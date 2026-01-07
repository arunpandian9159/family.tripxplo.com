import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

export async function POST(request: Request) {
  try {
    const { name, email, mobileNumber, pin } = await request.json();

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format" },
        { status: 400 }
      );
    }

    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await quoteDB
      .from("mobile_users")
      .select("id")
      .eq("mobile_number", mobileNumber)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists with this mobile number",
        },
        { status: 409 }
      );
    }

    // Check if email already exists
    const { data: existingEmail } = await quoteDB
      .from("mobile_users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Parse name into first and last name
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Generate session token
    const sessionToken = crypto.randomUUID();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create new user
    // Note: For production, PIN should be hashed with bcrypt
    const { data: newUser, error: createError } = await quoteDB
      .from("mobile_users")
      .insert({
        mobile_number: mobileNumber,
        pin_hash: pin, // TODO: Hash with bcrypt in production
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        is_active: true,
        is_verified: true, // Auto-verify for now
        current_session_token: sessionToken,
        session_expires_at: sessionExpiry.toISOString(),
        last_successful_login: new Date().toISOString(),
      })
      .select("id, mobile_number, first_name, last_name, email, created_at")
      .single();

    if (createError) {
      console.error("Registration error:", createError);
      return NextResponse.json(
        { success: false, error: "Registration failed. Please try again." },
        { status: 500 }
      );
    }

    // Return user data
    const safeUser = {
      id: newUser.id,
      name: `${newUser.first_name} ${newUser.last_name}`.trim(),
      email: newUser.email,
      mobileNumber: newUser.mobile_number,
      sessionToken,
      sessionExpiry: sessionExpiry.toISOString(),
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
