
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2, Rocket, Building, CalendarDays, PartyPopper } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useTrainingYear } from "@/hooks/use-training-year";
import { cn } from "@/lib/utils";

// Schemas for each step
const step2Schema = z.object({
  corpsName: z.string().min(1, "Corps name is required"),
  trainingDay: z.coerce.number().min(0).max(6),
});

const step3Schema = z.object({
  firstTrainingNight: z.date({ required_error: "A start date is required." }),
});

interface GuidedSetupDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onFinish: () => void;
}

export function GuidedSetupDialog({ isOpen, onOpenChange, onFinish }: GuidedSetupDialogProps) {
    const [step, setStep] = useState(1);
    const { settings, saveSettings } = useSettings();
    const { createNewYear, isCreating } = useTrainingYear();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const step2Form = useForm<z.infer<typeof step2Schema>>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            corpsName: settings.corpsName,
            trainingDay: settings.trainingDay
        }
    });

    const step3Form = useForm<z.infer<typeof step3Schema>>({
        resolver: zodResolver(step3Schema),
    });

    const handleStep2Submit = (data: z.infer<typeof step2Schema>) => {
        saveSettings(data);
        setStep(3);
    };
    
    const handleStep3Submit = async (data: z.infer<typeof step3Schema>) => {
        const yearStartDate = data.firstTrainingNight;
        const year = yearStartDate.getMonth() >= 8 ? yearStartDate.getFullYear() : yearStartDate.getFullYear() - 1;
        const newYearString = `${year}-${year + 1}`;
        
        // A simplified createNewYear for the first-time setup
        await createNewYear({
            year: newYearString,
            startDate: format(yearStartDate, "yyyy-MM-dd"),
        });

        setStep(4);
    };

    const handleFinish = () => {
        onFinish();
        // Reset step for next time it's opened
        setTimeout(() => setStep(1), 500); 
    }
    
    const trainingDayForPicker = step2Form.watch('trainingDay');
    
    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl">Welcome to the Training Planner!</DialogTitle>
                            <DialogDescription className="text-center">Let's get your corps set up in just a few quick steps.</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center items-center flex-col gap-4 py-8">
                           <Rocket className="w-16 h-16 text-primary" />
                           <p className="text-muted-foreground">This guide will help you configure the essentials.</p>
                        </div>
                        <DialogFooter>
                            <Button className="w-full" onClick={() => setStep(2)}>Get Started</Button>
                        </DialogFooter>
                    </>
                );
            case 2:
                return (
                     <Form {...step2Form}>
                        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)}>
                            <DialogHeader>
                                <DialogTitle>Corps Details</DialogTitle>
                                <DialogDescription>Tell us about your corps or squadron.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-6">
                                <div className="flex justify-center items-center text-primary/80"><Building className="h-10 w-10"/></div>
                                <FormField control={step2Form.control} name="corpsName" render={({ field }) => (
                                    <FormItem><FormLabel>Corps Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={step2Form.control} name="trainingDay" render={({ field }) => (
                                    <FormItem><FormLabel>Weekly Training Night</FormLabel>
                                        <Select onValueChange={field.onChange} value={String(field.value)}>
                                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                            <SelectContent>{weekDays.map((day, index) => <SelectItem key={index} value={String(index)}>{day}</SelectItem>)}</SelectContent>
                                        </Select>
                                    <FormMessage /></FormItem>
                                )}/>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button type="submit">Next</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                );
            case 3:
                return (
                     <Form {...step3Form}>
                        <form onSubmit={step3Form.handleSubmit(handleStep3Submit)}>
                            <DialogHeader>
                                <DialogTitle>Set Your Training Year</DialogTitle>
                                <DialogDescription>When does your first training night of the year begin?</DialogDescription>
                            </DialogHeader>
                             <div className="py-6 space-y-6">
                                <div className="flex justify-center items-center text-primary/80"><CalendarDays className="h-10 w-10"/></div>
                                <FormField control={step3Form.control} name="firstTrainingNight" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>First Training Night</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date.getDay() !== trainingDayForPicker} initialFocus /></PopoverContent>
                                        </Popover>
                                        <FormDescription>Select your designated training night.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setStep(2)} disabled={isCreating}>Back</Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Next
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                );
            case 4:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl">Setup Complete!</DialogTitle>
                        </DialogHeader>
                         <div className="flex justify-center items-center flex-col gap-4 py-8">
                           <PartyPopper className="w-16 h-16 text-primary" />
                           <p className="text-muted-foreground text-center max-w-sm">You're all set. You can now start planning your training year. You can manage staff, classrooms, ranks, and more in the Settings page at any time.</p>
                        </div>
                        <DialogFooter>
                            <Button className="w-full" onClick={handleFinish}>Start Planning</Button>
                        </DialogFooter>
                    </>
                );
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                {renderStepContent()}
            </DialogContent>
        </Dialog>
    )
}
