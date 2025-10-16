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
    { title: '5.1. Operacions Prèvies', fields: ['preliminaryCheck', 'preexistingSystemsCheck'] },
    { title: '5.2. Instal·lació de Components', fields: ['connectionPlateInstallation', 'antennaInstallation', 'mccInstallation', 'consoleSupportInstallation', 'consoleInstallation', 'validatorSupportInstallation'] },
    { title: '5.3. Operacions Posteriors i Proves', fields: ['finalCheck', 'softwareUpdate', 'functionalTests'] },
  ]
  
  const getLabelForField = (fieldName: string) => {
    switch(fieldName) {
      case 'preliminaryCheck': return "Comprovació de la preinstal·lació elèctrica i de cablejat";
      case 'preexistingSystemsCheck': return "Verificació i registre dels sistemes preexistents";
      case 'connectionPlateInstallation': return "Instal·lació de la Placa de Connexions";
      case 'antennaInstallation': return "Instal·lació de l'Antena";
      case 'mccInstallation': return "Instal·lació del MCC del Pupitre";
      case 'consoleSupportInstallation': return "Muntatge del Suport del Pupitre i la seva base";
      case 'consoleInstallation': return "Instal·lació i connexió del Pupitre";
      case 'validatorSupportInstallation': return "Muntatge dels suports de validadores i terminals";
      case 'finalCheck': return "Comprovació final de la instal·lació i connexions";
      case 'softwareUpdate': return "Actualització de Programari, Configuració i Telecàrrega";
      case 'functionalTests': return "Execució del Protocol de Proves funcionals complet";
      default: return fieldName;
    }
  }

  return (
    <FormSection title="Secció 5: Fases d'Execució i Verificació" description="Marqueu el resultat de cada fase d'execució.">
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
