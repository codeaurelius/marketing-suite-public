'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { useRouter } from 'next/navigation';
import { LandingPageList } from './components/landing-page-list';

export default function LandingPages() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Landing Pages</h1>
          <p className="text-muted-foreground">
            Create and manage your landing pages
          </p>
        </div>
        <Button onClick={() => router.push('/landing-pages/new')}>
          Create Landing Page
        </Button>
      </div>

      <div className="rounded-md border">
        <LandingPageList />
      </div>
    </div>
  );
}
