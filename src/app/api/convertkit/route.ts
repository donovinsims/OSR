import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, formId } = await req.json();

    if (!email || !formId) {
      return NextResponse.json(
        { error: 'Email and formId are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CONVERTKIT_API_KEY;
    
    if (!apiKey) {
      console.error('ConvertKit API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Subscribe to ConvertKit form
    const convertkitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          email: email,
        }),
      }
    );

    const data = await convertkitResponse.json();

    if (!convertkitResponse.ok) {
      console.error('ConvertKit API error:', data);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: convertkitResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscription: data.subscription
    });
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}