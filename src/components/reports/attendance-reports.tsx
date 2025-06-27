
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceSummaryReport } from "./attendance/summary-report";
import { DailyAttendanceReport } from "./attendance/daily-attendance-report";
import { PerfectAttendanceReport } from "./attendance/perfect-attendance-report";
import { AtRiskAttendanceReport } from "./attendance/at-risk-attendance-report";

export function AttendanceReports() {
    return (
        <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="daily">Daily Report</TabsTrigger>
                <TabsTrigger value="perfect">Perfect Attendance</TabsTrigger>
                <TabsTrigger value="at-risk">At-Risk Cadets</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="mt-4">
                <AttendanceSummaryReport />
            </TabsContent>
            <TabsContent value="daily" className="mt-4">
                <DailyAttendanceReport />
            </TabsContent>
            <TabsContent value="perfect" className="mt-4">
                <PerfectAttendanceReport />
            </TabsContent>
            <TabsContent value="at-risk" className="mt-4">
                <AtRiskAttendanceReport />
            </TabsContent>
        </Tabs>
    );
}
