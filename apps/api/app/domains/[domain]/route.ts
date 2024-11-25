import { type NextRequest, NextResponse } from 'next/server';
import { vercelDomainService } from '../../lib/vercel-domains';
import type { VercelDomainResponse } from '../../lib/vercel-domains';

export type ResponseData = VercelDomainResponse | { error: string };

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ domain: string }> }
): Promise<NextResponse<ResponseData>> {
  try {
    const { domain } = await context.params;
    const result = await vercelDomainService.getDomainConfiguration(domain);
    return NextResponse.json(result);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in GET /api/domains/[domain]:', error);
    return NextResponse.json(
      { error: 'Failed to get domain configuration' },
      { status: 500 }
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
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in DELETE /api/domains/[domain]:', error);
    return NextResponse.json(
      { error: 'Failed to remove domain' },
      { status: 500 }
    );
  }
}
