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
      busType: 'Standard', // This could be dynamic in a future version
    });
    
    // Check if there are any invalid fields
    const hasErrors = Object.values(result.validationResults).some(res => !res.isValid);

    if (hasErrors) {
      return { success: false, results: result.validationResults };
    }

    return { success: true };
  } catch (error) {
    console.error('AI Validation Error:', error);
    return { success: false, error: 'An unexpected error occurred during AI validation.' };
  }
}

export async function submitMaintenanceOrder(data: FormValues): Promise<{ success: boolean; message: string }> {
  // Here you would typically save the data to your database (e.g., Firestore, Supabase)
  // and handle file uploads for signatures and photos.
  
  console.log('Submitting maintenance order:', JSON.stringify(data, null, 2));

  // For this demo, we'll just simulate a successful submission.
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true, message: 'Orden de mantenimiento enviada con éxito.' };
}
