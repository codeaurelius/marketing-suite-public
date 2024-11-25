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
import { env } from '@repo/env';
import { useMutation, useQuery } from 'convex/react';
import { Globe, PlusIcon, RefreshCw, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define regex pattern at the top level for better performance
const DOMAIN_REGEX =
  /^(?!:\/\/)(?![-])[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

interface DomainManagementProps {
  tenantId: Id<'tenants'>;
}

const isValidDomain = (domain: string): boolean => {
  return DOMAIN_REGEX.test(domain);
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
    <Globe className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">No domains configured</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Add a domain to start managing your landing pages with custom domains.
    </p>
  </div>
);

export const DomainManagement = ({ tenantId }: DomainManagementProps) => {
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [domainConfigs, setDomainConfigs] = useState<Record<string, any>>({});
  const domains = useQuery(api.domains.list, { tenantId });
  const addDomain = useMutation(api.domains.create);
  const verifyDomain = useMutation(api.domains.verifyDomain);
  const removeDomain = useMutation(api.domains.remove);

  // Fetch domain configurations when domains list changes
  useEffect(() => {
    const fetchDomainConfigs = async () => {
      if (!domains) return;

      const configs: Record<string, any> = {};
      for (const domain of domains) {
        try {
          const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/domains/${domain.domain}`
          );
          if (response.ok) {
            configs[domain.domain] = await response.json();
          }
        } catch (error) {
          console.error(`Error fetching config for ${domain.domain}:`, error);
        }
      }
      setDomainConfigs(configs);
    };

    fetchDomainConfigs();
  }, [domains]);

  const handleAddDomain = async () => {
    if (!isValidDomain(newDomain)) {
      toast({
        title: 'Invalid domain',
        description: 'Please enter a valid domain name',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingDomain(true);
    try {
      // First add to our database
      const domainId = await addDomain({ domain: newDomain, tenantId });

      // Then add to Vercel
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain }),
      });

      if (!response.ok) {
        throw new Error('Failed to add domain to Vercel');
      }

      const vercelDomain = await response.json();
      toast({
        title: 'Domain added',
        description:
          'Please configure your DNS settings according to the instructions below',
      });

      setNewDomain('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add domain. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (
    domainId: Id<'domains'>,
    domain: string
  ) => {
    setIsVerifyingDomain(true);
    console.log('Verifying domain:', domain);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/domains/${domain}/verify`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to verify domain');
      }

      const vercelDomain = await response.json();
      if (vercelDomain.verified) {
        await verifyDomain({ domainId });
        toast({
          title: 'Domain verified',
          description: 'Your domain is now ready to use',
        });
      } else {
        toast({
          title: 'Verification failed',
          description: 'Please check your DNS settings and try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify domain. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifyingDomain(false);
    }
  };

  const handleRemoveDomain = async (
    domainId: Id<'domains'>,
    domain: string
  ) => {
    try {
      await removeDomain({ domainId });

      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/domains/${domain}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove domain from Vercel');
      }

      toast({
        title: 'Domain removed',
        description: 'Domain has been successfully removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove domain. Please try again.',
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
            <Dialog open={isAddingDomain} onOpenChange={setIsAddingDomain}>
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
                      onChange={(e) => {
                        setNewDomain(e.target.value);
                      }}
                      className=""
                      aria-invalid={false}
                      aria-errormessage={undefined}
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
                  className="flex flex-col rounded-lg border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
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
                        onClick={() =>
                          handleVerifyDomain(domain._id, domain.domain)
                        }
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
                              onClick={() =>
                                handleRemoveDomain(domain._id, domain.domain)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {domainConfigs[domain.domain] && (
                    <div className="mt-2 text-sm space-y-1 border-t pt-2">
                      <p>
                        <span className="font-medium">
                          Verification Status:
                        </span>{' '}
                        {domainConfigs[domain.domain].verified
                          ? 'Verified'
                          : 'Not Verified'}
                      </p>
                      {domainConfigs[domain.domain].verification?.map(
                        (v: any, i: number) => (
                          <div key={i} className="pl-4 text-muted-foreground">
                            <p>Type: {v.type}</p>
                            <p className="font-mono text-xs break-all">
                              Value: {v.value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
