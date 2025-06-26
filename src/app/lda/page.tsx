"use client";

import { PageHeader } from "@/components/page-header";
import { LdaPlanner } from "@/components/lda/lda-planner";

export default function LdaPage() {
  return (
    <>
      <PageHeader
        title="LDA Day Planner"
        description="Plan single ad-hoc training days. Schedules here are shared with all other planners."
      />
      <div className="mt-6">
        <LdaPlanner />
      </div>
    </>
  );
}
