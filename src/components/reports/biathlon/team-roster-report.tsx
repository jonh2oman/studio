
"use client";

import { useMemo, useState, useRef } from 'react';
import { useCadets } from '@/hooks/use-cadets';
import { useTrainingYear } from '@/hooks/use-training-year';
import { getBiathlonCategory } from '@/lib/biathlon-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';

export function BiathlonTeamRosterReport() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { currentYear, isLoaded: yearLoaded } = useTrainingYear();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    const biathlonTeam = useMemo(() => {
        if (!cadetsLoaded || !yearLoaded || !currentYear) return [];
        return cadets
            .filter(c => c.isBiathlonTeamMember)
            .map(c => ({
                ...c,
                category: c.dateOfBirth ? getBiathlonCategory(c.dateOfBirth, currentYear) : 'N/A'
            }))
            .sort((a,b) => a.lastName.localeCompare(b.lastName));
    }, [cadets, cadetsLoaded, yearLoaded, currentYear]);

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
            pdf.save(`Biathlon-Team-Roster.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const isLoading = !cadetsLoaded || !yearLoaded;

    return (
        <Card ref={pdfRef}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Biathlon Team Roster</CardTitle>
                        <CardDescription>A list of cadets marked as biathlon team members.</CardDescription>
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
                ) : biathlonTeam.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No cadets marked as biathlon team members.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cadet</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {biathlonTeam.map(cadet => (
                                    <TableRow key={cadet.id}>
                                        <TableCell className="font-medium">{cadet.lastName}, {cadet.firstName}</TableCell>
                                        <TableCell>{cadet.rank}</TableCell>
                                        <TableCell><Badge variant="secondary">{cadet.category}</Badge></TableCell>
                                        <TableCell>{cadet.dateOfBirth ? format(new Date(cadet.dateOfBirth.replace(/-/g, '/')), 'dd MMM yyyy') : 'N/A'}</TableCell>
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

