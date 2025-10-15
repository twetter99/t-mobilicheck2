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
    <FormSection title="Secció 4: Verificació Funcional" description="Confirmeu que cada component funciona correctament.">
      <div className="space-y-4">
        <CheckpointItem 
          name="verification.startupOk" 
          label="Arrencada del sistema" 
          description="El pupitre i les validadores s'inicien sense errors."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.screenOk" 
          label="Pantalla del pupitre"
          description="La pantalla tàctil respon i mostra la interfície correctament."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.printerOk" 
          label="Impressora de pupitre"
          description="La impressora emet tiquets de prova de manera llegible."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.validationOk"
          label="Validació de títols"
          description="Les validadores llegeixen i validen correctament títols de transport."
          control={form.control}
        />
        <CheckpointItem 
          name="verification.communicationOk"
          label="Comunicació amb el centre"
          description="El sistema envia i rep dades del centre de control correctament."
          control={form.control}
        />
      </div>
    </FormSection>
  );
}
