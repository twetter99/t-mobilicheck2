'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, HardHat, Download, Upload, Map, List, HelpCircle, User, History, Package, Siren } from 'lucide-react';
import { data } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getPriorityDetails = (priority: 'Crítica' | 'Alta' | 'Media' | 'Baja') => {
  switch (priority) {
    case 'Crítica':
      return { label: 'Crítica', className: 'bg-red-500 border-red-500 text-white', icon: Siren };
    case 'Alta':
      return { label: 'Alta', className: 'bg-orange-500 border-orange-500 text-white', icon: AlertTriangle };
    case 'Media':
      return { label: 'Media', className: 'bg-yellow-400 border-yellow-400 text-black', icon: Clock };
    case 'Baja':
      return { label: 'Baja', className: 'bg-green-500 border-green-500 text-white', icon: Wrench };
    default:
      return { label: 'Baja', className: 'bg-gray-500 border-gray-500 text-white', icon: Wrench };
  }
};

const getRevisionTypeIcon = (type: string) => {
  if (type.startsWith('Preventivo')) return Wrench;
  if (type.startsWith('Correctivo')) return Siren;
  if (type === 'Instalación') return HardHat;
  if (type === 'Traspaso') return Upload;
  if (type === 'Desinstalación') return Download;
  return Wrench;
};

const getStatusDetails = (status: 'Pendiente' | 'En Progreso' | 'Completada' | 'Bloqueada') => {
  switch (status) {
    case 'Pendiente':
      return 'border-gray-300';
    case 'En Progreso':
      return 'border-blue-500 border-2 shadow-lg';
    case 'Completada':
      return 'border-green-500 opacity-70 bg-green-50';
    case 'Bloqueada':
      return 'border-red-500 border-2 bg-red-50';
  }
};


export default function DashboardPage() {
  const technicianName = "A.P.U.";
  const today = new Date();
  
  // Filter tasks for today (using the demo date)
  const todayStart = new Date(2026, 0, 2);
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(2026, 0, 3);
  todayEnd.setHours(23,59,59,999);

  const todaysTasks = data.revisiones.filter(rev => {
     const revDate = new Date(rev.fecha);
     return revDate >= todayStart && revDate <= todayEnd;
  }).sort((a, b) => {
    const priorityOrder = { 'Crítica': 1, 'Alta': 2, 'Media': 3, 'Baja': 4 };
    return priorityOrder[a.prioridad] - priorityOrder[b.prioridad];
  });

  const totalTasks = todaysTasks.length;
  const completedTasks = todaysTasks.filter(t => t.estado === 'Completada').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalEstimatedHours = todaysTasks.reduce((acc, task) => {
      const duration = parseInt(task.duracionEstimada);
      if (task.duracionEstimada.includes('h')) return acc + duration * 60;
      if (task.duracionEstimada.includes('m')) return acc + duration;
      return acc;
  }, 0) / 60;

  const urgentTasks = todaysTasks.filter(t => t.prioridad === 'Crítica');

  return (
    <>
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="text-sm text-muted-foreground">Bienvenido, {technicianName}</p>
                    <h1 className="text-2xl font-bold text-primary">Tareas para hoy</h1>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{format(new Date(2026, 0, 2), "EEEE, d 'de' MMMM", { locale: es })}</p>
                    <p className="text-sm text-muted-foreground">{totalTasks} tareas, ~{totalEstimatedHours.toFixed(1)}h estimadas</p>
                </div>
            </div>
            
             {/* Progress Bar */}
            <div className='mt-4'>
                <div className='flex justify-between text-sm font-medium mb-1'>
                    <span className='text-gray-700'>Progreso del día</span>
                    <span className='text-primary'>{completedTasks} / {totalTasks} completadas</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
            </div>

             {/* Action Buttons */}
            <div className="mt-4 flex gap-2 justify-center">
                <Button variant="outline" size="sm"><List className="mr-2 h-4 w-4"/>Vista de Lista</Button>
                <Button variant="outline" size="sm"><Map className="mr-2 h-4 w-4"/>Vista de Mapa</Button>
                <Button variant="outline" size="sm"><HelpCircle className="mr-2 h-4 w-4"/>Ayuda</Button>
            </div>
        </div>
      </header>
      
      {/* Task List */}
      <div className="container mx-auto p-4 flex-grow">
        {urgentTasks.length > 0 && (
            <Card className="mb-4 bg-red-50 border-red-500">
                <CardHeader className='flex-row items-center gap-4 space-y-0'>
                    <Siren className="h-6 w-6 text-red-600"/>
                    <CardTitle className="text-red-800">Urgencias</CardTitle>
                </CardHeader>
                <CardContent>
                    {urgentTasks.map(task => (
                        <p key={task.id} className='text-sm text-red-700'>
                            - {task.tipo} en vehículo {task.vehiculoId} ({task.ubicacion}).
                        </p>
                    ))}
                </CardContent>
            </Card>
        )}

        <div className="space-y-4">
          {todaysTasks.map((revision) => {
            const priorityDetails = getPriorityDetails(revision.prioridad);
            const TypeIcon = getRevisionTypeIcon(revision.tipo);
            const href = `/revision/${revision.id}`;

            return (
              <Card key={revision.id} className={`hover:shadow-lg transition-shadow ${getStatusDetails(revision.estado)}`}>
                <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${priorityDetails.className}`}></div>
                <CardHeader className="pl-6 pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-3">
                            <Bus className="h-5 w-5 text-muted-foreground" />
                            {revision.vehiculoId}
                        </CardTitle>
                        <Badge variant="outline" className={`${priorityDetails.className} ml-auto`}>
                          <priorityDetails.icon className="mr-1.5 h-3.5 w-3.5" />
                          {priorityDetails.label}
                        </Badge>
                    </div>
                     <CardDescription className="flex items-center gap-2 pt-1">
                        <Users className="h-4 w-4" />
                        {revision.operador}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-6 pt-0 pb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="col-span-2 flex items-center gap-2 font-medium">
                    <TypeIcon className="h-4 w-4 text-primary" />
                    <span>{revision.tipo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{revision.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{revision.hora} ({revision.duracionEstimada})</span>
                  </div>

                   {revision.observaciones && (
                      <div className="col-span-2 flex items-start gap-2 mt-2">
                          <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                           <p className="text-xs text-muted-foreground">{revision.observaciones}</p>
                      </div>
                  )}
                </CardContent>
                 <CardFooter className="pl-6 pr-4 pb-4 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Distancia: 1.2km</p>
                    <Button asChild>
                        <Link href={href}>
                            {revision.estado === 'Completada' ? 'Ver Resumen' : 'Iniciar Tarea'}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

       {/* Bottom Navigation */}
      <footer className="bg-white shadow-t sticky bottom-0 z-10 border-t">
        <nav className="container mx-auto flex justify-around py-2">
            <Button variant="ghost" className="flex flex-col h-auto p-2">
                <History className="h-6 w-6"/>
                <span className="text-xs mt-1">Historial</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto p-2">
                <Package className="h-6 w-6"/>
                <span className="text-xs mt-1">Inventario</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto p-2 text-accent">
                <Siren className="h-6 w-6"/>
                <span className="text-xs mt-1">Reportar</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto p-2">
                <User className="h-6 w-6"/>
                <span className="text-xs mt-1">Perfil</span>
            </Button>
        </nav>
      </footer>
    </main>
    </>
  );
}
