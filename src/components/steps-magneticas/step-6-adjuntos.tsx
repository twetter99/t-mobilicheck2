'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValuesMagneticas } from '@/lib/schema';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  form: UseFormReturn<FormValuesMagneticas>;
};

export function Step6Adjuntos({ form }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fotografias = form.watch('adjuntos.fotografias') || [];

  // Función de compresión de imagen (reutilizada del código existente)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto del canvas'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve(url);
              } else {
                reject(new Error('Error al comprimir la imagen'));
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const compressedUrl = await compressImage(files[i]);
        newPhotos.push(compressedUrl);
        newPreviews.push(compressedUrl);
      } catch (error) {
        console.error('Error al comprimir imagen:', error);
      }
    }

    const currentPhotos = form.getValues('adjuntos.fotografias') || [];
    form.setValue('adjuntos.fotografias', [...currentPhotos, ...newPhotos]);
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  // Cámara con getUserMedia (desktop/móvil) con fallback a input capture
  const startCamera = async () => {
    try {
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
      // Fallback a input con capture en móviles
      cameraInputRef.current?.click();
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
    await new Promise<void>(resolve => setTimeout(resolve, 0));
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      try {
        const compressedUrl = await compressImage(file);
        const currentPhotos = form.getValues('adjuntos.fotografias') || [];
        form.setValue('adjuntos.fotografias', [...currentPhotos, compressedUrl]);
      } catch (error) {
        console.error('Error al comprimir imagen capturada:', error);
      }
    }, 'image/jpeg', 0.92);
  };

  const handleRemovePhoto = (index: number) => {
    const currentPhotos = form.getValues('adjuntos.fotografias') || [];
    const photoToRemove = currentPhotos[index];
    
    // Liberar memoria
    if (photoToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove);
    }

    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    
    form.setValue('adjuntos.fotografias', newPhotos);
    setPreviewUrls(newPreviews);
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjunts</CardTitle>
        <CardDescription>Fotografies de la intervenció (mínim 1 imatge)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button type="button" onClick={startCamera} variant="outline" className="flex-1">
            <Camera className="mr-2 h-4 w-4" />
            Fer Fotografia
          </Button>
          <Button type="button" onClick={handleFileClick} variant="outline" className="flex-1">
            <Upload className="mr-2 h-4 w-4" />
            Afegir des d'Arxiu
          </Button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <FormField
          control={form.control}
          name="adjuntos.fotografias"
          render={() => (
            <FormItem>
              <FormDescription>
                {fotografias.length} fotografia{fotografias.length !== 1 ? 'es' : ''} afegida{fotografias.length !== 1 ? 'es' : ''}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {fotografias.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fotografias.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative border rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Fotografia ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {fotografias.length === 0 && (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
            <Camera className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>No s'han afegit fotografies encara</p>
            <p className="text-sm">Utilitzeu els botons de dalt per afegir imatges</p>
          </div>
        )}

        {/* Inputs ocultos: cámara (fallback) y archivo */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Modal de càmera amb previsualització i captura */}
        <Dialog open={cameraOpen} onOpenChange={(open) => { if (!open) stopCamera(); }}>
          <DialogContent className="max-w-[90vw] w-full sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Capturar foto</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <video ref={videoRef} className="w-full rounded-md bg-black" playsInline muted />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" type="button" onClick={stopCamera}>Tancar</Button>
                <Button type="button" onClick={capturePhoto}>Capturar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
