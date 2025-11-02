'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from './ui/button';
import { Camera, CameraOff, CheckCircle } from 'lucide-react';

type QrScannerProps = {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  label?: string;
};

export function QrScanner({ onScan, onError, label = 'Escaneja codi QR o codi de barres' }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = useRef(`qr-reader-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    return () => {
      // Cleanup al desmontar
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch((err) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, [isScanning]);

  const startScanning = async () => {
    try {
      setError(null);
      
      // Inicializar escáner si no existe
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId.current);
      }

      // Configuración del escáner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Iniciar escáner
      await scannerRef.current.start(
        { facingMode: 'environment' }, // Cámara trasera
        config,
        (decodedText) => {
          // Éxito al escanear
          setScannedValue(decodedText);
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Error de escaneo (esto es normal cuando no detecta nada)
          // No hacer nada aquí para evitar spam de errores
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'No se pudo acceder a la cámara';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
      console.error('Error starting scanner:', err);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleReset = () => {
    setScannedValue(null);
    setError(null);
  };

  if (scannedValue) {
    return (
      <div className="relative flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed border-green-500 bg-green-50 p-4 dark:bg-green-900/20">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-2" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
            Codi escanejat correctament
          </p>
          <p className="text-xs text-muted-foreground font-mono bg-white px-2 py-1 rounded">
            {scannedValue}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="mt-4"
          >
            Escanejar un altre codi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div 
        id={scannerElementId.current} 
        className={`${isScanning ? 'block' : 'hidden'} w-full rounded-lg overflow-hidden border-2 border-primary`}
      />
      
      {!isScanning && (
        <div className="relative flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4">
          <div className="text-center space-y-4">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{label}</p>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                {error}
              </p>
            )}
            <Button type="button" onClick={startScanning}>
              <Camera className="mr-2 h-4 w-4" />
              Activar Càmera
            </Button>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="flex justify-center">
          <Button type="button" variant="destructive" size="sm" onClick={stopScanning}>
            <CameraOff className="mr-2 h-4 w-4" />
            Aturar Escaneig
          </Button>
        </div>
      )}
    </div>
  );
}
