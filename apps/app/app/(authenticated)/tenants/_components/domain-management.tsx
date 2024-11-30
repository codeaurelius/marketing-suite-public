'use client';

import { api } from '@repo/database';
import type { Id } from '@repo/database/convex/_generated/dataModel';
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
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { DomainCard } from './domain-card';

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
  <div className="text-center py-4">
    <p className="text-sm text-muted-foreground">No domains added yet.</p>
    <p className="text-sm text-muted-foreground">
      Add a domain to start managing your landing pages with custom domains.
    </p>
  </div>
);

export const DomainManagement = ({ tenantId }: DomainManagementProps) => {
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const domains = useQuery(api.domains.list, { tenantId });
  const addDomain = useMutation(api.domains.create);
  const removeDomain = useMutation(api.domains.remove);

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
      await addDomain({
        domain: newDomain,
        tenantId,
      });

      // Then add to Vercel
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: newDomain }),
      });

      if (!response.ok) {
        throw new Error('Failed to add domain to Vercel');
      }

      toast({
        title: 'Domain added',
        description:
          'Please configure your DNS settings according to the instructions below.',
      });

      setNewDomain('');
      setIsAddingDomain(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add domain. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleRemoveDomain = async (domainId: Id<'domains'>) => {
    try {
      // Get the domain from the list before removing it
      const domainToRemove = domains?.find((d) => d._id === domainId);
      if (!domainToRemove) {
        throw new Error('Domain not found');
      }

      // Remove from database
      await removeDomain({ domainId });

      // Remove from Vercel
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/domains/${domainToRemove.domain}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove domain from Vercel');
      }

      toast({
        title: 'Domain removed',
        description: 'Domain has been removed successfully.',
      });
    } catch {
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
        <CardTitle>Domain Management</CardTitle>
        <CardDescription>
          Add and manage custom domains for your landing pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isAddingDomain} onOpenChange={setIsAddingDomain}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
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

        <div className="space-y-4">
          {domains?.length ? (
            domains.map((domain) => (
              <DomainCard
                key={domain._id}
                domain={domain}
                onRemove={handleRemoveDomain}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
