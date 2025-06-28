
"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { AddCadetForm } from "@/components/cadets/add-cadet-form";
import { CadetList } from "@/components/cadets/cadet-list";
import { useCadets } from "@/hooks/use-cadets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EditCadetDialog } from "@/components/cadets/edit-cadet-dialog";
import type { Cadet } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from "react";

function SortableSubCard({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const childWithDragHandle = React.cloneElement(children as React.ReactElement, {
      dragHandleListeners: listeners
    });

    return (
        <div ref={setNodeRef} style={style} {...attributes} className={className}>
            {childWithDragHandle}
        </div>
    );
}

const CadetRolesCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const [newItem, setNewItem] = useState("");
    const handleAdd = () => { if (newItem.trim() && !(settings.cadetRoles || []).includes(newItem.trim())) { saveSettings({ cadetRoles: [...(settings.cadetRoles || []), newItem.trim()] }); setNewItem(""); } };
    const handleRemove = (item: string) => { saveSettings({ cadetRoles: (settings.cadetRoles || []).filter(r => r !== item) }); };

    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                 <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                 <div>
                    <CardTitle>Manage Cadet Roles</CardTitle>
                    <CardDescription>Add or remove optional cadet roles.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2"><Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="New role name" /><Button onClick={handleAdd}>Add</Button></div>
                <div className="space-y-2 max-h-48 overflow-y-auto">{(settings.cadetRoles || []).map(item => <div key={item} className="flex items-center justify-between p-2 rounded-md bg-muted/50"><span>{item}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(item)}><X className="h-4 w-4"/></Button></div>)}</div>
            </CardContent>
        </Card>
    );
};

const CadetRanksCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const [newItem, setNewItem] = useState("");
    const handleAdd = () => { if (newItem.trim() && !(settings.cadetRanks || []).includes(newItem.trim())) { saveSettings({ cadetRanks: [...(settings.cadetRanks || []), newItem.trim()] }); setNewItem(""); } };
    const handleRemove = (item: string) => { saveSettings({ cadetRanks: (settings.cadetRanks || []).filter(r => r !== item) }); };

    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                 <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                 <div>
                    <CardTitle>Manage Cadet Ranks</CardTitle>
                    <CardDescription>Add or remove cadet ranks.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2"><Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="New rank name" /><Button onClick={handleAdd}>Add</Button></div>
                <div className="space-y-2 max-h-48 overflow-y-auto">{(settings.cadetRanks || []).map(item => <div key={item} className="flex items-center justify-between p-2 rounded-md bg-muted/50"><span>{item}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(item)}><X className="h-4 w-4"/></Button></div>)}</div>
            </CardContent>
        </Card>
    );
};

const CadetDressCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const [newItem, setNewItem] = useState("");
    const ordersOfDress = settings.ordersOfDress || { caf: [], cadets: [] };
    const handleAdd = () => { if (newItem.trim() && !ordersOfDress.cadets.includes(newItem.trim())) { saveSettings({ ordersOfDress: { ...ordersOfDress, cadets: [...ordersOfDress.cadets, newItem.trim()] } }); setNewItem(""); } };
    const handleRemove = (item: string) => { saveSettings({ ordersOfDress: { ...ordersOfDress, cadets: ordersOfDress.cadets.filter(d => d !== item) } }); };

    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                    <CardTitle>Manage Cadet Orders of Dress</CardTitle>
                    <CardDescription>Add or remove orders of dress for cadets.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2"><Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="New dress name" /><Button onClick={handleAdd}>Add</Button></div>
                <div className="space-y-2 max-h-48 overflow-y-auto">{(ordersOfDress.cadets || []).map(item => <div key={item} className="flex items-center justify-between p-2 rounded-md bg-muted/50"><span>{item}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(item)}><X className="h-4 w-4"/></Button></div>)}</div>
            </CardContent>
        </Card>
    );
};

export default function CadetsPage() {
  const { cadets, addCadet, updateCadet, removeCadet, isLoaded } = useCadets();
  const [editingCadet, setEditingCadet] = useState<Cadet | null>(null);
  const { settings, saveSettings } = useSettings();
  const defaultOrder = ['cadetRoles', 'cadetRanks', 'cadetDress'];
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  
  useEffect(() => {
    setCardOrder(settings.cadetSettingsCardOrder || defaultOrder);
  }, [settings.cadetSettingsCardOrder]);
  
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  
  const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
          setCardOrder((items) => {
              const oldIndex = items.indexOf(active.id as string);
              const newIndex = items.indexOf(over.id as string);
              const newOrder = arrayMove(items, oldIndex, newIndex);
              saveSettings({ cadetSettingsCardOrder: newOrder });
              return newOrder;
          });
      }
  };
  
  const cardComponents: { [key: string]: React.FC<{ dragHandleListeners: any }> } = {
      cadetRoles: CadetRolesCard,
      cadetRanks: CadetRanksCard,
      cadetDress: CadetDressCard,
  };


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
      <div className="mt-6 space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
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

        <Accordion type="single" collapsible className="w-full">
            <Card>
                <AccordionItem value="cadet-settings" className="border-b-0">
                    <AccordionTrigger className="p-6 text-xl">
                        Cadet Settings
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {cardOrder.map(id => {
                                        const Component = cardComponents[id];
                                        if (!Component) return null;
                                        return <SortableSubCard key={id} id={id} className="lg:col-span-1"><Component dragHandleListeners={{}} /></SortableSubCard>;
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>
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
