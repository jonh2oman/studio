"use client";

import { PageHeader } from "@/components/page-header";
import { WeekendPlanner } from "@/components/weekends/weekend-planner";

export default function WeekendsPage() {
  return (
    <>
      <PageHeader
        title="Weekend Planner"
        description="Plan training weekends. Schedules here are shared with the main Training Planner."
      />
      <div className="mt-6">
        <WeekendPlanner />
      </div>
    </>
  );
}
