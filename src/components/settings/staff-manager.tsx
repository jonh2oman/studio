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
import { X, Edit, UserPlus, ChevronDown } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';


const staffSchema = z.object({
  type: z.enum(['Officer', 'PO/NCM'], { required_error: 'You must select a staff type.' }),
  rank: z.string().min(1, 'Rank is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().optional(),
  primaryRole: z.string().min(1, 'Primary role is required'),
  additionalRoles: z.array(z.string()).optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffManagerProps {
    staff: StaffMember[];
    onStaffChange: (newStaff: StaffMember[]) => void;
}

export function StaffManager({ staff, onStaffChange }: StaffManagerProps) {
    const { settings } = useSettings();
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
            primaryRole: '',
            additionalRoles: [],
        },
    });

    const { watch, setValue, control, reset } = form;
    const watchType = watch('type');
    const watchPrimaryRole = watch('primaryRole');
    const firstName = watch('firstName');
    const lastName = watch('lastName');

    useEffect(() => {
        if (watchType === 'Officer' && !editingStaff && firstName && lastName) {
            const emailValue = `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}@cadets.gc.ca`;
            setValue('email', emailValue, { shouldValidate: true });
        }
    }, [firstName, lastName, editingStaff, setValue, watchType]);

    useEffect(() => {
        if (!editingStaff) {
             setValue('rank', '');
        }
    }, [watchType, setValue, editingStaff]);

    const handleEditClick = (staffMember: StaffMember) => {
        setEditingStaff(staffMember);
        reset({
            type: staffMember.type,
            rank: staffMember.rank,
            firstName: staffMember.firstName,
            lastName: staffMember.lastName,
            phone: staffMember.phone || '',
            email: staffMember.email || '',
            primaryRole: staffMember.primaryRole,
            additionalRoles: staffMember.additionalRoles,
        });
    }

    const handleCancelEdit = () => {
        setEditingStaff(null);
        reset({
            type: 'Officer',
            rank: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            primaryRole: '',
            additionalRoles: [],
        });
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
                <CardDescription>Add, edit, or remove staff members and assign their roles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-lg bg-muted/30">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <h4 className="text-lg font-semibold">{editingStaff ? `Editing ${editingStaff.firstName} ${editingStaff.lastName}` : 'Add New Staff Member'}</h4>
                            <FormField
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>Staff Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
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
                                <FormField control={control} name="rank" render={({ field }) => ( 
                                    <FormItem>
                                        <FormLabel>Rank</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!watchType}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a rank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(watchType === 'Officer' ? settings.officerRanks : settings.cadetRanks).map((rank) => (
                                                <SelectItem key={rank} value={rank}>
                                                    {rank}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                 )} />
                                <FormField control={control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={control} name="primaryRole" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Role</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select primary role..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {settings.staffRoles.map(role => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name="additionalRoles" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Additional Roles</FormLabel>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {field.value?.length ? `${field.value.length} selected` : "Select additional roles..."}
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                                                <DropdownMenuLabel>Assign Additional Roles</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {settings.staffRoles.map(role => {
                                                    const isChecked = field.value?.includes(role);
                                                    const isPrimary = watchPrimaryRole === role;
                                                    return (
                                                        <DropdownMenuCheckboxItem
                                                            key={role}
                                                            checked={isChecked}
                                                            disabled={isPrimary}
                                                            onCheckedChange={(checked) => {
                                                                const currentRoles = field.value || [];
                                                                const newRoles = checked
                                                                    ? [...currentRoles, role]
                                                                    : currentRoles.filter(r => r !== role);
                                                                field.onChange(newRoles);
                                                            }}
                                                        >
                                                            {role}
                                                        </DropdownMenuCheckboxItem>
                                                    );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {watchType === 'Officer' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email"/></FormControl><FormMessage /></FormItem> )} />
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
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No staff members added.</TableCell></TableRow>}
                                {staff.map(staffMember => (
                                    <TableRow key={staffMember.id}>
                                        <TableCell className="font-medium">{staffMember.rank} {staffMember.firstName} {staffMember.lastName}</TableCell>
                                        <TableCell>{staffMember.type}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{staffMember.primaryRole || 'N/A'}</span>
                                                {staffMember.additionalRoles?.length > 0 && (
                                                    <span className="text-xs text-muted-foreground">{staffMember.additionalRoles.join(', ')}</span>
                                                )}
                                            </div>
                                        </TableCell>
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
