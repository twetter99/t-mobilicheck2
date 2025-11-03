'use server';

import { validateChecklistData, ValidateChecklistDataOutput } from '@/ai/flows/ai-powered-data-validation';
import type { FormValues, FormValuesMagneticas } from '@/lib/schema';
import { formSchema, formSchemaLenient, formSchemaMagneticas, formSchemaMagneticasLenient } from '@/lib/schema';
import { data } from '@/lib/data';

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
// ============================================
// ACCIONES PARA VALIDADORAS MAGNÉTICAS (C-4/2025)
// ============================================

export async function submitMagneticasOrder(
  formData: FormValuesMagneticas, 
  taskId: string
): Promise<{ success: boolean; message?: string; error?: string; ordenCorrectivaId?: string }> {
  // Usar esquema lenient por defecto; para estricto activar NEXT_PUBLIC_FORM_STRICT=1
  const isStrict = process.env.NEXT_PUBLIC_FORM_STRICT === '1';
  const schemaToUse = isStrict ? formSchemaMagneticas : formSchemaMagneticasLenient;
  
  try {
    schemaToUse.parse(formData);
  } catch (validationError: any) {
    console.error('❌ Validació del servidor fallida:', validationError);
    return { 
      success: false, 
      error: 'Les dades enviades no són vàlides. Si us plau, revisa el formulari.' 
    };
  }

  console.log('✅ Validació del servidor superada');
  console.log('📝 Enviant ordre de manteniment de validadora magnètica:', JSON.stringify(formData, null, 2));

  // Simulación de envío al servidor
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const timestamp = new Date().toISOString();
    
    // Guardar el formulario
    const formSubmission = {
      id: `form_mag_${formData.datosIntervencion.numeroValidadora}_${timestamp}`,
      submittedAt: timestamp,
      numeroValidadora: formData.datosIntervencion.numeroValidadora,
      operador: formData.datosIntervencion.operador,
      tecnico: formData.datosIntervencion.tecnico,
      contrato: 'C-4/2025',
      formData: formData,
      status: 'Completada',
      tipo: 'Validadora Magnètica - Preventiu Trimestral'
    };

    console.log('💾 Formulari guardat:', formSubmission.id);

    // Si se marcó generar orden correctiva
    let ordenCorrectivaId: string | undefined;
    if (formData.observacionesTancament.tieneIncidencia && 
        formData.observacionesTancament.incidencia?.generarOrdenCorrectiva) {
      
      const incidencia = formData.observacionesTancament.incidencia;
      
      // Crear nueva OT correctiva vinculada
      ordenCorrectivaId = `OT-CORR-${formData.datosIntervencion.numeroValidadora}-${Date.now()}`;
      
      const nuevaOTCorrectiva = {
        id: ordenCorrectivaId,
        contract: 'C-4/2025',
        operador: formData.datosIntervencion.operador,
        cochera: formData.datosIntervencion.estacion,
        vehiculo: formData.datosIntervencion.numeroValidadora,
        n_validadora: formData.datosIntervencion.numeroValidadora,
        tipo: 'Correctiu',
        prioridad: incidencia.prioridad as any,
        distancia: '0km',
        estimacion: '01:00',
        turno: 'Diurn',
        estado: 'Pendent',
        hora: '09:00',
        fecha: new Date().toISOString(),
        observaciones: `INCIDÈNCIA DETECTADA EN MANTENIMENT PREVENTIU:\n\n${incidencia.titulo}\n\n${incidencia.descripcion}`,
        ordenOrigenId: taskId,
        ordenOrigenTipo: 'Preventiu Trimestral'
      };

      console.log('🔧 Ordre correctiva generada:', ordenCorrectivaId);
      console.log('📋 Detalls OT correctiva:', nuevaOTCorrectiva);

      // Aquí se guardaría en la base de datos real
      // Por ahora solo lo guardamos en localStorage para simulación
      if (typeof window !== 'undefined') {
        const ordenesCorrectivas = JSON.parse(localStorage.getItem('ordenesCorrectivas') || '[]');
        ordenesCorrectivas.push(nuevaOTCorrectiva);
        localStorage.setItem('ordenesCorrectivas', JSON.stringify(ordenesCorrectivas));
      }
    }

    return { 
      success: true, 
      message: ordenCorrectivaId 
        ? `Ordre de manteniment enviada amb èxit. S'ha generat l'ordre correctiva ${ordenCorrectivaId}.`
        : 'Ordre de manteniment enviada amb èxit.',
      ordenCorrectivaId
    };
    
  } catch (error) {
    console.error('❌ Error processing magneticas order:', error);
    return { 
      success: false, 
      error: 'Error en processar l\'ordre de manteniment.' 
    };
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


