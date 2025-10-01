'use server';

/**
 * @fileOverview An AI-powered data validation flow for maintenance checklists.
 *
 * - validateChecklistData - A function that validates checklist data using AI.
 * - ValidateChecklistDataInput - The input type for the validateChecklistData function.
 * - ValidateChecklistDataOutput - The return type for the validateChecklistData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateChecklistDataInputSchema = z.object({
  checklistData: z.record(z.any()).describe('The checklist data to validate.'),
  busType: z.string().describe('The type of bus the checklist is for.'),
  previousMaintenanceHistory: z
    .record(z.any())
    .optional()
    .describe('The previous maintenance history for the bus, if available.'),
});
export type ValidateChecklistDataInput = z.infer<typeof ValidateChecklistDataInputSchema>;

const ValidateChecklistDataOutputSchema = z.object({
  validationResults: z.record(
    z.object({
      isValid: z.boolean().describe('Whether the data is valid or not.'),
      errorMessage: z.string().optional().describe('An error message if the data is invalid.'),
    })
  ).describe('The validation results for each field in the checklist.'),
});
export type ValidateChecklistDataOutput = z.infer<typeof ValidateChecklistDataOutputSchema>;

export async function validateChecklistData(
  input: ValidateChecklistDataInput
): Promise<ValidateChecklistDataOutput> {
  return validateChecklistDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateChecklistDataPrompt',
  input: {schema: ValidateChecklistDataInputSchema},
  output: {schema: ValidateChecklistDataOutputSchema},
  prompt: `You are an AI assistant specialized in validating data from maintenance checklists for buses.

You will receive checklist data, the bus type, and optionally the previous maintenance history for the bus.

Your task is to validate each field in the checklist data and identify potential errors or anomalies.

Consider the bus type and previous maintenance history when validating the data.

For each field, determine if the data is valid and provide an error message if it is not.

Return the validation results in a JSON format.

Checklist Data: {{{checklistData}}}
Bus Type: {{{busType}}}
Previous Maintenance History: {{{previousMaintenanceHistory}}}

Example Output:
{
  "field1": {
    "isValid": true
  },
  "field2": {
    "isValid": false,
    "errorMessage": "The value is out of the expected range."
  }
}
`,
});

const validateChecklistDataFlow = ai.defineFlow(
  {
    name: 'validateChecklistDataFlow',
    inputSchema: ValidateChecklistDataInputSchema,
    outputSchema: ValidateChecklistDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
