import { MaintenanceForm } from '@/components/maintenance-form';
import { Bus, ClipboardList } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-4">
          <Bus className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            T-MobiliCheck
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Orden de Mantenimiento Preventivo Trimestral (Lote 1 – Sistema T‑Mobilitat)
        </p>
      </div>
      <MaintenanceForm />
    </main>
  );
}
