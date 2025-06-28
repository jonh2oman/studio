
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { HelpButton } from '@/components/help-button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/use-auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BugReportButton } from '@/components/bug-report/bug-report-button';

export const metadata: Metadata = {
  title: 'Corps/Sqn Manager',
  description: 'An interactive web app for managing your Cadet Corps or Squadron.',
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const providers = (
      <AuthProvider>
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
            <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-4">
              <HelpButton />
              <BugReportButton />
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
  );

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
        {GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {providers}
          </GoogleOAuthProvider>
        ) : (
          providers
        )}
      </body>
    </html>
  );
}
