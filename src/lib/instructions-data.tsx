
"use client";

import React from 'react';
import { CardContent } from "@/components/ui/card";
import { List, Calendar, FileText, Users, ClipboardCheck, Trophy, Settings2, Sparkles, AlertTriangle, Database, Puzzle, Rocket, Info, ClipboardList, Building2, Contact, ShoppingCart, FolderKanban, Target, HelpCircle, Bug, CalendarDays, Palette, Shirt, Handshake, Store, Ship } from "lucide-react";
import { Badge } from '@/components/ui/badge';

export const instructionsData = [
    { 
        id: "getting-started", 
        title: "Getting Started: First Steps", 
        icon: Rocket, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Welcome! This application helps you plan and manage your entire cadet training year. To get started, there are a few key concepts to understand.</p>
                <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Database className="h-4 w-4"/>Everything is Saved in the Cloud</h4>
                    <p>When you sign up, a secure online space is created just for your corps. Every change you make—adding a cadet, scheduling a lesson—is saved automatically. This means your data is safe and you can log in from any computer to access it.</p>
                </div>
                 <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/>Everything is Organized by Training Year</h4>
                    <p>The app keeps all your information organized into "Training Years" (e.g., 2024-2025). Your first step is always to create a training year in the Settings page.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Puzzle className="h-4 w-4"/>Select Your Element First!</h4>
                    <p>After creating a training year, go to <span className="font-semibold text-foreground">Settings &gt; Corps Information</span> and choose your element: Sea, Army, or Air. This is very important because it loads the correct training program and terminology (like "Phase" vs. "Level") throughout the app.</p>
                </div>
            </CardContent>
        )
    },
    { 
        id: "dashboard", 
        title: "Dashboard: Your Home Base", 
        icon: List, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>The Dashboard is the first page you see after logging in. It gives you a quick overview of your progress and links to every other page in the app.</p>
                <h4 className="font-semibold text-foreground">Mandatory Training Planning Progress</h4>
                <p>This section shows progress bars for each Phase/Level. As you schedule mandatory lessons in any of the planners (Annual, Day/Weekend, or ADA), these bars will fill up automatically. This helps you see at-a-glance how much of the required training you have scheduled.</p>
                <h4 className="font-semibold text-foreground">Navigation Cards</h4>
                <p>The main part of the dashboard is a series of cards organized into categories like "Planning" and "Cadet Management". Just click on any card to go to that page.</p>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="h-4 w-4"/>A Small Secret</h4>
                <p>For those familiar with classic video games, try entering a famous up-down-left-right code on the dashboard page. A small, nautical surprise awaits!</p>
            </CardContent>
        )
    },
    { 
        id: "annual-planner", 
        title: "Annual Planner: Your Main Schedule", 
        icon: Calendar, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is where you will plan your regular, weekly training nights for the entire year.</p>
                <h4 className="font-semibold text-foreground">How to Schedule a Lesson</h4>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Find the date you want to plan for. The page is a long list of all your training nights for the year.</li>
                    <li>On the left side of the screen is the "Training Objectives" panel, which contains every lesson (EO) for your element.</li>
                    <li>Find the lesson you want to teach and simply <span className="font-semibold text-foreground">drag it with your mouse</span> from the left panel.</li>
                    <li><span className="font-semibold text-foreground">Drop the lesson</span> into the box for the correct Phase and Period on the date card.</li>
                    <li>Once a lesson is scheduled, you can type an instructor's name and a classroom location directly onto the lesson card. These details will automatically show up on the WRO.</li>
                </ol>
                <h4 className="font-semibold text-foreground">Setting the Dress of the Day</h4>
                <p>At the top of each date card, you can type in the Dress of the Day for CAF members and for Cadets. This will also automatically appear on the WRO for that date.</p>
            </CardContent>
        )
    },
    { 
        id: "day-planner", 
        title: "Day / Weekend Planner: Special Events", 
        icon: CalendarDays, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This planner is for any training that happens on a day that is <span className="font-semibold text-foreground">not</span> your regular weekly parade night. This is perfect for weekend exercises, drill team practices, or single-day events.</p>
                <h4 className="font-semibold text-foreground">How It Works</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click the "Add Day" button.</li>
                    <li>Give the event a name (e.g., "Fall FTX Day 1", "Band Practice") and select the date.</li>
                    <li>A new planner card will appear for that day, with a grid for all your phases.</li>
                    <li>Just like the Annual Planner, drag lessons from the left panel and drop them into the correct Period and Phase slots.</li>
                    <li>To plan a full weekend, simply create one "Day Plan" for Saturday and another for Sunday.</li>
                </ol>
            </CardContent>
        )
    },
    { 
        id: "ada", 
        title: "ADA Planner: Area-Level Training", 
        icon: ClipboardList, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>The Area Directed Activity (ADA) Planner is for keeping track of lessons that your cadets complete at events run by a higher headquarters (like your local Area or Region).</p>
                <h4 className="font-semibold text-foreground">Core Purpose</h4>
                <p>This page is just for <span className="font-semibold text-foreground">getting credit</span>. You don't need to enter dates or locations. By adding EOs here, you ensure the Dashboard progress bars are accurate.</p>
                <h4 className="font-semibold text-foreground">How to Use It</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click "Add New ADA Planner" and give it a name (e.g., "Fall FTX 2024").</li>
                    <li>Drag the lessons that were taught at that activity from the left panel into the new planner's box. That's it!</li>
                </ol>
            </CardContent>
        )
    },
    { 
        id: "cadets", 
        title: "Cadet Management: Your Roster", 
        icon: Users, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is where you manage your corps' list of cadets. The list you create here will be available everywhere else in the app.</p>
                 <h4 className="font-semibold text-foreground">Adding a Cadet</h4>
                 <p>Use the "Add New Cadet" form. Fill in their details. For things like "Rank" and "Role", the choices in the dropdown menus are managed by you!</p>
                 <h4 className="font-semibold text-foreground">Cadet Settings (Ranks and Roles)</h4>
                <p>At the bottom of the page, there is a "Cadet Settings" section. Open it to add all the possible ranks and roles (like Coxswain or Flag Party Commander) that exist at your unit. Once you add them here, they will be available to select when you add or edit a cadet.</p>
                <h4 className="font-semibold text-foreground">Editing or Removing a Cadet</h4>
                <p>The "Cadet Roster" table lists all your cadets. Use the pencil icon to edit a cadet's details or the 'X' icon to remove them. You can also print a simple ID card for each cadet using the printer icon.</p>
            </CardContent>
        )
    },
    { 
        id: "attendance", 
        title: "Attendance: Who's Here?", 
        icon: ClipboardCheck, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This page lets you take attendance for your training nights. Keeping this up-to-date is important for reports and for the AI-powered award eligibility checks.</p>
                <h4 className="font-semibold text-foreground">Taking Attendance</h4>
                 <ol className="list-decimal list-inside space-y-2">
                    <li>Use the calendar to pick the date of the training night. Your regular training days are highlighted to make them easy to find.</li>
                    <li>For each cadet in the list, choose their status: <Badge>Present</Badge>, <Badge variant="destructive">Absent</Badge>, or <Badge variant="secondary">Excused</Badge>.</li>
                    <li>You can also check the boxes for "Arrived Late" or "Left Early".</li>
                    <li>When you are finished, click the <span className="font-semibold text-foreground">"Save Attendance"</span> button. Your changes are not saved until you click this button.</li>
                </ol>
                 <h4 className="font-semibold text-foreground">Generating a Sign-in Sheet</h4>
                 <p>Click the "Generate Sheet" button to create a printable PDF attendance sheet for the selected date, which you can use for manual sign-ins.</p>
            </CardContent>
        )
    },
    { 
        id: "awards", 
        title: "Awards: Recognizing Excellence", 
        icon: Trophy, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Manage your corps' awards and use AI to help figure out who is eligible.</p>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Checking Eligibility with AI</h4>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Find an award in the list and click to expand it. You will see its criteria.</li>
                    <li>Click the <span className="font-semibold text-foreground">"Check Eligibility with AI"</span> button.</li>
                    <li>The app securely sends the award's rules and your full cadet roster (including their attendance percentage from the Attendance page) to an AI. The AI reads the rules, checks every cadet, and sends back a list of who is eligible.</li>
                    <li>The "Eligible Cadets" section will appear, showing you the cadets who meet the criteria.</li>
                </ul>
                <h4 className="font-semibold text-foreground">Assigning Winners</h4>
                <p>From the list of eligible cadets, click the "Select" button next to a cadet's name to mark them as a winner. The winner's name will appear at the top of the award card.</p>
                <h4 className="font-semibold text-foreground">Managing Awards</h4>
                <p>You can add your own unique corps awards, edit existing ones, or delete them using the buttons inside each award's panel.</p>
            </CardContent>
        )
    },
    { 
        id: "asset-management", 
        title: "Asset Management: Your Stuff", 
        icon: Building2, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This module helps you keep track of all the physical items the corps owns, like laptops, training gear, furniture, or boats. This data is global and shared across all training years.</p>
                 <p>Use the "Add New Asset" form to add items to the list. You can specify its name, category, serial number, condition, and current location. The "Asset Tracker" on the right shows your full inventory.</p>
                 <p>You can also manage the list of available asset categories in the "Manage Asset Categories" card.</p>
            </CardContent>
        )
    },
     { 
        id: "uniform-supply", 
        title: "Uniform Supply: Clothing & Parts", 
        icon: Shirt, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This module is for managing your uniform inventory and tracking what parts have been issued to which cadets.</p>
                 <h4 className="font-semibold text-foreground">Inventory</h4>
                 <p>Use the "Uniform Inventory" card to add all the uniform parts you have in stock. Click "Add Item" and specify the name, category, size, and how many you have. For example, "Combat Boots", size "10R", quantity "15".</p>
                <h4 className="font-semibold text-foreground">Issuing Items</h4>
                <p>Use the "Issue Uniform Part" form. Select a cadet and the specific item/size from your inventory that you want to issue to them. When you issue an item, the stock quantity in your inventory will automatically decrease by one.</p>
                 <h4 className="font-semibold text-foreground">Tracking and Returns</h4>
                <p>The "Issued Items" list shows every part that is currently signed out to a cadet. You can print a loan card for them to sign, or click the "Return" button when they bring the item back, which will automatically add it back to your inventory stock.</p>
            </CardContent>
        )
    },
    { 
        id: "loan-manager", 
        title: "Loan Manager: Borrowing Gear", 
        icon: Handshake, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This page is for loaning out your corps' non-uniform assets from the Asset Management page.</p>
                <p>Use the "Create New Loan" form to select an available asset and the cadet who is borrowing it, and set a return date. The item will then appear in the "Currently Loaned Items" list until it is marked as returned.</p>
            </CardContent>
        )
    },
     { 
        id: "staff-management", 
        title: "Staff Management: Your Team", 
        icon: Contact, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is where you manage your staff roster, user permissions, and duty assignments.</p>
                <h4 className="font-semibold text-foreground">Adding Staff</h4>
                <p>Use the "Add New Staff Member" form to build your staff roster. You can set their rank, roles, and contact info. For staff members who need to log in and use the app, be sure to enter their official email address and set their Access Level.</p>
                 <h4 className="font-semibold text-foreground">Inviting Users</h4>
                 <p>After adding a staff member with an email address, you can click the <Badge variant="outline" className="p-1"><MailPlus className="h-4 w-4"/></Badge> icon next to their name. This will open your computer's default email client with a pre-written invitation message. Just click "Send" in your email client to invite them to the app.</p>
                 <h4 className="font-semibold text-foreground">Duty Roster</h4>
                <p>Use the "Duty Roster" table to assign a Duty Officer and Duty PO for every parade night of the year. This information will be automatically pulled into the WRO for that specific date, saving you time.</p>
                 <h4 className="font-semibold text-foreground">Staff Settings</h4>
                <p>At the bottom of the page, you can customize the lists of ranks and roles available for Officers and PO/NCMs.</p>
            </CardContent>
        )
    },
     { 
        id: "lsa-wish-list", 
        title: "LSA Wish List: Your Shopping List", 
        icon: ShoppingCart, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This page helps you create and manage your annual Local Support Allocation (LSA) request list.</p>
                <p>Use the form to add items you wish to purchase for the corps. You can include details like quantity, price, a web link, and even upload a screenshot of the price for your records. The list will automatically calculate the total cost of all items on your wish list.</p>
            </CardContent>
        )
    },
    { 
        id: "reports", 
        title: "Reports: WROs & More", 
        icon: FileText, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This module allows you to generate a PDF of the Weekly Routine Orders (WRO) and view other key reports.</p>
                <h4 className="font-semibold text-foreground">Generating a WRO</h4>
                 <p>The WRO form is designed to be fast by automatically pulling information from other parts of the app.</p>
                 <ol className="list-decimal list-inside space-y-1">
                    <li>Select a Training Date.</li>
                    <li>The form will automatically fill in the Training Schedule, Duty Personnel, and Dress of the Day based on what you've entered on the Annual Planner and Staff Management pages.</li>
                    <li>Fill in any remaining fields, like Announcements.</li>
                    <li>Click "Generate WRO PDF" to download the file.</li>
                </ol>
                <h4 className="font-semibold text-foreground">Other Reports</h4>
                <p>Use the tabs to access other printable reports, including a full Cadet Roster, various Attendance reports, a Training Completion summary, and more.</p>
            </CardContent>
        )
    },
    { 
        id: "settings", 
        title: "Settings: The Control Panel", 
        icon: Settings2, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>This is the most important page for initial setup. It controls how the entire application works for your unit.</p>
                <h4 className="font-semibold text-foreground">General Settings</h4>
                <p>This is where you create new Training Years and set your core Corps Information like your unit's name and Element (Sea, Army, or Air).</p>
                <h4 className="font-semibold text-foreground">Planning Resources</h4>
                <p>Here you can customize the lists of items that appear in dropdown menus elsewhere in the app. This includes managing your list of classrooms, creating custom EOs for corps-specific training, and defining weekly recurring activities that will automatically show up on the WRO.</p>
                 <h4 className="font-semibold text-foreground">Data Management</h4>
                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Full Application Backup:</strong> Download a single file containing all of your data. This is a great way to keep a personal backup.</li>
                    <li><strong>Export Single Training Year:</strong> Create a file for just one training year. You can share this file with another user (e.g., your Zone Training Officer) for them to review.</li>
                </ul>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive"/>Danger Zone</h4>
                <p>The "Reset Application" button is permanent and will delete <strong>all</strong> of your data from the cloud. This action cannot be undone. Only use this if you want to start over from a completely blank slate.</p>
            </CardContent>
        )
    },
     { 
        id: "help-and-bugs", 
        title: "Help & Bug Reports", 
        icon: HelpCircle, 
        content: (
            <CardContent className="space-y-4 text-muted-foreground">
                <p>If you need help or find something that's not working correctly, use the floating buttons in the bottom-right corner of the screen.</p>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><HelpCircle className="h-4 w-4"/>Help Panel</h4>
                <p>Click the blue help button (<Badge variant="outline" className="p-1 inline-flex"><HelpCircle className="h-4 w-4"/></Badge>) to open this panel. You can search for instructions on any topic.</p>
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Bug className="h-4 w-4"/>Bug Reports</h4>
                <p>If you encounter an error, click the red bug report button (<Badge variant="outline" className="p-1 inline-flex"><Bug className="h-4 w-4"/></Badge>). This will open a form that helps you send a detailed report to the developer so the issue can be fixed.</p>
            </CardContent>
        )
    },
];
