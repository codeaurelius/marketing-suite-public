import type { VercelDomainInfo, VercelDomainResponse } from '@/lib/types';
import { vercelDomainService } from '@/lib/vercel-domains';
import { type NextRequest, NextResponse } from 'next/server';

export type ResponseData =
  | VercelDomainResponse
  | VercelDomainInfo
  | { error: string };

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ domain: string }> }
): Promise<NextResponse<ResponseData>> {
  try {
    const { domain } = await context.params;
    const result = await vercelDomainService.verifyDomain(domain);
    return NextResponse.json(result);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in POST /api/domains/[domain]/verify:', error);
    return NextResponse.json(
      { error: 'Failed to verify domain' },
      { status: 500 }
    );
  }
}
