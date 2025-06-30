"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { StoreItemDialog } from "./store-item-dialog";
import type { StoreItem } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export function StoreInventory() {
  const { inventory, addStoreItem, updateStoreItem, removeStoreItem, isLoaded } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);

  const handleSave = (itemData: Omit<StoreItem, "id"> | StoreItem) => {
    if ("id" in itemData) {
      updateStoreItem(itemData);
    } else {
      addStoreItem(itemData);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };
  
  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      setEditingItem(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Store Inventory</CardTitle>
              <CardDescription>Manage items available for purchase with Ardent Dollars.</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Add New Item</Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isLoaded ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No items in inventory.</TableCell></TableRow>}
                        {inventory.sort((a,b) => a.name.localeCompare(b.name)).map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.description}</TableCell>
                                <TableCell className="text-right font-mono">${item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{item.stock}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={()={() => handleEdit(item)}}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete "{item.name}" from the inventory.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction variant="destructive" onClick={() => removeStoreItem(item.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isDialogOpen && (
        <StoreItemDialog
          isOpen={isDialogOpen}
          onOpenChange={handleOpenChange}
          onSave={handleSave}
          item={editingItem}
        />
      )}
    </>
  );
}
