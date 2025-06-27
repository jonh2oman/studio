
export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelogData: ChangelogEntry[] = [
  {
    version: "1.0.1 Beta",
    date: "Current Version",
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
    date: "Initial Release",
    changes: [
        "Initial application release.",
        "Implemented core planning features for Annual, Weekend, and LDA schedules.",
        "Added modules for Cadet Management, Attendance, Awards, and Reports.",
        "Included AI-powered features for award eligibility and schedule copying.",
        "Configured settings for comprehensive corps customization.",
    ]
  }
];
