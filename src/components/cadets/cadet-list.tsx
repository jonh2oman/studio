
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, Pencil } from "lucide-react";
import type { Cadet } from "@/lib/types";
import { Badge } from "../ui/badge";

interface CadetListProps {
  cadets: Cadet[];
  onRemoveCadet: (id: string) => void;
  onEditCadet: (cadet: Cadet) => void;
}

export function CadetList({ cadets, onRemoveCadet, onEditCadet }: CadetListProps) {
  if (cadets.length === 0) {
    return <p className="text-muted-foreground text-center">No cadets have been added yet.</p>;
  }

  return (
    <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Last Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)).map((cadet) => (
                <TableRow key={cadet.id}>
                    <TableCell>{cadet.lastName}</TableCell>
                    <TableCell>{cadet.firstName}</TableCell>
                    <TableCell>{cadet.rank}</TableCell>
                    <TableCell><Badge variant="secondary">Phase {cadet.phase}</Badge></TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEditCadet(cadet)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Cadet</span>
                    </Button>
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
