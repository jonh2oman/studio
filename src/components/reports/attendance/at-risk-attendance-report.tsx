
"use client";
import { useCadets } from "@/hooks/use-cadets";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Loader2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AT_RISK_THRESHOLD = 75;

export function AtRiskAttendanceReport() {
    const { cadets, attendance, isLoaded: cadetsLoaded } = useCadets();

    const atRiskCadets = useMemo(() => {
        if (!cadetsLoaded) return [];

        const recordedTrainingDays = Object.keys(attendance);
        if (recordedTrainingDays.length === 0) return [];

        const summaries = cadets.map(cadet => {
            let present = 0;
            let excused = 0;
            let daysTracked = 0;

            recordedTrainingDays.forEach(date => {
                const record = attendance[date]?.find(r => r.cadetId === cadet.id);
                if (record) {
                    daysTracked++;
                    if (record.status === 'present') present++;
                    else if (record.status === 'excused') excused++;
                }
            });
            
            const percentage = daysTracked > 0 ? ((present + excused) / daysTracked) * 100 : 0;
            return { ...cadet, percentage };
        });

        return summaries
            .filter(c => c.percentage < AT_RISK_THRESHOLD)
            .sort((a,b) => a.percentage - b.percentage);

    }, [cadets, attendance, cadetsLoaded]);


    const handlePrint = () => window.print();

    const isLoading = !cadetsLoaded;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>At-Risk Attendance Report</CardTitle>
                        <CardDescription>Cadets with attendance below {AT_RISK_THRESHOLD}%, which may affect promotions or awards.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : atRiskCadets.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No cadets are currently at risk.</p>
                        <p className="text-xs">This report is based on saved attendance records.</p>
                    </div>
                ) : (
                    <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cadet</TableHead>
                                <TableHead className="w-[200px]">Attendance %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {atRiskCadets.map(cadet => (
                                <TableRow key={cadet.id} className="text-destructive/80">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span>{cadet.rank} {cadet.lastName}, {cadet.firstName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={cadet.percentage} className="h-2 [&>div]:bg-destructive" />
                                            <span className="text-xs font-medium">{cadet.percentage.toFixed(0)}%</span>
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
