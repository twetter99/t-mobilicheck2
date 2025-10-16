import { z } from 'zod';

export const formSchema = z.object({
  header: z.object({
    orderNumber: z.string().optional(),
    operator: z.string().min(1, 'El operador es obligatorio.'),
    depot: z.string().min(1, 'La cochera es obligatoria.'),
    busNumber: z.string().min(1, 'El número de bus/calca es obligatorio.'),
    licensePlate: z.string().min(1, 'La matrícula es obligatoria.'),
    technician: z.string().min(1, 'El técnico es obligatorio.'),
    date: z.date({ required_error: 'La fecha es obligatoria.' }),
  }),
  inventory: z.object({
    consoleSerial: z.string().optional(),
    mccSerial: z.string().optional(),
    switchSerial: z.string().optional(),
    installationKitSerial: z.string().optional(),
    consoleMount: z.enum(['sin_brazo', 'brazo_corto', 'brazo_largo', 'simple_extraible'], {
      required_error: 'Debe seleccionar un tipo de soporte.',
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
    startTime: z.string().min(1, 'La hora de inicio es obligatoria.'),
    endTime: z.string().min(1, 'La hora de fin es obligatoria.'),
    notes: z.string().optional(),
    hasIncident: z.boolean().default(false),
    correctiveAction: z
      .object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['Baja', 'Media', 'Alta']),
      }).optional(),
    technicianSignature: z.string().min(1, 'La firma del técnico es obligatoria.'),
    supervisorSignature: z.string().optional(),
    beforePhotos: z.array(z.string()).optional().default([]),
    afterPhotos: z.array(z.string()).optional().default([]),
  }).refine(data => {
      if (data.hasIncident) {
        // If there's an incident, the correctiveAction object must exist and its fields must not be empty.
        return (
          !!data.correctiveAction &&
          data.correctiveAction.title.trim().length > 0 &&
          data.correctiveAction.description.trim().length > 0
        );
      }
      // If there's no incident, the validation passes.
      return true;
  }, {
      // This message will be shown if the refinement fails.
      message: 'Debe rellenar los detalles de la incidencia (título y descripción).',
      // We can specify the path to show the error message, for example on the title field.
      path: ['correctiveAction', 'title'],
  }),
});

export type FormValues = z.infer<typeof formSchema>;
