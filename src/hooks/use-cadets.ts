
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Cadet, AttendanceState, AttendanceRecord } from '@/lib/types';
import { useTrainingYear } from './use-training-year';

const defaultCadets: Cadet[] = [];
const defaultAttendance: AttendanceState = {};

export function useCadets() {
    const { currentYear } = useTrainingYear();
    const [cadets, setCadets] = useState<Cadet[]>(defaultCadets);
    const [attendance, setAttendance] = useState<AttendanceState>(defaultAttendance);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!currentYear) {
            setCadets(defaultCadets);
            setAttendance(defaultAttendance);
            setIsLoaded(false);
            return;
        }

        setIsLoaded(false);
        try {
            const cadetsKey = `${currentYear}_cadetRoster`;
            const attendanceKey = `${currentYear}_cadetAttendance`;
            
            const storedCadets = localStorage.getItem(cadetsKey);
            setCadets(storedCadets ? JSON.parse(storedCadets) : defaultCadets);
            
            const storedAttendance = localStorage.getItem(attendanceKey);
            setAttendance(storedAttendance ? JSON.parse(storedAttendance) : defaultAttendance);

        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            setCadets(defaultCadets);
            setAttendance(defaultAttendance);
        } finally {
            setIsLoaded(true);
        }
    }, [currentYear]);

    const saveCadets = useCallback((updatedCadets: Cadet[]) => {
        if (!currentYear) return;
        try {
            const cadetsKey = `${currentYear}_cadetRoster`;
            localStorage.setItem(cadetsKey, JSON.stringify(updatedCadets));
            setCadets(updatedCadets);
        } catch (error) {
            console.error("Failed to save cadets to localStorage", error);
        }
    }, [currentYear]);

    const addCadet = useCallback((cadet: Omit<Cadet, 'id'>) => {
        const newCadet = { ...cadet, id: new Date().toISOString() };
        const updatedCadets = [...cadets, newCadet];
        saveCadets(updatedCadets);
    }, [cadets, saveCadets]);

    const updateCadet = useCallback((updatedCadet: Cadet) => {
        const updatedCadets = cadets.map(c => c.id === updatedCadet.id ? updatedCadet : c);
        saveCadets(updatedCadets);
    }, [cadets, saveCadets]);

    const removeCadet = useCallback((cadetId: string) => {
        const updatedCadets = cadets.filter(c => c.id !== cadetId);
        saveCadets(updatedCadets);
    }, [cadets, saveCadets]);
    
    const getAttendanceForDate = useCallback((date: string): AttendanceRecord[] => {
        return attendance[date] || cadets.map(c => ({
            cadetId: c.id,
            status: 'present',
            arrivedLate: false,
            leftEarly: false
        }));
    }, [attendance, cadets]);

    const saveAttendanceForDate = useCallback((date: string, records: AttendanceRecord[]) => {
        if (!currentYear) return;
        const newAttendance = { ...attendance, [date]: records };
        try {
            const attendanceKey = `${currentYear}_cadetAttendance`;
            localStorage.setItem(attendanceKey, JSON.stringify(newAttendance));
            setAttendance(newAttendance);
        } catch (error) {
            console.error("Failed to save attendance to localStorage", error);
        }
    }, [currentYear, attendance]);


    return { cadets, addCadet, updateCadet, removeCadet, isLoaded: isLoaded && !!currentYear, getAttendanceForDate, saveAttendanceForDate, attendance };
}
