import { z } from 'zod';

// Subesquemes base (sense restriccions estrictes)
const checklistSchemaBase = z.object({
  consoleGeneralCleaning: z.boolean().default(false),
  consoleAutocutterCleaning: z.boolean().default(false),
  consoleSerialRegistration: z.boolean().default(false),
  validatorGeneralCleaning: z.boolean().default(false),
  validatorConnectorsCleaning: z.boolean().default(false),
  validatorSerialRegistration: z.boolean().default(false),
});

const verificationSchemaBase = z.object({
  startupOk: z.boolean().default(false),
  screenOk: z.boolean().default(false),
  printerOk: z.boolean().default(false),
  validationOk: z.boolean().default(false),
  communicationOk: z.boolean().default(false),
});

// Versions estrictes (tots els ítems marcats)
const checklistSchemaStrict = checklistSchemaBase.refine(data => Object.values(data).every(Boolean), {
  message: 'Totes les tasques de la llista de verificació han de ser completades.',
  path: ['consoleGeneralCleaning'],
});

const verificationSchemaStrict = verificationSchemaBase.refine(data => Object.values(data).every(Boolean), {
  message: 'Totes les verificacions han de ser completades.',
  path: ['startupOk'],
});

// Esquema complet (estricte)
export const formSchema = z.object({
  header: z.object({
    orderNumber: z.string().optional(),
    operator: z.string().min(1, 'L\'operador és obligatori.'),
    depot: z.string().min(1, 'La cotxera és obligatòria.'),
    busNumber: z.string().min(1, 'El número de bus/calca és obligatori.'),
    licensePlate: z.string().min(1, 'La matrícula és obligatòria.'),
    technician: z.string().min(1, 'El tècnic és obligatori.'),
    date: z.date({ required_error: 'La data és obligatòria.' }),
  }),
  inventory: z.object({
    consoleSerial: z.string().optional(),
    mccSerial: z.string().optional(),
    switchSerial: z.string().optional(),
    installationKitSerial: z.string().optional(),
    consoleMount: z.enum(['sin_brazo', 'brazo_corto', 'brazo_largo', 'simple_extraible'], {
      required_error: 'Heu de seleccionar un tipus de suport.',
    }),
    
    // SC1
    sc1Serial: z.string().optional(),
    sc1SupportSerial: z.string().optional(),
    sc1DeviceCode: z.string().optional(),
    
    // SC2
    sc2Serial: z.string().optional(),
    sc2SupportSerial: z.string().optional(),
    sc2DeviceCode: z.string().optional(),

    // SC3
    sc3Serial: z.string().optional(),
    sc3SupportSerial: z.string().optional(),
    sc3DeviceCode: z.string().optional(),
    
    // SC4
    sc4Serial: z.string().optional(),
    sc4SupportSerial: z.string().optional(),
    sc4DeviceCode: z.string().optional(),

    // SC5
    sc5Serial: z.string().optional(),
    sc5SupportSerial: z.string().optional(),
    sc5DeviceCode: z.string().optional(),

    // SC6
    sc6Serial: z.string().optional(),
    sc6SupportSerial: z.string().optional(),
    sc6DeviceCode: z.string().optional(),

    // Terminal de Consulta
    queryTerminalSerial: z.string().optional(),
    queryTerminalSupportSerial: z.string().optional(),
    queryTerminalDeviceCode: z.string().optional(),
    
    // Legacy fields - to be deprecated or kept based on final decision
    valIn1Serial: z.string().optional(),
    valIn2Serial: z.string().optional(),
    valOut1Serial: z.string().optional(),
    valOut2Serial: z.string().optional(),
    valOut3Serial: z.string().optional(),
    valOut4Serial: z.string().optional(),
    connectionsPlateSerial: z.string().optional(),
    triBandAntennaSerial: z.string().optional(),
    legacyMag1Brand: z.enum(['Ascom', 'Indra', 'N/A']).optional(),
    legacyMag1Serial: z.string().optional(),
    legacyMag2Brand: z.enum(['Ascom', 'Indra', 'N/A']).optional(),
    legacyMag2Serial: z.string().optional(),
  }),
  software: z.object({
    consoleSoftware: z.string().optional(),
    telechargeVersion: z.string().optional(),
    configVersion: z.string().optional(),
  }),
  preexistingSystems: z.object({
      magneticValidatorBrand: z.string().optional(),
      magneticValidatorModel: z.string().optional(),
      magneticValidatorSerial: z.string().optional(),
      contactlessValidatorBrand: z.string().optional(),
      contactlessValidatorModel: z.string().optional(),
      contactlessValidatorSerial: z.string().optional(),
      saeIntegration: z.enum(['Sí', 'No']),
      saeBrand: z.string().optional(),
      saeModel: z.string().optional(),
      exteriorPanelsIntegration: z.enum(['Sí', 'No']),
      exteriorPanelsBrand: z.string().optional(),
      exteriorPanelsModel: z.string().optional(),
  }),
  executionPhases: z.object({
      preliminaryCheck: z.enum(['OK', 'NOK', 'N/A']),
      preexistingSystemsCheck: z.enum(['OK', 'NOK', 'N/A']),
      connectionPlateInstallation: z.enum(['OK', 'NOK', 'N/A']),
      antennaInstallation: z.enum(['OK', 'NOK', 'N/A']),
      mccInstallation: z.enum(['OK', 'NOK', 'N/A']),
      consoleSupportInstallation: z.enum(['OK', 'NOK', 'N/A']),
      consoleInstallation: z.enum(['OK', 'NOK', 'N/A']),
      validatorSupportInstallation: z.enum(['OK', 'NOK', 'N/A']),
      finalCheck: z.enum(['OK', 'NOK', 'N/A']),
      softwareUpdate: z.enum(['OK', 'NOK', 'N/A']),
      functionalTests: z.enum(['OK', 'NOK', 'N/A']),
  }),
  checklist: checklistSchemaStrict,
  verification: verificationSchemaStrict,
  observations: z.object({
    startTime: z.string().min(1, 'L\'hora d\'inici és obligatòria.'),
    endTime: z.string().min(1, 'L\'hora de fi és obligatòria.'),
    notes: z.string().optional(),
    hasIncident: z.boolean().default(false),
    correctiveAction: z.object({
        title: z.string().default(''),
        description: z.string().default(''),
        priority: z.enum(['Baixa', 'Mitjana', 'Alta']).default('Baixa'),
    }).optional(),
    technicianSignature: z.string().min(1, 'La signatura del tècnic és obligatòria.'),
    supervisorSignature: z.string().optional(),
    beforePhotos: z.array(z.string()).optional().default([]),
    afterPhotos: z.array(z.string()).optional().default([]),
  }).refine(data => {
      if (data.hasIncident) {
        return (
          data.correctiveAction &&
          typeof data.correctiveAction.title === 'string' &&
          data.correctiveAction.title.trim().length > 0 &&
          typeof data.correctiveAction.description === 'string' &&
          data.correctiveAction.description.trim().length > 0
        );
      }
      return true;
  }, {
      message: 'Heu d\'omplir els detalls de la incidència (títol i descripció).',
      path: ['correctiveAction', 'title'],
  }),
});

