import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, bookmarks, reviews, comments, votes, submissions } from '@/db/schema';
import { eq, or, like, sql, desc, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const { authorized } = await requireAdmin();
    if (!authorized) {
      return NextResponse.json(
        { error: 'Admin access required', code: 'ADMIN_ACCESS_REQUIRED' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      Math.max(1, parseInt(searchParams.get('pageSize') || '50')),
      100
    );
    const offset = (page - 1) * pageSize;
    
    // Search parameter
    const search = searchParams.get('search')?.trim();

    // Build base query for counting total users
    let countQuery = db.select({ count: count() }).from(user);
    
    if (search) {
      const searchLower = search.toLowerCase();
      countQuery = countQuery.where(
        or(
          like(sql`LOWER(${user.name})`, `%${searchLower}%`),
          like(sql`LOWER(${user.email})`, `%${searchLower}%`)
        )
      );
    }

    // Get total count
    const totalResult = await countQuery;
    const total = totalResult[0]?.count || 0;

    // Build main query with activity counts using subqueries
    const usersQuery = db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        bookmarksCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${bookmarks} 
          WHERE ${bookmarks.userId} = ${user.id}
        )`,
        reviewsCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${reviews} 
          WHERE ${reviews.userId} = ${user.id}
        )`,
        commentsCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${comments} 
          WHERE ${comments.userId} = ${user.id}
        )`,
        votesCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${votes} 
          WHERE ${votes.userId} = ${user.id}
        )`,
        submissionsCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${submissions} 
          WHERE ${submissions.userId} = ${user.id}
        )`
      })
      .from(user);

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      usersQuery.where(
        or(
          like(sql`LOWER(${user.name})`, `%${searchLower}%`),
          like(sql`LOWER(${user.email})`, `%${searchLower}%`)
        )
      );
    }

    // Apply ordering and pagination
    const users = await usersQuery
      .orderBy(desc(user.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Convert timestamp integers to ISO strings for consistency
    const formattedUsers = users.map(u => ({
      ...u,
      createdAt: new Date(u.createdAt as unknown as number).toISOString(),
      updatedAt: new Date(u.updatedAt as unknown as number).toISOString(),
      bookmarksCount: Number(u.bookmarksCount) || 0,
      reviewsCount: Number(u.reviewsCount) || 0,
      commentsCount: Number(u.commentsCount) || 0,
      votesCount: Number(u.votesCount) || 0,
      submissionsCount: Number(u.submissionsCount) || 0
    }));

    return NextResponse.json({
      data: formattedUsers,
      total,
      page,
      pageSize
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}