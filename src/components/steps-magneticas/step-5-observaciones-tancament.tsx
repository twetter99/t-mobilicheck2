'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValuesMagneticas } from '@/lib/schema';
import { useEffect } from 'react';
import { SignaturePad } from '@/components/signature-pad';

type Props = {
  form: UseFormReturn<FormValuesMagneticas>;
};

export function Step5ObservacionesTancament({ form }: Props) {
  const tieneIncidencia = form.watch('observacionesTancament.tieneIncidencia');
  const horaInicio = form.watch('observacionesTancament.horaInicio');
  const horaFin = form.watch('observacionesTancament.horaFin');

  // Calcular tiempo total automáticamente
  useEffect(() => {
    if (horaInicio && horaFin) {
      const [h1, m1] = horaInicio.split(':').map(Number);
      const [h2, m2] = horaFin.split(':').map(Number);
      
      const inicio = h1 * 60 + m1;
      const fin = h2 * 60 + m2;
      const diff = fin - inicio;
      
      if (diff >= 0) {
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        form.setValue('observacionesTancament.tiempoTotal', `${hours}h ${minutes}m`);
      }
    }
  }, [horaInicio, horaFin, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Observacions i Tancament</CardTitle>
        <CardDescription>Informació final de la intervenció i incidències detectades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Horarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="observacionesTancament.horaInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora Inici *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>Autocompletat a l'obrir el formulari</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacionesTancament.horaFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora Fi *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>Registrar a la finalització</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacionesTancament.tiempoTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temps Total</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} disabled className="bg-gray-100" />
                </FormControl>
                <FormDescription>Calculat automàticament</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Observaciones generales */}
        <FormField
          control={form.control}
          name="observacionesTancament.observacionesGenerales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incidències Ocorregudes (PPT)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Descriviu qualsevol incidència rellevant durant la intervenció..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Firma de Conformitat Operador (PPT) */}
        <FormField
          control={form.control}
          name="observacionesTancament.conformitatOperador"
          render={({ field }) => (
            <FormItem className="flex flex-col rounded-lg border p-4">
              <FormLabel>Conformitat Operador (PPT)</FormLabel>
              <FormControl>
                <SignaturePad
                  onSign={(dataUrl: string) => field.onChange(dataUrl)}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                Sol·licitar la signatura del responsable de cotxera si escau.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Incidencias */}
        <div className="space-y-4 border-t pt-4">
          <FormField
            control={form.control}
            name="observacionesTancament.tieneIncidencia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer font-semibold">
                    S'ha detectat incidència
                  </FormLabel>
                  <FormDescription>
                    Marqueu si s'ha trobat algun problema que requereixi atenció addicional
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {tieneIncidencia && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cal omplir els detalls de la incidència detectada
              </AlertDescription>
            </Alert>
          )}

          {tieneIncidencia && (
            <div className="space-y-4 pl-4 border-l-2 border-orange-500">
              <FormField
                control={form.control}
                name="observacionesTancament.incidencia.titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Títol Incidència *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Desgast excessiu del capçal magnètic" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacionesTancament.incidencia.descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripció *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descriviu detall la incidència detectada (mínim 20 caràcters)..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0} / 20 caràcters mínims
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacionesTancament.incidencia.prioridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioritat *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la prioritat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Mitjana">Mitjana</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacionesTancament.incidencia.generarOrdenCorrectiva"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-orange-50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer font-semibold">
                        Generar Ordre Correctiva
                      </FormLabel>
                      <FormDescription>
                        Es crearà automàticament una nova OT correctiva vinculada amb aquesta incidència
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
