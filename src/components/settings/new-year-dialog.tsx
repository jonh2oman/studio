
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { useTrainingYear } from "@/hooks/use-training-year";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useSettings } from "@/hooks/use-settings";

const newYearSchema = z.object({
  firstTrainingNight: z.date({ required_error: "First training night is required" }),
  shouldCopy: z.boolean().default(false),
  sourceYear: z.string().optional(),
  promoteCadets: z.boolean().default(false),
});

type NewYearFormData = z.infer<typeof newYearSchema>;

interface NewYearDialogProps {
  onOpenChange: (open: boolean) => void;
}

export function NewYearDialog({ onOpenChange }: NewYearDialogProps) {
  const { trainingYears, createNewYear, isCreating } = useTrainingYear();
  const { settings } = useSettings();
  const [useAi, setUseAi] = useState(false);

  const form = useForm<NewYearFormData>({
    resolver: zodResolver(newYearSchema),
    defaultValues: {
      shouldCopy: false,
      promoteCadets: false,
    },
  });
  
  const watchShouldCopy = form.watch("shouldCopy");

  const onSubmit = async (data: NewYearFormData) => {
    const yearStartDate = data.firstTrainingNight;
    const year = yearStartDate.getMonth() >= 8 ? yearStartDate.getFullYear() : yearStartDate.getFullYear() - 1;
    const newYearString = `${year}-${year + 1}`;

    await createNewYear({
      year: newYearString,
      startDate: format(yearStartDate, "yyyy-MM-dd"),
      copyFrom: data.shouldCopy ? data.sourceYear : undefined,
      promoteCadets: data.shouldCopy ? data.promoteCadets : false,
      useAiForCopy: useAi,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Training Year</DialogTitle>
          <DialogDescription>
            Set up a new training year. You can optionally copy data from a previous year.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="firstTrainingNight"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>First Training Night of New Year</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
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
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date.getDay() !== settings.trainingDay}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The training year (e.g., 2024-2025) will be determined by this date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shouldCopy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Copy data from a previous year?
                    </FormLabel>
                    <FormDescription>
                      This will copy the schedule, cadets, and other settings.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchShouldCopy && (
                <div className="space-y-4 pl-4 border-l-2 ml-4">
                    <FormField
                      control={form.control}
                      name="sourceYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Training Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a year to copy from" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {trainingYears.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                     <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                         <FormControl>
                            <Checkbox
                                checked={useAi}
                                onCheckedChange={(checked) => setUseAi(!!checked)}
                            />
                        </FormControl>
                         <div className="space-y-1 leading-none">
                            <FormLabel>
                            Use AI to copy schedule?
                            </FormLabel>
                            <FormDescription>
                           Let AI intelligently map last year's schedule to the new calendar dates. If unchecked, it will be a direct copy.
                            </FormDescription>
                        </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="promoteCadets"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                             <div className="space-y-1 leading-none">
                                <FormLabel>
                                Promote cadets to the next phase?
                                </FormLabel>
                                <FormDescription>
                                Automatically increment the phase for all copied cadets.
                                </FormDescription>
                            </div>
                        </FormItem>
                      )}
                    />
                </div>
            )}

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isCreating}>Cancel</Button>
                <Button type="submit" disabled={isCreating}>
                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating...</> : "Create Year"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
