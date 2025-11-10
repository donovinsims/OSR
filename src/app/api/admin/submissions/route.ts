import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { submissions, user, agents } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const { authorized } = await requireAdmin();
    if (!authorized) {
      return NextResponse.json({ 
        error: 'Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));
    const offset = (page - 1) * pageSize;

    // Validate status filter if provided
    if (statusFilter && !['pending', 'approved', 'rejected'].includes(statusFilter)) {
      return NextResponse.json({ 
        error: 'Invalid status filter. Must be one of: pending, approved, rejected',
        code: 'INVALID_STATUS_FILTER' 
      }, { status: 400 });
    }

    // Build query with joins
    let whereConditions = [];
    if (statusFilter) {
      whereConditions.push(eq(submissions.status, statusFilter));
    }

    // Get total count
    const countQuery = whereConditions.length > 0
      ? db.select({ count: sql<number>`count(*)` })
          .from(submissions)
          .where(and(...whereConditions))
      : db.select({ count: sql<number>`count(*)` })
          .from(submissions);

    const totalResult = await countQuery;
    const total = Number(totalResult[0]?.count || 0);

    // Get submissions with user and agent details
    const baseQuery = db
      .select({
        id: submissions.id,
        userId: submissions.userId,
        payload: submissions.payload,
        status: submissions.status,
        agentId: submissions.agentId,
        createdAt: submissions.createdAt,
        reviewedAt: submissions.reviewedAt,
        reviewerId: submissions.reviewerId,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        agent: {
          id: agents.id,
          name: agents.name,
          slug: agents.slug,
        },
      })
      .from(submissions)
      .leftJoin(user, eq(submissions.userId, user.id))
      .leftJoin(agents, eq(submissions.agentId, agents.id))
      .orderBy(desc(submissions.createdAt))
      .limit(pageSize)
      .offset(offset);

    const results = whereConditions.length > 0
      ? await baseQuery.where(and(...whereConditions))
      : await baseQuery;

    // Format results
    const formattedResults = results.map(row => ({
      id: row.id,
      userId: row.userId,
      payload: row.payload,
      status: row.status,
      agentId: row.agentId,
      createdAt: row.createdAt,
      reviewedAt: row.reviewedAt,
      reviewerId: row.reviewerId,
      user: row.user,
      agent: row.agent && row.agent.id ? row.agent : null,
    }));

    return NextResponse.json({
      data: formattedResults,
      total,
      page,
      pageSize,
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}