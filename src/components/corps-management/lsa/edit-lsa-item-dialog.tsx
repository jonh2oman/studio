
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LsaWishListItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, X } from "lucide-react";

const lsaItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Price cannot be negative"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  priceScreenshot: z.string().optional(),
});

interface EditLsaItemDialogProps {
  item: LsaWishListItem;
  onUpdateItem: (item: LsaWishListItem) => void;
  onOpenChange: (open: boolean) => void;
}

export function EditLsaItemDialog({ item, onUpdateItem, onOpenChange }: EditLsaItemDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof lsaItemSchema>>({
    resolver: zodResolver(lsaItemSchema),
    defaultValues: item,
  });

  const onSubmit = (data: z.infer<typeof lsaItemSchema>) => {
    onUpdateItem(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({ variant: "destructive", title: "Image too large", description: "Please upload an image smaller than 1MB." });
        return; 
    }
    const reader = new FileReader();
    reader.onload = (event) => { 
        form.setValue('priceScreenshot', event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const priceScreenshot = form.watch("priceScreenshot");

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit LSA Item</DialogTitle>
          <DialogDescription>Update the details for "{item.name}".</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
              <div className="space-y-4 px-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="unitPrice" render={({ field }) => (
                    <FormItem><FormLabel>Unit Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="link" render={({ field }) => (
                  <FormItem><FormLabel>Link (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div>
                    <FormLabel>Price Screenshot (Optional)</FormLabel>
                    {priceScreenshot ? (
                        <div className="relative mt-2 w-fit">
                            <img src={priceScreenshot} alt="Price screenshot preview" className="h-24 w-auto rounded-md border" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={() => form.setValue('priceScreenshot', '')}
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-2">
                             <Button asChild variant="outline">
                                <label htmlFor="edit-screenshot-upload" className="cursor-pointer flex items-center gap-2">
                                    <ImagePlus /> Upload Image
                                    <Input id="edit-screenshot-upload" type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" onChange={handleImageUpload} />
                                </label>
                            </Button>
                        </div>
                    )}
                 </div>
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
