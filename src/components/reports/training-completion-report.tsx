
"use client";
import { useMemo, useState, useRef } from 'react';
import { useSchedule } from '@/hooks/use-schedule';
import { elementalTrainingData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useTrainingYear } from '@/hooks/use-training-year';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSettings } from '@/hooks/use-settings';

export function TrainingCompletionReport() {
    const { schedule, isLoaded } = useSchedule();
    const { adaPlanners, isLoaded: yearsLoaded } = useTrainingYear();
    const { settings } = useSettings();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    const phaseProgress = useMemo(() => {
        if (!isLoaded || !yearsLoaded || !settings.element) return [];

        const trainingData = elementalTrainingData[settings.element];
        if (!trainingData) return [];

        const scheduleEOs = Object.values(schedule).filter(Boolean).map(item => item!.eo);
        const adaEOs = (adaPlanners || []).flatMap(p => p.eos);
        const allScheduledEOs = [...scheduleEOs, ...adaEOs];
       
        return trainingData.map(phase => {
            const mandatoryEOs = phase.performanceObjectives.flatMap(po => 
                po.enablingObjectives.filter(eo => eo.type === 'mandatory')
            );
            
            if (mandatoryEOs.length === 0) {
                return {
                    phaseName: phase.name,
                    completed: 0,
                    total: 0,
                    progress: 100,
                };
            }

            const totalMandatoryPeriods = mandatoryEOs.reduce((sum, eo) => sum + eo.periods, 0);
            
            const scheduledCounts: { [key: string]: number } = {};
            allScheduledEOs.forEach(eo => {
                if (eo.type === 'mandatory') {
                    scheduledCounts[eo.id] = (scheduledCounts[eo.id] || 0) + 1;
                }
            });

            let completedPeriods = 0;
            mandatoryEOs.forEach(eo => {
                completedPeriods += Math.min(scheduledCounts[eo.id] || 0, eo.periods);
            });

            const progress = totalMandatoryPeriods > 0 ? (completedPeriods / totalMandatoryPeriods) * 100 : 100;

            return {
                phaseName: phase.name,
                completed: completedPeriods,
                total: totalMandatoryPeriods,
                progress: Math.min(100, progress),
            };
        });
    }, [schedule, isLoaded, adaPlanners, yearsLoaded, settings.element]);

    const handleGeneratePdf = async () => {
        const input = pdfRef.current;
        if (!input) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Training-Completion-Report.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card ref={pdfRef}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Mandatory Training Completion</CardTitle>
                        <CardDescription>Progress of scheduled mandatory training periods for each phase.</CardDescription>
                    </div>
                    <Button onClick={handleGeneratePdf} variant="outline" size="sm" className="print:hidden" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Generate PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoaded ? (
                <div className="space-y-6">
                    {phaseProgress.map((p) => (
                    <div key={p.phaseName}>
                        <div className="flex justify-between mb-2">
                        <span className="font-medium">{p.phaseName}</span>
                        <span className="text-sm text-muted-foreground">{p.completed} / {p.total} Periods ({p.progress.toFixed(0)}%)</span>
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
    )
}
