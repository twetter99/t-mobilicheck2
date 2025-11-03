'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { FormValuesMagneticas } from '@/lib/schema';

type Props = {
  form: UseFormReturn<FormValuesMagneticas>;
};

const tareasMantenimiento = [
  { id: 'netejaInterna', label: 'Neteja interna de la validadora' },
  { id: 'netejaExterna', label: 'Neteja externa de la validadora' },
  { id: 'netejaViesBitllets', label: 'Neteja de vies de pas de bitllets' },
  { id: 'netejaFotocelules', label: 'Neteja de fotocèl·lules de detecció' },
  { id: 'verificacioRodets', label: 'Verificació i ajust de rodets de pressió del capçal magnètic' },
  { id: 'comprovacioCorretges', label: 'Comprovació de tensió de corretges' },
  { id: 'verificacioCargoleria', label: 'Verificació i apreto de cargoleria estructural' },
  { id: 'substitucióPeces', label: 'Substitució preventiva de peces desgastades (si escau)' },
  { id: 'verificacioFuncional', label: 'Verificació funcional del procés de validació' },
  { id: 'comprovacióComunicacio', label: 'Comprovació de comunicació amb sistema embarcat' },
  { id: 'registreFotografic', label: 'Registre fotogràfic realitzat' },
  { id: 'documentacioActualitzada', label: 'Documentació tècnica actualitzada' },
];

export function Step3TareasMantenimiento({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasques de Manteniment</CardTitle>
        <CardDescription>Checklist de verificació (totes les tasques són obligatòries)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tareasMantenimiento.map((tarea) => (
          <FormField
            key={tarea.id}
            control={form.control}
            name={`tareasMantenimiento.${tarea.id as keyof FormValuesMagneticas['tareasMantenimiento']}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    {tarea.label}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        ))}
        <FormMessage>
          {form.formState.errors.tareasMantenimiento?.message}
        </FormMessage>
      </CardContent>
    </Card>
  );
}
