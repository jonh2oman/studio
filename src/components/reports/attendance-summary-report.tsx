
"use client";
import { useCadets } from "@/hooks/use-cadets";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AttendanceSummaryReport() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();

    // NOTE: This uses placeholder data for demonstration purposes.
    // A full implementation would require reading the entire attendance history.
    const attendanceSummary = useMemo(() => {
        if (!cadetsLoaded) return [];
        return cadets.map(cadet => {
            const randomPresent = Math.floor(15 + Math.random() * 10);
            const randomExcused = Math.floor(Math.random() * 4);
            const totalDays = 28;
            const absent = totalDays - randomPresent - randomExcused;
            const percentage = ((randomPresent + randomExcused) / totalDays) * 100;
            return {
                ...cadet,
                present: randomPresent,
                absent: absent > 0 ? absent : 0,
                excused: randomExcused,
                percentage: Math.min(100, percentage)
            }
        });
    }, [cadets, cadetsLoaded]);


    const handlePrint = () => window.print();

    const isLoading = !cadetsLoaded;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Attendance Summary</CardTitle>
                        <CardDescription>Overall attendance summary for each cadet for the current training year.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
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
