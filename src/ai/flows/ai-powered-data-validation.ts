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
  prompt: `Ets un assistent d'IA expert en validació de manteniment d'autobusos amb sistemes T-Mobilitat.

La teva tasca és DETECTAR INCOHERÈNCIES i CONTRADICCIONS entre diferents camps del formulari.

🎯 PRIORITAT MÀXIMA: Detectar contradiccions lògiques

CASOS CRÍTICS A DETECTAR:

1. **CONTRADICCIÓ CHECKLIST vs OBSERVACIONS**
   - Si un camp de verificació està marcat com "OK" o "true" però les observacions mencionen problemes amb aquell component
   - Exemples:
     * Verificació "printerOk: true" però observacions: "la impresora no funciona" o "impressora bloquejada"
     * Verificació "validationOk: true" però observacions: "error en validació de targetes"
     * Verificació "screenOk: true" però observacions: "pantalla trencada" o "display amb pixels morts"
     * Verificació "communicationOk: true" però observacions: "sense connexió al centre" o "problema de xarxa"

2. **INCOHERÈNCIA EN TEMPS DE TREBALL**
   - Si l'hora de fi és anterior a l'hora d'inici
   - Si la durada del treball és irreal (menys de 5 minuts o més de 8 hores)

3. **INCOHERÈNCIES EN NÚMEROS DE SÈRIE**
   - Formats incorrectes o números de sèrie invàlids
   - Números de sèrie duplicats en diferents components

4. **CONTRADICCIÓ ENTRE INCIDÈNCIA I VERIFICACIÓ**
   - Si "hasIncident: true" però tots els camps de verificació estan OK
   - Si "hasIncident: false" però hi ha múltiples verificacions fallides

5. **OBSERVACIONS CONTRADICTÒRIES**
   - Observacions que es contradiuen entre elles
   - Mencions de "tot correcte" però després descripcions de problemes

**IMPORTANT:** Sigues molt estricte amb les contradiccions. Si detectes qualsevol incoherència entre camps, marca'l com a invàlid amb un missatge d'error clar i específic.

**FORMAT DE MISSATGES D'ERROR:**
- Sigues concís però específic
- Menciona exactament quins camps es contradiuen
- Proposa una solució clara

**EXEMPLES DE DETECCIÓ:**

Entrada: 
{
  "printerOk": true,
  "notes": "La impresora no imprimeix correctament"
}
Sortida:
{
  "printerOk": {
    "isValid": false,
    "errorMessage": "⚠️ CONTRADICCIÓ: Has marcat la impressora com a OK, però les observacions indiquen que 'La impresora no imprimeix correctament'. Revisa l'estat de la impressora."
  }
}

Entrada:
{
  "validationOk": true,
  "notes": "Validador no llegeix targetes"
}
Sortida:
{
  "validationOk": {
    "isValid": false,
    "errorMessage": "⚠️ CONTRADICCIÓ: La validació està marcada com a OK, però les observacions mencionen 'Validador no llegeix targetes'. Marca la validació com a incorrecta o elimina la nota del problema."
  }
}

**DADES A VALIDAR:**

Dades de la llista de verificació: {{{checklistData}}}
Tipus d'autobús: {{{busType}}}
Historial de manteniment previ: {{{previousMaintenanceHistory}}}

**RETORNA:** Un objecte JSON amb els resultats de validació per a cada camp que tingui problemes o contradiccions.
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
