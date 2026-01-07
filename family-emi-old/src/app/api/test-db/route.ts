import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const crmDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_CRM ||
    "https://tlfwcnikdlwoliqzavxj.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_CRM || ""
);

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

export async function GET() {
  try {
    console.log("🧪 Testing database connections...");

    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      tests: {} as Record<string, unknown>,
    };

    // Test CRM database - family_type table
    try {
      const { data: crmData, error: crmError } = await crmDB
        .from("family_type")
        .select("family_type")
        .limit(1);

      results.tests = {
        ...results.tests,
        crm: {
          status: crmError ? "failed" : "success",
          error: crmError?.message || null,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL_CRM || "configured",
          keyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_CRM,
          sample: crmData?.[0] || null,
        },
      };
    } catch (error) {
      results.tests = {
        ...results.tests,
        crm: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }

    // Test Quote database - family_type_prices table
    try {
      const { data: quoteData, error: quoteError } = await quoteDB
        .from("family_type_prices")
        .select("id, destination_category")
        .eq("is_public_visible", true)
        .limit(1);

      results.tests = {
        ...results.tests,
        quote: {
          status: quoteError ? "failed" : "success",
          error: quoteError?.message || null,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE || "configured",
          keyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE,
          sample: quoteData?.[0] || null,
        },
      };
    } catch (error) {
      results.tests = {
        ...results.tests,
        quote: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }

    // Test EMI transactions table
    try {
      const { data: emiData, error: emiError } = await quoteDB
        .from("prepaid_emi_transactions")
        .select("id")
        .limit(1);

      results.tests = {
        ...results.tests,
        emi_transactions: {
          status: emiError ? "failed" : "success",
          error: emiError?.message || null,
          accessible: !emiError,
          data_count: emiData?.length || 0,
        },
      };
    } catch (error) {
      results.tests = {
        ...results.tests,
        emi_transactions: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }

    // Test mobile_users table
    try {
      const { data: usersData, error: usersError } = await quoteDB
        .from("mobile_users")
        .select("id")
        .limit(1);

      results.tests = {
        ...results.tests,
        mobile_users: {
          status: usersError ? "failed" : "success",
          error: usersError?.message || null,
          accessible: !usersError,
        },
      };
    } catch (error) {
      results.tests = {
        ...results.tests,
        mobile_users: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }

    // Determine overall status
    const testResults = Object.values(results.tests) as Array<{
      status: string;
    }>;
    const allPassed = testResults.every((t) => t.status === "success");

    return NextResponse.json({
      success: allPassed,
      message: allPassed
        ? "All database connections successful"
        : "Some database connections failed",
      ...results,
    });
  } catch (error) {
    console.error("❌ Database test endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
