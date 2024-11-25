import { type NextRequest, NextResponse } from 'next/server';
import { vercelDomainService } from '../../../lib/vercel-domains';
import type { VercelDomainResponse } from '../../../lib/vercel-domains';

export type ResponseData = VercelDomainResponse | { error: string };

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
