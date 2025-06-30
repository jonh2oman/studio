
"use client";

import { useMemo, useState, useRef } from 'react';
import { useBiathlon } from '@/hooks/use-biathlon';
import { useCadets } from '@/hooks/use-cadets';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function BiathlonResultsReport() {
    const { results, isLoaded: biathlonLoaded } = useBiathlon();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    const isLoading = !biathlonLoaded || !cadetsLoaded;

    const resultsWithCadetNames = useMemo(() => {
        if (isLoading) return [];
        return results.map(result => {
            const cadet = cadets.find(c => c.id === result.cadetId);
            return {
                ...result,
                cadetName: cadet ? `${cadet.rank} ${cadet.lastName}, ${cadet.firstName}` : 'Unknown Cadet'
            };
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [results, cadets, isLoading]);
    
    const handleGeneratePdf = async () => {
        const input = pdfRef.current;
        if (!input) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for wider table
            const imgProperties = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Biathlon-Results-Report.pdf`);

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
                        <CardTitle>Biathlon Competition Results</CardTitle>
                        <CardDescription>A log of all recorded competition results for the team.</CardDescription>
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
                ) : results.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No biathlon results have been logged yet.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Competition</TableHead>
                                    <TableHead>Cadet</TableHead>
                                    <TableHead>Race Type</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Prone</TableHead>
                                    <TableHead>Standing</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resultsWithCadetNames.map(result => (
                                    <TableRow key={result.id}>
                                        <TableCell>
                                            <p className="font-medium">{result.competitionName}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(result.date.replace(/-/g, '/')), "dd MMM yyyy")}</p>
                                        </TableCell>
                                        <TableCell>{result.cadetName}</TableCell>
                                        <TableCell><Badge variant="outline">{result.raceType}</Badge></TableCell>
                                        <TableCell className="font-mono">{result.skiTime}</TableCell>
                                        <TableCell>{result.finalRank || 'N/A'}</TableCell>
                                        <TableCell>{result.proneScores || 'N/A'}</TableCell>
                                        <TableCell>{result.standingScores || 'N/A'}</TableCell>
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
