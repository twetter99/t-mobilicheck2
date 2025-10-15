import { data } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InstallationClientPage } from './client-page';

export default function InstallationPage({ params }: { params: { id: string } }) {
  const revision = data.revisiones.find(rev => rev.id === params.id);

  if (!revision || revision.tipo !== 'Instal·lació') {
    notFound();
  }
  
  return (
    <main className="container mx-auto p-4 md:p-8">
       <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tornar a la llista
          </Link>
        </Button>
      </div>
      <InstallationClientPage revision={revision} />
    </main>
  );
}

    