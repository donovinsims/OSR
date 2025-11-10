import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { submissions } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payload } = body;

    // Validate required payload field
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ 
        error: 'Payload is required and must be an object',
        code: 'MISSING_PAYLOAD' 
      }, { status: 400 });
    }

    // Validate required fields in payload
    if (!payload.name || typeof payload.name !== 'string' || !payload.name.trim()) {
      return NextResponse.json({ 
        error: 'Payload must include a valid name',
        code: 'INVALID_PAYLOAD_NAME' 
      }, { status: 400 });
    }

    if (!payload.description || typeof payload.description !== 'string' || !payload.description.trim()) {
      return NextResponse.json({ 
        error: 'Payload must include a valid description',
        code: 'INVALID_PAYLOAD_DESCRIPTION' 
      }, { status: 400 });
    }

    if (!payload.categoryId || typeof payload.categoryId !== 'number') {
      return NextResponse.json({ 
        error: 'Payload must include a valid categoryId',
        code: 'INVALID_PAYLOAD_CATEGORY' 
      }, { status: 400 });
    }

    // Require email for submissions
    if (!payload.email || typeof payload.email !== 'string' || !payload.email.trim()) {
      return NextResponse.json({ 
        error: 'Email is required for submissions',
        code: 'MISSING_EMAIL' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Insert submission with guest user ID
    const newSubmission = await db.insert(submissions).values({
      userId: 'guest',
      payload: JSON.stringify(payload),
      status: 'pending',
      agentId: null,
      createdAt: now,
      reviewedAt: null,
      reviewerId: null,
    }).returning();

    if (!newSubmission || newSubmission.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to create submission',
        code: 'CREATION_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      submissionId: newSubmission[0].id 
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/submissions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Public endpoint - returns all submissions
    const results = await db.select().from(submissions).orderBy(desc(submissions.createdAt));
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET /api/submissions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}