
"use client";

import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListChecks, Calendar, Tent, ClipboardPlus, FileText, Users, ClipboardCheck, Trophy, Settings2, BookOpen, HelpCircle } from "lucide-react";

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
              <li><a href="#planner"><p className="flex items-center gap-2"><Calendar className="h-4 w-4" />Corps/Squadron Training Plan - Annual</p></a></li>
              <li><a href="#weekend-planner"><p className="flex items-center gap-2"><Tent className="h-4 w-4" />Weekend Planner</p></a></li>
              <li><a href="#lda-planner"><p className="flex items-center gap-2"><ClipboardPlus className="h-4 w-4" />LDA Day Planner</p></a></li>
              <li><a href="#reports"><p className="flex items-center gap-2"><FileText className="h-4 w-4" />WRO Reports</p></a></li>
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
                <p className="text-muted-foreground">The dashboard is your central hub. It provides an at-a-glance overview of your training year and quick access to all modules.</p>
                <h4 className="font-semibold">Mandatory Training Progress</h4>
                <p>This section displays progress bars for each Phase, showing the percentage of mandatory training periods that have been scheduled in the Training, Weekend, and LDA planners. The calculation is based on unique EOs, so scheduling the same lesson multiple times won't inflate the percentage.</p>
                <h4 className="font-semibold">Navigation Cards</h4>
                <p>Each card on the dashboard links to a major module of the application. Simply click on a card to navigate to the respective page.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="planner">
            <AccordionItem value="planner" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Calendar className="h-6 w-6" />Corps/Squadron Training Plan - Annual</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">The Corps/Squadron Training Plan - Annual is designed for scheduling your weekly training nights throughout the corps year.</p>
                <h4 className="font-semibold">Scheduling a Lesson</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Find the lesson (EO) you want to schedule in the "Training Objectives" list on the left.</li>
                    <li>Click and drag the lesson from the list.</li>
                    <li>Drop the lesson onto the desired Phase slot for a specific Period on a specific training day.</li>
                </ol>
                <h4 className="font-semibold">Assigning Details</h4>
                 <p>Once a lesson is scheduled, click on it to open a dialog window. Here you can assign an Instructor and a Classroom from the lists you manage in the Settings.</p>
                <h4 className="font-semibold">View Modes</h4>
                <p>You can change the calendar's view using the toggles in the page header. Options include:</p>
                <ul className="list-disc list-inside">
                    <li><b>Day:</b> View one training day at a time.</li>
                    <li><b>Week:</b> View all training days within a single week.</li>
                    <li><b>Month:</b> View all training days within a selected month (default view).</li>
                    <li><b>Year:</b> View the entire training year. This view scrolls horizontally to show all months.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card id="weekend-planner">
            <AccordionItem value="weekend-planner" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Tent className="h-6 w-6" />Weekend Planner</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This planner is for scheduling multi-day events like training weekends. It's designed to handle a more intensive schedule.</p>
                <h4 className="font-semibold">How it Works</h4>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Use the calendar in the header to select the start date of the weekend.</li>
                    <li>The planner will display three consecutive days, each with 9 periods available for all four Phases.</li>
                    <li>Drag and drop lessons from the Objectives list on the left, just like in the main Corps/Squadron Training Plan - Annual.</li>
                    <li>Any lesson scheduled here will count towards the overall training completion on the Dashboard.</li>
                </ol>
                <h4 className="font-semibold">CSAR Planning</h4>
                <p>Each day card in the LDA and Weekend planners includes a CSAR (Cadet Support and Activity Request) section.</p>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Toggle "CSAR Required?" to 'Yes'. This will enable the other toggles and show the "Plan CSAR" button.</li>
                    <li>Click "Plan CSAR" to open a detailed planning sheet.</li>
                    <li>Fill out the form across the "Details", "Meal Plan", and "J4" tabs. The data is saved automatically as you fill it out.</li>
                    <li>You can track the submission and approval status using the toggles on the main planner page.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="lda-planner">
            <AccordionItem value="lda-planner" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                <div className="flex items-center gap-3"><ClipboardPlus className="h-6 w-6" />LDA Day Planner</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">Use this planner for single, ad-hoc training days (LDAs). It shares all data with the other planners.</p>
                 <h4 className="font-semibold">Planning an LDA</h4>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Use the calendar in the header to select a date to plan.</li>
                    <li>If you have previously planned days, you can use the "Jump to a Planned Day" section for quick navigation.</li>
                    <li>The main view shows a single day with 9 periods for each of the four Phases. Drag and drop lessons as needed.</li>
                </ol>
                 <h4 className="font-semibold">CSAR Planning</h4>
                <p>Each day card in the LDA and Weekend planners includes a CSAR (Cadet Support and Activity Request) section.</p>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Toggle "CSAR Required?" to 'Yes'. This will enable the other toggles and show the "Plan CSAR" button.</li>
                    <li>Click "Plan CSAR" to open a detailed planning sheet.</li>
                    <li>Fill out the form across the "Details", "Meal Plan", and "J4" tabs. The data is saved automatically as you fill it out.</li>
                    <li>You can track the submission and approval status using the toggles on the main planner page.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>

           <Card id="reports">
            <AccordionItem value="reports" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><FileText className="h-6 w-6" />WRO Reports</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This module allows you to generate a PDF of the Weekly Routine Orders (WRO) for a specific training night.</p>
                <h4 className="font-semibold">Generating a WRO</h4>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Select the Training Date for the WRO. The schedule for this date will be automatically pulled from the planners.</li>
                    <li>Fill in the required fields like RO #, Duty Personnel, and CO Name.</li>
                    <li>Optionally, upload a corps logo and add announcements.</li>
                    <li>Click "Generate WRO PDF". A PDF file will be created and downloaded to your computer.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Card>
          
           <Card id="cadets">
            <AccordionItem value="cadets" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Users className="h-6 w-6" />Cadet Management</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">This is where you manage your corps' roster.</p>
                 <h4 className="font-semibold">Adding a Cadet</h4>
                 <p>Use the "Add New Cadet" form. Fill in their details, including their current Phase. Ranks are managed in the Settings page.</p>
                <h4 className="font-semibold">Editing or Removing a Cadet</h4>
                <p>The "Cadet Roster" table lists all your cadets. Use the pencil icon to edit a cadet's details (including their phase) or the 'X' icon to remove them.</p>
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
                    <li>Select a training night using the calendar. The calendar will highlight your regular training days as defined in Settings.</li>
                    <li>For each cadet, select their status: Present, Absent, or Excused.</li>
                    <li>Use the checkboxes to mark if a cadet Arrived Late or Left Early.</li>
                    <li>Click "Save Attendance" to store the records. This data is used for the Awards module.</li>
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
                <p className="text-muted-foreground">Manage corps awards and determine eligible cadets.</p>
                <h4 className="font-semibold">How it Works</h4>
                <p>The page displays all National and Corps awards. The system automatically checks each cadet's eligibility based on their Phase and attendance record.</p>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Click on an award to expand it and view its criteria and description.</li>
                    <li>The "Eligible Cadets" section will list all cadets who currently meet the criteria for that award.</li>
                    <li>To assign an award, click the "Select" button next to a cadet's name. They will be marked as the winner.</li>
                    <li>The winner's name will appear in the award title, and their button will change to "Winner".</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>
          
           <Card id="settings">
            <AccordionItem value="settings" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl">
                 <div className="flex items-center gap-3"><Settings2 className="h-6 w-6" />Settings</div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <p className="text-muted-foreground">Configure the application to match your corps' specific needs.</p>
                <h4 className="font-semibold">Training Schedule</h4>
                <p>Set your corps name, the day of the week you hold training, and the official first training night of the year. This date is used as the starting point for the planners.</p>
                <h4 className="font-semibold">Manage Instructors, Classrooms, and Ranks</h4>
                <p>In these sections, you can add or remove items from the lists that are used throughout the application (e.g., in the schedule dialogs and cadet forms). This allows you to customize the tool to your specific personnel, locations, and rank structure.</p>
              </AccordionContent>
            </AccordionItem>
          </Card>

        </Accordion>
      </div>
    </>
  );
}

    