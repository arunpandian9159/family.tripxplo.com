import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody } from "@/lib/api-middleware";

interface UpdateProfileBody {
  // Accept both naming conventions for compatibility
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  mobileNo?: string;
  gender?: string;
  dob?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  profileImage?: string;
  profileImg?: string;
}

// GET /api/v1/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401,
      );
    }

    await connectDB();

    const user = await User.findOne({ userId }).lean();

    if (!user) {
      return errorResponse("User not found", ErrorCodes.NOT_FOUND, 404);
    }

    // Return flat object for compatibility with frontend
    return successResponse(
      {
        // Standard fields
        id: user.userId,
        userId: user.userId,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        phone: user.mobileNo?.toString(),
        mobileNo: user.mobileNo?.toString(),
        profileImage: user.profileImg,
        profileImg: user.profileImg,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
        city: user.city,
        pinCode: user.pinCode,
        redeemCoins: user.redeemCoins || 0,
        claimRedeemCoins: user.claimRedeemCoins || 0,
        userType: user.userType,
        createdAt: user.createdAt,
      },
      "Profile retrieved successfully",
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}

// PUT /api/v1/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401,
      );
    }

    await connectDB();

    const body = await parseBody<UpdateProfileBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Build update object - accept both naming conventions
    const updateData: Record<string, unknown> = {};

    // Name field (accept both 'name' and 'fullName')
    const nameValue = body.name || body.fullName;
    if (nameValue) updateData.fullName = nameValue;

    // Email field
    if (body.email) updateData.email = body.email.toLowerCase();

    // Phone field (accept both 'phone' and 'mobileNo')
    const phoneValue = body.phone || body.mobileNo;
    if (phoneValue) {
      const parsed = parseInt(phoneValue);
      if (!isNaN(parsed)) updateData.mobileNo = parsed;
    }

    // Gender field - normalize to lowercase
    if (body.gender) updateData.gender = body.gender.toLowerCase();

    // Date of birth
    if (body.dob) updateData.dob = body.dob;

    // Address fields
    if (body.address) updateData.address = body.address;
    if (body.city) updateData.city = body.city;
    if (body.pinCode) updateData.pinCode = body.pinCode;

    // Profile image (accept both 'profileImage' and 'profileImg')
    const imageValue = body.profileImage || body.profileImg;
    if (imageValue) updateData.profileImg = imageValue;

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true },
    ).lean();

    if (!user) {
      return errorResponse("User not found", ErrorCodes.NOT_FOUND, 404);
    }

    // Return flat object matching GET response format
    return successResponse(
      {
        id: user.userId,
        userId: user.userId,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        phone: user.mobileNo?.toString(),
        mobileNo: user.mobileNo?.toString(),
        profileImage: user.profileImg,
        profileImg: user.profileImg,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
        city: user.city,
        pinCode: user.pinCode,
        redeemCoins: user.redeemCoins || 0,
        claimRedeemCoins: user.claimRedeemCoins || 0,
        userType: user.userType,
        createdAt: user.createdAt,
      },
      "Profile updated successfully",
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
