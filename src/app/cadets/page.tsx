
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AddCadetForm } from "@/components/cadets/add-cadet-form";
import { CadetList } from "@/components/cadets/cadet-list";
import { useCadets } from "@/hooks/use-cadets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCadetDialog } from "@/components/cadets/edit-cadet-dialog";
import type { Cadet } from "@/lib/types";

export default function CadetsPage() {
  const { cadets, addCadet, updateCadet, removeCadet, isLoaded } = useCadets();
  const [editingCadet, setEditingCadet] = useState<Cadet | null>(null);

  const handleEdit = (cadet: Cadet) => {
    setEditingCadet(cadet);
  };

  const handleUpdateCadet = (updatedCadet: Cadet) => {
    updateCadet(updatedCadet);
    setEditingCadet(null);
  }

  return (
    <>
      <PageHeader
        title="Cadet Management"
        description="Add, view, and manage your corps' cadet roster."
      />
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <AddCadetForm onAddCadet={addCadet} />
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Cadet Roster</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoaded ? (
                        <CadetList 
                            cadets={cadets} 
                            onRemoveCadet={removeCadet} 
                            onEditCadet={handleEdit}
                        />
                    ) : (
                        <p>Loading cadets...</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
       {editingCadet && (
        <EditCadetDialog
            cadet={editingCadet}
            onUpdateCadet={handleUpdateCadet}
            onOpenChange={(isOpen) => !isOpen && setEditingCadet(null)}
        />
      )}
    </>
  );
}
