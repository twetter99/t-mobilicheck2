'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

type Step4Props = {
  form: UseFormReturn<FormValues>;
};

const CheckpointItem = ({ name, label, description, control }: { name: keyof FormValues['verification'], label: string, description: string, control: any }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>{label}</FormLabel>
          <FormDescription>{description}</FormDescription>
        </div>
      </FormItem>
    )}
  />
);

export function Step4Verification({ form }: Step4Props) {
  return (
    <FormSection title="Sección 4: Verificación Funcional" description="Confirme que cada componente funciona correctamente.">
      <div className="space-y-4">
        <CheckpointItem 
          name="verification.startupOk" 
          label="Arranque del sistema" 
          description="El pupitre y las validadoras se inician sin errores."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.screenOk" 
          label="Pantalla del pupitre"
          description="La pantalla táctil responde y muestra la interfaz correctamente."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.printerOk" 
          label="Impresora de pupitre"
          description="La impresora emite tickets de prueba de manera legible."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.validationOk"
          label="Validación de títulos"
          description="Las validadoras leen y validan correctamente títulos de transporte."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.communicationOk"
          label="Comunicación con el centro"
          description="El sistema envía y recibe datos del centro de control correctamente."
          control={form.control}
        />
      </div>
    </FormSection>
  );
}
