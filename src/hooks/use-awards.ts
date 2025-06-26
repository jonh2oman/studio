
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Award, AwardWinner } from '@/lib/types';
import { awardsData as defaultAwards } from '@/lib/awards-data';

export function useAwards() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [winners, setWinners] = useState<AwardWinner>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedAwards = localStorage.getItem('awardsList');
            if (storedAwards) {
                setAwards(JSON.parse(storedAwards));
            } else {
                setAwards(defaultAwards);
                localStorage.setItem('awardsList', JSON.stringify(defaultAwards));
            }

            const storedWinners = localStorage.getItem('awardWinners');
            if (storedWinners) {
                setWinners(JSON.parse(storedWinners));
            }
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            // Fallback to defaults if parsing fails
            setAwards(defaultAwards);
            setWinners({});
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addAward = useCallback((award: Omit<Award, 'id'>) => {
        const newAward = { ...award, id: crypto.randomUUID() };
        setAwards(prevAwards => {
            const updatedAwards = [...prevAwards, newAward];
            try {
                localStorage.setItem('awardsList', JSON.stringify(updatedAwards));
            } catch (error) {
                console.error("Failed to save awards to localStorage", error);
            }
            return updatedAwards;
        });
    }, []);

    const updateAward = useCallback((updatedAward: Award) => {
        setAwards(prevAwards => {
            const updatedAwards = prevAwards.map(a => a.id === updatedAward.id ? updatedAward : a);
            try {
                localStorage.setItem('awardsList', JSON.stringify(updatedAwards));
            } catch (error) {
                console.error("Failed to save awards to localStorage", error);
            }
            return updatedAwards;
        });
    }, []);

    const removeAllWinnersForAward = useCallback((awardId: string) => {
        setWinners(prevWinners => {
            const updatedWinners = { ...prevWinners };
            delete updatedWinners[awardId];
             try {
                localStorage.setItem('awardWinners', JSON.stringify(updatedWinners));
            } catch (error) {
                console.error("Failed to save award winners to localStorage", error);
            }
            return updatedWinners;
        });
    }, []);

    const removeAward = useCallback((awardId: string) => {
        setAwards(prevAwards => {
            const updatedAwards = prevAwards.filter(a => a.id !== awardId);
            try {
                localStorage.setItem('awardsList', JSON.stringify(updatedAwards));
                removeAllWinnersForAward(awardId);
            } catch (error) {
                console.error("Failed to save awards to localStorage", error);
            }
            return updatedAwards;
        });
    }, [removeAllWinnersForAward]);

    const addWinner = useCallback((awardId: string, cadetId: string) => {
        setWinners(prevWinners => {
            const award = awards.find(a => a.id === awardId);
            if (!award) return prevWinners;

            const currentWinners = prevWinners[awardId] || [];
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
            
            const updatedWinners = { ...prevWinners, [awardId]: newWinnersList };
            try {
                localStorage.setItem('awardWinners', JSON.stringify(updatedWinners));
            } catch (error) {
                console.error("Failed to save award winners to localStorage", error);
            }
            return updatedWinners;
        });
    }, [awards]);
    
    const removeWinner = useCallback((awardId: string, cadetId: string) => {
        setWinners(prevWinners => {
            const currentWinners = prevWinners[awardId] || [];
            const newWinnersList = currentWinners.filter(id => id !== cadetId);
            
            const updatedWinners = { ...prevWinners };
            if (newWinnersList.length > 0) {
                updatedWinners[awardId] = newWinnersList;
            } else {
                delete updatedWinners[awardId];
            }

            try {
                localStorage.setItem('awardWinners', JSON.stringify(updatedWinners));
            } catch (error) {
                console.error("Failed to save award winners to localStorage", error);
            }
            return updatedWinners;
        });
    }, []);

    return { awards, addAward, updateAward, removeAward, winners, addWinner, removeWinner, isLoaded };
}
