import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentMetrics, agents } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId } = body;

    // Validate agentId
    if (!agentId || isNaN(parseInt(agentId.toString()))) {
      return NextResponse.json({ 
        error: "Valid agent ID is required",
        code: "INVALID_AGENT_ID" 
      }, { status: 400 });
    }

    const agentIdInt = parseInt(agentId.toString());

    // Check if agent exists
    const agent = await db.select()
      .from(agents)
      .where(eq(agents.id, agentIdInt))
      .limit(1);

    if (agent.length === 0) {
      return NextResponse.json({ 
        error: "Agent not found",
        code: "AGENT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Upsert agent_metrics: increment visits if exists, create if not
    await db.run(sql`
      INSERT INTO agent_metrics (agent_id, date, visits, downloads, shares)
      VALUES (${agentIdInt}, ${today}, 1, 0, 0)
      ON CONFLICT(agent_id, date) 
      DO UPDATE SET visits = visits + 1
    `);

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error('POST /api/metrics/visit error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}