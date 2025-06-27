
"use client";

import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Calendar, CalendarDays, CalendarPlus, FileText, Users, ClipboardCheck, Trophy, Settings2, Sparkles, AlertTriangle } from "lucide-react";

export default function InstructionsPage() {
  return (
    <>
      <PageHeader
        title="Application Instructions"
        description="A comprehensive guide to using the Training Officer Planning Tool."
      />
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-primary underline">
              <li><a href="#dashboard"><p className="flex items-center gap-2"><List className="h-4 w-4" />Dashboard</p></a></li>
              <li><a href="#planners"><p className="flex items-center gap-2"><Calendar className="h-4 w-4" />The Planners (Annual, Weekend, LDA)</p></a></li>
              <li><a href="#reports"><p className="flex items-center gap-2"><FileText className="h-4 w-4" />Reports</p></a></li>
              <li><a href="#cadets"><p className="flex items-center gap-2"><Users className="h-4 w-4" />Cadet Management</p></a></li>
              <li><a href="#attendance"><p className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" />Attendance</p></a></li>
              <li><a href="#awards"><p className="flex items-center gap-2"><Trophy className="h-4 w-4" />Awards Management</p></a></li>
              <li><a href="#settings"><p className="flex items-center gap-2"><Settings2 className="h-4 w-4" />Settings</p></a></li>
            </ul>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={['dashboard']} className="w-full space-y-4">
          
          <Card id="dashboard">
            <AccordionItem value="dashboard" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                  <div className="flex items-center gap-3"><List className="h-6 w-6" />Dashboard</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">The dashboard provides an at-a-glance overview of your training year and quick access to all modules.</p>
                <h4 className="font-semibold">Mandatory Training Progress</h4>
                <p>This section displays progress bars for each Phase, showing the percentage of mandatory training periods that have been scheduled across all planners (Annual, Weekend, and LDA). The calculation is based on unique Enabling Objectives (EOs), so scheduling the same lesson multiple times correctly contributes to the total periods completed.</p>
                <h4 className="font-semibold">Navigation Cards</h4>
                <p>Each card on the dashboard links to a major module of the application. Simply click on a card to navigate to the respective page.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="planners">
            <AccordionItem value="planners" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Calendar className="h-6 w-6" />The Planners (Annual, Weekend, LDA)</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">The application includes three planners for different scheduling needs. All scheduled activities, regardless of the planner used, contribute to the overall training progress on the Dashboard.</p>
                
                <h4 className="font-semibold">Core Mechanic: Drag & Drop</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Find the lesson (EO) you want to schedule in the "Training Objectives" list on the left.</li>
                    <li>Click and drag the lesson from the list.</li>
                    <li>Drop it onto the desired Phase slot for a specific Period on a specific day.</li>
                    <li>Once an EO is scheduled, click on it to open a dialog where you can assign an Instructor and a Classroom. The app will warn you if you create a scheduling conflict.</li>
                </ol>

                <h4 className="font-semibold flex items-center gap-2"><Calendar className="h-5 w-5" />Corps/Squadron Training Plan - Annual</h4>
                <p>This planner is for your regular weekly training nights. You can toggle the view between Week, Month, and Year. You can also set the Dress of the Day for both CAF Staff and Cadets for each training night, which will automatically populate the WRO.</p>

                <h4 className="font-semibold flex items-center gap-2"><CalendarDays className="h-5 w-5" />Weekend Planner</h4>
                <p>Designed for multi-day events, this planner displays three consecutive days, each with an intensive 9-period schedule. Use the calendar in the header to select the start date of the weekend.</p>

                <h4 className="font-semibold flex items-center gap-2"><CalendarPlus className="h-5 w-5" />LDA Day Planner</h4>
                <p>Use this planner for single, ad-hoc training days (LDAs). It provides a 9-period schedule for one selected day. You can quickly jump between previously planned days.</p>

                <h4 className="font-semibold">CSAR Planning (Weekends & LDAs)</h4>
                <p>The Weekend and LDA planners include a Cadet Support and Activity Request (CSAR) section for each day.</p>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Toggle "CSAR Required?" to 'Yes'. This enables the other toggles and the "Plan CSAR" button.</li>
                    <li>Click "Plan CSAR" to open a detailed planning sheet with tabs for Details, Meal Plan, and J4 (equipment).</li>
                    <li>Fill out the form. The data is saved automatically as you fill it out.</li>
                    <li>Track the submission and approval status using the toggles on the main planner page.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="reports">
            <AccordionItem value="reports" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><FileText className="h-6 w-6" />Reports</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This module allows you to generate a PDF of the Weekly Routine Orders (WRO) and view other key reports.</p>
                <h4 className="font-semibold">Generating a WRO</h4>
                 <p>The WRO form intelligently pulls data from other parts of the application to streamline report creation.</p>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Select a Training Date. The schedule for this date will be automatically pulled from the planners.</li>
                    <li><strong>Automatic Logic:</strong> The following fields are auto-populated based on your settings and schedules:
                        <ul className="list-disc list-inside ml-6 my-2 bg-muted/50 p-3 rounded-md">
                            <li><strong>RO Number:</strong> Generated from the year and week number of the selected date.</li>
                            <li><strong>Duty Personnel:</strong> Pulled from the Duty Roster you configure in Settings.</li>
                            <li><strong>Dress of the Day:</strong> Pulled from the setting on the Annual Planner for that date.</li>
                            <li><strong>Upcoming Activities:</strong> Populated from the "Weekly Activities" you define in Settings.</li>
                        </ul>
                    </li>
                    <li>Fill in the remaining fields (e.g., CO Name, Announcements, Notes).</li>
                    <li>Optionally, upload a corps logo.</li>
                    <li>Click "Generate WRO PDF". A PDF file will be created and downloaded.</li>
                </ol>
                <h4 className="font-semibold">Other Reports</h4>
                <p>The reports page also includes several other useful reports that can be printed:</p>
                <ul className="list-disc list-inside">
                    <li><strong>Cadet Roster:</strong> A complete list of all cadets.</li>
                    <li><strong>Attendance:</strong> Includes a Summary, Daily Report, Perfect Attendance list, and At-Risk Cadets list.</li>
                    <li><strong>Training Completion:</strong> Shows the progress of mandatory training for each phase.</li>
                    <li><strong>Award Winners:</strong> A list of all awards and their assigned winners.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>
          
           <Card id="cadets">
            <AccordionItem value="cadets" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Users className="h-6 w-6" />Cadet Management</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This is where you manage your corps' roster for the current training year.</p>
                 <h4 className="font-semibold">Adding a Cadet</h4>
                 <p>Use the "Add New Cadet" form. Fill in their details, including their current Phase. The list of available ranks is managed on the Settings page.</p>
                <h4 className="font-semibold">Editing or Removing a Cadet</h4>
                <p>The "Cadet Roster" table lists all your cadets. Use the pencil icon to edit a cadet's details or the 'X' icon to remove them.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="attendance">
            <AccordionItem value="attendance" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                <div className="flex items-center gap-3"><ClipboardCheck className="h-6 w-6" />Attendance</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">Track cadet attendance for specific training nights.</p>
                <h4 className="font-semibold">Taking Attendance</h4>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Select a training night using the calendar. Your regular training days (set in Settings) are highlighted.</li>
                    <li>For each cadet, select their status: Present, Absent, or Excused.</li>
                    <li>Use the checkboxes to mark if a cadet Arrived Late or Left Early.</li>
                    <li>Click "Save Attendance". This data is crucial for generating accurate attendance reports and for the AI-powered award eligibility checks.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="awards">
            <AccordionItem value="awards" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Trophy className="h-6 w-6" />Awards Management</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">Manage corps awards and determine eligible cadets using AI assistance.</p>
                <h4 className="font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />AI-Powered Eligibility Check</h4>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Expand an award to view its criteria.</li>
                    <li>Click the <strong>"Check Eligibility with AI"</strong> button.</li>
                    <li><strong>Automatic Logic:</strong> The application sends the award criteria and your entire cadet roster (including their calculated attendance percentages) to an AI model. The AI analyzes this data and returns a list of cadets who meet all requirements.</li>
                    <li>The "Eligible Cadets" section will update to show the results.</li>
                </ul>
                <h4 className="font-semibold">Assigning Winners</h4>
                <p>From the list of eligible cadets, click the "Select" button to mark a cadet as a winner. You can select multiple winners for corps awards. The winner's name will appear in the award title for easy reference.</p>
                <h4 className="font-semibold">Managing Awards</h4>
                <p>You can add, edit, or delete award definitions. Note that award definitions are global across all training years, but winners are specific to each year.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>
          
           <Card id="settings">
            <AccordionItem value="settings" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Settings2 className="h-6 w-6" />Settings</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">Configure the application to match your corps' specific needs. Changes here can affect automatic logic in other modules.</p>
                <h4 className="font-semibold">Training Year Management</h4>
                <p>Create a new training year or switch between existing ones. When creating a new year, you can choose to copy data from a previous year. The copy process includes an option to use <strong>AI to intelligently map</strong> last year's schedule to the new calendar, accounting for different start dates and holidays.</p>
                
                <h4 className="font-semibold">Personnel Management</h4>
                <p>Manage your staff roster and assign their parade night duties in the <strong>Duty Roster</strong>. The duty roster assignments automatically populate the Duty Personnel section of the WRO for the corresponding date.</p>
                
                <h4 className="font-semibold">Planning Resources</h4>
                <p>Customize the lists used throughout the planners. This includes Classrooms, Ranks (Cadet and Officer), and Orders of Dress. You can also define <strong>Weekly Activities</strong>, which are recurring events that will automatically appear in the "Upcoming Activities" section of the WRO for the relevant week.</p>
                
                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive"/>Danger Zone</h4>
                <p>The "Reset Application" button will permanently delete <strong>all</strong> data from your browser's local storage, including all training years, schedules, cadets, and settings. Use this with extreme caution.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

        </Accordion>
      </div>
    </>
  );
}
