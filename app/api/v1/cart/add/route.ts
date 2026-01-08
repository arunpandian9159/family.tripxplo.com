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
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface AddToCartBody {
  packageId: string;
  quantity?: number;
  travelDate: string;
  adults: number;
  children?: number;
}

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

// POST /api/v1/cart/add - Add item to cart
export async function POST(request: NextRequest) {
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

    const body = await parseBody<AddToCartBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["packageId", "travelDate", "adults"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Verify package exists
    const pkg = await Package.findOne({ packageId: body.packageId }).lean();
    if (!pkg) {
      return errorResponse(
        ErrorMessages[ErrorCodes.PACKAGE_NOT_FOUND],
        ErrorCodes.PACKAGE_NOT_FOUND,
        404,
      );
    }

    const cart = await getOrCreateCart(userId);

    // Calculate price (simplified)
    const basePrice = pkg.activityPrice || 10000;
    const totalPrice = basePrice * (body.quantity || 1);

    // Add new item
    cart.items.push({
      itemId: generateId(),
      packageId: body.packageId,
      quantity: body.quantity || 1,
      travelDate: body.travelDate,
      adults: body.adults,
      children: body.children || 0,
      totalPrice,
      addedAt: new Date(),
    });

    // Update total amount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    await cart.save();

    const cartData = await formatCartResponse(userId);

    return successResponse(
      { cart: cartData },
      "Item added to cart successfully",
      201,
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
