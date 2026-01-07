import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

interface PaymentRequest {
  quote_id: string;
  payment_method: string;
  payment_amount: number;
  emi_plan: {
    months: number;
    monthly_amount: number;
  };
  customer_data?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  package_data?: {
    title?: string;
    destination?: string;
    total_price?: number;
  };
  payment_reference?: string;
  gateway_reference?: string;
  test_status?: string;
}

// Generate booking reference
function generateBookingReference(): string {
  const prefix = "EMI";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    console.log("💳 Payment processing request received...");

    const body: PaymentRequest = await request.json();
    const {
      quote_id,
      payment_method,
      payment_amount,
      emi_plan,
      customer_data,
      package_data,
      payment_reference,
      gateway_reference,
      test_status,
    } = body;

    // Validate required fields
    if (!quote_id || !payment_method || !payment_amount || !emi_plan) {
      return NextResponse.json(
        { success: false, error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Get quote data
    const { data: quoteData, error: quoteError } = await quoteDB
      .from("public_family_quotes")
      .select("id, customer_email, customer_phone, customer_name, destination")
      .eq("id", quote_id)
      .single();

    if (quoteError || !quoteData) {
      console.error("❌ Error fetching quote:", quoteError);
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    // Calculate EMI transaction details
    const totalEmiAmount = emi_plan.monthly_amount * emi_plan.months;
    const remainingAmount = totalEmiAmount - payment_amount;
    const remainingMonths = emi_plan.months - 1;

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Calculate next EMI due date (next month)
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    nextDueDate.setDate(1); // First of next month

    // Create EMI transaction record
    const transactionData = {
      booking_reference: bookingReference,
      customer_id: quote_id,
      advance_payment_amount: payment_amount,
      advance_payment_status: test_status || "completed",
      advance_payment_date: new Date().toISOString(),
      total_emi_amount: totalEmiAmount,
      monthly_emi_amount: emi_plan.monthly_amount,
      remaining_emi_months: remainingMonths,
      next_emi_due_date: nextDueDate.toISOString().split("T")[0],
      total_paid_amount: payment_amount,
      pending_amount: remainingAmount,
      payment_status: remainingAmount > 0 ? "partial" : "completed",
      payment_method,
      auto_debit_enabled: false,
      payment_reference: payment_reference || null,
      gateway_reference: gateway_reference || null,
      created_at: new Date().toISOString(),
    };

    const { data: transaction, error: transactionError } = await quoteDB
      .from("prepaid_emi_transactions")
      .insert(transactionData)
      .select()
      .single();

    if (transactionError) {
      console.error("❌ Error creating transaction:", transactionError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create transaction",
          details: transactionError.message,
        },
        { status: 500 }
      );
    }

    // Create payment history record
    const paymentHistoryData = {
      emi_transaction_id: transaction.id,
      payment_date: new Date().toISOString(),
      amount_paid: payment_amount,
      payment_method,
      payment_status: "completed",
      payment_type: "advance",
      payment_reference: payment_reference || null,
      created_at: new Date().toISOString(),
    };

    await quoteDB.from("emi_payment_history").insert(paymentHistoryData);

    // Update quote status
    await quoteDB
      .from("public_family_quotes")
      .update({
        status: "payment_received",
        emi_transaction_id: transaction.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quote_id);

    console.log("✅ Payment processed successfully:", bookingReference);

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      booking_reference: bookingReference,
      transaction_id: transaction.id,
      payment_details: {
        amount_paid: payment_amount,
        remaining_amount: remainingAmount,
        remaining_months: remainingMonths,
        next_due_date: nextDueDate.toISOString().split("T")[0],
        monthly_emi: emi_plan.monthly_amount,
      },
      customer: {
        name: customer_data?.name || quoteData.customer_name,
        email: customer_data?.email || quoteData.customer_email,
        phone: customer_data?.phone || quoteData.customer_phone,
      },
      package: {
        title: package_data?.title || `${quoteData.destination} Package`,
        destination: package_data?.destination || quoteData.destination,
      },
    });
  } catch (error) {
    console.error("❌ Payment processing error:", error);
    return NextResponse.json(
      { success: false, error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
