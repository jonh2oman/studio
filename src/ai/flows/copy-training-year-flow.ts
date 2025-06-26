'use server';
/**
 * @fileOverview An AI flow to copy a training schedule from one year to the next.
 *
 * - copyTrainingSchedule - A function that handles the schedule copy process.
 * - CopyScheduleInput - The input type for the copyTrainingSchedule function.
 * - CopyScheduleOutput - The return type for the copyTrainingSchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CopyScheduleInputSchema = z.object({
  sourceScheduleJson: z.string().describe('The JSON string of the source training schedule.'),
  sourceTrainingYearStart: z.string().describe('The start date of the source training year (YYYY-MM-DD).'),
  targetTrainingYearStart: z.string().describe('The start date of the new training year (YYYY-MM-DD).'),
  trainingDayOfWeek: z.number().min(0).max(6).describe('The day of the week for training (0=Sunday, 1=Monday, ...).'),
});
export type CopyScheduleInput = z.infer<typeof CopyScheduleInputSchema>;

// We expect a JSON string as output that can be parsed into a Schedule object.
const CopyScheduleOutputSchema = z.object({
  newScheduleJson: z.string().describe('The JSON string of the newly generated training schedule for the target year.'),
});
export type CopyScheduleOutput = z.infer<typeof CopyScheduleOutputSchema>;

export async function copyTrainingSchedule(input: CopyScheduleInput): Promise<CopyScheduleOutput> {
  return copyScheduleFlow(input);
}

const copyPrompt = ai.definePrompt({
  name: 'copyTrainingSchedulePrompt',
  input: { schema: CopyScheduleInputSchema },
  output: { schema: CopyScheduleOutputSchema },
  prompt: `You are an expert administrative assistant for a Canadian Cadet Corps, specializing in yearly training schedules. Your task is to create a new training schedule for a new training year based on a previous year's schedule.

You will be given the source schedule as a JSON object, the start date of the source training year, the start date of the new target training year, and the designated training day of the week (where Sunday is 0).

The keys of the JSON schedule object are in the format 'YYYY-MM-DD-Period-Phase'. You need to generate a new JSON schedule where the dates are adjusted for the new training year.

Follow these steps precisely:
1.  Analyze the source schedule to understand which lesson was taught on which training night. A training night is identified by its date.
2.  The first training night of the new year is the 'targetTrainingYearStart' date provided. All subsequent training nights will occur on the same day of the week, weekly from that start date.
3.  Map each training night from the source schedule to a corresponding training night in the new schedule. For example, the first training night in the source schedule maps to the first training night in the target schedule, the second to the second, and so on.
4.  For each entry in the source schedule, create a new entry in the target schedule with the updated date. The period and phase numbers must remain the same. The content of the scheduled item (the 'eo', 'instructor', 'classroom' object) must be copied exactly as it is.
5.  Maintain the same weekly cadence. If the source schedule skipped a week for a holiday, the new schedule should also have a corresponding gap.
6.  Return the new schedule as a single JSON string in the 'newScheduleJson' field.

## Source Information
- Source Training Year Start Date: {{{sourceTrainingYearStart}}}
- Target Training Year Start Date: {{{targetTrainingYearStart}}}
- Training Day of Week (0=Sun, 6=Sat): {{{trainingDayOfWeek}}}

## Source Schedule JSON
{{{sourceScheduleJson}}}
`,
});

const copyScheduleFlow = ai.defineFlow(
  {
    name: 'copyScheduleFlow',
    inputSchema: CopyScheduleInputSchema,
    outputSchema: CopyScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await copyPrompt(input);
    return output!;
  }
);
