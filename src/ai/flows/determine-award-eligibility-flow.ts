
'use server';
/**
 * @fileOverview An AI flow to determine cadet eligibility for awards.
 *
 * - determineAwardEligibility - A function that analyzes award criteria against a cadet roster.
 * - AwardEligibilityInput - The input type for the determineAwardEligibility function.
 * - AwardEligibilityOutput - The return type for the determineAwardEligibility function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Zod schema for a single Cadet with attendance
const CadetWithAttendanceSchema = z.object({
  id: z.string(),
  rank: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phase: z.number(),
  attendancePercentage: z.number().describe("The cadet's attendance percentage for the training year."),
});

// Zod schema for a single Award
const AwardSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['National', 'Corps']),
  description: z.string(),
  criteria: z.array(z.string()).describe("A list of requirements a cadet must meet."),
  eligibility: z.string().describe("A general description of who is eligible for the award."),
  deadline: z.string().optional(),
  approval: z.string().optional(),
});

// Zod schema for the flow's input
const AwardEligibilityInputSchema = z.object({
  award: AwardSchema.describe("The award to check eligibility for."),
  cadets: z.array(CadetWithAttendanceSchema).describe("The full roster of cadets with their details."),
});
export type AwardEligibilityInput = z.infer<typeof AwardEligibilityInputSchema>;

// Zod schema for the flow's output
const AwardEligibilityOutputSchema = z.object({
  eligibleCadetIds: z.array(z.string()).describe("An array of IDs for the cadets who meet all the award criteria."),
});
export type AwardEligibilityOutput = z.infer<typeof AwardEligibilityOutputSchema>;


/**
 * Determines which cadets are eligible for a given award.
 * @param input The award and the list of cadets to check.
 * @returns A promise that resolves to an object containing the list of eligible cadet IDs.
 */
export async function determineAwardEligibility(input: AwardEligibilityInput): Promise<AwardEligibilityOutput> {
  return determineAwardEligibilityFlow(input);
}


const eligibilityPrompt = ai.definePrompt({
  name: 'determineAwardEligibilityPrompt',
  input: { schema: AwardEligibilityInputSchema },
  output: { schema: AwardEligibilityOutputSchema },
  prompt: `You are an expert administrative assistant for a Canadian Sea Cadet Corps. Your task is to determine which cadets from a roster are eligible for a specific award.

Carefully analyze the award's 'criteria' and 'eligibility' description. Compare these requirements against each cadet's data in the provided JSON list.

A cadet is only eligible if they meet ALL specified criteria.

Consider the following when making your determination:
- **Phase requirements:** Check the cadet's 'phase' property. "Senior cadet" typically means Phase 3 or higher. "Junior cadet" is Phase 2 or lower.
- **Attendance:** If a percentage is mentioned (e.g., ">=75%"), check the 'attendancePercentage' property.
- **Rank and other details:** Use the other properties of the cadet object to evaluate other criteria.

Return a JSON object containing a single key, 'eligibleCadetIds', which is an array of the string IDs for only the cadets who are eligible. If no cadets are eligible, return an empty array.

## Award Information
**Name:** {{{award.name}}}
**Eligibility:** {{{award.eligibility}}}
**Criteria:**
{{#each award.criteria}}
- {{{this}}}
{{/each}}

## Cadet Roster
{{{json cadets}}}
`,
});

const determineAwardEligibilityFlow = ai.defineFlow(
  {
    name: 'determineAwardEligibilityFlow',
    inputSchema: AwardEligibilityInputSchema,
    outputSchema: AwardEligibilityOutputSchema,
  },
  async (input) => {
    const { output } = await eligibilityPrompt(input);
    return output!;
  }
);
