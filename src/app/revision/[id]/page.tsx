'use client';

import { MaintenanceForm } from '@/components/maintenance-form';
import { data } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bus, Wrench } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RevisionPage({ params }: { params: { id: string } }) {
  const revision = data.revisiones.find(rev => rev.id === params.id);

  if (!revision) {
    notFound();
  }
  
  // Find the corresponding bus to get the operatorId
  const bus = data.autobuses.find(b => b.uniqueId === revision.vehiculoId);
  const operator = bus ? data.operadores.find(o => o.id === bus.operadorId) : null;


  return (
    <main className="container mx-auto p-4 md:p-8">
       <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-4">
          <Bus className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            T-MobiliCheck
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Orden de Mantenimiento Preventivo ({revision.tipo})
        </p>
      </div>
      <MaintenanceForm revision={revision} operatorId={operator?.id} />
    </main>
  );
}
