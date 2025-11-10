import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, agents } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Query categories with agent count using a subquery
    const categoriesWithCount = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        agentCount: sql<number>`(
          SELECT COUNT(*)
          FROM ${agents}
          WHERE ${agents.categoryId} = ${categories.id}
        )`.as('agent_count'),
      })
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json(categoriesWithCount, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}