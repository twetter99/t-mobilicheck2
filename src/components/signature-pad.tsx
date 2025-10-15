'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Pen, RefreshCw } from 'lucide-react';

type SignaturePadProps = {
  onSign: (signatureData: string) => void;
};

export function SignaturePad({ onSign }: SignaturePadProps) {
  const [isSigned, setIsSigned] = useState(false);

  const handleSign = () => {
    // In a real app, this would capture canvas data.
    // For this demo, we'll use a placeholder string.
    const signatureData = `signed_at_${new Date().toISOString()}`;
    onSign(signatureData);
    setIsSigned(true);
  };

  const handleClear = () => {
    onSign('');
    setIsSigned(false);
  };

  if (isSigned) {
    return (
        <div className="relative flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-green-500 bg-green-50 dark:bg-green-900/20">
            <div className='text-center text-green-600 dark:text-green-400'>
                <p className="font-serif text-2xl italic transform -skew-y-6">Firmado</p>
                <p className='text-xs text-green-500 dark:text-green-500'>Firma registrada digitalmente</p>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-2 top-2 text-muted-foreground hover:text-primary"
            >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Limpiar firma</span>
            </Button>
        </div>
    );
  }

  return (
    <div className="relative flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4">
      <div className="flex-grow w-full">
         <p className="text-center text-sm text-muted-foreground">Firme en este recuadro</p>
      </div>
      <div className="flex w-full justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={handleClear}>
          Limpiar
        </Button>
        <Button type="button" variant="default" onClick={handleSign}>
          <Pen className="mr-2 h-4 w-4" />
          Aceptar Firma
        </Button>
      </div>
    </div>
  );
}
