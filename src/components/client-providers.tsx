
"use client";

import { AuthProvider } from '@/hooks/use-auth';
import { HelpProvider } from '@/hooks/use-help';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <HelpProvider>
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </TooltipProvider>
      </HelpProvider>
    </AuthProvider>
  );
}
