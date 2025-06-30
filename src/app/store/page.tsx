"use client";

import { PageHeader } from "@/components/page-header";
import { StoreProvider } from "@/hooks/use-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankManager } from "@/components/store/bank-manager";
import { CanteenPOS } from "@/components/store/canteen-pos";
import { StoreInventory } from "@/components/store/store-inventory";
import { TransactionHistory } from "@/components/store/transaction-history";

export default function StorePage() {
  return (
    <StoreProvider>
      <PageHeader
        title="Cadet Store & Banking"
        description="Manage the corps economy, award Ardent Dollars, and track inventory."
      />
      <Tabs defaultValue="pos" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="pos">Canteen POS</TabsTrigger>
          <TabsTrigger value="bank">Bank Manager</TabsTrigger>
          <TabsTrigger value="inventory">Store Inventory</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        <TabsContent value="pos" className="mt-6">
            <CanteenPOS />
        </TabsContent>
        <TabsContent value="bank" className="mt-6">
            <BankManager />
        </TabsContent>
        <TabsContent value="inventory" className="mt-6">
            <StoreInventory />
        </TabsContent>
         <TabsContent value="history" className="mt-6">
            <TransactionHistory />
        </TabsContent>
      </Tabs>
    </StoreProvider>
  );
}
