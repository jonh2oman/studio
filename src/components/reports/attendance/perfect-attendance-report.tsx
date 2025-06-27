
"use client";
import { useCadets } from "@/hooks/use-cadets";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Loader2, Star } from "lucide-react";

export function PerfectAttendanceReport() {
    const { cadets, attendance, isLoaded: cadetsLoaded } = useCadets();

    const perfectAttendanceCadets = useMemo(() => {
        if (!cadetsLoaded) return [];
        
        const recordedTrainingDays = Object.keys(attendance);
        if (recordedTrainingDays.length === 0) return [];

        return cadets.filter(cadet => {
            let isPerfect = true;
            let wasTracked = false;

            for (const date of recordedTrainingDays) {
                const record = attendance[date]?.find(r => r.cadetId === cadet.id);
                if (record) {
                    wasTracked = true;
                    if (record.status === 'absent') {
                        isPerfect = false;
                        break;
                    }
                }
            }
            return wasTracked && isPerfect;
        }).sort((a,b) => a.lastName.localeCompare(b.lastName));

    }, [cadets, attendance, cadetsLoaded]);


    const handlePrint = () => window.print();

    const isLoading = !cadetsLoaded;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Perfect Attendance Report</CardTitle>
                        <CardDescription>Cadets with no unexcused absences on recorded training nights.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : perfectAttendanceCadets.length === 0 ? (
                     <div className="text-center text-muted-foreground py-10">
                        <p>No cadets currently have perfect attendance.</p>
                        <p className="text-xs">This report is based on saved attendance records.</p>
                    </div>
                ) : (
                    <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cadet</TableHead>
                                <TableHead>Rank</TableHead>
                                <TableHead>Phase</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {perfectAttendanceCadets.map(cadet => (
                                <TableRow key={cadet.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                                            <span>{cadet.lastName}, {cadet.firstName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{cadet.rank}</TableCell>
                                    <TableCell>Phase {cadet.phase}</TableCell>
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
