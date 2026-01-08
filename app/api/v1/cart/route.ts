import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/lib/models/Cart";
import Package from "@/lib/models/Package";
import { getUserIdFromRequest, generateId } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

// Helper to get or create cart
async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      cartId: generateId(),
      userId,
      items: [],
      totalAmount: 0,
    });
    await cart.save();
  }

  return cart;
}

// Helper to format cart response
async function formatCartResponse(userId: string) {
  const cart = await getOrCreateCart(userId);

  if (cart.items.length === 0) {
    return {
      cartId: cart.cartId,
      items: [],
      totalAmount: 0,
      itemCount: 0,
    };
  }

  // Get package details for all items
  const packageIds = cart.items.map((item) => item.packageId);
  const packages = await Package.find({
    packageId: { $in: packageIds },
  }).lean();
  const packageMap = new Map(packages.map((pkg) => [pkg.packageId, pkg]));

  const items = cart.items.map((item) => {
    const pkg = packageMap.get(item.packageId);
    return {
      itemId: item.itemId,
      packageId: item.packageId,
      packageName: pkg?.packageName || "Unknown Package",
      packageImages: pkg?.packageImg || [],
      quantity: item.quantity,
      travelDate: item.travelDate,
      adults: item.adults,
      children: item.children,
      totalPrice: item.totalPrice,
      addedAt: item.addedAt,
    };
  });

  return {
    cartId: cart.cartId,
    items,
    totalAmount: cart.totalAmount,
    itemCount: cart.items.length,
  };
}

// GET /api/v1/cart - Get user cart
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

    const cartData = await formatCartResponse(userId);

    return successResponse({ cart: cartData }, "Cart retrieved successfully");
  } catch (error) {
    console.error("Get cart error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
