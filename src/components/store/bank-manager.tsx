"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/hooks/use-store";
import { useCadets } from "@/hooks/use-cadets";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const transactionSchema = z.object({
  cadetId: z.string().min(1, "Please select a cadet."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  reason: z.string().min(1, "A reason is required."),
  type: z.enum(["credit", "debit"]),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function BankManager() {
  const { cadets, isLoaded: cadetsLoaded } = useCadets();
  const { transactions, addTransaction, isLoaded: storeLoaded } = useStore();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "credit", reason: "" },
  });

  const cadetBalances = useMemo(() => {
    const balances: Record<string, number> = {};
    cadets.forEach(c => balances[c.id] = 0);
    transactions.forEach(t => {
      if (balances[t.cadetId] !== undefined) {
        balances[t.cadetId] += t.amount;
      }
    });
    return balances;
  }, [cadets, transactions]);

  const sortedCadetsWithBalance = useMemo(() => {
    return cadets
      .map(c => ({ ...c, balance: cadetBalances[c.id] || 0 }))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [cadets, cadetBalances]);
  
  const onSubmit = (data: TransactionFormData) => {
    const finalAmount = data.type === 'credit' ? data.amount : -data.amount;
    addTransaction(data.cadetId, finalAmount, data.reason);
    form.reset({
      ...form.getValues(),
      amount: undefined,
      reason: "",
    });
  };
  
  const isLoading = !cadetsLoaded || !storeLoaded;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>New Transaction</CardTitle>
            <CardDescription>Credit or debit Ardent Dollars for a cadet.</CardDescription>
          </CardHeader>
          <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   <FormField control={form.control} name="cadetId" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Cadet</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a cadet..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {sortedCadetsWithBalance.map(c => (<SelectItem key={c.id} value={c.id}>{c.lastName}, {c.firstName}</SelectItem>))}
                            </SelectContent>
                        </Select><FormMessage />
                     </FormItem>
                   )} />
                   <Controller name="type" control={form.control} render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-4">
                           <Label className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary"><RadioGroupItem value="credit" className="mr-2" /> Credit</Label>
                           <Label className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary"><RadioGroupItem value="debit" className="mr-2"/> Debit</Label>
                        </RadioGroup>
                   )}/>
                   <FormField control={form.control} name="amount" render={({ field }) => (
                     <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
                   )} />
                   <FormField control={form.control} name="reason" render={({ field }) => (
                     <FormItem><FormLabel>Reason / Note</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                   )} />
                   <Button type="submit" className="w-full">Process Transaction</Button>
                </form>
             </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Cadet Balances</CardTitle>
            <CardDescription>Current Ardent Dollar balances for all cadets.</CardDescription>
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
                                    <TableHead>Cadet</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedCadetsWithBalance.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.rank} {c.lastName}, {c.firstName}</TableCell>
                                        <TableCell className="text-right font-mono font-semibold">${c.balance.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}