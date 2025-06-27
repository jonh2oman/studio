
"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format, addDays, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval, getDay, parseISO, getWeek, getYear } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WroPreview } from "./wro-preview";
import type { Schedule, UpcomingActivity } from "@/lib/types";
import { useSettings } from "@/hooks/use-settings";
import { useSchedule } from "@/hooks/use-schedule";
import { useTrainingYear } from "@/hooks/use-training-year";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "@/hooks/use-toast";
import { useSave } from "@/hooks/use-save-context";

const wroSchema = z.object({
  roNumber: z.string().optional(),
  dutyOfficerName: z.string().min(1, "Duty Officer name is required"),
  dutyOfficerPhone: z.string().min(1, "Duty Officer phone is required"),
  dutyOfficerEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  dutyPOName: z.string().min(1, "Duty PO name is required"),
  dutyPOPhone: z.string().min(1, "Duty PO phone is required"),
  alternateDutyPO: z.string().optional(),
  dutyWatch: z.string().optional(),
  coName: z.string().min(1, "CO name is required"),
  announcements: z.string().optional(),
  notes: z.string().optional(),
  dressCaf: z.string().optional(),
  dressCadets: z.string().optional(),
  trainingDate: z.date({ required_error: "A training date is required." }),
  upcomingActivities: z.array(
    z.object({
      id: z.string(),
      activity: z.string().min(1, "Required"),
      activityStart: z.string().min(1, "Required"),
      activityEnd: z.string().min(1, "Required"),
      location: z.string().min(1, "Required"),
      dress: z.string().min(1, "Required"),
      opi: z.string().min(1, "Required"),
    })
  ).optional(),
});

type WroFormData = z.infer<typeof wroSchema>;

