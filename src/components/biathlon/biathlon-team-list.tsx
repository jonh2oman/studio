
"use client";

import { useMemo } from 'react';
import { useCadets } from '@/hooks/use-cadets';
import { useTrainingYear } from '@/hooks/use-training-year';
import { getBiathlonCategory } from '@/lib/biathlon-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User } from 'lucide-react';
import { Badge } from '../ui/badge';

export function BiathlonTeamList() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { currentYear, isLoaded: yearLoaded } = useTrainingYear();

    const biathlonTeam = useMemo(() => {
        if (!cadetsLoaded || !yearLoaded || !currentYear) return [];
        return cadets
            .filter(c => c.isBiathlonTeamMember)
            .map(c => ({
                ...c,
                category: c.dateOfBirth ? getBiathlonCategory(c.dateOfBirth, currentYear) : 'N/A'
            }))
            .sort((a,b) => a.lastName.localeCompare(b.lastName));
    }, [cadets, cadetsLoaded, yearLoaded, currentYear]);

    const isLoading = !cadetsLoaded || !yearLoaded;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Biathlon Team Roster</CardTitle>
                <CardDescription>Cadets marked as biathlon team members.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : biathlonTeam.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No cadets marked as biathlon team members.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cadet</TableHead>
                                    <TableHead>Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {biathlonTeam.map(cadet => (
                                    <TableRow key={cadet.id}>
                                        <TableCell className="font-medium">{cadet.rank} {cadet.lastName}, {cadet.firstName}</TableCell>
                                        <TableCell><Badge variant="secondary">{cadet.category}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
