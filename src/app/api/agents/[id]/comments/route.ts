import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, agents } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';

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
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const offset = (page - 1) * pageSize;

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(eq(comments.agentId, agentId));

    // Get paginated comments
    const data = await db
      .select({
        id: comments.id,
        agentId: comments.agentId,
        userId: comments.userId,
        body: comments.body,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(eq(comments.agentId, agentId))
      .orderBy(asc(comments.createdAt))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({
      data,
      total: count,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}