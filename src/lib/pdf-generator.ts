import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { FormValues } from './schema';
import { data as staticData } from './data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const CHECK_MARK = '\u2713'; // ✓
const CROSS_MARK = '\u2717'; // ✗

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  let yPos = 20;
  doc.setFontSize(18);
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(12);
  doc.text('Lote 1 – Sistema T‑Mobilitat', pageWidth / 2, yPos, { align: 'center' });
  return 40; // Return Y position for next element
};

const addFooter = (doc: jsPDF) => {
    const pageCount = doc.internal.pages.length - 1;
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Documento generado automáticamente por la plataforma de gestión de instalaciones T-MobiliCheck.`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, pageHeight - 10);
    }
};

const addSectionHeader = (doc: jsPDF, yPos: number, title: string) => {
  doc.setFontSize(14);
  doc.text(title, 14, yPos);
  return yPos + 8;
};


export const generateInstallationPdf = (data: FormValues, revision: any) => {
  const doc = new jsPDF();
  let yPos = addHeader(doc, `Informe de ${revision.tipo}`);

  // Section 1: Header
  yPos = addSectionHeader(doc, yPos, 'Sección 1: Información de la Intervención');

  const operatorName = staticData.operadores.find(op => op.id === data.header.operator)?.nombre || data.header.operator;

  doc.autoTable({
    startY: yPos,
    body: [
      ['Nº Orden', data.header.orderNumber || revision.id, 'Prioridad', revision.prioridad],
      ['Operador', operatorName, 'Cochera', data.header.depot],
      ['Nº Bus / Calca', data.header.busNumber, 'Matrícula', data.header.licensePlate],
      ['Técnico', data.header.technician, 'Fecha', format(data.header.date, 'PPP', { locale: es })],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Section 2: Inventory
  yPos = addSectionHeader(doc, yPos, 'Sección 2: Inventario de Hardware');
  
  const inventoryBody = [
    { content: 'Equipamiento Central', colSpan: 3, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
    ['Pupitre', data.inventory.consoleSerial, ''],
    ['MCC Pupitre', data.inventory.mccSerial, ''],
    ['Switch', data.inventory.switchSerial, ''],
    ['Kit de Instalación', data.inventory.installationKitSerial, ''],
    ['Soporte de Pupitre', data.inventory.consoleMount, ''],
    { content: 'Validadoras (SC) y Terminal de Consulta (TC)', colSpan: 3, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
    ['Dispositivo', 'N/S Equipo', 'N/S Soporte', 'Device Code'],
  ];

  const devices = ['sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc6', 'queryTerminal'];
  const deviceLabels: { [key: string]: string } = { sc1: 'Validadora SC1', sc2: 'Validadora SC2', sc3: 'Validadora SC3', sc4: 'Validadora SC4', sc5: 'Validadora SC5', sc6: 'Validadora SC6', queryTerminal: 'Terminal Consulta' };

  devices.forEach(d => {
    const serial = (data.inventory as any)[`${d}Serial`];
    const support = (data.inventory as any)[`${d}SupportSerial`];
    const deviceCode = (data.inventory as any)[`${d}DeviceCode`];
    if (serial || support || deviceCode) {
        inventoryBody.push([deviceLabels[d], serial, support, deviceCode]);
    }
  });

  doc.autoTable({
    startY: yPos,
    head: [['Componente', 'N/S Equipo', 'N/S Soporte', 'Device']],
    body: inventoryBody,
    theme: 'grid',
    styles: { fontSize: 9 },
    didParseCell: function (data) {
        if (typeof data.cell.raw === 'object' && data.cell.raw.content) {
            data.cell.text = data.cell.raw.content;
            if (data.cell.raw.colSpan) {
                data.cell.colSpan = data.cell.raw.colSpan;
            }
        }
    }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 3: Software
  yPos = addSectionHeader(doc, yPos, 'Sección 3: Software y Configuración');
  doc.autoTable({
      startY: yPos,
      body: [
          ['Versión SW Pupitre', data.software.consoleSoftware],
          ['Versión de Telecarga', data.software.telechargeVersion],
          ['Versión de Configuración', data.software.configVersion],
      ].filter(row => row[1]),
      theme: 'grid',
      styles: { fontSize: 10 }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 5: Execution Phases
  yPos = addSectionHeader(doc, yPos, 'Sección 5: Fases de Ejecución');
  const executionBody = Object.entries(data.executionPhases).map(([key, value]) => {
      const labels: Record<string, string> = {
          preliminaryCheck: "Comprobación de preinstalación",
          preexistingSystemsCheck: "Verificación sistemas preexistentes",
          connectionPlateInstallation: "Instalación Placa de Conexiones",
          antennaInstallation: "Instalación de Antena",
          mccInstallation: "Instalación del MCC",
          consoleSupportInstallation: "Montaje Soporte Pupitre",
          consoleInstallation: "Instalación y conexión del Pupitre",
          validatorSupportInstallation: "Montaje soportes validadoras",
          finalCheck: "Comprobación final de instalación",
          softwareUpdate: "Actualización de Software/Config",
          functionalTests: "Pruebas funcionales",
      };
      return [labels[key] || key, value];
  });
  
  doc.autoTable({
      startY: yPos,
      head: [['Fase', 'Resultado']],
      body: executionBody,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center', cellWidth: 30 } }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Section 6: Closing
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  if (yPos > pageHeight - 80) { yPos = 20; doc.addPage(); }
  
  yPos = addSectionHeader(doc, yPos, 'Sección 6: Cierre de la Operación');
  const closingBody: any[] = [
    ['Hora Inicio', data.observations.startTime],
    ['Hora Fin', data.observations.endTime],
  ];

  if (data.observations.notes) {
    closingBody.push(['Observaciones', data.observations.notes]);
  }
  
  if (data.observations.hasIncident && data.observations.correctiveAction) {
    closingBody.push({ content: 'OT Correctivo Generado', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } });
    closingBody.push(['Título Incidencia', data.observations.correctiveAction.title]);
    closingBody.push(['Descripción', data.observations.correctiveAction.description]);
    closingBody.push(['Prioridad', data.observations.correctiveAction.priority]);
  }
  
  doc.autoTable({
      startY: yPos,
      body: closingBody,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      didParseCell: function (hookData) {
        if (hookData.cell.raw === 'Observaciones' || hookData.cell.raw === 'Descripción') {
            hookData.cell.styles.cellWidth = 'wrap';
        }
      }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Signatures
  doc.text('Firmas:', 14, yPos);
  yPos += 8;
  
  const signatureY = yPos;
  const signatureWidth = 80;
  const signatureHeight = 30;

  // Technician Signature
  doc.rect(14, signatureY, signatureWidth, signatureHeight);
  doc.setFontSize(10);
  if (data.observations.technicianSignature) {
    doc.text('Firmado Digitalmente', 14 + signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Técnico', 14 + signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });

  // Supervisor Signature
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  doc.rect(pageWidth - signatureWidth - 14, signatureY, signatureWidth, signatureHeight);
  if (data.observations.supervisorSignature) {
    doc.text('Firmado Digitalmente', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  } else {
    doc.text('', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Responsable', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });
  
  // Add footer to all pages
  addFooter(doc);

  // Save the PDF
  doc.save(`Informe_${revision.tipo}_${data.header.busNumber}_${format(data.header.date, 'yyyyMMdd')}.pdf`);
};



export const generateMaintenancePdf = (data: FormValues) => {
  const doc = new jsPDF();
  let yPos = addHeader(doc, 'Orden de Mantenimiento Preventivo Trimestral');

  // Section 1: Header
  yPos = addSectionHeader(doc, yPos, 'Sección 1: Cabecera');

  const operatorName = staticData.operadores.find(op => op.id === data.header.operator)?.nombre || data.header.operator;

  doc.autoTable({
    startY: yPos,
    body: [
      ['Operador', operatorName, 'Cochera', data.header.depot],
      ['Nº Bus / Calca', data.header.busNumber, 'Matrícula', data.header.licensePlate],
      ['Técnico', data.header.technician, 'Fecha', format(data.header.date, 'PPP', { locale: es })],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;


  // Section 2: Inventory
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  yPos = addSectionHeader(doc, yPos, 'Sección 2: Inventario y Versiones');
  
  const inventoryBody = [
    { content: 'Hardware y Software', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
    ['Pupitre Serie', data.inventory.consoleSerial],
    ['Soporte Pupitre', data.inventory.consoleMount],
    ['SW Pupitre', data.software.consoleSoftware],
    ['Versión Config.', data.software.configVersion],
    ['Versión Telecarga', data.software.telechargeVersion],
  ].filter(row => Array.isArray(row) ? row[1] : true);
  
  doc.autoTable({
    startY: yPos,
    head: [['Componente', 'Número de Serie / Versión']],
    body: inventoryBody,
    theme: 'grid',
    styles: { fontSize: 10 },
    didParseCell: function (data) {
        if (typeof data.cell.raw === 'object' && data.cell.raw.content) {
            data.cell.text = data.cell.raw.content;
            if (data.cell.raw.colSpan) {
                data.cell.colSpan = data.cell.raw.colSpan;
            }
        }
    }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;


  // Section 3 & 4: Checklist & Verification
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  
  const checklistAndVerificationBody = [
      { content: 'Sección 3: Checklist de Ejecución', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
      ['Limpieza General (Pupitre)', data.checklist.consoleGeneralCleaning ? CHECK_MARK : CROSS_MARK],
      ['Limpieza de Autocutter', data.checklist.consoleAutocutterCleaning ? CHECK_MARK : CROSS_MARK],
      ['Registro de Serie (Pupitre)', data.checklist.consoleSerialRegistration ? CHECK_MARK : CROSS_MARK],
      ['Limpieza General (Validadora)', data.checklist.validatorGeneralCleaning ? CHECK_MARK : CROSS_MARK],
      ['Limpieza de Conectores (Validadora)', data.checklist.validatorConnectorsCleaning ? CHECK_MARK : CROSS_MARK],
      ['Registro de Series (Validadora)', data.checklist.validatorSerialRegistration ? CHECK_MARK : CROSS_MARK],
      { content: 'Sección 4: Verificación Funcional', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
      ['Arranque del sistema', data.verification.startupOk ? CHECK_MARK : CROSS_MARK],
      ['Pantalla del pupitre', data.verification.screenOk ? CHECK_MARK : CROSS_MARK],
      ['Impresora de pupitre', data.verification.printerOk ? CHECK_MARK : CROSS_MARK],
      ['Validación de títulos', data.verification.validationOk ? CHECK_MARK : CROSS_MARK],
      ['Comunicación con el centro', data.verification.communicationOk ? CHECK_MARK : CROSS_MARK],
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Tarea', 'Completado']],
    body: checklistAndVerificationBody,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'center', fontStyle: 'bold', cellWidth: 30 } },
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;


  // Section 5: Observations & Closing
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  yPos = addSectionHeader(doc, yPos, 'Sección 5: Observaciones y Cierre');

  const observationsBody: any[] = [
      ['Hora Inicio', data.observations.startTime],
      ['Hora Fin', data.observations.endTime],
  ];

  if (data.observations.notes) {
    observationsBody.push(['Observaciones', data.observations.notes]);
  }
  
  if (data.observations.hasIncident && data.observations.correctiveAction) {
    observationsBody.push(
        { content: 'OT Correctivo', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } }
    );
    observationsBody.push(['Título Incidencia', data.observations.correctiveAction.title]);
    observationsBody.push(['Descripción', data.observations.correctiveAction.description]);
    observationsBody.push(['Prioridad', data.observations.correctiveAction.priority]);
  }

  doc.autoTable({
      startY: yPos,
      body: observationsBody,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      didParseCell: function (hookData) {
        if (hookData.cell.raw === 'Observaciones' || hookData.cell.raw === 'Descripción') {
            hookData.cell.styles.cellWidth = 'wrap';
        }
      }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Signatures
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  doc.text('Firmas:', 14, yPos);
  yPos += 8;
  
  const signatureY = yPos;
  const signatureWidth = 80;
  const signatureHeight = 30;
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  // Technician Signature
  doc.rect(14, signatureY, signatureWidth, signatureHeight);
  doc.setFontSize(10);
  if (data.observations.technicianSignature) {
    doc.text('Firmado Digitalmente', 14 + signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Técnico', 14 + signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });

  // Supervisor Signature
  doc.rect(pageWidth - signatureWidth - 14, signatureY, signatureWidth, signatureHeight);
  if (data.observations.supervisorSignature) {
    doc.text('Firmado Digitalmente', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  } else {
    doc.text('', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Responsable', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });


  // Add footer to all pages
  addFooter(doc);

  // Save the PDF
  doc.save(`OMP_${data.header.busNumber}_${format(data.header.date, 'yyyyMMdd')}.pdf`);
};
