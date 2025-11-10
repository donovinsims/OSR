import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, agents, submissions, bookmarks, reviews, comments, votes, agentMetrics } from '@/db/schema';
import { eq, gte, sql } from 'drizzle-orm';
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

    // Calculate timestamps for filtering
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgoISO = new Date(sevenDaysAgo).toISOString();
    const thirtyDaysAgoISO = new Date(thirtyDaysAgo).toISOString();

    // Total counts
    const [totalUsersResult] = await db.select({ count: sql<number>`count(*)` }).from(user);
    const totalUsers = totalUsersResult.count;

    const [totalAgentsResult] = await db.select({ count: sql<number>`count(*)` }).from(agents);
    const totalAgents = totalAgentsResult.count;

    const [approvedAgentsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(agents)
      .where(eq(agents.status, 'approved'));
    const approvedAgents = approvedAgentsResult.count;

    const [totalBookmarksResult] = await db.select({ count: sql<number>`count(*)` }).from(bookmarks);
    const totalBookmarks = totalBookmarksResult.count;

    const [totalReviewsResult] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
    const totalReviews = totalReviewsResult.count;

    const [totalCommentsResult] = await db.select({ count: sql<number>`count(*)` }).from(comments);
    const totalComments = totalCommentsResult.count;

    const [totalVotesResult] = await db.select({ count: sql<number>`count(*)` }).from(votes);
    const totalVotes = totalVotesResult.count;

    const [totalSubmissionsResult] = await db.select({ count: sql<number>`count(*)` }).from(submissions);
    const totalSubmissions = totalSubmissionsResult.count;

    const [pendingSubmissionsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.status, 'pending'));
    const pendingSubmissions = pendingSubmissionsResult.count;

    const [approvedSubmissionsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.status, 'approved'));
    const approvedSubmissions = approvedSubmissionsResult.count;

    const [rejectedSubmissionsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.status, 'rejected'));
    const rejectedSubmissions = rejectedSubmissionsResult.count;

    // Aggregate metrics
    const [metricsResult] = await db.select({
      totalVisits: sql<number>`COALESCE(SUM(${agentMetrics.visits}), 0)`,
      totalDownloads: sql<number>`COALESCE(SUM(${agentMetrics.downloads}), 0)`,
      totalShares: sql<number>`COALESCE(SUM(${agentMetrics.shares}), 0)`,
    }).from(agentMetrics);
    
    const totalVisits = metricsResult.totalVisits;
    const totalDownloads = metricsResult.totalDownloads;
    const totalShares = metricsResult.totalShares;

    // Recent activity (last 7 days)
    const [newUsersLast7DaysResult] = await db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(gte(user.createdAt, new Date(sevenDaysAgo)));
    const newUsersLast7Days = newUsersLast7DaysResult.count;

    const [newAgentsLast7DaysResult] = await db.select({ count: sql<number>`count(*)` })
      .from(agents)
      .where(gte(agents.createdAt, sevenDaysAgoISO));
    const newAgentsLast7Days = newAgentsLast7DaysResult.count;

    const [newSubmissionsLast7DaysResult] = await db.select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(gte(submissions.createdAt, sevenDaysAgoISO));
    const newSubmissionsLast7Days = newSubmissionsLast7DaysResult.count;

    const [newReviewsLast7DaysResult] = await db.select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(gte(reviews.createdAt, sevenDaysAgoISO));
    const newReviewsLast7Days = newReviewsLast7DaysResult.count;

    // Growth metrics (last 30 days)
    const [newUsersLast30DaysResult] = await db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(gte(user.createdAt, new Date(thirtyDaysAgo)));
    const newUsersLast30Days = newUsersLast30DaysResult.count;

    const [newAgentsLast30DaysResult] = await db.select({ count: sql<number>`count(*)` })
      .from(agents)
      .where(gte(agents.createdAt, thirtyDaysAgoISO));
    const newAgentsLast30Days = newAgentsLast30DaysResult.count;

    // Return all statistics
    return NextResponse.json({
      totalUsers,
      totalAgents,
      approvedAgents,
      totalBookmarks,
      totalReviews,
      totalComments,
      totalVotes,
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      totalVisits,
      totalDownloads,
      totalShares,
      newUsersLast7Days,
      newAgentsLast7Days,
      newSubmissionsLast7Days,
      newReviewsLast7Days,
      newUsersLast30Days,
      newAgentsLast30Days,
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}