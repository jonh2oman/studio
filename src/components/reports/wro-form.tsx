"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WroPreview } from "./wro-preview";
import type { Schedule } from "@/lib/types";
import { useSettings } from "@/hooks/use-settings";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const wroSchema = z.object({
  roNumber: z.string().min(1, "RO # is required"),
  dutyOfficerName: z.string().min(1, "Duty Officer name is required"),
  dutyOfficerPhone: z.string().min(1, "Duty Officer phone is required"),
  dutyPOName: z.string().min(1, "Duty PO name is required"),
  dutyPOPhone: z.string().min(1, "Duty PO phone is required"),
  coName: z.string().min(1, "CO name is required"),
  announcements: z.string().optional(),
  dressCaf: z.string().optional(),
  dressCadets: z.string().optional(),
  trainingDate: z.date({ required_error: "A training date is required." }),
});

type WroFormData = z.infer<typeof wroSchema>;

export function WroForm() {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<WroFormData>({
    resolver: zodResolver(wroSchema),
  });
  
  const [logo, setLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleForDate, setScheduleForDate] = useState<Schedule>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const { settings, isLoaded } = useSettings();
  const trainingDate = watch("trainingDate");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = async (data: WroFormData) => {
    setIsGenerating(true);
    // This is where you would fetch the schedule for the selected date.
    // For now, we'll use a placeholder.
    const fakeSchedule: Schedule = {}; // In a real app, you'd get this from your state management/API
    setScheduleForDate(fakeSchedule);

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
        } catch (error) {
          console.error("Failed to generate PDF", error);
        } finally {
          setIsGenerating(false);
        }
      }
    }, 500);
  };
  
  if (!isLoaded) return null;

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
                            <Input id="roNumber" {...register("roNumber")} />
                            {errors.roNumber && <p className="text-destructive text-sm mt-1">{errors.roNumber.message}</p>}
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
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="announcements">Announcements</Label>
                    <Textarea id="announcements" {...register("announcements")} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="dressCaf">Dress (CAF Members)</Label>
                        <Input id="dressCaf" {...register("dressCaf")} defaultValue="DEU 3B" />
                    </div>
                    <div>
                        <Label htmlFor="dressCadets">Dress (Cadets)</Label>
                        <Input id="dressCadets" {...register("dressCadets")} defaultValue="C-2" />
                    </div>
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
            data={watch()}
            logo={logo}
            schedule={scheduleForDate}
            corpsName={settings.corpsName}
         />
      </div>
    </>
  );
}
