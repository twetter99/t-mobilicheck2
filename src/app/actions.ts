'use server';

import { validateChecklistData, ValidateChecklistDataOutput } from '@/ai/flows/ai-powered-data-validation';
import type { FormValues } from '@/lib/schema';

export async function validateWithAI(
  data: FormValues
): Promise<{ success: boolean; results?: ValidateChecklistDataOutput['validationResults']; error?: string }> {
  try {
    const flattenedData = {
      ...data.header,
      ...data.inventory,
      ...data.checklist,
      ...data.verification,
      ...data.observations,
      date: data.header.date.toISOString(),
    };
    
    // Remove complex objects before sending to AI
    delete (flattenedData as any).correctiveAction;
    
    const result = await validateChecklistData({
      checklistData: flattenedData,
      busType: 'Estàndard', // Això podria ser dinàmic en una futura versió
    });
    
    // Check if there are any invalid fields
    const hasErrors = Object.values(result.validationResults).some(res => !res.isValid);

    if (hasErrors) {
      return { success: false, results: result.validationResults };
    }

    return { success: true };
  } catch (error) {
    console.error('Error de validació IA:', error);
    return { success: false, error: "S'ha produït un error inesperat durant la validació amb IA." };
  }
}

export async function submitMaintenanceOrder(data: FormValues): Promise<{ success: boolean; message: string }> {
  // Aquí normalment guardaries les dades a la teva base de dades (p. ex., Firestore, Supabase)
  // i gestionaries la pujada de fitxers per a signatures i fotos.
  
  console.log('Enviant ordre de manteniment:', JSON.stringify(data, null, 2));

  // Per a aquesta demostració, només simularem un enviament exitós.
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true, message: 'Ordre de manteniment enviada amb èxit.' };
}
