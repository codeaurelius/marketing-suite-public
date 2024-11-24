'use client';

import { api } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useMutation } from 'convex/react';
import { useState } from 'react';

interface AddTenantDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddTenantDialog({ open, onClose }: AddTenantDialogProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const createTenant = useMutation(api.tenants.create);

  const validateInput = () => {
    if (!name.trim()) {
      setError('Tenant name is required');
      return false;
    }
    if (name.length < 3) {
      setError('Tenant name must be at least 3 characters long');
      return false;
    }
    if (name.length > 50) {
      setError('Tenant name must be less than 50 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createTenant({ name: name.trim() });
      toast({
        title: 'Success',
        description: 'Tenant created successfully',
      });
      setName('');
      onClose();
    } catch (error) {
      console.error('Failed to create tenant:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create tenant';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tenant Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter tenant name"
              disabled={isSubmitting}
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p id="name-error" className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Tenant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
