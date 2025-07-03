
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCadets } from "@/hooks/use-cadets";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Save, Trash2, FileDown } from "lucide-react";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { PrintableAttendanceSheet } from "@/components/attendance/printable-attendance-sheet";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTrainingYear } from "@/hooks/use-training-year";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [initialRecords, setInitialRecords] = useState<string>("[]");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
  
  const pdfRef = useRef<HTMLDivElement>(null);
  const { cadets, isLoaded: cadetsLoaded, getAttendanceForDate, saveAttendanceForDate, deleteAttendanceForDate, attendance } = useCadets();
  const { currentYearData, isLoaded: yearLoaded } = useTrainingYear();
  const { toast } = useToast();

  useEffect(() => {
    if (cadetsLoaded && selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const records = getAttendanceForDate(dateString);
      setAttendanceRecords(records);
      setInitialRecords(JSON.stringify(records));
    }
  }, [cadetsLoaded, selectedDate, getAttendanceForDate, cadets, attendance]);

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
  
  const handleSaveAttendance = useCallback(async () => {
    if (selectedDate) {
        setIsSaving(true);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        await saveAttendanceForDate(dateString, attendanceRecords);
        setInitialRecords(JSON.stringify(attendanceRecords));
        setIsSaving(false);
        toast({
            title: "Attendance Saved",
            description: `Attendance for ${format(selectedDate, 'PPP')} has been saved.`,
        });
    }
  }, [selectedDate, attendanceRecords, saveAttendanceForDate, toast]);

  const handleDeleteAttendance = useCallback(async () => {
    if (selectedDate) {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        await deleteAttendanceForDate(dateString);
        toast({
            variant: "destructive",
            title: "Attendance Deleted",
            description: `Records for ${format(selectedDate, 'PPP')} have been deleted.`,
        });
    }
    setIsDeleteAlertOpen(false);
  }, [selectedDate, deleteAttendanceForDate, toast]);

  const handleGenerateSheet = async () => {
    const input = pdfRef.current;
    if (!input || !selectedDate) return;

    setIsGeneratingSheet(true);
    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AttendanceSheet-${format(selectedDate, 'yyyy-MM-dd')}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ variant: 'destructive', title: "PDF Generation Failed", description: "There was an error creating the attendance sheet."});
    } finally {
        setIsGeneratingSheet(false);
    }
  };
  
  const hasUnsavedChanges = JSON.stringify(attendanceRecords) !== initialRecords;

  const recordsExistForDate = selectedDate && !!attendance[format(selectedDate, "yyyy-MM-dd")];

  const trainingDaysFilter = (date: Date) => {
    return date.getDay() === currentYearData?.trainingDay;
  };
  
  const isLoading = !cadetsLoaded || !yearLoaded;

  return (
    <>
      <PageHeader
        title="Attendance Taker"
        description="Mark attendance for a specific training night. Remember to save your changes."
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Select a Training Night</CardTitle>
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
                          onSelect={handleDateSelect}
                          modifiers={{ trainingDays: trainingDaysFilter }}
                          modifiersClassNames={{ trainingDays: "bg-primary/20" }}
                          initialFocus
                          />
                      </PopoverContent>
                  </Popover>
                  <Button onClick={handleGenerateSheet} variant="outline" disabled={isGeneratingSheet || !selectedDate || cadets.length === 0}>
                    {isGeneratingSheet ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                    Generate Sheet
                  </Button>
                </div>
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
          <CardFooter>
            <div className="flex justify-between w-full items-center">
                <Button onClick={handleSaveAttendance} disabled={!hasUnsavedChanges || isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save Attendance"}
                </Button>

                {recordsExistForDate && (
                    <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Records
                    </Button>
                )}
            </div>
          </CardFooter>
        </Card>
      </div>

       <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the attendance records for {selectedDate ? format(selectedDate, 'PPP') : 'this date'}. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteAttendance}
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <div className="absolute -top-[9999px] -left-[9999px]">
        {selectedDate && <PrintableAttendanceSheet ref={pdfRef} cadets={cadets} date={selectedDate} />}
    </div>
    </>
  );
}
