import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface RefreshBody {
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<RefreshBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["refreshToken"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(body.refreshToken);

    if (!payload) {
      return errorResponse(
        ErrorMessages[ErrorCodes.INVALID_TOKEN],
        ErrorCodes.INVALID_TOKEN,
        401,
      );
    }

    await connectDB();

    // Find user and verify refresh token matches
    const user = await User.findOne({ userId: payload.id });

    if (!user) {
      return errorResponse("User not found", ErrorCodes.NOT_FOUND, 404);
    }

    if (user.refreshToken !== body.refreshToken) {
      return errorResponse(
        ErrorMessages[ErrorCodes.INVALID_TOKEN],
        ErrorCodes.INVALID_TOKEN,
        401,
      );
    }

    if (user.status) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ACCOUNT_SUSPENDED],
        ErrorCodes.ACCOUNT_SUSPENDED,
        403,
      );
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ id: user.userId });
    const newRefreshToken = generateRefreshToken({ id: user.userId });

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    return successResponse(
      {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Token refreshed successfully",
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
