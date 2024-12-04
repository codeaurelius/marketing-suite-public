'use client';

import { api } from '@repo/database';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import type { LandingPageContent } from '../components/landing-page-builder';

export default function NewLandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createLandingPageMutation = useMutation(api.landingPages.create);

  const handleSubmit = (
    content: LandingPageContent,
    template: 'modern' | 'classic'
  ) => {
    try {
      // Get the HTML content from the preview iframe
      const iframe = document.querySelector('iframe');
      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Could not access iframe content');
      }

      const htmlContent = iframeDoc.documentElement.outerHTML;

      // Save to database
      // await createLandingPageMutation({
      //   ...content,
      //   template,
      //   html: htmlContent,
      //   userId: 'user123', // TODO: Replace with actual user ID from auth
      //   tenantId: 'tenant123',
      // });

      toast({
        title: 'Success',
        description: 'Landing page created successfully!',
      });
      router.push('/landing-pages');
    } catch (error) {
      console.error('Failed to create landing page:', error);
      toast({
        title: 'Error',
        description: 'Failed to create landing page. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // return (
  //   <LandingPageBuilder
  //     onBack={() => router.push('/landing-pages')}
  //     onSubmit={handleSubmit}
  //     submitLabel="Create Landing Page"
  //   />
  // );
  return <>Landing Page Builder placeholder</>;
}
