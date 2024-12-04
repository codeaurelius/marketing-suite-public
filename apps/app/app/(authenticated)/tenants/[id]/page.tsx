'use client';

import { api } from '@repo/database';
import type { Id } from '@repo/database/convex/_generated/dataModel';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@repo/design-system/components/ui/breadcrumb';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { useQuery } from 'convex/react';
import { notFound } from 'next/navigation';
import React from 'react';
import { DomainManagement } from '../_components/domain-management';

export default function TenantDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParams = React.use(params);
  const tenant = useQuery(api.tenants.get, {
    id: resolvedParams.id as Id<'tenants'>,
  });

  if (tenant === undefined) {
    return null; // Loading
  }

  if (tenant === null) {
    notFound();
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/tenants">Tenants</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>{tenant.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4">
          <DomainManagement tenantId={tenant._id} />
        </div>
      </main>
    </>
  );
}
