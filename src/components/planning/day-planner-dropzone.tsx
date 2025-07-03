'use client';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingYear } from '@/hooks/use-training-year';
import { Trash2, Edit, Check, X } from 'lucide-react';
import type { DayPlannerData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { getPhaseDisplayName } from '@/lib/utils';
import { ScheduledDayEoCard } from './day/scheduled-eo-card';

const phases = [1, 2, 3, 4];
const periods = Array.from({ length: 9 }, (_, i) => i + 1); // 9 periods

export function DayPlannerDropzone({ planner }: { planner: DayPlannerData }) {
    const { removeDayPlanner, updateDayPlanner } = useTrainingYear();
    const { settings } = useSettings();
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
        <Card>
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
                    <div>
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
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {phases.map(phaseId => (
                        <div key={phaseId} className="rounded-lg bg-muted/50 p-3 space-y-2">
                            <h5 className="font-medium text-center text-sm">{getPhaseDisplayName(settings.element, phaseId)}</h5>
                            <div className="space-y-2">
                                {periods.map(period => {
                                    const slotId = `${phaseId}-${period}`;
                                    const scheduledItem = (planner.schedule || {})[slotId];
                                    const { setNodeRef, isOver } = useDroppable({
                                        id: `day-planner-${planner.id}-phase-${phaseId}-period-${period}`,
                                    });

                                    return (
                                        <div
                                            ref={setNodeRef}
                                            key={period}
                                            className={cn(
                                                "min-h-[6rem] rounded-md border-2 border-dashed p-2 transition-colors",
                                                isOver && "border-primary bg-primary/10",
                                                !scheduledItem && "flex items-center justify-center",
                                                scheduledItem ? "bg-background border-solid" : "border-dashed"
                                            )}
                                        >
                                            {scheduledItem ? (
                                                <ScheduledDayEoCard item={scheduledItem} plannerId={planner.id} slotId={slotId} />
                                            ) : (
                                                <p className="text-xs text-muted-foreground">Period {period}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