export type FormValues = z.infer<typeof formSchema>;

// Esquema LENIENT per a proves (no obliga a completar tots els checks)
export const formSchemaLenient = z.object({
  header: formSchema.shape.header,
  inventory: formSchema.shape.inventory,
  software: formSchema.shape.software,
  preexistingSystems: formSchema.shape.preexistingSystems,
  executionPhases: formSchema.shape.executionPhases,
  checklist: checklistSchemaBase, // sense refine
  verification: verificationSchemaBase, // sense refine
  observations: formSchema.shape.observations,
});

// ============================================
// ESQUEMA PARA VALIDADORAS MAGNÉTICAS (C-4/2025)
// ============================================

// Peça substituïda
const piezaSustituida = z.object({
  id: z.string(),
  descripcion: z.string().min(1, 'La descripció és obligatòria'),
  referencia: z.string().min(1, 'La referència és obligatòria'),
  cantidad: z.number().min(1, 'La quantitat ha de ser almenys 1'),
  motivo: z.string().min(1, 'El motiu és obligatori'),
});

// Checklist de tareas de mantenimiento (12 items obligatorios)
const checklistMagneticasBase = z.object({
  netejaInterna: z.boolean().default(false),
  netejaExterna: z.boolean().default(false),
  netejaViesBitllets: z.boolean().default(false),
  netejaFotocelules: z.boolean().default(false),
  verificacioRodets: z.boolean().default(false),
  comprovacioCorretges: z.boolean().default(false),
  verificacioCargoleria: z.boolean().default(false),
  substitucióPeces: z.boolean().default(false),
  verificacioFuncional: z.boolean().default(false),
  comprovacióComunicacio: z.boolean().default(false),
  registreFotografic: z.boolean().default(false),
  documentacioActualitzada: z.boolean().default(false),
});

const checklistMagneticasStrict = checklistMagneticasBase.refine(
  data => Object.values(data).every(Boolean),
  {
    message: 'Totes les tasques de manteniment han de ser completades.',
    path: ['netejaInterna'],
  }
);

