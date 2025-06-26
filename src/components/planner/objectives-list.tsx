
"use client";

import { useMemo } from "react";
import { trainingData } from "@/lib/data";
import { useSchedule } from "@/hooks/use-schedule";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EO } from "@/lib/types";
import { CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export function ObjectivesList() {
  const { schedule } = useSchedule();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, eo: EO) => {
    e.dataTransfer.setData("application/json", JSON.stringify(eo));
    e.dataTransfer.effectAllowed = "move";
  };

  const scheduledEoCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    Object.values(schedule).forEach(item => {
        if (item) {
            const eoId = item.eo.id;
            counts[eoId] = (counts[eoId] || 0) + 1;
        }
    });
    return counts;
  }, [schedule]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Training Objectives</h2>
        <p className="text-sm text-muted-foreground">Drag periods onto the calendar.</p>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full p-4">
          {trainingData.map((phase) => (
            <AccordionItem value={`phase-${phase.id}`} key={phase.id}>
              <AccordionTrigger className="text-base font-medium">{phase.name}</AccordionTrigger>
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

                            return (
                              <div key={eo.id} className="bg-muted/30 rounded-md">
                                <div className={cn("flex items-center p-3 rounded-t-md", isEoComplete && eo.type === 'mandatory' ? "bg-green-100/80 dark:bg-green-900/30" : "bg-muted/50")}>
                                    {isEoComplete && eo.type === 'mandatory' && <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />}
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{eo.id}</p>
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
        </Accordion>
      </ScrollArea>
    </div>
  );
}
