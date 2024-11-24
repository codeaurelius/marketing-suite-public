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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { Globe, PlusIcon, RefreshCw, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface DomainManagementProps {
  tenantId: Id<'tenants'>;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
    <Globe className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">No domains configured</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Add a domain to start managing your landing pages with custom domains.
    </p>
  </div>
);

export function DomainManagement({ tenantId }: DomainManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const { toast } = useToast();

  const domains = useQuery(api.domains.list, { tenantId });
  const createDomain = useMutation(api.domains.create);
  const verifyDomain = useMutation(api.domains.verifyDomain);
  const deleteDomain = useMutation(api.domains.remove);

  const handleAddDomain = async () => {
    try {
      await createDomain({
        domain: newDomain,
        tenantId,
      });
      setIsAddDialogOpen(false);
      setNewDomain('');
      toast({
        title: 'Success',
        description: 'Domain added successfully',
      });
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Failed to add domain:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add domain';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleVerifyDomain = async (domainId: Id<'domains'>) => {
    try {
      await verifyDomain({ domainId });
      toast({
        title: 'Success',
        description: 'Domain verification started',
      });
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Failed to verify domain:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to verify domain';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Domain Management
        </CardTitle>
        <CardDescription>
          Manage custom domains for your landing pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Domain</DialogTitle>
                  <DialogDescription>
                    Enter the domain you want to add to your tenant
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddDomain}
                    disabled={!newDomain}
                    type="submit"
                  >
                    Add Domain
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {domains?.length === 0 ? (
              <EmptyState />
            ) : (
              domains?.map((domain) => (
                <div
                  key={domain._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{domain.domain}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {domain.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyDomain(domain._id)}
                      disabled={domain.status === 'verified'}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this domain? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await deleteDomain({ domainId: domain._id });
                                toast({
                                  title: 'Success',
                                  description: 'Domain deleted successfully',
                                });
                              } catch (error) {
                                // biome-ignore lint/suspicious/noConsole: <explanation>
                                console.error(
                                  'Failed to delete domain:',
                                  error
                                );
                                const errorMessage =
                                  error instanceof Error
                                    ? error.message
                                    : 'Failed to delete domain';
                                toast({
                                  title: 'Error',
                                  description: errorMessage,
                                  variant: 'destructive',
                                });
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
