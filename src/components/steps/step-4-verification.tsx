'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { FileText } from 'lucide-react';

type Step4Props = {
  form: UseFormReturn<FormValues>;
};

const VerificationItem = ({
  name,
  label,
  description,
  control,
  children
}: {
  name: keyof FormValues['verification'];
  label: string;
  description: string;
  control: UseFormReturn<FormValues>['control'];
  children?: React.ReactNode;
}) => (
  <FormField
    control={control}
    name={`verification.${name}`}
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="space-y-1 leading-none w-full">
          <FormLabel>{label}</FormLabel>
          <FormDescription>{description}</FormDescription>
          {children && <div className="pt-2">{children}</div>}
        </div>
      </FormItem>
    )}
  />
);

export function Step4Verification({ form }: Step4Props) {
  return (
    <FormSection title="Sección 4: Verificación Funcional" description="Realice las siguientes comprobaciones y marque como completadas.">
      <div className="space-y-4">
        <VerificationItem
          control={form.control}
          name="startupOk"
          label="Arranque del sistema"
          description="Verificar que el sistema arranca correctamente al encender el bus."
        />
        <VerificationItem
          control={form.control}
          name="screenOk"
          label="Pantalla del pupitre"
          description="Comprobar que la pantalla muestra la información de forma clara y sin artefactos."
        />
        <VerificationItem
          control={form.control}
          name="printerOk"
          label="Impresora de pupitre"
          description="Realizar una impresión de prueba y adjuntar el log."
        >
             <Button type="button" variant="secondary" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Adjuntar log de impresión
            </Button>
        </VerificationItem>
        <VerificationItem
          control={form.control}
          name="validationOk"
          label="Validación de títulos"
          description="Probar la validación con una tarjeta T-Mobilitat de prueba."
        />
        <VerificationItem
          control={form.control}
          name="communicationOk"
          label="Comunicación con el centro"
          description="Verificar que el estado de comunicación es 'En línea'."
        />
         {form.formState.errors.verification && (
            <div className="pt-2">
                <FormMessage>{form.formState.errors.verification.message}</FormMessage>
            </div>
        )}
      </div>
    </FormSection>
  );
}
