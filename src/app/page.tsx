
"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, Users, ClipboardCheck, Settings, Loader2, Trophy, BookOpen, Info, CheckCircle, CalendarDays, CalendarPlus, LogIn, ClipboardList, Building2 } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { trainingData } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useTrainingYear } from '@/hooks/use-training-year';

const dashboardCategories = [
    {
        title: "Planning",
        items: [
            { href: "/planner", title: "Corps/Squadron Training Plan - Annual", icon: Calendar, description: "Plan your training year schedule by dragging and dropping lessons." },
            { href: "/weekends", title: "Weekend Planner", icon: CalendarDays, description: "Plan training weekends with a detailed 9-period schedule." },
            { href: "/lda", title: "LDA Day Planner", icon: CalendarPlus, description: "Plan single ad-hoc training days with a 9-period schedule." },
            { href: "/ada", title: "ADA Planner", icon: ClipboardList, description: "Account for EOs completed at Area Directed Activities." },
        ]
    },
    {
        title: "Cadet & Attendance Management",
        items: [
            { href: "/cadets", title: "Cadet Management", icon: Users, description: "Add, view, and manage your corps' cadet roster." },
            { href: "/attendance", title: "Attendance Management", icon: ClipboardCheck, description: "Mark and track attendance for training nights." },
            { href: "/awards", title: "Awards Management", icon: Trophy, description: "Manage corps awards and track eligible cadets." },
        ]
    },
    {
        title: "Corps Management",
        items: [
            { href: "/corps-management", title: "Asset Management", icon: Building2, description: "Track and manage all corps-owned assets." },
        ]
    },
    {
        title: "Reporting",
        items: [
            { href: "/reports", title: "Reports", icon: FileText, description: "Generate WROs and view various other reports for your corps." },
        ]
    },
    {
        title: "Settings & Help",
        items: [
            { href: "/instructions", title: "Instructions", icon: BookOpen, description: "Read the user guide for this application." },
            { href: "/settings", title: "Settings", icon: Settings, description: "Configure corps information, instructors, and classrooms." },
            { href: "/about", title: "About", icon: Info, description: "View application details and license information." },
        ]
    }
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { schedule, isLoaded } = useSchedule();
  const { currentYear, isLoaded: yearsLoaded, adaPlanners } = useTrainingYear();
  
  const phaseProgress = useMemo(() => {
    if (!isLoaded || !yearsLoaded) return [];

    const scheduleEOs = Object.values(schedule).filter(Boolean).map(item => item!.eo);
    const adaEOs = (adaPlanners || []).flatMap(p => p.eos);
    const allScheduledEOs = [...scheduleEOs, ...adaEOs];

    const scheduledCounts: { [key: string]: number } = {};
    allScheduledEOs.forEach(eo => {
        if (eo.type === 'mandatory') {
            scheduledCounts[eo.id] = (scheduledCounts[eo.id] || 0) + 1;
        }
    });

    return trainingData.map(phase => {
        const mandatoryEOs = phase.performanceObjectives.flatMap(po => 
            po.enablingObjectives.filter(eo => eo.type === 'mandatory')
        );
        
        const totalMandatoryPeriods = mandatoryEOs.reduce((sum, eo) => sum + eo.periods, 0);

        if (totalMandatoryPeriods === 0) {
            return {
                phaseName: phase.name,
                progress: 100,
                completed: 0,
                total: 0,
            };
        }
        
        let completedPeriods = 0;
        mandatoryEOs.forEach(eo => {
            completedPeriods += Math.min(scheduledCounts[eo.id] || 0, eo.periods);
        });

        const progress = (completedPeriods / totalMandatoryPeriods) * 100;

        return {
            phaseName: phase.name,
            progress: Math.min(100, progress),
            completed: completedPeriods,
            total: totalMandatoryPeriods,
        };
    });
  }, [schedule, isLoaded, adaPlanners, yearsLoaded]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader
          title="Welcome to the Training Officer's Planning Tool"
          description="Please log in or sign up to continue."
        />
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
          <div className="mb-4 rounded-full border bg-background p-4 shadow-sm">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Create an Account to Get Started</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">An account allows you to save your training plans and access them securely from any device.</p>
          <div className="mt-6 flex gap-4">
            <Button asChild size="lg">
              <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  if (user && yearsLoaded && !currentYear) {
    return (
      <>
        <PageHeader
          title="Welcome to the Training Planner!"
          description="The first step is to create a new training year."
        />
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
          <div className="mb-4 rounded-full border bg-background p-4 shadow-sm">
            <CalendarPlus className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Create Your First Training Year</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            All your schedules, cadets, and reports are organized by training year. Go to settings to set one up now.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Go to Settings</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!currentYear) {
      return (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.email}!`}
      />
      <div className="mt-8 space-y-8">
        
        <Card className="border">
          <CardHeader>
            <CardTitle>Mandatory Training Planning Progress</CardTitle>
            <CardDescription>
              A quick glance at the percentage of mandatory training periods scheduled for each phase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded ? (
              <div className="space-y-6">
                {phaseProgress.map((p) => (
                  <div key={p.phaseName}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-foreground">{p.phaseName}</span>
                      <span className="text-sm font-semibold text-muted-foreground">{p.completed} / {p.total} Periods ({p.progress.toFixed(0)}%)</span>
                    </div>
                    <Progress value={p.progress} aria-label={`${p.phaseName} completion progress`} />
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               </div>
            )}
          </CardContent>
        </Card>
        
        <Accordion 
            type="multiple" 
            defaultValue={["Planning"]}
            className="space-y-4"
        >
            {dashboardCategories.map((category) => (
                <Card key={category.title} className="border">
                    <AccordionItem value={category.title} className="border-b-0">
                        <AccordionTrigger className="p-6 hover:no-underline text-xl font-bold tracking-tight">
                            {category.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-0">
                             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {category.items.map((item) => (
                                    <Link key={item.href} href={item.href} className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background h-full">
                                        <Card className="h-full transition-colors border hover:border-primary/50 hover:bg-muted/30">
                                            <CardHeader>
                                                <div className="flex items-start justify-between gap-4">
                                                    <CardTitle className="text-xl font-bold">
                                                        {item.title}
                                                    </CardTitle>
                                                    <item.icon className="h-8 w-8 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            ))}
        </Accordion>
      </div>
    </>
  );
}
