
'use client';
import type { EO } from '@/lib/types';
import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableEoItemProps {
    eo: EO;
    scheduledCount: number;
}

export function DraggableEoItem({ eo, scheduledCount = 0 }: DraggableEoItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `draggable-${eo.id}`,
        data: {
            eo: eo,
        },
    });
    
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={cn(
                "relative p-2 rounded-md border bg-card/80 flex items-start gap-2 justify-between touch-none",
                isDragging && "z-10 shadow-lg opacity-80"
            )}
        >
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="capitalize">
                        {eo.type}
                    </Badge>
                    <p className="font-mono text-xs font-semibold">{eo.id.split('-').slice(1).join('-')}</p>
                    {eo.type === 'mandatory' && scheduledCount > 0 && (
                        <Badge variant="outline" className={cn("text-xs", scheduledCount >= eo.periods ? "text-green-600 border-green-600/50" : "")}>
                            Planned: {scheduledCount} / {eo.periods}
                        </Badge>
                    )}
                </div>
                <p className="text-sm leading-tight pr-4">{eo.title}</p>
            </div>
             <div className="text-muted-foreground cursor-grab">
                <GripVertical className="h-5 w-5" />
            </div>
        </div>
    );
}
