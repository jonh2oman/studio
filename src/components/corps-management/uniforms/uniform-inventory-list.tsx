"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, PlusCircle } from "lucide-react";
import type { UniformItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UniformInventoryListProps {
  inventory: UniformItem[];
  isLoaded: boolean;
  onEdit: (item: UniformItem) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function UniformInventoryList({ inventory, isLoaded, onEdit, onDelete, onAddNew }: UniformInventoryListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Uniform Inventory</CardTitle>
                <CardDescription>All uniform parts currently held in supply.</CardDescription>
            </div>
            <Button size="sm" onClick={onAddNew}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <ScrollArea className="h-96">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">In Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="h-24 text-center">No inventory items added.</TableCell></TableRow>
                        ) : (
                             inventory.sort((a,b) => a.name.localeCompare(b.name)).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell className="text-right font-semibold">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                 <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete "{item.name} (Size: {item.size})". This action cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction variant="destructive" onClick={() => onDelete(item.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
