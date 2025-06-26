
"use client";
import { useCadets } from "@/hooks/use-cadets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";

export function CadetRosterReport() {
    const { cadets, isLoaded } = useCadets();
    
    const handlePrint = () => {
        window.print();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Cadet Roster Report</CardTitle>
                        <CardDescription>A complete list of all cadets in the corps.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
                </div>
            </CardHeader>
            <CardContent>
                {!isLoaded ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : cadets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No cadets in the roster.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Last Name</TableHead>
                                    <TableHead>First Name</TableHead>
                                    <TableHead>Phase</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(cadet => (
                                    <TableRow key={cadet.id}>
                                        <TableCell>{cadet.rank}</TableCell>
                                        <TableCell>{cadet.lastName}</TableCell>
                                        <TableCell>{cadet.firstName}</TableCell>
                                        <TableCell>Phase {cadet.phase}</TableCell>
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
