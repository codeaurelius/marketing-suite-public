'use client';

import { api } from '@repo/database';
import type { Id } from '@repo/database/convex/_generated/dataModel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design-system/components/ui/alert-dialog';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { PlusIcon, PowerIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AddTenantDialog } from './add-tenant-dialog';

export function TenantsList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const tenants = useQuery(api.tenants.list);
  const deleteTenant = useMutation(api.tenants.remove);
  const updateTenant = useMutation(api.tenants.update);

  const handleDelete = async (id: Id<'tenants'>) => {
    try {
      await deleteTenant({ id });
      toast({
        title: 'Success',
        description: 'Tenant deleted successfully',
      });
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Failed to delete tenant:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete tenant';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (
    id: Id<'tenants'>,
    currentStatus: 'active' | 'inactive'
  ) => {
    try {
      await updateTenant({
        id,
        status: currentStatus === 'active' ? 'inactive' : 'active',
      });
      toast({
        title: 'Success',
        description: `Tenant ${
          currentStatus === 'active' ? 'deactivated' : 'activated'
        } successfully`,
      });
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Failed to update tenant status:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update tenant status';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants?.map((tenant) => (
              <TableRow key={tenant._id}>
                <TableCell>
                  <Link
                    href={`/tenants/${tenant._id}`}
                    className="font-medium hover:underline"
                  >
                    {tenant.name}
                  </Link>
                </TableCell>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(tenant._id, tenant.status)}
                    >
                      <PowerIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this tenant? This
                            action cannot be undone. All associated data will be
                            permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(tenant._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
