
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { AdaPlanner } from '@/components/ada/ada-planner';
import { DraggableObjectivesPanel } from '@/components/planner/draggable-objectives-panel';

export default function AdaPage() {
    const [objectivesVisible, setObjectivesVisible] = useState(true);

    return (
        <div className="flex h-full flex-col">
            <PageHeader
                title="Area Directed Activity (ADA) Planner"
                description="Account for EOs completed at ADAs. These count towards overall training completion."
            />
            <div className="relative mt-6 flex-1">
                {objectivesVisible && <DraggableObjectivesPanel />}
                <AdaPlanner />
            </div>
        </div>
    );
}
