import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Wrench, ChevronRight, Clock, Building, Users, AlertTriangle } from 'lucide-react';
import { data } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const getRevisionTypeDetails = (type: string) => {
  switch (type) {
    case 'Trimestral':
      return { label: 'Trimestral', className: 'bg-blue-100 text-blue-800' };
    case 'Semestral':
      return { label: 'Semestral', className: 'bg-yellow-100 text-yellow-800' };
    case 'Anual':
      return { label: 'Anual', className: 'bg-green-100 text-green-800' };
    case 'Bianual':
      return { label: 'Bianual', className: 'bg-purple-100 text-purple-800' };
    default:
      return { label: type, className: 'bg-gray-100 text-gray-800' };
  }
};


export default function RevisionsPage() {
  const today = new Date('2026-01-26T22:00:00.000Z'); // Forcing date to show night shift schedule
  const todaysRevisions = data.revisiones.filter(rev => {
    const revDate = new Date(rev.fecha);
    return revDate.getUTCFullYear() === today.getUTCFullYear() &&
           revDate.getUTCMonth() === today.getUTCMonth() &&
           revDate.getUTCDate() === today.getUTCDate();
  }).sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <Wrench className="h-12 w-12 text-primary mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
          T-MobiliCheck
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mt-2">
          Revisiones asignadas para hoy, {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {todaysRevisions.length > 0 ? (
        <div className="space-y-4">
          {todaysRevisions.map((revision) => (
            <Card key={revision.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bus className="h-6 w-6 text-primary" />
                  Vehículo: {revision.vehiculoId}
                </CardTitle>
                <Badge variant="outline" className={getRevisionTypeDetails(revision.tipo).className}>
                  {getRevisionTypeDetails(revision.tipo).label}
                </Badge>
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
                <div className="flex items-center gap-2">
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
                        <Link href={`/revision/${revision.id}`}>
                            Iniciar Revisión <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardHeader>
                <CardTitle>No hay revisiones para hoy</CardTitle>
                <CardDescription>No tienes ninguna orden de mantenimiento programada para la fecha actual.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Revisa el plan o contacta con tu supervisor.</p>
            </CardContent>
        </Card>
      )}
    </main>
  );
}
