import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tags, agentTags } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const results = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        createdAt: tags.createdAt,
        usageCount: sql<number>`cast(count(${agentTags.tagId}) as integer)`,
      })
      .from(tags)
      .leftJoin(agentTags, sql`${tags.id} = ${agentTags.tagId}`)
      .groupBy(tags.id)
      .orderBy(
        sql`cast(count(${agentTags.tagId}) as integer) desc`,
        sql`${tags.name} asc`
      );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}