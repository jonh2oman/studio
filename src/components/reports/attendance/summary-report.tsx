
"use client";
import { useCadets } from "@/hooks/use-cadets";
import { useMemo, useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function AttendanceSummaryReport() {
    const { cadets, attendance, isLoaded: cadetsLoaded } = useCadets();
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    const attendanceSummary = useMemo(() => {
        if (!cadetsLoaded) return [];

        const recordedTrainingDays = Object.keys(attendance);

        if (recordedTrainingDays.length === 0) {
            return cadets.map(cadet => ({
                ...cadet,
                present: 0,
                absent: 0,
                excused: 0,
                percentage: 100, // No days recorded, so 100%
            }));
        }

        return cadets.map(cadet => {
            let present = 0;
            let excused = 0;
            let absent = 0;
            let daysTracked = 0;

            recordedTrainingDays.forEach(date => {
                const record = attendance[date]?.find(r => r.cadetId === cadet.id);
                // Only track attendance for cadets who have a record on a given day
                if (record) {
                    daysTracked++;
                    if (record.status === 'present') present++;
                    else if (record.status === 'excused') excused++;
                    else if (record.status === 'absent') absent++;
                }
            });
            
            const percentage = daysTracked > 0 ? ((present + excused) / daysTracked) * 100 : 0;
            
            return {
                ...cadet,
                present,
                absent,
                excused,
                percentage,
            };
        });
    }, [cadets, attendance, cadetsLoaded]);

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
            pdf.save(`Attendance-Summary-Report.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const isLoading = !cadetsLoaded;

    return (
        <Card ref={pdfRef}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Attendance Summary</CardTitle>
                        <CardDescription>Overall attendance summary for each cadet for the current training year.</CardDescription>
                    </div>
                    <Button onClick={handleGeneratePdf} variant="outline" size="sm" className="print:hidden" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Generate PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : cadets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No cadets in the roster.</p>
                ) : (
                    <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cadet</TableHead>
                                <TableHead className="text-center">Present</TableHead>
                                <TableHead className="text-center">Excused</TableHead>
                                <TableHead className="text-center">Absent</TableHead>
                                <TableHead className="w-[200px]">Attendance %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceSummary.sort((a, b) => a.lastName.localeCompare(b.lastName)).map(summary => (
                                <TableRow key={summary.id}>
                                    <TableCell>{summary.rank} {summary.lastName}, {summary.firstName}</TableCell>
                                    <TableCell className="text-center">{summary.present}</TableCell>
                                    <TableCell className="text-center">{summary.excused}</TableCell>
                                    <TableCell className="text-center">{summary.absent}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={summary.percentage} className="h-2" />
                                            <span className="text-xs font-medium">{summary.percentage.toFixed(0)}%</span>
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
    )
}
