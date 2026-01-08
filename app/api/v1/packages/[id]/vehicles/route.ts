import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/lib/models/Package";
import Vehicle from "@/lib/models/Vehicle";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/packages/:id/vehicles - Get available vehicles for a package
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id: packageId } = await params;

    // Get the package to find available vehicles
    const pkg = await Package.findOne({ packageId });

    if (!pkg) {
      return errorResponse(
        "Package not found",
        ErrorCodes.PACKAGE_NOT_FOUND,
        404,
      );
    }

    const availableVehicleIds = pkg.availableVehicle || [];

    if (availableVehicleIds.length === 0) {
      // If no availableVehicle, try using the vehicle array
      const vehicleIds = pkg.vehicle || [];

      if (vehicleIds.length === 0) {
        return successResponse(
          [{ vehicleDetails: [] }],
          "No available vehicles",
        );
      }

      const vehicles = await Vehicle.find({ vehicleId: { $in: vehicleIds } });
      return successResponse(
        [{ vehicleDetails: vehicles }],
        "Vehicles retrieved successfully",
      );
    }

    // Get all available vehicles
    const vehicles = await Vehicle.find({
      vehicleId: { $in: availableVehicleIds },
    });

    return successResponse(
      [{ vehicleDetails: vehicles }],
      "Vehicles retrieved successfully",
    );
  } catch (error) {
    console.error("Get available vehicles error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
