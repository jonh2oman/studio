
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementsReport } from "./marksmanship/achievements-report";
import { FullScoreLogReport } from "./marksmanship/full-score-log-report";

export function MarksmanshipReports() {
    return (
        <Tabs defaultValue="achievements">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="score-log">Full Score Log</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="mt-4">
                <AchievementsReport />
            </TabsContent>
            <TabsContent value="score-log" className="mt-4">
                <FullScoreLogReport />
            </TabsContent>
        </Tabs>
    );
}
