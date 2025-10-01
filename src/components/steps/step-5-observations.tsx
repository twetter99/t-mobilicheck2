'use client';

import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { SignaturePad } from '@/components/signature-pad';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Step5Props = {
  form: UseFormReturn<FormValues>;
};

export function Step5Observations({ form }: Step5Props) {
  const hasIncident = form.watch('observations.hasIncident');

  useEffect(() => {
    if (hasIncident) {
      form.register('observations.correctiveAction.title');
      form.register('observations.correctiveAction.description');
      form.register('observations.correctiveAction.priority');
    }
  }, [hasIncident, form.register]);


  return (
    <FormSection title="Sección 5: Observaciones y Cierre" description="Añada notas, incidencias y recoja las firmas.">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="observations.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea placeholder="Añada cualquier observación relevante sobre el mantenimiento..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="outline">
          <Camera className="mr-2 h-4 w-4" />
          Anexar Fotos
        </Button>

        <Separator />

        <FormField
          control={form.control}
          name="observations.hasIncident"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Se ha detectado una incidencia</FormLabel>
                <FormDescription>
                  Marque esta casilla si ha encontrado algún problema que requiera una orden de trabajo correctiva.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {hasIncident && (
          <Card className="bg-accent/20 border-accent">
            <CardHeader>
              <CardTitle>OT Correctivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="observations.correctiveAction.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Incidencia</FormLabel>
                    <FormControl><Input placeholder="Ej: Falla la impresora del pupitre" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations.correctiveAction.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción detallada</FormLabel>
                    <FormControl><Textarea placeholder="Describa el problema encontrado..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations.correctiveAction.priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una prioridad" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
        
        <Separator />
        
        <div>
            <h3 className="text-lg font-medium mb-4">Horas de trabajo y Firmas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <FormField
                    control={form.control}
                    name="observations.startTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Hora Inicio</FormLabel>
                        <FormControl>
                            <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="observations.endTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Hora Fin</FormLabel>
                        <FormControl>
                            <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="observations.technicianSignature"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Firma del Técnico (Obligatoria)</FormLabel>
                            <FormControl>
                                <SignaturePad onSign={(signatureData) => field.onChange(signatureData)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="observations.supervisorSignature"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Firma del Responsable (Opcional)</FormLabel>
                            <FormControl>
                                <SignaturePad onSign={(signatureData) => field.onChange(signatureData)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
      </div>
    </FormSection>
  );
}
