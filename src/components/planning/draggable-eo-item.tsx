
'use client';
import type { EO } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AddableEoItem({ eo, onAdd }: { eo: EO; onAdd: (eo: EO) => void; }) {
    
    const handleAddClick = () => {
        onAdd(eo);
    };

    return (
        <div className="relative p-2 rounded-md border bg-card/80 flex items-start gap-2 justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant={eo.type === 'mandatory' ? 'default' : 'secondary'} className="capitalize">
                        {eo.type}
                    </Badge>
                    <p className="font-mono text-xs font-semibold">{eo.id.split('-').slice(1).join('-')}</p>
                </div>
                <p className="text-sm leading-tight">{eo.title}</p>
            </div>
            <Button size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleAddClick} aria-label={`Add ${eo.title}`}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
