import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentMetrics, agents } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId } = body;

    // Validate required field
    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required', code: 'MISSING_AGENT_ID' },
        { status: 400 }
      );
    }

    // Validate agentId is a valid integer
    const parsedAgentId = parseInt(agentId);
    if (isNaN(parsedAgentId)) {
      return NextResponse.json(
        { error: 'agentId must be a valid integer', code: 'INVALID_AGENT_ID' },
        { status: 400 }
      );
    }

    // Check if agent exists
    const agent = await db
      .select()
      .from(agents)
      .where(eq(agents.id, parsedAgentId))
      .limit(1);

    if (agent.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'AGENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Upsert into agent_metrics: increment shares by 1 or create new record
    await db.run(sql`
      INSERT INTO agent_metrics (agent_id, date, shares, visits, downloads)
      VALUES (${parsedAgentId}, ${today}, 1, 0, 0)
      ON CONFLICT(agent_id, date) 
      DO UPDATE SET shares = shares + 1
    `);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('POST /api/metrics/share error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}