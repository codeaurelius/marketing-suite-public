import { api, convex } from '@repo/database';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { domain } = await params;

  // Fetch domain data
  const domainData = await convex.query(api.domains.getByDomain, {
    domain,
  });

  if (!domainData) {
    notFound();
  }

  // Fetch tenant data
  const tenantData = await convex.query(api.tenants.get, {
    id: domainData.tenantId,
  });

  if (!tenantData) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Domain: {domain}</h1>
        <p>Tenant: {tenantData.name}</p>
        <p>Homepage</p>
      </div>
    </main>
  );
}
