'use client';

import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import { formSchema, type FormValues } from '@/lib/schema';
import { useToast } from '@/hooks/use-toast';
import { validateWithAI, submitMaintenanceOrder } from '@/app/actions';

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

const steps = [
  { id: 1, name: 'Encabezado', fields: ['header'] },
  { id: 2, name: 'Inventario', fields: ['inventory'] },
  { id: 3, name: 'Checklist', fields: ['checklist'] },
  { id: 4, name: 'Verificación', fields: ['verification'] },
  { id: 5, name: 'Observaciones y Firmas', fields: ['observations'] },
];

export function MaintenanceForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiValidating, setIsAiValidating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      header: {
        operator: '',
        depot: 'Cochera Norte',
        busNumber: '',
        licensePlate: '',
        technician: '',
      },
      inventory: {
        consoleMount: 'brazo_largo',
        legacyMag1Brand: 'N/A',
        legacyMag2Brand: 'N/A',
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
        technicianSignature: '',
        supervisorSignature: '',
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
      setCurrentStep(step => step + 1);
    }
  };

  const handleAiValidation = async () => {
    setIsAiValidating(true);
    const formData = form.getValues();
    const result = await validateWithAI(formData);
    
    if (result.success) {
      toast({
        title: 'Validación IA superada',
        description: 'No se encontraron anomalías en los datos.',
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
            title: 'Errores de validación IA',
            description: `La IA ha detectado ${errorCount} posibles problemas. Por favor, revise los campos marcados.`,
            variant: 'destructive',
          });
          // Example of setting an error. This needs a proper mapping from AI result to form field.
          // form.setError('inventory.consoleSerial', { message: 'AI: Serial number seems incorrect for this bus model.' });

    } else {
        toast({
            title: 'Error de validación IA',
            description: result.error || 'No se pudo completar la validación con IA.',
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
      setIsSubmitted(true);
    } else {
      toast({
        title: 'Error al enviar',
        description: response.message,
        variant: 'destructive',
      });
    }
  };
  
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    console.error(errors);
    toast({
        title: 'Formulario incompleto',
        description: 'Por favor, revise los campos marcados en rojo.',
        variant: 'destructive',
      });
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Orden Enviada con Éxito</CardTitle>
            <CardDescription>La orden de mantenimiento ha sido registrada.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <p>Puede descargar el informe en formato PDF.</p>
            <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
                Crear nueva orden
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
                  Siguiente
                </Button>
              ) : (
                  <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={handleAiValidation} disabled={isAiValidating || isSubmitting}>
                          {isAiValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Validar con IA
                      </Button>
                      <Button type="submit" disabled={isSubmitting || isAiValidating}>
                          {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Finalizar y Enviar
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
