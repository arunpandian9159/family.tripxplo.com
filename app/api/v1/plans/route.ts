import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/lib/models/Plan";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/plans - Get all plans
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { limit } = parseQueryParams(request);

    const plans = await Plan.find().limit(limit).lean();

    const formattedPlans = plans.map((plan) => ({
      id: plan.planId,
      name: plan.planName,
    }));

    return successResponse(
      { plans: formattedPlans },
      "Plans retrieved successfully",
    );
  } catch (error) {
    console.error("Get plans error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
