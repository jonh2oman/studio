
"use client";
import { useAwards } from "@/hooks/use-awards";
import { useCadets } from "@/hooks/use-cadets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";

export function AwardWinnersReport() {
    const { awards, winners, isLoaded: awardsLoaded } = useAwards();
    const { cadets, isLoaded: cadetsLoaded } = useCadets();

    const isLoading = !awardsLoaded || !cadetsLoaded;

    const winnersData = awards
        .map(award => {
            const winnerIds = winners[award.id] || [];
            const currentWinners = winnerIds.map(id => cadets.find(c => c.id === id)).filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined);

            return {
                awardName: award.name,
                awardCategory: award.category,
                winnerName: currentWinners.length > 0
                    ? currentWinners.map(w => `${w.rank} ${w.lastName}, ${w.firstName}`).join('; ')
                    : "Not Assigned"
            }
        })
        .sort((a,b) => a.awardCategory.localeCompare(b.awardCategory) || a.awardName.localeCompare(b.awardName));

    const handlePrint = () => window.print();

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Award Winners Report</CardTitle>
                        <CardDescription>A list of all awards and their assigned winners for the training year.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : awards.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No awards have been configured.</p>
                ) : (
                    <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Award Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Winner(s)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {winnersData.map(data => (
                                <TableRow key={data.awardName}>
                                    <TableCell className="font-medium">{data.awardName}</TableCell>
                                    <TableCell>{data.awardCategory}</TableCell>
                                    <TableCell>{data.winnerName}</TableCell>
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
