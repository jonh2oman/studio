
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Award, AwardWinner } from '@/lib/types';
import { awardsData as defaultAwards } from '@/lib/awards-data';
import { useTrainingYear } from './use-training-year';

export function useAwards() {
    const { currentYear } = useTrainingYear();
    const [awards, setAwards] = useState<Award[]>([]);
    const [winners, setWinners] = useState<AwardWinner>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!currentYear) {
            setWinners({});
            setIsLoaded(false);
            return;
        };

        setIsLoaded(false);
        try {
            // Awards definitions are global
            const storedAwards = localStorage.getItem('awardsList');
            if (storedAwards) {
                setAwards(JSON.parse(storedAwards));
            } else {
                setAwards(defaultAwards);
                localStorage.setItem('awardsList', JSON.stringify(defaultAwards));
            }

            // Award winners are year-specific
            const winnersKey = `${currentYear}_awardWinners`;
            const storedWinners = localStorage.getItem(winnersKey);
            if (storedWinners) {
                setWinners(JSON.parse(storedWinners));
            } else {
                setWinners({});
            }
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            setAwards(defaultAwards);
            setWinners({});
        } finally {
            setIsLoaded(true);
        }
    }, [currentYear]);

    const saveAwards = useCallback((updatedAwards: Award[]) => {
        try {
            localStorage.setItem('awardsList', JSON.stringify(updatedAwards));
            setAwards(updatedAwards);
        } catch (error) {
            console.error("Failed to save awards to localStorage", error);
        }
    }, []);

    const saveWinners = useCallback((updatedWinners: AwardWinner) => {
        if (!currentYear) return;
        try {
            const winnersKey = `${currentYear}_awardWinners`;
            localStorage.setItem(winnersKey, JSON.stringify(updatedWinners));
            setWinners(updatedWinners);
        } catch (error) {
            console.error("Failed to save award winners to localStorage", error);
        }
    }, [currentYear]);

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

    return { awards, addAward, updateAward, removeAward, winners, addWinner, removeWinner, isLoaded: isLoaded && !!currentYear };
}
