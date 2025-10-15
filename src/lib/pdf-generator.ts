import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { FormValues } from './schema';
import { data as staticData } from './data';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

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
  doc.text('Ordre de Manteniment Preventiu Trimestral', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(12);
  doc.text('Lot 1 – Sistema T‑Mobilitat', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Section 1: Header
  doc.setFontSize(14);
  doc.text('Secció 1: Capçalera', 14, yPos);
  yPos += 8;

  const operatorName = staticData.operadores.find(op => op.id === data.header.operator)?.nombre || data.header.operator;

  doc.autoTable({
    startY: yPos,
    body: [
      ['Operador', operatorName, 'Cotxera', data.header.depot],
      ['Nº Bus / Calca', data.header.busNumber, 'Matrícula', data.header.licensePlate],
      ['Tècnic', data.header.technician, 'Data', format(data.header.date, 'PPP', { locale: ca })],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;


  // Section 2: Inventory
  if (yPos > pageHeight - 40) { yPos = 20; doc.addPage(); }
  doc.setFontSize(14);
  doc.text('Secció 2: Inventari i Versions', 14, yPos);
  yPos += 8;

  doc.autoTable({
    startY: yPos,
    head: [['Component', 'Número de Sèrie / Versió']],
    body: [
        { content: 'Inventari Central', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Pupitre Sèrie', data.inventory.consoleSerial],
        ['Suport Pupitre', data.inventory.consoleMount],
        ['SW Pupitre', data.inventory.consoleSoftware],
        ['Versió Config.', data.inventory.configVersion],
        ['Versió Telecàrrega', data.inventory.telechargeVersion],
        { content: 'Validació i Consulta', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Validadora IN 1 Sèrie', data.inventory.valIn1Serial],
        ['Validadora IN 2 Sèrie', data.inventory.valIn2Serial],
        ['Validadora OUT 1 Sèrie', data.inventory.valOut1Serial],
        ['Validadora OUT 2 Sèrie', data.inventory.valOut2Serial],
        ['Validadora OUT 3 Sèrie', data.inventory.valOut3Serial],
        ['Validadora OUT 4 Sèrie', data.inventory.valOut4Serial],
        ['Terminal de Consulta Sèrie', data.inventory.queryTerminalSerial],
        { content: 'Infraestructura', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Placa de Connexions Sèrie', data.inventory.connectionsPlateSerial],
        ['Switch Sèrie', data.inventory.switchSerial],
        ['MCC Sèrie', data.inventory.mccSerial],
        ['Antena Tribanda Sèrie', data.inventory.triBandAntennaSerial],
        { content: 'Sistemes Legacy', styles: { fontStyle: 'bold', fillColor: '#f0f3f4' } },
        ['Validadora Magnètica 1', `${data.inventory.legacyMag1Brand} - ${data.inventory.legacyMag1Serial}`],
        ['Validadora Magnètica 2', `${data.inventory.legacyMag2Brand} - ${data.inventory.legacyMag2Serial}`],
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
      { content: 'Secció 3: Checklist d\'Execució', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
      ['Neteja General (Pupitre)', data.checklist.consoleGeneralCleaning ? CHECK_MARK : CROSS_MARK],
      ['Neteja d\'Autocutter', data.checklist.consoleAutocutterCleaning ? CHECK_MARK : CROSS_MARK],
      ['Registre de Sèrie (Pupitre)', data.checklist.consoleSerialRegistration ? CHECK_MARK : CROSS_MARK],
      ['Neteja General (Validadora)', data.checklist.validatorGeneralCleaning ? CHECK_MARK : CROSS_MARK],
      ['Neteja de Connectors (Validadora)', data.checklist.validatorConnectorsCleaning ? CHECK_MARK : CROSS_MARK],
      ['Registre de Sèries (Validadora)', data.checklist.validatorSerialRegistration ? CHECK_MARK : CROSS_MARK],
      { content: 'Secció 4: Verificació Funcional', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
      ['Arrencada del sistema', data.verification.startupOk ? CHECK_MARK : CROSS_MARK],
      ['Pantalla del pupitre', data.verification.screenOk ? CHECK_MARK : CROSS_MARK],
      ['Impressora de pupitre', data.verification.printerOk ? CHECK_MARK : CROSS_MARK],
      ['Validació de títols', data.verification.validationOk ? CHECK_MARK : CROSS_MARK],
      ['Comunicació amb el centre', data.verification.communicationOk ? CHECK_MARK : CROSS_MARK],
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Tasca', 'Completat']],
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
  doc.text('Secció 5: Observacions i Tancament', 14, yPos);
  yPos += 8;

  const observationsBody: any[] = [
      ['Hora Inici', data.observations.startTime],
      ['Hora Fi', data.observations.endTime],
  ];

  if (data.observations.notes) {
    observationsBody.push(['Observacions', data.observations.notes]);
  }
  
  if (data.observations.hasIncident && data.observations.correctiveAction) {
    observationsBody.push(
        { content: 'OT Correctiu', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } }
    );
    observationsBody.push(['Títol Incidència', data.observations.correctiveAction.title]);
    observationsBody.push(['Descripció', data.observations.correctiveAction.description]);
    observationsBody.push(['Prioritat', data.observations.correctiveAction.priority]);
  }

  doc.autoTable({
      startY: yPos,
      body: observationsBody,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      didParseCell: function (hookData) {
        if (hookData.cell.raw === 'Observacions' || hookData.cell.raw === 'Descripció') {
            hookData.cell.styles.cellWidth = 'wrap';
        }
      }
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Signatures
  if (yPos > pageHeight - 60) { yPos = 20; doc.addPage(); }
  doc.setFontSize(12);
  doc.text('Firmes:', 14, yPos);
  yPos += 10;
  
  const signatureY = yPos;
  const signatureWidth = 80;
  const signatureHeight = 30;

  // Technician Signature
  doc.rect(14, signatureY, signatureWidth, signatureHeight);
  doc.setFontSize(10);
  if (data.observations.technicianSignature) {
    doc.text('Signat Digitalment', 14 + signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Tècnic', 14 + signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });

  // Supervisor Signature
  doc.rect(pageWidth - signatureWidth - 14, signatureY, signatureWidth, signatureHeight);
  if (data.observations.supervisorSignature) {
    doc.text('Signat Digitalment', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  } else {
    doc.text('Firma Opcional', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Firma del Responsable', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });


  // Save the PDF
  doc.save(`OMP_${data.header.busNumber}_${format(data.header.date, 'yyyyMMdd')}.pdf`);
};
