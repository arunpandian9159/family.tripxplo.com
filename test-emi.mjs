const BASE_URL = "http://localhost:3000/api/v1";
let token = "";
let bookingId = "";
let paymentId = "";

const testEmail = `test_emi_${Date.now()}@example.com`;
const testPassword = "Password123!";

async function runTests() {
  console.log("--- Starting EMI-Only API Tests ---");

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
  console.log("Registration success, token received.");

  // 2. Attempt Regular Booking (Should Fail)
  console.log("\n2. Attempting regular booking (non-EMI)...");
  const failRes = await fetch(`${BASE_URL}/bookings`, {
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
    }),
  });
  const failData = await failRes.json();
  if (!failData.success) {
    console.log("Expected failure caught:", failData.error);
  } else {
    console.error("ERROR: Regular booking should have failed!");
    process.exit(1);
  }

  // 3. Create EMI Booking (Should Success)
  console.log("\n3. Creating EMI booking...");
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
  console.log("EMI booking created successfully, ID:", bookingId);

  // 4. Pay first installment
  console.log("\n4. Paying first installment...");
  const payRes = await fetch(`${BASE_URL}/emi/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookingId: bookingId,
      installmentNumber: 1,
    }),
  });
  const payData = await payRes.json();
  paymentId = payData.data.paymentId;

  // 5. Process Payment
  console.log("\n5. Processing payment...");
  const processRes = await fetch(`${BASE_URL}/payment/process`, {
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
  if (processData.success) {
    console.log("Payment processed successfully.");
  }

  // 6. Check final status
  console.log("\n6. Checking EMI status...");
  const statusRes = await fetch(`${BASE_URL}/emi/status/${bookingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const statusData = await statusRes.json();
  console.log("Paid count:", statusData.data.progress.paidCount);
  console.log("1st Installment Status:", statusData.data.schedule[0].status);

  console.log("\n--- EMI-Only Tests Completed ---");
}

runTests().catch((err) => {
  console.error("Test script crashed:", err);
  process.exit(1);
});
