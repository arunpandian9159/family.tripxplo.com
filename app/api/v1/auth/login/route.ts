import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

import { parseBody, validateRequired } from "@/lib/api-middleware";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await parseBody<LoginBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["email", "password"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Find user by email
    const user = await User.findOne({ email: body.email.toLowerCase() });

    if (!user) {
      console.log(
        "Login failed: User not found for email:",
        body.email.toLowerCase(),
      );
      return errorResponse(
        ErrorMessages[ErrorCodes.INVALID_CREDENTIALS],
        ErrorCodes.INVALID_CREDENTIALS,
        401,
      );
    }

    // Check if account is suspended (status: true means suspended)
    if (user.status === true) {
      console.log("Login failed: Account suspended for user:", user.userId);
      return errorResponse(
        ErrorMessages[ErrorCodes.ACCOUNT_SUSPENDED],
        ErrorCodes.ACCOUNT_SUSPENDED,
        403,
      );
    }

    // Check if user has a password set (might be OAuth-only user)
    if (!user.password) {
      console.log("Login failed: No password set for user:", user.userId);
      return errorResponse(
        "Please use social login for this account",
        ErrorCodes.INVALID_CREDENTIALS,
        401,
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(body.password);

    if (!isMatch) {
      console.log("Login failed: Password mismatch for user:", user.userId);
      return errorResponse(
        ErrorMessages[ErrorCodes.INVALID_CREDENTIALS],
        ErrorCodes.INVALID_CREDENTIALS,
        401,
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.userId });
    const refreshToken = generateRefreshToken({ id: user.userId });

    // Update refresh token using findOneAndUpdate to avoid full document validation
    await User.findOneAndUpdate(
      { userId: user.userId },
      { $set: { refreshToken } },
    );

    console.log("Login successful for user:", user.userId);

    return successResponse(
      {
        user: {
          id: user.userId,
          name: user.fullName,
          email: user.email,
          phone: user.mobileNo?.toString(),
          profileImage: user.profileImg,
        },
        token: accessToken,
        refreshToken,
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
