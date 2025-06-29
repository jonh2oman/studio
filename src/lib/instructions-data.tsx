
"use client";

import React from 'react';
import { CardContent } from "@/components/ui/card";
import { List, Calendar, FileText, Users, ClipboardCheck, Trophy, Settings2, Sparkles, AlertTriangle, Database, Puzzle, Rocket, Info, ClipboardList, Building2, Contact, ShoppingCart, FolderKanban, Target } from "lucide-react";

export const instructionsData = [
    { 
        id: "getting-started", 
        title: "Getting Started: Core Concepts", 
        icon: Rocket, 
        content: (
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
        )
    },
    { 
        id: "dashboard", 
        title: "Dashboard", 
        icon: List, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>The dashboard provides an at-a-glance overview of your training year and quick access to all modules.</p>
                <h4 className="font-semibold text-foreground">Mandatory Training Planning Progress</h4>
                <p>This section displays progress bars for each Phase / Level / Star Level, showing the percentage of mandatory training periods that have been scheduled across all planners (Annual, Weekend, LDA, and ADA). The calculation is based on unique Enabling Objectives (EOs), so scheduling the same lesson multiple times correctly contributes to the total periods completed.</p>
                <h4 className="font-semibold text-foreground">Navigation Cards</h4>
                <p>Each card on the dashboard links to a major module of the application. The categories can be expanded or collapsed to keep the view tidy. Simply click on a card to navigate to the respective page.</p>
            </CardContent>
        )
    },
    { 
        id: "planners", 
        title: "The Planners (Annual, Weekend, LDA)", 
        icon: Calendar, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>The application includes three planners for different scheduling needs. All planners feature a sticky header, so page controls are always accessible. All scheduled activities, regardless of the planner used, contribute to the overall training progress on the Dashboard.</p>
                <h4 className="font-semibold text-foreground">The Objectives Panel</h4>
                <p>This floating panel is your palette of lessons. It can be moved anywhere on the screen and resized to your liking. It contains all official EOs for your selected element, plus any custom EOs you've created in Settings. Use the search bar to quickly find what you need.</p>
                <h4 className="font-semibold text-foreground">Core Mechanic: Drag & Drop</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Find the lesson (EO) you want to schedule in the floating "Training Objectives" panel.</li>
                    <li>Click and drag the lesson from the list.</li>
                    <li>Drop it onto the desired Phase / Level / Star Level slot for a specific Period on a specific day.</li>
                    <li>Once an EO is scheduled, click on it to open a dialog where you can assign an Instructor and a Classroom. The app will warn you if you create a scheduling conflict (e.g., assigning the same instructor to two places at once).</li>
                </ol>
                <h4 className="font-semibold text-foreground">CSAR Planning (Weekends & LDAs)</h4>
                <p>The Weekend and LDA planners include a Cadet Support and Activity Request (CSAR) section for each day.</p>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Toggle "CSAR Required?" to 'Yes'. This enables the other toggles and the "Plan CSAR" button.</li>
                    <li>Click "Plan CSAR" to open a detailed planning sheet with tabs for Details, Meal Plan, and J4 (equipment).</li>
                    <li>Fill out the form. The data is saved automatically as you fill it out.</li>
                    <li>Track the submission and approval status using the toggles on the main planner page.</li>
                </ul>
            </CardContent>
        )
    },
    { 
        id: "ada", 
        title: "ADA Planner", 
        icon: ClipboardList, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>The Area Directed Activity (ADA) Planner is a special module designed to account for Enabling Objectives (EOs) that are completed outside of your regular corps/squadron training nights, such as at regional or area-level events.</p>
                <h4 className="font-semibold text-foreground">Core Purpose</h4>
                <p>The primary function of this planner is to ensure that EOs completed at ADAs are correctly reflected in your overall training completion statistics on the Dashboard. There are no dates, instructors, or locations to manage here—it is purely for record-keeping.</p>
                <h4 className="font-semibold text-foreground">How to Use It</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click the "Add New ADA Planner" button to create a container for an activity. Give it a descriptive name (e.g., "Fall FTX 2024").</li>
                    <li>From the floating "Training Objectives" panel, find the EOs that were covered during the ADA.</li>
                    <li>Drag and drop each completed EO into the grid for the corresponding ADA planner.</li>
                    <li>Each planner can hold up to 60 EOs. Any mandatory EOs you add here will immediately update the progress bars on your Dashboard.</li>
                </ol>
            </CardContent>
        )
    },
     { 
        id: "marksmanship", 
        title: "Marksmanship", 
        icon: Target, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This module allows you to track cadet marksmanship scores for both grouping and competition targets, and it automatically maintains a record of their highest achieved classification.</p>
                <h4 className="font-semibold text-foreground">Entering a New Score</h4>
                <p>Use the "Enter New Score" form on the left side of the page.</p>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Select the cadet and the date of the shoot.</li>
                    <li>Choose the target type: "Grouping" or "Competition".</li>
                    <li><strong>For Grouping:</strong> Enter the two 5-shot group measurements in centimeters. The form will immediately show you what classification level (e.g., "Marksman", "Expert") those scores qualify for.</li>
                    <li><strong>For Competition:</strong> Enter the score (0-10) for each of the 10 scoring diagrams. The form will show a running total.</li>
                    <li>Add any optional notes and click "Add Score Record".</li>
                </ol>
                <h4 className="font-semibold text-foreground">Achievements List</h4>
                <p>The main table on this page provides an at-a-glance summary for every cadet. It automatically calculates and displays:</p>
                <ul className="list-disc list-inside">
                    <li>Their highest achieved classification badge from all their grouping scores.</li>
                    <li>Their best score out of 100 from all their competition scores.</li>
                </ul>
                <p>Click the "View" icon on any cadet's row to see a popup with a complete history of all their recorded scores for the year.</p>
            </CardContent>
        )
    },
    { 
        id: "reports", 
        title: "Reports", 
        icon: FileText, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This module allows you to generate a PDF of the Weekly Routine Orders (WRO) and view other key reports.</p>
                <h4 className="font-semibold text-foreground">Generating a WRO</h4>
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
                <h4 className="font-semibold text-foreground">Other Reports</h4>
                <p>The reports page also includes several other useful reports that can be generated as PDFs:</p>
                <ul className="list-disc list-inside">
                    <li><strong>Cadet Roster:</strong> A complete list of all cadets.</li>
                    <li><strong>Attendance:</strong> Includes a Summary, Daily Report, Perfect Attendance list, and At-Risk Cadets list.</li>
                    <li><strong>Training Completion:</strong> Shows the progress of mandatory training for each phase.</li>
                    <li><strong>Award Winners:</strong> A list of all awards and their assigned winners.</li>
                    <li><strong>Corps Assets:</strong> A full inventory of all corps-owned assets.</li>
                </ul>
            </CardContent>
        )
    },
    { 
        id: "cadets", 
        title: "Cadet Management", 
        icon: Users, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is where you manage your corps' roster for the current training year.</p>
                 <h4 className="font-semibold text-foreground">Adding a Cadet</h4>
                 <p>Use the "Add New Cadet" form. Fill in their details, including their current Phase / Level / Star Level and an optional role (if you've configured any in Settings). The list of available ranks is also managed on this page.</p>
                <h4 className="font-semibold text-foreground">Editing or Removing a Cadet</h4>
                <p>The "Cadet Roster" table lists all your cadets. Use the pencil icon to edit a cadet's details or the 'X' icon to remove them.</p>
                 <h4 className="font-semibold text-foreground">Cadet Settings</h4>
                <p>You can manage the available ranks and roles for cadets in the accordion at the bottom of the page.</p>
            </CardContent>
        )
    },
    { 
        id: "asset-management", 
        title: "Asset Management", 
        icon: Building2, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is where you manage global corps assets. This data persists across all training years.</p>
                 <p>Use the "Add New Asset" form to add items to your corps' inventory. You can track details like category, serial number, status, condition, and location. This data is available in a printable report on the Reports page.</p>
                 <p>You can also manage the list of available asset categories on this page.</p>
            </CardContent>
        )
    },
    { 
        id: "staff-management", 
        title: "Staff Management", 
        icon: Contact, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is where you manage your staff roster and duty assignments. This data persists across all training years.</p>
                <h4 className="font-semibold text-foreground">Staff Roster & Duties</h4>
                 <p>Manage your staff roster (Officers and POs/NCMs) and assign their parade night duties in the <strong>Duty Roster</strong>. The duty roster assignments automatically populate the Duty Personnel section of the WRO for the corresponding date.</p>
            </CardContent>
        )
    },
    { 
        id: "lsa", 
        title: "LSA Wish List", 
        icon: ShoppingCart, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Create and manage your annual Local Support Allocation (LSA) request list. This is where you can track items your corps/squadron wishes to purchase, along with quantities, prices, and links.</p>
                <h4 className="font-semibold text-foreground">Tracking Items</h4>
                 <p>Use the form to add items, including names, descriptions, and pricing information. You can also upload a price screenshot for your records. The main table will keep a running total of your requested budget.</p>
            </CardContent>
        )
    },
    { 
        id: "attendance", 
        title: "Attendance", 
        icon: ClipboardCheck, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Track cadet attendance for specific training nights.</p>
                <h4 className="font-semibold text-foreground">Taking Attendance</h4>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Select a training night using the calendar. Your regular training days (set in Settings) are highlighted.</li>
                    <li>For each cadet, select their status: Present, Absent, or Excused.</li>
                    <li>Use the checkboxes to mark if a cadet Arrived Late or Left Early.</li>
                    <li>Click "Save Attendance" to save your changes. This data is crucial for generating accurate attendance reports and for the AI-powered award eligibility checks.</li>
                </ol>
            </CardContent>
        )
    },
    { 
        id: "awards", 
        title: "Awards Management", 
        icon: Trophy, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Manage corps awards and determine eligible cadets using AI assistance.</p>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />AI-Powered Eligibility Check</h4>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Expand an award to view its criteria.</li>
                    <li>Click the <strong>"Check Eligibility with AI"</strong> button.</li>
                    <li><strong>Automatic Logic:</strong> The application sends the award criteria and your entire cadet roster (including their calculated attendance percentages) to an AI model. The AI analyzes this data and returns a list of cadets who meet all requirements.</li>
                    <li>The "Eligible Cadets" section will update to show the results.</li>
                </ul>
                <h4 className="font-semibold text-foreground">Assigning Winners</h4>
                <p>From the list of eligible cadets, click the "Select" button to mark a cadet as a winner. You can select multiple winners for corps awards. The winner's name will appear in the award title for easy reference.</p>
                <h4 className="font-semibold text-foreground">Managing Awards</h4>
                <p>You can add, edit, or delete award definitions. Note that award definitions are global across all training years, but winners are specific to each year.</p>
            </CardContent>
        )
    },
    { 
        id: "zto-portal", 
        title: "ZTO Plan Review Portal", 
        icon: FolderKanban, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This module is for Zone Training Officers (ZTOs) or other supervisory staff to review multiple training plans from different corps/squadrons.</p>
                <h4 className="font-semibold text-foreground">Importing and Viewing Plans</h4>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Click "Import Plan" to open the import dialog.</li>
                    <li>Give the plan a recognizable name (e.g., "288 Ardent") and upload the `.json` file provided by the corps/squadron.</li>
                    <li>Once imported, the plan will appear as a card on the main page.</li>
                    <li>Click the "View Plan" button on a card to open a full-screen, read-only version of that unit's annual training calendar for review.</li>
                </ol>
            </CardContent>
        )
    },
    { 
        id: "settings", 
        title: "Settings", 
        icon: Settings2, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Configure the application to match your corps' specific needs. Changes here can affect automatic logic in other modules.</p>
                <h4 className="font-semibold text-foreground">Training Year Management</h4>
                <p>Create a new training year, switch between existing years, or delete the active year. When creating a new year, you have the option to copy all data from a previous year, or import from a shared file. An AI-powered feature can intelligently map a copied schedule to the new calendar, automatically adjusting for different start dates and holidays.</p>
                <h4 className="font-semibold text-foreground">Planning Resources</h4>
                <p>Customize the lists used throughout the planners. This includes creating and managing classrooms and custom EOs.</p>
                <h4 className="font-semibold text-foreground">Data Management</h4>
                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Full Application Backup:</strong> Download a single JSON file containing all your data across all training years. This is useful for personal backups and disaster recovery.</li>
                    <li><strong>Export Single Training Year:</strong> You can export the data for a single training year to a shareable `.json` file.</li>
                    <li><strong>Importing Data:</strong> Another user can import a shared file when creating a new training year on their account, allowing for easy sharing of plans.</li>
                </ul>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive"/>Danger Zone</h4>
                <p>The "Reset Application" button will permanently delete <strong>all</strong> of your data from the cloud, including all training years, schedules, cadets, and settings associated with your account. This action is irreversible and cannot be undone. Use this with extreme caution.</p>
            </CardContent>
        )
    },
    { 
        id: "about", 
        title: "About", 
        icon: Info, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This page contains version information, credits, contact details, and software licensing for the application.</p>
                <h4 className="font-semibold text-foreground">Disclaimer</h4>
                <p>This is an unofficial planning tool and is not endorsed by the Canadian Cadet Organization (CCO) or the Department of National Defence (DND).</p>
                 <h4 className="font-semibold text-foreground">Changelog</h4>
                <p>Click the "View Changelog" button to see a detailed history of all updates and new features added to the application.</p>
            </CardContent>
        )
    },
];
