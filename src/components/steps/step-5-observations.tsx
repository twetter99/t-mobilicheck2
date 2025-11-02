
'use client';

import { useEffect, useRef, useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Tipo para las fotos optimizadas
type PhotoData = {
  url: string; // Object URL (blob:http://...)
  file?: File; // Archivo original para referencia
  name: string;
  size: number;
  compressed?: boolean; // Indica si la foto fue comprimida
};

// Comprimir imagen para reducir espacio (máx 1920px, calidad 0.8)
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar si es muy grande (máx 1920px en lado mayor)
        const maxSize = 1920;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a Blob con compresión (0.8 = 80% calidad)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper para convertir File a Object URL (con compresión automática)
const fileToObjectURL = async (file: File): Promise<PhotoData> => {
  // Comprimir la imagen antes de crear el Object URL
  const compressedFile = await compressImage(file);
  const url = URL.createObjectURL(compressedFile);
  
  return {
    url,
    file: compressedFile,
    name: file.name,
    size: compressedFile.size,
    compressed: true,
  };
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photos = field.value || [];
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // Nota: requiere contexto seguro (https o localhost)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOpen(true);
    } catch (e) {
      console.warn('No s\'ha pogut accedir a la càmera. Cause:', e);
      // Fallback: abrir selector de archivo si cámara no disponible
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      // Reutiliza el flujo de compresión y ObjectURL
      const photoData = await fileToObjectURL(file);
      const currentPhotosCount = (field.value || []).length;
      if (currentPhotosCount < maxFiles) {
        field.onChange([...(field.value || []), photoData]);
      }
    }, 'image/jpeg', 0.92);
  };

  // Cleanup de Object URLs cuando el componente se desmonta
  useEffect(() => {
    return () => {
      // Liberar memoria de Object URLs al desmontar
      photos.forEach((photo: PhotoData | string) => {
        if (typeof photo === 'object' && photo.url?.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const currentPhotosCount = (field.value || []).length;
      const newPhotos: PhotoData[] = [];
      
      for (const file of files) {
        if (currentPhotosCount + newPhotos.length >= maxFiles) break;
        
        // Crear Object URL con compresión automática
        const photoData = await fileToObjectURL(file);
        newPhotos.push(photoData);
      }

      if (newPhotos.length > 0) {
        field.onChange([...photos, ...newPhotos]);
      }
    }
  };

  const handleRemove = (index: number) => {
    const photoToRemove = photos[index];
    
    // Liberar Object URL de memoria
    if (typeof photoToRemove === 'object' && photoToRemove.url?.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    const updatedPhotos = photos.filter((_:any, i:number) => i !== index);
    field.onChange(updatedPhotos);
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo: PhotoData | string, index: number) => {
          // Soporte para formato antiguo (Base64) y nuevo (Object URL)
          const imageUrl = typeof photo === 'string' ? photo : photo.url;
          const photoName = typeof photo === 'string' ? `Foto ${index + 1}` : photo.name;
          
          return (
            <div key={index} className="relative group">
              <Image
                src={imageUrl}
                alt={photoName}
                width={150}
                height={150}
                className="rounded-md object-cover aspect-square"
                unoptimized // Necesario para Object URLs
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
              {typeof photo === 'object' && (
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                  {(photo.size / 1024).toFixed(0)} KB
                </div>
              )}
            </div>
          );
        })}
        {photos.length < maxFiles && (
          <>
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center justify-center h-full aspect-square border-dashed"
              onClick={startCamera}
            >
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-xs">Fer Foto</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center justify-center h-full aspect-square border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-xs">Arxiu</span>
            </Button>
          </>
        )}
      </div>
      {/* Input para abrir la cámara directamente */}
      <FormControl>
        <Input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </FormControl>
      {/* Input para elegir desde archivo (móvil o PC) */}
      <FormControl>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </FormControl>

      {/* Modal de càmera per a desktop i mòbil */}
      <Dialog open={cameraOpen} onOpenChange={(open) => { if (!open) stopCamera(); }}>
        <DialogContent className="max-w-[90vw] w-full sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Capturar foto</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <video ref={videoRef} className="w-full rounded-md bg-black" playsInline muted />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={stopCamera}>Tancar</Button>
              <Button onClick={capturePhoto}>Capturar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <FormMessage />
    </div>
  );
};


export function Step5Observations({ form }: { form: UseFormReturn<FormValues> }) {
  const hasIncident = form.watch('observations.hasIncident');
  const { setValue, getValues } = form;

  useEffect(() => {
    if (hasIncident) {
      // Assegurar que el camp existeix quan es marca la casella
      const current = getValues('observations.correctiveAction');
      if (!current) {
        setValue('observations.correctiveAction', {
          title: '',
          description: '',
          priority: 'Baixa',
        });
      }
    } else {
      // Netejar valors quan es desmarca, però MANTENIR l'estructura
      setValue('observations.correctiveAction', {
        title: '',
        description: '',
        priority: 'Baixa',
      });
    }
  }, [hasIncident, setValue, getValues]);


  return (
    <FormSection title="Secció 5: Observacions, Tancament i Signatures" description="Afegiu notes, incidències, fotos i recolliu les signatures.">
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
            render={({ field }) => <PhotoUpload label="Fotos de l'estat ABANS (màx. 5)" field={field} />}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="observations.afterPhotos"
            render={({ field }) => <PhotoUpload label="Fotos de l'estat DESPRÉS (màx. 5)" field={field} />}
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
            <h3 className="text-lg font-medium mb-4">Hores de treball i Signatures</h3>
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
                            <FormLabel>Signatura del Tècnic (Obligatòria)</FormLabel>
                            <FormControl>
                                <SignaturePad 
                                  onSign={(signatureData) => field.onChange(signatureData)} 
                                  value={field.value}
                                />
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
                            <FormLabel>Signatura del Responsable (Opcional)</FormLabel>
                            <FormControl>
                                <SignaturePad 
                                  onSign={(signatureData) => field.onChange(signatureData)} 
                                  value={field.value}
                                />
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
