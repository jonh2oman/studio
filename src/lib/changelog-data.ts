
import type { ChangelogEntry } from './types';

export const changelogData: ChangelogEntry[] = [
  {
    version: "1.2.0",
    date: "Current Version",
    changes: [
      "Added new 'Corps Management' module for tracking corps-owned assets.",
      "Implemented a comprehensive Asset Tracker with add, edit, and remove functionality.",
      "Added a 'Corps Assets' report to the Reports module.",
      "Updated application instructions and changelog.",
      "Fixed a persistent bug with the date picker in the 'New Training Year' dialog by replacing it with a standard date input field."
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
      "Production-Ready Authentication: Removed mock authentication mode. The application now exclusively uses Firebase for login and signup.",
      "Improved UI Consistency: Standardized the layout across all planner pages.",
      "Fixed multiple bugs related to component state and initialization."
    ],
  },
  {
    version: "1.0.3 Beta",
    date: "July 31, 2024",
    changes: [
        "Reworked Staff Management system, adding role creation, primary/additional roles, permanent roles, and dynamic fields based on staff type.",
        "Enhanced Cadet Management with a new system for creating and assigning custom Cadet Roles.",
        "Overhauled the planner UI with a draggable, resizable, and searchable floating objectives panel and sticky headers.",
        "Added a system for creating and managing custom, corps-specific Enabling Objectives (EOs) in the Settings page.",
        "Integrated full Firebase Authentication (Email/Password and Google) which activates when API keys are provided.",
        "Removed the experimental theme switcher to simplify the UI and set a new default accent color.",
        "Various minor bug fixes and usability improvements across the application.",
    ],
  },
  {
    version: "1.0.2 Beta",
    date: "July 30, 2024",
    changes: [
        "Implemented a robust user authentication system with sign-up, login, and logout functionality.",
        "Added a mock authentication mode to allow for testing and development without requiring Firebase credentials.",
        "Fixed a critical bug causing 'maximum update depth exceeded' errors on the Settings page.",
        "Resolved a crash related to missing Firebase API keys by implementing a graceful fallback.",
        "Fixed an import error for `usePathname` in the sidebar component.",
    ],
  },
  {
    version: "1.0.1 Beta",
    date: "July 29, 2024",
    changes: [
        "Added a comprehensive changelog to track application updates.",
        "Updated application version to 1.0.1 Beta.",
        "Corrected HTML nesting issues causing hydration errors in the sidebar menu.",
        "Added a prominent disclaimer to the About page regarding official CCO use.",
        "Updated the Instructions page with detailed, current information and highlighted automatic logic.",
        "Personalized author and contact information on the About page.",
        "Set the Dashboard as the default highlighted page on application start.",
        "Applied consistent border styling to cards on the Dashboard and Settings pages.",
        "Removed the experimental Guided Setup feature to improve stability.",
        "Resolved a server startup conflict related to port assignment.",
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
