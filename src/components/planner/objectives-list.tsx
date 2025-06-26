"use client";

import { trainingData } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EO } from "@/lib/types";

export function ObjectivesList() {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, eo: EO) => {
    e.dataTransfer.setData("application/json", JSON.stringify(eo));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Training Objectives</h2>
        <p className="text-sm text-muted-foreground">Drag lessons onto the calendar.</p>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full p-4">
          {trainingData.map((phase) => (
            <AccordionItem value={`phase-${phase.id}`} key={phase.id}>
              <AccordionTrigger className="text-base font-medium">{phase.name}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full">
                  {phase.performanceObjectives.map((po) => (
                    <AccordionItem value={`po-${po.id}-${phase.id}`} key={`po-${po.id}-${phase.id}`} className="pl-4 border-l">
                      <AccordionTrigger>
                        <span className="text-left">{po.id} - {po.title}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-2">
                        <div className="space-y-2">
                          {po.enablingObjectives.map((eo) => (
                            <div
                              key={eo.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, eo)}
                              className="p-3 rounded-md border bg-background/50 cursor-grab active:cursor-grabbing flex justify-between items-start hover:border-primary/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{eo.id}</p>
                                    <p className="text-xs text-muted-foreground">{eo.title}</p>
                                </div>
                                <div className="ml-2 text-right">
                                    <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="mb-1 whitespace-nowrap">
                                        {eo.type === 'mandatory' ? 'Mandatory' : 'Complementary'}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">{eo.periods} {eo.periods === 1 ? 'period' : 'periods'}</p>
                                </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
