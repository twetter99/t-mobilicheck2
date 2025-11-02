'use client';

import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { Pen, RefreshCw, Check } from 'lucide-react';

type SignaturePadProps = {
  onSign: (signatureData: string) => void;
  value?: string;
};

export function SignaturePad({ onSign, value }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Sincronizar con el valor externo
  useEffect(() => {
    if (value && value.length > 0 && sigCanvas.current) {
      try {
        // Si el value es una imagen base64, cargarla en el canvas
        if (value.startsWith('data:image')) {
          sigCanvas.current.fromDataURL(value);
          setIsSigned(true);
          setIsEmpty(false);
        }
      } catch (error) {
        console.error('Error loading signature:', error);
      }
    }
  }, [value]);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      onSign('');
      setIsSigned(false);
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // Guardar como imagen PNG en Base64
      const signatureData = sigCanvas.current.toDataURL('image/png');
      onSign(signatureData);
      setIsSigned(true);
      setIsEmpty(false);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  if (isSigned) {
    return (
      <div className="relative flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-green-500 bg-green-50 dark:bg-green-900/20">
        <img 
          src={value} 
          alt="Signatura" 
          className="max-h-40 max-w-full object-contain"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
            <Check className="h-3 w-3" />
            Signat
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-muted-foreground hover:text-primary bg-white"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Netejar signatura</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-48 w-full flex-col rounded-lg border-2 border-dashed bg-muted/50">
      <div className="flex-grow relative">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-full rounded-t-lg cursor-crosshair bg-white',
            style: { touchAction: 'none' }
          }}
          onBegin={handleBegin}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Pen className="h-4 w-4" />
              Dibuixa la teva signatura aquí
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center gap-2 p-2 bg-gray-50 rounded-b-lg">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleClear}
          disabled={isEmpty}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Netejar
        </Button>
        <Button 
          type="button" 
          variant="default" 
          size="sm"
          onClick={handleSave}
          disabled={isEmpty}
        >
          <Check className="mr-2 h-4 w-4" />
          Acceptar Signatura
        </Button>
      </div>
    </div>
  );
}
