'use client';

import { headers } from 'next/headers';

export default function Page() {
  const headersList = headers();
  const tenantName = headersList.get('x-tenant-name');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to {tenantName}&apos;s Landing Page</h1>
        <p className="text-lg text-gray-600">Custom domain configuration is working!</p>
      </div>
    </main>
  );
}
