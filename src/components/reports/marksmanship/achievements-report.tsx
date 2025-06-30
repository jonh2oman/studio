
"use client";
import { useState, useRef, useMemo } from "react";
import { useMarksmanship, getClassificationForGrouping } from "@/hooks/use-marksmanship";
import { useCadets } from "@/hooks/use-cadets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Medal, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function AchievementsReport() {
    const { records, isLoaded: marksmanshipLoaded } = useMarksmanship();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

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
            pdf.save(`Marksmanship-Achievements.pdf`);

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
                        <CardTitle>Marksmanship Achievements Report</CardTitle>
                        <CardDescription>A summary of each cadet's best classification and competition score.</CardDescription>
                    </div>
                    <Button onClick={handleGeneratePdf} variant="outline" size="sm" className="print:hidden" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Generate PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : achievements.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No scores have been entered.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cadet</TableHead>
                                    <TableHead>Highest Classification</TableHead>
                                    <TableHead>Best Competition Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
