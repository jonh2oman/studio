"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { WeekendPlanner } from "@/components/weekends/weekend-planner";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function WeekendsPage() {
  const [objectivesVisible, setObjectivesVisible] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b bg-background/95 p-4 backdrop-blur-sm md:p-6">
        <PageHeader
          title="Weekend Planner"
          description="Plan training weekends. Schedules here are shared with the main Training Planner."
        >
          <Button
            size="icon"
            variant="outline"
            onClick={() => setObjectivesVisible(!objectivesVisible)}
            className="bg-card hover:bg-muted shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </PageHeader>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <WeekendPlanner objectivesVisible={objectivesVisible} />
      </div>
    </div>
  );
}
