
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import Planner from '@/components/planner/planner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlannerPage() {
  const [viewMode, setViewMode] = useState('month');

  return (
    <>
      <PageHeader
        title="Corps/Squadron Training Plan - Annual"
        description="Drag and drop lessons to build your training year schedule."
      >
        <Tabs value={viewMode} onValueChange={setViewMode} className="hidden md:block">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </PageHeader>
      <div className="mt-6">
        <Planner viewMode={viewMode} />
      </div>
    </>
  );
}
