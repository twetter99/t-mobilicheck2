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
    <FormSection title="Secció 4: Verificació Funcional" description="Feu les següents comprovacions i marqueu-les com a completades.">
      <div className="space-y-4">
        <VerificationItem
          control={form.control}
          name="startupOk"
          label="Arrencada del sistema"
          description="Verificar que el sistema arrenca correctament en engegar el bus."
        />
        <VerificationItem
          control={form.control}
          name="screenOk"
          label="Pantalla del pupitre"
          description="Comprovar que la pantalla mostra la informació de forma clara i sense artefactes."
        />
        <VerificationItem
          control={form.control}
          name="printerOk"
          label="Impressora de pupitre"
          description="Realitzar una impressió de prova i adjuntar el log."
        >
             <Button type="button" variant="secondary" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Adjuntar log d'impressió
            </Button>
        </VerificationItem>
        <VerificationItem
          control={form.control}
          name="validationOk"
          label="Validació de títols"
          description="Provar la validació amb una targeta T-Mobilitat de prova."
        />
        <VerificationItem
          control={form.control}
          name="communicationOk"
          label="Comunicació amb el centre"
          description="Verificar que l'estat de comunicació és 'En línia'."
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
