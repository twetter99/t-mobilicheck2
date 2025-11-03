'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, HardHat, Download, Upload, Siren } from 'lucide-react';
import { useOfflineTasks } from '@/hooks/use-offline-tasks';
import type { data } from '@/lib/data';
import { MaintenanceForm } from './maintenance-form';
import { FormularioValidadorasMagneticas } from './formulario-validadoras-magneticas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

// Tipado unificado basado en los mocks
export type UnifiedTask = (
  (typeof data.revisiones)[0] & { taskType: 'revision' }
) | (
  (typeof data.validadors_tasks)[0] & { taskType: 'validator' }
);

type Priority = 'Crítica' | 'Alta' | 'Mitjana' | 'Baixa' | 'Normal';

type Props = {
  task: UnifiedTask;
};

const getPriorityDetails = (priority: Priority) => {
  switch (priority) {
    case 'Crítica':
      return { label: 'Crítica', className: 'bg-red-500 border-red-500 text-white', icon: Siren };
    case 'Alta':
      return { label: 'Alta', className: 'bg-orange-500 border-orange-500 text-white', icon: AlertTriangle };
    case 'Mitjana':
      return { label: 'Mitjana', className: 'bg-yellow-400 border-yellow-400 text-black', icon: Clock };
    case 'Normal':
      return { label: 'Normal', className: 'bg-blue-500 border-blue-500 text-white', icon: Wrench };
    case 'Baixa':
    default:
      return { label: 'Baixa', className: 'bg-green-500 border-green-500 text-white', icon: Wrench };
  }
};

const getStatusClass = (status: 'Pendent' | 'En Progrés' | 'Completada' | 'Bloquejada' | 'En curs') => {
  switch (status) {
    case 'Pendent':
      return 'border-gray-300';
    case 'En Progrés':
    case 'En curs':
      return 'border-blue-500 border-2 shadow-lg';
    case 'Completada':
      return 'border-green-500 opacity-70 bg-green-50';
    case 'Bloquejada':
      return 'border-red-500 border-2 bg-red-50';
  }
};

const getRevisionTypeIcon = (type: string) => {
  if (type.startsWith('Preventiu')) return Wrench;
  if (type.startsWith('Correctiu')) return Siren;
  if (type === 'Instal·lació') return HardHat;
  if (type === 'Traspàs') return Upload;
  if (type === 'Desinstal·lació') return Download;
  return Wrench;
};

/**
 * Genera un identificador inteligente de equipo/vehículo
 * Intenta obtener datos reales primero, si no existen genera uno simulado
 */
