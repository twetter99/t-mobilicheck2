import { MaintenanceForm } from '@/components/maintenance-form';
import { data } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevisionClientPage } from './client-page';

export default function RevisionPage({ params }: { params: { id: string } }) {
  const revision = data.revisiones.find(rev => rev.id === params.id);

  if (!revision) {
    notFound();
  }
  
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
      <RevisionClientPage revision={revision} operatorId={operator?.id} />
    </main>
  );
}
