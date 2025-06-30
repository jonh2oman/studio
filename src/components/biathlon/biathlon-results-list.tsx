
"use client";

import { useMemo } from 'react';
import { useBiathlon } from '@/hooks/use-biathlon';
import { useCadets } from '@/hooks/use-cadets';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


export function BiathlonResultsList() {
    const { results, removeResult, isLoaded: biathlonLoaded } = useBiathlon();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();

    const isLoading = !biathlonLoaded || !cadetsLoaded;

    const resultsWithCadetNames = useMemo(() => {
        if (isLoading) return [];
        return results.map(result => {
            const cadet = cadets.find(c => c.id === result.cadetId);
            return {
                ...result,
                cadetName: cadet ? `${cadet.lastName}, ${cadet.firstName}` : 'Unknown Cadet'
            };
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [results, cadets, isLoading]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Biathlon Competition Results</CardTitle>
                <CardDescription>A log of all recorded competition results for the team.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : results.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No biathlon results have been logged yet.</p>
                ) : (
                    <div className="border rounded-lg max-h-[70vh] overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                                <TableRow>
                                    <TableHead>Competition</TableHead>
                                    <TableHead>Cadet</TableHead>
                                    <TableHead>Race Type</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resultsWithCadetNames.map(result => (
                                    <TableRow key={result.id}>
                                        <TableCell>
                                            <p className="font-medium">{result.competitionName}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(result.date.replace(/-/g, '/')), "dd MMM yyyy")}</p>
                                        </TableCell>
                                        <TableCell>{result.cadetName}</TableCell>
                                        <TableCell><Badge variant="outline">{result.raceType}</Badge></TableCell>
                                        <TableCell className="font-mono">{result.skiTime}</TableCell>
                                        <TableCell>{result.finalRank || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This action will permanently delete this result log and cannot be undone.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction variant="destructive" onClick={() => removeResult(result.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
