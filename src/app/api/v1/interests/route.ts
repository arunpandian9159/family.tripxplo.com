import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Interest from '@/lib/models/Interest';
import { paginatedResponse, errorResponse, ErrorCodes } from '@/lib/api-response';
import { parseQueryParams } from '@/lib/api-middleware';

// GET /api/v1/interests - Get all interests (tripxplo.com compatible)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { page, limit, query } = parseQueryParams(request);
    const skip = (page - 1) * limit;

    const searchFilter = query ? { interestName: { $regex: query, $options: 'i' } } : {};

    const [interests, total] = await Promise.all([
      Interest.find(searchFilter).sort({ sort: -1 }).skip(skip).limit(limit).lean(),
      Interest.countDocuments(searchFilter),
    ]);

    const formattedInterests = interests.map(interest => ({
      id: interest.interestId,
      name: interest.interestName,
      image: interest.image,
      sort: interest.sort,
      perRoom: interest.perRoom,
      isFirst: interest.isFirst,
    }));

    return paginatedResponse(
      formattedInterests,
      total,
      page,
      limit,
      'Interests retrieved successfully'
    );
  } catch (error) {
    console.error('Get interests error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
