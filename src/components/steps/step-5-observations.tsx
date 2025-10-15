'use client';

import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import { FormSection } from '@/components/form-section';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Camera, Trash2 } from 'lucide-react';
import { SignaturePad } from '@/components/signature-pad';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';

type Step5Props = {
  form: UseFormReturn<FormValues>;
};

const PhotoUpload = ({
  label,
  field,
}: {
  label: string;
  field: any;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(field.value || []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      const allPreviews = [...previews, ...newPreviews];
      setPreviews(allPreviews);

      // This would need a proper upload handler
      // For now, we'll store the object URLs
      field.onChange(allPreviews); 
    }
  };

  const handleRemove = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    field.onChange(updatedPreviews);
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <Image
              src={src}
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
        <Button
          type="button"
          variant="outline"
          className="flex flex-col items-center justify-center h-full aspect-square border-dashed"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-8 w-8 text-muted-foreground" />
          <span className="mt-2 text-xs">Afegir Foto</span>
        </Button>
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
    <FormSection title="Secció 5: Observacions i Tancament" description="Afegiu notes, incidències i recolliu les firmes.">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="observations.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observacions</FormLabel>
              <FormControl>
                <Textarea placeholder="Afegiu qualsevol observació rellevant sobre el manteniment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
           <FormField
            control={form.control}
            name="observations.beforePhotos"
            render={({ field }) => <PhotoUpload label="Fotos de l'Abans" field={field} />}
          />
           <FormField
            control={form.control}
            name="observations.afterPhotos"
            render={({ field }) => <PhotoUpload label="Fotos del Després" field={field} />}
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
                <FormLabel>S'ha detectat una incidència</FormLabel>
                <FormDescription>
                  Marqueu aquesta casella si heu trobat algun problema que requereixi una ordre de treball correctiva.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {hasIncident && (
          <Card className="bg-accent/20 border-accent">
            <CardHeader>
              <CardTitle>OT Correctiu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="observations.correctiveAction.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Títol de la Incidència</FormLabel>
                    <FormControl><Input placeholder="Ex: Falla la impressora del pupitre" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations.correctiveAction.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripció detallada</FormLabel>
                    <FormControl><Textarea placeholder="Descriviu el problema trobat..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations.correctiveAction.priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioritat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccioneu una prioritat" /></SelectTrigger></FormControl>
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
            </CardContent>
          </Card>
        )}
        
        <Separator />
        
        <div>
            <h3 className="text-lg font-medium mb-4">Hores de treball i Firmes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <FormField
                    control={form.control}
                    name="observations.startTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Hora Inici</FormLabel>
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
                        <FormLabel>Hora Fi</FormLabel>
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
                            <FormLabel>Firma del Tècnic (Obligatòria)</FormLabel>
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
