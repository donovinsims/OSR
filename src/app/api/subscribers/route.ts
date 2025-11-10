import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'api' } = body;

    // Validate required field
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Validate source if provided
    const validSources = ['homepage', 'footer', 'modal', 'api'];
    const normalizedSource = source.toLowerCase();
    if (!validSources.includes(normalizedSource)) {
      return NextResponse.json(
        { error: 'Invalid source. Must be one of: homepage, footer, modal, api', code: 'INVALID_SOURCE' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, normalizedEmail))
      .limit(1);

    // If email doesn't exist, insert new subscriber
    if (existingSubscriber.length === 0) {
      await db.insert(subscribers).values({
        email: normalizedEmail,
        source: normalizedSource,
        createdAt: new Date().toISOString(),
      });
    }

    // Return success response regardless of whether email was new or existing
    // This prevents revealing if an email is already subscribed (privacy consideration)
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error('POST /api/subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}