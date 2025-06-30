"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UniformItem } from "@/lib/types";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  notes: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface UniformItemDialogProps {
  item?: UniformItem | null;
  onSave: (data: Omit<UniformItem, "id"> | UniformItem) => void;
  onOpenChange: (open: boolean) => void;
}

export function UniformItemDialog({ item, onSave, onOpenChange }: UniformItemDialogProps) {
  const { settings } = useSettings();

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: item || {
      name: "",
      category: "",
      size: "",
      quantity: 0,
      notes: ""
    },
  });

  const onSubmit = (data: ItemFormData) => {
    if (item) {
      onSave({ ...item, ...data });
    } else {
      onSave(data);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit Uniform Item" : "Add New Uniform Item"}</DialogTitle>
          <DialogDescription>
            {item ? `Update the details for ${item.name}` : "Fill out the form to add an item to the uniform inventory."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Tunic, C-1A" /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {(settings.uniformCategories || []).map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
             <div className="grid grid-cols-2 gap-4">
               <FormField control={form.control} name="size" render={({ field }) => (
                 <FormItem><FormLabel>Size</FormLabel><FormControl><Input {...field} placeholder="e.g., 7040, 10R" /></FormControl><FormMessage /></FormItem>
               )} />
               <FormField control={form.control} name="quantity" render={({ field }) => (
                 <FormItem><FormLabel>Quantity in Stock</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
               )} />
            </div>
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
