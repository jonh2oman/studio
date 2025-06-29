
"use client";

import { createContext, useContext, useCallback } from 'react';
import type { MarksmanshipRecord } from '@/lib/types';
import { useTrainingYear } from './use-training-year';
import { useToast } from './use-toast';
import React from 'react';

type MarksmanshipClassification = "Distinguished Marksman" | "Expert Marksman" | "First Class Marksman" | "Marksman" | "Unclassified";

interface MarksmanshipContextType {
  records: MarksmanshipRecord[];
  addRecord: (record: Omit<MarksmanshipRecord, 'id'>) => void;
  isLoaded: boolean;
}

const MarksmanshipContext = createContext<MarksmanshipContextType | undefined>(undefined);

export const getClassificationForGrouping = (group1?: number, group2?: number): MarksmanshipClassification => {
    if (group1 === undefined || group2 === undefined) return "Unclassified";
    const maxGroup = Math.max(group1, group2);
    if (maxGroup <= 1.5) return "Distinguished Marksman";
    if (maxGroup <= 2.0) return "Expert Marksman";
    if (maxGroup <= 2.5) return "First Class Marksman";
    if (maxGroup <= 3.0) return "Marksman";
    return "Unclassified";
};

export const MarksmanshipProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentYear, currentYearData, updateCurrentYearData, isLoaded } = useTrainingYear();
    const { toast } = useToast();

    const records = currentYearData?.marksmanshipRecords || [];

    const addRecord = useCallback((recordData: Omit<MarksmanshipRecord, 'id'>) => {
        if (!currentYear) {
            toast({ variant: "destructive", title: "No training year selected" });
            return;
        }

        const newRecord: MarksmanshipRecord = {
            ...recordData,
            id: crypto.randomUUID(),
        };

        const updatedRecords = [...records, newRecord];
        updateCurrentYearData({ marksmanshipRecords: updatedRecords });
        toast({ title: "Score Saved", description: "The marksmanship record has been added." });

    }, [records, currentYear, updateCurrentYearData, toast]);

    const value = {
        records,
        addRecord,
        isLoaded,
    };

    return (
        <MarksmanshipContext.Provider value={value}>
            {children}
        </MarksmanshipContext.Provider>
    );
};

export const useMarksmanship = () => {
    const context = useContext(MarksmanshipContext);
    if (context === undefined) {
        throw new Error('useMarksmanship must be used within a MarksmanshipProvider');
    }
    return context;
};
