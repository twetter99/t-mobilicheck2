import { data } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OperationClientPage } from './client-page';
import { checklists } from '@/lib/checklist-data';

export default function OperationPage({ params }: { params: { id: string } }) {
  const revision = data.revisiones.find(rev => rev.id === params.id);

  if (!revision) {
    notFound();
  }
  
  const operationTypeKey = revision.tipo.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const checklist = checklists[operationTypeKey] || [];
  
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
      <OperationClientPage revision={revision} operatorId={operator?.id} checklist={checklist} />
    </main>
  );
}
