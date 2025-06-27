
export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelogData: ChangelogEntry[] = [
  {
    version: "1.0.2 Beta",
    date: "Current Version",
    changes: [
        "Implemented a robust user authentication system with sign-up, login, and logout functionality.",
        "Added a mock authentication mode to allow for testing and development without requiring Firebase credentials.",
        "Introduced a theme switcher in Settings, allowing users to choose between four color schemes (Ocean, Blue, Green, Red).",
        "Moved the theme switcher into a new 'Make It Yours' card for better organization on the Settings page.",
        "Fixed a critical bug causing 'maximum update depth exceeded' errors on the Settings page.",
        "Resolved a crash related to missing Firebase API keys by implementing a graceful fallback.",
        "Fixed an import error for `usePathname` in the sidebar component.",
        "Improved the theme switcher's UX by providing immediate feedback on selection.",
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