export function WroForm() {
  const { control, register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<WroFormData>({
    resolver: zodResolver(wroSchema),
    defaultValues: {
      upcomingActivities: [],
      dressCaf: 'DEU 3B',
      dressCadets: 'C-2',
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "upcomingActivities",
  });
  
  const [logo, setLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { schedule, dayMetadata, isLoaded: scheduleLoaded } = useSchedule();
  const { currentYear, dutySchedule, isLoaded: yearLoaded } = useTrainingYear();
  const { toast } = useToast();
  const { registerSave } = useSave();
  const formData = watch();
  const trainingDate = watch("trainingDate");

  // Load Draft useEffect
  useEffect(() => {
    if (currentYear) {
      const wroDraftKey = `${currentYear}_wroDraft`;
      const savedDraft = localStorage.getItem(wroDraftKey);
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          // Dates need to be converted back to Date objects
          if (parsedDraft.trainingDate) {
            parsedDraft.trainingDate = new Date(parsedDraft.trainingDate);
          }
          reset(parsedDraft);
          toast({ title: "Draft Loaded", description: "Your previously saved WRO draft has been loaded." });
        } catch (e) {
          console.error("Failed to parse WRO draft", e);
        }
      }
    }
  }, [currentYear, reset, toast]);


  const handleSaveDraft = useCallback(() => {
    if (!currentYear) return;
    const currentFormData = watch();
    const wroDraftKey = `${currentYear}_wroDraft`;
    localStorage.setItem(wroDraftKey, JSON.stringify(currentFormData));
    toast({ title: "Draft Saved", description: "Your WRO draft has been saved locally." });
  }, [currentYear, watch, toast]);

  useEffect(() => {
    registerSave(handleSaveDraft);
    return () => registerSave(null);
  }, [registerSave, handleSaveDraft]);

  useEffect(() => {
    if (trainingDate) {
        const year = getYear(trainingDate);
        const week = getWeek(trainingDate);
        setValue("roNumber", `RO-${year}-${String(week).padStart(2, '0')}`);
    }
  }, [trainingDate, setValue]);

  useEffect(() => {
    if (trainingDate && dutySchedule && settings.staff) {
        const dateStr = format(trainingDate, 'yyyy-MM-dd');
        const duties = dutySchedule[dateStr];

        if (duties) {
            const officer = settings.staff.find(s => s.id === duties.dutyOfficerId);
            const po = settings.staff.find(s => s.id === duties.dutyPoId);
            const altPo = settings.staff.find(s => s.id === duties.altDutyPoId);

            setValue('dutyOfficerName', officer ? `${officer.rank} ${officer.lastName}` : '');
            setValue('dutyOfficerPhone', officer?.phone || '');
            setValue('dutyOfficerEmail', officer?.email || '');
            setValue('dutyPOName', po ? `${po.rank} ${po.lastName}` : '');
            setValue('alternateDutyPO', altPo ? `${altPo.rank} ${altPo.lastName}` : '');
        } else {
            setValue('dutyOfficerName', '');
            setValue('dutyOfficerPhone', '');
            setValue('dutyOfficerEmail', '');
            setValue('dutyPOName', '');
            setValue('alternateDutyPO', '');
        }
    }
  }, [trainingDate, dutySchedule, settings.staff, setValue]);

  useEffect(() => {
    if (trainingDate && dayMetadata) {
        const dateStr = format(trainingDate, 'yyyy-MM-dd');
        const metadata = dayMetadata[dateStr];
        if (metadata?.dressOfTheDay?.caf) {
            setValue('dressCaf', metadata.dressOfTheDay.caf);
        } else {
            setValue('dressCaf', 'DEU 3B'); // Reset to default if not set
        }
        if (metadata?.dressOfTheDay?.cadets) {
            setValue('dressCadets', metadata.dressOfTheDay.cadets);
        } else {
            setValue('dressCadets', 'C-2'); // Reset to default if not set
        }
    }
  }, [trainingDate, dayMetadata, setValue]);


  useEffect(() => {
    if (!trainingDate || !settings.weeklyActivities) {
        replace([]);
        return;
    }

    const wroWeekStart = startOfDay(trainingDate);
    const wroWeekEnd = endOfDay(addDays(wroWeekStart, 6));

    const activitiesForWro: (UpcomingActivity & { sortDate: Date })[] = [];

    settings.weeklyActivities.forEach(activity => {
        const activityStartDate = parseISO(activity.startDate);
        const activityEndDate = parseISO(activity.endDate);

        const daysInWroWeek = eachDayOfInterval({ start: wroWeekStart, end: wroWeekEnd });

        daysInWroWeek.forEach(dayInWeek => {
            if (getDay(dayInWeek) === activity.dayOfWeek && isWithinInterval(dayInWeek, { start: activityStartDate, end: activityEndDate })) {
                const activityTime = activity.startTime.split(':');
                const sortDate = new Date(dayInWeek);
                if (activityTime.length === 2) {
                   sortDate.setHours(parseInt(activityTime[0]), parseInt(activityTime[1]));
                }
                
                activitiesForWro.push({
                    sortDate: sortDate,
                    id: `${activity.id}-${format(dayInWeek, 'yyyy-MM-dd')}`,
                    activity: activity.activity,
                    activityStart: `${format(dayInWeek, 'E, MMM dd')} ${activity.startTime}`,
                    activityEnd: activity.endTime,
                    location: activity.location,
                    dress: activity.dress,
                    opi: activity.opi,
                });
            }
        });
    });
    
    activitiesForWro.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
    const finalActivities = activitiesForWro.map(({ sortDate, ...rest }) => rest);
    
    replace(finalActivities);

  }, [trainingDate, settings.weeklyActivities, replace]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const scheduleForDate = useMemo(() => {
    if (!formData.trainingDate || !scheduleLoaded) return {};
    const dateStr = format(formData.trainingDate, 'yyyy-MM-dd');
    const filteredSchedule: Schedule = {};
    for (const slotId in schedule) {
        if (slotId.startsWith(dateStr)) {
            filteredSchedule[slotId] = schedule[slotId];
        }
    }
    return filteredSchedule;
  }, [formData.trainingDate, schedule, scheduleLoaded]);

  const onSubmit = async (data: WroFormData) => {
    setIsGenerating(true);
    // Allow time for the preview component to re-render with the new data
    setTimeout(async () => {
      if (previewRef.current) {
        try {
          const canvas = await html2canvas(previewRef.current, { scale: 2 });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "p",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
          pdf.save(`WRO-${data.roNumber}-${format(data.trainingDate, "yyyy-MM-dd")}.pdf`);
          if (currentYear) {
            localStorage.removeItem(`${currentYear}_wroDraft`);
          }
        } catch (error) {
          console.error("Failed to generate PDF", error);
        } finally {
          setIsGenerating(false);
        }
      }
    }, 500);
  };
  
  if (!settingsLoaded || !scheduleLoaded || !yearLoaded) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  const trainingDaysFilter = (date: Date) => {
    return date.getDay() === settings.trainingDay;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>WRO Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="trainingDate">Training Date</Label>
                            <Controller
                                name="trainingDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            modifiers={{ trainingDays: trainingDaysFilter }}
                                            modifiersClassNames={{ trainingDays: "bg-primary/20 rounded-full" }}
                                            disabled={(date) => date.getDay() !== settings.trainingDay}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.trainingDate && <p className="text-destructive text-sm mt-1">{errors.trainingDate.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="roNumber">RO #</Label>
                            <Input id="roNumber" {...register("roNumber")} readOnly />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="logo">Corps Logo</Label>
                        <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                     <div>
                        <Label htmlFor="coName">Commanding Officer Name</Label>
                        <Input id="coName" {...register("coName")} />
                        {errors.coName && <p className="text-destructive text-sm mt-1">{errors.coName.message}</p>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Duty Personnel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dutyOfficerName">Duty Officer Name</Label>
                            <Input id="dutyOfficerName" {...register("dutyOfficerName")} />
                             {errors.dutyOfficerName && <p className="text-destructive text-sm mt-1">{errors.dutyOfficerName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="dutyOfficerPhone">Duty Officer Phone</Label>
                            <Input id="dutyOfficerPhone" {...register("dutyOfficerPhone")} />
                             {errors.dutyOfficerPhone && <p className="text-destructive text-sm mt-1">{errors.dutyOfficerPhone.message}</p>}
                        </div>
                        <div className="sm:col-span-2">
                             <Label htmlFor="dutyOfficerEmail">Duty Officer Email</Label>
                            <Input id="dutyOfficerEmail" {...register("dutyOfficerEmail")} />
                             {errors.dutyOfficerEmail && <p className="text-destructive text-sm mt-1">{errors.dutyOfficerEmail.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="dutyPOName">Duty PO Name</Label>
                            <Input id="dutyPOName" {...register("dutyPOName")} />
                            {errors.dutyPOName && <p className="text-destructive text-sm mt-1">{errors.dutyPOName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="dutyPOPhone">Duty PO Phone</Label>
                            <Input id="dutyPOPhone" {...register("dutyPOPhone")} />
                             {errors.dutyPOPhone && <p className="text-destructive text-sm mt-1">{errors.dutyPOPhone.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="alternateDutyPO">Alternate Duty PO</Label>
                            <Input id="alternateDutyPO" {...register("alternateDutyPO")} />
                        </div>
                         <div>
                            <Label htmlFor="dutyWatch">Duty Watch</Label>
                            <Input id="dutyWatch" {...register("dutyWatch")} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="dressCaf">Dress (CAF Members)</Label>
                        <Input id="dressCaf" {...register("dressCaf")} />
                    </div>
                    <div>
                        <Label htmlFor="dressCadets">Dress (Cadets)</Label>
                        <Input id="dressCadets" {...register("dressCadets")} />
                    </div>
                </div>
                 <div>
                    <Label htmlFor="announcements">Announcements</Label>
                    <Textarea id="announcements" {...register("announcements")} />
                </div>
                 <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" {...register("notes")} />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Upcoming Activities</CardTitle>
                        <CardDescription>Activities for the upcoming week. This list is auto-populated from Settings.</CardDescription>
                    </div>
                    <Button type="button" size="sm" onClick={() => append({ id: crypto.randomUUID(), activity: '', activityStart: '', activityEnd: '', location: '', dress: '', opi: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Activity
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Dress</TableHead>
                                <TableHead>OPI</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.length === 0 && <TableRow><TableCell colSpan={7} className="text-center h-24">No upcoming activities scheduled for this week.</TableCell></TableRow>}
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell><Input {...register(`upcomingActivities.${index}.activity`)} /></TableCell>
                                    <TableCell><Input {...register(`upcomingActivities.${index}.activityStart`)} /></TableCell>
                                    <TableCell><Input {...register(`upcomingActivities.${index}.activityEnd`)} /></TableCell>
                                    <TableCell><Input {...register(`upcomingActivities.${index}.location`)} /></TableCell>
                                    <TableCell><Input {...register(`upcomingActivities.${index}.dress`)} /></TableCell>
                                    <TableCell><Input {...register(`upcomingActivities.${index}.opi`)} /></TableCell>
                                    <TableCell>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate WRO PDF"}
        </Button>
      </form>

      <div className="absolute -left-full top-0">
         <WroPreview 
            ref={previewRef}
            data={formData}
            logo={logo}
            schedule={scheduleForDate}
            corpsName={settings.corpsName}
         />
      </div>
    </>
  );
}
