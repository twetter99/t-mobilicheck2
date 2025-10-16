'use client';

import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { Camera, Trash2 } from 'lucide-react';

import type { FormValues } from '@/lib/schema';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SignaturePad } from '@/components/signature-pad';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSection } from '@/components/form-section';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const PhotoUpload = ({
  label,
  field,
  maxFiles = 5,
}: {
  label: string;
  field: any;
  maxFiles?: number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const photos = field.value || [];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const currentPhotosCount = photos.length;
      const newBase64s: string[] = [];
      
      for (const file of files) {
        if (currentPhotosCount + newBase64s.length >= maxFiles) break;
        const base64 = await fileToBase64(file);
        newBase64s.push(base64);
      }

      if (newBase64s.length > 0) {
        field.onChange([...photos, ...newBase64s]);
      }
    }
  };

  const handleRemove = (index: number) => {
    const updatedPhotos = photos.filter((_:any, i:number) => i !== index);
    field.onChange(updatedPhotos);
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((base64Src: string, index: number) => (
          <div key={index} className="relative group">
            <Image
              src={base64Src}
              alt={`${label} ${index + 1}`}
              width={150}
              height={150}
              className="rounded-md object-cover aspect-square"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {photos.length < maxFiles && (
          <Button
            type="button"
            variant="outline"
            className="flex flex-col items-center justify-center h-full aspect-square border-dashed"
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="h-8 w-8 text-muted-foreground" />
            <span className="mt-2 text-xs">Añadir Foto</span>
          </Button>
        )}
      </div>
      <FormControl>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </FormControl>
      <FormMessage />
    </div>
  );
};


export function Step5Observations({ form }: { form: UseFormReturn<FormValues> }) {
  const hasIncident = form.watch('observations.hasIncident');
  const { setValue, getValues } = form;

  useEffect(() => {
    if (hasIncident) {
      // Ensure the field exists with default values when the checkbox is checked
      const current = getValues('observations.correctiveAction');
      if (!current) {
        setValue('observations.correctiveAction', {
          title: '',
          description: '',
          priority: 'Baja',
        });
      }
    } else {
      // When unchecked, just clear the values but keep the field registered
      // This prevents the "uncontrolled to controlled" error.
      setValue('observations.correctiveAction', {
        title: '',
        description: '',
        priority: 'Baja',
      });
    }
  }, [hasIncident, setValue, getValues]);


  return (
    <FormSection title="Sección 5: Observaciones, Cierre y Firmas" description="Añada notas, incidencias, fotos y recoja las firmas.">
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
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="observations.beforePhotos"
            render={({ field }) => <PhotoUpload label="Fotos del estado ANTES (máx 5)" field={field} />}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="observations.afterPhotos"
            render={({ field }) => <PhotoUpload label="Fotos del estado DESPUÉS (máx 5)" field={field} />}
          />
        </div>

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
