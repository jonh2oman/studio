
'use client';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSettings } from '@/hooks/use-settings';
import { elementalTrainingData } from '@/lib/data';
import { getPhaseDisplayName } from '@/lib/utils';
import { DraggableEoItem } from './draggable-eo-item';
import type { Phase, EO } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Card } from '../ui/card';

interface ObjectivesPanelProps {
    scheduledEoCounts: { [key: string]: number };
}

export function ObjectivesPanel({ scheduledEoCounts }: ObjectivesPanelProps) {
    const { settings, isLoaded } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const trainingData: Phase[] = settings.element ? elementalTrainingData[settings.element] : [];
    const lowercasedFilter = searchTerm.toLowerCase();

    const filteredData = trainingData.map(phase => {
        if (phase.id === 5) return { ...phase, performanceObjectives: [] }; // Exclude Phase 5

        const filteredPos = phase.performanceObjectives.map(po => {
            const filteredEos = po.enablingObjectives.filter(eo => 
                eo.id.toLowerCase().includes(lowercasedFilter) || 
                eo.title.toLowerCase().includes(lowercasedFilter)
            );
            return { ...po, enablingObjectives: filteredEos };
        }).filter(po => po.enablingObjectives.length > 0);
        return { ...phase, performanceObjectives: filteredPos };
    }).filter(phase => phase.performanceObjectives.length > 0);

    return (
        <Card className="w-[350px] min-w-[300px] max-w-[500px]">
            <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Training Objectives</h2>
                    <Input 
                        placeholder="Search EOs..." 
                        className="mt-2" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="flex-1">
                    {!isLoaded ? (
                        <div className="flex justify-center items-center h-full p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Accordion type="multiple" className="p-4">
                            {filteredData.map(phase => (
                                <AccordionItem key={phase.id} value={`phase-${phase.id}`}>
                                    <AccordionTrigger>{getPhaseDisplayName(settings.element, phase.id)}</AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-2">
                                        {phase.performanceObjectives.map(po => (
                                            <div key={po.id}>
                                                <h4 className="font-semibold text-sm mb-1">{po.id} - {po.title}</h4>
                                                <div className="space-y-1 pl-2 border-l-2 ml-2">
                                                    {po.enablingObjectives.map(eo => (
                                                        <DraggableEoItem 
                                                            key={eo.id} 
                                                            eo={eo}
                                                            scheduledCount={scheduledEoCounts[eo.id] || 0}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </ScrollArea>
            </div>
        </Card>
    );
}
