
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSchedule } from "@/hooks/use-schedule";
import type { ScheduledItem } from "@/lib/types";
import { X } from "lucide-react";
import { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useDebounce } from 'use-debounce';
import { Input } from "@/components/ui/input";

interface ScheduledEoCardProps {
    item: ScheduledItem;
    slotId: string;
}

export function ScheduledEoCard({ item, slotId }: ScheduledEoCardProps) {
    const { removeScheduleItem, updateScheduleItem } = useSchedule();
    
    const [instructor, setInstructor] = useState(item.instructor || '');
    const [classroom, setClassroom] = useState(item.classroom || '');
    
    const [debouncedInstructor] = useDebounce(instructor, 500);
    const [debouncedClassroom] = useDebounce(classroom, 500);

    const handleUpdate = useCallback((field: 'instructor' | 'classroom', value: string) => {
        updateScheduleItem(slotId, { [field]: value });
    }, [slotId, updateScheduleItem]);
    
    useEffect(() => {
        // Only update if the debounced value is different from the original item prop
        // to avoid unnecessary saves on initial render.
        if (debouncedInstructor !== item.instructor) {
            handleUpdate('instructor', debouncedInstructor);
        }
    }, [debouncedInstructor, item.instructor, handleUpdate]);
    
    useEffect(() => {
        if (debouncedClassroom !== item.classroom) {
            handleUpdate('classroom', debouncedClassroom);
        }
    }, [debouncedClassroom, item.classroom, handleUpdate]);


    return (
        <div className="bg-background text-sm h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold pr-2">{item.eo.id.split('-').slice(1).join('-')}</p>
                    <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-1" onClick={() => removeScheduleItem(slotId)}>
                        <X className="h-3.5 w-3.5"/>
                        <span className="sr-only">Remove</span>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-tight">{item.eo.title}</p>
            </div>
             <div className="mt-2 space-y-1">
                <Input 
                    value={instructor} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInstructor(e.target.value)} 
                    placeholder="Instructor" 
                    className="h-6 text-xs" 
                />
                <Input 
                    value={classroom} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setClassroom(e.target.value)} 
                    placeholder="Location" 
                    className="h-6 text-xs" 
                />
            </div>
        </div>
    );
}
