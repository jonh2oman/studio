
"use client";

import React, { createContext, useContext, useCallback } from 'react';
import type { BiathlonResult } from '@/lib/types';
import { useTrainingYear } from './use-training-year';
import { useToast } from './use-toast';

interface BiathlonContextType {
  results: BiathlonResult[];
  addResult: (result: Omit<BiathlonResult, 'id'>) => void;
  removeResult: (resultId: string) => void;
  isLoaded: boolean;
}

const BiathlonContext = createContext<BiathlonContextType | undefined>(undefined);

export const BiathlonProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentYear, currentYearData, updateCurrentYearData, isLoaded } = useTrainingYear();
    const { toast } = useToast();

    const results = currentYearData?.biathlonResults || [];

    const addResult = useCallback((resultData: Omit<BiathlonResult, 'id'>) => {
        if (!currentYear) {
            toast({ variant: "destructive", title: "No training year selected" });
            return;
        }
        const newResult: BiathlonResult = { ...resultData, id: crypto.randomUUID() };
        updateCurrentYearData(prevData => ({
            ...prevData,
            biathlonResults: [...(prevData.biathlonResults || []), newResult]
        }));
        toast({ title: "Biathlon Result Saved", description: "The competition result has been added." });
    }, [currentYear, updateCurrentYearData, toast]);

    const removeResult = useCallback((resultId: string) => {
        if (!currentYear) return;
        updateCurrentYearData(prevData => ({
            ...prevData,
            biathlonResults: (prevData.biathlonResults || []).filter(r => r.id !== resultId)
        }));
        toast({ title: "Result Removed", variant: "destructive" });
    }, [currentYear, updateCurrentYearData, toast]);

    const value = { results, addResult, removeResult, isLoaded };

    return React.createElement(BiathlonContext.Provider, { value }, children);
};

export const useBiathlon = () => {
    const context = useContext(BiathlonContext);
    if (context === undefined) {
        throw new Error('useBiathlon must be used within a BiathlonProvider');
    }
    return context;
};
