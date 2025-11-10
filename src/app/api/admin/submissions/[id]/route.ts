import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { submissions, agents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin authentication check
    const { authorized, user } = await requireAdmin();
    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'Admin access required', code: 'ADMIN_ACCESS_REQUIRED' },
        { status: 403 }
      );
    }

    const reviewerId = user.id;

    // Get and validate ID parameter
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid submission ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const submissionId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { status, agentId } = body;

    // Validate status
    if (!status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json(
        { 
          error: 'Status must be either "approved" or "rejected"', 
          code: 'INVALID_STATUS' 
        },
        { status: 400 }
      );
    }

    // Check if submission exists
    const existingSubmission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1);

    if (existingSubmission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found', code: 'SUBMISSION_NOT_FOUND' },
        { status: 404 }
      );
    }

    // If agentId is provided, verify the agent exists
    if (agentId !== undefined && agentId !== null) {
      const agentExists = await db
        .select()
        .from(agents)
        .where(eq(agents.id, agentId))
        .limit(1);

      if (agentExists.length === 0) {
        return NextResponse.json(
          { error: 'Agent not found', code: 'AGENT_NOT_FOUND' },
          { status: 404 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      status: string;
      reviewedAt: string;
      reviewerId: string;
      agentId?: number | null;
    } = {
      status,
      reviewedAt: new Date().toISOString(),
      reviewerId,
    };

    // Only include agentId if status is approved and agentId is provided
    if (status === 'approved' && agentId !== undefined && agentId !== null) {
      updateData.agentId = agentId;
    }

    // Update the submission
    const updated = await db
      .update(submissions)
      .set(updateData)
      .where(eq(submissions.id, submissionId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update submission', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT /api/admin/submissions/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}