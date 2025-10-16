'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ChecklistStep } from '@/lib/checklist-data';
import type { FormValues } from '@/lib/schema';

type Step5Props = {
  form: UseFormReturn<FormValues>;
  checklist: ChecklistStep[];
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
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <RadioGroupItem value="N/A" />
              </FormControl>
              <FormLabel className="font-normal text-gray-500">N/A</FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
      </FormItem>
    )}
  />
);

export function Step5ExecutionPhases({ form, checklist }: Step5Props) {
  const executionGroups = [
    { title: '5.1. Operaciones Previas', fields: ['preliminaryCheck', 'preexistingSystemsCheck'] },
    { title: '5.2. Instalación de Componentes', fields: ['connectionPlateInstallation', 'antennaInstallation', 'mccInstallation', 'consoleSupportInstallation', 'consoleInstallation', 'validatorSupportInstallation'] },
    { title: '5.3. Operaciones Posteriores y Pruebas', fields: ['finalCheck', 'softwareUpdate', 'functionalTests'] },
  ]
  
  const getLabelForField = (fieldName: string) => {
    switch(fieldName) {
      case 'preliminaryCheck': return "Comprobación de la preinstalación eléctrica y de cableado";
      case 'preexistingSystemsCheck': return "Verificación y registro de los sistemas preexistentes";
      case 'connectionPlateInstallation': return "Instalación de la Placa de Conexiones";
      case 'antennaInstallation': return "Instalación de la Antena";
      case 'mccInstallation': return "Instalación del MCC del Pupitre";
      case 'consoleSupportInstallation': return "Montaje del Soporte del Pupitre y su base";
      case 'consoleInstallation': return "Instalación y conexión del Pupitre";
      case 'validatorSupportInstallation': return "Montaje de los soportes de validadoras y terminales";
      case 'finalCheck': return "Comprobación final de la instalación y conexiones";
      case 'softwareUpdate': return "Actualización de Software, Configuración y Telecarga";
      case 'functionalTests': return "Ejecución del Protocolo de Pruebas funcionales completo";
      default: return fieldName;
    }
  }

  return (
    <FormSection title="Sección 5: Fases de Ejecución y Verificación" description="Marque el resultado de cada fase de ejecución.">
        <div className="space-y-6">
          {executionGroups.map(group => (
            <div key={group.title}>
                <h3 className="text-lg font-medium mb-4">{group.title}</h3>
                <div className="space-y-4">
                  {group.fields.map(field => (
                     <CheckpointItem key={field} name={`executionPhases.${field}`} label={getLabelForField(field)} control={form.control} />
                  ))}
                </div>
            </div>
          ))}
        </div>
    </FormSection>
  );
}
