'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { UseFormReturn } from 'react-hook-form';
import { FormValuesMagneticas } from '@/lib/schema';

type Props = {
  form: UseFormReturn<FormValuesMagneticas>;
};

export function Step2InventarioVersiones({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventari i Versions</CardTitle>
        <CardDescription>Informació tècnica de la validadora magnètica</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="inventarioVersiones.modelValidadora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Validadora *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Ascom AVM-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventarioVersiones.numeroSerie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Sèrie *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: SN-20250001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventarioVersiones.versionFirmware"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versió Firmware *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: FW-3.2.1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventarioVersiones.versionSoftware"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versió Software *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: SW-4.1.0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventarioVersiones.ultimaActualizacion"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Última Actualització *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="text-left font-normal"
                      >
                        {field.value ? format(field.value, 'PPP', { locale: ca }) : 'Selecciona una data'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
