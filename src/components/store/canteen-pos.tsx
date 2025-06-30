"use client";

import { useState, useMemo, useCallback } from "react";
import { useStore } from "@/hooks/use-store";
import { useCadets } from "@/hooks/use-cadets";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Trash2, X, Loader2 } from "lucide-react";
import type { StoreItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends StoreItem {
    quantity: number;
}

export function CanteenPOS() {
    const { inventory, addTransaction, updateStoreItem, isLoaded: storeLoaded } = useStore();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { toast } = useToast();

    const [selectedCadet, setSelectedCadet] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    const sortedCadets = useMemo(() => cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)), [cadets]);
    const availableItems = useMemo(() => inventory.filter(item => item.stock > 0), [inventory]);

    const addToCart = useCallback((item: StoreItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                if (existingItem.quantity < item.stock) {
                    return prevCart.map(cartItem => 
                        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                    );
                } else {
                    toast({ variant: "destructive", title: "Out of Stock", description: `No more "${item.name}" available.` });
                    return prevCart;
                }
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    }, [toast]);
    
    const removeFromCart = useCallback((itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    }, []);

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = useCallback(() => {
        if (!selectedCadet) {
            toast({ variant: 'destructive', title: 'No Cadet Selected', description: 'Please select a cadet to complete the sale.'});
            return;
        }

        const saleReason = `Canteen purchase: ${cart.map(item => `${item.quantity}x ${item.name}`).join(', ')}`;
        addTransaction(selectedCadet, -cartTotal, saleReason);

        // Update stock
        cart.forEach(cartItem => {
            const originalItem = inventory.find(invItem => invItem.id === cartItem.id);
            if (originalItem) {
                updateStoreItem({ ...originalItem, stock: originalItem.stock - cartItem.quantity });
            }
        });

        // Reset state
        setCart([]);
        setSelectedCadet(null);
        toast({ title: "Sale Complete!", description: `Charged $${cartTotal.toFixed(2)} to the selected cadet.` });

    }, [selectedCadet, cart, cartTotal, addTransaction, updateStoreItem, inventory, toast]);

    const isLoading = !storeLoaded || !cadetsLoaded;

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader><CardTitle>Available Items</CardTitle></CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[60vh]">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableItems.map(item => (
                                    <Button key={item.id} variant="outline" className="h-24 flex flex-col justify-between p-3" onClick={() => addToCart(item)}>
                                        <span className="text-sm font-semibold text-center whitespace-normal break-words">{item.name}</span>
                                        <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                                            <span>${item.price.toFixed(2)}</span>
                                            <span>Stock: {item.stock}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Sale</CardTitle>
                        <CardDescription>Select a cadet and add items to their cart.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Cadet</label>
                            <Select onValueChange={setSelectedCadet} value={selectedCadet || ''}>
                                <SelectTrigger><SelectValue placeholder="Select a cadet..." /></SelectTrigger>
                                <SelectContent>
                                    {sortedCadets.map(cadet => (
                                        <SelectItem key={cadet.id} value={cadet.id}>{cadet.lastName}, {cadet.firstName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="border rounded-lg">
                             <ScrollArea className="h-64">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24">Cart is empty</TableCell></TableRow>}
                                        {cart.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.quantity}x {item.name}</TableCell>
                                                <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="w-full flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" disabled={cart.length === 0 || !selectedCadet} onClick={handleCheckout}>
                            Complete Sale
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
