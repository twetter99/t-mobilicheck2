'use client';

import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import { formSchema, type FormValues } from '@/lib/schema';
import { useToast } from '@/hooks/use-toast';
import { validateWithAI, submitMaintenanceOrder } from '@/app/actions';
import { generateMaintenancePdf } from '@/lib/pdf-generator';
import { data } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { StepIndicator } from '@/components/step-indicator';
import { Step1Header } from '@/components/steps/step-1-header';
import { Step2Inventory } from '@/components/steps/step-2-inventory';
import { Step3Checklist } from '@/components/steps/step-3-checklist';
import { Step4Verification } from '@/components/steps/step-4-verification';
import { Step5Observations } from '@/components/steps/step-5-observations';
import { AlertCircle, CheckCircle, Loader2, Sparkles, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import Link from 'next/link';

const steps = [
  { id: 1, name: 'Capçalera', fields: ['header'] },
  { id: 2, name: 'Inventari', fields: ['inventory'] },
  { id: 3, name: 'Checklist', fields: ['checklist'] },
  { id: 4, name: 'Verificació', fields: ['verification'] },
  { id: 5, name: 'Observacions i Firmes', fields: ['observations'] },
];

export function MaintenanceForm({ revision, operatorId }: { revision: any, operatorId?: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiValidating, setIsAiValidating] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();

  const bus = revision ? data.autobuses.find(b => b.uniqueId === revision.vehiculoId) : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      header: {
        operator: operatorId || '',
        depot: revision?.ubicacion || 'Cotxera Nord',
        busNumber: revision?.vehiculoId || '',
        licensePlate: bus?.id || '',
        technician: '',
        date: new Date(),
      },
      inventory: {
        consoleSerial: '',
        consoleMount: 'brazo_largo',
        consoleSoftware: '',
        configVersion: '',
        telechargeVersion: '',
        valIn1Serial: '',
        valIn2Serial: '',
        valOut1Serial: '',
        valOut2Serial: '',
        valOut3Serial: '',
        valOut4Serial: '',
        queryTerminalSerial: '',
        connectionsPlateSerial: '',
        switchSerial: '',
        mccSerial: '',
        triBandAntennaSerial: '',
        legacyMag1Brand: 'N/A',
        legacyMag1Serial: '',
        legacyMag2Brand: 'N/A',
        legacyMag2Serial: '',
      },
      checklist: {
        consoleGeneralCleaning: false,
        consoleAutocutterCleaning: false,
        consoleSerialRegistration: false,
        validatorGeneralCleaning: false,
        validatorConnectorsCleaning: false,
        validatorSerialRegistration: false,
      },
      verification: {
        startupOk: false,
        screenOk: false,
        printerOk: false,
        validationOk: false,
        communicationOk: false,
      },
      observations: {
        startTime: '09:00',
        endTime: '11:00',
        notes: '',
        hasIncident: false,
        correctiveAction: {
            title: '',
            description: '',
            priority: 'Baixa',
        },
        technicianSignature: '',
        supervisorSignature: '',
        beforePhotos: [],
        afterPhotos: [],
      },
    },
  });

  type FieldName = keyof FormValues;

  const next = async () => {
    const fields = steps[currentStep].fields as FieldName[];
    const output = await form.trigger(fields, { shouldFocus: true });

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

  const handleAiValidation = async () => {
    setIsAiValidating(true);
    const formData = form.getValues();
    const result = await validateWithAI(formData);
    
    if (result.success) {
      toast({
        title: 'Validació IA superada',
        description: 'No s\'han trobat anomalies en les dades.',
        variant: 'default',
        className: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600'
      });
    } else if (result.results) {
        let errorCount = 0;
        Object.entries(result.results).forEach(([field, validation]) => {
          if (!validation.isValid) {
            errorCount++;
            // This mapping is complex. We'll show a toast and log errors for now.
            // A more robust solution would map the flattened field names back to the nested form structure.
            console.error(`AI Validation Error on ${field}: ${validation.errorMessage}`);
          }
        });
        toast({
            title: 'Errors de validació IA',
            description: `La IA ha detectat ${errorCount} possibles problemes. Si us plau, reviseu els camps marcats.`,
            variant: 'destructive',
          });
          // Example of setting an error. This needs a proper mapping from AI result to form field.
          // form.setError('inventory.consoleSerial', { message: 'AI: Serial number seems incorrect for this bus model.' });

    } else {
        toast({
            title: 'Error de validació IA',
            description: result.error || 'No s\'ha pogut completar la validació amb IA.',
            variant: 'destructive',
          });
    }

    setIsAiValidating(false);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const response = await submitMaintenanceOrder(data);
    setIsSubmitting(false);

    if (response.success) {
      setSubmittedData(data);
    } else {
      toast({
        title: 'Error en enviar',
        description: response.message,
        variant: 'destructive',
      });
    }
  };
  
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    console.error(errors);
    toast({
        title: 'Formulari incomplet',
        description: 'Si us plau, reviseu els camps marcats en vermell.',
        variant: 'destructive',
      });
  }
  
  const handleDownloadPdf = () => {
    if (submittedData) {
      generateMaintenancePdf(submittedData);
    } else {
       toast({
        title: 'Error',
        description: 'No s\'han trobat dades per generar el PDF.',
        variant: 'destructive',
      });
    }
  }


  if (submittedData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Ordre Enviada amb Èxit</CardTitle>
            <CardDescription>L'ordre de manteniment ha estat registrada.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <p>Podeu descarregar l'informe en format PDF.</p>
            <Button onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Descarregar PDF
            </Button>
            <Button variant="outline" asChild>
                <Link href="/">
                    Tornar a la llista de revisions
                </Link>
            </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="mt-8 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <Step1Header form={form} />}
              {currentStep === 1 && <Step2Inventory form={form} />}
              {currentStep === 2 && <Step3Checklist form={form} />}
              {currentStep === 3 && <Step4Verification form={form} />}
              {currentStep === 4 && <Step5Observations form={form} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button type="button" onClick={prev} variant="outline" disabled={currentStep === 0 || isSubmitting}>
                Anterior
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={next} disabled={isSubmitting}>
                  Següent
                </Button>
              ) : (
                  <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={handleAiValidation} disabled={isAiValidating || isSubmitting}>
                          {isAiValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Validar amb IA
                      </Button>
                      <Button type="submit" disabled={isSubmitting || isAiValidating}>
                          {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Finalitzar i Enviar
                      </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
