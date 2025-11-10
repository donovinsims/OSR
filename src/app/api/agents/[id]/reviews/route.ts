import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = parseInt(params.id);
    if (isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Valid agent ID is required', code: 'INVALID_AGENT_ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const pageSize = Math.min(
      Math.max(parseInt(searchParams.get('pageSize') || '10'), 1),
      50
    );
    const sort = searchParams.get('sort') || 'newest';

    const offset = (page - 1) * pageSize;

    // Build query based on sort parameter
    let query = db
      .select()
      .from(reviews)
      .where(eq(reviews.agentId, agentId))
      .limit(pageSize)
      .offset(offset);

    if (sort === 'rating') {
      query = query.orderBy(desc(reviews.rating), desc(reviews.createdAt));
    } else {
      query = query.orderBy(desc(reviews.createdAt));
    }

    const data = await query;

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.agentId, agentId));

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}