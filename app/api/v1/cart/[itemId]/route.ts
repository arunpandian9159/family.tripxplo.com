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
import { parseBody } from "@/lib/api-middleware";

interface UpdateCartItemBody {
  quantity?: number;
  travelDate?: string;
  adults?: number;
  children?: number;
}

interface RouteParams {
  params: Promise<{ itemId: string }>;
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

// PUT /api/v1/cart/:itemId - Update cart item
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { itemId } = await params;
    const body = await parseBody<UpdateCartItemBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return errorResponse(
        ErrorMessages[ErrorCodes.CART_NOT_FOUND],
        ErrorCodes.CART_NOT_FOUND,
        404,
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);

    if (itemIndex === -1) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ITEM_NOT_FOUND],
        ErrorCodes.ITEM_NOT_FOUND,
        404,
      );
    }

    // Update item
    const item = cart.items[itemIndex];

    if (body.quantity !== undefined) item.quantity = body.quantity;
    if (body.travelDate !== undefined) item.travelDate = body.travelDate;
    if (body.adults !== undefined) item.adults = body.adults;
    if (body.children !== undefined) item.children = body.children;

    // Recalculate price
    const basePrice = item.totalPrice / cart.items[itemIndex].quantity;
    item.totalPrice = basePrice * item.quantity;

    // Update total amount
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);

    await cart.save();

    const cartData = await formatCartResponse(userId);

    return successResponse(
      { cart: cartData },
      "Cart item updated successfully",
    );
  } catch (error) {
    console.error("Update cart item error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}

// DELETE /api/v1/cart/:itemId - Remove item from cart
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { itemId } = await params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return errorResponse(
        ErrorMessages[ErrorCodes.CART_NOT_FOUND],
        ErrorCodes.CART_NOT_FOUND,
        404,
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);

    if (itemIndex === -1) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ITEM_NOT_FOUND],
        ErrorCodes.ITEM_NOT_FOUND,
        404,
      );
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Update total amount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    await cart.save();

    const cartData = await formatCartResponse(userId);

    return successResponse(
      { cart: cartData },
      "Item removed from cart successfully",
    );
  } catch (error) {
    console.error("Remove cart item error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
