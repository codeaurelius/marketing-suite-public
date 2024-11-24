'use client';

import { api } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { useQuery } from 'convex/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { AddTenantDialog } from './add-tenant-dialog';

export function TenantsContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const tenants = useQuery(api.tenants.list);

  return (
    <div className="space-y-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-sm text-gray-500">Manage your tenant accounts</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Domains</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants?.map((tenant) => (
              <TableRow key={tenant._id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.domainsCount ?? 0}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      tenant.status === 'active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {tenant.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(tenant._creationTime).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddTenantDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
}
