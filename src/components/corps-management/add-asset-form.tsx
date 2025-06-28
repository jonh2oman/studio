
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Asset } from "@/lib/types";

const assetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  category: z.string().min(1, "Category is required"),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  status: z.enum(['In Stock', 'Deployed', 'In Repair', 'Decommissioned']),
  condition: z.enum(['New', 'Good', 'Fair', 'Poor']),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

interface AddAssetFormProps {
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
}

export function AddAssetForm({ onAddAsset }: AddAssetFormProps) {
  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      category: "",
      serialNumber: "",
      status: "In Stock",
      condition: "Good",
      location: "",
      notes: ""
    },
  });

  const onSubmit = (data: z.infer<typeof assetSchema>) => {
    onAddAsset(data);
    form.reset();
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Add New Asset</CardTitle>
            <CardDescription>Fill out the form to add an asset to the tracker.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} placeholder="e.g., Electronics, Uniforms" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="serialNumber" render={({ field }) => (
                        <FormItem><FormLabel>Serial Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="In Stock">In Stock</SelectItem><SelectItem value="Deployed">Deployed</SelectItem><SelectItem value="In Repair">In Repair</SelectItem><SelectItem value="Decommissioned">Decommissioned</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="condition" render={({ field }) => (
                           <FormItem><FormLabel>Condition</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Poor">Poor</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="e.g., Supply Room, On Loan" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full">Add Asset</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
