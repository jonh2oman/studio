"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import Planner from '@/components/planner/planner';
import { Button } from '@/components/ui/button';
import { Printer, Menu } from 'lucide-react';

export default function PlannerPage() {
  const [viewMode, setViewMode] = useState('month');
  const [objectivesVisible, setObjectivesVisible] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b bg-background/95 p-4 backdrop-blur-sm md:p-6">
        <PageHeader
          title="Corps/Squadron Training Plan - Annual"
          description="Drag and drop lessons to build your training year schedule."
        >
          <div className="flex items-center gap-4 print:hidden">
            <Button onClick={() => window.print()} variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" /> Print Plan
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setObjectivesVisible(!objectivesVisible)}
              className="bg-card hover:bg-muted shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </PageHeader>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Planner 
          viewMode={viewMode} 
          objectivesVisible={objectivesVisible} 
          setViewMode={setViewMode}
        />
      </div>
    </div>
  );
}
