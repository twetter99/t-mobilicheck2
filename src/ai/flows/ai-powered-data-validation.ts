'use server';

/**
 * @fileOverview Un flux d'IA per a la validació de dades de llistes de verificació de manteniment.
 *
 * - validateChecklistData - Una funció que valida les dades de la llista de verificació utilitzant IA.
 * - ValidateChecklistDataInput - El tipus d'entrada per a la funció validateChecklistData.
 * - ValidateChecklistDataOutput - El tipus de retorn per a la funció validateChecklistData.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateChecklistDataInputSchema = z.object({
  checklistData: z.record(z.any()).describe('Les dades de la llista de verificació a validar.'),
  busType: z.string().describe("El tipus d'autobús per al qual és la llista de verificació."),
  previousMaintenanceHistory: z
    .record(z.any())
    .optional()
    .describe("L'historial de manteniment previ de l'autobús, si està disponible."),
});
export type ValidateChecklistDataInput = z.infer<typeof ValidateChecklistDataInputSchema>;

const ValidateChecklistDataOutputSchema = z.object({
  validationResults: z.record(
    z.object({
      isValid: z.boolean().describe('Indica si la dada és vàlida o no.'),
      errorMessage: z.string().optional().describe("Un missatge d'error si la dada és invàlida."),
    })
  ).describe('Els resultats de la validació per a cada camp de la llista de verificació.'),
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
  prompt: `Ets un assistent d'IA especialitzat en la validació de dades de llistes de verificació de manteniment per a autobusos.

Rebràs dades de la llista de verificació, el tipus d'autobús i, opcionalment, l'historial de manteniment previ de l'autobús.

La teva tasca és validar cada camp de les dades de la llista de verificació i identificar possibles errors o anomalies.

Tingues en compte el tipus d'autobús i l'historial de manteniment previ en validar les dades.

Per a cada camp, determina si la dada és vàlida i proporciona un missatge d'error si no ho és.

Retorna els resultats de la validació en format JSON.

Dades de la llista de verificació: {{{checklistData}}}
Tipus d'autobús: {{{busType}}}
Historial de manteniment previ: {{{previousMaintenanceHistory}}}

Exemple de sortida:
{
  "field1": {
    "isValid": true
  },
  "field2": {
    "isValid": false,
    "errorMessage": "El valor està fora del rang esperat."
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
