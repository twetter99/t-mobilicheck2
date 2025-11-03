'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { FormValuesMagneticas } from '@/lib/schema';

type Props = {
  form: UseFormReturn<FormValuesMagneticas>;
};

// Tareas PPT 2.1.2 organizadas por fases
const tareasMantenimientoPPT = [
  // FASE 1: Intervenció (PPT 2.1.2)
  { 
    fase: 'Fase 1: Intervenció',
    tareas: [
      { id: "Desmuntatge de la validadora del vehicle", label: "Desmuntatge de la validadora del vehicle" },
    ]
  },
  // FASE 2: Taller (PPT 2.1.2)
  {
    fase: 'Fase 2: Taller',
    tareas: [
      { id: "Neteja interna de la validadora (pols)", label: "Neteja interna de la validadora (pols)" },
      { id: "Neteja externa de la validadora", label: "Neteja externa de la validadora" },
      { id: "Neteja de vies de pas de bitllets", label: "Neteja de vies de pas de bitllets" },
      { id: "Neteja de fotocèl·lules", label: "Neteja de fotocèl·lules" },
      { id: "Verificació i ajust de rodets de pressió del capçal magnètic", label: "Verificació i ajust de rodets de pressió del capçal magnètic" },
      { id: "Verificació/substitució del capçal magnètic", label: "Verificació/substitució del capçal magnètic" },
      { id: "Comprovació de tensió de corretges", label: "Comprovació de tensió de corretges" },
      { id: "Verificació i apreto de cargols de subjecció de motors", label: "Verificació i apreto de cargols de subjecció de motors" },
      { id: "Substitució preventiva de peces desgastades (si escau)", label: "Substitució preventiva de peces desgastades (si escau)" },
    ]
  },
  // FASE 3: Tancament Vehicle (PPT 2.1.2)
  {
    fase: 'Fase 3: Tancament Vehicle',
    tareas: [
      { id: "Restitució de l'equip al vehicle", label: "Restitució de l'equip al vehicle" },
      { id: "Comprovació de comunicació amb sistema embarcat", label: "Comprovació de comunicació amb sistema embarcat" },
      { id: "Verificació a bord (Test d'explotació)", label: "Verificació a bord (Test d'explotació)" },
      { id: "Obtenció i adjunció del justificant de test", label: "Obtenció i adjunció del justificant de test" },
    ]
  },
  // FASE 4: Documentació
  {
    fase: 'Fase 4: Documentació',
    tareas: [
      { id: "Registre fotogràfic realitzat", label: "Registre fotogràfic realitzat" },
      { id: "Documentació tècnica actualitzada", label: "Documentació tècnica actualitzada" },
    ]
  },
];

export function Step3TareasMantenimiento({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasques de Manteniment (PPT 2.1.2)</CardTitle>
        <CardDescription>Checklist de verificació completa (totes les tasques són obligatòries segons el Pliego)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tareasMantenimientoPPT.map((grupo, grupoIndex) => (
          <div key={grupoIndex} className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b pb-2">{grupo.fase}</h3>
            {grupo.tareas.map((tarea) => (
              <FormField
                key={tarea.id}
                control={form.control}
                name={`tareasMantenimiento.${tarea.id as keyof FormValuesMagneticas['tareasMantenimiento']}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="cursor-pointer font-normal">
                        {tarea.label}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        ))}
        <FormMessage>
          {form.formState.errors.tareasMantenimiento?.message}
        </FormMessage>
      </CardContent>
    </Card>
  );
}
