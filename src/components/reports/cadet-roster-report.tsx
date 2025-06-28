
"use client";
import { useState, useRef } from "react";
import { useCadets } from "@/hooks/use-cadets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function CadetRosterReport() {
    const { cadets, isLoaded } = useCadets();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);
    
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
            pdf.save('Cadet-Roster-Report.pdf');

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
                        <CardTitle>Cadet Roster Report</CardTitle>
                        <CardDescription>A complete list of all cadets in the corps.</CardDescription>
                    </div>
                    <Button onClick={handleGeneratePdf} variant="outline" size="sm" className="print:hidden" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Generate PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {!isLoaded ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : cadets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No cadets in the roster.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Last Name</TableHead>
                                    <TableHead>First Name</TableHead>
                                    <TableHead>Phase</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(cadet => (
                                    <TableRow key={cadet.id}>
                                        <TableCell>{cadet.rank}</TableCell>
                                        <TableCell>{cadet.lastName}</TableCell>
                                        <TableCell>{cadet.firstName}</TableCell>
                                        <TableCell>Phase {cadet.phase}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
