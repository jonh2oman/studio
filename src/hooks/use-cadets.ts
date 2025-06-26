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

    const saveCadets = useCallback((updatedCadets: Cadet[]) => {
        setCadets(updatedCadets);
        try {
            localStorage.setItem('cadetRoster', JSON.stringify(updatedCadets));
        } catch (error) {
            console.error("Failed to save cadets to localStorage", error);
        }
    }, []);
    
    const saveAttendance = useCallback((updatedAttendance: AttendanceState) => {
        setAttendance(updatedAttendance);
        try {
            localStorage.setItem('cadetAttendance', JSON.stringify(updatedAttendance));
        } catch (error) {
            console.error("Failed to save attendance to localStorage", error);
        }
    }, []);

    const addCadet = (cadet: Omit<Cadet, 'id'>) => {
        const newCadet = { ...cadet, id: new Date().toISOString() };
        saveCadets([...cadets, newCadet]);
    };

    const removeCadet = (cadetId: string) => {
        saveCadets(cadets.filter(c => c.id !== cadetId));
    };
    
    const getAttendanceForDate = (date: string): AttendanceRecord[] => {
        return attendance[date] || cadets.map(c => ({
            cadetId: c.id,
            status: 'present',
            arrivedLate: false,
            leftEarly: false
        }));
    };

    const saveAttendanceForDate = (date: string, records: AttendanceRecord[]) => {
        const newAttendance = { ...attendance, [date]: records };
        saveAttendance(newAttendance);
    };


    return { cadets, addCadet, removeCadet, isLoaded, getAttendanceForDate, saveAttendanceForDate };
}
