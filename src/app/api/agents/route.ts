import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents, categories, tags, agentTags } from '@/db/schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'newest';
    const featuredParam = searchParams.get('featured');
    const verifiedParam = searchParams.get('verified');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '12')));

    let agentIds: number[] | null = null;

    // FTS5 search if query provided
    if (q && q.trim()) {
      const ftsQuery = q.trim().split(/\s+/).map(term => `"${term}"`).join(' OR ');
      const ftsResults = await db.all(
        sql`SELECT agents.id FROM agents_fts 
            INNER JOIN agents ON agents_fts.rowid = agents.id 
            WHERE agents_fts MATCH ${ftsQuery}`
      );
      agentIds = ftsResults.map((row: any) => row.id);
      
      if (agentIds.length === 0) {
        return NextResponse.json({
          data: [],
          total: 0,
          page,
          pageSize
        });
      }
    }

    // Build WHERE conditions
    const conditions: any[] = [];
    
    if (agentIds !== null) {
      conditions.push(inArray(agents.id, agentIds));
    }

    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      if (!isNaN(categoryId)) {
        conditions.push(eq(agents.categoryId, categoryId));
      }
    }

    if (featuredParam === 'true') {
      conditions.push(eq(agents.featured, true));
    }

    if (verifiedParam === 'true') {
      conditions.push(eq(agents.verified, true));
    }

    // Tag filtering requires subquery
    let tagFilteredIds: number[] | null = null;
    if (tagParam) {
      const tagId = parseInt(tagParam);
      if (!isNaN(tagId)) {
        const tagResults = await db.select({ agentId: agentTags.agentId })
          .from(agentTags)
          .where(eq(agentTags.tagId, tagId));
        
        tagFilteredIds = tagResults.map(r => r.agentId);
        
        if (tagFilteredIds.length === 0) {
          return NextResponse.json({
            data: [],
            total: 0,
            page,
            pageSize
          });
        }
        
        conditions.push(inArray(agents.id, tagFilteredIds));
      }
    }

    // Build base query for count
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(agents);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    
    const totalResult = await countQuery;
    const total = totalResult[0]?.count || 0;

    // Build main query
    let query = db.select().from(agents);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        query = query.orderBy(desc(agents.averageRating), desc(agents.ratingsCount));
        break;
      case 'trending':
        query = query.orderBy(desc(agents.trending), desc(agents.upvotesCount));
        break;
      case 'popular':
        query = query.orderBy(desc(agents.upvotesCount), desc(agents.visitsCount));
        break;
      case 'newest':
      default:
        query = query.orderBy(desc(agents.createdAt));
        break;
    }

    // Apply pagination
    const offset = (page - 1) * pageSize;
    query = query.limit(pageSize).offset(offset);

    const agentsResults = await query;

    // Enrich with category and tags
    const enrichedAgents = await Promise.all(
      agentsResults.map(async (agent) => {
        // Get category
        let category = null;
        if (agent.categoryId) {
          const categoryResult = await db.select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug
          })
            .from(categories)
            .where(eq(categories.id, agent.categoryId))
            .limit(1);
          
          category = categoryResult[0] || null;
        }

        // Get tags
        const agentTagsResults = await db.select({
          tagId: agentTags.tagId
        })
          .from(agentTags)
          .where(eq(agentTags.agentId, agent.id));

        const tagIds = agentTagsResults.map(at => at.tagId);
        let agentTagsList: any[] = [];
        
        if (tagIds.length > 0) {
          agentTagsList = await db.select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug
          })
            .from(tags)
            .where(inArray(tags.id, tagIds));
        }

        return {
          ...agent,
          category,
          tags: agentTagsList
        };
      })
    );

    return NextResponse.json({
      data: enrichedAgents,
      total,
      page,
      pageSize
    });

  } catch (error) {
    console.error('GET /api/agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}