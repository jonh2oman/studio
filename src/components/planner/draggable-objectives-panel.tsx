
"use client";

import { ObjectivesList } from "./objectives-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingPanel } from "@/components/ui/floating-panel";

interface DraggableObjectivesPanelProps {
    viewMode?: string;
    setViewMode?: (mode: string) => void;
}

export function DraggableObjectivesPanel({ viewMode, setViewMode }: DraggableObjectivesPanelProps) {
  
  const headerContent = viewMode && setViewMode && (
    <div className="flex-shrink-0">
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="week" className="text-xs px-2">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs px-2">Month</TabsTrigger>
            <TabsTrigger value="year" className="text-xs px-2">Year</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  return (
    <FloatingPanel 
        title="Training Objectives" 
        initialPosition={{ x: 20, y: 20 }}
        initialSize={{ width: 350, height: 600 }}
        headerContent={headerContent}
    >
        <div className="p-4 border-b space-y-3">
            <p className="text-sm text-muted-foreground">Drag periods onto the calendar.</p>
        </div>
        <ObjectivesList />
    </FloatingPanel>
  );
}
