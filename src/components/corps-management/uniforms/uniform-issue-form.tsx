"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UniformItem, Cadet } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const issueSchema = z.object({
  cadetId: z.string().min(1, "Please select a cadet."),
  uniformItemId: z.string().min(1, "Please select an item to issue."),
});

interface UniformIssueFormProps {
  cadets: Cadet[];
  inventory: UniformItem[];
  onIssue: (cadetId: string, uniformItemId: string) => void;
  isLoaded: boolean;
}

export function UniformIssueForm({ cadets, inventory, onIssue, isLoaded }: UniformIssueFormProps) {
  const form = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: { cadetId: "", uniformItemId: "" },
  });

  const availableItems = useMemo(() => {
    return inventory.filter(i => i.quantity > 0).sort((a,b) => a.name.localeCompare(b.name));
  }, [inventory]);

  const onSubmit = (data: z.infer<typeof issueSchema>) => {
    onIssue(data.cadetId, data.uniformItemId);
    form.reset();
  };
  
  if (!isLoaded) {
    return (
        <Card><CardHeader><CardTitle>Issue Uniform Part</CardTitle></CardHeader>
            <CardContent className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Uniform Part</CardTitle>
        <CardDescription>Select an item from inventory to issue to a cadet.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="cadetId" render={({ field }) => (
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
            )} />
            <FormField control={form.control} name="uniformItemId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Item</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an item..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {availableItems.length === 0 && <SelectItem value="-" disabled>No items in stock</SelectItem>}
                      {availableItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name} (Size: {item.size})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )} />
            <Button type="submit" className="w-full">Issue Item</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
