
"use client";

import { PageHeader } from "@/components/page-header";
import { ScoreEntryForm } from "@/components/marksmanship/score-entry-form";
import { AchievementsList } from "@/components/marksmanship/achievements-list";
import { MarksmanshipProvider } from "@/hooks/use-marksmanship";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiathlonProvider } from "@/hooks/use-biathlon";
import { BiathlonTeamManagement } from "@/components/biathlon/biathlon-team-management";
import { BiathlonResultsList } from "@/components/biathlon/biathlon-results-list";

export default function MarksmanshipPage() {
  return (
    <>
      <PageHeader
        title="Marksmanship & Biathlon"
        description="Enter cadet scores for shooting disciplines and track their achievements."
      />
      <Tabs defaultValue="marksmanship" className="mt-6">
        <TabsList>
          <TabsTrigger value="marksmanship">Marksmanship</TabsTrigger>
          <TabsTrigger value="biathlon">Biathlon</TabsTrigger>
        </TabsList>

        <TabsContent value="marksmanship" className="mt-6">
          <MarksmanshipProvider>
            <div className="grid gap-8 md:grid-cols-3">
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
        </TabsContent>
        
        <TabsContent value="biathlon" className="mt-6">
           <BiathlonProvider>
             <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <BiathlonTeamManagement />
              </div>
              <div className="md:col-span-2">
                <BiathlonResultsList />
              </div>
            </div>
           </BiathlonProvider>
        </TabsContent>

      </Tabs>
    </>
  );
}
