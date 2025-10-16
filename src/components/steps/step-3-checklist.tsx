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
    <FormSection title="Secció 3: Programari i Configuració" description="Registreu les versions de programari i configuració.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="software.consoleSoftware"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versió SW d'Instal·lació del Pupitre</FormLabel>
              <FormControl>
                <Input placeholder="Versió de programari" {...field} />
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
              <FormLabel>Versió de Telecàrrega</FormLabel>
              <FormControl>
                <Input placeholder="Versió de telecàrrega" {...field} />
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
              <FormLabel>Versió de Configuració</FormLabel>
              <FormControl>
                <Input placeholder="Versió de configuració" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}
