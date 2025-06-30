
"use client";

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { StoreItem, Transaction } from '@/lib/types';
import { useTrainingYear } from './use-training-year';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

interface StoreContextType {
  inventory: StoreItem[];
  transactions: Transaction[];
  addStoreItem: (item: Omit<StoreItem, "id">) => void;
  updateStoreItem: (item: StoreItem) => void;
  removeStoreItem: (itemId: string) => void;
  addTransaction: (cadetId: string, amount: number, reason: string) => void;
  isLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { currentYearData, updateCurrentYearData, isLoaded } = useTrainingYear();
    const { toast } = useToast();

    const inventory = useMemo(() => currentYearData?.storeInventory || [], [currentYearData]);
    const transactions = useMemo(() => currentYearData?.transactions || [], [currentYearData]);

    const addStoreItem = useCallback((itemData: Omit<StoreItem, 'id'>) => {
        const newItem: StoreItem = {
            ...itemData,
            description: itemData.description || '', // Ensure description is a string
            id: crypto.randomUUID(),
        };
        updateCurrentYearData(prevData => ({
            ...prevData,
            storeInventory: [...(prevData.storeInventory || []), newItem]
        }));
        toast({ title: "Item Added", description: `"${newItem.name}" has been added to the store.` });
    }, [updateCurrentYearData, toast]);

    const updateStoreItem = useCallback((updatedItem: StoreItem) => {
        const cleanedItem: StoreItem = {
            ...updatedItem,
            description: updatedItem.description || '', // Ensure description is a string
        };
        updateCurrentYearData(prevData => ({
            ...prevData,
            storeInventory: (prevData.storeInventory || []).map(item => item.id === cleanedItem.id ? cleanedItem : item)
        }));
        toast({ title: "Item Updated" });
    }, [updateCurrentYearData, toast]);

    const removeStoreItem = useCallback((itemId: string) => {
        const itemToRemove = inventory.find(item => item.id === itemId);
        updateCurrentYearData(prevData => ({
            ...prevData,
            storeInventory: (prevData.storeInventory || []).filter(item => item.id !== itemId)
        }));
        toast({ title: "Item Removed", description: `"${itemToRemove?.name || 'Item'}" has been removed.`, variant: 'destructive' });
    }, [inventory, updateCurrentYearData, toast]);
    
    const addTransaction = useCallback((cadetId: string, amount: number, reason: string) => {
        if (!user || !user.email) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
            return;
        }
        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            cadetId,
            amount,
            reason,
            timestamp: new Date().toISOString(),
            staffId: user.email,
        };
        updateCurrentYearData(prevData => ({
            ...prevData,
            transactions: [...(prevData.transactions || []), newTransaction]
        }));
        toast({ title: "Transaction Complete" });
    }, [updateCurrentYearData, toast, user]);


    const value = { 
        inventory, 
        transactions, 
        addStoreItem, 
        updateStoreItem, 
        removeStoreItem,
        addTransaction,
        isLoaded 
    };

    return React.createElement(StoreContext.Provider, { value }, children);
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
