const BASE_URL = "http://localhost:3000/api/v1";
let token = "";
let bookingId = "";
let paymentId = "";

const testEmail = `test_emi_${Date.now()}@example.com`;
const testPassword = "Password123!";

async function runTests() {
  console.log("--- Starting Full EMI API Tests ---");

  // 1. Register
  console.log("\n1. Registering user...");
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "EMI Tester",
      email: testEmail,
      password: testPassword,
      phone: "9876543210",
    }),
  });
  const regData = await regRes.json();
  if (!regData.success) {
    console.error("Registration failed:", regData);
    process.exit(1);
  }
  token = regData.data.token;
  console.log("Registration success.");

  // 2. Create EMI Booking
  console.log("\n2. Creating EMI booking...");
  const bookingRes = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      packageId: "GOKODFA-O2WM-3D2N6A",
      travelDate: "2026-05-20",
      adults: 2,
      finalPackagePrice: 12000,
      emiMonths: 6,
      emiAmount: 2000,
    }),
  });
  const bookingData = await bookingRes.json();
  if (!bookingData.success) {
    console.error("Booking failed:", bookingData);
    process.exit(1);
  }
  bookingId = bookingData.data.booking.id;
  console.log("EMI booking created, ID:", bookingId);

  // 3. EMI Initialize (Get payment URL for first installment)
  console.log("\n3. Calling emi/initialize...");
  const initRes = await fetch(`${BASE_URL}/emi/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookingId: bookingId,
      tenureMonths: 6,
    }),
  });
  const initData = await initRes.json();
  if (!initData.success) {
    console.error("EMI Initialize failed:", initData);
    process.exit(1);
  }
  paymentId = initData.data.paymentId;
  console.log("EMI Initialize success. Payment ID:", paymentId);

  // 4. Process Payment
  console.log("\n4. Processing payment (emi/process)...");
  const processRes = await fetch(`${BASE_URL}/emi/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentId: paymentId,
      paymentMethod: "upi",
    }),
  });
  const processData = await processRes.json();
  if (!processData.success) {
    console.error("Payment processing failed:", processData);
    process.exit(1);
  }
  const transactionId = processData.data.transactionId;
  console.log("Payment processed. Transaction ID:", transactionId);

  // 5. Verify Payment
  console.log("\n5. Verifying payment (emi/verify)...");
  const verifyRes = await fetch(`${BASE_URL}/emi/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentId: paymentId,
      transactionId: transactionId,
    }),
  });
  const verifyData = await verifyRes.json();
  if (!verifyData.success || !verifyData.data.verified) {
    console.error("Verification failed:", verifyData);
    process.exit(1);
  }
  console.log("Payment verified successfully.");

  // 6. Check status
  console.log("\n6. Checking EMI status...");
  const statusRes = await fetch(`${BASE_URL}/emi/status/${bookingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const statusData = await statusRes.json();
  console.log("Paid count:", statusData.data.progress.paidCount);
  console.log("Current status:", statusData.data.status);

  // 7. Pay next installment (emi/pay)
  console.log("\n7. Paying next installment (emi/pay)...");
  const payRes = await fetch(`${BASE_URL}/emi/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookingId: bookingId,
      installmentNumber: 2,
    }),
  });
  const payData = await payRes.json();
  if (!payData.success) {
    console.error("emi/pay failed:", payData);
    process.exit(1);
  }
  const nextPaymentId = payData.data.paymentId;
  console.log("Next payment session created ID:", nextPaymentId);

  // 8. Process next installment
  console.log("\n8. Processing second installment...");
  await fetch(`${BASE_URL}/emi/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentId: nextPaymentId,
      paymentMethod: "card",
    }),
  });

  // 9. Final status check
  console.log("\n9. Final status check...");
  const finalStatusRes = await fetch(`${BASE_URL}/emi/status/${bookingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const finalStatusData = await finalStatusRes.json();
  console.log("Final paid count:", finalStatusData.data.progress.paidCount);
  console.log(
    "Next installment due:",
    finalStatusData.data.nextInstallment?.installmentNumber
  );

  console.log("\n--- All EMI Tests Completed ---");
}

runTests().catch((err) => {
  console.error("Test script crashed:", err);
  process.exit(1);
});
