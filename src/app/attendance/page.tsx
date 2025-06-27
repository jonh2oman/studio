
"use client";

import { useState, useEffect, useCallback } from "react";
import { useCadets } from "@/hooks/use-cadets";
import { useSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const { cadets, isLoaded: cadetsLoaded, getAttendanceForDate, saveAttendanceForDate } = useCadets();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { toast } = useToast();

  useEffect(() => {
    if (cadetsLoaded && selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      setAttendanceRecords(getAttendanceForDate(dateString));
    }
  }, [cadetsLoaded, selectedDate, getAttendanceForDate, cadets]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
        setSelectedDate(date);
    }
  };

  const handleRecordChange = (cadetId: string, updatedRecord: Partial<AttendanceRecord>) => {
    setAttendanceRecords(currentRecords => 
        currentRecords.map(record => 
            record.cadetId === cadetId ? { ...record, ...updatedRecord } : record
        )
    );
  };
  
  const handleSaveAttendance = useCallback(() => {
    if (selectedDate) {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        saveAttendanceForDate(dateString, attendanceRecords);
        toast({
            title: "Attendance Saved",
            description: `Attendance for ${format(selectedDate, 'PPP')} has been automatically saved.`,
        });
    }
  }, [selectedDate, attendanceRecords, saveAttendanceForDate, toast]);

  useEffect(() => {
    if (!selectedDate) return;
    const handler = setTimeout(() => {
        handleSaveAttendance();
    }, 1000); // Debounce save
    return () => clearTimeout(handler);
  }, [attendanceRecords, handleSaveAttendance, selectedDate]);


  const trainingDaysFilter = (date: Date) => {
    return date.getDay() === settings.trainingDay;
  };
  
  const isLoading = !cadetsLoaded || !settingsLoaded;

  return (
    <>
      <PageHeader
        title="Attendance Taker"
        description="Mark attendance for a specific training night. Changes are saved automatically."
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Select a Training Night</CardTitle>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal mt-4 sm:mt-0",
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
                        onSelect={handleDateSelect}
                        modifiers={{ trainingDays: trainingDaysFilter }}
                        modifiersClassNames={{ trainingDays: "bg-primary/20" }}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : cadets.length === 0 ? (
                <p className="text-muted-foreground text-center py-16">No cadets in the roster. Please add cadets on the Cadet Management page.</p>
            ) : (
                <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cadet</TableHead>
                            <TableHead className="w-[250px]">Status</TableHead>
                            <TableHead className="w-[250px]">Modifiers</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceRecords.map(record => {
                             const cadet = cadets.find(c => c.id === record.cadetId);
                             if (!cadet) return null;
                             return (
                                <TableRow key={record.cadetId}>
                                    <TableCell>
                                        <p className="font-medium">{cadet.lastName}, {cadet.firstName}</p>
                                        <p className="text-sm text-muted-foreground">{cadet.rank}</p>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup 
                                            value={record.status} 
                                            onValueChange={(value) => handleRecordChange(record.cadetId, { status: value as AttendanceStatus })}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="present" id={`present-${cadet.id}`} />
                                                <Label htmlFor={`present-${cadet.id}`}>Present</Label>
                                            </div>
                                             <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="absent" id={`absent-${cadet.id}`} />
                                                <Label htmlFor={`absent-${cadet.id}`}>Absent</Label>
                                            </div>
                                             <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="excused" id={`excused-${cadet.id}`} />
                                                <Label htmlFor={`excused-${cadet.id}`}>Excused</Label>
                                            </div>
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-6">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`late-${cadet.id}`}
                                                    checked={record.arrivedLate}
                                                    onCheckedChange={(checked) => handleRecordChange(record.cadetId, { arrivedLate: !!checked })}
                                                />
                                                <Label htmlFor={`late-${cadet.id}`}>Arrived Late</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                 <Checkbox
                                                    id={`early-${cadet.id}`}
                                                    checked={record.leftEarly}
                                                    onCheckedChange={(checked) => handleRecordChange(record.cadetId, { leftEarly: !!checked })}
                                                />
                                                <Label htmlFor={`early-${cadet.id}`}>Left Early</Label>
                                            </div>
                                        </div>
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
      </div>
    </>
  );
}
