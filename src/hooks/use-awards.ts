
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AwardWinner } from '@/lib/types';

const defaultWinners: AwardWinner = {};

export function useAwards() {
    const [winners, setWinners] = useState<AwardWinner>(defaultWinners);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedWinners = localStorage.getItem('awardWinners');
            if (storedWinners) {
                setWinners(JSON.parse(storedWinners));
            }
        } catch (error) {
            console.error("Failed to parse award winners from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const setWinner = useCallback((awardId: string, cadetId: string) => {
        setWinners(prevWinners => {
            const updatedWinners = { ...prevWinners, [awardId]: cadetId };
            try {
                localStorage.setItem('awardWinners', JSON.stringify(updatedWinners));
            } catch (error) {
                console.error("Failed to save award winners to localStorage", error);
            }
            return updatedWinners;
        });
    }, []);
    
    const removeWinner = useCallback((awardId: string) => {
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

    return { winners, setWinner, removeWinner, isLoaded };
}
