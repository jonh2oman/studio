"use client";

import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/hooks/use-settings";
import { useCadets } from "@/hooks/use-cadets";
import type { UniformItem, IssuedUniformItem, Cadet } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { UniformInventoryList } from "@/components/corps-management/uniforms/uniform-inventory-list";
import { UniformItemDialog } from "@/components/corps-management/uniforms/uniform-item-dialog";
import { UniformCategoryManager } from "@/components/corps-management/uniforms/uniform-category-manager";
import { UniformIssueForm } from "@/components/corps-management/uniforms/uniform-issue-form";
import { IssuedList } from "@/components/corps-management/uniforms/issued-list";
import { PrintableUniformLoanCard } from "@/components/corps-management/uniforms/printable-uniform-loan-card";

// New state structure for printing
interface ItemToPrint {
  cadet: Cadet;
  issuedItemsWithData: { issuedItem: IssuedUniformItem; uniformItem: UniformItem }[];
}


export default function UniformSupplyPage() {
  const { settings, saveSettings, isLoaded } = useSettings();
  const { cadets, isLoaded: cadetsLoaded } = useCadets();
  const { toast } = useToast();
  
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UniformItem | null>(null);
  const [itemToPrint, setItemToPrint] = useState<ItemToPrint | null>(null); // Updated state
  const pdfRef = useRef<HTMLDivElement>(null);

  const inventory = settings.uniformInventory || [];
  const issuedItems = settings.issuedUniforms || [];

  const handleOpenItemDialog = (item: UniformItem | null) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  };
  
  const handleSaveItem = useCallback((itemData: Omit<UniformItem, "id"> | UniformItem) => {
    let updatedInventory: UniformItem[];
    if ("id" in itemData) {
      updatedInventory = inventory.map(i => i.id === itemData.id ? itemData : i);
      toast({ title: "Item Updated" });
    } else {
      const newItem = { ...itemData, id: crypto.randomUUID() };
      updatedInventory = [...inventory, newItem];
      toast({ title: "Item Added", description: `"${newItem.name}" added to inventory.` });
    }
    saveSettings({ uniformInventory: updatedInventory });
    setIsItemDialogOpen(false);
    setEditingItem(null);
  }, [inventory, saveSettings, toast]);

  const handleRemoveItem = useCallback((itemId: string) => {
    if (issuedItems.some(i => i.uniformItemId === itemId)) {
        toast({ variant: 'destructive', title: "Cannot Delete", description: "This item is currently issued to one or more cadets." });
        return;
    }
    const updatedInventory = inventory.filter(i => i.id !== itemId);
    saveSettings({ uniformInventory: updatedInventory });
    toast({ title: "Item Removed", variant: 'destructive' });
  }, [inventory, issuedItems, saveSettings, toast]);

  const handleIssueItem = useCallback((cadetId: string, uniformItemId: string) => {
    const itemToIssue = inventory.find(i => i.id === uniformItemId);
    if (!itemToIssue || itemToIssue.quantity < 1) {
        toast({ variant: 'destructive', title: "Issue Failed", description: "Item is out of stock." });
        return;
    }

    const newIssuedItem: IssuedUniformItem = {
        id: crypto.randomUUID(),
        cadetId,
        uniformItemId,
        issueDate: format(new Date(), "yyyy-MM-dd"),
    };

    const updatedIssuedItems = [...issuedItems, newIssuedItem];
    const updatedInventory = inventory.map(i => i.id === uniformItemId ? { ...i, quantity: i.quantity - 1 } : i);
    
    saveSettings({ uniformInventory: updatedInventory, issuedUniforms: updatedIssuedItems });
    toast({ title: "Item Issued", description: `"${itemToIssue.name}" issued.`});

  }, [inventory, issuedItems, saveSettings, toast]);
  
  const handleReturnItem = useCallback((issuedItemId: string) => {
     const itemToReturn = issuedItems.find(i => i.id === issuedItemId);
     if (!itemToReturn) return;

     const originalItem = inventory.find(i => i.id === itemToReturn.uniformItemId);

     const updatedInventory = inventory.map(i => 
        i.id === itemToReturn.uniformItemId ? { ...i, quantity: i.quantity + 1 } : i
     );
     const updatedIssuedItems = issuedItems.filter(i => i.id !== issuedItemId);

     saveSettings({ uniformInventory: updatedInventory, issuedUniforms: updatedIssuedItems });
     toast({ title: "Item Returned", description: `"${originalItem?.name || 'Item'}" returned to stock.` });

  }, [inventory, issuedItems, saveSettings, toast]);
  
  const generatePdf = useCallback(() => {
    const input = pdfRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', [127, 203]); // 5x8 inches
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Uniform-Card-${itemToPrint?.cadet.lastName}-${new Date().toISOString().split('T')[0]}.pdf`);
        setItemToPrint(null);
    });
  }, [itemToPrint]);

  const handlePrintLoanCard = useCallback((issuedItem: IssuedUniformItem, cadet: Cadet, uniformItem: UniformItem) => {
    setItemToPrint({
      cadet,
      issuedItemsWithData: [{ issuedItem, uniformItem }],
    });

    setTimeout(() => generatePdf(), 100);
  }, [generatePdf]);
  
  const handlePrintAllForCadet = useCallback((cadetId: string) => {
    const cadet = cadets.find(c => c.id === cadetId);
    if (!cadet) return;
    
    const cadetIssuedItems = issuedItems.filter(item => item.cadetId === cadetId);
    const issuedItemsWithData = cadetIssuedItems.map(issuedItem => {
        const uniformItem = inventory.find(inv => inv.id === issuedItem.uniformItemId);
        return uniformItem ? { issuedItem, uniformItem } : null;
    }).filter((item): item is { issuedItem: IssuedUniformItem; uniformItem: UniformItem } => item !== null);

    if (issuedItemsWithData.length === 0) {
      toast({ title: "No items to print." });
      return;
    }

    setItemToPrint({
      cadet,
      issuedItemsWithData,
    });
    
    setTimeout(() => generatePdf(), 100);
  }, [cadets, issuedItems, inventory, generatePdf, toast]);

  return (
    <>
      <PageHeader
        title="Uniform Supply"
        description="Manage uniform inventory and track items issued to cadets."
      />
      
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <UniformIssueForm 
                cadets={cadets}
                inventory={inventory}
                onIssue={handleIssueItem}
                isLoaded={isLoaded && cadetsLoaded}
            />
            <IssuedList
                issuedItems={issuedItems}
                inventory={inventory}
                cadets={cadets}
                onReturn={handleReturnItem}
                onPrintLoanCard={handlePrintLoanCard}
                onPrintAllForCadet={handlePrintAllForCadet}
                isLoaded={isLoaded && cadetsLoaded}
            />
        </div>
        <div className="lg:col-span-2 space-y-8">
            <UniformInventoryList
                inventory={inventory}
                onEdit={handleOpenItemDialog}
                onDelete={handleRemoveItem}
                onAddNew={() => handleOpenItemDialog(null)}
                isLoaded={isLoaded}
            />
            <UniformCategoryManager />
        </div>
      </div>
      
      {isItemDialogOpen && (
        <UniformItemDialog
          item={editingItem}
          onSave={handleSaveItem}
          onOpenChange={setIsItemDialogOpen}
        />
      )}

      <div className="absolute -top-[9999px] -left-[9999px]">
        {itemToPrint && (
            <PrintableUniformLoanCard 
                ref={pdfRef}
                cadet={itemToPrint.cadet}
                issuedItemsWithData={itemToPrint.issuedItemsWithData}
                corpsName={settings.corpsName}
                corpsLogo={settings.corpsLogo}
            />
        )}
      </div>
    </>
  );
}
