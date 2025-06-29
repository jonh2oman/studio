
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCadets } from "@/hooks/use-cadets";
import { useMarksmanship, getClassificationForGrouping } from "@/hooks/use-marksmanship";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Medal, Target } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import type { MarksmanshipRecord } from "@/lib/types";

const scoreSchema = z.object({
  cadetId: z.string().min(1, "Please select a cadet."),
  date: z.date({ required_error: "A date is required." }),
  targetType: z.enum(["grouping", "competition"], { required_error: "Please select a target type." }),
  grouping1_cm: z.coerce.number().optional(),
  grouping2_cm: z.coerce.number().optional(),
  competitionScores: z.array(z.coerce.number().min(0).max(10)).optional(),
  notes: z.string().optional(),
}).refine(data => {
    if (data.targetType === 'grouping') {
        return data.grouping1_cm !== undefined && data.grouping1_cm > 0 && data.grouping2_cm !== undefined && data.grouping2_cm > 0;
    }
    return true;
}, { message: "Both grouping scores are required.", path: ["grouping1_cm"] })
.refine(data => {
    if (data.targetType === 'competition') {
        return data.competitionScores?.length === 10;
    }
    return true;
}, { message: "All 10 competition scores are required.", path: ["competitionScores"] });

type ScoreFormData = z.infer<typeof scoreSchema>;

export function ScoreEntryForm() {
  const { cadets, isLoaded: cadetsLoaded } = useCadets();
  const { addRecord, isLoaded: marksmanshipLoaded } = useMarksmanship();

  const form = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      cadetId: "",
      date: new Date(),
      targetType: "grouping",
      competitionScores: Array(10).fill(0),
      notes: "",
    },
  });

  const onSubmit = (data: ScoreFormData) => {
    const recordData: Omit<MarksmanshipRecord, 'id'> = {
        cadetId: data.cadetId,
        date: format(data.date, 'yyyy-MM-dd'),
        targetType: data.targetType,
        notes: data.notes || "",
    };

    if (data.targetType === 'grouping') {
        recordData.grouping1_cm = data.grouping1_cm;
        recordData.grouping2_cm = data.grouping2_cm;
    } else { // competition
        recordData.competitionScores = data.competitionScores?.map(Number);
    }
    
    addRecord(recordData);

    form.reset({
        ...form.getValues(),
        grouping1_cm: undefined,
        grouping2_cm: undefined,
        competitionScores: Array(10).fill(0),
        notes: "",
    });
  };
  
  const watchTargetType = form.watch("targetType");
  const watchGrouping1 = form.watch("grouping1_cm");
  const watchGrouping2 = form.watch("grouping2_cm");
  const watchCompetitionScores = form.watch("competitionScores");

  const achievedClassification = getClassificationForGrouping(watchGrouping1, watchGrouping2);
  const totalCompetitionScore = watchCompetitionScores?.map(Number).reduce((a, b) => a + b, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter New Score</CardTitle>
        <CardDescription>Select a cadet and enter their latest score.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cadetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cadet</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a cadet..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {cadetsLoaded && cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(cadet => (
                        <SelectItem key={cadet.id} value={cadet.id}>{cadet.rank} {cadet.lastName}, {cadet.firstName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Shoot</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild><FormControl>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                    </Popover><FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="targetType" render={({ field }) => (
                <FormItem><FormLabel>Target Type</FormLabel>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-4">
                        <FormItem><FormControl><RadioGroupItem value="grouping" className="peer sr-only" /></FormControl>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Medal className="mb-3 h-6 w-6" />Grouping
                        </FormLabel></FormItem>
                        <FormItem><FormControl><RadioGroupItem value="competition" className="peer sr-only" /></FormControl>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Target className="mb-3 h-6 w-6" />Competition
                        </FormLabel></FormItem>
                    </RadioGroup><FormMessage />
                </FormItem>
            )} />

            {watchTargetType === 'grouping' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="grouping1_cm" render={({ field }) => (<FormItem><FormLabel>Grouping 1 (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="grouping2_cm" render={({ field }) => (<FormItem><FormLabel>Grouping 2 (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    {achievedClassification !== 'Unclassified' && <Badge className="w-fit">Achieved: {achievedClassification}</Badge>}
                </div>
            )}
            
            {watchTargetType === 'competition' && (
                <div className="space-y-4">
                     <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 10 }).map((_, index) => (
                           <FormField key={index} control={form.control} name={`competitionScores.${index}`} render={({ field }) => (
                               <FormItem><FormLabel className="text-xs">T-{index + 1}</FormLabel><FormControl><Input type="number" min="0" max="10" {...field} className="h-9 px-2 text-center" /></FormControl></FormItem>
                           )} />
                        ))}
                    </div>
                     <Badge className="w-fit">Total Score: {totalCompetitionScore} / 100</Badge>
                </div>
            )}

             <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <Button type="submit" className="w-full">Add Score Record</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
