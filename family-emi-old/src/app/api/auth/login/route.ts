import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

export async function POST(request: Request) {
  try {
    const { mobileNumber, pin } = await request.json();

    // Validate input
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

    // Get user from mobile_users table
    const { data: userData, error: userError } = await quoteDB
      .from("mobile_users")
      .select(
        "id, mobile_number, first_name, last_name, email, pin_hash, is_active, failed_login_attempts, account_locked_until"
      )
      .eq("mobile_number", mobileNumber)
      .single();

    if (userError) {
      if (userError.code === "PGRST116") {
        return NextResponse.json(
          {
            success: false,
            error:
              "User not found. Please check your mobile number or sign up first.",
          },
          { status: 401 }
        );
      }
      throw userError;
    }

    // Check if account is locked
    if (
      userData.account_locked_until &&
      new Date(userData.account_locked_until) > new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Account is temporarily locked. Please try again later.",
        },
        { status: 423 }
      );
    }

    // Check if account is active
    if (!userData.is_active) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Simple PIN comparison (for production, use bcrypt)
    // Note: The backup uses bcrypt hashing - for now, we'll do a simple comparison
    // TODO: Implement bcrypt PIN verification
    const pinMatch = userData.pin_hash === pin;

    if (!pinMatch) {
      // Increment failed login attempts
      const newFailedAttempts = (userData.failed_login_attempts || 0) + 1;
      const updateData: {
        failed_login_attempts: number;
        last_login_attempt: string;
        account_locked_until?: string;
      } = {
        failed_login_attempts: newFailedAttempts,
        last_login_attempt: new Date().toISOString(),
      };

      // Lock account after 5 failed attempts
      if (newFailedAttempts >= 5) {
        updateData.account_locked_until = new Date(
          Date.now() + 30 * 60 * 1000
        ).toISOString(); // 30 minutes
      }

      await quoteDB
        .from("mobile_users")
        .update(updateData)
        .eq("id", userData.id);

      return NextResponse.json(
        {
          success: false,
          error:
            newFailedAttempts >= 5
              ? "Account locked due to multiple failed attempts. Please try again in 30 minutes."
              : "Incorrect PIN. Please check and try again.",
        },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = crypto.randomUUID();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Update user with successful login
    await quoteDB
      .from("mobile_users")
      .update({
        failed_login_attempts: 0,
        last_successful_login: new Date().toISOString(),
        current_session_token: sessionToken,
        session_expires_at: sessionExpiry.toISOString(),
        account_locked_until: null,
      })
      .eq("id", userData.id);

    // Return user data
    const safeUser = {
      id: userData.id,
      name:
        `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
        "User",
      email: userData.email,
      mobileNumber: userData.mobile_number,
      sessionToken,
      sessionExpiry: sessionExpiry.toISOString(),
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
