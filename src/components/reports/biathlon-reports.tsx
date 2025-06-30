
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiathlonResultsReport } from "./biathlon/results-report";
import { BiathlonTeamRosterReport } from "./biathlon/team-roster-report";

export function BiathlonReports() {
    return (
        <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Competition Results</TabsTrigger>
                <TabsTrigger value="roster">Team Roster</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="mt-4">
                <BiathlonResultsReport />
            </TabsContent>
            <TabsContent value="roster" className="mt-4">
                <BiathlonTeamRosterReport />
            </TabsContent>
        </Tabs>
    );
}
