import type { VercelDomainResponse } from '@/lib/types';
import { vercelDomainService } from '@/lib/vercel-domains';
import { env } from '@repo/env';
import { type NextRequest, NextResponse } from 'next/server';

export type ResponseData = VercelDomainResponse | { error: string };

// Handle OPTIONS requests for CORS
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': env.NEXT_PUBLIC_APP_URL,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ domain: string }> }
): Promise<NextResponse<ResponseData>> {
  try {
    const { domain } = await context.params;
    const result = await vercelDomainService.getDomainConfiguration(domain);
    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': env.NEXT_PUBLIC_APP_URL,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in GET /api/domains/[domain]:', error);
    return NextResponse.json(
      { error: 'Failed to get domain configuration' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': env.NEXT_PUBLIC_APP_URL,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ domain: string }> }
): Promise<NextResponse<ResponseData | null>> {
  try {
    const { domain } = await context.params;
    await vercelDomainService.removeDomain(domain);
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': env.NEXT_PUBLIC_APP_URL,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in DELETE /api/domains/[domain]:', error);
    return NextResponse.json(
      { error: 'Failed to remove domain' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': env.NEXT_PUBLIC_APP_URL,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
