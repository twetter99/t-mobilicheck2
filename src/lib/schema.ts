import { z } from 'zod';

export const formSchema = z.object({
  header: z.object({
    operator: z.string().min(1, 'El operador es obligatorio.'),
    depot: z.string().min(1, 'La cochera es obligatoria.'),
    busNumber: z.string().min(1, 'El número de bus/calca es obligatorio.'),
    licensePlate: z.string().min(1, 'La matrícula es obligatoria.'),
    technician: z.string().min(1, 'El técnico es obligatorio.'),
    date: z.date({ required_error: 'La fecha es obligatoria.' }),
    startTime: z.string().min(1, 'La hora de inicio es obligatoria.'),
    endTime: z.string().min(1, 'La hora de fin es obligatoria.'),
  }),
  inventory: z.object({
    consoleSerial: z.string().optional(),
    consoleMount: z.enum(['sin_brazo', 'brazo_corto', 'brazo_largo', 'simple_extraible'], {
      required_error: 'Debe seleccionar un tipo de soporte.',
    }),
    consoleSoftware: z.string().optional(),
    configVersion: z.string().optional(),
    telechargeVersion: z.string().optional(),
    valIn1Serial: z.string().optional(),
    valIn2Serial: z.string().optional(),
    valOut1Serial: z.string().optional(),
    valOut2Serial: z.string().optional(),
    valOut3Serial: z.string().optional(),
    valOut4Serial: z.string().optional(),
    queryTerminalSerial: z.string().optional(),
    connectionsPlateSerial: z.string().optional(),
    switchSerial: z.string().optional(),
    mccSerial: z.string().optional(),
    triBandAntennaSerial: z.string().optional(),
    legacyMag1Brand: z.enum(['Ascom', 'Indra', 'N/A']).optional(),
    legacyMag1Serial: z.string().optional(),
    legacyMag2Brand: z.enum(['Ascom', 'Indra', 'N/A']).optional(),
    legacyMag2Serial: z.string().optional(),
  }),
  checklist: z.object({
    consoleGeneralCleaning: z.boolean().default(false),
    consoleAutocutterCleaning: z.boolean().default(false),
    consoleSerialRegistration: z.boolean().default(false),
    validatorGeneralCleaning: z.boolean().default(false),
    validatorConnectorsCleaning: z.boolean().default(false),
    validatorSerialRegistration: z.boolean().default(false),
  }).refine(data => Object.values(data).every(Boolean), {
    message: 'Todas las tareas del checklist deben ser completadas.',
    path: ['consoleGeneralCleaning'], // Show error on the first item
  }),
  verification: z.object({
    startupOk: z.boolean().default(false),
    screenOk: z.boolean().default(false),
    printerOk: z.boolean().default(false),
    validationOk: z.boolean().default(false),
    communicationOk: z.boolean().default(false),
  }).refine(data => Object.values(data).every(Boolean), {
    message: 'Todas las verificaciones deben ser completadas.',
    path: ['startupOk'], // Show error on the first item
  }),
  observations: z.object({
    notes: z.string().optional(),
    hasIncident: z.boolean().default(false),
    correctiveAction: z
      .object({
        title: z.string().min(1, 'El título es obligatorio.'),
        description: z.string().min(1, 'La descripción es obligatoria.'),
        priority: z.enum(['Baja', 'Media', 'Alta']),
      })
      .optional(),
    technicianSignature: z.string().min(1, 'La firma del técnico es obligatoria.'),
    supervisorSignature: z.string().optional(),
  }),
});

export type FormValues = z.infer<typeof formSchema>;