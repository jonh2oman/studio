"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { ScheduledItem } from '@/lib/types';
import { Badge } from '../ui/badge';
import { useSettings } from '@/hooks/use-settings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ScheduleDialogProps {
    children: React.ReactNode;
    scheduledItem: ScheduledItem;
    onUpdate: (details: { instructor?: string; classroom?: string }) => void;
}

export function ScheduleDialog({ children, scheduledItem, onUpdate }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [instructor, setInstructor] = useState(scheduledItem.instructor || '');
  const [classroom, setClassroom] = useState(scheduledItem.classroom || '');
  const { settings } = useSettings();

  const handleSave = () => {
    onUpdate({ instructor, classroom });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Schedule Item</DialogTitle>
          <DialogDescription>
            Assign an instructor and classroom for this lesson.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className='p-4 rounded-md border bg-muted'>
                <p className="font-bold text-lg">{scheduledItem.eo.id}</p>
                <p className="text-sm text-muted-foreground">{scheduledItem.eo.title}</p>
                <Badge variant={scheduledItem.eo.type === 'mandatory' ? 'default' : 'secondary'} className="mt-2">
                    {scheduledItem.eo.type}
                </Badge>
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instructor" className="text-right">
              Instructor
            </Label>
            <Select value={instructor} onValueChange={setInstructor}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">N/A</SelectItem>
                    {settings.instructors.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="classroom" className="text-right">
              Classroom
            </Label>
             <Select value={classroom} onValueChange={setClassroom}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select classroom" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">N/A</SelectItem>
                     {settings.classrooms.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
