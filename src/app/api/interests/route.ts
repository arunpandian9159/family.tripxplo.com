import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interest from '@/lib/models/Interest';

// GET /api/interests - Get all interests or search by name
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query: Record<string, unknown> = { status: true };

    if (search) {
      query.interestName = { $regex: search, $options: 'i' };
    }

    const interests = await Interest.find(query)
      .select('interestId interestName description image')
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: interests,
      message: 'Interests retrieved successfully',
    });
  } catch (error) {
    console.error('Get interests error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch interests',
      },
      { status: 500 }
    );
  }
}
