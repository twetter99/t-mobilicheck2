'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { StepIndicator } from '@/components/step-indicator';
import { Step1Header } from '@/components/steps/step-1-header';
import { Step2Inventory } from '@/components/steps/step-2-inventory';
import { Step3Software } from '@/components/steps/step-3-checklist';
import { Step4PreexistingSystems } from '@/components/steps/step-4-preexisting-systems';
import { Step5ExecutionPhases } from '@/components/steps/step-5-execution';
import { Step5Observations } from '@/components/steps/step-5-observations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, HardHat, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitMaintenanceOrder } from '@/app/actions';
import Link from 'next/link';
import type { ChecklistStep } from '@/lib/checklist-data';
import { formSchema as operationSchema, type FormValues as OperationFormValues } from '@/lib/schema';
import { generateInstallationPdf } from '@/lib/pdf-generator';


export function OperationClientPage({ revision, operatorId, checklist }: { revision: any; operatorId?: string | null, checklist: ChecklistStep[] }) {
  const steps = [
    { id: 1, name: 'Intervención', section: 'header' },
    { id: 2, name: 'Hardware', section: 'inventory' },
    { id: 3, name: 'Software', section: 'software' },
    { id: 4, name: 'Sistemas Preexistentes', section: 'preexistingSystems' },
    { id: 5, name: 'Ejecución', section: 'executionPhases' },
    { id: 6, name: 'Cierre', section: 'observations' },
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const { toast } = useToast();

  const form = useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      header: {
        orderNumber: `OT-${revision?.id.slice(-4)}` || '',
        operator: operatorId || '',
        depot: revision?.ubicacion || '',
        busNumber: revision?.vehiculoId || '',
        licensePlate: revision?.matricula || '',
        technician: '',
        date: new Date(),
      },
      inventory: {
        consoleSerial: '',
        mccSerial: '',
        switchSerial: '',
        installationKitSerial: '',
        consoleMount: 'brazo_largo',
        sc1Serial: '',
        sc1SupportSerial: '',
        sc1DeviceCode: '',
        sc2Serial: '',
        sc2SupportSerial: '',
        sc2DeviceCode: '',
        sc3Serial: '',
        sc3SupportSerial: '',
        sc3DeviceCode: '',
        sc4Serial: '',
        sc4SupportSerial: '',
        sc4DeviceCode: '',
        sc5Serial: '',
        sc5SupportSerial: '',
        sc5DeviceCode: '',
        sc6Serial: '',
        sc6SupportSerial: '',
        sc6DeviceCode: '',
        queryTerminalSerial: '',
        queryTerminalSupportSerial: '',
        queryTerminalDeviceCode: '',
      },
      software: {
        consoleSoftware: '',
        telechargeVersion: '',
        configVersion: '',
      },
      preexistingSystems: {
        magneticValidatorBrand: '',
        magneticValidatorModel: '',
        magneticValidatorSerial: '',
        contactlessValidatorBrand: '',
        contactlessValidatorModel: '',
        contactlessValidatorSerial: '',
        saeIntegration: 'No',
        saeBrand: '',
        saeModel: '',
        exteriorPanelsIntegration: 'No',
        exteriorPanelsBrand: '',
        exteriorPanelsModel: '',
      },
      executionPhases: {
        preliminaryCheck: 'OK',
        preexistingSystemsCheck: 'OK',
        connectionPlateInstallation: 'OK',
        antennaInstallation: 'OK',
        mccInstallation: 'OK',
        consoleSupportInstallation: 'OK',
        consoleInstallation: 'OK',
        validatorSupportInstallation: 'OK',
        finalCheck: 'OK',
        softwareUpdate: 'OK',
        functionalTests: 'OK',
      },
      observations: {
        startTime: '09:00',
        endTime: '11:00',
        notes: '',
        hasIncident: false,
        correctiveAction: { title: '', description: '', priority: 'Baja' },
        technicianSignature: '',
        supervisorSignature: '',
        beforePhotos: [],
        afterPhotos: [],
      },
    },
  });

  const next = async () => {
    const section = steps[currentStep].section;
    const output = await form.trigger([section as keyof OperationFormValues], { shouldFocus: true });
    if (!output) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const onSubmit = async (data: OperationFormValues) => {
    setIsSubmitting(true);
    // This action needs to be generalized or a new one created for operations
    const response = await submitMaintenanceOrder(data as any); 
    setIsSubmitting(false);

    if (response.success) {
      setSubmittedData(data);
    } else {
      toast({
        title: 'Error al enviar',
        description: response.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleDownloadPdf = () => {
    if (submittedData) {
      generateInstallationPdf(submittedData, revision);
    } else {
       toast({
        title: 'Error',
        description: 'No se han encontrado datos para generar el PDF.',
        variant: 'destructive',
      });
    }
  }


  if (submittedData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Operación Enviada con Éxito</CardTitle>
            <CardDescription>La operación de {revision.tipo} ha sido registrada correctamente. Puede descargar el informe en formato PDF.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
             <Button onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Informe PDF
            </Button>
            <Button variant="outline" asChild>
                <Link href="/">
                    Volver a la lista
                </Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-4">
          <HardHat className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            Ficha de Operación
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {revision.tipo}
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <Step1Header form={form as any} />}
                {currentStep === 1 && <Step2Inventory form={form as any} />}
                {currentStep === 2 && <Step3Software form={form as any} />}
                {currentStep === 3 && <Step4PreexistingSystems form={form as any} />}
                {currentStep === 4 && <Step5ExecutionPhases form={form as any} checklist={checklist}/>}
                {currentStep === 5 && <Step5Observations form={form as any} />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-5">
              <div className="flex justify-between">
                <Button type="button" onClick={prev} variant="outline" disabled={currentStep === 0 || isSubmitting}>
                  Anterior
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={next} disabled={isSubmitting}>
                    Siguiente
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Finalizar y Enviar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
