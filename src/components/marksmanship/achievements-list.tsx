
"use client";

import { useMemo, useState } from "react";
import { useMarksmanship, getClassificationForGrouping } from "@/hooks/use-marksmanship";
import { useCadets } from "@/hooks/use-cadets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Medal, Target, View } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { MarksmanshipRecord, Cadet } from "@/lib/types";

export function AchievementsList() {
    const { records, isLoaded: marksmanshipLoaded } = useMarksmanship();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const [viewingCadet, setViewingCadet] = useState<Cadet | null>(null);

    const isLoading = !marksmanshipLoaded || !cadetsLoaded;

    const achievements = useMemo(() => {
        if (isLoading) return [];
        return cadets.map(cadet => {
            const cadetRecords = records.filter(r => r.cadetId === cadet.id);
            
            let highestClassification = "Unclassified";
            let classificationDate = "";
            let bestCompetitionScore = 0;
            let competitionDate = "";

            cadetRecords.forEach(record => {
                if (record.targetType === 'grouping' && record.grouping1_cm && record.grouping2_cm) {
                    const classification = getClassificationForGrouping(record.grouping1_cm, record.grouping2_cm);
                    const levelOrder = ["Unclassified", "Marksman", "First Class Marksman", "Expert Marksman", "Distinguished Marksman"];
                    if (levelOrder.indexOf(classification) > levelOrder.indexOf(highestClassification)) {
                        highestClassification = classification;
                        classificationDate = record.date;
                    }
                } else if (record.targetType === 'competition' && record.competitionScores) {
                    const totalScore = record.competitionScores.reduce((a, b) => a + b, 0);
                    if (totalScore > bestCompetitionScore) {
                        bestCompetitionScore = totalScore;
                        competitionDate = record.date;
                    }
                }
            });

            return {
                ...cadet,
                highestClassification,
                classificationDate,
                bestCompetitionScore,
                competitionDate,
            };
        });
    }, [cadets, records, isLoading]);
    
    const cadetHistory = viewingCadet ? records.filter(r => r.cadetId === viewingCadet.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && setViewingCadet(null)}>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cadet</TableHead>
                            <TableHead>Highest Classification</TableHead>
                            <TableHead>Best Competition Score</TableHead>
                            <TableHead className="text-right">History</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {achievements.length === 0 && <TableRow><TableCell colSpan={4} className="h-24 text-center">No scores entered yet.</TableCell></TableRow>}
                        {achievements.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(cadet => (
                            <TableRow key={cadet.id}>
                                <TableCell className="font-medium">{cadet.rank} {cadet.lastName}, {cadet.firstName}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <Badge variant={cadet.highestClassification === 'Unclassified' ? 'outline' : 'default'} className="w-fit">
                                            <Medal className="mr-1.5 h-3 w-3"/>
                                            {cadet.highestClassification}
                                        </Badge>
                                        {cadet.classificationDate && <span className="text-xs text-muted-foreground mt-1">{format(new Date(cadet.classificationDate.replace(/-/g, '/')), "dd MMM yyyy")}</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <div className="flex flex-col">
                                        <Badge variant="secondary" className="w-fit">
                                            <Target className="mr-1.5 h-3 w-3"/>
                                            {cadet.bestCompetitionScore} / 100
                                        </Badge>
                                        {cadet.competitionDate && <span className="text-xs text-muted-foreground mt-1">{format(new Date(cadet.competitionDate.replace(/-/g, '/')), "dd MMM yyyy")}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => setViewingCadet(cadet)}><View className="h-4 w-4" /></Button>
                                    </DialogTrigger>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Score History for {viewingCadet?.rank} {viewingCadet?.lastName}</DialogTitle>
                    <DialogDescription>A log of all recorded scores for this cadet in the current training year.</DialogDescription>
                </DialogHeader>
                 <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-muted z-10">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Target Type</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cadetHistory.length === 0 && <TableRow><TableCell colSpan={4} className="h-24 text-center">No scores recorded for this cadet.</TableCell></TableRow>}
                            {cadetHistory.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(new Date(record.date.replace(/-/g, '/')), "dd MMM yyyy")}</TableCell>
                                    <TableCell className="capitalize">{record.targetType}</TableCell>
                                    <TableCell>
                                        {record.targetType === 'grouping' ? 
                                            `G1: ${record.grouping1_cm}cm, G2: ${record.grouping2_cm}cm` :
                                            `${record.competitionScores?.reduce((a, b) => a + b, 0)}/100`
                                        }
                                    </TableCell>
                                     <TableCell>{record.notes || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
