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

export function UnifiedTaskCard({ task }: Props) {
  // Estado local para el flujo de la tarea
  const [estado, setEstado] = useState((task as any).estado ?? 'Pendent');
  // El checklist digital completo se gestiona con MaintenanceForm
  const [checklistAbierto, setChecklistAbierto] = useState(false);
  const isRevision = task.taskType === 'revision';
  const priorityDetails = getPriorityDetails(task.prioridad as Priority);
  const { isTaskCompleted, markTaskCompleted } = useOfflineTasks();

  const title = isRevision ? (task as any).vehiculoId : (task as any).vehiculo;
  const operator = (task as any).operador;
  const location = isRevision ? (task as any).ubicacion : (task as any).cochera;
  const duration = isRevision ? (task as any).duracionEstimada : (task as any).estimacion;
  const observations = isRevision ? (task as any).observaciones : undefined;
  const contract = (task as any).contract as string | undefined;
  const hora = (task as any).hora;
  const reprogramNote = (task as any).reprogramNote as string | undefined;

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
        <div className="col-span-2 flex items-center gap-2 font-medium">
          <CurrentTypeIcon className="h-4 w-4 text-primary" />
          <span>{(task as any).tipo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{hora} ({duration})</span>
        </div>

        {/* Distintivo de contrato */}
        {contract && (
          <div className="col-span-2 mt-2">
            <Badge variant="outline" className={contract === 'T-Mobilitat' ? 'text-primary border-primary' : 'text-orange-600 border-orange-600'}>
              {contract}
            </Badge>
          </div>
        )}

        {/* Extras por tipo */}
        {!isRevision && (task as any).n_validadora && (
          <div className="flex items-center gap-2">
            <Siren className="h-4 w-4 text-muted-foreground" />
            <span>Validadora: {(task as any).n_validadora}</span>
          </div>
        )}
        {!isRevision && (task as any).distancia && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Distància: {(task as any).distancia}</span>
          </div>
        )}

        {isRevision && observations && (
          <div className="col-span-2 flex items-start gap-2 mt-2">
            <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{observations}</p>
          </div>
        )}
        {reprogramNote && (
          <div className="col-span-2 flex items-start gap-2 mt-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{reprogramNote}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pl-6 pr-4 pb-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{isRevision ? location : `Distància: ${(task as any).distancia}`}</p>
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
            <DialogTitle>Checklist digital</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <MaintenanceForm revision={task} operatorId={operator} onClose={() => setChecklistAbierto(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
