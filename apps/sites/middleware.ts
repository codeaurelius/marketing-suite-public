import { env } from '@repo/env';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').replace(
    'localhost:3005',
    env.NEXT_PUBLIC_SITES_URL.replace('https://', '')
  );
  const path = request.nextUrl.pathname;

  // Create a new URL for the rewrite
  const url = new URL(`/${hostname}${path}`, request.url);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
