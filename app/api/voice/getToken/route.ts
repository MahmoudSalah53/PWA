import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const BACKEND_URL = process.env.BACKEND_URL || 'http://148.230.125.200:9060';
    
    console.log('Calling backend:', `${BACKEND_URL}/api/voice/getToken`);
    console.log('Request body:', body);
    
    const response = await fetch(`${BACKEND_URL}/api/voice/getToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get token', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Success! Token received');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}