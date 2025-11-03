'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormValuesMagneticas } from '@/lib/schema';

type Props = {
  form: UseFormReturn<FormValuesMagneticas>;
};

export function Step4PiezasSustituidas({ form }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'piezasSustituidas',
  });

  const handleAddPieza = () => {
    append({
      id: `pieza-${Date.now()}`,
      descripcion: '',
      referencia: '',
      cantidad: 1,
      motivo: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peces Substituïdes</CardTitle>
        <CardDescription>Registre de components reemplaçats durant la intervenció (opcional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" onClick={handleAddPieza} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Afegir Peça
        </Button>

        {fields.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripció</TableHead>
                  <TableHead>Referència</TableHead>
                  <TableHead className="w-24">Quantitat</TableHead>
                  <TableHead>Motiu</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`piezasSustituidas.${index}.descripcion`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Ex: Rodets capçal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`piezasSustituidas.${index}.referencia`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Ex: REF-12345" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`piezasSustituidas.${index}.cantidad`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`piezasSustituidas.${index}.motivo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea {...field} placeholder="Ex: Desgast excessiu" className="min-h-[60px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No s'han afegit peces substituïdes. Feu clic a "Afegir Peça" si cal registrar components reemplaçats.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
