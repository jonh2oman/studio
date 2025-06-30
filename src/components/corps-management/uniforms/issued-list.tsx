
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Printer } from "lucide-react";
import type { IssuedUniformItem, UniformItem, Cadet } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface IssuedListProps {
  issuedItems: IssuedUniformItem[];
  inventory: UniformItem[];
  cadets: Cadet[];
  onReturn: (issuedItemId: string) => void;
  onPrintLoanCard: (issuedItem: IssuedUniformItem, cadet: Cadet, uniformItem: UniformItem) => void;
  isLoaded: boolean;
}

export function IssuedList({ issuedItems, inventory, cadets, onReturn, onPrintLoanCard, isLoaded }: IssuedListProps) {
  
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

  const groupedByCadet = useMemo(() => {
    return enrichedIssuedItems.reduce((acc, item) => {
        if (!acc[item.cadetId]) {
            acc[item.cadetId] = {
                cadetName: item.cadetName,
                items: []
            };
        }
        acc[item.cadetId].items.push(item);
        return acc;
    }, {} as Record<string, { cadetName: string; items: typeof enrichedIssuedItems }>);
  }, [enrichedIssuedItems]);
  
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
        <CardDescription>All uniform parts currently issued to cadets, grouped by cadet.</CardDescription>
      </CardHeader>
      <CardContent>
        {issuedItems.length === 0 ? (
          <div className="text-center text-muted-foreground h-48 border-2 border-dashed rounded-lg flex items-center justify-center">
            <p>No items are currently issued.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <Accordion type="multiple" className="w-full space-y-2">
                {Object.entries(groupedByCadet).map(([cadetId, { cadetName, items }]) => (
                    <Card key={cadetId} className="border">
                        <AccordionItem value={cadetId} className="border-b-0">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <span className="font-semibold">{cadetName} ({items.length} items)</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => {
                                                const uniformItem = inventory.find(i => i.id === item.uniformItemId);
                                                if (!uniformItem) return null;

                                                const cadet = cadets.find(c => c.id === item.cadetId);
                                                if (!cadet) return null;

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <p>{item.itemName}</p>
                                                            <p className="text-xs text-muted-foreground">Size: {item.itemSize} | Issued: {format(new Date(item.issueDate), 'dd MMM yyyy')}</p>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="outline" size="sm" onClick={() => onReturn(item.id)}>
                                                                <RotateCcw className="mr-2 h-4 w-4" /> Return
                                                            </Button>
                                                            <Button variant="secondary" size="sm" className="ml-2" onClick={() => onPrintLoanCard(item, cadet, uniformItem)}>
                                                                <Printer className="mr-2 h-4 w-4" /> Print Card
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Card>
                ))}
            </Accordion>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
