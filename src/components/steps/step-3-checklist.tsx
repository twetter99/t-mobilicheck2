'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '../ui/separator';

type Step3Props = {
  form: UseFormReturn<FormValues>;
};

const ChecklistItem = ({
  name,
  label,
  description,
  control,
}: {
  name: keyof FormValues['checklist'];
  label: string;
  description: string;
  control: UseFormReturn<FormValues>['control'];
}) => (
  <FormField
    control={control}
    name={`checklist.${name}`}
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
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

export function Step3Checklist({ form }: Step3Props) {
  return (
    <FormSection title="Sección 3: Checklist de Ejecución" description="Marque todas las tareas como completadas.">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Pupitre de Conducción</h3>
          <div className="space-y-4">
            <ChecklistItem
              control={form.control}
              name="consoleGeneralCleaning"
              label="Limpieza General"
              description="Limpieza superficial del pupitre, pantalla y periféricos."
            />
            <ChecklistItem
              control={form.control}
              name="consoleAutocutterCleaning"
              label="Limpieza de Autocutter"
              description="Limpieza del mecanismo de corte de la impresora de tickets."
            />
            <ChecklistItem
              control={form.control}
              name="consoleSerialRegistration"
              label="Registro de Serie"
              description="Verificación y registro del número de serie del pupitre."
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 text-lg font-medium">Validadoras</h3>
          <div className="space-y-4">
            <ChecklistItem
              control={form.control}
              name="validatorGeneralCleaning"
              label="Limpieza General"
              description="Limpieza superficial de todas las validadoras de abordo."
            />
            <ChecklistItem
              control={form.control}
              name="validatorConnectorsCleaning"
              label="Limpieza de Conectores"
              description="Revisión y limpieza de los conectores de las validadoras."
            />
            <ChecklistItem
              control={form.control}
              name="validatorSerialRegistration"
              label="Registro de Series"
              description="Verificación y registro de los números de serie de todas las validadoras."
            />
             {form.formState.errors.checklist && (
                <div className="pt-2">
                    <FormMessage>{form.formState.errors.checklist.message}</FormMessage>
                </div>
            )}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
