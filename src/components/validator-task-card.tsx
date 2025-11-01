'use client'

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, Siren } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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


export function ValidatorTaskCard({ task }: { task: any }) {
  const priorityDetails = getPriorityDetails(task.prioridad);

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getStatusDetails(task.estado)}`}>
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
      </CardContent>
       <CardFooter className="pl-6 pr-4 pb-4 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Distància: {task.distancia}</p>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm" asChild>
                    <Link href="#">
                        Historial
                    </Link>
                </Button>
                <Button size="sm" asChild>
                    <Link href="#">
                        {task.estado === 'Completada' ? 'Veure Resum' : 'Iniciar Tasca'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
      </CardFooter>
    </Card>
  );
};
