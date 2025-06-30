
"use client";

import { useMemo, useState } from "react";
import { elementalTrainingData } from "@/lib/data";
import { useSchedule } from "@/hooks/use-schedule";
import { useSettings } from "@/hooks/use-settings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EO, CustomEO } from "@/lib/types";
import { CheckCircle2, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useTrainingYear } from "@/hooks/use-training-year";
import { getPhaseDisplayName } from "@/lib/utils";

export function ObjectivesList() {
  const { schedule } = useSchedule();
  const { settings } = useSettings();
  const { adaPlanners } = useTrainingYear();
  const [searchTerm, setSearchTerm] = useState("");

  const trainingData = elementalTrainingData[settings.element] || [];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, eo: EO) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: 'new', eo: eo }));
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleCustomDragStart = (e: React.DragEvent<HTMLDivElement>, customEo: CustomEO) => {
    const eoForDrag: EO = {
        ...customEo,
        id: `CS-${customEo.id}`,
        type: 'complimentary',
        poId: 'CS'
    };
    e.dataTransfer.setData("application/json", JSON.stringify({ type: 'new', eo: eoForDrag }));
    e.dataTransfer.effectAllowed = "move";
  };

  const scheduledEoCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    
    // Count from main schedule
    Object.values(schedule).forEach(item => {
        if (item && item.eo) {
            const eoId = item.eo.id;
            counts[eoId] = (counts[eoId] || 0) + 1;
        }
    });

    // Count from ADA planners
    (adaPlanners || []).forEach(planner => {
      planner.eos.forEach(eo => {
        counts[eo.id] = (counts[eo.id] || 0) + 1;
      });
    });

    return counts;
  }, [schedule, adaPlanners]);

  const filteredTrainingData = useMemo(() => {
    if (!trainingData) return [];
    if (!searchTerm) return trainingData;
    const lowercasedTerm = searchTerm.toLowerCase();

    return trainingData.map(phase => {
        const filteredPOs = phase.performanceObjectives.map(po => {
            const filteredEOs = po.enablingObjectives.filter(eo =>
                eo.title.toLowerCase().includes(lowercasedTerm) ||
                eo.id.toLowerCase().includes(lowercasedTerm)
            );
            return { ...po, enablingObjectives: filteredEOs };
        }).filter(po => po.enablingObjectives.length > 0);

        return { ...phase, performanceObjectives: filteredPOs };
    }).filter(phase => phase.performanceObjectives.length > 0);
  }, [searchTerm, trainingData]);
  
  const filteredCustomEOs = useMemo(() => {
    if (!settings.customEOs) return [];
    if (!searchTerm) return settings.customEOs;
    const lowercasedTerm = searchTerm.toLowerCase();
    return settings.customEOs.filter(eo => 
        eo.id.toLowerCase().includes(lowercasedTerm) ||
        eo.title.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, settings.customEOs]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3">
        <h2 className="text-lg font-semibold">Training Objectives</h2>
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Search by ID or keyword..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <p className="text-sm text-muted-foreground">Drag periods onto the calendar.</p>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full p-4">
          {filteredTrainingData.map((phase) => (
            <AccordionItem value={`phase-${phase.id}`} key={phase.id}>
              <AccordionTrigger className="text-base font-medium">{getPhaseDisplayName(settings.element, phase.id)}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full">
                  {phase.performanceObjectives.map((po) => {
                    const mandatoryEOs = po.enablingObjectives.filter(eo => eo.type === 'mandatory');
                    const isPoComplete = mandatoryEOs.length > 0 && mandatoryEOs.every(eo => (scheduledEoCounts[eo.id] || 0) >= eo.periods);
                    
                    return (
                    <AccordionItem value={`po-${po.id}-${phase.id}`} key={`po-${po.id}-${phase.id}`} className="pl-4 border-l">
                      <AccordionTrigger className={cn("hover:no-underline", isPoComplete && "text-green-500 dark:text-green-400")}>
                        <div className="flex items-center gap-2">
                          {isPoComplete && <CheckCircle2 className="h-4 w-4" />}
                          <span className="text-left">{po.id} - {po.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-2">
                        <div className="space-y-4">
                          {po.enablingObjectives.map((eo) => {
                            const scheduledCount = scheduledEoCounts[eo.id] || 0;
                            const isEoComplete = scheduledCount >= eo.periods;
                            const remainingPeriods = eo.periods - scheduledCount;
                            const displayId = eo.id.split('-').slice(1).join('-');

                            return (
                              <div key={eo.id} className="bg-muted/30 rounded-md">
                                <div className={cn("flex items-center p-3 rounded-t-md", isEoComplete && eo.type === 'mandatory' ? "bg-green-100/80 dark:bg-green-900/30" : "bg-muted/50")}>
                                    {isEoComplete && eo.type === 'mandatory' && <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />}
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{displayId}</p>
                                        <p className="text-xs text-muted-foreground">{eo.title}</p>
                                    </div>
                                    <div className="ml-2 text-right text-xs space-y-1">
                                        <Badge 
                                            variant={eo.type === 'mandatory' ? 'default' : 'secondary'} 
                                            className={cn(isEoComplete && eo.type === 'mandatory' && "bg-green-600 hover:bg-green-600/90")}
                                        >
                                            {eo.type === 'mandatory' ? 'Mandatory' : 'Complementary'}
                                        </Badge>
                                        <p className="text-muted-foreground">{scheduledCount} / {eo.periods} scheduled</p>
                                    </div>
                                </div>

                                {remainingPeriods > 0 && (
                                  <div className="p-2 border-x border-b border-muted-foreground/10 rounded-b-md">
                                      <div
                                          draggable
                                          onDragStart={(e) => handleDragStart(e, eo)}
                                          className="p-2 rounded-md border bg-background cursor-grab active:cursor-grabbing flex justify-between items-start hover:border-primary/50 transition-colors"
                                      >
                                          <div className="flex-1">
                                              <p className="font-semibold text-sm">{displayId}</p>
                                              <p className="text-xs text-muted-foreground truncate">{eo.title}</p>
                                          </div>
                                          <div className="ml-2 text-right">
                                              <Badge variant="outline" className="whitespace-nowrap">
                                                  1 Period
                                              </Badge>
                                          </div>
                                      </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )})}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
          
          <AccordionItem value="custom-eos">
            <AccordionTrigger className="text-base font-medium">Corps/Squadron EOs</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                  {filteredCustomEOs.length === 0 && <p className="text-sm text-muted-foreground px-2">No matching custom EOs found.</p>}
                  {filteredCustomEOs.map((eo) => (
                      <div key={eo.id} className="bg-muted/30 rounded-md">
                        <div className="flex items-center p-3 rounded-t-md bg-muted/50">
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{eo.id}</p>
                                <p className="text-xs text-muted-foreground">{eo.title}</p>
                            </div>
                            <div className="ml-2 text-right text-xs space-y-1">
                                <Badge variant={'secondary'}>
                                    Custom
                                </Badge>
                                <p className="text-muted-foreground">{eo.periods} Period(s)</p>
                            </div>
                        </div>

                          <div className="p-2 border-x border-b border-muted-foreground/10 rounded-b-md">
                              <div
                                  draggable
                                  onDragStart={(e) => handleCustomDragStart(e, eo)}
                                  className="p-2 rounded-md border bg-background cursor-grab active:cursor-grabbing flex justify-between items-start hover:border-primary/50 transition-colors"
                              >
                                  <div className="flex-1">
                                      <p className="font-semibold text-sm">{eo.id}</p>
                                      <p className="text-xs text-muted-foreground truncate">{eo.title}</p>
                                  </div>
                                  <div className="ml-2 text-right">
                                      <Badge variant="outline" className="whitespace-nowrap">
                                          1 Period
                                      </Badge>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
                </div>
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      </ScrollArea>
    </div>
  );
}
