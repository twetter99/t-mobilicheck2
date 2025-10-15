'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { StepIndicator } from '@/components/step-indicator';
import { FormSection } from '@/components/form-section';
import { Step1Header } from '@/components/steps/step-1-header';
import { Step5Observations } from '@/components/steps/step-5-observations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, HardHat, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitMaintenanceOrder } from '@/app/actions';
import Link from 'next/link';

const ChecklistItem = ({ name, label, description, control }: { name: string; label: string; description: string; control: any }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>{label}</FormLabel>
          <FormDescription>{description}</FormDescription>
        </div>
      </FormItem>
    )}
  />
);

export function OperationClientPage({ revision, operatorId, checklist }: { revision: any; operatorId?: string | null; checklist: any[] }) {
  const steps = [
    { id: 1, name: 'Capçalera' },
    { id: 2, name: 'Checklist' },
    { id: 3, name: 'Observacions' },
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const { toast } = useToast();

  const checklistFields = checklist.reduce((acc, item) => {
    acc[item.id] = z.boolean().default(false);
    return acc;
  }, {});

  const operationSchema = z.object({
    header: z.object({
        operator: z.string().min(1, "L'operador és obligatori."),
        depot: z.string().min(1, 'La cotxera és obligatòria.'),
        busNumber: z.string().min(1, 'El número de bus/calca és obligatori.'),
        licensePlate: z.string().min(1, 'La matrícula és obligatòria.'),
        technician: z.string().min(1, 'El tècnic és obligatori.'),
        date: z.date({ required_error: 'La data és obligatòria.' }),
    }),
    checklist: z.object(checklistFields).refine(data => Object.values(data).every(Boolean), {
      message: "Totes les tasques del checklist s'han de completar.",
      path: [checklist[0]?.id || 'checklist'],
    }),
    observations: z.object({
        startTime: z.string().min(1, "L'hora d'inici és obligatòria."),
        endTime: z.string().min(1, "L'hora de fi és obligatòria."),
        notes: z.string().optional(),
        hasIncident: z.boolean().default(false),
        correctiveAction: z
          .object({
            title: z.string().min(1, 'El títol és obligatori.'),
            description: z.string().min(1, 'La descripció és obligatòria.'),
            priority: z.enum(['Baixa', 'Mitjana', 'Alta']),
          })
          .optional(),
        technicianSignature: z.string().min(1, 'La firma del tècnic és obligatòria.'),
        supervisorSignature: z.string().optional(),
        beforePhotos: z.array(z.string()).optional(),
        afterPhotos: z.array(z.string()).optional(),
    }),
  });

  type OperationFormValues = z.infer<typeof operationSchema>;

  const form = useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      header: {
        operator: operatorId || '',
        depot: revision?.ubicacion || '',
        busNumber: revision?.vehiculoId || '',
        licensePlate: revision?.matricula || '',
        technician: '',
        date: new Date(),
      },
      checklist: checklist.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
      observations: {
        startTime: '09:00',
        endTime: '11:00',
        notes: '',
        hasIncident: false,
        correctiveAction: { title: '', description: '', priority: 'Baixa' },
        technicianSignature: '',
        supervisorSignature: '',
        beforePhotos: [],
        afterPhotos: [],
      },
    },
  });

  const next = async () => {
    const fields = steps[currentStep].name.toLowerCase();
    const output = await form.trigger([fields as "header" | "checklist" | "observations"], { shouldFocus: true });
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
    // Here you would adapt submitMaintenanceOrder or create a new action
    const response = await submitMaintenanceOrder(data as any); 
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

  if (submittedData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Operació Enviada amb Èxit</CardTitle>
            <CardDescription>L'operació ha estat registrada correctament.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <p>Podeu tornar a la llista de tasques.</p>
            <Button variant="outline" asChild>
                <Link href="/">
                    Tornar a la llista
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
            Fitxa d'Operació
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {revision.tipo}
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto">
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
                {currentStep === 1 && (
                  <FormSection title={`Secció 2: Checklist d'${revision.tipo}`} description="Marqueu totes les tasques com a completades.">
                    <div className="space-y-4">
                      {checklist.map(item => (
                        <ChecklistItem key={item.id} name={`checklist.${item.id}`} label={item.title} description={item.description} control={form.control} />
                      ))}
                      {form.formState.errors.checklist && (
                         <div className="pt-2">
                           <FormMessage>{form.formState.errors.checklist.message}</FormMessage>
                         </div>
                      )}
                    </div>
                  </FormSection>
                )}
                {currentStep === 2 && <Step5Observations form={form as any} />}
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Finalitzar i Enviar
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
