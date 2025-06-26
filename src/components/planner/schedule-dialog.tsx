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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScheduledItem } from '@/lib/types';
import { Badge } from '../ui/badge';

interface ScheduleDialogProps {
    children: React.ReactNode;
    scheduledItem: ScheduledItem;
    onUpdate: (details: { instructor?: string; classroom?: string }) => void;
}

export function ScheduleDialog({ children, scheduledItem, onUpdate }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [instructor, setInstructor] = useState(scheduledItem.instructor || '');
  const [classroom, setClassroom] = useState(scheduledItem.classroom || '');

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
            <Input
              id="instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="col-span-3"
              placeholder="e.g., CI Smith"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="classroom" className="text-right">
              Classroom
            </Label>
            <Input
              id="classroom"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              className="col-span-3"
              placeholder="e.g., #1, Parade Deck"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
