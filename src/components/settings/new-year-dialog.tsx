
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { FileUp, Loader2 } from "lucide-react";

import { useTrainingYear } from "@/hooks/use-training-year";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useRef } from "react";
import type { TrainingYearData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const newYearSchema = z.object({
  firstTrainingNight: z.coerce.date({ required_error: "First training night is required" }),
  creationMethod: z.enum(["fresh", "copyYear", "copyFile"]),
  sourceYear: z.string().optional(),
  promoteCadets: z.boolean().default(false),
}).refine(data => {
    if (data.creationMethod === 'copyYear') return !!data.sourceYear;
    return true;
}, {
    message: "Please select a source year to copy from.",
    path: ["sourceYear"],
});

type NewYearFormData = z.infer<typeof newYearSchema>;

interface NewYearDialogProps {
  onOpenChange: (open: boolean) => void;
}

export function NewYearDialog({ onOpenChange }: NewYearDialogProps) {
  const { trainingYears, createNewYear, isCreating } = useTrainingYear();
  const { toast } = useToast();
  const [useAi, setUseAi] = useState(false);
  const [fileData, setFileData] = useState<TrainingYearData | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<NewYearFormData>({
    resolver: zodResolver(newYearSchema),
    defaultValues: {
        creationMethod: "fresh",
        promoteCadets: false,
    },
  });
  
  const creationMethod = form.watch("creationMethod");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const data = JSON.parse(text);
            // Basic validation to ensure it looks like TrainingYearData
            if (data && typeof data.firstTrainingNight === 'string' && Array.isArray(data.cadets) && typeof data.schedule === 'object') {
                 setFileData(data);
                 toast({ title: "File Ready", description: `"${file.name}" has been successfully loaded.`});
            } else {
                throw new Error("Invalid file format.");
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Import Error", description: "The selected file is not a valid training year export." });
            setFileData(null);
            setFileName("");
        }
    };
    reader.readAsText(file);
  };

  const onSubmit = async (data: NewYearFormData) => {
    if (data.creationMethod === 'copyFile' && !fileData) {
        toast({ variant: "destructive", title: "File Required", description: "Please select a file to import." });
        return;
    }

    const yearStartDate = data.firstTrainingNight;
    const year = yearStartDate.getMonth() >= 8 ? yearStartDate.getFullYear() : yearStartDate.getFullYear() - 1;
    const newYearString = `${year}-${year + 1}`;

    await createNewYear({
      year: newYearString,
      startDate: format(yearStartDate, "yyyy-MM-dd"),
      copyFrom: data.creationMethod === 'copyYear' ? data.sourceYear : undefined,
      promoteCadets: data.creationMethod !== 'fresh' ? data.promoteCadets : false,
      useAiForCopy: data.creationMethod === 'copyYear' ? useAi : false,
      copyFromFileData: data.creationMethod === 'copyFile' ? fileData : undefined,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Training Year</DialogTitle>
          <DialogDescription>
            Set up a new training year. You can start fresh, copy a previous year, or import from a file.
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
                   <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    The training year (e.g., 2024-2025) will be determined by this date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Controller
                name="creationMethod"
                control={form.control}
                render={({ field }) => (
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 gap-2"
                    >
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                            <FormControl><RadioGroupItem value="fresh" /></FormControl>
                             <FormLabel className="font-normal w-full cursor-pointer">Start a blank training year</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                            <FormControl><RadioGroupItem value="copyYear" /></FormControl>
                             <FormLabel className="font-normal w-full cursor-pointer">Copy from an existing training year</FormLabel>
                        </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                            <FormControl><RadioGroupItem value="copyFile" /></FormControl>
                             <FormLabel className="font-normal w-full cursor-pointer">Create from a shared Training Year file</FormLabel>
                        </FormItem>
                    </RadioGroup>
                )}
            />

            {creationMethod === 'copyYear' && (
                <div className="space-y-4 pl-4 border-l-2 ml-4">
                    <FormField
                      control={form.control}
                      name="sourceYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Training Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a year to copy from" /></SelectTrigger></FormControl>
                            <SelectContent>{trainingYears.map(year => (<SelectItem key={year} value={year}>{year}</SelectItem>))}</SelectContent>
                          </Select><FormMessage />
                        </FormItem>
                      )}
                    />
                     <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                         <FormControl><Checkbox checked={useAi} onCheckedChange={(checked) => setUseAi(!!checked)}/></FormControl>
                         <div className="space-y-1 leading-none"><FormLabel>Use AI to copy schedule?</FormLabel><FormDescription>Let AI intelligently map last year's schedule to the new calendar dates. If unchecked, it will be a direct copy.</FormDescription></div>
                    </div>
                </div>
            )}
            
            {creationMethod === 'copyFile' && (
                <div className="space-y-4 pl-4 border-l-2 ml-4">
                    <FormLabel>Shared Training Year File</FormLabel>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <FileUp className="mr-2 h-4 w-4" /> Upload File
                        </Button>
                        {fileName && <Badge variant="secondary">{fileName}</Badge>}
                        <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                    </div>
                    <FormDescription>Upload a `.json` file that was exported from another user. This will create a new training year on your account with all the data from their file, including their calendar schedule.</FormDescription>
                </div>
            )}

            {creationMethod !== 'fresh' && (
                <FormField
                    control={form.control}
                    name="promoteCadets"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none"><FormLabel>Promote cadets to the next phase?</FormLabel><FormDescription>Automatically increment the phase for all copied cadets.</FormDescription></div>
                    </FormItem>
                    )}
                />
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
