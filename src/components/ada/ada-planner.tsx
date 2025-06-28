
"use client";

import { useState } from 'react';
import { useTrainingYear } from '@/hooks/use-training-year';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, X } from 'lucide-react';
import type { EO } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function AdaPlanner() {
    const {
        adaPlanners,
        addAdaPlanner,
        removeAdaPlanner,
        updateAdaPlannerName,
        addEoToAda,
        removeEoFromAda,
        isLoaded,
    } = useTrainingYear();
    
    const [dragOverPlanner, setDragOverPlanner] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newAdaName, setNewAdaName] = useState('');

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, plannerId: string) => {
        e.preventDefault();
        setDragOverPlanner(plannerId);
    };

    const handleDragLeave = () => {
        setDragOverPlanner(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, plannerId: string) => {
        e.preventDefault();
        const eo: EO = JSON.parse(e.dataTransfer.getData("application/json"));
        addEoToAda(plannerId, eo);
        setDragOverPlanner(null);
    };

    const handleAddPlanner = () => {
        if (newAdaName.trim()) {
            addAdaPlanner(newAdaName.trim());
            setIsAddDialogOpen(false);
            setNewAdaName('');
        }
    }

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New ADA Planner
                </Button>
            </div>
            {adaPlanners.length === 0 && (
                 <Card className="text-center">
                    <CardHeader>
                        <CardTitle>No ADA Planners Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Click "Add New ADA Planner" to get started.</p>
                    </CardContent>
                </Card>
            )}
            {adaPlanners.map((planner) => (
                <Card
                    key={planner.id}
                    onDragOver={(e) => handleDragOver(e, planner.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, planner.id)}
                    className={cn(
                        "transition-colors",
                        dragOverPlanner === planner.id && "border-primary bg-primary/5"
                    )}
                >
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <Input
                                defaultValue={planner.name}
                                onBlur={(e) => updateAdaPlannerName(planner.id, e.target.value)}
                                className="text-lg font-semibold border-0 shadow-none focus-visible:ring-1 focus-visible:ring-ring p-1 -m-1 h-auto w-1/2"
                            />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete ADA
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete "{planner.name}" and all EOs within it. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeAdaPlanner(planner.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <CardDescription>Drag and drop EOs here to mark them as completed at this ADA. Max 60 EOs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {planner.eos.map((eo, index) => (
                                <div key={`${eo.id}-${index}`} className="relative group p-2 rounded-md border bg-background shadow-sm">
                                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeEoFromAda(planner.id, index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <p className="font-bold text-sm">{eo.id.split('-').slice(1).join('-')}</p>
                                    <p className="text-xs text-muted-foreground leading-tight truncate">{eo.title}</p>
                                    <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="mt-2 text-xs">
                                        {eo.type}
                                    </Badge>
                                </div>
                            ))}
                            {Array.from({ length: 60 - planner.eos.length }).map((_, index) => (
                                <div key={index} className="h-24 rounded-md border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-xs text-muted-foreground">
                                    Drop EO
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
             <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add New ADA Planner</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a descriptive name for this Area Directed Activity (e.g., "Fall FTX 2024").
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Input 
                            value={newAdaName}
                            onChange={(e) => setNewAdaName(e.target.value)}
                            placeholder="ADA Name"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleAddPlanner()}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAddPlanner}>Add</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
