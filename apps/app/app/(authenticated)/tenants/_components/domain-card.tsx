'use client';

import type { VercelDomainResponse } from '@repo/api';
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
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { env } from '@repo/env';
import { RefreshCw, TrashIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import ConfiguredSection from './configured-section';

export interface DomainCardProps {
  domain: {
    _id: Id<'domains'>;
    domain: string;
    status: string;
  };
  onRemove: (domainId: Id<'domains'>) => void;
}

export const DomainCard = ({ domain, onRemove }: DomainCardProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<VercelDomainResponse | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  const fetchConfig = useCallback(async () => {
    setIsLoadingConfig(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/domains/${domain.domain}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get domain configuration');
      }

      const newConfig = await response.json();
      setConfig(newConfig);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to get domain configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingConfig(false);
    }
  }, [domain.domain, toast]);

  // useEffect(() => {
  //   // Initial fetch
  //   fetchConfig();

  //   // Set up polling every 5 seconds
  //   // const interval = setInterval(fetchConfig, 5000);
  //   const interval = setInterval(fetchConfig, 500000);

  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, [fetchConfig]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: remove after testing
  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="flex flex-col rounded-lg border p-4 space-y-4 sm:shadow-md">
      <div className="flex items-center justify-between">
        <a
          className="font-semibold text-lg"
          href={`https://${domain.domain}`}
          target="_blank"
          rel="noreferrer"
        >
          {domain.domain}
          <span className="inline-block ml-2">
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchConfig}
            disabled={isLoadingConfig}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoadingConfig ? 'animate-spin' : ''}`}
            />
            {isLoadingConfig ? 'Loading...' : 'Refresh'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <TrashIcon className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the domain from your tenant. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(domain._id)}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ConfiguredSection domainInfo={config} />
    </div>
  );
};