// Esquema completo para validadoras magnéticas (STRICT - validación completa)
export const formSchemaMagneticas = z.object({
  // SECCIÓN 1: Datos de la intervención (pre-rellenados)
  datosIntervencion: z.object({
    contrato: z.string().default('C-4/2025'),
    operador: z.string().min(1, 'L\'operador és obligatori'),
    estacion: z.string().min(1, 'L\'estació/ubicació és obligatòria'),
    numeroValidadora: z.string().min(1, 'El número de validadora és obligatori'),
    matricula: z.string().optional(), // Opcional, puede no tener matrícula
    tecnico: z.string().min(1, 'El tècnic és obligatori'),
    data: z.date({ required_error: 'La data és obligatòria' }),
    horaProgramada: z.string().min(1, 'L\'hora programada és obligatòria'),
  }),

  // SECCIÓN 2: Inventario y versiones (editables)
  inventarioVersiones: z.object({
    modelValidadora: z.string().min(1, 'El model de validadora és obligatori'),
    numeroSerie: z.string().min(1, 'El número de sèrie és obligatori'),
    versionFirmware: z.string().min(1, 'La versió de firmware és obligatòria'),
    versionSoftware: z.string().min(1, 'La versió de software és obligatòria'),
    ultimaActualizacion: z.date({ required_error: 'La data d\'última actualització és obligatòria' }),
  }),

  // SECCIÓN 3: Checklist de tareas
  tareasMantenimiento: checklistMagneticasStrict,

  // SECCIÓN 4: Piezas sustituidas (tabla dinámica, opcional)
  piezasSustituidas: z.array(piezaSustituida).default([]),

  // SECCIÓN 5: Observaciones y cierre
  observacionesTancament: z.object({
    horaInicio: z.string().min(1, 'L\'hora d\'inici és obligatòria'),
    horaFin: z.string().min(1, 'L\'hora de fi és obligatòria'),
    tiempoTotal: z.string().optional(), // Calculado automáticamente
    observacionesGenerales: z.string().optional(),
    
    // Incidencias detectadas
    tieneIncidencia: z.boolean().default(false),
    incidencia: z.object({
      titulo: z.string().default(''),
      descripcion: z.string().default(''),
      prioridad: z.enum(['Baixa', 'Mitjana', 'Alta']).default('Baixa'),
      generarOrdenCorrectiva: z.boolean().default(false),
    }).optional(),
  }).refine(data => {
    if (data.tieneIncidencia) {
      return (
        data.incidencia &&
        data.incidencia.titulo.trim().length > 0 &&
        data.incidencia.descripcion.trim().length >= 20
      );
    }
    return true;
  }, {
    message: 'La descripció de la incidència ha de tenir almenys 20 caràcters.',
    path: ['incidencia', 'descripcion'],
  }),

  // SECCIÓN 6: Adjuntos (fotografías)
  adjuntos: z.object({
    fotografias: z.array(z.string()).min(1, 'Cal adjuntar almenys una fotografia'),
  }),
});

export type FormValuesMagneticas = z.infer<typeof formSchemaMagneticas>;

// Versión LENIENT para pruebas (sin obligatoriedad de checklist completo ni fotos)
export const formSchemaMagneticasLenient = z.object({
  // Relajamos todos los campos para no bloquear pruebas
  datosIntervencion: z.object({
    contrato: z.string().default('C-4/2025'),
    operador: z.string().optional().default(''),
    estacion: z.string().optional().default(''),
    numeroValidadora: z.string().optional().default(''),
    matricula: z.string().optional(),
    tecnico: z.string().optional().default(''),
    data: z.date().optional().default(new Date()),
    horaProgramada: z.string().optional().default(''),
  }),

  inventarioVersiones: z.object({
    modelValidadora: z.string().optional().default(''),
    numeroSerie: z.string().optional().default(''),
    versionFirmware: z.string().optional().default(''),
    versionSoftware: z.string().optional().default(''),
    ultimaActualizacion: z.date().optional().default(new Date()),
  }),

  tareasMantenimiento: checklistMagneticasBase, // sin refine

  piezasSustituidas: z.array(z.object({
    id: z.string().optional().default(''),
    descripcion: z.string().optional().default(''),
    referencia: z.string().optional().default(''),
    cantidad: z.number().optional().default(1 as any),
    motivo: z.string().optional().default(''),
  })).default([]),

  observacionesTancament: z.object({
    horaInicio: z.string().optional().default(''),
    horaFin: z.string().optional().default(''),
    tiempoTotal: z.string().optional().default(''),
    observacionesGenerales: z.string().optional().default(''),
    tieneIncidencia: z.boolean().optional().default(false),
    incidencia: z.object({
      titulo: z.string().optional().default(''),
      descripcion: z.string().optional().default(''),
      prioridad: z.enum(['Baixa', 'Mitjana', 'Alta']).optional().default('Baixa'),
      generarOrdenCorrectiva: z.boolean().optional().default(false),
    }).optional(),
  }),

  adjuntos: z.object({
    fotografias: z.array(z.string()).optional().default([]), // sin mínimo
  }),
});