function generarIdentificadorEquipo(task: any, contract: string | undefined): string {
  // 1. INTENTAR OBTENER DATO REAL de múltiples campos posibles
  const posiblesIdentificadores = [
    task.n_validadora,
    task.validadora_id,
    task.num_validadora,
    task.vehiculoId,
    task.vehiculo,
    task.n_vehiculo,
    task.numero_vehiculo,
    task.equipmentId,
    task.equipment
  ];

  // Buscar el primer valor válido (que no sea undefined/null/vacío)
  const idReal = posiblesIdentificadores.find(id => id && String(id).trim() !== '');
  
  if (idReal) {
    // Si ya tiene formato VEH- o VAL-, retornarlo directamente
    const idStr = String(idReal);
    if (idStr.startsWith('VEH-') || idStr.startsWith('VAL-') || idStr.startsWith('MAG-')) {
      return idStr;
    }
    
    // Si es solo un número, aplicar formato según contrato
    if (contract === 'C-4/2025') {
      return `VAL-${idStr}`;
    }
    return `VEH-${idStr}`;
  }

  // 2. GENERAR NÚMERO DE 3 DÍGITOS desde el ID de tarea
  const taskId = task.id || 'XXXX';
  
  // Extraer número del ID (ej: "val-001" → "001", "rev-trim-004" → "004")
  const numeroMatch = taskId.match(/(\d+)/);
  let numeroTarea = 0;
  
  if (numeroMatch) {
    numeroTarea = parseInt(numeroMatch[0]);
  } else {
    // Generar número aleatorio basado en hash del ID
    numeroTarea = Math.abs(taskId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % 1000;
  }
  
  // SIEMPRE formatear a 3 dígitos con ceros a la izquierda
  const numeroFormateado = numeroTarea.toString().padStart(3, '0');
  
  // 3. GENERAR CÓDIGO DE COCHERA/OPERADOR (4-8 caracteres)
  
  if (contract === 'C-4/2025') {
    // ========== VALIDADORAS MAGNÉTICAS ==========
    const operador = task.operador || '';
    
    if (operador) {
      // Extraer código corto del operador
      let operadorCorto = '';
      
      if (operador.includes("L'HOSPITALET")) {
        operadorCorto = 'HOSP';
      } else if (operador.includes('CINTOT')) {
        operadorCorto = 'CINTOT';
      } else if (operador.includes('HISPANO')) {
        operadorCorto = 'HISPANO';
      } else if (operador.includes('OLESA')) {
        operadorCorto = 'OLESA';
      } else if (operador.includes('MASATS')) {
        operadorCorto = 'MASATS';
      } else if (operador.includes('JULIÀ')) {
        operadorCorto = 'JULIA';
      } else if (operador.includes('SAGALES')) {
        operadorCorto = 'SAGALES';
      } else if (operador.includes('MOVENTIA')) {
        operadorCorto = 'MOVENTIA';
      } else {
        // Extraer primeras letras mayúsculas (mínimo 4 caracteres)
        const letras = operador.replace(/[^A-Z]/g, '');
        operadorCorto = letras.substring(0, Math.max(4, 8)) || 'OPER';
        if (operadorCorto.length < 4) {
          // Si es muy corto, tomar palabras completas
          const palabras = operador.split(' ').filter((p: string) => p.length > 2);
          operadorCorto = palabras[0]?.substring(0, 8).toUpperCase() || 'OPERATOR';
        }
      }
      
      return `VAL-${operadorCorto}-${numeroFormateado}`;
    }
    
    // Fallback para C-4/2025
    return `VAL-C4-${numeroFormateado}`;
    
  } else {
    // ========== T-MOBILITAT ==========
    const cochera = task.cochera || task.ubicacion || '';
    const operador = task.operador || '';
    
    if (cochera) {
      // Extraer código corto de la cochera
      let cocheraCorta = '';
      
      if (cochera.includes('Lobatona') || cochera.includes('LLOB')) {
        cocheraCorta = 'BAIXLLOB';
      } else if (cochera.includes('Igualada')) {
        cocheraCorta = 'IGUALADA';
      } else if (cochera.includes('Sant Boi')) {
        cocheraCorta = 'SANTBOI';
      } else if (cochera.includes('Badalona')) {
        cocheraCorta = 'BADALONA';
      } else if (cochera.includes('Granollers')) {
        cocheraCorta = 'GRANOLL';
      } else if (cochera.includes('Manresa')) {
        cocheraCorta = 'MANRESA';
      } else if (cochera.includes('Prat')) {
        cocheraCorta = 'ELPRAT';
      } else {
        // Extraer nombre de calle/lugar (eliminar "C/", "Calle", números)
        const limpio = cochera.replace(/^C\/\s*/i, '')
                              .replace(/^Calle\s*/i, '')
                              .replace(/\d+/g, '')
                              .replace(/[^A-Za-z\s]/g, '')
                              .trim();
        
        // Tomar primera palabra significativa
        const palabras = limpio.split(/\s+/).filter((p: string) => p.length > 2);
        if (palabras.length > 0) {
          cocheraCorta = palabras[0].substring(0, 8).toUpperCase();
        } else {
          cocheraCorta = 'COCHERA';
        }
      }
      
      return `VEH-${cocheraCorta}-${numeroFormateado}`;
    }
    
    if (operador) {
      // Extraer código corto del operador
      let operadorCorto = '';
      
      if (operador.includes('CINTOT')) {
        operadorCorto = 'CINTOT';
      } else if (operador.includes('HISPANO')) {
        operadorCorto = 'HISPANO';
      } else if (operador.includes('MOVENTIA')) {
        operadorCorto = 'MOVENTIA';
      } else if (operador.includes('OLESA')) {
        operadorCorto = 'OLESA';
      } else {
        const letras = operador.replace(/[^A-Z]/g, '');
        operadorCorto = letras.substring(0, 8) || 'OPER';
        if (operadorCorto.length < 4) {
          const palabras = operador.split(' ').filter((p: string) => p.length > 2);
          operadorCorto = palabras[0]?.substring(0, 8).toUpperCase() || 'OPERATOR';
        }
      }
      
      return `VEH-${operadorCorto}-${numeroFormateado}`;
    }
    
    // Fallback para T-Mobilitat
    return `VEH-TMOB-${numeroFormateado}`;
  }
}

export function UnifiedTaskCard({ task }: Props) {
  // Estado local para el flujo de la tarea
  const [estado, setEstado] = useState((task as any).estado ?? 'Pendent');
  // El checklist digital completo se gestiona con MaintenanceForm
  const [checklistAbierto, setChecklistAbierto] = useState(false);
  const isRevision = task.taskType === 'revision';
  const priorityDetails = getPriorityDetails(task.prioridad as Priority);
  const { isTaskCompleted, markTaskCompleted } = useOfflineTasks();

  // Primero obtener el contrato
  const contract = (task as any).contract as string | undefined;
  
  // Generar identificador inteligente (usa datos reales o genera uno simulado)
  const title = generarIdentificadorEquipo(task, contract);
  
  const operator = (task as any).operador;
  const cochera = (task as any).cochera;
  const location = isRevision ? (task as any).ubicacion : (task as any).cochera;
  const duration = isRevision ? (task as any).duracionEstimada : (task as any).estimacion;
  const observations = (task as any).observaciones;
  const hora = (task as any).hora;
  const reprogramNote = (task as any).reprogramNote as string | undefined;
  const vehiculo = (task as any).vehiculo;

  // Eliminada la lógica de navegación a rutas externas. El checklist se abre directamente en la tarjeta.

  const computedCompleted = estado === 'Completada' || isTaskCompleted((task as any).id);
  const CurrentTypeIcon = getRevisionTypeIcon((task as any).tipo);

  const handleCompleteValidator = async () => {
    if (!isRevision && !computedCompleted) {
      // marca completada offline
      markTaskCompleted((task as any).id, 'validator');
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getStatusClass(computedCompleted ? 'Completada' : estado)}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${priorityDetails.className}`}></div>
      <CardHeader className="pl-6 pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-3">
            <Bus className="h-5 w-5 text-muted-foreground" />
            {title}
          </CardTitle>
          <Badge variant="outline" className={`${priorityDetails.className} ml-auto`}>
            <priorityDetails.icon className="mr-1.5 h-3.5 w-3.5" />
            {priorityDetails.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Users className="h-4 w-4" />
          {operator}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-6 pt-0 pb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {/* Tipo de mantenimiento */}
        <div className="col-span-2 flex items-center gap-2 font-medium">
          <CurrentTypeIcon className="h-4 w-4 text-primary" />
          <span>{(task as any).tipo}</span>
        </div>
        
        {/* Número de vehículo - SIEMPRE VISIBLE */}
        {vehiculo && (
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground" />
            <span>Vehículo: {vehiculo}</span>
          </div>
        )}
        
        {/* Cochera */}
        {cochera && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{cochera}</span>
          </div>
        )}
        
        {/* Hora y duración */}
        <div className="col-span-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{hora} ({duration})</span>
        </div>
        
        {/* Ubicación de trabajo */}
        {location && (
          <div className="col-span-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>📍 {location}</span>
          </div>
        )}

        {/* Badge de Contrato */}
        {contract && (
          <div className="col-span-2 mt-1">
            <Badge variant="outline" className={contract === 'T-Mobilitat' ? 'text-primary border-primary' : 'text-orange-600 border-orange-600'}>
              {contract}
            </Badge>
          </div>
        )}

        {/* Observaciones/Descripción de incidencia */}
        {observations && (
          <div className="col-span-2 flex items-start gap-2 mt-2">
            <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{observations}</p>
          </div>
        )}
        
        {/* Nota de reprogramación */}
        {reprogramNote && (
          <div className="col-span-2 flex items-start gap-2 mt-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{reprogramNote}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pl-6 pr-4 pb-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {cochera ? `Cochera: ${cochera}` : location}
        </p>
        {/* Flujo uniforme para todas las tarjetas */}
        {computedCompleted ? (
          <Button disabled className="bg-green-600 hover:bg-green-600">
            Completada ✓
          </Button>
        ) : checklistAbierto ? null : (
          <Button
            onClick={() => {
              setEstado('En curs');
              setChecklistAbierto(true);
            }}
          >
            Iniciar Tarea
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
      {/* Checklist digital completo */}
      <Dialog open={checklistAbierto && !computedCompleted} onOpenChange={setChecklistAbierto}>
        <DialogContent className="max-w-full w-full h-screen p-0 overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {contract === 'C-4/2025' 
                ? 'Manteniment Preventiu - Validadors Magnètiques' 
                : 'Checklist digital'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-2">
            {contract === 'C-4/2025' ? (
              <FormularioValidadorasMagneticas 
                task={task} 
                operatorId={operator} 
                onClose={() => setChecklistAbierto(false)} 
              />
            ) : (
              <MaintenanceForm 
                revision={task} 
                operatorId={operator} 
                onClose={() => setChecklistAbierto(false)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
