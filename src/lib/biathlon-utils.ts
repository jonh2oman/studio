
"use client";

import type { BiathlonCategory } from './types';
import { differenceInYears, parseISO } from 'date-fns';

export function getBiathlonCategory(dob: string, trainingYear: string): BiathlonCategory {
  if (!dob || !trainingYear) {
    return 'N/A';
  }

  try {
    const dobDate = parseISO(dob);
    const endYear = parseInt(trainingYear.split('-')[1], 10);
    // The rule is "two days after the final day of the National Cadet Biathlon Championship"
    // which is typically in early March. We'll use March 15th as a safe, consistent cutoff.
    const championshipDate = new Date(endYear, 2, 15); // March 15th

    const age = differenceInYears(championshipDate, dobDate);

    if (age < 15) return 'Junior';
    if (age >= 15 && age < 17) return 'Senior';
    if (age >= 17 && age < 19) return 'Youth';
    
    return 'N/A'; // For cadets over 19
  } catch (error) {
    console.error("Error calculating biathlon category:", error);
    return 'N/A';
  }
}
