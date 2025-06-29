
"use client";

import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { List, Calendar, FileText, Users, ClipboardCheck, Trophy, Settings2, Sparkles, AlertTriangle, Database, Puzzle, Rocket, Info, ClipboardList, Building2, Contact } from "lucide-react";

export default function InstructionsPage() {
  return (
    <>
      <PageHeader
        title="Application Instructions"
        description="A comprehensive guide to using Corps/Sqn Manager."
      />
      <div className="mt-6 space-y-6">

        <Card className="border-primary/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Rocket className="h-6 w-6 text-primary" />Getting Started: Core Concepts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Puzzle className="h-4 w-4"/>Multi-Element Support</h4>
                    <p>First, go to Settings and select your unit's Element (Sea, Army, or Air). This is crucial as it loads the correct training program and terminology (e.g., Phase, Level, or Star Level) throughout the application.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Database className="h-4 w-4"/>Real-Time Cloud Storage</h4>
                    <p>All your data (schedules, cadets, etc.) is securely saved to the cloud and linked to your user account. Every change is saved automatically and in real-time. This means your data is safe, private, and accessible from any device where you log in.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Puzzle className="h-4 w-4"/>Everything is Organized by Training Year</h4>
                    <p>The application is designed around Training Years (e.g., "2024-2025"). All your schedules, cadets, and reports are specific to the currently selected year. You must create your first training year in Settings to begin.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-primary underline">
              <li><a href="#dashboard"><p className="flex items-center gap-2"><List className="h-4 w-4" />Dashboard</p></a></li>
              <li><a href="#planners"><p className="flex items-center gap-2"><Calendar className="h-4 w-4" />The Planners</p></a></li>
              <li><a href="#ada"><p className="flex items-center gap-2"><ClipboardList className="h-4 w-4" />ADA Planner</p></a></li>
              <li><a href="#reports"><p className="flex items-center gap-2"><FileText className="h-4 w-4" />Reports</p></a></li>
              <li><a href="#cadets"><p className="flex items-center gap-2"><Users className="h-4 w-4" />Cadet Management</p></a></li>
              <li><a href="#asset-management"><p className="flex items-center gap-2"><Building2 className="h-4 w-4" />Asset Management</p></a></li>
              <li><a href="#staff-management"><p className="flex items-center gap-2"><Contact className="h-4 w-4" />Staff Management</p></a></li>
              <li><a href="#attendance"><p className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" />Attendance</p></a></li>
              <li><a href="#awards"><p className="flex items-center gap-2"><Trophy className="h-4 w-4" />Awards Management</p></a></li>
              <li><a href="#settings"><p className="flex items-center gap-2"><Settings2 className="h-4 w-4" />Settings</p></a></li>
               <li><a href="#about"><p className="flex items-center gap-2"><Info className="h-4 w-4" />About</p></a></li>
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
                <h4 className="font-semibold">Mandatory Training Planning Progress</h4>
                <p>This section displays progress bars for each Phase / Level / Star Level, showing the percentage of mandatory training periods that have been scheduled across all planners (Annual, Weekend, LDA, and ADA). The calculation is based on unique Enabling Objectives (EOs), so scheduling the same lesson multiple times correctly contributes to the total periods completed.</p>
                <h4 className="font-semibold">Navigation Cards</h4>
                <p>Each card on the dashboard links to a major module of the application. The categories can be expanded or collapsed to keep the view tidy. Simply click on a card to navigate to the respective page.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="planners">
            <AccordionItem value="planners" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Calendar className="h-6 w-6" />The Planners (Annual, Weekend, LDA)</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">The application includes three planners for different scheduling needs. All planners feature a sticky header, so page controls are always accessible. All scheduled activities, regardless of the planner used, contribute to the overall training progress on the Dashboard.</p>
                
                <h4 className="font-semibold">The Objectives Panel</h4>
                <p>This floating panel is your palette of lessons. It can be moved anywhere on the screen and resized to your liking. It contains all official EOs for your selected element, plus any custom EOs you've created in Settings. Use the search bar to quickly find what you need.</p>
                
                <h4 className="font-semibold">Core Mechanic: Drag & Drop</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Find the lesson (EO) you want to schedule in the floating "Training Objectives" panel.</li>
                    <li>Click and drag the lesson from the list.</li>
                    <li>Drop it onto the desired Phase / Level / Star Level slot for a specific Period on a specific day.</li>
                    <li>Once an EO is scheduled, click on it to open a dialog where you can assign an Instructor and a Classroom. The app will warn you if you create a scheduling conflict (e.g., assigning the same instructor to two places at once).</li>
                </ol>

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
          
           <Card id="ada">
            <AccordionItem value="ada" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                  <div className="flex items-center gap-3"><ClipboardList className="h-4 w-4" />ADA Planner</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">The Area Directed Activity (ADA) Planner is a special module designed to account for Enabling Objectives (EOs) that are completed outside of your regular corps/squadron training nights, such as at regional or area-level events.</p>
                <h4 className="font-semibold">Core Purpose</h4>
                <p>The primary function of this planner is to ensure that EOs completed at ADAs are correctly reflected in your overall training completion statistics on the Dashboard. There are no dates, instructors, or locations to manage here—it is purely for record-keeping.</p>
                <h4 className="font-semibold">How to Use It</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click the "Add New ADA Planner" button to create a container for an activity. Give it a descriptive name (e.g., "Fall FTX 2024").</li>
                    <li>From the floating "Training Objectives" panel, find the EOs that were covered during the ADA.</li>
                    <li>Drag and drop each completed EO into the grid for the corresponding ADA planner.</li>
                    <li>Each planner can hold up to 60 EOs. Any mandatory EOs you add here will immediately update the progress bars on your Dashboard.</li>
                </ol>
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
                            <li><strong>Duty Personnel:</strong> Pulled from the Duty Roster you configure in Corps Management.</li>
                            <li><strong>Dress of the Day:</strong> Pulled from the setting on the Annual Planner for that date.</li>
                            <li><strong>Upcoming Activities:</strong> Populated from the "Weekly Activities" you define in Settings.</li>
                        </ul>
                    </li>
                    <li>Fill in the remaining fields (e.g., CO Name, Announcements, Notes).</li>
                    <li>Optionally, upload a corps logo.</li>
                    <li>Click "Generate WRO PDF". A PDF file will be created and downloaded.</li>
                </ol>
                <h4 className="font-semibold">Other Reports</h4>
                <p>The reports page also includes several other useful reports that can be generated as PDFs:</p>
                <ul className="list-disc list-inside">
                    <li><strong>Cadet Roster:</strong> A complete list of all cadets.</li>
                    <li><strong>Attendance:</strong> Includes a Summary, Daily Report, Perfect Attendance list, and At-Risk Cadets list.</li>
                    <li><strong>Training Completion:</strong> Shows the progress of mandatory training for each phase.</li>
                    <li><strong>Award Winners:</strong> A list of all awards and their assigned winners.</li>
                    <li><strong>Corps Assets:</strong> A full inventory of all corps-owned assets.</li>
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
                 <p>Use the "Add New Cadet" form. Fill in their details, including their current Phase / Level / Star Level and an optional role (if you've configured any in Settings). The list of available ranks is also managed on this page.</p>
                <h4 className="font-semibold">Editing or Removing a Cadet</h4>
                <p>The "Cadet Roster" table lists all your cadets. Use the pencil icon to edit a cadet's details or the 'X' icon to remove them.</p>
                 <h4 className="font-semibold">Cadet Settings</h4>
                <p>You can manage the available ranks and roles for cadets in the accordion at the bottom of the page.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>
          
           <Card id="asset-management">
            <AccordionItem value="asset-management" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Building2 className="h-6 w-6" />Asset Management</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This is where you manage global corps assets. This data persists across all training years.</p>
                 <p>Use the "Add New Asset" form to add items to your corps' inventory. You can track details like category, serial number, status, condition, and location. This data is available in a printable report on the Reports page.</p>
                 <p>You can also manage the list of available asset categories on this page.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="staff-management">
            <AccordionItem value="staff-management" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Contact className="h-4 w-4" />Staff Management</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This is where you manage your staff roster and duty assignments. This data persists across all training years.</p>
                <h4 className="font-semibold">Staff Roster & Duties</h4>
                 <p>Manage your staff roster (Officers and POs/NCMs) and assign their parade night duties in the <strong>Duty Roster</strong>. The duty roster assignments automatically populate the Duty Personnel section of the WRO for the corresponding date.</p>
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
                    <li>Click "Save Attendance" to save your changes. This data is crucial for generating accurate attendance reports and for the AI-powered award eligibility checks.</li>
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
                <p>Create a new training year, switch between existing years, or delete the active year. When creating a new year, you have the option to copy all data from a previous year, or import data from a shared file. An AI-powered feature can intelligently map a copied schedule to the new calendar, automatically adjusting for different start dates and holidays.</p>
                
                <h4 className="font-semibold">Planning Resources</h4>
                <p>Customize the lists used throughout the planners. This includes creating and managing classrooms and custom EOs.</p>
                
                <h4 className="font-semibold">Data Management</h4>
                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Full Application Backup:</strong> Download a single JSON file containing all your data across all training years. This is useful for personal backups and disaster recovery.</li>
                    <li><strong>Export Single Training Year:</strong> You can export the data for a single training year to a shareable `.json` file.</li>
                    <li><strong>Importing Data:</strong> Another user can import a shared file when creating a new training year on their account, allowing for easy sharing of plans.</li>
                </ul>
                
                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive"/>Danger Zone</h4>
                <p>The "Reset Application" button will permanently delete <strong>all</strong> of your data from the cloud, including all training years, schedules, cadets, and settings associated with your account. This action is irreversible and cannot be undone. Use this with extreme caution.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="about">
            <AccordionItem value="about" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Info className="h-6 w-6" />About</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This page contains version information, credits, contact details, and software licensing for the application.</p>
                <h4 className="font-semibold">Disclaimer</h4>
                <p>This is an unofficial planning tool and is not endorsed by the Canadian Cadet Organization (CCO) or the Department of National Defence (DND).</p>
                 <h4 className="font-semibold">Changelog</h4>
                <p>Click the "View Changelog" button to see a detailed history of all updates and new features added to the application.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

        </Accordion>
      </div>
    </>
  );
}
