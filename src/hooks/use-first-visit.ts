
"use client";

import { useState, useEffect } from 'react';

const VISIT_KEY = 'rcc288-has-visited-before';

export function useFirstVisit() {
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // This check ensures localStorage is only accessed on the client-side
        if (typeof window !== 'undefined') {
            try {
                const hasVisited = localStorage.getItem(VISIT_KEY);
                if (!hasVisited) {
                    setIsFirstVisit(true);
                }
            } catch (error) {
                console.error("Could not access localStorage", error);
            } finally {
                setIsChecking(false);
            }
        }
    }, []);

    const markAsVisited = () => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(VISIT_KEY, 'true');
                setIsFirstVisit(false);
            } catch (error) {
                console.error("Could not access localStorage", error);
            }
        }
    };

    return { isFirstVisit, isChecking, markAsVisited };
}
