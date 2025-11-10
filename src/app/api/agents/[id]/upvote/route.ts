import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Simplified upvote endpoint - returns current count only
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;

    if (!agentId || isNaN(parseInt(agentId))) {
      return NextResponse.json(
        { error: 'Valid agent ID is required', code: 'INVALID_AGENT_ID' },
        { status: 400 }
      );
    }

    const agentIdInt = parseInt(agentId);

    const agent = await db.select({ upvotesCount: agents.upvotesCount })
      .from(agents)
      .where(eq(agents.id, agentIdInt))
      .limit(1);

    if (agent.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'AGENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      upvotesCount: agent[0].upvotesCount
    });
  } catch (error) {
    console.error('GET /api/agents/[id]/upvote error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}