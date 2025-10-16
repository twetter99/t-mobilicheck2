'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '../ui/button';
import { QrCode } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

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
      onClick={() => field.onChange(`SIM-${Math.floor(100000 + Math.random() * 900000)}`)}
    >
      <QrCode className="h-5 w-5" />
    </Button>
  </div>
);

const DeviceFields = ({ form, deviceName, deviceLabel }: { form: UseFormReturn<FormValues>, deviceName: string, deviceLabel: string }) => (
    <AccordionItem value={deviceName}>
        <AccordionTrigger className="text-base">{deviceLabel}</AccordionTrigger>
        <AccordionContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 p-2">
                <FormField control={form.control} name={`inventory.${deviceName}Serial`} render={({ field }) => (
                    <FormItem><FormLabel>N/S Validadora</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name={`inventory.${deviceName}SupportSerial`} render={({ field }) => (
                    <FormItem><FormLabel>N/S Suport</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`inventory.${deviceName}DeviceCode`} render={({ field }) => (
                    <FormItem><FormLabel>Device</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
        </AccordionContent>
    </AccordionItem>
);

export function Step2Inventory({ form }: Step2Props) {
  return (
    <FormSection title="Secció 2: Inventari i Versions" description="Registreu els números de sèrie i versions dels components.">
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Maquinari T-Mobilitat</h3>
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
                <h3 className="text-lg font-medium mb-4">Validadors i Terminal de Consulta</h3>
                 <Accordion type="multiple" className="w-full">
                    <DeviceFields form={form} deviceName="sc1" deviceLabel="Validadora SC1" />
                    <DeviceFields form={form} deviceName="sc2" deviceLabel="Validadora SC2" />
                    <DeviceFields form={form} deviceName="sc3" deviceLabel="Validadora SC3" />
                    <DeviceFields form={form} deviceName="sc4" deviceLabel="Validadora SC4" />
                    <DeviceFields form={form} deviceName="sc5" deviceLabel="Validadora SC5" />
                    <DeviceFields form={form} deviceName="sc6" deviceLabel="Validadora SC6" />
                    <AccordionItem value="queryTerminal">
                        <AccordionTrigger className="text-base">Terminal de Consulta</AccordionTrigger>
                        <AccordionContent>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 p-2">
                                <FormField control={form.control} name="inventory.queryTerminalSerial" render={({ field }) => (
                                    <FormItem><FormLabel>N/S Terminal</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="inventory.queryTerminalSupportSerial" render={({ field }) => (
                                    <FormItem><FormLabel>N/S Suport</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="inventory.queryTerminalDeviceCode" render={({ field }) => (
                                    <FormItem><FormLabel>Device</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </FormSection>
  );
}
