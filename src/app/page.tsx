'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, HardHat, Download, Upload, Map, List, HelpCircle, User, History, Package, Siren, Calendar } from 'lucide-react';
import { data } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ValidatorTaskCard } from '@/components/validator-task-card';


type Priority = 'Crítica' | 'Alta' | 'Mitjana' | 'Baixa' | 'Normal';
type Task = (typeof data.revisiones[0] & { taskType: 'revision' }) | (typeof data.validadors_tasks[0] & { taskType: 'validator' });


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
      return { label: 'Baixa', className: 'bg-green-500 border-green-500 text-white', icon: Wrench };
    default:
      return { label: 'Baixa', className: 'bg-gray-500 border-gray-500 text-white', icon: Wrench };
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

const getStatusDetails = (status: 'Pendent' | 'En Progrés' | 'Completada' | 'Bloquejada' | 'En curs') => {
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


export default function DashboardPage() {
  const technicianName = "A.P.U.";
  const today = new Date(2026, 0, 2); // Set a fixed date for the demo
  const [contractFilter, setContractFilter] = useState('all');

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  
  const priorityOrder: Record<Priority, number> = { 'Crítica': 1, 'Alta': 2, 'Mitjana': 3, 'Normal': 4, 'Baixa': 5 };

  const allTasks: Task[] = [
    ...data.revisiones.map(t => ({...t, taskType: 'revision' as const})),
    ...data.validadors_tasks.map(t => ({...t, taskType: 'validator' as const}))
  ];
  
  const todaysTasks = allTasks.filter(task => {
     const taskDate = new Date(task.fecha);
     const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
     const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
     return taskDateOnly.getTime() === todayDateOnly.getTime();
  }).sort((a, b) => {
    const priorityA = priorityOrder[a.prioridad as Priority];
    const priorityB = priorityOrder[b.prioridad as Priority];
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.hora.localeCompare(b.hora);
  });

  const filteredTasks = todaysTasks.filter(task => {
    if (contractFilter === 'all') return true;
    if (contractFilter === 't-mobilitat') return task.taskType === 'revision';
    if (contractFilter === 'c-4/2025') return task.taskType === 'validator';
    return true;
  });
  
  const mantenimientos = filteredTasks.filter(task => task.taskType === 'revision' && (task.tipo.includes('Preventiu') || task.tipo.includes('Correctiu')));
  const otrasOperaciones = filteredTasks.filter(task => task.taskType === 'revision' && (!task.tipo.includes('Preventiu') && !task.tipo.includes('Correctiu')));
  const validatorTasks = filteredTasks.filter(task => task.taskType === 'validator');

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.estado === 'Completada').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalEstimatedHours = filteredTasks.reduce((acc, task) => {
      if (task.taskType === 'revision') {
        const duration = parseInt(task.duracionEstimada);
        if (task.duracionEstimada.includes('h')) return acc + duration * 60;
        if (task.duracionEstimada.includes('m')) return acc + duration;
      }
      if (task.taskType === 'validator') {
        const [hours, minutes] = task.estimacion.split(':').map(Number);
        return acc + (hours * 60) + minutes;
      }
      return acc;
  }, 0) / 60;

  const urgentTasks = filteredTasks.filter(t => t.prioridad === 'Crítica');

  const upcomingEvents = data.eventosProximos
    .map(event => ({ ...event, daysRemaining: differenceInDays(new Date(event.fecha), today) }))
    .filter(event => event.daysRemaining >= 0);

  const RevisionTaskCard = ({ revision }: { revision: any }) => {
    const priorityDetails = getPriorityDetails(revision.prioridad);
    const TypeIcon = getRevisionTypeIcon(revision.tipo);
    
    let href = `/revision/${revision.id}`; // Default to revision
    if (revision.tipo === 'Instal·lació') {
      href = `/instalacion/${revision.id}`;
    } else if (revision.tipo === 'Traspàs' || revision.tipo === 'Desinstal·lació') {
      href = `/operacion/${revision.id}`;
    } else if (revision.tipo.includes('Correctiu')) {
      href = `/revision/${revision.id}`;
    }

    return (
      <Card className={`hover:shadow-lg transition-shadow ${getStatusDetails(revision.estado)}`}>
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
            <p className="text-xs text-muted-foreground">Distància: 1.2km</p>
            <Button asChild>
                <Link href={href}>
                    {revision.estado === 'Completada' ? 'Veure Resum' : 'Iniciar Tasca'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="text-sm text-muted-foreground">Benvingut, {technicianName}</p>
                    <h1 className="text-2xl font-bold text-primary">Tasques del dia</h1>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{format(today, "EEEE, d 'de' MMMM", { locale: ca })}</p>
                    <p className="text-sm text-muted-foreground">{totalTasks} tasques, ~{totalEstimatedHours.toFixed(1)}h estimades</p>
                </div>
            </div>
            
             {/* Progress Bar */}
            <div className='mt-4'>
                <div className='flex justify-between text-sm font-medium mb-1'>
                    <span className='text-gray-700'>Progrés del dia</span>
                    <span className='text-primary'>{completedTasks} / {totalTasks} completades</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
              <ToggleGroup type="single" value={contractFilter} onValueChange={(value) => {if (value) setContractFilter(value)}} className="w-full sm:w-auto">
                  <ToggleGroupItem value="all" aria-label="Tots els contractes" className="w-full">Tots</ToggleGroupItem>
                  <ToggleGroupItem value="t-mobilitat" aria-label="Contracte T-Mobilitat" className="w-full">T-Mobilitat</ToggleGroupItem>
                  <ToggleGroupItem value="c-4/2025" aria-label="Contracte C-4/2025" className="w-full">C-4/2025</ToggleGroupItem>
              </ToggleGroup>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><List className="mr-2 h-4 w-4"/>Llista</Button>
                <Button variant="outline" size="sm"><Map className="mr-2 h-4 w-4"/>Mapa</Button>
                <Button variant="outline" size="sm"><HelpCircle className="mr-2 h-4 w-4"/>Ajuda</Button>
              </div>
            </div>
        </div>
      </header>
      
      {/* Task List */}
      <div className="container mx-auto p-4 flex-grow">
        {urgentTasks.length > 0 && (
            <Card className="mb-4 bg-red-50 border-red-500">
                <CardHeader className='flex-row items-center gap-4 space-y-0'>
                    <Siren className="h-6 w-6 text-red-600"/>
                    <CardTitle className="text-red-800">Urgències</CardTitle>
                </CardHeader>
                <CardContent>
                    {urgentTasks.map(task => (
                        <p key={task.id} className='text-sm text-red-700'>
                          - {task.tipo} en vehicle {task.taskType === 'revision' ? task.vehiculoId : task.vehiculo} ({task.taskType === 'revision' ? task.ubicacion : task.cochera}).
                        </p>
                    ))}
                </CardContent>
            </Card>
        )}

        {upcomingEvents.length > 0 && (
          <Card className="mb-4 bg-blue-50 border-blue-400">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-blue-800">Pròxim Esdeveniment Programat</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingEvents.map(event => (
                <div key={event.id} className="text-sm text-blue-700">
                  <div className="flex justify-between items-center font-bold">
                    <p>{event.titulo} - {event.operador}</p>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      Falten {event.daysRemaining} dies
                    </Badge>
                  </div>
                  <p className="mt-1">
                    {format(new Date(event.fecha), "d 'de' MMMM", { locale: ca })}: {event.descripcion}
                  </p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-blue-800">
                    Veure més detalls →
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="mantenimientos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mantenimientos">Manteniments</TabsTrigger>
                <TabsTrigger value="operaciones">Altres Operacions</TabsTrigger>
                <TabsTrigger value="validadors">Validadors (C-4/2025)</TabsTrigger>
            </TabsList>
            <TabsContent value="mantenimientos">
                <div className="space-y-4 mt-4">
                    {mantenimientos.length > 0 ? (
                        mantenimientos.map((revision) => <RevisionTaskCard key={revision.id} revision={revision} />)
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No hi ha manteniments per avui.</p>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="operaciones">
                 <div className="space-y-4 mt-4">
                    {otrasOperaciones.length > 0 ? (
                        otrasOperaciones.map((revision) => <RevisionTaskCard key={revision.id} revision={revision} />)
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No hi ha altres operacions per avui.</p>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="validadors">
                <div className="space-y-4 mt-4">
                    {validatorTasks.length > 0 ? (
                        validatorTasks.map((task) => <ValidatorTaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No hi ha tasques de validadors per avui.</p>
                    )}
                </div>
            </TabsContent>
        </Tabs>
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
                <span className="text-xs mt-1">Inventari</span>
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

// Helper functions and components outside the main component
const getPriorityBadge = (priority: Priority) => {
  const details = getPriorityDetails(priority);
  return (
    <Badge variant="outline" className={`${details.className} ml-auto`}>
      <details.icon className="mr-1.5 h-3.5 w-3.5" />
      {details.label}
    </Badge>
  );
};

const RevisionTaskCard = ({ revision }: { revision: any }) => {
  const priorityDetails = getPriorityDetails(revision.prioridad);
  const TypeIcon = getRevisionTypeIcon(revision.tipo);
  
  let href = `/revision/${revision.id}`; // Default to revision
  if (revision.tipo === 'Instal·lació') {
    href = `/instalacion/${revision.id}`;
  } else if (revision.tipo === 'Traspàs' || revision.tipo === 'Desinstal·lació') {
    href = `/operacion/${revision.id}`;
  } else if (revision.tipo.includes('Correctiu')) {
    href = `/revision/${revision.id}`;
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getStatusDetails(revision.estado)}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${priorityDetails.className}`}></div>
      <CardHeader className="pl-6 pb-3">
          <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-3">
                  <Bus className="h-5 w-5 text-muted-foreground" />
                  {revision.vehiculoId}
              </CardTitle>
              {getPriorityBadge(revision.prioridad)}
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
          <p className="text-xs text-muted-foreground">Distància: 1.2km</p>
          <Button asChild>
              <Link href={href}>
                  {revision.estado === 'Completada' ? 'Veure Resum' : 'Iniciar Tasca'}
                  <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
};
