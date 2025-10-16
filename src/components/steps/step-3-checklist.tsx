'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FormValues } from '@/lib/schema';

type Step3Props = {
  form: UseFormReturn<FormValues>;
};

export function Step3Software({ form }: Step3Props) {
  return (
    <FormSection title="Sección 3: Software y Configuración" description="Registre las versiones de software y configuración.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="software.consoleSoftware"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versión SW de Instalación del Pupitre</FormLabel>
              <FormControl>
                <Input placeholder="Versión de software" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="software.telechargeVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versión de Telecarga</FormLabel>
              <FormControl>
                <Input placeholder="Versión de telecarga" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="software.configVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versión de Configuración</FormLabel>
              <FormControl>
                <Input placeholder="Versión de configuración" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}
