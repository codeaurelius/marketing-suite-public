import { vercelDomainService } from '@/lib/vercel-domains';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();
    const result = await vercelDomainService.addDomain(domain);
    return NextResponse.json(result);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in POST /api/domains:', error);
    return NextResponse.json(
      { error: 'Failed to add domain' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain');
  if (!domain) {
    return NextResponse.json(
      { error: 'Domain parameter is required' },
      { status: 400 }
    );
  }

  try {
    const result = await vercelDomainService.getDomainConfiguration(domain);
    return NextResponse.json(result);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Error in GET /api/domains:', error);
    return NextResponse.json(
      { error: 'Failed to get domain configuration' },
      { status: 500 }
    );
  }
}
