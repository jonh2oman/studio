
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Printer, Library } from "lucide-react";
import type { Asset, Cadet } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LoanedItemsListProps {
  loanedAssets: Asset[];
  cadets: Cadet[];
  onReturnLoan: (assetId: string) => void;
  onPrintLoanCard: (asset: Asset, cadet: Cadet) => void;
  isLoaded: boolean;
}

export function LoanedItemsList({ loanedAssets, cadets, onReturnLoan, onPrintLoanCard, isLoaded }: LoanedItemsListProps) {
  
  if (!isLoaded) {
    return (
        <Card>
            <CardHeader><CardTitle>Currently Loaned Items</CardTitle></CardHeader>
            <CardContent className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }
  
  const getCadetById = (id: string) => cadets.find(c => c.id === id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Loaned Items</CardTitle>
        <CardDescription>A list of all equipment currently on loan to cadets.</CardDescription>
      </CardHeader>
      <CardContent>
        {loanedAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48 border-2 border-dashed rounded-lg">
             <Library className="h-10 w-10 mb-2" />
            <p>No items are currently on loan.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                        <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Loaned To</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loanedAssets.map((asset) => {
                            const cadet = asset.loanedToCadetId ? getCadetById(asset.loanedToCadetId) : null;
                            if (!cadet) return null; // Should not happen if data is consistent
                            return (
                                <TableRow key={asset.id}>
                                    <TableCell className="font-medium">{asset.name}</TableCell>
                                    <TableCell>{cadet.rank} {cadet.lastName}</TableCell>
                                    <TableCell>{asset.returnDate ? format(new Date(asset.returnDate.replace(/-/g, '/')), 'PPP') : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => onReturnLoan(asset.id)} className="mr-2">
                                            <RotateCcw className="mr-2 h-4 w-4" /> Return
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => onPrintLoanCard(asset, cadet)}>
                                            <Printer className="mr-2 h-4 w-4" /> Print Card
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
