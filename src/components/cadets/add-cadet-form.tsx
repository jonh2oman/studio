
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/hooks/use-settings";
import type { Cadet } from "@/lib/types";
import { getPhaseDisplayName, getPhaseLabel } from "@/lib/utils";
import { Switch } from "../ui/switch";

const cadetSchema = z.object({
  rank: z.string().min(1, "Rank is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  phase: z.coerce.number().min(1).max(5),
  role: z.string().optional(),
  isBiathlonTeamMember: z.boolean().optional(),
});

interface AddCadetFormProps {
  onAddCadet: (cadet: Omit<Cadet, 'id'>) => void;
}

export function AddCadetForm({ onAddCadet }: AddCadetFormProps) {
  const { settings } = useSettings();
  const form = useForm<z.infer<typeof cadetSchema>>({
    resolver: zodResolver(cadetSchema),
    defaultValues: {
      rank: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phase: 1,
      role: "",
      isBiathlonTeamMember: false,
    },
  });

  const onSubmit = (data: z.infer<typeof cadetSchema>) => {
    onAddCadet(data);
    form.reset();
  };
  
  const phaseLabel = getPhaseLabel(settings.element);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Add New Cadet</CardTitle>
            <CardDescription>Fill out the form to add a cadet to the roster.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Input placeholder="e.g., Jean-Luc" {...field} />
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
                        <Input placeholder="e.g., Picard" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>{phaseLabel}</FormLabel>
                         <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={`Select a ${phaseLabel.toLowerCase()}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {[1,2,3,4,5].map((phase) => (
                            <SelectItem key={phase} value={String(phase)}>
                                {getPhaseDisplayName(settings.element, phase)}
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                 <FormField
                    control={form.control}
                    name="isBiathlonTeamMember"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Biathlon Team Member</FormLabel>
                                <FormDescription>Mark if this cadet is on the biathlon team.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Add Cadet</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
