
'use client';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingYear } from '@/hooks/use-training-year';
import { Trash2, Edit, Check, X } from 'lucide-react';
import type { AdaPlannerData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export function AdaDropzone({ planner }: { planner: AdaPlannerData }) {
    const { setNodeRef, isOver } = useDroppable({
        id: planner.id,
    });

    const { removeAdaPlanner, updateAdaPlannerName, removeEoFromAda } = useTrainingYear();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(planner.name);

    const handleNameChange = () => {
        if (newName.trim() && newName !== planner.name) {
            updateAdaPlannerName(planner.id, newName.trim());
        }
        setIsEditingName(false);
    };
    
    const handleCancelEdit = () => {
        setNewName(planner.name);
        setIsEditingName(false);
    };

    return (
        <Card ref={setNodeRef} className={cn(isOver && "ring-2 ring-primary ring-offset-2 bg-primary/10")}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    {isEditingName ? (
                        <div className="flex gap-2 items-center flex-1">
                            <Input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNameChange()} />
                            <Button size="icon" variant="ghost" onClick={handleNameChange}><Check className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                        </div>
                    ) : (
                        <CardTitle className="flex items-center gap-2">
                            {planner.name}
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditingName(true)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete Planner</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete the "{planner.name}" planner and all EOs within it. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeAdaPlanner(planner.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 content-start min-h-[6rem]">
                     {planner.eos.length > 0 ? (
                        planner.eos.map((eo, index) => (
                            <div key={`${eo.id}-${index}`} className="relative p-2 rounded-md border bg-card shadow-sm text-sm">
                                <div className="flex justify-between items-start pr-6">
                                    <p className="font-semibold">{eo.id.split('-').slice(1).join('-')}</p>
                                    <Badge variant="secondary">{eo.periods} {eo.periods > 1 ? 'Periods' : 'Period'}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground pr-6 mt-1">{eo.title}</p>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="absolute top-0 right-0 h-6 w-6"
                                    onClick={() => removeEoFromAda(planner.id, index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))
                    ) : (
                         <div className="col-span-full flex items-center justify-center min-h-[6rem] border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground text-center">Drop EOs here</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
