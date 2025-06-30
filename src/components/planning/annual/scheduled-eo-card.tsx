"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchedule } from "@/hooks/use-schedule";
import { useSettings } from "@/hooks/use-settings";
import type { ScheduledItem } from "@/lib/types";
import { X } from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";
import { useDebounce } from 'use-debounce';

interface ScheduledEoCardProps {
    item: ScheduledItem;
    slotId: string;
    onRemove: (slotId: string) => void;
}

export function ScheduledEoCard({ item, slotId, onRemove }: ScheduledEoCardProps) {
    const { settings } = useSettings();
    const { updateScheduleItem } = useSchedule();
    const [localInstructor, setLocalInstructor] = useState(item.instructor || '');
    const [localClassroom, setLocalClassroom] = useState(item.classroom || '');

    const [debouncedInstructor] = useDebounce(localInstructor, 500);
    const [debouncedClassroom] = useDebounce(localClassroom, 500);

    const availableInstructors = useMemo(() => {
        return settings.staff.map(s => `${s.rank} ${s.lastName}`);
    }, [settings.staff]);

    const handleUpdate = useCallback((key: 'instructor' | 'classroom', value: string) => {
        updateScheduleItem(slotId, { [key]: value });
    }, [slotId, updateScheduleItem]);
    
    // Using useEffect to call the debounced update
    React.useEffect(() => {
        if (debouncedInstructor !== item.instructor) {
            handleUpdate('instructor', debouncedInstructor);
        }
    }, [debouncedInstructor, item.instructor, handleUpdate]);
    
    React.useEffect(() => {
        if (debouncedClassroom !== item.classroom) {
            handleUpdate('classroom', debouncedClassroom);
        }
    }, [debouncedClassroom, item.classroom, handleUpdate]);

    return (
        <div className="bg-background border rounded-md p-2 text-sm h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold pr-2">{item.eo.id.split('-').slice(1).join('-')}</p>
                    <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-1" onClick={() => onRemove(slotId)}>
                        <X className="h-3.5 w-3.5"/>
                        <span className="sr-only">Remove</span>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-tight">{item.eo.title}</p>
            </div>
            <div className="mt-2 space-y-1">
                <Select value={localInstructor} onValueChange={setLocalInstructor}>
                    <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Instructor..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableInstructors.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={localClassroom} onValueChange={setLocalClassroom}>
                    <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Classroom..." />
                    </SelectTrigger>
                    <SelectContent>
                        {settings.classrooms.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
