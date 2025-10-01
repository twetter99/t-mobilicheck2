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
    <FormSection title="Sección 2: Inventario y Versiones" description="Registre los números de serie y versiones de los componentes.">
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Inventario Central</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="inventory.consoleSerial" render={({ field }) => (
                        <FormItem><FormLabel>Pupitre Serie</FormLabel><FormControl><InputWithScan field={field} placeholder="N/S del pupitre" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.consoleMount" render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Soporte Pupitre</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="sin_brazo" /></FormControl><FormLabel className="font-normal">Sin Brazo</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="brazo_corto" /></FormControl><FormLabel className="font-normal">Brazo Corto</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="brazo_largo" /></FormControl><FormLabel className="font-normal">Brazo Largo</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="simple_extraible" /></FormControl><FormLabel className="font-normal">Simple Extraíble</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.consoleSoftware" render={({ field }) => (
                        <FormItem><FormLabel>SW Pupitre</FormLabel><FormControl><Input placeholder="Versión de software" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.configVersion" render={({ field }) => (
                        <FormItem><FormLabel>Versión Config.</FormLabel><FormControl><Input placeholder="Versión de configuración" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.telechargeVersion" render={({ field }) => (
                        <FormItem><FormLabel>Versión Telecarga</FormLabel><FormControl><Input placeholder="Versión de telecarga" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            <Separator />
            
            <div>
                <h3 className="text-lg font-medium mb-4">Inventario Validación y Consulta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="inventory.valIn1Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora IN 1 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.valIn2Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora IN 2 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.valOut1Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora OUT 1 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.valOut2Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora OUT 2 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.valOut3Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora OUT 3 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="inventory.valOut4Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora OUT 4 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.queryTerminalSerial" render={({ field }) => (
                        <FormItem><FormLabel>Terminal de Consulta Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Infraestructura</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="inventory.connectionsPlateSerial" render={({ field }) => (
                        <FormItem><FormLabel>Placa de Conexiones Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.switchSerial" render={({ field }) => (
                        <FormItem><FormLabel>Switch Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.mccSerial" render={({ field }) => (
                        <FormItem><FormLabel>MCC Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.triBandAntennaSerial" render={({ field }) => (
                        <FormItem><FormLabel>Antena Tribanda Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Sistemas Legacy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="inventory.legacyMag1Brand" render={({ field }) => (
                        <FormItem><FormLabel>Validadora Magnética 1 Marca</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione marca" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ascom">Ascom</SelectItem><SelectItem value="Indra">Indra</SelectItem><SelectItem value="N/A">No Aplica</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.legacyMag1Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora Magnética 1 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.legacyMag2Brand" render={({ field }) => (
                        <FormItem><FormLabel>Validadora Magnética 2 Marca</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione marca" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ascom">Ascom</SelectItem><SelectItem value="Indra">Indra</SelectItem><SelectItem value="N/A">No Aplica</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="inventory.legacyMag2Serial" render={({ field }) => (
                        <FormItem><FormLabel>Validadora Magnética 2 Serie</FormLabel><FormControl><InputWithScan field={field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>
        </div>
    </FormSection>
  );
}
