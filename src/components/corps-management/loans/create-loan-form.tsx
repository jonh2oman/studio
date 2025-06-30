
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Asset, Cadet } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

const loanSchema = z.object({
  assetId: z.string().min(1, "Please select an asset to loan."),
  cadetId: z.string().min(1, "Please select a cadet."),
  returnDate: z.date({ required_error: "A return date is required." }),
});

interface CreateLoanFormProps {
  availableAssets: Asset[];
  cadets: Cadet[];
  onCreateLoan: (assetId: string, cadetId: string, returnDate: Date) => void;
  isLoaded: boolean;
}

export function CreateLoanForm({ availableAssets, cadets, onCreateLoan, isLoaded }: CreateLoanFormProps) {
  const form = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      assetId: "",
      cadetId: "",
      returnDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default to 3 months from now
    },
  });

  const onSubmit = (data: z.infer<typeof loanSchema>) => {
    onCreateLoan(data.assetId, data.cadetId, data.returnDate);
    form.reset();
  };
  
  if (!isLoaded) {
    return (
        <Card>
            <CardHeader><CardTitle>Create New Loan</CardTitle></CardHeader>
            <CardContent className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Loan</CardTitle>
        <CardDescription>Select an available asset and a cadet to create a new loan record.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Asset</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an asset..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {availableAssets.length === 0 && <SelectItem value="-" disabled>No assets available</SelectItem>}
                      {availableAssets.map(asset => (
                        <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.assetId})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cadetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cadet</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a cadet..." /></SelectTrigger></FormControl>
                    <SelectContent>
                       {cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(cadet => (
                        <SelectItem key={cadet.id} value={cadet.id}>{cadet.rank} {cadet.lastName}, {cadet.firstName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Return Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild><FormControl>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Loan</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
