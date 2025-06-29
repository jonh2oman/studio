
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "@/hooks/use-settings";
import { useTrainingYear } from "@/hooks/use-training-year";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["editor", "viewer"]),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export function UserAccessManager() {
    const { user } = useAuth();
    

    const form = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: "",
            role: "editor",
        },
    });

    const onSubmit = (data: InviteFormData) => {
        
        form.reset();
    };

    const handleRoleChange = (userId: string, newRole: 'editor' | 'viewer') => {
        
    };
    
    const handleRemoveUser = (userId: string) => {
        
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-2">Invite New User</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4 p-4 border rounded-lg">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem className="w-48">
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <Button type="submit">Send Invitation</Button>
                    </form>
                </Form>
            </div>
            
             <div>
                <h3 className="text-lg font-medium mb-2">Current Users</h3>
                 <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
