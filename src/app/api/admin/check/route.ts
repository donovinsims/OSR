import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { isAdmin: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    if (!adminEmail) {
      return NextResponse.json(
        { isAdmin: false, error: 'Admin email not configured' },
        { status: 500 }
      );
    }

    const isAdmin = session.user.email?.toLowerCase() === adminEmail.toLowerCase();

    return NextResponse.json({ isAdmin, email: session.user.email });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}