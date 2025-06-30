
"use client";

import { PageHeader } from "@/components/page-header";
import { WroForm } from "@/components/reports/wro-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadetRosterReport } from "@/components/reports/cadet-roster-report";
import { AttendanceReports } from "@/components/reports/attendance-reports";
import { TrainingCompletionReport } from "@/components/reports/training-completion-report";
import { AwardWinnersReport } from "@/components/reports/award-winners-report";
import { AssetReport } from "@/components/reports/asset-report";
import { MarksmanshipReports } from "@/components/reports/marksmanship-reports";
import { MarksmanshipProvider } from "@/hooks/use-marksmanship";
import { BiathlonProvider } from "@/hooks/use-biathlon";
import { BiathlonReports } from "@/components/reports/biathlon-reports";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
    return (
        <>
            <PageHeader
                title="Reports"
                description="Generate WROs and view various other reports for your corps."
            />

            <Accordion type="multiple" defaultValue={["wro", "corps-reports"]} className="w-full space-y-4 mt-8">
                <Card>
                    <AccordionItem value="wro" className="border-b-0">
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <h2 className="text-2xl font-bold tracking-tight">Generate Routine Orders (WRO)</h2>
                                <p className="text-muted-foreground mt-1">Use this form to generate a PDF of the Weekly Routine Orders for a specific training night.</p>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
                            <div className="mt-6">
                                <WroForm />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
                
                <Card>
                    <AccordionItem value="corps-reports" className="border-b-0">
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                 <h2 className="text-2xl font-bold tracking-tight">Corps Reports</h2>
                                 <p className="text-muted-foreground mt-1">Select a report to view.</p>
                             </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
                            <Tabs defaultValue="roster" className="mt-6">
                                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
                                    <TabsTrigger value="roster">Cadet Roster</TabsTrigger>
                                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                                    <TabsTrigger value="completion">Training Completion</TabsTrigger>
                                    <TabsTrigger value="awards">Award Winners</TabsTrigger>
                                    <TabsTrigger value="assets">Corps Assets</TabsTrigger>
                                    <TabsTrigger value="marksmanship">Marksmanship</TabsTrigger>
                                    <TabsTrigger value="biathlon">Biathlon</TabsTrigger>
                                </TabsList>
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
                                <TabsContent value="assets" className="mt-6">
                                    <AssetReport />
                                </TabsContent>
                                 <TabsContent value="marksmanship" className="mt-6">
                                    <MarksmanshipProvider>
                                        <MarksmanshipReports />
                                    </MarksmanshipProvider>
                                </TabsContent>
                                <TabsContent value="biathlon" className="mt-6">
                                    <BiathlonProvider>
                                        <BiathlonReports />
                                    </BiathlonProvider>
                                </TabsContent>
                            </Tabs>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            </Accordion>
        </>
    );
}
