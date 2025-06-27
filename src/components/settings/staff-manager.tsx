
"use client";

import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


const staffSchema = z.object({
  type: z.enum(['Officer', 'PO/NCM'], { required_error: 'You must select a staff type.' }),
  rank: z.string().min(1, 'Rank is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffManagerProps {
    staff: StaffMember[];
    onStaffChange: (newStaff: StaffMember[]) => void;
}

export function StaffManager({ staff, onStaffChange }: StaffManagerProps) {
    const { settings } = useSettings(); // Used for officerRanks list
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

    const { watch, setValue } = form;
    const watchType = watch('type');
    const firstName = watch('firstName');
    const lastName = watch('lastName');

    useEffect(() => {
        if (!editingStaff && firstName && lastName) {
            const emailValue = `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}@cadets.gc.ca`;
            setValue('email', emailValue, { shouldValidate: true });
        }
    }, [firstName, lastName, editingStaff, setValue]);

    const handleEditClick = (staffMember: StaffMember) => {
        setEditingStaff(staffMember);
        form.reset({
            type: staffMember.type,
            rank: staffMember.rank,
            firstName: staffMember.firstName,
            lastName: staffMember.lastName,
            phone: staffMember.phone || '',
            email: staffMember.email || '',
        });
    }

    const handleCancelEdit = () => {
        setEditingStaff(null);
        form.reset();
    }

    const onSubmit = (data: StaffFormData) => {
        if (editingStaff) {
            // Update existing staff
            const updatedStaff = staff.map(s => s.id === editingStaff.id ? { ...s, ...data } : s);
            onStaffChange(updatedStaff);
        } else {
            // Add new staff
            const newStaffMember: StaffMember = { ...data, id: crypto.randomUUID() };
            onStaffChange([...staff, newStaffMember]);
        }
        handleCancelEdit();
    };

    const handleRemoveStaff = (id: string) => {
        const updatedStaff = staff.filter(s => s.id !== id);
        onStaffChange(updatedStaff);
    };

    return (
        <Card className="border">
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
                                <FormField control={form.control} name="rank" render={({ field }) => ( 
                                    <FormItem>
                                        <FormLabel>Rank</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a rank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {settings.officerRanks.map((rank) => (
                                                <SelectItem key={rank} value={rank}>
                                                    {rank}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                 )} />
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
                                {staff.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No staff members added.</TableCell></TableRow>}
                                {staff.map(staffMember => (
                                    <TableRow key={staffMember.id}>
                                        <TableCell className="font-medium">{staffMember.rank} {staffMember.firstName} {staffMember.lastName}</TableCell>
                                        <TableCell>{staffMember.type}</TableCell>
                                        <TableCell>{staffMember.email || staffMember.phone || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(staffMember)}><Edit className="h-4 w-4" /></Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><X className="h-4 w-4 text-destructive"/></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove {staffMember.rank} {staffMember.lastName} from the staff roster.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRemoveStaff(staffMember.id)}>Continue</AlertDialogAction>
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
