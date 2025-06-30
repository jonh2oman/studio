
"use client";

import { useCallback } from 'react';
import type { Cadet, AttendanceRecord } from '@/lib/types';
import { useTrainingYear } from './use-training-year';
import { useSettings } from './use-settings';

export function useCadets() {
    const { currentYear, currentYearData, updateCurrentYearData, isLoaded: yearIsLoaded } = useTrainingYear();
    const { settings, saveSettings, isLoaded: settingsIsLoaded } = useSettings();

    const cadets = settings.cadets || [];
    const attendance = currentYearData?.attendance || {};

    const saveCadets = useCallback((updatedCadets: Cadet[]) => {
        saveSettings({ cadets: updatedCadets });
    }, [saveSettings]);

    const addCadet = useCallback((cadet: Omit<Cadet, 'id'>) => {
        const newCadet = { ...cadet, id: crypto.randomUUID() };
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

    const saveAttendanceForDate = useCallback(async (date: string, records: AttendanceRecord[]) => {
        if (!currentYear) return;
        const newAttendance = { ...attendance, [date]: records };
        await updateCurrentYearData({ attendance: newAttendance });
    }, [currentYear, attendance, updateCurrentYearData]);

    const deleteAttendanceForDate = useCallback(async (date: string) => {
        if (!currentYear) return;
        const newAttendance = { ...attendance };
        delete newAttendance[date];
        await updateCurrentYearData({ attendance: newAttendance });
    }, [currentYear, attendance, updateCurrentYearData]);


    return { cadets, addCadet, updateCadet, removeCadet, isLoaded: yearIsLoaded && settingsIsLoaded, getAttendanceForDate, saveAttendanceForDate, deleteAttendanceForDate, attendance };
}
