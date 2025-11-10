import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get and validate ID parameter
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid bookmark ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const bookmarkId = parseInt(id);

    // Check if bookmark exists and belongs to user
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.id, bookmarkId),
          eq(bookmarks.userId, userId)
        )
      )
      .limit(1);

    if (existingBookmark.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found', code: 'BOOKMARK_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the bookmark
    const deleted = await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.id, bookmarkId),
          eq(bookmarks.userId, userId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete bookmark', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Bookmark deleted successfully',
        id: bookmarkId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}