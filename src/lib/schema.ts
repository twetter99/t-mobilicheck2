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
    sc1Serial: z.string().optional(),
    sc2Serial: z.string().optional(),
    sc3Serial: z.string().optional(),
    sc4Serial: z.string().optional(),
    sc5Serial: z.string().optional(),
    sc6Serial: z.string().optional(),
    queryTerminalSupportSerial: z.string().optional(),
    valIn1Serial: z.string().optional(),
    valIn2Serial: z.string().optional(),
    valOut1Serial: z.string().optional(),
    valOut2Serial: z.string().optional(),
    valOut3Serial: z.string().optional(),
    valOut4Serial: z.string().optional(),
    queryTerminalSerial: z.string().optional(),
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
      preliminaryCheck: z.enum(['OK', 'NOK']),
      preexistingSystemsCheck: z.enum(['OK', 'NOK']),
      connectionPlateInstallation: z.enum(['OK', 'NOK']),
      antennaInstallation: z.enum(['OK', 'NOK']),
      mccInstallation: z.enum(['OK', 'NOK']),
      consoleSupportInstallation: z.enum(['OK', 'NOK']),
      consoleInstallation: z.enum(['OK', 'NOK']),
      validatorSupportInstallation: z.enum(['OK', 'NOK']),
      finalCheck: z.enum(['OK', 'NOK']),
      softwareUpdate: z.enum(['OK', 'NOK']),
      functionalTests: z.enum(['OK', 'NOK']),
  }),
  checklist: z.object({
    consoleGeneralCleaning: z.boolean().default(false),
    consoleAutocutterCleaning: z.boolean().default(false),
    consoleSerialRegistration: z.boolean().default(false),
    validatorGeneralCleaning: z.boolean().default(false),
    validatorConnectorsCleaning: z.boolean().default(false),
    validatorSerialRegistration: z.boolean().default(false),
  }).refine(data => Object.values(data).every(Boolean), {
    message: 'Totes les tasques del checklist han de ser completades.',
    path: ['consoleGeneralCleaning'], // Show error on the first item
  }),
  verification: z.object({
    startupOk: z.boolean().default(false),
    screenOk: z.boolean().default(false),
    printerOk: z.boolean().default(false),
    validationOk: z.boolean().default(false),
    communicationOk: z.boolean().default(false),
  }).refine(data => Object.values(data).every(Boolean), {
    message: 'Totes les verificacions han de ser completades.',
    path: ['startupOk'], // Show error on the first item
  }),
  observations: z.object({
    startTime: z.string().min(1, 'L\'hora d\'inici és obligatòria.'),
    endTime: z.string().min(1, 'L\'hora de fi és obligatòria.'),
    notes: z.string().optional(),
    hasIncident: z.boolean().default(false),
    correctiveAction: z
      .object({
        title: z.string().min(1, 'El títol és obligatori.'),
        description: z.string().min(1, 'La descripció és obligatòria.'),
        priority: z.enum(['Baixa', 'Mitjana', 'Alta']),
      })
      .optional(),
    technicianSignature: z.string().min(1, 'La firma del tècnic és obligatòria.'),
    supervisorSignature: z.string().optional(),
    beforePhotos: z.array(z.string()).optional(),
    afterPhotos: z.array(z.string()).optional(),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
