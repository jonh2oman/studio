"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";
import type { IssuedUniformItem, UniformItem, Cadet } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

interface IssuedListProps {
  issuedItems: IssuedUniformItem[];
  inventory: UniformItem[];
  cadets: Cadet[];
  onReturn: (issuedItemId: string) => void;
  isLoaded: boolean;
}

export function IssuedList({ issuedItems, inventory, cadets, onReturn, isLoaded }: IssuedListProps) {
  
  const enrichedIssuedItems = useMemo(() => {
    return issuedItems.map(issued => {
        const cadet = cadets.find(c => c.id === issued.cadetId);
        const item = inventory.find(i => i.id === issued.uniformItemId);
        return {
            ...issued,
            cadetName: cadet ? `${cadet.rank} ${cadet.lastName}` : 'Unknown',
            itemName: item ? item.name : 'Unknown Item',
            itemSize: item ? item.size : 'N/A',
        };
    }).sort((a, b) => a.cadetName.localeCompare(b.cadetName) || a.itemName.localeCompare(b.itemName));
  }, [issuedItems, cadets, inventory]);
  
  if (!isLoaded) {
    return (
        <Card>
            <CardHeader><CardTitle>Issued Items</CardTitle></CardHeader>
            <CardContent className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issued Items</CardTitle>
        <CardDescription>All uniform parts currently issued to cadets.</CardDescription>
      </CardHeader>
      <CardContent>
        {issuedItems.length === 0 ? (
          <div className="text-center text-muted-foreground h-48 border-2 border-dashed rounded-lg flex items-center justify-center">
            <p>No items are currently issued.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Issued To</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrichedIssuedItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.cadetName}</TableCell>
                                <TableCell>
                                    <p>{item.itemName}</p>
                                    <p className="text-xs text-muted-foreground">Size: {item.itemSize} | Issued: {format(new Date(item.issueDate), 'dd MMM yyyy')}</p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => onReturn(item.id)}>
                                        <RotateCcw className="mr-2 h-4 w-4" /> Return
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
