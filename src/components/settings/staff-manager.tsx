
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSettings } from '@/hooks/use-settings';
import type { StaffMember, StaffMemberType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Edit, UserPlus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


const staffSchema = z.object({
  type: z.enum(['Officer', 'PO/NCM'], { required_error: 'You must select a staff type.' }),
  rank: z.string().min(1, 'Rank is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export function StaffManager() {
    const { settings, saveSettings } = useSettings();
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    const form = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            type: 'Officer',
            rank: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
        },
    });

    const watchType = form.watch('type');

    const handleEditClick = (staff: StaffMember) => {
        setEditingStaff(staff);
        form.reset({
            type: staff.type,
            rank: staff.rank,
            firstName: staff.firstName,
            lastName: staff.lastName,
            phone: staff.phone || '',
            email: staff.email || '',
        });
    }

    const handleCancelEdit = () => {
        setEditingStaff(null);
        form.reset();
    }

    const onSubmit = (data: StaffFormData) => {
        if (editingStaff) {
            // Update existing staff
            const updatedStaff = settings.staff.map(s => s.id === editingStaff.id ? { ...s, ...data } : s);
            saveSettings({ staff: updatedStaff });
        } else {
            // Add new staff
            const newStaff: StaffMember = { ...data, id: crypto.randomUUID() };
            saveSettings({ staff: [...settings.staff, newStaff] });
        }
        handleCancelEdit();
    };

    const handleRemoveStaff = (id: string) => {
        const updatedStaff = settings.staff.filter(s => s.id !== id);
        saveSettings({ staff: updatedStaff });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Corps Staff</CardTitle>
                <CardDescription>Add, edit, or remove staff members who can be assigned as instructors or duty personnel.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-lg bg-muted/30">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <h4 className="text-lg font-semibold">{editingStaff ? `Editing ${editingStaff.firstName} ${editingStaff.lastName}` : 'Add New Staff Member'}</h4>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>Staff Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="Officer" /></FormControl>
                                                <FormLabel className="font-normal">Officer</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="PO/NCM" /></FormControl>
                                                <FormLabel className="font-normal">PO / NCM</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="rank" render={({ field }) => ( <FormItem><FormLabel>Rank</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            </div>

                            {watchType === 'Officer' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email"/></FormControl><FormMessage /></FormItem> )} />
                                </div>
                            )}
                            
                             <div className="flex gap-2">
                                <Button type="submit">
                                    {editingStaff ? 'Save Changes' : <><UserPlus className="mr-2 h-4 w-4" /> Add Staff</>}
                                </Button>
                                {editingStaff && <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>}
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Staff Roster</h4>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {settings.staff.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No staff members added.</TableCell></TableRow>}
                                {settings.staff.map(staff => (
                                    <TableRow key={staff.id}>
                                        <TableCell className="font-medium">{staff.rank} {staff.firstName} {staff.lastName}</TableCell>
                                        <TableCell>{staff.type}</TableCell>
                                        <TableCell>{staff.email || staff.phone || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(staff)}><Edit className="h-4 w-4" /></Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><X className="h-4 w-4 text-destructive"/></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove {staff.rank} {staff.lastName} from the staff roster.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRemoveStaff(staff.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
