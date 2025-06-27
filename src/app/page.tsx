
"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, Users, ClipboardCheck, Settings, Loader2, Trophy, BookOpen, Info, CheckCircle, CalendarDays, CalendarPlus } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { trainingData } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const dashboardCategories = [
    {
        title: "Planning",
        items: [
            { href: "/planner", title: "Corps/Squadron Training Plan - Annual", icon: Calendar, description: "Plan your training year schedule by dragging and dropping lessons." },
            { href: "/weekends", title: "Weekend Planner", icon: CalendarDays, description: "Plan training weekends with a detailed 9-period schedule." },
            { href: "/lda", title: "LDA Day Planner", icon: CalendarPlus, description: "Plan single ad-hoc training days with a 9-period schedule." },
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
  const { schedule, isLoaded } = useSchedule();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const setupStatus = localStorage.getItem("isSetupComplete");
    setIsSetupComplete(setupStatus === 'true');
  }, []);

  const phaseProgress = useMemo(() => {
    if (!isLoaded) return [];

    const scheduledEOs = Object.values(schedule).filter(Boolean).map(item => item!.eo);
    const scheduledMandatoryIds = new Set(
        scheduledEOs
            .filter(eo => eo.type === 'mandatory')
            .map(eo => eo.id)
    );

    return trainingData.map(phase => {
        const mandatoryEOs = phase.performanceObjectives.flatMap(po => 
            po.enablingObjectives.filter(eo => eo.type === 'mandatory')
        );
        
        const totalMandatoryPeriods = mandatoryEOs.reduce((sum, eo) => sum + eo.periods, 0);

        if (totalMandatoryPeriods === 0) {
            return {
                phaseName: phase.name,
                progress: 100,
            };
        }
        
        const completedPeriods = mandatoryEOs
            .filter(eo => scheduledMandatoryIds.has(eo.id))
            .reduce((sum, eo) => sum + eo.periods, 0);

        const progress = (completedPeriods / totalMandatoryPeriods) * 100;

        return {
            phaseName: phase.name,
            progress: Math.min(100, progress),
        };
    });
  }, [schedule, isLoaded]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your Training Officer Planning Tool."
      />
      <div className="mt-8 space-y-8">
        
        <Card className="border">
          <CardHeader>
            <CardTitle>Mandatory Training Progress</CardTitle>
            <CardDescription>
              A quick glance at the percentage of mandatory training periods scheduled for each phase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {phaseProgress.map((p) => (
                  <div key={p.phaseName}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{p.phaseName}</span>
                      <span className="text-sm font-semibold">{p.progress.toFixed(0)}%</span>
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
            defaultValue={dashboardCategories.map(c => c.title)}
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
