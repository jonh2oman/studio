'use client';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingYear } from '@/hooks/use-training-year';
import { Trash2, Edit, Check, X } from 'lucide-react';
import type { DayPlannerData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';

export function DayPlannerDropzone({ planner }: { planner: DayPlannerData }) {
    const { setNodeRef, isOver } = useDroppable({
        id: planner.id,
    });

    const { removeDayPlanner, updateDayPlanner, removeEoFromDayPlanner } = useTrainingYear();
    const [isEditing, setIsEditing] = useState(false);
    const [editState, setEditState] = useState({ name: planner.name, date: parseISO(planner.date) });

    const handleNameChange = () => {
        if (editState.name.trim() && editState.date) {
            updateDayPlanner(planner.id, editState.name.trim(), format(editState.date, 'yyyy-MM-dd'));
        }
        setIsEditing(false);
    };
    
    const handleCancelEdit = () => {
        setEditState({ name: planner.name, date: parseISO(planner.date) });
        setIsEditing(false);
    };

    return (
        <Card ref={setNodeRef} className={cn(isOver && "ring-2 ring-primary ring-offset-2 bg-primary/10")}>
            <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                    {isEditing ? (
                        <div className="flex flex-wrap gap-2 items-center flex-1">
                            <Input value={editState.name} onChange={(e) => setEditState(s => ({...s, name: e.target.value}))} className="h-9 min-w-[200px]"/>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="h-9">
                                        {editState.date ? format(editState.date, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={editState.date} onSelect={(d) => d && setEditState(s => ({...s, date: d}))} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <Button size="icon" variant="ghost" onClick={handleNameChange}><Check className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                        </div>
                    ) : (
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {planner.name}
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </CardTitle>
                             <CardDescription>{format(parseISO(planner.date), "EEEE, MMMM do, yyyy")}</CardDescription>
                        </div>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete Day</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete the plan for "{planner.name}" on {format(parseISO(planner.date), 'PPP')} and all EOs within it. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeDayPlanner(planner.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-4 border-2 border-dashed rounded-lg min-h-[10rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {planner.eos.map((eo, index) => (
                        <div key={`${eo.id}-${index}`} className="relative p-2 rounded-md border bg-background/50 text-sm">
                            <div className="flex justify-between items-start pr-6">
                                <p className="font-semibold">{eo.id.split('-').slice(1).join('-')}</p>
                                <Badge variant="secondary">{eo.periods} {eo.periods > 1 ? 'Periods' : 'Period'}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground pr-6 mt-1">{eo.title}</p>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="absolute top-0 right-0 h-6 w-6"
                                onClick={() => removeEoFromDayPlanner(planner.id, index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    {planner.eos.length === 0 && <p className="col-span-full self-center text-muted-foreground text-center py-10">Drop EOs here</p>}
                </div>
            </CardContent>
        </Card>
    );
}
