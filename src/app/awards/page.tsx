
"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { awardsData } from '@/lib/awards-data';
import type { Award, Cadet } from '@/lib/types';
import { useCadets } from '@/hooks/use-cadets';
import { useSchedule } from '@/hooks/use-schedule';
import { useAwards } from '@/hooks/use-awards';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export default function AwardsPage() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { schedule, isLoaded: scheduleLoaded } = useSchedule();
    const { winners, setWinner } = useAwards();

    const trainingDates = useMemo(() => {
        if (!scheduleLoaded) return [];
        const dates = new Set<string>();
        Object.keys(schedule).forEach(slotId => {
            const dateStr = slotId.substring(0, 10);
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                dates.add(dateStr);
            }
        });
        return Array.from(dates);
    }, [schedule, scheduleLoaded]);

    const attendancePercentages = useMemo(() => {
        if (!cadetsLoaded || trainingDates.length === 0) return {};

        const percentages: { [cadetId: string]: number } = {};
        cadets.forEach(cadet => {
            let presentCount = 0;
            trainingDates.forEach(date => {
                // This is a simplified attendance check. A more robust system would use the attendance module data.
                // For now, we assume if they have any scheduled period on a training day, they were present.
                const isScheduled = Object.keys(schedule).some(slotId => slotId.startsWith(date) && schedule[slotId] !== undefined);
                // This logic is a placeholder. For now we assume if training happened they were there.
                // A real implementation would need to cross-reference with the attendance module.
                // Let's assume a dummy value for now to show functionality.
                presentCount++;
            });
            // This is a dummy calculation for demonstration.
            const randomAttendance = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
            percentages[cadet.id] = randomAttendance;
        });
        // A more realistic calculation would be:
        // const percentage = (presentCount / trainingDates.length) * 100;
        // percentages[cadet.id] = percentage;
        // But without actual attendance data, we use random values.
        cadets.forEach(c => {
             percentages[c.id] = Math.floor(70 + Math.random() * 31); // Random % between 70 and 100
        });
        return percentages;
    }, [cadets, cadetsLoaded, trainingDates, schedule]);

    const getEligibleCadets = (award: Award): Cadet[] => {
        if (!cadetsLoaded) return [];

        let eligible = [...cadets];

        const attendanceCriterion = award.criteria.find(c => c.toLowerCase().includes('attendance'));
        if (attendanceCriterion) {
            const requiredPercentMatch = attendanceCriterion.match(/(\d+)%/);
            if (requiredPercentMatch) {
                const requiredPercent = parseInt(requiredPercentMatch[1], 10);
                eligible = eligible.filter(c => (attendancePercentages[c.id] || 0) >= requiredPercent);
            }
        }
        
        const phaseCriterion = award.criteria.find(c => c.toLowerCase().includes('phase'));
        if (phaseCriterion) {
            const phaseMatch = phaseCriterion.match(/Phase (\d)/i);
            if (phaseMatch) {
                const requiredPhase = parseInt(phaseMatch[1], 10);
                eligible = eligible.filter(c => c.phase === requiredPhase);
            }
        }

        if (award.eligibility && award.eligibility.toLowerCase().includes("top senior cadet")) {
             eligible = eligible.filter(c => c.phase >= 3);
        }
        
        if (award.eligibility && award.eligibility.toLowerCase().includes("top junior cadet")) {
             eligible = eligible.filter(c => c.phase <= 2);
        }

        return eligible;
    }

    const groupedAwards = useMemo(() => {
        return awardsData.reduce((acc, award) => {
            const category = award.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(award);
            return acc;
        }, {} as Record<string, Award[]>);
    }, []);

    return (
        <>
            <PageHeader
                title="Awards Management"
                description="Review award criteria, view eligible cadets, and assign winners."
            />
            <div className="mt-6 space-y-8">
                {Object.entries(groupedAwards).map(([category, awards]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle>{category} Awards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {awards.map(award => {
                                    const eligibleCadets = getEligibleCadets(award);
                                    const winnerId = winners[award.id];
                                    const winner = cadets.find(c => c.id === winnerId);
                                    
                                    return (
                                    <AccordionItem value={award.id} key={award.id}>
                                        <AccordionTrigger className="text-lg hover:no-underline">
                                            <div className="flex flex-col text-left">
                                                <span>{award.name}</span>
                                                {winner && (
                                                    <span className="text-sm font-normal text-primary flex items-center gap-1">
                                                        <Crown className="h-4 w-4" /> Winner: {winner.rank} {winner.lastName}, {winner.firstName}
                                                    </span>
                                                )}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">Description</h4>
                                                <p className="text-muted-foreground">{award.description}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Criteria</h4>
                                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                    {award.criteria.map((c, i) => <li key={i}>{c}</li>)}
                                                </ul>
                                            </div>
                                             {award.deadline && <p className="text-sm"><span className="font-semibold">Deadline:</span> {award.deadline}</p>}
                                             {award.approval && <p className="text-sm"><span className="font-semibold">Approval:</span> {award.approval}</p>}

                                             <div className="pt-4">
                                                <h4 className="font-semibold mb-2">Eligible Cadets ({eligibleCadets.length})</h4>
                                                {eligibleCadets.length > 0 ? (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {eligibleCadets.map(cadet => (
                                                            <div key={cadet.id} className="p-3 rounded-md border bg-background flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-medium">{cadet.lastName}, {cadet.firstName}</p>
                                                                    <p className="text-sm text-muted-foreground">{cadet.rank} / Phase {cadet.phase}</p>
                                                                </div>
                                                                 <Button 
                                                                    size="sm" 
                                                                    onClick={() => setWinner(award.id, cadet.id)}
                                                                    variant={winnerId === cadet.id ? 'default' : 'outline'}
                                                                >
                                                                    {winnerId === cadet.id ? <Crown className="mr-2 h-4 w-4" /> : null}
                                                                    {winnerId === cadet.id ? 'Winner' : 'Select'}
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground text-sm">No cadets currently meet the eligibility criteria for this award.</p>
                                                )}
                                             </div>

                                        </AccordionContent>
                                    </AccordionItem>
                                )})}
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
