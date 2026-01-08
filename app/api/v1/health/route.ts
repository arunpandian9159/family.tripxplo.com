import { NextResponse } from "next/server";

// GET /api/v1/health - Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API v1 is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
