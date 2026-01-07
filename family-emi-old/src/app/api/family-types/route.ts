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

export async function GET() {
  try {
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

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Family types error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
