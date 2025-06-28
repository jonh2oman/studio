
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/hooks/use-settings";
import type { Asset } from "@/lib/types";
import { AddAssetForm } from "@/components/corps-management/add-asset-form";
import { AssetTracker } from "@/components/corps-management/asset-tracker";
import { EditAssetDialog } from "@/components/corps-management/edit-asset-dialog";
import { useToast } from "@/hooks/use-toast";
import { AssetCategoryManager } from "@/components/corps-management/asset-category-manager";

export default function CorpsManagementPage() {
  const { settings, saveSettings, isLoaded } = useSettings();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const { toast } = useToast();

  const handleAddAsset = (asset: Omit<Asset, 'id' | 'assetId'>) => {
    const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
    const newAsset = { 
      ...asset, 
      id: crypto.randomUUID(),
      assetId: `288-ID-${randomPart}` 
    };
    const updatedAssets = [...(settings.assets || []), newAsset];
    saveSettings({ ...settings, assets: updatedAssets });
    toast({ title: "Asset Added", description: `${newAsset.name} has been added to the tracker.` });
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
    const updatedAssets = (settings.assets || []).map(a => a.id === updatedAsset.id ? updatedAsset : a);
    saveSettings({ ...settings, assets: updatedAssets });
    setEditingAsset(null);
    toast({ title: "Asset Updated", description: `${updatedAsset.name} has been updated.` });
  };

  const handleRemoveAsset = (assetId: string) => {
    const assetToRemove = (settings.assets || []).find(a => a.id === assetId);
    const updatedAssets = (settings.assets || []).filter(a => a.id !== assetId);
    saveSettings({ ...settings, assets: updatedAssets });
    toast({ variant: "destructive", title: "Asset Removed", description: `${assetToRemove?.name} has been removed.` });
  };

  return (
    <>
      <PageHeader
        title="Corps Asset Management"
        description="Track and manage all corps-owned assets."
      />
      <div className="mt-6 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <AddAssetForm onAddAsset={handleAddAsset} />
            <AssetCategoryManager />
        </div>
        <div className="lg:col-span-2">
            <AssetTracker
              assets={settings.assets || []}
              isLoaded={isLoaded}
              onEditAsset={setEditingAsset}
              onRemoveAsset={handleRemoveAsset}
            />
        </div>
      </div>
      {editingAsset && (
        <EditAssetDialog
          asset={editingAsset}
          onUpdateAsset={handleUpdateAsset}
          onOpenChange={(isOpen) => !isOpen && setEditingAsset(null)}
        />
      )}
    </>
  );
}
