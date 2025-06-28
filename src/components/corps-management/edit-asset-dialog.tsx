
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Asset } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";

const assetSchema = z.object({
  id: z.string(),
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

interface EditAssetDialogProps {
  asset: Asset;
  onUpdateAsset: (asset: Asset) => void;
  onOpenChange: (open: boolean) => void;
}

export function EditAssetDialog({ asset, onUpdateAsset, onOpenChange }: EditAssetDialogProps) {
  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: asset,
  });

  const onSubmit = (data: z.infer<typeof assetSchema>) => {
    onUpdateAsset(data);
  };

  return (
     <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Edit Asset</DialogTitle>
                <DialogDescription>Update the details for {asset.name}.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <ScrollArea className="h-[60vh] p-1">
                        <div className="space-y-4 px-4">
                            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="serialNumber" render={({ field }) => ( <FormItem><FormLabel>Serial Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="In Stock">In Stock</SelectItem><SelectItem value="Deployed">Deployed</SelectItem><SelectItem value="In Repair">In Repair</SelectItem><SelectItem value="Decommissioned">Decommissioned</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="condition" render={({ field }) => ( <FormItem><FormLabel>Condition</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Poor">Poor</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                            </div>
                            <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="purchaseDate" render={({ field }) => ( <FormItem><FormLabel>Purchase Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="purchasePrice" render={({ field }) => ( <FormItem><FormLabel>Purchase Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            </div>
                            <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                    </ScrollArea>
                    <DialogFooter className="pt-6 pr-4">
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
     </Dialog>
  );
}
