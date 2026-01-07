import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/lib/models/Package';
import Activity from '@/lib/models/Activity';
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/packages/:id/activities - Get available activities for a package
// This matches the old backend endpoint: /:packageId/activity/get (getPackageByActivity)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id: packageId } = await params;

    // Get the package to find available activities
    const pkg = await Package.findOne({ packageId }).lean();

    if (!pkg) {
      return errorResponse('Package not found', ErrorCodes.PACKAGE_NOT_FOUND, 404);
    }

    const availableActivityIds = pkg.availableActivity || [];

    if (availableActivityIds.length === 0) {
      // Return empty array matching old backend format
      return successResponse([{ activityDetails: [] }], 'No available activities');
    }

    // Get all available activities
    // This matches old backend's $lookup from 'activity' collection
    const activities = await Activity.find({
      activityId: { $in: availableActivityIds },
    }).lean();

    // Return in old backend format: [{ activityDetails: [...] }]
    return successResponse([{ activityDetails: activities }], 'Activities retrieved successfully');
  } catch (error) {
    console.error('Get available activities error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
