'use client';

import { TrashIcon } from '@radix-ui/react-icons';
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
import { useToast } from '@repo/design-system/hooks/use-toast';
import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface LandingPage {
  _id: Id<'landingPages'>;
  _creationTime: number;
  title: string;
  description: string;
  template: 'modern' | 'classic';
  updatedAt: number;
}

export function LandingPageList() {
  const { toast } = useToast();
  const landingPages = useQuery(api.landingPages.list, { userId: 'user123' }); // TODO: Replace with actual user ID
  const deleteLandingPage = useMutation(api.landingPages.remove);

  const handleDelete = async (id: Id<'landingPages'>) => {
    try {
      await deleteLandingPage({ id });
      toast({
        title: 'Success',
        description: 'Landing page deleted successfully!',
        duration: 3000,
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to delete landing page. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  if (!landingPages) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
      </div>
    );
  }

  if (landingPages.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="mb-1 font-medium text-gray-900 text-lg">
          No landing pages yet
        </h3>
        <p className="mb-4 text-gray-500 text-sm">
          Get started by creating your first landing page
        </p>
        <Link href="/landing-pages/new">Create Landing Page</Link>
        {/* <button onClick={() => toast({ title: 'Hello' })}>Show Toast</button> */}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {landingPages.map((page) => (
          <TableRow key={page._id}>
            <TableCell className="font-medium">{page.title}</TableCell>
            <TableCell>{page.description}</TableCell>
            <TableCell className="capitalize">{page.template}</TableCell>
            <TableCell>
              {new Date(page.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  href={`/landing-pages/edit/${page._id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  View
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Landing Page</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this landing page? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(page._id)}
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
  );
}
