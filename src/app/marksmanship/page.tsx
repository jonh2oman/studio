
"use client";

import { PageHeader } from "@/components/page-header";
import { ScoreEntryForm } from "@/components/marksmanship/score-entry-form";
import { AchievementsList } from "@/components/marksmanship/achievements-list";
import { MarksmanshipProvider } from "@/hooks/use-marksmanship";
import { Card, CardContent } from "@/components/ui/card";

export default function MarksmanshipPage() {

  return (
    <MarksmanshipProvider>
      <PageHeader
        title="Marksmanship Scoring"
        description="Enter cadet scores for grouping and competition targets and track their achievements."
      />
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <ScoreEntryForm />
        </div>
        <div className="md:col-span-2">
           <Card>
                <CardContent className="pt-6">
                    <AchievementsList />
                </CardContent>
           </Card>
        </div>
      </div>
    </MarksmanshipProvider>
  );
}
