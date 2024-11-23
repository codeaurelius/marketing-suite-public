'use client';

import { api } from '@repo/database';
import type { Id } from '@repo/database/convex/_generated/dataModel';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  LandingPageBuilder,
  type LandingPageContent,
} from '../../components/landing-page-builder';

interface EditLandingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLandingPage({ params }: EditLandingPageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { toast } = useToast();
  const landingPage = useQuery(api.landingPages.getById, {
    id: resolvedParams.id as Id<'landingPages'>,
  });
  const updateLandingPage = useMutation(api.landingPages.update);

  if (!landingPage) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleSubmit = async (
    content: LandingPageContent,
    template: 'modern' | 'classic'
  ) => {
    try {
      await updateLandingPage({
        id: landingPage._id,
        ...content,
        template,
      });

      toast({
        title: 'Success',
        description: 'Landing page updated successfully!',
      });
      router.push('/landing-pages');
    } catch (error) {
      console.error('Failed to update landing page:', error);
      toast({
        title: 'Error',
        description: 'Failed to update landing page. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <LandingPageBuilder
      initialContent={{
        title: landingPage.title,
        description: landingPage.description,
        productName: landingPage.productName,
        targetAudience: landingPage.targetAudience,
        keyFeatures: landingPage.keyFeatures,
        callToAction: landingPage.callToAction,
      }}
      initialTemplate={landingPage.template}
      onBack={() => router.push('/landing-pages')}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
    />
  );
}
