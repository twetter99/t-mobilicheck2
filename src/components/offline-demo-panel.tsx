'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, RefreshCw, Database, CheckCircle } from 'lucide-react';
import { useOfflineTasks } from '@/hooks/use-offline-tasks';

export function OfflineDemoPanel() {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { getOfflineStats, clearCompletedTasks, completedTasks, completedForms } = useOfflineTasks();
  const stats = getOfflineStats();

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    // Simular desconexión/conexión
    if (typeof window !== 'undefined') {
      // En una implementación real, esto afectaría las llamadas a la API
      localStorage.setItem('demoOfflineMode', (!isOfflineMode).toString());
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Database className="h-5 w-5" />
          Demostració de Persistència Offline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de conexión simulado */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            {isOfflineMode ? (
              <WifiOff className="h-5 w-5 text-orange-600" />
            ) : (
              <Wifi className="h-5 w-5 text-green-600" />
            )}
            <span className="font-medium">
              Estat de connexió: {isOfflineMode ? 'Offline (Simulat)' : 'Online'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleOfflineMode}
            className={isOfflineMode ? "border-orange-200 text-orange-700" : "border-green-200 text-green-700"}
          >
            {isOfflineMode ? 'Simular Connexió' : 'Simular Desconnexió'}
          </Button>
        </div>

        {/* Estadísticas offline */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalOfflineCompletions}</div>
            <div className="text-xs text-muted-foreground">Tasques completades</div>
          </div>
          <div className="p-3 bg-white rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalForms}</div>
            <div className="text-xs text-muted-foreground">Formularis enviats</div>
          </div>
          <div className="p-3 bg-white rounded-lg border text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.todayCompletions}</div>
            <div className="text-xs text-muted-foreground">Completades avui</div>
          </div>
        </div>

        {/* Lista de tareas completadas offline */}
        {(completedTasks.length > 0 || completedForms.length > 0) && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-blue-800">Activitat offline:</h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {/* Formularios completados */}
              {completedForms.map((form, index) => (
                <div key={`form-${index}`} className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="font-medium">Formulari enviat</span>
                  <span className="font-mono">{form.busNumber}</span>
                  <Badge variant="outline" className="text-xs py-0 bg-green-100 border-green-300">
                    {form.operator}
                  </Badge>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(form.submittedAt).toLocaleTimeString('ca-ES')}
                  </span>
                </div>
              ))}
              
              {/* Tareas completadas simples */}
              {completedTasks.filter(task => !task.formSubmissionId).map((task, index) => (
                <div key={`task-${index}`} className="flex items-center gap-2 p-2 bg-white rounded border text-xs">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                  <span className="font-mono">{task.id}</span>
                  <Badge variant="outline" className="text-xs py-0">
                    {task.taskType}
                  </Badge>
                  {task.busNumber && <span className="text-muted-foreground">({task.busNumber})</span>}
                  <span className="text-muted-foreground ml-auto">
                    {new Date(task.completedAt).toLocaleTimeString('ca-ES')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instrucciones para la demo */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm text-blue-800 mb-2">Com provar la demo:</h4>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Completa una tasca de manteniment (emplena el formulari complet)</li>
            <li>Observa com es guarda tot: formulari + estat de la tasca</li>
            <li>Torna al dashboard - la tasca apareixerà com "Completada"</li>
            <li>Fes clic a "Simular Desconnexió" per activar el mode offline</li>
            <li>Completa més tasques - es guardaran localment</li>
            <li>Refresca la pàgina - les tasques completades es mantindran</li>
            <li>Torna al mode online - en un entorn real, les dades es sincronitzarien</li>
          </ol>
        </div>

        {/* Botones de utilidad */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refrescar Pàgina
          </Button>
          {(completedTasks.length > 0 || completedForms.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompletedTasks}
              className="text-red-600 border-red-200"
            >
              Netejar Dades
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}