
"use client";
import { useState, useRef, useMemo } from "react";
import { useMarksmanship } from "@/hooks/use-marksmanship";
import { useCadets } from "@/hooks/use-cadets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function FullScoreLogReport() {
    const { records, isLoaded: marksmanshipLoaded } = useMarksmanship();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    const isLoading = !marksmanshipLoaded || !cadetsLoaded;

    const scoresWithNames = useMemo(() => {
        if (isLoading) return [];
        return records.map(record => {
            const cadet = cadets.find(c => c.id === record.cadetId);
            return {
                ...record,
                cadetName: cadet ? `${cadet.rank} ${cadet.lastName}, ${cadet.firstName}` : 'Unknown Cadet'
            };
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [records, cadets, isLoading]);

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
            pdf.save(`Marksmanship-Score-Log.pdf`);

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
                        <CardTitle>Marksmanship Full Score Log</CardTitle>
                        <CardDescription>A complete log of all scores recorded during the training year.</CardDescription>
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
                ) : scoresWithNames.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No scores have been entered.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Cadet</TableHead>
                                    <TableHead>Target Type</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scoresWithNames.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell>{format(new Date(record.date.replace(/-/g, '/')), "dd MMM yyyy")}</TableCell>
                                        <TableCell>{record.cadetName}</TableCell>
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
                )}
            </CardContent>
        </Card>
    );
}
