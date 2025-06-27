
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { LdaPlanner } from "@/components/lda/lda-planner";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function LdaPage() {
  const [objectivesVisible, setObjectivesVisible] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="LDA Day Planner"
        description="Plan single ad-hoc training days. Schedules here are shared with all other planners."
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
      <div className="mt-6 flex-1 min-h-0">
        <LdaPlanner objectivesVisible={objectivesVisible} />
      </div>
    </div>
  );
}
