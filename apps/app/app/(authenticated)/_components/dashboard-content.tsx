'use client';

import { api } from '@repo/database';
import { useQuery } from 'convex/react';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
}

function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium leading-none tracking-tight">
          {title}
        </h3>
        <p className="text-4xl font-bold mt-4">{value}</p>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  );
}

export function DashboardContent() {
  const tenants = useQuery(api.tenants.list);
  const totalTenants = tenants?.length ?? 0;
  const totalDomains =
    tenants?.reduce((acc, tenant) => acc + (tenant.domainsCount ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Tenants"
          value={totalTenants.toString()}
          description="Active client accounts"
        />
        <DashboardCard
          title="Active Domains"
          value={totalDomains.toString()}
          description="Connected custom domains"
        />
        <DashboardCard
          title="Landing Pages"
          value="0"
          description="Total landing pages created"
        />
      </div>
    </div>
  );
}
