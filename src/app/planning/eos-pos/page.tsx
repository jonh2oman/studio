
"use client";

import { useSettings } from "@/hooks/use-settings";
import { elementalTrainingData } from "@/lib/data";
import { getPhaseDisplayName } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Fragment } from "react";

export default function EosPosPage() {
    const { settings, isLoaded } = useSettings();

    if (!isLoaded || !settings.element) {
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
                                    {phase.performanceObjectives.map((po) => (
                                        <Fragment key={po.id}>
                                            <div className="border-t pt-6">
                                                <h4 className="text-lg font-semibold tracking-tight">{po.id} - {po.title}</h4>
                                                <div className="mt-4 border rounded-lg">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[150px]">EO Code</TableHead>
                                                                <TableHead>EO Title</TableHead>
                                                                <TableHead className="w-[150px]">Type</TableHead>
                                                                <TableHead className="w-[100px] text-right">Periods</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {po.enablingObjectives.length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                                                                        No Enabling Objectives for this PO.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                            {po.enablingObjectives.map((eo) => (
                                                                <TableRow key={eo.id}>
                                                                    <TableCell className="font-mono text-xs">{eo.id.split('-').slice(1).join('-')}</TableCell>
                                                                    <TableCell>{eo.title}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="capitalize">
                                                                            {eo.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">{eo.periods}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            </div>
        </>
    );
}
