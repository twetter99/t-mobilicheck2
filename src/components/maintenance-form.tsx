'use client';

import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import { formSchema, formSchemaLenient, type FormValues } from '@/lib/schema';
import { useToast } from '@/hooks/use-toast';
import { validateWithAI, submitMaintenanceOrder, markTaskAsCompleted } from '@/app/actions';
import { generateMaintenancePdf } from '@/lib/pdf-generator';
import { data } from '@/lib/data';
import { useOfflineTasks } from '@/hooks/use-offline-tasks';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { StepIndicator } from '@/components/step-indicator';
import { Step1Header } from '@/components/steps/step-1-header';
import { Step2Inventory } from '@/components/steps/step-2-inventory';
import { Step3Software } from '@/components/steps/step-3-checklist';
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
  { id: 5, name: 'Observacions i Signatures', fields: ['observations'] },
];

export function MaintenanceForm({ revision, operatorId, onClose }: { revision: any, operatorId?: string, onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiValidating, setIsAiValidating] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();
  const { markTaskCompleted } = useOfflineTasks();

  const bus = revision ? data.autobuses.find(b => b.uniqueId === revision.vehiculoId) : null;

  // Modo lenient por defecto para pruebas; para activar estricto usar NEXT_PUBLIC_FORM_STRICT=1
  const isStrict = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORM_STRICT === '1';

  const form = useForm<FormValues>({
    resolver: zodResolver(isStrict ? formSchema : formSchemaLenient),
    defaultValues: {
      header: {
        orderNumber: '',
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
        mccSerial: '',
        switchSerial: '',
        installationKitSerial: '',
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
        valIn1Serial: '',
        valIn2Serial: '',
        valOut1Serial: '',
        valOut2Serial: '',
        valOut3Serial: '',
        valOut4Serial: '',
        connectionsPlateSerial: '',
        triBandAntennaSerial: '',
        legacyMag1Brand: 'N/A',
        legacyMag1Serial: '',
        legacyMag2Brand: 'N/A',
        legacyMag2Serial: '',
      },
      software: {
        consoleSoftware: '',
        configVersion: '',
        telechargeVersion: '',
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
        preliminaryCheck: 'N/A',
        preexistingSystemsCheck: 'N/A',
        connectionPlateInstallation: 'N/A',
        antennaInstallation: 'N/A',
        mccInstallation: 'N/A',
        consoleSupportInstallation: 'N/A',
        consoleInstallation: 'N/A',
        validatorSupportInstallation: 'N/A',
        finalCheck: 'N/A',
        softwareUpdate: 'N/A',
        functionalTests: 'N/A',
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

  const next = () => {
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
        title: '✅ Validació IA superada',
        description: 'L\'IA no ha detectat cap contradicció ni incoherència en les dades.',
        variant: 'default',
        className: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600'
      });
    } else if (result.results) {
        const errors: string[] = [];
        let errorCount = 0;
        
        Object.entries(result.results).forEach(([field, validation]) => {
          if (!validation.isValid) {
            errorCount++;
            const errorMsg = validation.errorMessage || 'Error de validació';
            errors.push(`• ${field}: ${errorMsg}`);
            console.error(`❌ Error IA en ${field}: ${errorMsg}`);
          }
        });
        
        // Mostrar un toast detallado para cada error (máximo 3)
        const errorsToShow = errors.slice(0, 3);
        errorsToShow.forEach((error, index) => {
          setTimeout(() => {
            toast({
              title: `🤖 IA: Contradicció detectada (${index + 1}/${errorCount})`,
              description: error,
              variant: 'destructive',
              duration: 8000, // Más tiempo para leer
            });
          }, index * 300); // Escalonar los toasts
        });
        
        if (errorCount > 3) {
          setTimeout(() => {
            toast({
              title: '⚠️ Més contradiccions detectades',
              description: `L'IA ha trobat ${errorCount - 3} contradiccions addicionals. Revisa la consola per a més detalls.`,
              variant: 'destructive',
              duration: 6000,
            });
          }, 900);
        }

    } else {
        toast({
            title: '❌ Error de validació IA',
            description: result.error || 'No s\'ha pogut completar la validació amb IA.',
            variant: 'destructive',
          });
    }

    setIsAiValidating(false);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await submitMaintenanceOrder(data);
      
      if (response.success) {
        setSubmittedData(data);
        
        // Guardar en localStorage (lado cliente)
        if (response.formSubmission && response.completionData) {
          // 1. Guardar formulario completo
          const completedForms = JSON.parse(localStorage.getItem('completedMaintenanceForms') || '[]');
          const existingFormIndex = completedForms.findIndex((form: any) => 
            form.busNumber === response.formSubmission.busNumber
          );
          
          if (existingFormIndex !== -1) {
            completedForms[existingFormIndex] = response.formSubmission;
          } else {
            completedForms.push(response.formSubmission);
          }
          
          localStorage.setItem('completedMaintenanceForms', JSON.stringify(completedForms));
          
          // 2. Guardar tarea completada
          const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
          const existingTaskIndex = completedTasks.findIndex((task: any) => 
            task.busNumber === response.completionData.busNumber || task.id === response.completionData.id
          );
          
          if (existingTaskIndex !== -1) {
            completedTasks[existingTaskIndex] = response.completionData;
          } else {
            completedTasks.push(response.completionData);
          }
          
          localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        }
        
        // También marcar usando el hook (para actualización de estado inmediata)
        if (revision?.id) {
          markTaskCompleted(revision.id, 'revision');
        }
        
        toast({
          title: "Tasca completada",
          description: "L'ordre de manteniment ha estat enviada i guardada localment.",
          variant: 'default',
        });
      } else {
        toast({
          title: "Error en l'enviament",
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting maintenance order:', error);
      toast({
        title: "Error inesperat",
        description: "S'ha produït un error durant l'enviament.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    // Usar console.warn en lugar de console.error para evitar warnings de Next.js
    console.warn('Errors de validació del formulari:', JSON.stringify(errors, null, 2));
    
    // Contar cuántos campos tienen errores
    const errorCount = Object.keys(errors).length;
    
    // Crear mensaje detallado
    let errorMessage = 'Si us plau, reviseu els camps marcats en vermell.';
    
    if (errorCount > 0) {
      const errorSections = Object.keys(errors).map(key => {
        const sectionNames: Record<string, string> = {
          header: 'Capçalera',
          inventory: 'Inventari',
          software: 'Programari',
          checklist: 'Checklist',
          verification: 'Verificació',
          observations: 'Observacions',
          preexistingSystems: 'Sistemes Preexistents',
          executionPhases: 'Fases d\'Execució',
        };
        return sectionNames[key] || key;
      });
      
      errorMessage = `Errors a: ${errorSections.join(', ')}. ${errorMessage}`;
    }
    
    toast({
        title: `Formulari incomplet (${errorCount} secció${errorCount !== 1 ? 's' : ''})`,
        description: errorMessage,
        variant: 'destructive',
      });
  }
  
  const handleDownloadPdf = async () => {
    if (submittedData) {
      try {
        await generateMaintenancePdf(submittedData);
        toast({
          title: 'PDF generat',
          description: 'El PDF s\'ha descarregat correctament.',
          variant: 'default',
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: 'Error',
          description: 'No s\'ha pogut generar el PDF.',
          variant: 'destructive',
        });
      }
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
            <Button variant="outline" onClick={() => onClose?.()}>
                Tornar a la llista de revisions
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
              {currentStep === 0 && <Step1Header form={form as any} />}
              {currentStep === 1 && <Step2Inventory form={form as any} />}
              {currentStep === 2 && <Step3Software form={form as any} />}
              {currentStep === 3 && <Step4Verification form={form as any} />}
              {currentStep === 4 && <Step5Observations form={form as any} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-5">
            {/* Panel informativo sobre validación IA */}
            {currentStep === steps.length - 1 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">💡 Validació Intel·ligent amb IA</h4>
                    <p className="text-sm text-purple-800">
                      Abans d'enviar, pots usar la <strong>validació amb IA</strong> per detectar contradiccions 
                      i incoherències automàticament. Per exemple, si marques un component com "OK" però després 
                      reportes un problema en les observacions, la IA t'ho indicarà.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button type="button" onClick={prev} variant="outline" disabled={currentStep === 0 || isSubmitting}>
                Anterior
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={next} disabled={isSubmitting}>
                  Següent
                </Button>
              ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAiValidation} 
                        disabled={isAiValidating || isSubmitting}
                        className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 hover:from-purple-100 hover:to-blue-100 hover:border-purple-400 transition-all"
                      >
                          {isAiValidating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              IA Analitzant...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                              🤖 Validar amb IA
                            </>
                          )}
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
