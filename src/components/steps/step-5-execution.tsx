'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Step5Props = {
  form: UseFormReturn<any>;
};

const CheckpointItem = ({ name, label, control }: { name: string; label: string; control: any }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">{label}</FormLabel>
        </div>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex space-x-4"
          >
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <RadioGroupItem value="OK" />
              </FormControl>
              <FormLabel className="font-normal text-green-600">OK</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <RadioGroupItem value="NOK" />
              </FormControl>
              <FormLabel className="font-normal text-red-600">NOK</FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
      </FormItem>
    )}
  />
);

export function Step5ExecutionPhases({ form }: Step5Props) {
  return (
    <FormSection title="Secció 5: Fases d'Execució i Verificació" description="Marqueu el resultat de cada fase d'execució.">
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">5.1. Operacions Prèvies</h3>
                <div className="space-y-4">
                    <CheckpointItem name="executionPhases.preliminaryCheck" label="Comprovació de la preinstal·lació elèctrica i de cablejat" control={form.control} />
                    <CheckpointItem name="executionPhases.preexistingSystemsCheck" label="Verificació i registre dels sistemes preexistents" control={form.control} />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">5.2. Instal·lació de Components</h3>
                <div className="space-y-4">
                    <CheckpointItem name="executionPhases.connectionPlateInstallation" label="Instal·lació de la Placa de Connexions" control={form.control} />
                    <CheckpointItem name="executionPhases.antennaInstallation" label="Instal·lació de la Antena" control={form.control} />
                    <CheckpointItem name="executionPhases.mccInstallation" label="Instal·lació del MCC del Pupitre" control={form.control} />
                    <CheckpointItem name="executionPhases.consoleSupportInstallation" label="Muntatge del Suport del Pupitre i la seva base" control={form.control} />
                    <CheckpointItem name="executionPhases.consoleInstallation" label="Instal·lació i connexió del Pupitre" control={form.control} />
                    <CheckpointItem name="executionPhases.validatorSupportInstallation" label="Muntatge dels suports de validadores i terminals" control={form.control} />
                </div>
            </div>
             <div>
                <h3 className="text-lg font-medium mb-4">5.3. Operacions Posteriors i Proves</h3>
                <div className="space-y-4">
                    <CheckpointItem name="executionPhases.finalCheck" label="Comprovació final de la instal·lació i connexions" control={form.control} />
                    <CheckpointItem name="executionPhases.softwareUpdate" label="Actualització de Software, Configuració i Telecàrrega" control={form.control} />
                    <CheckpointItem name="executionPhases.functionalTests" label="Execució del Protocol de Proves funcionals complet" control={form.control} />
                </div>
            </div>
        </div>
    </FormSection>
  );
}
