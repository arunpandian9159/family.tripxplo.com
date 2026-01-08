import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  generateId,
} from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await parseBody<RegisterBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["name", "email", "password"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: body.email.toLowerCase(),
    });
    if (existingUser) {
      return errorResponse(
        ErrorMessages[ErrorCodes.EMAIL_EXISTS],
        ErrorCodes.EMAIL_EXISTS,
        409,
      );
    }

    // Create user
    const userId = generateId();
    const user = new User({
      userId,
      email: body.email.toLowerCase(),
      fullName: body.name,
      password: body.password,
      mobileNo: body.phone ? parseInt(body.phone) : undefined,
      userType: "customer",
      redeemCoins: 200,
    });

    // Generate tokens
    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = generateRefreshToken({ id: userId });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return successResponse(
      {
        user: {
          id: userId,
          name: body.name,
          email: body.email.toLowerCase(),
          phone: body.phone,
          profileImage: user.profileImg,
        },
        token: accessToken,
        refreshToken,
      },
      "Registration successful",
      201,
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
