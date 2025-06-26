
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { HelpButton } from '@/components/help-button';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'RCSCC 288 Ardent Training Officer Planning Tool',
  description: 'Interactive web app for planning Sea Cadet Corps training.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <div className="print:hidden">
                <AppSidebar />
              </div>
              <SidebarInset>
                <div className="p-4 sm:p-6 lg:p-8 w-full print:p-0">
                  {children}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
          <div className="print:hidden">
            <HelpButton />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
