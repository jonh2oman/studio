
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useCadets } from "@/hooks/use-cadets";
import { useBiathlon } from "@/hooks/use-biathlon";
import type { BiathlonRaceType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const resultSchema = z.object({
  cadetId: z.string().min(1, "Please select a cadet."),
  competitionName: z.string().min(1, "Competition name is required."),
  date: z.date({ required_error: "A date is required." }),
  raceType: z.enum(['Individual', 'Sprint', 'Pursuit', 'Mass Start', 'Relay', 'Patrol', 'Short Sprint', 'Team Sprint']),
  skiTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in MM:SS format."),
  proneScores: z.string().optional(),
  standingScores: z.string().optional(),
  finalRank: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type ResultFormData = z.infer<typeof resultSchema>;

export function BiathlonResultForm() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { addResult } = useBiathlon();
    
    const teamMembers = cadets.filter(c => c.isBiathlonTeamMember);

    const form = useForm<ResultFormData>({
        resolver: zodResolver(resultSchema),
        defaultValues: {
            cadetId: "",
            competitionName: "",
            date: new Date(),
            raceType: "Sprint",
            skiTime: "00:00",
            proneScores: "",
            standingScores: "",
            notes: "",
        },
    });

    const onSubmit = (data: ResultFormData) => {
        addResult({
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            raceType: data.raceType as BiathlonRaceType,
        });
        form.reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Log Competition Result</CardTitle>
                <CardDescription>Enter a result for a team member.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="cadetId" render={({ field }) => (
                            <FormItem><FormLabel>Cadet</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a team member..." /></SelectTrigger></FormControl><SelectContent>{teamMembers.map(c => (<SelectItem key={c.id} value={c.id}>{c.lastName}, {c.firstName}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="competitionName" render={({ field }) => (
                            <FormItem><FormLabel>Competition Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="date" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="raceType" render={({ field }) => (
                            <FormItem><FormLabel>Race Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Individual', 'Sprint', 'Pursuit', 'Mass Start', 'Relay', 'Patrol', 'Short Sprint', 'Team Sprint'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="skiTime" render={({ field }) => (
                                <FormItem><FormLabel>Ski/Run Time</FormLabel><FormControl><Input {...field} placeholder="MM:SS" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="finalRank" render={({ field }) => (
                                <FormItem><FormLabel>Final Rank</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="proneScores" render={({ field }) => (
                                <FormItem><FormLabel>Prone Scores</FormLabel><FormControl><Input {...field} placeholder="5, 4, 3" /></FormControl></FormItem>
                            )} />
                             <FormField control={form.control} name="standingScores" render={({ field }) => (
                                <FormItem><FormLabel>Standing Scores</FormLabel><FormControl><Input {...field} placeholder="2, 1, 0" /></FormControl></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full">Log Result</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
