import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const quoteDB = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_QUOTE ||
    "https://lkqbrlrmrsnbtkoryazq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUOTE || ""
);

interface TransactionData {
  id: string;
  booking_reference?: string;
  customer_id?: string;
  advance_payment_amount?: number;
  advance_payment_status?: string;
  advance_payment_date?: string;
  total_emi_amount?: number;
  monthly_emi_amount?: number;
  remaining_emi_months?: number;
  next_emi_due_date?: string;
  total_paid_amount?: number;
  pending_amount?: number;
  payment_status?: string;
  auto_debit_enabled?: boolean;
  payment_method?: string;
  created_at?: string;
  customer_data?: {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    destination?: string;
  };
}

// Get EMI transactions for management dashboard
export async function GET() {
  try {
    console.log("📊 Fetching EMI transactions...");

    // Fetch EMI transactions
    const { data: transactions, error: transactionError } = await quoteDB
      .from("prepaid_emi_transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (transactionError) {
      console.error("❌ Error fetching EMI transactions:", transactionError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch EMI transactions",
          details: transactionError.message,
        },
        { status: 500 }
      );
    }

    // Fetch customer data for each transaction
    const transactionsWithCustomerData: TransactionData[] = [];

    for (const transaction of transactions || []) {
      let customerData = null;

      if (transaction.customer_id) {
        const { data: quoteData, error: quoteError } = await quoteDB
          .from("public_family_quotes")
          .select("customer_name, customer_email, customer_phone, destination")
          .eq("id", transaction.customer_id)
          .single();

        if (!quoteError && quoteData) {
          customerData = quoteData;
        }
      }

      transactionsWithCustomerData.push({
        ...transaction,
        customer_data: customerData,
      });
    }

    // Transform data to match frontend interface
    const formattedTransactions = transactionsWithCustomerData.map(
      (transaction, index) => ({
        id: transaction.id,
        booking_reference: transaction.booking_reference,
        customer_name:
          transaction.customer_data?.customer_name || `Customer ${index + 1}`,
        customer_phone:
          transaction.customer_data?.customer_phone || "+91 XXXXXXXXXX",
        customer_email:
          transaction.customer_data?.customer_email || "customer@example.com",
        package_name: transaction.customer_data?.destination
          ? `${transaction.customer_data.destination} Package`
          : "Travel Package",
        advance_payment_amount: transaction.advance_payment_amount,
        advance_payment_status: transaction.advance_payment_status,
        advance_payment_date: transaction.advance_payment_date,
        total_emi_amount: transaction.total_emi_amount,
        monthly_emi_amount: transaction.monthly_emi_amount,
        remaining_emi_months: transaction.remaining_emi_months,
        next_emi_due_date: transaction.next_emi_due_date,
        total_paid_amount: transaction.total_paid_amount,
        pending_amount: transaction.pending_amount,
        payment_status: transaction.payment_status,
        auto_debit_enabled: transaction.auto_debit_enabled,
        payment_method: transaction.payment_method,
        created_at: transaction.created_at,
      })
    );

    console.log(
      `✅ Successfully fetched ${formattedTransactions.length} EMI transactions`
    );

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      count: formattedTransactions.length,
    });
  } catch (error) {
    console.error("❌ Error in EMI transactions endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
