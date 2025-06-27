
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import Planner from '@/components/planner/planner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Printer, Menu } from 'lucide-react';

export default function PlannerPage() {
  const [viewMode, setViewMode] = useState('month');
  const [objectivesVisible, setObjectivesVisible] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Corps/Squadron Training Plan - Annual"
        description="Drag and drop lessons to build your training year schedule."
      >
        <div className="flex items-center gap-4 print:hidden">
          <Tabs value={viewMode} onValueChange={setViewMode} className="hidden md:block">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
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
      <div className="mt-6 flex-1 min-h-0">
        <Planner viewMode={viewMode} objectivesVisible={objectivesVisible} />
      </div>
    </div>
  );
}
