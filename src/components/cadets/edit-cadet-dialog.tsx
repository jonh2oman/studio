
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/hooks/use-settings";
import type { Cadet } from "@/lib/types";

const cadetSchema = z.object({
  id: z.string(),
  rank: z.string().min(1, "Rank is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phase: z.coerce.number().min(1).max(5),
  role: z.string().optional(),
});

interface EditCadetDialogProps {
  cadet: Cadet;
  onUpdateCadet: (cadet: Cadet) => void;
  onOpenChange: (open: boolean) => void;
}

export function EditCadetDialog({ cadet, onUpdateCadet, onOpenChange }: EditCadetDialogProps) {
  const { settings } = useSettings();
  const form = useForm<z.infer<typeof cadetSchema>>({
    resolver: zodResolver(cadetSchema),
    defaultValues: cadet,
  });

  const onSubmit = (data: z.infer<typeof cadetSchema>) => {
    onUpdateCadet(data);
  };

  return (
     <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Cadet</DialogTitle>
                <DialogDescription>Update the details for {cadet.firstName} {cadet.lastName}.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                <FormField
                    control={form.control}
                    name="rank"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rank</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a rank" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {settings.cadetRanks.map((rank) => (
                            <SelectItem key={rank} value={rank}>
                                {rank}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="phase"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phase</FormLabel>
                         <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a phase" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {[1,2,3,4,5].map((phase) => (
                            <SelectItem key={phase} value={String(phase)}>
                                Phase {phase}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {(settings.cadetRoles || []).map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
                </form>
            </Form>
        </DialogContent>
     </Dialog>
  );
}
