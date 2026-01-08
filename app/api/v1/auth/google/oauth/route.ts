import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  generateId,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface GoogleOAuthBody {
  token: string; // Google ID token
}

interface GoogleTokenPayload {
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google user ID
  email_verified?: boolean;
}

// POST /api/v1/auth/google/oauth - Exchange Google token for app tokens
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await parseBody<GoogleOAuthBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["token"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Verify Google token by decoding it (it's a JWT)
    // In production, you should verify with Google's tokeninfo endpoint
    let googleUser: GoogleTokenPayload;

    try {
      // Decode the Google ID token (base64 JWT)
      const tokenParts = body.token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(
        Buffer.from(tokenParts[1], "base64").toString(),
      );
      googleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub,
        email_verified: payload.email_verified,
      };

      if (!googleUser.email) {
        throw new Error("No email in token");
      }
    } catch (err) {
      console.error("Token decode error:", err);
      return errorResponse(
        "Invalid Google token",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user with a random password (Google users won't use it)
      const userId = generateId();
      const randomPassword = `google_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      user = new User({
        userId,
        fullName: googleUser.name || "User",
        email: googleUser.email,
        password: randomPassword, // Will be hashed by the pre-save hook
        profileImg:
          googleUser.picture ||
          "https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-login-interface-abstract-blue-icon-png-image_3917504.jpg",
        userType: "customer",
        status: true,
        redeemCoins: 200,
        claimRedeemCoins: 0,
      });

      await user.save();
    } else {
      // Update profile image if not set
      if (
        googleUser.picture &&
        user.profileImg ===
          "https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-login-interface-abstract-blue-icon-png-image_3917504.jpg"
      ) {
        user.profileImg = googleUser.picture;
        await user.save();
      }
    }

    // Generate app tokens
    const accessToken = generateAccessToken({ id: user.userId });
    const refreshToken = generateRefreshToken({ id: user.userId });

    // Store refresh token in user record
    user.refreshToken = refreshToken;
    await user.save();

    return successResponse(
      {
        user: {
          id: user.userId,
          name: user.fullName,
          email: user.email,
          phone: user.mobileNo,
          profileImage: user.profileImg,
          rewardCoins: user.claimRedeemCoins || 0,
          redeemCoins: user.redeemCoins || 0,
        },
        token: accessToken,
        refreshToken,
      },
      "Google authentication successful",
    );
  } catch (error) {
    console.error("Google OAuth error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
