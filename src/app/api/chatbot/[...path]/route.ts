import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PATHS = new Set([
  'chat',
  'history',
  'clear_session',
  'health',
  'config',
]);

function getBackendBaseUrl() {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
}

async function proxyToBackend(request: NextRequest, path: string[]) {
  if (path.length !== 1 || !ALLOWED_PATHS.has(path[0])) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const queryString = request.nextUrl.search || '';
  const targetUrl = `${getBackendBaseUrl()}/api/chatbot/${path[0]}/${queryString}`;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const authorization = request.headers.get('authorization');
  if (authorization) headers.set('authorization', authorization);

  let body: string | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    const rawBody = await request.text();
    if (rawBody) body = rawBody;
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  const text = await response.text();
  const responseHeaders = new Headers();
  const responseContentType = response.headers.get('content-type');
  if (responseContentType) {
    responseHeaders.set('content-type', responseContentType);
  }

  return new NextResponse(text, {
    status: response.status,
    headers: responseHeaders,
  });
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

