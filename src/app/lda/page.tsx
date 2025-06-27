"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { LdaPlanner } from "@/components/lda/lda-planner";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function LdaPage() {
  const [objectivesVisible, setObjectivesVisible] = useState(true);

  return (
    <div className="flex flex-col">
       <div className="sticky top-0 z-10 border-b bg-background/95 p-4 backdrop-blur-sm md:p-6">
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
        </div>
        <div className="p-4 md:p-6">
          <LdaPlanner objectivesVisible={objectivesVisible} />
        </div>
    </div>
  );
}
