"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Cadet } from "@/lib/types";

interface CadetListProps {
  cadets: Cadet[];
  onRemoveCadet: (id: string) => void;
}

export function CadetList({ cadets, onRemoveCadet }: CadetListProps) {
  if (cadets.length === 0) {
    return <p className="text-muted-foreground text-center">No cadets have been added yet.</p>;
  }

  return (
    <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cadets.map((cadet) => (
                <TableRow key={cadet.id}>
                    <TableCell>{cadet.rank}</TableCell>
                    <TableCell>{cadet.firstName}</TableCell>
                    <TableCell>{cadet.lastName}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onRemoveCadet(cadet.id)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove Cadet</span>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
