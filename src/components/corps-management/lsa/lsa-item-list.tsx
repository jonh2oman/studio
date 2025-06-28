
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, Pencil, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import type { LsaWishListItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { useMemo } from "react";

interface LsaItemListProps {
  items: LsaWishListItem[];
  isLoaded: boolean;
  onEditItem: (item: LsaWishListItem) => void;
  onRemoveItem: (id: string) => void;
}

export function LsaItemList({ items, isLoaded, onEditItem, onRemoveItem }: LsaItemListProps) {
  
  const grandTotal = useMemo(() => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  }, [items]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wish List Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No items have been added to the wish list yet.</p>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center w-[120px]">Links</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.sort((a,b) => a.name.localeCompare(b.name)).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                            {item.link && (
                                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                                    <Link href={item.link} target="_blank" rel="noopener noreferrer"><LinkIcon className="h-4 w-4" /></Link>
                                </Button>
                            )}
                            {item.priceScreenshot && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-7 w-7"><ImageIcon className="h-4 w-4" /></Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <img src={item.priceScreenshot} alt={`Screenshot for ${item.name}`} className="max-w-full max-h-[80vh] object-contain mx-auto" />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEditItem(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Item</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove Item</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete "{item.name}" from the wish list. This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => onRemoveItem(item.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Grand Total</TableCell>
                    <TableCell className="text-right font-bold">${grandTotal.toFixed(2)}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
