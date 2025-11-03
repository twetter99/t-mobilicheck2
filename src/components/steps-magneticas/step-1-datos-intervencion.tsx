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

export function Step1DatosIntervencion({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dades de la Intervenció</CardTitle>
        <CardDescription>Informació pre-omplerda des de l'ordre de treball</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="datosIntervencion.contrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contracte</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.operador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operador</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.estacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estació / Ubicació</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.numeroValidadora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº Validadora</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula (si aplica)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.tecnico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tècnic Assignat *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Nom del tècnic del adjudicatari"
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled
                        className="bg-gray-100 text-left font-normal"
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
                      disabled
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datosIntervencion.horaProgramada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora Programada</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
