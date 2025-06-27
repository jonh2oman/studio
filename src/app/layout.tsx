
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { HelpButton } from '@/components/help-button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SaveProvider } from '@/hooks/use-save-context';
import { FloatingSaveButton } from '@/components/floating-save-button';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/hooks/use-theme';

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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
        <ThemeProvider>
          <AuthProvider>
            <SaveProvider>
              <TooltipProvider delayDuration={0}>
                <SidebarProvider>
                  <div className="flex min-h-screen">
                    <div className="print:hidden">
                      <AppSidebar />
                    </div>
                    <SidebarInset>
                      {children}
                    </SidebarInset>
                  </div>
                </SidebarProvider>
                <Toaster />
                <div className="print:hidden">
                  <HelpButton />
                  <FloatingSaveButton />
                </div>
              </TooltipProvider>
            </SaveProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
