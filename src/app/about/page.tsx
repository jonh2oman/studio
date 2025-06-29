
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Mail, Github, Code, AlertTriangle, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChangelogDialog } from '@/components/about/changelog-dialog';

export default function AboutPage() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="About Corps/Sqn Manager"
        description="Information, credits, and licensing for the application."
      />
      <div className="mt-6 space-y-8">

        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
                <p>This is an unofficial planning tool and is not endorsed by the Canadian Cadet Organization (CCO) or the Department of National Defence (DND).</p>
                <p className="mt-2">It is not a replacement for official CCO applications such as FORTRESS or Extranet. Always refer to official sources for policy and administration.</p>
            </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6" />
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Corps/Sqn Manager is a comprehensive web application designed to assist Canadian Cadet Organization (CCO) Training Officers in planning, managing, and reporting on their corps/squadron's annual training schedule.
            </p>
            <p className="text-muted-foreground">
              The goal is to provide an intuitive, all-in-one solution to streamline administrative tasks, track progress against the Cadet Program curriculum, and facilitate efficient communication through automated report generation.
            </p>
            <div className="flex items-center gap-4">
                <p>
                    <strong>Version:</strong> 1.3.2
                </p>
                <ChangelogDialog isOpen={isChangelogOpen} onOpenChange={setIsChangelogOpen}>
                    <Button variant="outline" size="sm" onClick={() => setIsChangelogOpen(true)}>
                        <History className="mr-2 h-4 w-4" />
                        View Changelog
                    </Button>
                </ChangelogDialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              Author & Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-muted-foreground">This application was designed and developed by Jonathan Waterman.</p>
             <div className="flex flex-wrap gap-4">
                <a href="mailto:jonathan@waterman.work" className="flex items-center gap-2 text-primary hover:underline">
                    <Mail className="h-4 w-4" /> Contact
                </a>
                 <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <Github className="h-4 w-4" /> GitHub
                </a>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License Information</CardTitle>
            <CardDescription>This software is distributed under the MIT License.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
             <p className="font-semibold">The MIT License (MIT)</p>
             <p>Copyright © {new Date().getFullYear()} Jonathan Waterman</p>
             <p>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
             </p>
              <p>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
             </p>
             <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
             </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
