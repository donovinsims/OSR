import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents, categories, tags, agentTags, agentLinks, agentMetrics } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const agentId = parseInt(id);

    if (!agentId || isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Valid agent ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch agent
    const agentResult = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (agentResult.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'AGENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const agent = agentResult[0];

    // Fetch category
    let category = null;
    if (agent.categoryId) {
      const categoryResult = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          icon: categories.icon,
        })
        .from(categories)
        .where(eq(categories.id, agent.categoryId))
        .limit(1);

      if (categoryResult.length > 0) {
        category = categoryResult[0];
      }
    }

    // Fetch tags
    const agentTagsResult = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(agentTags)
      .innerJoin(tags, eq(agentTags.tagId, tags.id))
      .where(eq(agentTags.agentId, agentId));

    // Fetch links
    const linksResult = await db
      .select()
      .from(agentLinks)
      .where(eq(agentLinks.agentId, agentId));

    // Fetch metrics summary
    const metricsSummaryResult = await db
      .select({
        totalVisits: sql<number>`COALESCE(SUM(${agentMetrics.visits}), 0)`,
        totalDownloads: sql<number>`COALESCE(SUM(${agentMetrics.downloads}), 0)`,
        totalShares: sql<number>`COALESCE(SUM(${agentMetrics.shares}), 0)`,
      })
      .from(agentMetrics)
      .where(eq(agentMetrics.agentId, agentId));

    const metricsSummary = metricsSummaryResult[0] || {
      totalVisits: 0,
      totalDownloads: 0,
      totalShares: 0,
    };

    return NextResponse.json({
      ...agent,
      category,
      tags: agentTagsResult,
      links: linksResult,
      metricsSummary,
    });
  } catch (error) {
    console.error('GET agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const agentId = parseInt(id);

    if (!agentId || isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Valid agent ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch existing agent
    const existingAgentResult = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (existingAgentResult.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'AGENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      categoryId,
      features,
      websiteUrl,
      repoUrl,
      demoUrl,
      imageUrl,
      creatorName,
      status,
      featured,
      trending,
      verified,
      tags: newTags,
    } = body;

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) {
      updateData.name = name.trim();
      // Regenerate slug if name changed
      updateData.slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (features !== undefined) updateData.features = features;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (repoUrl !== undefined) updateData.repoUrl = repoUrl;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (creatorName !== undefined) updateData.creatorName = creatorName;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (trending !== undefined) updateData.trending = trending;
    if (verified !== undefined) updateData.verified = verified;

    // Update agent
    const updatedAgent = await db
      .update(agents)
      .set(updateData)
      .where(eq(agents.id, agentId))
      .returning();

    if (updatedAgent.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update agent', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    // Update tags if provided
    if (Array.isArray(newTags)) {
      // Delete existing tags
      await db.delete(agentTags).where(eq(agentTags.agentId, agentId));

      // Insert new tags
      if (newTags.length > 0) {
        const tagInserts = newTags.map((tagId: number) => ({
          agentId,
          tagId,
        }));
        await db.insert(agentTags).values(tagInserts);
      }
    }

    // Fetch updated agent with relations
    const agent = updatedAgent[0];

    // Fetch category
    let category = null;
    if (agent.categoryId) {
      const categoryResult = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          icon: categories.icon,
        })
        .from(categories)
        .where(eq(categories.id, agent.categoryId))
        .limit(1);

      if (categoryResult.length > 0) {
        category = categoryResult[0];
      }
    }

    // Fetch tags
    const agentTagsResult = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(agentTags)
      .innerJoin(tags, eq(agentTags.tagId, tags.id))
      .where(eq(agentTags.agentId, agentId));

    // Fetch links
    const linksResult = await db
      .select()
      .from(agentLinks)
      .where(eq(agentLinks.agentId, agentId));

    return NextResponse.json({
      ...agent,
      category,
      tags: agentTagsResult,
      links: linksResult,
    });
  } catch (error) {
    console.error('PATCH agent error:', error);
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Agent slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const agentId = parseInt(id);

    if (!agentId || isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Valid agent ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch existing agent
    const existingAgentResult = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (existingAgentResult.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'AGENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete agent (CASCADE will delete related records)
    const deleted = await db
      .delete(agents)
      .where(eq(agents.id, agentId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete agent', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Agent deleted successfully',
      id: deleted[0].id,
    });
  } catch (error) {
    console.error('DELETE agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}