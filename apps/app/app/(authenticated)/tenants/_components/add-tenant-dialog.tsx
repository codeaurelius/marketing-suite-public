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
import { useMutation } from 'convex/react';
import { useState } from 'react';

interface AddTenantDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddTenantDialog({ open, onClose }: AddTenantDialogProps) {
  const [name, setName] = useState('');
  const createTenant = useMutation(api.tenants.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    try {
      await createTenant({ name: name.trim() });
      setName('');
      onClose();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Failed to create tenant:', error);
      // TODO: Add error handling
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tenant name"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Tenant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
