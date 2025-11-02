'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, HardHat, Download, Upload, Map, List, HelpCircle, User, History, Package, Siren, Calendar, Wifi, WifiOff } from 'lucide-react';
import { data } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOfflineTasks } from '@/hooks/use-offline-tasks';
import { UnifiedTaskCard } from '@/components/unified-task-card';
import { cn } from '@/lib/utils';


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
  const [view, setView] = useState('list');
  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [primaryDepot, setPrimaryDepot] = useState<string | undefined>(undefined);

  // Hook para manejar tareas offline
  const { 
    mergeTasksWithOfflineStatus, 
    isLoaded: offlineDataLoaded, 
    getOfflineStats,
    clearCompletedTasks 
  } = useOfflineTasks();

  useEffect(() => {
    setIsClient(true);
    const storedContractFilter = localStorage.getItem('contractFilter');
    const storedView = localStorage.getItem('view');
    const storedDepot = localStorage.getItem('primaryDepot');
    if (storedContractFilter) {
      setContractFilter(storedContractFilter);
    }
    if (storedView) {
      setView(storedView);
    }
    if (storedDepot) {
      setPrimaryDepot(storedDepot);
    }

    // Detectar estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleContractFilterChange = (value: string) => {
    if (value) {
      setContractFilter(value);
      if (isClient) {
        localStorage.setItem('contractFilter', value);
      }
    }
  };

  const handleViewChange = (value: string) => {
    if (value) {
      setView(value);
      if (isClient) {
        localStorage.setItem('view', value);
      }
    }
  };
  
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  
  const priorityOrder: Record<Priority, number> = { 'Crítica': 1, 'Alta': 2, 'Mitjana': 3, 'Normal': 4, 'Baixa': 5 };

  const allTasks: Task[] = [
    ...data.revisiones.map(t => ({...t, taskType: 'revision' as const})),
    ...data.validadors_tasks.map(t => ({...t, taskType: 'validator' as const}))
  ];

  // Fusionar tareas base con estado offline
  const allTasksWithOfflineStatus = offlineDataLoaded ? mergeTasksWithOfflineStatus(allTasks) : allTasks;
  
  const todaysTasks = allTasksWithOfflineStatus.filter(task => {
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

  const getFilteredTasks = (filter: string) => {
    return todaysTasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 't-mobilitat') return task.taskType === 'revision';
      if (filter === 'c-4/2025') return task.taskType === 'validator';
      return true;
    });
  }

  // Filtro por operadores asignados al tècnic 1
  const allowedOperatorsRaw = [
    "AUTOCARS DEL PENEDÈS, SA",
    "AUTOCARES JULIÀ, SL",
    "HISPANO LLACUNENSE, SL",
    "MASATS TRANSPORTS GENERALS, SA",
    "TRANSPORTES GENERALES DE OLESA, SA",
    "CINTOI BUS, SL",
    "LA HISPANO IGUALADINA, SL",
    "MOVENTIA L'HOSPITALET",
    "UTE VALLDOREIX",
  ];

  const normalizeOperator = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // sin acentos
      .replace(/[^a-z0-9]/g, '') // sin espacios/ signos
      .replace(/sa|sl|slsa|sasa/g, '');

  const synonyms: Record<string, string> = {
    // mapear variantes comunes a la forma usada en los datos
    transportesgeneralesdeolesa: 'transportsgeneralsdolesa',
    cintoibus: 'cintotbus',
  };

  const allowedSet = new Set(
    allowedOperatorsRaw.map(o => {
      const n = normalizeOperator(o);
      return synonyms[n] ?? n;
    })
  );

  const isOperatorAllowed = (op: string) => {
    const n = normalizeOperator(op);
    const key = synonyms[n] ?? n;
    return allowedSet.has(key);
  };

  const filteredTasksContractOnly = getFilteredTasks(contractFilter);
  const filteredTasks = filteredTasksContractOnly.filter(t => isOperatorAllowed((t as any).operador));

  // Cohceras/ubicaciones disponibles para el técnico
  const getDepot = (t: any) => (t.taskType === 'validator' ? t.cochera : t.ubicacion);
  const availableDepots = Array.from(new Set(filteredTasks.map(t => getDepot(t)).filter(Boolean)));
  // Elegir cochera por defecto (la que tiene más tareas)
  const depotCounts: Record<string, number> = {};
  for (const t of filteredTasks) {
    const dep = getDepot(t);
    if (!dep) continue;
    depotCounts[dep] = (depotCounts[dep] ?? 0) + 1;
  }
  const defaultDepot = Object.keys(depotCounts).sort((a, b) => (depotCounts[b] ?? 0) - (depotCounts[a] ?? 0))[0];
  const activeDepot = primaryDepot ?? defaultDepot;

  const mantenimientos = filteredTasks.filter(task => task.taskType === 'revision' && (task.tipo.includes('Preventiu') || task.tipo.includes('Correctiu')));
  const otrasOperaciones = filteredTasks.filter(task => task.taskType === 'revision' && (!task.tipo.includes('Preventiu') && !task.tipo.includes('Correctiu')));
  const validatorTasks = filteredTasks.filter(task => task.taskType === 'validator');

  // Optimización de desplazamientos: mantener una sola cochera y como mucho 1 crítica externa
  const depotTasks = filteredTasks.filter(t => getDepot(t) === activeDepot);
  const parseKm = (d?: string) => {
    if (!d) return Number.POSITIVE_INFINITY;
    const m = d.match(/([0-9]+(?:\.[0-9]+)?)\s*km/i);
    return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY;
  };
  const externalCritical = filteredTasks
    .filter(t => getDepot(t) !== activeDepot && t.prioridad === 'Crítica')
    .sort((a: any, b: any) => parseKm((a as any).distancia) - parseKm((b as any).distancia))[0];

  const tasksOptimized = externalCritical ? [...depotTasks, externalCritical] : [...depotTasks];

  const totalTasks = tasksOptimized.length;
  const completedTasks = tasksOptimized.filter(t => t.estado === 'Completada').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalEstimatedHours = tasksOptimized.reduce((acc, task) => {
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

  const urgentTasks = tasksOptimized.filter(t => t.prioridad === 'Crítica');
  const offlineStats = getOfflineStats();

  const upcomingEvents = data.eventosProximos
    .map(event => ({ ...event, daysRemaining: differenceInDays(new Date(event.fecha), today) }))
    .filter(event => event.daysRemaining >= 0);

  // Programación para turno nocturno (21:00–05:00) consecutivo sin solapes
  const parseDurationMinutes = (text: string) => {
    // Soporta "1h 30m", "45m", "2h"
    const hMatch = text.match(/(\d+)\s*h/);
    const mMatch = text.match(/(\d+)\s*m/);
    const h = hMatch ? parseInt(hMatch[1], 10) : 0;
    const m = mMatch ? parseInt(mMatch[1], 10) : 0;
    return h * 60 + m;
  };

  const getTaskMinutes = (task: any) => {
    if (task.taskType === 'revision') return parseDurationMinutes(task.duracionEstimada ?? '0m');
    if (task.taskType === 'validator') {
      const [hh, mm] = (task.estimacion ?? '00:00').split(':').map((n: string) => parseInt(n, 10) || 0);
      return hh * 60 + mm;
    }
    return 0;
  };

  const severityRank: Record<string, number> = { 'Crítica': 1, 'Alta': 2, 'Mitjana': 3, 'Normal': 4, 'Baixa': 5 };
  const typeRank = (tipo: string) => {
    if (!tipo) return 3;
    if (tipo.toLowerCase().includes('extra')) return 1;
    if (tipo.toLowerCase().includes('correctiu') || tipo.toLowerCase().includes('correctiva')) return 2;
    return 3;
  };

  // Generar tarjetas según la estructura solicitada
  const scheduledTasks: any[] = [];
  let cursor = new Date(today);
  cursor.setHours(21, 0, 0, 0);
  let usedMinutes = 0;
  const maxMinutes = 8 * 60;

  // 1. Correctiva Crítica VEH-BAIXLLOB-303, operador CINTOI BUS, SL, contrato T-Mobilitat
  scheduledTasks.push({
    operador: 'CINTOI BUS, SL',
    vehiculoId: 'VEH-BAIXLLOB-303',
    tipo: 'Correctiva urgente',
    prioridad: 'Crítica',
    contract: 'T-Mobilitat',
    hora: format(cursor, 'HH:mm'),
    duracionEstimada: '1h 30m',
    observaciones: 'La validadora no responde. Posible problema de alimentación.',
    ubicacion: 'C/ Lobatona 13',
    taskType: 'revision',
    estado: 'Pendent',
  });
  usedMinutes += 90;
  cursor = new Date(cursor.getTime() + 90 * 60 * 1000);

  // 2 y 3. Preventivas Alta MOVENTIA L’HOSPITALET (C-4/2025)
  for (let i = 0; i < 2; i++) {
    scheduledTasks.push({
      operador: "MOVENTIA L'HOSPITALET",
      tipo: 'Preventivo',
      prioridad: 'Alta',
      contract: 'C-4/2025',
      hora: format(cursor, 'HH:mm'),
      duracionEstimada: '1h',
      observaciones: 'Preventivo programado',
      ubicacion: 'Cochera de L’Hospitalet',
      taskType: 'validator',
      estado: 'Pendent',
    });
    usedMinutes += 60;
    cursor = new Date(cursor.getTime() + 60 * 60 * 1000);
  }

  // 4+. Preventivos Normal MOVENTIA L’HOSPITALET (T-Mobilitat), 30 min cada uno
  while (usedMinutes + 30 <= maxMinutes) {
    scheduledTasks.push({
      operador: "MOVENTIA L'HOSPITALET",
      tipo: 'Preventivo',
      prioridad: 'Normal',
      contract: 'T-Mobilitat',
      hora: format(cursor, 'HH:mm'),
      duracionEstimada: '30m',
      observaciones: 'Preventivo programado',
      ubicacion: 'Cochera de L’Hospitalet',
      taskType: 'revision',
      estado: 'Pendent',
    });
    usedMinutes += 30;
    cursor = new Date(cursor.getTime() + 30 * 60 * 1000);
  }

  if (!isClient || !offlineDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregant tasques...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">Benvingut, {technicianName}</p>
                      <div className="flex items-center gap-2">
                        {isOnline ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Wifi className="h-4 w-4" />
                            <span className="text-xs">En línia</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-orange-600">
                            <WifiOff className="h-4 w-4" />
                            <span className="text-xs">Mode offline</span>
                          </div>
                        )}
                        {offlineStats.totalOfflineCompletions > 0 && (
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            {offlineStats.totalOfflineCompletions} offline
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Tasques del dia</h1>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{format(today, "EEEE, d 'de' MMMM", { locale: ca })}</p>
                    <p className={cn(
                      'text-sm',
                      totalEstimatedHours > 8 ? 'text-red-600 font-bold' : 'text-muted-foreground'
                    )}>
                      {totalTasks} tasques, ~{totalEstimatedHours.toFixed(1)}h estimades
                      {totalEstimatedHours > 8 && ' (Jornada Excedida)'}
                    </p>
                    {!isOnline && (
                      <p className="text-xs text-orange-600 mt-1">Les dades es sincronitzaran quan torni la connexió</p>
                    )}
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
        <ToggleGroup type="single" value={contractFilter} onValueChange={handleContractFilterChange} className="w-full sm:w-auto">
          <ToggleGroupItem value="all" aria-label="Tots els contractes" className="w-full">Tots ({todaysTasks.filter(t => (['revision','validator'].includes((t as any).taskType)) && isOperatorAllowed((t as any).operador)).length})</ToggleGroupItem>
          <ToggleGroupItem value="t-mobilitat" aria-label="Contracte T-Mobilitat" className="w-full">T-Mobilitat ({todaysTasks.filter(t => t.taskType === 'revision' && isOperatorAllowed((t as any).operador)).length})</ToggleGroupItem>
          <ToggleGroupItem value="c-4/2025" aria-label="Contracte C-4/2025" className="w-full">C-4/2025 ({todaysTasks.filter(t => t.taskType === 'validator' && isOperatorAllowed((t as any).operador)).length})</ToggleGroupItem>
        </ToggleGroup>
              <div className="flex gap-2 items-center">
                <div className="w-64">
                  <Select value={activeDepot} onValueChange={(v) => { setPrimaryDepot(v); if (isClient) localStorage.setItem('primaryDepot', v); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona cochera" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepots.map(dep => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ToggleGroup type="single" value={view} onValueChange={handleViewChange}>
                    <ToggleGroupItem value="list" aria-label="Vista de llista"><List className="mr-2 h-4 w-4"/>Llista</ToggleGroupItem>
                    <ToggleGroupItem value="map" aria-label="Vista de mapa"><Map className="mr-2 h-4 w-4"/>Mapa</ToggleGroupItem>
                </ToggleGroup>
                <Button variant="outline" size="sm"><HelpCircle className="mr-2 h-4 w-4"/>Ajuda</Button>
                {process.env.NODE_ENV === 'development' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsOnline(!isOnline);
                    }}
                    className={isOnline ? "text-orange-600 border-orange-200" : "text-green-600 border-green-200"}
                  >
                    {isOnline ? <WifiOff className="mr-2 h-4 w-4"/> : <Wifi className="mr-2 h-4 w-4"/>}
                    {isOnline ? 'Simular Offline' : 'Simular Online'}
                  </Button>
                )}
                {offlineStats.totalOfflineCompletions > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCompletedTasks}
                    className="text-red-600 border-red-200"
                  >
                    Netejar Offline
                  </Button>
                )}
              </div>
            </div>
        </div>
      </header>
      
      {/* Task List */}
      <div className="container mx-auto p-4 flex-grow">
        {/* Panel de demostració offline eliminat per interfície neta */}

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

        {view === 'list' ? (
            <div className="space-y-4 mt-4">
              {scheduledTasks.length > 0 ? (
                scheduledTasks.map((task: any, idx: number) => (
                  <UnifiedTaskCard 
                    key={task.id ?? `${task.vehiculoId ?? ''}-${task.hora}-${task.operador}-${idx}`}
                    task={task} 
                  />
                ))
        ) : (
        <p className="text-center text-muted-foreground py-8">No tens tasques programades per avui.</p>
        )}
      </div>
    ) : (
            <Card>
                <CardHeader>
                    <CardTitle>Vista de Mapa</CardTitle>
                    <CardDescription>Les tasques es mostren agrupades per ubicació. Les tasques de Validadors (C-4/2025) tenen una icona especial.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">La funcionalitat del mapa no està implementada en aquesta versió.</p>
                    </div>
                </CardContent>
            </Card>
        )}
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
