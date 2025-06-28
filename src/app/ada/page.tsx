
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AdaPlanner } from '@/components/ada/ada-planner';
import { DraggableObjectivesPanel } from '@/components/planner/draggable-objectives-panel';

export default function AdaPage() {
    const [objectivesVisible, setObjectivesVisible] = useState(true);

    return (
        <div className="flex h-full flex-col">
            <div className="flex-shrink-0 border-b bg-background/95 pb-6 backdrop-blur-sm print:hidden">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setObjectivesVisible(!objectivesVisible)}
                                    className="bg-card hover:bg-muted shadow-md"
                                >
                                    <Menu className="mr-2 h-4 w-4" />
                                    PO's / EO's
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click to show/hide POs & EOs</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">Area Directed Activity (ADA) Planner</h1>
                        <p className="text-muted-foreground mt-1">Account for EOs completed at ADAs. These count towards overall training completion.</p>
                    </div>
                </div>
            </div>
            <div className="relative flex-1 overflow-y-auto pt-6">
                {objectivesVisible && <DraggableObjectivesPanel />}
                <AdaPlanner />
            </div>
        </div>
    );
}
