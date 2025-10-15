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
    <FormSection title="Secció 3: Checklist d'Execució" description="Marqueu totes les tasques com a completades.">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Pupitre de Conducció</h3>
          <div className="space-y-4">
            <ChecklistItem
              control={form.control}
              name="consoleGeneralCleaning"
              label="Neteja General"
              description="Neteja superficial del pupitre, pantalla i perifèrics."
            />
            <ChecklistItem
              control={form.control}
              name="consoleAutocutterCleaning"
              label="Neteja d'Autocutter"
              description="Neteja del mecanisme de tall de la impressora de tiquets."
            />
            <ChecklistItem
              control={form.control}
              name="consoleSerialRegistration"
              label="Registre de Sèrie"
              description="Verificació i registre del número de sèrie del pupitre."
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 text-lg font-medium">Validadores</h3>
          <div className="space-y-4">
            <ChecklistItem
              control={form.control}
              name="validatorGeneralCleaning"
              label="Neteja General"
              description="Neteja superficial de totes les validadores d'abord."
            />
            <ChecklistItem
              control={form.control}
              name="validatorConnectorsCleaning"
              label="Neteja de Connectors"
              description="Revisió i neteja dels connectors de les validadores."
            />
            <ChecklistItem
              control={form.control}
              name="validatorSerialRegistration"
              label="Registre de Sèries"
              description="Verificació i registre dels números de sèrie de totes les validadores."
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
