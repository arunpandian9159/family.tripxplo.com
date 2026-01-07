import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Destination from '@/lib/models/Destination';

// GET /api/destinations - Get all destinations or search by name
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query: Record<string, unknown> = { status: true };

    if (search) {
      query.destinationName = { $regex: search, $options: 'i' };
    }

    const destinations = await Destination.find(query)
      .select('destinationId destinationName destinationType country state city image')
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: destinations,
      message: 'Destinations retrieved successfully',
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch destinations',
      },
      { status: 500 }
    );
  }
}
