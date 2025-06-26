"use client";

import { PageHeader } from "@/components/page-header";
import { AddCadetForm } from "@/components/cadets/add-cadet-form";
import { CadetList } from "@/components/cadets/cadet-list";
import { useCadets } from "@/hooks/use-cadets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CadetsPage() {
  const { cadets, addCadet, removeCadet, isLoaded } = useCadets();

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
                        <CadetList cadets={cadets} onRemoveCadet={removeCadet} />
                    ) : (
                        <p>Loading cadets...</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
