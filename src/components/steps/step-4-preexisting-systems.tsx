'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import type { FormValues } from '@/lib/schema';

type Step4Props = {
  form: UseFormReturn<FormValues>;
};

export function Step4PreexistingSystems({ form }: Step4Props) {
  return (
    <FormSection title="Secció 4: Verificació de Sistemes Preexistents" description="Registreu la informació dels sistemes ja presents al vehicle.">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Cancel·ladores Magnètiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="preexistingSystems.magneticValidatorBrand" render={({ field }) => (
                <FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Marca" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="preexistingSystems.magneticValidatorModel" render={({ field }) => (
                <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="Model" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="preexistingSystems.magneticValidatorSerial" render={({ field }) => (
                <FormItem><FormLabel>Número de Sèrie</FormLabel><FormControl><Input placeholder="N/S" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Cancel·ladores Sense Contacte</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="preexistingSystems.contactlessValidatorBrand" render={({ field }) => (
                <FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Marca" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="preexistingSystems.contactlessValidatorModel" render={({ field }) => (
                <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="Model" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="preexistingSystems.contactlessValidatorSerial" render={({ field }) => (
                <FormItem><FormLabel>Número de Sèrie</FormLabel><FormControl><Input placeholder="N/S" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
        </div>

        <Separator />

        <div>
            <h3 className="text-lg font-medium mb-4">Integracions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="preexistingSystems.saeIntegration" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Integració amb SAE</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )}/>
                {form.watch('preexistingSystems.saeIntegration') === 'Sí' && (
                    <div className="grid grid-cols-2 gap-6">
                         <FormField control={form.control} name="preexistingSystems.saeBrand" render={({ field }) => (
                            <FormItem><FormLabel>Marca SAE</FormLabel><FormControl><Input placeholder="Marca" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="preexistingSystems.saeModel" render={({ field }) => (
                            <FormItem><FormLabel>Model SAE</FormLabel><FormControl><Input placeholder="Model" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <FormField control={form.control} name="preexistingSystems.exteriorPanelsIntegration" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Integració amb Panells Exteriors</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )}/>
                 {form.watch('preexistingSystems.exteriorPanelsIntegration') === 'Sí' && (
                    <div className="grid grid-cols-2 gap-6">
                         <FormField control={form.control} name="preexistingSystems.exteriorPanelsBrand" render={({ field }) => (
                            <FormItem><FormLabel>Marca Panells</FormLabel><FormControl><Input placeholder="Marca" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="preexistingSystems.exteriorPanelsModel" render={({ field }) => (
                            <FormItem><FormLabel>Model Panells</FormLabel><FormControl><Input placeholder="Model" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                )}
            </div>
        </div>
      </div>
    </FormSection>
  );
}
