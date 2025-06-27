
"use client";
import { useState } from "react";
import { useCadets } from "@/hooks/use-cadets";
import { useSettings } from "@/hooks/use-settings";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Printer, Loader2, Check, X, CircleSlash } from "lucide-react";
import type { AttendanceRecord } from "@/lib/types";

export function DailyAttendanceReport() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { cadets, getAttendanceForDate, isLoaded: cadetsLoaded } = useCadets();
    const { settings, isLoaded: settingsLoaded } = useSettings();

    const attendanceRecords: AttendanceRecord[] = selectedDate ? getAttendanceForDate(format(selectedDate, "yyyy-MM-dd")) : [];

    const handlePrint = () => window.print();

    const trainingDaysFilter = (date: Date) => {
        return date.getDay() === settings.trainingDay;
    };
    
    const isLoading = !cadetsLoaded || !settingsLoaded;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>Daily Attendance Report</CardTitle>
                        <CardDescription>View and print attendance for a specific training night.</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                modifiers={{ trainingDays: trainingDaysFilter }}
                                modifiersClassNames={{ trainingDays: "bg-primary/20 rounded-full" }}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                         <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
                    </div>
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
                                <TableHead>Status</TableHead>
                                <TableHead>Arrived Late</TableHead>
                                <TableHead>Left Early</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceRecords.map(record => {
                                const cadet = cadets.find(c => c.id === record.cadetId);
                                if (!cadet) return null;

                                return (
                                    <TableRow key={record.cadetId}>
                                        <TableCell>{cadet.rank} {cadet.lastName}, {cadet.firstName}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                record.status === 'present' ? 'default' : record.status === 'excused' ? 'secondary' : 'destructive'
                                            } className="capitalize">
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {record.arrivedLate ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-muted-foreground/50" />}
                                        </TableCell>
                                        <TableCell>
                                            {record.leftEarly ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-muted-foreground/50" />}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
