
'use client';
import { useDraggable } from '@dnd-kit/core';
import type { EO } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

export function DraggableEoItem({ eo }: { eo: EO }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: eo.id,
        data: { eo },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    if (isDragging) {
        return (
             <div ref={setNodeRef} style={style} className="relative p-2 rounded-md border bg-card/80 flex items-start gap-2 shadow-lg ring-2 ring-primary">
                <div className="pt-0.5">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="capitalize">
                            {eo.type}
                        </Badge>
                        <p className="font-mono text-xs font-semibold">{eo.id.split('-').slice(1).join('-')}</p>
                    </div>
                    <p className="text-sm leading-tight">{eo.title}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="relative p-2 rounded-md border bg-card/80 flex items-start gap-2"
        >
            <div {...listeners} {...attributes} className="pt-0.5 cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="capitalize">
                        {eo.type}
                    </Badge>
                    <p className="font-mono text-xs font-semibold">{eo.id.split('-').slice(1).join('-')}</p>
                </div>
                <p className="text-sm leading-tight">{eo.title}</p>
            </div>
        </div>
    );
}
