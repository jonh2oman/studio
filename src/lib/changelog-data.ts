
import type { ChangelogEntry } from './types';

export const changelogData: ChangelogEntry[] = [
  {
    version: "1.4.0",
    date: "August 15, 2024",
    changes: [
      "New visual theme: Implemented a vibrant, animated 'liquid glass' UI throughout the application for a more modern aesthetic.",
      "UI/UX Polish: Enhanced contrast on page headers and improved visibility of floating action buttons.",
      "UI/UX Polish: Increased the font weight of main navigation headings for better readability.",
      "Fix: Corrected a critical timezone bug in the ZTO Portal that caused incorrect training day display on imported plans.",
      "Fix: Resolved a crash in the Training Completion Report caused by incorrect data aggregation.",
      "The ZTO Plan Review Portal has been temporarily disabled with a tooltip to indicate it's a future feature, preventing confusion.",
      "Added a classic easter egg for observant users to discover on the dashboard. Up, up, down, down...",
    ]
  },
  {
    version: "1.3.2",
    date: "August 13, 2024",
    changes: [
      "Enhanced login and signup pages with a centered, modern card layout.",
      "Upgraded the Help & Instructions panel to a full-height sliding sheet for a better user experience.",
      "Added a subtle pulse animation to the Help button to improve discoverability.",
      "Increased the width of planner day cards for improved readability and aesthetics.",
      "Security: Implemented domain restriction on the signup page to only allow `@cadets.gc.ca` and `@forces.gc.ca` emails.",
      "Fixed numerous bugs, including score calculation and database save errors in the Marksmanship module.",
    ]
  },
  {
    version: "1.3.1",
    date: "August 12, 2024",
    changes: [
      "Major Feature: Added a comprehensive Marksmanship module to record grouping and competition scores and track cadet achievements.",
      "Fix: Resolved a critical issue causing the application to crash when using the search bar in the Help & Instructions panel.",
      "Fix: Corrected a race condition during login that could cause a user's data to be overwritten with a blank profile. This also resolves errors when creating a new training year.",
      "UI Fix: Added a dedicated 'Manage PO/NCM Ranks' and 'Manage PO/NCM Roles' card to the Staff Management page for better organization.",
      "Security: Implemented stricter password complexity requirements on the signup page.",
      "UI Fix: Replaced the ship icon with a user icon on the login and signup pages for better context."
    ]
  },
  {
    version: "1.3.0",
    date: "August 10, 2024",
    changes: [
      "Major Feature: Added full support for all three cadet elements (Sea, Army, and Air).",
      "Integrated the complete, official training programs for Army and Air Cadets.",
      "New Feature: Added ZTO Plan Review Portal for supervisory staff to import and review multiple training plans.",
      "New Feature: Added LSA Wish List module to create and manage annual purchase requests.",
      "New Feature: Added a safe data export/import system. Users can now export individual training years to share.",
      "New Feature: Added the ability to delete a training year from the Settings page.",
      "Enhancement: The 'Element' setting in a training year is now locked after planning begins to prevent data corruption.",
      "Enhancement: The application now automatically migrates older data structures to include the 'element' property, ensuring compatibility with new features.",
      "UI Fix: Corrected a bug that could cause a crash when editing a scheduled lesson without an assigned instructor/classroom.",
      "UI Fix: Shortened long menu items (e.g., 'CSTP - Annual') for a cleaner interface.",
      "UI Improvement: Added a frosted glass aesthetic throughout the application for a more modern look.",
      "UX Improvement: The 'Invite Staff' button now opens the user's default email client with a pre-filled message, clarifying the invitation process.",
    ],
  },
  {
    version: "1.2.0",
    date: "August 5, 2024",
    changes: [
      "Major Architecture Upgrade: Migrated all application data from browser local storage to Firebase Firestore for real-time, secure cloud storage.",
      "Automatic Saving: All changes are now saved automatically to the user's account in the cloud.",
      "Cross-Device Sync: User data is now available on any device after logging in.",
      "Added full user authentication (Email/Password).",
      "Added drag-and-drop reordering for all settings cards on the Settings page, including nested cards.",
      "Added drag-and-drop reordering for navigation items within the sidebar.",
    ],
  },
  {
    version: "1.1.0",
    date: "August 1, 2024",
    changes: [
      "Added 'ADA Planner' module to account for EOs completed at Area Directed Activities.",
      "Improved UI Consistency: Standardized the layout across all planner pages.",
      "Refined conflict detection for instructor and classroom assignments.",
    ],
  },
    {
    version: "1.0.0",
    date: "July 28, 2024",
    changes: [
        "Initial application release.",
        "Implemented core planning features for Annual, Weekend, and LDA schedules.",
        "Added modules for Cadet Management, Attendance, Awards, and Reports.",
        "Included AI-powered features for award eligibility and schedule copying.",
        "Configured settings for comprehensive corps customization.",
    ]
  }
];
