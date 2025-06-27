"use client";

import { useState } from 'react';
import { WeekendPlanner } from "@/components/weekends/weekend-planner";
import { Button } from '@/components/ui/button';
import { Menu, Printer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function WeekendsPage() {
  const [objectivesVisible, setObjectivesVisible] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b bg-background/95 p-4 backdrop-blur-sm md:p-6">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 print:hidden">
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

                <Button onClick={() => window.print()} variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" /> Print Plan
                </Button>
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">Weekend Planner</h1>
                <p className="text-muted-foreground mt-1">Plan training weekends. Schedules here are shared with the main Training Planner.</p>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <WeekendPlanner objectivesVisible={objectivesVisible} />
      </div>
    </div>
  );
}
