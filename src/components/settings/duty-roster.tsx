
"use client";

import { useMemo } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { useTrainingYear } from '@/hooks/use-training-year';
import { eachDayOfInterval, format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2 } from 'lucide-react';

export function DutyRoster() {
    const { settings, isLoaded: settingsLoaded } = useSettings();
    const { dutySchedule, updateDutySchedule, currentYear, currentYearData, isLoaded: yearLoaded } = useTrainingYear();

    const trainingDays = useMemo(() => {
        if (!currentYear || !currentYearData?.firstTrainingNight) return [];

        const [startYearStr] = currentYear.split('-');
        const startYear = parseInt(startYearStr, 10);
        const endYear = startYear + 1;

        const ty = {
            start: new Date(startYear, 8, 1), // Sept 1
            end: new Date(endYear, 5, 30), // June 30
        };

        const firstNight = new Date(currentYearData.firstTrainingNight.replace(/-/g, '/'));

        return eachDayOfInterval({ start: ty.start, end: ty.end })
            .filter(d => d.getDay() === settings.trainingDay && d >= firstNight);

    }, [currentYear, currentYearData?.firstTrainingNight, settings.trainingDay]);
    
    const officers = useMemo(() => settings.staff.filter(s => s.type === 'Officer'), [settings.staff]);
    const pos = useMemo(() => settings.staff.filter(s => s.type === 'PO/NCM'), [settings.staff]);

    const handleUpdate = (date: string, field: 'dutyOfficerId' | 'dutyPoId' | 'altDutyPoId', value: string) => {
        updateDutySchedule(date, { [field]: value });
    };

    const isLoading = !settingsLoaded || !yearLoaded;

    return (
        <Card className="border">
            <CardHeader>
                <CardTitle>Duty Roster</CardTitle>
                <CardDescription>Assign duty personnel for each parade night of the training year. This will auto-populate the WRO.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : (
                <ScrollArea className="h-96">
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader className="sticky top-0 bg-muted">
                                <TableRow>
                                    <TableHead>Parade Night</TableHead>
                                    <TableHead>Duty Officer</TableHead>
                                    <TableHead>Duty PO</TableHead>
                                    <TableHead>Alternate Duty PO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainingDays.map(day => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const scheduled = dutySchedule[dateStr] || {};
                                    return (
                                        <TableRow key={dateStr}>
                                            <TableCell className="font-medium">{format(day, 'EEE, dd MMM yyyy')}</TableCell>
                                            <TableCell>
                                                <Select value={scheduled.dutyOfficerId || ''} onValueChange={(val) => handleUpdate(dateStr, 'dutyOfficerId', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Select Officer..." /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value=" ">None</SelectItem>
                                                        {officers.map(o => <SelectItem key={o.id} value={o.id}>{o.rank} {o.lastName}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select value={scheduled.dutyPoId || ''} onValueChange={(val) => handleUpdate(dateStr, 'dutyPoId', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Select PO..." /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value=" ">None</SelectItem>
                                                        {pos.map(p => <SelectItem key={p.id} value={p.id}>{p.rank} {p.lastName}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select value={scheduled.altDutyPoId || ''} onValueChange={(val) => handleUpdate(dateStr, 'altDutyPoId', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Select PO..." /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value=" ">None</SelectItem>
                                                        {pos.map(p => <SelectItem key={p.id} value={p.id}>{p.rank} {p.lastName}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
