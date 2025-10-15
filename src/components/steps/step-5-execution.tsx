'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
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
    <FormSection title="Sección 5: Fases de Ejecución y Verificación" description="Marque el resultado de cada fase de ejecución.">
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">5.1. Operaciones Previas</h3>
                <div className="space-y-4">
                    <CheckpointItem name="executionPhases.preliminaryCheck" label="Comprobación de la preinstalación eléctrica y de cableado" control={form.control} />
                    <CheckpointItem name="executionPhases.preexistingSystemsCheck" label="Verificación y registro de los sistemas preexistentes" control={form.control} />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">5.2. Instalación de Componentes</h3>
                <div className="space-y-4">
                    <CheckpointItem name="executionPhases.connectionPlateInstallation" label="Instalación de la Placa de Conexiones" control={form.control} />
                    <CheckpointItem name="executionPhases.antennaInstallation" label="Instalación de la Antena" control={form.control} />
                    <CheckpointItem name="executionPhases.mccInstallation" label="Instalación del MCC del Pupitre" control={form.control} />
                    <CheckpointItem name="executionPhases.consoleSupportInstallation" label="Montaje del Soporte del Pupitre y su base" control={form.control} />
                    <CheckpointItem name="executionPhases.consoleInstallation" label="Instalación y conexión del Pupitre" control={form.control} />
                    <CheckpointItem name="executionPhases.validatorSupportInstallation" label="Montaje de los soportes de validadoras y terminales" control={form.control} />
                </div>
            </div>
             <div>
                <h3 className="text-lg font-medium mb-4">5.3. Operaciones Posteriores y Pruebas</h3>
                <div className="space-y-4">
                    <CheckpointItem name="executionPhases.finalCheck" label="Comprobación final de la instalación y conexiones" control={form.control} />
                    <CheckpointItem name="executionPhases.softwareUpdate" label="Actualización de Software, Configuración y Telecarga" control={form.control} />
                    <CheckpointItem name="executionPhases.functionalTests" label="Ejecución del Protocolo de Pruebas funcionales completo" control={form.control} />
                </div>
            </div>
        </div>
    </FormSection>
  );
}
