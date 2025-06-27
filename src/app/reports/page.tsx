
"use client";

import { PageHeader } from "@/components/page-header";
import { WroForm } from "@/components/reports/wro-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadetRosterReport } from "@/components/reports/cadet-roster-report";
import { AttendanceReports } from "@/components/reports/attendance-reports";
import { TrainingCompletionReport } from "@/components/reports/training-completion-report";
import { AwardWinnersReport } from "@/components/reports/award-winners-report";

export default function ReportsPage() {
    return (
        <>
            <PageHeader
                title="Reports"
                description="Generate and view various reports for your corps."
            />
            <Tabs defaultValue="wro" className="mt-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="wro">WRO Generator</TabsTrigger>
                    <TabsTrigger value="roster">Cadet Roster</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="completion">Training Completion</TabsTrigger>
                    <TabsTrigger value="awards">Award Winners</TabsTrigger>
                </TabsList>
                <TabsContent value="wro" className="mt-6">
                    <WroForm />
                </TabsContent>
                <TabsContent value="roster" className="mt-6">
                    <CadetRosterReport />
                </TabsContent>
                <TabsContent value="attendance" className="mt-6">
                    <AttendanceReports />
                </TabsContent>
                <TabsContent value="completion" className="mt-6">
                    <TrainingCompletionReport />
                </TabsContent>
                <TabsContent value="awards" className="mt-6">
                    <AwardWinnersReport />
                </TabsContent>
            </Tabs>
        </>
    );
}
