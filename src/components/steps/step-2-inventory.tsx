'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '../ui/button';
import { QrCode } from 'lucide-react';
import { Separator } from '../ui/separator';

type Step2Props = {
  form: UseFormReturn<FormValues>;
};

const InputWithScan = ({ field, placeholder }: { field: any; placeholder?: string }) => (
  <div className="relative">
    <Input placeholder={placeholder} {...field} className="pr-12" />
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
      onClick={() => field.onChange(`SN-SIM-${Math.floor(100000 + Math.random() * 900000)}`)}
    >
      <QrCode className="h-5 w-5" />
    </Button>
  </div>
);

export function Step2Inventory({ form }: Step2Props) {
  return (
    <FormSection title="Secció 2: Inventari i Versions" description="Registreu els números de sèrie i versions dels components.">
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Hardware T-Mobilitat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="inventory.consoleSerial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Pupitre</FormLabel><FormControl><InputWithScan field={field} placeholder="N/S del pupitre" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.mccSerial" render={({ field }) => (
                        <FormItem><FormLabel>N/S MCC Pupitre</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.switchSerial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Switch</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.installationKitSerial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Kit d'Instal·lació</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="inventory.consoleMount" render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Tipologia de Suport de Pupitre</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="sin_brazo" /></FormControl><FormLabel className="font-normal">Sense Braç</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="brazo_corto" /></FormControl><FormLabel className="font-normal">Braç Curt</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="brazo_largo" /></FormControl><FormLabel className="font-normal">Braç Llarg</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="simple_extraible" /></FormControl><FormLabel className="font-normal">Simple Extraïble</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>
            
            <Separator />
            
            <div>
                <h3 className="text-lg font-medium mb-4">Soports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="inventory.sc1Serial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Validadora SC1</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.sc2Serial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Validadora SC2</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.sc3Serial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Validadora SC3</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.sc4Serial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Validadora SC4</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.sc5Serial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Validadora SC5</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="inventory.sc6Serial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Validadora SC6</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.queryTerminalSupportSerial" render={({ field }) => (
                        <FormItem><FormLabel>N/S Suport Terminal de Consulta</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>
        </div>
    </FormSection>
  );
}
