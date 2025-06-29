
'use client';

import { useCallback } from 'react';
import { useSettings } from './use-settings';
import type { ZtoReviewedPlan, TrainingYearData } from '@/lib/types';
import { useToast } from './use-toast';

export function useZtoPortal() {
    const { ztoReviewedPlans, saveZtoReviewedPlans, isLoaded } = useSettings();
    const { toast } = useToast();

    const addPlan = useCallback((corpsName: string, planData: TrainingYearData) => {
        if (!corpsName.trim()) {
            toast({ variant: 'destructive', title: 'Corps Name Required' });
            return;
        }

        const yearStartDate = new Date(planData.firstTrainingNight.replace(/-/g, '/'));
        const year = yearStartDate.getMonth() >= 8 ? yearStartDate.getFullYear() : yearStartDate.getFullYear() - 1;
        const trainingYearString = `${year}-${year + 1}`;

        const newPlan: ZtoReviewedPlan = {
            id: crypto.randomUUID(),
            corpsName,
            trainingYear: trainingYearString,
            planData,
            element: planData.element || 'Sea', // Fallback for older files
        };

        const updatedPlans = [...ztoReviewedPlans, newPlan];
        saveZtoReviewedPlans(updatedPlans);
        toast({ title: "Plan Imported", description: `Successfully imported plan for ${corpsName}.` });
    }, [ztoReviewedPlans, saveZtoReviewedPlans, toast]);

    const removePlan = useCallback((id: string) => {
        const planToRemove = ztoReviewedPlans.find(p => p.id === id);
        const updatedPlans = ztoReviewedPlans.filter(p => p.id !== id);
        saveZtoReviewedPlans(updatedPlans);
        toast({ title: 'Plan Removed', description: `Removed plan for ${planToRemove?.corpsName}.`, variant: 'destructive'});
    }, [ztoReviewedPlans, saveZtoReviewedPlans, toast]);

    return {
        isLoaded,
        reviewedPlans: ztoReviewedPlans,
        addPlan,
        removePlan,
    };
}
