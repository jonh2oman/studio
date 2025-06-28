
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/hooks/use-settings";
import type { LsaWishListItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AddLsaItemForm } from "@/components/corps-management/lsa/add-lsa-item-form";
import { LsaItemList } from "@/components/corps-management/lsa/lsa-item-list";
import { EditLsaItemDialog } from "@/components/corps-management/lsa/edit-lsa-item-dialog";

export default function LsaWishListPage() {
  const { settings, saveSettings, isLoaded } = useSettings();
  const [editingItem, setEditingItem] = useState<LsaWishListItem | null>(null);
  const { toast } = useToast();

  const handleAddItem = (item: Omit<LsaWishListItem, 'id'>) => {
    const newItem: LsaWishListItem = { ...item, id: crypto.randomUUID() };
    const updatedList = [...(settings.lsaWishList || []), newItem];
    saveSettings({ lsaWishList: updatedList });
    toast({ title: "Item Added", description: `"${newItem.name}" has been added to the wish list.` });
  };

  const handleUpdateItem = (updatedItem: LsaWishListItem) => {
    const updatedList = (settings.lsaWishList || []).map(item => item.id === updatedItem.id ? updatedItem : item);
    saveSettings({ lsaWishList: updatedList });
    setEditingItem(null);
    toast({ title: "Item Updated", description: `"${updatedItem.name}" has been updated.` });
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = (settings.lsaWishList || []).find(item => item.id === itemId);
    const updatedList = (settings.lsaWishList || []).filter(item => item.id !== itemId);
    saveSettings({ lsaWishList: updatedList });
    toast({ variant: "destructive", title: "Item Removed", description: `"${itemToRemove?.name}" has been removed from the wish list.` });
  };

  return (
    <>
      <PageHeader
        title="LSA Wish List"
        description="Create and manage your annual Local Support Allocation (LSA) request list."
      />
      <div className="mt-6 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddLsaItemForm onAddItem={handleAddItem} />
        </div>
        <div className="lg:col-span-2">
          <LsaItemList
            items={settings.lsaWishList || []}
            isLoaded={isLoaded}
            onEditItem={setEditingItem}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
      
      {editingItem && (
        <EditLsaItemDialog
          item={editingItem}
          onUpdateItem={handleUpdateItem}
          onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}
        />
      )}
    </>
  );
}
