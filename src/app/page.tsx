'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle, HardHat, Download, Upload } from 'lucide-react';
import { data } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getRevisionTypeDetails = (type: string) => {
  if (type.startsWith('Preventivo')) {
     if (type.includes('Trimestral')) return { label: 'Preventivo Trimestral', className: 'bg-blue-100 text-blue-800', icon: Wrench };
     if (type.includes('Semestral')) return { label: 'Preventivo Semestral', className: 'bg-yellow-100 text-yellow-800', icon: Wrench };
     if (type.includes('Anual')) return { label: 'Preventivo Anual', className: 'bg-green-100 text-green-800', icon: Wrench };
     if (type.includes('Bianual')) return { label: 'Preventivo Bianual', className: 'bg-purple-100 text-purple-800', icon: Wrench };
  }
  switch (type) {
    case 'Instalación':
      return { label: 'Instalación', className: 'bg-cyan-100 text-cyan-800', icon: HardHat };
    case 'Traspaso':
      return { label: 'Traspaso', className: 'bg-orange-100 text-orange-800', icon: Upload };
    case 'Desinstalación':
      return { label: 'Desinstalación', className: 'bg-red-100 text-red-800', icon: Download };
    default:
      return { label: type, className: 'bg-gray-100 text-gray-800', icon: Wrench };
  }
};

const RevisionList = ({ revisions }: { revisions: typeof data.revisiones }) => {
  if (revisions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>No hay intervenciones de este tipo</CardTitle>
          <CardDescription>No tienes ninguna operación de este tipo programada.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {revisions.map((revision) => {
        const typeDetails = getRevisionTypeDetails(revision.tipo);
        const Icon = typeDetails.icon;
        const href = revision.tipo.startsWith('Preventivo') ? `/revision/${revision.id}` : `/operacion/${revision.id}`;
        const revisionDate = new Date(revision.fecha);

        return (
          <Card key={revision.id} className="hover:shadow-md transition-shadow">
             <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Bus className="h-6 w-6 text-primary" />
                        Vehículo: {revision.vehiculoId}
                    </CardTitle>
                    <Badge variant="outline" className={typeDetails.className}>
                        <Icon className="mr-2 h-4 w-4" />
                        {typeDetails.label}
                    </Badge>
                </div>
                 <CardDescription>
                    {format(revisionDate, "EEEE, d 'de' MMMM", { locale: es })}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Operador:</span>
                <span>{revision.operador}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Hora:</span>
                <span>{revision.hora} ({revision.duracionEstimada})</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Ubicación:</span>
                <span>{revision.ubicacion}</span>
              </div>
              {revision.observaciones && (
                  <div className="flex items-start gap-2 md:col-span-2">
                      <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                          <span className="font-medium">Observaciones:</span>
                          <p className="text-sm text-muted-foreground">{revision.observaciones}</p>
                      </div>
                  </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                  <Button asChild variant="default">
                      <Link href={href}>
                          Iniciar Intervención <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
              </div>

            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


export default function RevisionsPage() {
  const today = new Date();

  // Sort all revisions chronologically by date and then by time
  const allRevisions = [...data.revisiones].sort((a, b) => {
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    if (dateA !== dateB) {
        return dateA - dateB;
    }
    
    // Custom sort to handle overnight times
    const timeA = a.hora;
    const timeB = b.hora;
    if (timeA.startsWith('0') && timeB.startsWith('2')) return 1;
    if (timeA.startsWith('2') && timeB.startsWith('0')) return -1;
    
    return timeA.localeCompare(timeB);
  });
  
  const maintenanceRevisions = allRevisions.filter(rev => rev.tipo.startsWith('Preventivo'));
  const operationRevisions = allRevisions.filter(rev => !rev.tipo.startsWith('Preventivo'));

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <Wrench className="h-12 w-12 text-primary mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
          T-MobiliCheck
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mt-2">
          Intervenciones Asignadas
        </p>
      </div>
      
      <Tabs defaultValue="mantenimientos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mantenimientos">Mantenimientos</TabsTrigger>
          <TabsTrigger value="operaciones">Otras Operaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="mantenimientos" className="mt-6">
          <RevisionList revisions={maintenanceRevisions} />
        </TabsContent>
        <TabsContent value="operaciones" className="mt-6">
          <RevisionList revisions={operationRevisions} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
