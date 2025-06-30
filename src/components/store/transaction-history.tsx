"use client";

import { useMemo } from "react";
import { useStore } from "@/hooks/use-store";
import { useCadets } from "@/hooks/use-cadets";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export function TransactionHistory() {
  const { cadets, isLoaded: cadetsLoaded } = useCadets();
  const { staff, isLoaded: settingsLoaded } = useSettings();
  const { transactions, isLoaded: storeLoaded } = useStore();

  const transactionDetails = useMemo(() => {
    return transactions.map(t => {
      const cadet = cadets.find(c => c.id === t.cadetId);
      const staffMember = staff.find(s => s.email === t.staffId); // Assuming staffId is user email for now
      return {
        ...t,
        cadetName: cadet ? `${cadet.rank} ${cadet.lastName}` : 'Unknown Cadet',
        staffName: staffMember ? `${staffMember.rank} ${staffMember.lastName}` : t.staffId,
      };
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, cadets, staff]);
  
  const isLoading = !cadetsLoaded || !storeLoaded || !settingsLoaded;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A complete log of all Ardent Dollar transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
             <ScrollArea className="h-96">
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Cadet</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Authorized By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionDetails.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No transactions recorded yet.</TableCell></TableRow>}
                            {transactionDetails.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell>{format(new Date(t.timestamp), 'dd MMM yyyy, HH:mm')}</TableCell>
                                    <TableCell>{t.cadetName}</TableCell>
                                    <TableCell className={cn("font-mono font-semibold", t.amount > 0 ? "text-green-600" : "text-destructive")}>
                                        {t.amount > 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}` }
                                    </TableCell>
                                    <TableCell>{t.reason}</TableCell>
                                    <TableCell>{t.staffName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
