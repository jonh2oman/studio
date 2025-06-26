
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Cadet, AttendanceState, AttendanceRecord } from '@/lib/types';

const defaultCadets: Cadet[] = [];
const defaultAttendance: AttendanceState = {};

export function useCadets() {
    const [cadets, setCadets] = useState<Cadet[]>(defaultCadets);
    const [attendance, setAttendance] = useState<AttendanceState>(defaultAttendance);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedCadets = localStorage.getItem('cadetRoster');
            if (storedCadets) {
                setCadets(JSON.parse(storedCadets));
            }
            const storedAttendance = localStorage.getItem('cadetAttendance');
            if (storedAttendance) {
                setAttendance(JSON.parse(storedAttendance));
            }
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addCadet = useCallback((cadet: Omit<Cadet, 'id'>) => {
        const newCadet = { ...cadet, id: new Date().toISOString() };
        setCadets(prevCadets => {
            const updatedCadets = [...prevCadets, newCadet];
            try {
                localStorage.setItem('cadetRoster', JSON.stringify(updatedCadets));
            } catch (error) {
                console.error("Failed to save cadets to localStorage", error);
            }
            return updatedCadets;
        });
    }, []);

    const updateCadet = useCallback((updatedCadet: Cadet) => {
        setCadets(prevCadets => {
            const updatedCadets = prevCadets.map(c => c.id === updatedCadet.id ? updatedCadet : c);
             try {
                localStorage.setItem('cadetRoster', JSON.stringify(updatedCadets));
            } catch (error) {
                console.error("Failed to save cadets to localStorage", error);
            }
            return updatedCadets;
        });
    }, []);

    const removeCadet = useCallback((cadetId: string) => {
        setCadets(prevCadets => {
            const updatedCadets = prevCadets.filter(c => c.id !== cadetId);
            try {
                localStorage.setItem('cadetRoster', JSON.stringify(updatedCadets));
            } catch (error) {
                console.error("Failed to save cadets to localStorage", error);
            }
            return updatedCadets;
        });
    }, []);
    
    const getAttendanceForDate = useCallback((date: string): AttendanceRecord[] => {
        return attendance[date] || cadets.map(c => ({
            cadetId: c.id,
            status: 'present',
            arrivedLate: false,
            leftEarly: false
        }));
    }, [attendance, cadets]);

    const saveAttendanceForDate = useCallback((date: string, records: AttendanceRecord[]) => {
        setAttendance(prevAttendance => {
            const newAttendance = { ...prevAttendance, [date]: records };
            try {
                localStorage.setItem('cadetAttendance', JSON.stringify(newAttendance));
            } catch (error) {
                console.error("Failed to save attendance to localStorage", error);
            }
            return newAttendance;
        });
    }, []);


    return { cadets, addCadet, updateCadet, removeCadet, isLoaded, getAttendanceForDate, saveAttendanceForDate };
}
