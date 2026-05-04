/**
 * Eagle API Authentication Test Endpoint
 * Use this to debug authentication issues
 * 
 * GET /api/eagle/test-auth
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.EAGLE_CLIENT_ID;
  const clientSecret = process.env.EAGLE_CLIENT_SECRET;

  // Check if credentials are configured
  if (!clientId || !clientSecret) {
    return NextResponse.json({
      success: false,
      error: 'Eagle API credentials not configured',
      details: {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      }
    }, { status: 500 });
  }

  try {
    // Eagle API uses Bearer auth with client_id:client_secret (NOT base64 encoded)
    // See: https://api.eaglesoftware.com.au/
    console.log('[Test] Trying Eagle API authentication (Bearer with client_id:client_secret)...');
    const credentials = `${clientId}:${clientSecret}`;
    
    const response = await fetch('https://www.eagleagent.com.au/api/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    const status = response.status;
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (response.ok) {
      // Eagle API returns: { data: { token: { token: "...", expiresAt: 123456 } } }
      const token = data?.data?.token?.token || data?.token?.token || data?.token || data?.access_token;
      
      return NextResponse.json({
        success: true,
        method: 'Bearer with client_id:client_secret',
        status: status,
        response: data,
        tokenFound: !!token,
        tokenPath: data?.data?.token?.token ? 'data.token.token' : 
                   data?.token?.token ? 'token.token' :
                   data?.token ? 'token' :
                   data?.access_token ? 'access_token' : 'not found',
      });
    }

    // Authentication failed
    return NextResponse.json({
      success: false,
      error: 'Eagle API authentication failed',
      status: status,
      response: data,
      hint: 'Check that your EAGLE_CLIENT_ID and EAGLE_CLIENT_SECRET are correct. You can find them in Eagle Settings > API Credentials.',
    }, { status: 500 });

  } catch (error) {
    console.error('[Test] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
