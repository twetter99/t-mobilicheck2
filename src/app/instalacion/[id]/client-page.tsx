'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { installationSteps } from '@/lib/installation-steps';
import { CheckCircle, ChevronLeft, ChevronRight, HardHat, Loader2, PlayCircle, Clock } from 'lucide-react';
import { OperationClientPage } from '@/app/operacion/[id]/client-page';
import { checklists } from '@/lib/checklist-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function InstallationClientPage({ revision }: { revision: any }) {
  const [inWelcomeScreen, setInWelcomeScreen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guidedStepsCompleted, setGuidedStepsCompleted] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(Array(installationSteps.length).fill(false));
  const [elapsedTime, setElapsedTime] = useState(0);


  useEffect(() => {
    if (!inWelcomeScreen && !guidedStepsCompleted) {
      const timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [inWelcomeScreen, guidedStepsCompleted]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const totalSteps = installationSteps.length;
  const completedSteps = useMemo(() => checkedSteps.filter(Boolean).length, [checkedSteps]);
  const allStepsCompleted = useMemo(() => completedSteps === totalSteps, [completedSteps, totalSteps]);

  const operationTypeKey = revision.tipo.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const checklist = checklists[operationTypeKey] || [];

  const handleToggleStep = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !newCheckedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };

  const startInstallation = () => {
    setInWelcomeScreen(false);
  };

  const completeGuidedSteps = () => {
    setGuidedStepsCompleted(true);
  };

  if (guidedStepsCompleted) {
    return <OperationClientPage revision={revision} checklist={checklist} />;
  }
  
  if (inWelcomeScreen) {
    return (
      <Card className="w-full max-w-3xl mx-auto text-center">
        <CardHeader>
          <HardHat className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Proceso de Nueva Instalación</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Estás a punto de comenzar una nueva instalación. El proceso consta de {totalSteps} pasos obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="font-semibold">Tiempo estimado: 4-6 horas</p>
          <Button size="lg" onClick={startInstallation}>
            <PlayCircle className="mr-2 h-5 w-5" />
            COMENZAR INSTALACIÓN
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
         <CardHeader className='items-center'>
            <CardTitle className="text-2xl md:text-3xl">Guía de Instalación</CardTitle>
            <CardDescription>Marque cada paso a medida que lo completa.</CardDescription>
        </CardHeader>
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-primary">PASOS COMPLETADOS: {completedSteps} de {totalSteps}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className='h-4 w-4'/>
              <span>Tiempo transcurrido: {formatTime(elapsedTime)}</span>
            </div>
        </div>
        <Progress value={(completedSteps / totalSteps) * 100} className="w-full h-2" />
      </div>

      {/* Step List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
            <CardContent className="p-4 md:p-6 space-y-4">
                {installationSteps.map((stepData, index) => (
                    <div key={stepData.step} className="flex items-start gap-4 p-4 rounded-lg border bg-card has-[:checked]:bg-green-50 has-[:checked]:border-green-300 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-700 transition-colors">
                        <Checkbox 
                            id={`step-${index}`} 
                            checked={checkedSteps[index]}
                            onCheckedChange={() => handleToggleStep(index)}
                            className='mt-1 h-5 w-5'
                        />
                        <div className='grid gap-1.5'>
                            <Label htmlFor={`step-${index}`} className='font-bold text-base cursor-pointer'>
                                {`Paso ${stepData.step}: ${stepData.title}`}
                            </Label>
                            <p className="text-sm text-muted-foreground">{stepData.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-end">
            <Button type="button" onClick={completeGuidedSteps} disabled={!allStepsCompleted || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Finalizar Guía y Registrar Datos
            </Button>
        </div>
      </div>
    </div>
  );
}
