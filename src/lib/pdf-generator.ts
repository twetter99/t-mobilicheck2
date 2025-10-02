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

export const generateMaintenancePdf = (data: FormValues) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title
  doc.setFontSize(18);
  doc.text('Orden de Mantenimiento Preventivo Trimestral', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(12);
  doc.text('Lote 1 – Sistema T‑Mobilitat', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Section 1: Header
  doc.setFontSize(14);
  doc.text('Sección 1: Encabezado', 14, yPos);
  yPos += 8;

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
  yPos = (doc as any).lastAutoTable.finalY + 15;


  // Section 2: Inventory
  if (yPos > pageHeight - 40) { yPos = 20; doc.addPage(); }
  doc.setFontSize(14);
  doc.text('Sección 2: Inventario y Versiones', 14, yPos);
  yPos += 8;

  doc.autoTable({
    startY: yPos,
    head: [['Componente', 'Número de Serie / Versión']],
    body: [
        { content: 'Inventario Central', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Pupitre Serie', data.inventory.consoleSerial],
        ['Soporte Pupitre', data.inventory.consoleMount],
        ['SW Pupitre', data.inventory.consoleSoftware],
        ['Versión Config.', data.inventory.configVersion],
        ['Versión Telecarga', data.inventory.telechargeVersion],
        { content: 'Validación y Consulta', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Validadora IN 1 Serie', data.inventory.valIn1Serial],
        ['Validadora IN 2 Serie', data.inventory.valIn2Serial],
        ['Validadora OUT 1 Serie', data.inventory.valOut1Serial],
        ['Validadora OUT 2 Serie', data.inventory.valOut2Serial],
        ['Validadora OUT 3 Serie', data.inventory.valOut3Serial],
        ['Validadora OUT 4 Serie', data.inventory.valOut4Serial],
        ['Terminal de Consulta Serie', data.inventory.queryTerminalSerial],
        { content: 'Infraestructura', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Placa de Conexiones Serie', data.inventory.connectionsPlateSerial],
        ['Switch Serie', data.inventory.switchSerial],
        ['MCC Serie', data.inventory.mccSerial],
        ['Antena Tribanda Serie', data.inventory.triBandAntennaSerial],
        { content: 'Sistemas Legacy', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Validadora Magnética 1', `${data.inventory.legacyMag1Brand} - ${data.inventory.legacyMag1Serial}`],
        ['Validadora Magnética 2', `${data.inventory.legacyMag2Brand} - ${data.inventory.legacyMag2Serial}`],
    ].filter(row => Array.isArray(row) ? row[1] : true), // Filter out empty rows, keep headers
    theme: 'grid',
    styles: { fontSize: 10 },
    didParseCell: function (data) {
        if (typeof data.cell.raw === 'object' && data.cell.raw.content) {
            data.cell.text = data.cell.raw.content;
            data.cell.styles.halign = 'center';
            data.cell.colSpan = 2;
        }
    }
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;


  // Section 3 & 4: Checklist & Verification
  if (yPos > pageHeight - 80) { yPos = 20; doc.addPage(); }
  
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
  yPos = (doc as any).lastAutoTable.finalY + 15;


  // Section 5: Observations & Closing
  if (yPos > pageHeight - 40) { yPos = 20; doc.addPage(); }
  doc.setFontSize(14);
  doc.text('Sección 5: Observaciones y Cierre', 14, yPos);
  yPos += 8;

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
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      didParseCell: function (hookData) {
        if (hookData.cell.raw === 'Observaciones' || hookData.cell.raw === 'Descripción') {
            hookData.cell.styles.cellWidth = 'wrap';
        }
      }
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Signatures
  if (yPos > pageHeight - 60) { yPos = 20; doc.addPage(); }
  doc.setFontSize(12);
  doc.text('Firmas:', 14, yPos);
  yPos += 10;
  
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
  doc.rect(pageWidth - signatureWidth - 14, signatureY, signatureWidth, signatureHeight);
  if (data.observations.supervisorSignature) {
    doc.text('Firmado Digitalmente', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  } else {
    doc.text('Firma Opcional', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Responsable', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });


  // Save the PDF
  doc.save(`OMP_${data.header.busNumber}_${format(data.header.date, 'yyyyMMdd')}.pdf`);
};
