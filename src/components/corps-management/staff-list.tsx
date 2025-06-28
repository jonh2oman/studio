"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, Edit } from "lucide-react";
import type { StaffMember } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface StaffListProps {
  staff: StaffMember[];
  onEditStaff: (staffMember: StaffMember) => void;
  onRemoveStaff: (id: string) => void;
}

export function StaffList({ staff, onEditStaff, onRemoveStaff }: StaffListProps) {
  if (staff.length === 0) {
    return <p className="text-muted-foreground text-center">No staff members have been added yet.</p>;
  }

  return (
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
                {staff.sort((a,b) => a.lastName.localeCompare(b.lastName)).map((staffMember) => (
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
                        <Button variant="ghost" size="icon" onClick={() => onEditStaff(staffMember)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><X className="h-4 w-4 text-destructive"/></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently remove {staffMember.rank} {staffMember.lastName} from the staff roster.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant="destructive" onClick={() => onRemoveStaff(staffMember.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}