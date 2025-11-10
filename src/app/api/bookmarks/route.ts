import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks, agents, categories } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const userId = session.user.id;

    const userBookmarks = await db
      .select({
        id: bookmarks.id,
        userId: bookmarks.userId,
        agentId: bookmarks.agentId,
        createdAt: bookmarks.createdAt,
        agent: {
          id: agents.id,
          name: agents.name,
          slug: agents.slug,
          description: agents.description,
          categoryId: agents.categoryId,
          features: agents.features,
          websiteUrl: agents.websiteUrl,
          repoUrl: agents.repoUrl,
          demoUrl: agents.demoUrl,
          imageUrl: agents.imageUrl,
          creatorName: agents.creatorName,
          status: agents.status,
          featured: agents.featured,
          trending: agents.trending,
          verified: agents.verified,
          averageRating: agents.averageRating,
          ratingsCount: agents.ratingsCount,
          upvotesCount: agents.upvotesCount,
          commentsCount: agents.commentsCount,
          downloadsCount: agents.downloadsCount,
          sharesCount: agents.sharesCount,
          visitsCount: agents.visitsCount,
          createdBy: agents.createdBy,
          createdAt: agents.createdAt,
          updatedAt: agents.updatedAt,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
            icon: categories.icon,
            createdAt: categories.createdAt,
            updatedAt: categories.updatedAt,
          }
        }
      })
      .from(bookmarks)
      .innerJoin(agents, eq(bookmarks.agentId, agents.id))
      .leftJoin(categories, eq(agents.categoryId, categories.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));

    return NextResponse.json(userBookmarks, { status: 200 });
  } catch (error) {
    console.error('GET bookmarks error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json({ 
        error: 'Agent ID is required',
        code: 'MISSING_AGENT_ID' 
      }, { status: 400 });
    }

    const parsedAgentId = parseInt(agentId);
    if (isNaN(parsedAgentId)) {
      return NextResponse.json({ 
        error: 'Agent ID must be a valid integer',
        code: 'INVALID_AGENT_ID' 
      }, { status: 400 });
    }

    const agentExists = await db
      .select({ id: agents.id })
      .from(agents)
      .where(eq(agents.id, parsedAgentId))
      .limit(1);

    if (agentExists.length === 0) {
      return NextResponse.json({ 
        error: 'Agent not found',
        code: 'AGENT_NOT_FOUND' 
      }, { status: 404 });
    }

    try {
      const newBookmark = await db.insert(bookmarks)
        .values({
          userId: userId,
          agentId: parsedAgentId,
          createdAt: new Date().toISOString()
        })
        .returning();

      return NextResponse.json(newBookmark[0], { status: 201 });
    } catch (insertError: any) {
      if (insertError?.message?.includes('UNIQUE constraint failed') || 
          insertError?.code === 'SQLITE_CONSTRAINT') {
        return NextResponse.json({ 
          error: 'Bookmark already exists',
          code: 'DUPLICATE_BOOKMARK' 
        }, { status: 400 });
      }
      throw insertError;
    }
  } catch (error) {
    console.error('POST bookmarks error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const bookmarkId = parseInt(id);

    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)))
      .limit(1);

    if (existingBookmark.length === 0) {
      return NextResponse.json({ 
        error: 'Bookmark not found',
        code: 'BOOKMARK_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(bookmarks)
      .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)))
      .returning();

    return NextResponse.json({
      message: 'Bookmark deleted successfully',
      bookmark: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE bookmarks error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}