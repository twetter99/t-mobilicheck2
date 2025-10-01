'use client';

import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { data } from '@/lib/data';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Step1Props = {
  form: UseFormReturn<FormValues>;
};

export function Step1Header({ form }: Step1Props) {
  const selectedOperatorId = form.watch('header.operator');

  const filteredBuses = data.autobuses.filter(bus => bus.operadorId === selectedOperatorId);

  useEffect(() => {
    // Reset bus and license plate when operator changes
    form.setValue('header.busNumber', '');
    form.setValue('header.licensePlate', '');
  }, [selectedOperatorId, form]);

  const handleBusChange = (busUniqueId: string) => {
    const selectedBus = data.autobuses.find(bus => bus.uniqueId === busUniqueId);
    if (selectedBus) {
      form.setValue('header.busNumber', selectedBus.uniqueId);
      form.setValue('header.licensePlate', selectedBus.id);
    }
  };

  return (
    <FormSection title="Sección 1: Encabezado" description="Información general de la orden de mantenimiento.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="header.operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operador</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un operador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.operadores.map(op => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="header.depot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cochera</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="header.busNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº Bus / Calca</FormLabel>
               <Select onValueChange={handleBusChange} value={field.value} disabled={!selectedOperatorId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un bus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredBuses.map(bus => (
                    <SelectItem key={bus.uniqueId} value={bus.uniqueId}>
                      {bus.uniqueId} ({bus.modelo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="header.licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input {...field} readOnly placeholder="Se rellenará automáticamente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="header.technician"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Técnico</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un técnico" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.tecnicos.map(tec => (
                    <SelectItem key={tec.id} value={tec.nombre}>
                      {tec.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="header.date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Seleccione una fecha</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}
