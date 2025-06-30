
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Award, AwardWinner, TrainingYearData } from '@/lib/types';
import { awardsData as defaultAwards } from '@/lib/awards-data';
import { useTrainingYear } from './use-training-year';
import { useSettings } from './use-settings';

export function useAwards() {
    const { currentYear, currentYearData, updateCurrentYearData } = useTrainingYear();
    const { settings, saveSettings, isLoaded: settingsLoaded } = useSettings();
    const [isLoaded, setIsLoaded] = useState(false);

    const awards = settings.awards || [];
    const winners = currentYearData?.awardWinners || {};
    
    useEffect(() => {
        if (settingsLoaded && currentYearData) {
            if (!settings.awards) {
                 saveSettings({ awards: defaultAwards });
            }
            setIsLoaded(true);
        } else {
            setIsLoaded(false);
        }
    }, [settingsLoaded, currentYearData, settings.awards, saveSettings]);

    const saveAwards = useCallback((updatedAwards: Award[]) => {
        saveSettings({ awards: updatedAwards });
    }, [saveSettings]);

    const saveWinners = useCallback((updatedWinners: AwardWinner) => {
        updateCurrentYearData(prevData => ({ ...prevData, awardWinners: updatedWinners }));
    }, [updateCurrentYearData]);

    const addAward = useCallback((award: Omit<Award, 'id'>) => {
        const newAward = { ...award, id: crypto.randomUUID() };
        const updatedAwards = [...awards, newAward];
        saveAwards(updatedAwards);
    }, [awards, saveAwards]);

    const updateAward = useCallback((updatedAward: Award) => {
        const updatedAwards = awards.map(a => a.id === updatedAward.id ? updatedAward : a);
        saveAwards(updatedAwards);
    }, [awards, saveAwards]);

    const removeAllWinnersForAward = useCallback((awardId: string) => {
        const updatedWinners = { ...winners };
        delete updatedWinners[awardId];
        saveWinners(updatedWinners);
    }, [winners, saveWinners]);

    const removeAward = useCallback((awardId: string) => {
        const updatedAwards = awards.filter(a => a.id !== awardId);
        saveAwards(updatedAwards);
        removeAllWinnersForAward(awardId);
    }, [awards, saveAwards, removeAllWinnersForAward]);
    
    const addWinner = useCallback((awardId: string, cadetId: string) => {
        const award = awards.find(a => a.id === awardId);
        if (!award) return;

        const currentWinners = winners[awardId] || [];
        let newWinnersList: string[];

        if (award.category === 'National') {
            newWinnersList = [cadetId];
        } else {
            if (!currentWinners.includes(cadetId)) {
                newWinnersList = [...currentWinners, cadetId];
            } else {
                newWinnersList = currentWinners;
            }
        }
        
        const updatedWinners = { ...winners, [awardId]: newWinnersList };
        saveWinners(updatedWinners);
    }, [awards, winners, saveWinners]);
    
    const removeWinner = useCallback((awardId: string, cadetId: string) => {
        const currentWinners = winners[awardId] || [];
        const newWinnersList = currentWinners.filter(id => id !== cadetId);
        
        const updatedWinners = { ...winners };
        if (newWinnersList.length > 0) {
            updatedWinners[awardId] = newWinnersList;
        } else {
            delete updatedWinners[awardId];
        }
        saveWinners(updatedWinners);
    }, [winners, saveWinners]);

    const importAwards = useCallback((newAwards: Omit<Award, 'id'>[]) => {
        const existingAwardNames = new Set(awards.map(a => a.name.toLowerCase()));
        
        const uniqueNewAwards = newAwards.filter(
            newAward => !existingAwardNames.has(newAward.name.toLowerCase())
        );

        if (uniqueNewAwards.length > 0) {
            const awardsToSave = uniqueNewAwards.map(award => ({
                ...award,
                id: crypto.randomUUID(),
            }));
            const updatedAwards = [...awards, ...awardsToSave];
            saveAwards(updatedAwards);
        }
        
        return uniqueNewAwards.length;
    }, [awards, saveAwards]);

    return { awards, addAward, updateAward, removeAward, winners, addWinner, removeWinner, isLoaded: isLoaded && !!currentYear, importAwards };
}
