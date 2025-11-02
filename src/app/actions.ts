'use server';

import { validateChecklistData, ValidateChecklistDataOutput } from '@/ai/flows/ai-powered-data-validation';
import type { FormValues } from '@/lib/schema';
import { formSchema, formSchemaLenient } from '@/lib/schema';

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

export async function submitMaintenanceOrder(data: FormValues): Promise<{ success: boolean; message: string; formSubmission?: any; completionData?: any }> {
  // Usa esquema lenient por defecto; para estricto activar NEXT_PUBLIC_FORM_STRICT=1
  const isStrict = process.env.NEXT_PUBLIC_FORM_STRICT === '1';
  const schemaToUse = isStrict ? formSchema : formSchemaLenient;
  
  try {
    schemaToUse.parse(data);
  } catch (validationError: any) {
    console.error(' Validació del servidor fallida:', validationError);
    return { 
      success: false, 
      message: 'Les dades enviades no són vàlides. Si us plau, revisa el formulari.' 
    };
  }

  console.log(' Validació del servidor superada');
  console.log('Enviant ordre de manteniment:', JSON.stringify(data, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const timestamp = new Date().toISOString();
    
    const formSubmission = {
      id: `form_${data.header.busNumber}_${timestamp}`,
      submittedAt: timestamp,
      busNumber: data.header.busNumber,
      operator: data.header.operator,
      technician: data.header.technician,
      formData: data,
      status: 'Completada'
    };
    
    const completionData = {
      id: `task_${data.header.busNumber}`,
      taskType: 'revision' as const,
      completedAt: timestamp,
      status: 'Completada',
      busNumber: data.header.busNumber,
      formSubmissionId: formSubmission.id
    };

    console.log(' Dades preparades per guardar:', {
      form: formSubmission.id,
      task: completionData.id,
      bus: data.header.busNumber
    });

    return { 
      success: true, 
      message: 'Ordre de manteniment enviada amb èxit.',
      formSubmission,
      completionData
    };
    
  } catch (error) {
    console.error('Error processing maintenance order:', error);
    return { 
      success: false, 
      message: 'Error en processar l\'ordre de manteniment.' 
    };
  }
}

export async function markTaskAsCompleted(taskId: string, taskType: 'revision' | 'validator'): Promise<{ success: boolean; message: string }> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (typeof window !== 'undefined') {
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const completionData = {
        id: taskId,
        taskType,
        completedAt: new Date().toISOString(),
        status: 'Completada'
      };
      
      const existingIndex = completedTasks.findIndex((task: any) => task.id === taskId);
      if (existingIndex !== -1) {
        completedTasks[existingIndex] = completionData;
      } else {
        completedTasks.push(completionData);
      }
      
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    return { success: true, message: 'Tasca marcada com a completada. Dades guardades localment.' };
  } catch (error) {
    console.error('Error marking task as completed:', error);
    return { success: false, message: 'Error en marcar la tasca com a completada.' };
  }
}


