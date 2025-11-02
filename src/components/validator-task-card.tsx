'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, Siren, FileCheck2, Calendar, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { add, differenceInHours, formatDistanceToNow, parse } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useOfflineTasks } from '@/hooks/use-offline-tasks';
import { useToast } from '@/hooks/use-toast';

type Priority = 'Crítica' | 'Alta' | 'Normal';
type Status = 'Pendent' | 'En curs' | 'Completada';
type Turno = 'Diurn' | 'Nocturn' | 'Dissabte';

const getPriorityDetails = (priority: Priority) => {
  switch (priority) {
    case 'Crítica':
      return { label: 'Crítica', className: 'bg-red-500 border-red-500 text-white', icon: Siren };
    case 'Alta':
      return { label: 'Alta', className: 'bg-orange-500 border-orange-500 text-white', icon: AlertTriangle };
    case 'Normal':
    default:
      return { label: 'Normal', className: 'bg-blue-500 border-blue-500 text-white', icon: Wrench };
  }
};

const getStatusDetails = (status: Status) => {
  switch (status) {
    case 'Pendent':
      return 'border-gray-300';
    case 'En curs':
      return 'border-blue-500 border-2 shadow-lg';
    case 'Completada':
      return 'border-green-500 opacity-70 bg-green-50';
    default:
      return 'border-gray-300';
  }
};

const getTurnoBadge = (turno: Turno) => {
    switch (turno) {
        case 'Diurn':
            return 'bg-blue-100 text-blue-800';
        case 'Nocturn':
            return 'bg-gray-700 text-white';
        case 'Dissabte':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const PreventiveAlert = ({ lastRevision }: { lastRevision?: string }) => {
    if (!lastRevision) return null;

    const lastRevisionDate = new Date(lastRevision);
    const nextDueDate = add(lastRevisionDate, { months: 4 });
    const isEarly = new Date() < nextDueDate;

    if (isEarly) {
        return (
            <div className="col-span-2 flex items-start gap-2 mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>Alerta: La darrera revisió va ser fa menys de 4 mesos ({formatDistanceToNow(lastRevisionDate, { locale: ca, addSuffix: true })}). Assegureu-vos que aquesta tasca és necessària.</p>
            </div>
        );
    }
    return null;
}

const CorrectiveAlert = ({ sla, fecha, hora }: { sla: string, fecha: string, hora: string }) => {
    const [slaHours] = sla.split('h').map(Number);
    const taskDateTime = parse(`${fecha.substring(0,10)} ${hora}`, 'yyyy-MM-dd HH:mm', new Date());
    const slaDueDate = add(taskDateTime, { hours: slaHours });
    const hoursRemaining = differenceInHours(slaDueDate, new Date());
    
    const isOverdue = hoursRemaining < 0;

    return (
        <div className={`col-span-2 flex items-start gap-2 mt-2 text-xs p-2 rounded-md border ${isOverdue ? 'text-red-700 bg-red-50 border-red-200' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
            <Clock className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`} />
            <p>SLA: {sla}. {isOverdue ? `Superat fa ${formatDistanceToNow(slaDueDate, { locale: ca })}.` : `Vença en aprox. ${formatDistanceToNow(slaDueDate, { locale: ca })}.`}</p>
        </div>
    );
}


export function ValidatorTaskCard({ task }: { task: any }) {
  const [isCompleting, setIsCompleting] = useState(false);
  const priorityDetails = getPriorityDetails(task.prioridad);
  const { markTaskCompleted, isTaskCompleted } = useOfflineTasks();
  const { toast } = useToast();

  const handleCompleteTask = async () => {
    if (task.estado === 'Completada' || isTaskCompleted(task.id)) {
      return;
    }

    setIsCompleting(true);
    
    try {
      // Simular el tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Marcar como completada offline
      markTaskCompleted(task.id, 'validator');
      
      toast({
        title: "Tasca completada",
        description: `La tasca del validador ${task.n_validadora} ha estat marcada com a completada.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No s'ha pogut completar la tasca.",
        variant: 'destructive',
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const taskIsCompleted = task.estado === 'Completada' || isTaskCompleted(task.id);

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getStatusDetails(taskIsCompleted ? 'Completada' : task.estado)}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${priorityDetails.className}`}></div>
      <CardHeader className="pl-6 pb-3">
          <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  {task.operador}
              </CardTitle>
               <Badge variant="outline" className={`${priorityDetails.className} ml-auto`}>
                  <priorityDetails.icon className="mr-1.5 h-3.5 w-3.5" />
                  {priorityDetails.label}
                </Badge>
          </div>
           <CardDescription className="flex items-center gap-2 pt-1">
              <Building className="h-4 w-4" />
              {task.cochera}
          </CardDescription>
      </CardHeader>
      <CardContent className="pl-6 pt-0 pb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="col-span-2 flex items-center gap-2 font-medium">
            <Wrench className="h-4 w-4 text-primary" />
            <span>{task.tipo}</span>
        </div>
        <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground" />
            <span>Vehicle: {task.vehiculo}</span>
        </div>
        <div className="flex items-center gap-2">
            <Siren className="h-4 w-4 text-muted-foreground" />
            <span>Validadora: {task.n_validadora}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{task.hora} ({task.estimacion})</span>
        </div>
        <div className="flex items-center gap-2">
            <Badge className={getTurnoBadge(task.turno)}>{task.turno}</Badge>
        </div>
         {task.tipo === 'Preventiu' && task.last_revision && <PreventiveAlert lastRevision={task.last_revision} />}
         {task.tipo === 'Correctiu' && task.sla && <CorrectiveAlert sla={task.sla} fecha={task.fecha} hora={task.hora} />}
      </CardContent>
       <CardFooter className="pl-6 pr-4 pb-4 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Distància: {task.distancia}</p>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href="#">
                        <Calendar className="mr-2 h-4 w-4" />
                        Historial
                    </Link>
                </Button>
                 <Button variant="outline" size="sm" asChild>
                    <Link href="#">
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Checklist
                    </Link>
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleCompleteTask}
                  disabled={taskIsCompleted || isCompleting}
                  className={taskIsCompleted ? "bg-green-600 hover:bg-green-600" : ""}
                >
                    {isCompleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completant...
                      </>
                    ) : taskIsCompleted ? (
                      'Completada ✓'
                    ) : (
                      <>
                        Completar Tasca
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                </Button>
            </div>
      </CardFooter>
    </Card>
  );
};
