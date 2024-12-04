import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

// Define public routes that should skip domain handling
const PUBLIC_PATHS = ['/_next', '/favicon.ico', '/api', '/trpc'];

async function customDomainMiddleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Skip domain handling for public routes and the main app domain
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath || hostname === process.env.NEXT_PUBLIC_APP_URL) {
    return null;
  }

  try {
    // Check if this is a custom domain
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${hostname}`
    );
    if (!response.ok) {
      // If domain is not found or not verified, redirect to the main app
      return NextResponse.redirect(
        new URL(pathname, process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    const domain = await response.json();
    if (!domain.verified) {
      return NextResponse.redirect(
        new URL(pathname, process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    // For now, just serve a static landing page
    // Later this can be expanded to serve the actual tenant content
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${hostname} - Landing Page</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to ${hostname}</h1>
            <p>Your custom domain has been successfully configured!</p>
          </div>
        </body>
      </html>
    `,
      {
        headers: {
          'content-type': 'text/html',
        },
      }
    );
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in custom domain middleware:', error);
    return NextResponse.redirect(
      new URL(pathname, process.env.NEXT_PUBLIC_APP_URL)
    );
  }
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // const customDomainResponse = customDomainMiddleware(req);
  // if (customDomainResponse) {
  //   return customDomainResponse;
  // }

  // If not a custom domain request, proceed with Clerk authentication
  return clerkMiddleware(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // biome-ignore lint/nursery/noSecrets: <explanation>
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
