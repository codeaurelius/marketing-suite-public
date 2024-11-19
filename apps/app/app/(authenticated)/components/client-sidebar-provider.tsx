"use client";

import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { ReactNode } from 'react';

export function ClientSidebarProvider({ children }: { children: ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}