
"use client";

import { useSettings } from "@/hooks/use-settings";
import { elementalTrainingData } from "@/lib/data";
import { getPhaseDisplayName } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import { Fragment, useMemo } from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { useTrainingYear } from "@/hooks/use-training-year";

export default function EosPosPage() {
    const { settings, isLoaded } = useSettings();
    const { schedule, isLoaded: scheduleLoaded } = useSchedule();
    const { adaPlanners, dayPlanners, isLoaded: yearLoaded } = useTrainingYear();

    const scheduledEoCounts = useMemo(() => {
        if (!scheduleLoaded || !yearLoaded) return {};
        
        const counts: { [key: string]: number } = {};

        Object.values(schedule).forEach(item => {
            if (item?.eo?.id) {
                counts[item.eo.id] = (counts[item.eo.id] || 0) + 1;
            }
        });

        (adaPlanners || []).forEach(planner => {
            planner.eos.forEach(eo => {
                if (eo?.id) {
                    counts[eo.id] = (counts[eo.id] || 0) + 1;
                }
            });
        });

        (dayPlanners || []).forEach(planner => {
            Object.values(planner.schedule || {}).forEach(item => {
                if (item?.eo?.id) {
                    counts[item.eo.id] = (counts[item.eo.id] || 0) + 1;
                }
            });
        });

        return counts;
    }, [schedule, adaPlanners, dayPlanners, scheduleLoaded, yearLoaded]);
    
    const isLoading = !isLoaded || !scheduleLoaded || !yearLoaded || !settings.element;

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
    
    const trainingData = elementalTrainingData[settings.element];

    return (
        <>
            <PageHeader
                title="Performance & Enabling Objectives"
                description={`A complete list of all POs and EOs for the ${settings.element} Cadet Program.`}
            />

            <div className="mt-8">
                <Accordion type="multiple" className="w-full space-y-4">
                    {trainingData.map((phase) => (
                        <Card key={phase.id}>
                            <AccordionItem value={`phase-${phase.id}`} className="border-b-0">
                                <AccordionTrigger className="p-6 text-xl hover:no-underline">
                                    {getPhaseDisplayName(settings.element, phase.id)}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-0 space-y-6">
                                    {phase.performanceObjectives.map((po) => {
                                        const mandatoryEosForPo = po.enablingObjectives.filter(eo => eo.type === 'mandatory');
                                        const isPoComplete = mandatoryEosForPo.length > 0 && mandatoryEosForPo.every(eo => 
                                            (scheduledEoCounts[eo.id] || 0) >= eo.periods
                                        );

                                        return (
                                            <Fragment key={po.id}>
                                                <div className="border-t pt-6">
                                                    <h4 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                                                        {isPoComplete && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
                                                        {po.id} - {po.title}
                                                    </h4>
                                                    <div className="mt-4 border rounded-lg">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="w-[150px]">EO Code</TableHead>
                                                                    <TableHead>EO Title</TableHead>
                                                                    <TableHead className="w-[150px]">Type</TableHead>
                                                                    <TableHead className="w-[100px] text-right">Periods</TableHead>
                                                                    <TableHead className="w-[120px] text-right">Periods Planned</TableHead>
                                                                    <TableHead className="w-[100px] text-center">Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {po.enablingObjectives.length === 0 && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={6} className="h-16 text-center text-muted-foreground">
                                                                            No Enabling Objectives for this PO.
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                                {po.enablingObjectives.map((eo) => {
                                                                    const scheduledCount = scheduledEoCounts[eo.id] || 0;
                                                                    const isEoComplete = scheduledCount >= eo.periods;
                                                                    return (
                                                                        <TableRow key={eo.id}>
                                                                            <TableCell className="font-mono text-xs">{eo.id.split('-').slice(1).join('-')}</TableCell>
                                                                            <TableCell>{eo.title}</TableCell>
                                                                            <TableCell>
                                                                                <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="capitalize">
                                                                                    {eo.type}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">{eo.periods}</TableCell>
                                                                            <TableCell className="text-right">{scheduledCount}</TableCell>
                                                                            <TableCell className="text-center">
                                                                                {isEoComplete && <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            </div>
        </>
    );
}
