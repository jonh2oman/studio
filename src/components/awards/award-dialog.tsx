
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Award } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

const awardSchema = z.object({
  name: z.string().min(1, "Award name is required"),
  category: z.enum(["National", "Corps"]),
  description: z.string().min(1, "Description is required"),
  criteria: z.array(z.object({ value: z.string().min(1, "Criterion cannot be empty") })).min(1, "At least one criterion is required"),
  eligibility: z.string().min(1, "Eligibility is required"),
  deadline: z.string().optional(),
  approval: z.string().optional(),
});

type AwardFormData = z.infer<typeof awardSchema>;

interface AwardDialogProps {
  award?: Award;
  onSave: (data: Omit<Award, "id"> | Award) => void;
  onOpenChange: (open: boolean) => void;
}

export function AwardDialog({ award, onSave, onOpenChange }: AwardDialogProps) {
  const form = useForm<AwardFormData>({
    resolver: zodResolver(awardSchema),
    defaultValues: award
      ? { ...award, criteria: award.criteria.map(c => ({ value: c })) }
      : {
          name: "",
          category: "Corps",
          description: "",
          criteria: [{ value: "" }],
          eligibility: "",
          deadline: "",
          approval: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "criteria",
  });

  const onSubmit = (data: AwardFormData) => {
    const awardData = {
      ...data,
      criteria: data.criteria.map(c => c.value),
    };

    if (award) {
      onSave({ ...awardData, id: award.id });
    } else {
      onSave(awardData);
    }
  };

  const dialogTitle = award ? "Edit Award" : "Add New Award";
  const dialogDescription = award ? `Update the details for ${award.name}.` : "Fill out the form to create a new corps award.";

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
                <div className="space-y-6 px-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Award Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Corps">Corps</SelectItem>
                                <SelectItem value="National">National</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div>
                    <FormLabel>Criteria</FormLabel>
                    <div className="mt-2 space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name={`criteria.${index}.value`}
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Textarea {...field} placeholder={`Criterion #${index + 1}`} rows={1} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                         )}
                        </div>
                    ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: "" })}>
                        Add Criterion
                    </Button>
                </div>
                
                 <FormField
                    control={form.control}
                    name="eligibility"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Eligibility</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deadline</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="approval"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Approval Body</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-6 pr-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Save Award</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
