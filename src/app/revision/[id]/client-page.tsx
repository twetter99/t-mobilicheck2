'use client';

import { MaintenanceForm } from '@/components/maintenance-form';
import { Bus } from 'lucide-react';

export function RevisionClientPage({ revision, operatorId }: { revision: any, operatorId?: string | null }) {
  return (
    <>
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
      <MaintenanceForm revision={revision} operatorId={operatorId || undefined} />
    </>
  );
}
