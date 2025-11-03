'use client';

import { useState, useEffect } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import { formSchemaMagneticas, formSchemaMagneticasLenient, type FormValuesMagneticas } from '@/lib/schema';
import { useToast } from '@/hooks/use-toast';
import { submitMagneticasOrder } from '@/app/actions';
import { generateMagneticasPdf } from '@/lib/pdf-generator-magneticas';
import { useOfflineTasks } from '@/hooks/use-offline-tasks';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { StepIndicator } from '@/components/step-indicator';
import { Step1DatosIntervencion } from '@/components/steps-magneticas/step-1-datos-intervencion';
import { Step2InventarioVersiones } from '@/components/steps-magneticas/step-2-inventario-versiones';
import { Step3TareasMantenimiento } from '@/components/steps-magneticas/step-3-tareas-mantenimiento';
import { Step4PiezasSustituidas } from '@/components/steps-magneticas/step-4-piezas-sustituidas';
import { Step5ObservacionesTancament } from '@/components/steps-magneticas/step-5-observaciones-tancament';
import { Step6Adjuntos } from '@/components/steps-magneticas/step-6-adjuntos';
import { CheckCircle, Loader2, Download, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

/**
 * Genera un código numérico de 6 dígitos para validadora
 */
function generarCodigoValidadora(task: any): string {
  // 1. Intentar obtener código existente de múltiples campos
  const posiblesCodigos = [
    task.n_validadora,
    task.num_validadora,
    task.codigo_validadora,
    task.validadoraId,
    task.validadora_id
  ];
  
  let codigo = posiblesCodigos.find(c => c && String(c).trim() !== '');
  
  // 2. Si existe código, limpiar y formatear
  if (codigo) {
    // Extraer solo números del código
    const numeros = String(codigo).replace(/\D/g, '');
    
    if (numeros) {
      // Rellenar con ceros a la izquierda hasta 6 dígitos
      // Si es más largo, tomar últimos 6 dígitos
      const numeroFormateado = numeros.padStart(6, '0');
      return numeroFormateado.slice(-6);
    }
  }
  
  // 3. Si no existe, generar desde el ID de tarea
  const taskId = task.id || 'default';
  
  // Extraer números del ID
  const numeroMatch = taskId.match(/(\d+)/);
  let numeroBase = 1;
  
  if (numeroMatch) {
    numeroBase = parseInt(numeroMatch[0]);
  } else {
    // Si no hay números, generar hash del ID
    numeroBase = Math.abs(
      taskId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    );
  }
  
  // Usar módulo para mantenerlo dentro de 6 dígitos
  const numeroFinal = numeroBase % 1000000;
  
  // Formatear con ceros a la izquierda
  return numeroFinal.toString().padStart(6, '0');
}

/**
 * Verifica si una matrícula es moderna (serie M o posterior)
 */
function esMatriculaModerna(matricula: string): boolean {
  if (!matricula) return false;
  
  // Extraer solo letras
  const letras = matricula.replace(/[^A-Z]/gi, '').toUpperCase();
  
  if (letras.length >= 1) {
    const primeraLetra = letras[0];
    // Series modernas: M, N, P, Q, R, S, T, V, W, X, Y, Z
    return 'MNPQRSTVWXYZ'.includes(primeraLetra);
  }
  
  return false;
}

/**
 * Genera una matrícula moderna española (series M-Z actuales)
 */
function generarMatriculaModerna(taskId: string | number): string {
  // Letras consonantes permitidas
  const consonantes = 'BCDFGHJKLMNPRSTVWXYZ';
  // Solo series modernas (desde M en adelante)
  const letrasModernas = 'MNPQRSTVWXYZ';
  
  // Convertir taskId a número para cálculos
  let numeroBase = 0;
  
  if (typeof taskId === 'number') {
    numeroBase = taskId;
  } else {
    // Extraer números del ID string
    const match = String(taskId).match(/(\d+)/);
    if (match) {
      numeroBase = parseInt(match[0]);
    } else {
      // Generar hash si no hay números
      numeroBase = Math.abs(
        String(taskId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      );
    }
  }
  
  // Generar 4 dígitos
  const numeros = (numeroBase % 10000).toString().padStart(4, '0');
  
  // Primera letra: SOLO de series modernas (M-Z)
  const letra1 = letrasModernas[(numeroBase * 7) % letrasModernas.length];
  
  // Segunda y tercera letra: cualquier consonante
  const letra2 = consonantes[(numeroBase * 13) % consonantes.length];
  const letra3 = consonantes[(numeroBase * 19) % consonantes.length];
  
  return numeros + letra1 + letra2 + letra3;
}

/**
 * Obtiene una matrícula moderna del vehículo
 * Prioriza matrículas reales modernas, genera simuladas si no existen o son antiguas
 */
function obtenerMatriculaModerna(task: any): string {
  // 1. Buscar matrícula real en múltiples campos
  const posiblesMatriculas = [
    task.matricula,
    task.matriculaVehiculo,
    task.vehiculo_matricula,
    task.plate,
    task.licensePlate,
    task.vehiclePlate
  ];
  
  const matriculaReal = posiblesMatriculas.find(m => m && String(m).trim() !== '');
  
  // 2. Si existe matrícula real y es moderna, usarla
  if (matriculaReal && esMatriculaModerna(String(matriculaReal))) {
    return String(matriculaReal).toUpperCase();
  }
  
  // 3. Si no existe o es antigua, generar una moderna
  const taskId = task.id || task.vehiculo || 'default';
  return generarMatriculaModerna(taskId);
}

const steps = [
  { id: 1, name: 'Dades Intervenció' },
  { id: 2, name: 'Inventari' },
  { id: 3, name: 'Checklist' },
  { id: 4, name: 'Peces' },
  { id: 5, name: 'Observacions' },
  { id: 6, name: 'Adjunts' },
];

type Props = {
  task: any;
  operatorId?: string;
  onClose?: () => void;
};

export function FormularioValidadorasMagneticas({ task, operatorId, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValuesMagneticas | null>(null);
  const [horaInicioRegistrada, setHoraInicioRegistrada] = useState<string>('');
  const { toast } = useToast();
  const { markTaskCompleted } = useOfflineTasks();

  // Modo lenient por defecto para pruebas
  const isStrict = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORM_STRICT === '1';

  const form = useForm<FormValuesMagneticas>({
    resolver: zodResolver(isStrict ? formSchemaMagneticas : formSchemaMagneticasLenient),
    defaultValues: {
      datosIntervencion: {
        contrato: 'C-4/2025',
        operador: task.operador || '',
        estacion: task.cochera || task.ubicacion || '',
        numeroValidadora: generarCodigoValidadora(task),
        matricula: obtenerMatriculaModerna(task),
        tecnico: 'Tècnic Assignat', // Será rellenado por el técnico del adjudicatario
        data: new Date(),
        horaProgramada: task.hora || '',
      },
      inventarioVersiones: {
        modelValidadora: '',
        numeroSerie: '',
        versionFirmware: '',
        versionSoftware: '',
        ultimaActualizacion: new Date(),
      },
      tareasMantenimiento: {
        // Fase 1: Intervenció (PPT 2.1.2)
        "Desmuntatge de la validadora del vehicle": false,

        // Fase 2: Taller (PPT 2.1.2)
        "Neteja interna de la validadora (pols)": false,
        "Neteja externa de la validadora": false,
        "Neteja de vies de pas de bitllets": false,
        "Neteja de fotocèl·lules": false,
        "Verificació i ajust de rodets de pressió del capçal magnètic": false,
        "Verificació/substitució del capçal magnètic": false,
        "Comprovació de tensió de corretges": false,
        "Verificació i apreto de cargols de subjecció de motors": false,
        "Substitució preventiva de peces desgastades (si escau)": false,

        // Fase 3: Tancament Vehicle (PPT 2.1.2)
        "Restitució de l'equip al vehicle": false,
        "Comprovació de comunicació amb sistema embarcat": false,
        "Verificació a bord (Test d'explotació)": false,
        "Obtenció i adjunció del justificant de test": false,

        // Fase 4: Documentació
        "Registre fotogràfic realitzat": false,
        "Documentació tècnica actualitzada": false,
      },
      piezasSustituidas: [],
      observacionesTancament: {
        horaInicio: '',
        horaFin: '',
        tiempoTotal: '',
        observacionesGenerales: '',
        tieneIncidencia: false,
        incidencia: {
          titulo: '',
          descripcion: '',
          prioridad: 'Baixa',
          generarOrdenCorrectiva: false,
        },
        conformitatOperador: '', // Campo PPT
      },
      adjuntos: {
        fotografias: [],
        justificantTest: '', // Campo PPT
      },
    },
  });

  // Registrar hora de inicio al abrir el formulario
  useEffect(() => {
    const now = new Date();
    const horaActual = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setHoraInicioRegistrada(horaActual);
    form.setValue('observacionesTancament.horaInicio', horaActual);
  }, [form]);

  const nextStep = () => {
    console.log(`Navegando de paso ${currentStep} a ${currentStep + 1} de ${steps.length - 1}`);
    setCurrentStep((s) => {
      const newStep = s < steps.length - 1 ? s + 1 : s;
      console.log(`Nuevo paso: ${newStep}`);
      return newStep;
    });
  };

  const prevStep = () => {
    console.log(`Retrocediendo de paso ${currentStep} a ${currentStep - 1}`);
    setCurrentStep((s) => (s > 0 ? s - 1 : s));
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const data = form.getValues();
      // Guardar en localStorage como borrador
      localStorage.setItem(`draft-magneticas-${task.id}`, JSON.stringify(data));
      toast({
        title: 'Esborrany guardat',
        description: 'Les dades han estat guardades correctament.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No s\'ha pogut guardar l\'esborrany.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: FormValuesMagneticas) => {
    setIsSubmitting(true);

    try {
      // Registrar hora de fin
      const now = new Date();
      const horaFin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      data.observacionesTancament.horaFin = horaFin;

      // Enviar al servidor
      const result = await submitMagneticasOrder(data, task.id);

      if (result.success) {
        // Marcar tarea como completada
        markTaskCompleted(task.id, 'validator');

        // Limpiar borrador
        localStorage.removeItem(`draft-magneticas-${task.id}`);

        setSubmittedData(data);

        toast({
          title: 'Ordre enviada amb èxit',
          description: 'L\'ordre de manteniment ha estat registrada correctament.',
        });
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error: any) {
      console.error('Error al enviar formulario:', error);
      toast({
        title: 'Error',
        description: error.message || 'No s\'ha pogut enviar l\'ordre.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<FormValuesMagneticas>) => {
    // Detectar la primera sección con error y navegar allí
    const keys = Object.keys(errors);
    if (keys.includes('datosIntervencion')) setCurrentStep(0);
    else if (keys.includes('inventarioVersiones')) setCurrentStep(1);
    else if (keys.includes('tareasMantenimiento')) setCurrentStep(2);
    else if (keys.includes('piezasSustituidas')) setCurrentStep(3);
    else if (keys.includes('observacionesTancament')) setCurrentStep(4);
    else if (keys.includes('adjuntos')) setCurrentStep(5);

    // Mensaje claro
    const firstErrorMsg = (() => {
      const e = errors as any;
      return (
        e?.adjuntos?.fotografias?.message ||
        e?.tareasMantenimiento?.message ||
        e?.observacionesTancament?.message ||
        'Falten camps obligatoris. Revisa el formulari.'
      );
    })();

    toast({
      title: 'Formulari incomplet',
      description: firstErrorMsg,
      variant: 'destructive',
    });
  };

  const handleDownloadPdf = async () => {
    if (submittedData) {
      try {
        await generateMagneticasPdf(submittedData, task);
        toast({
          title: 'PDF generat',
          description: 'L\'informe s\'ha descarregat correctament.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No s\'ha pogut generar el PDF.',
          variant: 'destructive',
        });
      }
    }
  };

  // Pantalla de éxito
  if (submittedData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Ordre Enviada amb Èxit</CardTitle>
          <CardDescription>
            L'ordre de manteniment de validadora magnètica ha estat registrada.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p>Podeu descarregar l'informe en format PDF.</p>
          <Button onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Descarregar PDF
          </Button>
          <Button variant="outline" onClick={() => onClose?.()}>
            Tornar a la llista
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Manteniment Preventiu - Validadors Magnètiques
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Contracte C-4/2025 • Validadora: {task.n_validadora || task.vehiculo}
        </p>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
      
      {/* Mostrar nombre del paso actual */}
      <div className="text-center mt-4">
        <p className="text-sm font-medium text-muted-foreground">
          Pas {currentStep + 1} de {steps.length}: <span className="text-primary font-semibold">{steps[currentStep].name}</span>
        </p>
      </div>

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
              {currentStep === 0 && <Step1DatosIntervencion form={form as any} />}
              {currentStep === 1 && <Step2InventarioVersiones form={form as any} />}
              {currentStep === 2 && <Step3TareasMantenimiento form={form as any} />}
              {currentStep === 3 && <Step4PiezasSustituidas form={form as any} />}
              {currentStep === 4 && <Step5ObservacionesTancament form={form as any} />}
              {currentStep === 5 && <Step6Adjuntos form={form as any} />}
            </motion.div>
          </AnimatePresence>

          {/* Navegación */}
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardant...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Esborrany
                </>
              )}
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Següent ({steps[currentStep + 1]?.name})
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviant...
                  </>
                ) : (
                  'Finalitzar i Generar PDF'
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
