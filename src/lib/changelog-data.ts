
import type { ChangelogEntry } from './types';

export const changelogData: ChangelogEntry[] = [
  {
    version: "1.3.0",
    date: "Current Version",
    changes: [
      "Major Feature: Added full support for all three cadet elements (Sea, Army, and Air).",
      "Implemented element-specific terminology (e.g., 'Level' for Air, 'Star Level' for Army) throughout the application.",
      "Integrated the complete, official training programs for Army and Air Cadets.",
      "New Feature: Added a safe data export/import system. Users can now export individual training years to share.",
      "New Feature: Users can now create a new training year by importing a shared file.",
      "New Feature: Added the ability to delete a training year from the Settings page.",
      "Fixed a build error related to an incorrect closing tag on the Settings page.",
      "Resolved a data loading issue where new settings (like the 'Element' selector) would not appear for existing users.",
    ],
  },
  {
    version: "1.2.0",
    date: "August 5, 2024",
    changes: [
      "Removed all multi-user collaboration features to improve application stability and simplify the data model.",
      "Re-architected the data layer to be single-user, with all data securely tied to the logged-in user's account.",
      "Fixed a critical bug that caused application crashes ('Maximum update depth exceeded') when reordering items in the sidebar.",
      "Resolved a data hydration error that could occur when loading the dashboard with a custom layout.",
      "Rebranded application to 'Corps/Sqn Manager' and updated all relevant text and titles.",
      "Implemented a dynamic logo in the sidebar that displays the user's uploaded corps logo.",
      "Added drag-and-drop reordering for all settings cards on the Settings page, including nested cards.",
      "Added drag-and-drop reordering for navigation items within the sidebar.",
      "Relocated Cadet settings (Ranks, Roles, Dress) to the Cadet Management page for better organization.",
    ],
  },
  {
    version: "1.1.0",
    date: "August 1, 2024",
    changes: [
      "Major Architecture Upgrade: Migrated all application data from browser local storage to Firebase Firestore for real-time, secure cloud storage.",
      "Automatic Saving: All changes are now saved automatically to the user's account in the cloud.",
      "Added 'ADA Planner' module to account for EOs completed at Area Directed Activities.",
      "Cross-Device Sync: User data is now available on any device after logging in.",
      "Added full user authentication (Email/Password).",
      "Improved UI Consistency: Standardized the layout across all planner pages.",
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
