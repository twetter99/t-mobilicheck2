import { z } from 'zod';

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
  checklist: z.object({
    consoleGeneralCleaning: z.boolean().default(false),
    consoleAutocutterCleaning: z.boolean().default(false),
    consoleSerialRegistration: z.boolean().default(false),
    validatorGeneralCleaning: z.boolean().default(false),
    validatorConnectorsCleaning: z.boolean().default(false),
    validatorSerialRegistration: z.boolean().default(false),
  }).refine(data => Object.values(data).every(Boolean), {
    message: 'Totes les tasques de la llista de verificació han de ser completades.',
    path: ['consoleGeneralCleaning'], // Mostra l'error al primer element
  }),
  verification: z.object({
    startupOk: z.boolean().default(false),
    screenOk: z.boolean().default(false),
    printerOk: z.boolean().default(false),
    validationOk: z.boolean().default(false),
    communicationOk: z.boolean().default(false),
  }).refine(data => Object.values(data).every(Boolean), {
    message: 'Totes les verificacions han de ser completades.',
    path: ['startupOk'], // Mostra l'error al primer element
  }),
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
