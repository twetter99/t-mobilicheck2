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

// Helper para convertir Object URL o PhotoData a formato compatible con jsPDF
const loadImageFromSource = (source: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Si es un string (Base64 o Object URL)
    if (typeof source === 'string') {
      if (source.startsWith('data:')) {
        // Ya es Base64
        resolve(source);
      } else if (source.startsWith('blob:')) {
        // Es Object URL, necesitamos convertirlo
        fetch(source)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
          .catch(reject);
      } else {
        resolve(source);
      }
    } 
    // Si es PhotoData con url
    else if (source && source.url) {
      loadImageFromSource(source.url).then(resolve).catch(reject);
    } 
    else {
      reject(new Error('Invalid image source'));
    }
  });
};

// Helper para agregar fotos al PDF
const addPhotosSection = async (
  doc: jsPDF, 
  yPos: number, 
  title: string, 
  photos: any[]
): Promise<number> => {
  if (!photos || photos.length === 0) return yPos;

  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const margin = 14;
  const imageWidth = 50;
  const imageHeight = 40;
  const spacing = 5;
  const imagesPerRow = 3;

  // Agregar título de sección
  doc.setFontSize(12);
  doc.text(title, margin, yPos);
  yPos += 8;

  for (let i = 0; i < photos.length; i++) {
    try {
      // Convertir la foto a Base64 si es necesario
      const imageData = await loadImageFromSource(photos[i]);
      
      const col = i % imagesPerRow;
      const row = Math.floor(i / imagesPerRow);
      
      const xPos = margin + col * (imageWidth + spacing);
      let currentYPos = yPos + row * (imageHeight + spacing);
      
      // Verificar si necesitamos una nueva página
      if (currentYPos + imageHeight > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        currentYPos = yPos;
      }
      
      // Agregar imagen al PDF
      doc.addImage(imageData, 'JPEG', xPos, currentYPos, imageWidth, imageHeight);
      
      // Actualizar yPos para la siguiente fila
      if (col === imagesPerRow - 1 || i === photos.length - 1) {
        yPos = currentYPos + imageHeight + spacing;
      }
    } catch (error) {
      console.error('Error loading image for PDF:', error);
      // Continuar con la siguiente imagen
    }
  }

  return yPos + 5;
};

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  let yPos = 20;
  doc.setFontSize(18);
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(12);
  doc.text('Lot 1 – Sistema T‑Mobilitat', pageWidth / 2, yPos, { align: 'center' });
  return 40; // Return Y position for next element
};

const addFooter = (doc: jsPDF) => {
    const pageCount = doc.internal.pages.length - 1;
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Document generat automàticament per la plataforma de gestió d'instal·lacions T-MobiliCheck.`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Pàgina ${i} de ${pageCount}`, pageWidth - 20, pageHeight - 10);
    }
};

const addSectionHeader = (doc: jsPDF, yPos: number, title: string) => {
  doc.setFontSize(14);
  doc.text(title, 14, yPos);
  return yPos + 8;
};


export const generateInstallationPdf = async (data: FormValues, revision: any) => {
  const doc = new jsPDF();
  let yPos = addHeader(doc, `Informe d'${revision.tipo}`);

  // Section 1: Header
  yPos = addSectionHeader(doc, yPos, 'Secció 1: Informació de la Intervenció');

  const operatorName = staticData.operadores.find(op => op.id === data.header.operator)?.nombre || data.header.operator;

  doc.autoTable({
    startY: yPos,
    body: [
      ['Nº Ordre', data.header.orderNumber || revision.id, 'Prioritat', revision.prioridad],
      ['Operador', operatorName, 'Cotxera', data.header.depot],
      ['Nº Bus / Calca', data.header.busNumber, 'Matrícula', data.header.licensePlate],
      ['Tècnic', data.header.technician, 'Data', format(data.header.date, 'PPP', { locale: ca })],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Section 2: Inventory
  yPos = addSectionHeader(doc, yPos, "Secció 2: Inventari de Maquinari");
  
  const inventoryBody = [
    { content: 'Equipament Central', colSpan: 4, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
    ['Pupitre', data.inventory.consoleSerial, '', ''],
    ['MCC Pupitre', data.inventory.mccSerial, '', ''],
    ['Switch', data.inventory.switchSerial, '', ''],
    ["Kit d'Instal·lació", data.inventory.installationKitSerial, '', ''],
    ['Suport de Pupitre', data.inventory.consoleMount, '', ''],
    { content: 'Validadors (SC) i Terminal de Consulta (TC)', colSpan: 4, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
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
    head: [['Component', 'N/S Equip', 'N/S Suport', 'Device Code']],
    body: inventoryBody,
    theme: 'grid',
    styles: { fontSize: 9 },
    didParseCell: function (data: any) {
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
  yPos = addSectionHeader(doc, yPos, 'Secció 3: Programari i Configuració');
  doc.autoTable({
      startY: yPos,
      body: [
          ['Versió SW Pupitre', data.software.consoleSoftware],
          ['Versió de Telecàrrega', data.software.telechargeVersion],
          ['Versió de Configuració', data.software.configVersion],
      ].filter(row => row[1]),
      theme: 'grid',
      styles: { fontSize: 10 }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 5: Execution Phases
  yPos = addSectionHeader(doc, yPos, "Secció 5: Fases d'Execució");
  const executionBody = Object.entries(data.executionPhases).map(([key, value]) => {
      const labels: Record<string, string> = {
          preliminaryCheck: "Comprovació de preinstal·lació",
          preexistingSystemsCheck: "Verificació sistemes preexistents",
          connectionPlateInstallation: "Instal·lació Placa de Connexions",
          antennaInstallation: "Instal·lació d'Antena",
          mccInstallation: "Instal·lació del MCC",
          consoleSupportInstallation: "Muntatge Suport Pupitre",
          consoleInstallation: "Instal·lació i connexió del Pupitre",
          validatorSupportInstallation: "Muntatge suports validadores",
          finalCheck: "Comprovació final d'instal·lació",
          softwareUpdate: "Actualització de Programari/Config",
          functionalTests: "Proves funcionals",
      };
      return [labels[key] || key, value];
  });
  
  doc.autoTable({
      startY: yPos,
      head: [['Fase', 'Resultat']],
      body: executionBody,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center', cellWidth: 30 } }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Section 6: Closing
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  if (yPos > pageHeight - 80) { yPos = 20; doc.addPage(); }
  
  yPos = addSectionHeader(doc, yPos, "Secció 6: Tancament de l'Operació");
  const closingBody: any[] = [
    ['Hora Inici', data.observations.startTime],
    ['Hora Fi', data.observations.endTime],
  ];

  if (data.observations.notes) {
    closingBody.push(['Observacions', data.observations.notes]);
  }
  
  if (data.observations.hasIncident && data.observations.correctiveAction) {
    closingBody.push({ content: 'OT Correctiu Generat', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } });
    closingBody.push(['Títol Incidència', data.observations.correctiveAction.title]);
    closingBody.push(['Descripció', data.observations.correctiveAction.description]);
    closingBody.push(['Prioritat', data.observations.correctiveAction.priority]);
  }
  
  doc.autoTable({
      startY: yPos,
      body: closingBody,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      didParseCell: function (hookData: any) {
        if (hookData.cell.raw === 'Observacions' || hookData.cell.raw === 'Descripció') {
            hookData.cell.styles.cellWidth = 'wrap';
        }
      }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add photos if available
  if (data.observations.beforePhotos && data.observations.beforePhotos.length > 0) {
    if (yPos > 240) { yPos = 20; doc.addPage(); }
    yPos = await addPhotosSection(doc, yPos, 'Fotos ABANS:', data.observations.beforePhotos);
  }

  if (data.observations.afterPhotos && data.observations.afterPhotos.length > 0) {
    if (yPos > 240) { yPos = 20; doc.addPage(); }
    yPos = await addPhotosSection(doc, yPos, 'Fotos DESPRÉS:', data.observations.afterPhotos);
  }
  
  // Signatures
  doc.text('Signatures:', 14, yPos);
  yPos += 8;
  
  const signatureY = yPos;
  const signatureWidth = 80;
  const signatureHeight = 30;

  // Technician Signature
  doc.rect(14, signatureY, signatureWidth, signatureHeight);
  doc.setFontSize(10);
  if (data.observations.technicianSignature) {
    doc.text('Signat Digitalment', 14 + signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Signatura del Tècnic', 14 + signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });

  // Supervisor Signature
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  doc.rect(pageWidth - signatureWidth - 14, signatureY, signatureWidth, signatureHeight);
  if (data.observations.supervisorSignature) {
    doc.text('Signat Digitalment', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  } else {
    doc.text('', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Signatura del Responsable', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });
  
  // Add footer to all pages
  addFooter(doc);

  // Save the PDF
  doc.save(`Informe_${revision.tipo}_${data.header.busNumber}_${format(data.header.date, 'yyyyMMdd')}.pdf`);
};



export const generateMaintenancePdf = async (data: FormValues) => {
  const doc = new jsPDF();
  let yPos = addHeader(doc, 'Ordre de Manteniment Preventiu Trimestral');

  // Section 1: Header
  yPos = addSectionHeader(doc, yPos, 'Secció 1: Capçalera');

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
  yPos = (doc as any).lastAutoTable.finalY + 10;


  // Section 2: Inventory
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  yPos = addSectionHeader(doc, yPos, 'Secció 2: Inventari i Versions');
  
  const inventoryBody = [
    { content: 'Maquinari i Programari', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
    ['Pupitre Sèrie', data.inventory.consoleSerial],
    ['Suport Pupitre', data.inventory.consoleMount],
    ['SW Pupitre', data.software.consoleSoftware],
    ['Versió Config.', data.software.configVersion],
    ['Versió Telecàrrega', data.software.telechargeVersion],
  ].filter(row => Array.isArray(row) ? row[1] : true);
  
  doc.autoTable({
    startY: yPos,
    head: [['Component', 'Número de Sèrie / Versió']],
    body: inventoryBody,
    theme: 'grid',
    styles: { fontSize: 10 },
    didParseCell: function (data: any) {
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
      { content: "Secció 3: Llista de Verificació d'Execució", colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#f0f3f4', halign: 'center' } },
      ['Neteja General (Pupitre)', data.checklist.consoleGeneralCleaning ? CHECK_MARK : CROSS_MARK],
      ["Neteja d'Autocutter", data.checklist.consoleAutocutterCleaning ? CHECK_MARK : CROSS_MARK],
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
  yPos = (doc as any).lastAutoTable.finalY + 10;


  // Section 5: Observations & Closing
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  yPos = addSectionHeader(doc, yPos, 'Secció 5: Observacions i Tancament');

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
      styles: { fontSize: 10, cellPadding: 2 },
      didParseCell: function (hookData: any) {
        if (hookData.cell.raw === 'Observacions' || hookData.cell.raw === 'Descripció') {
            hookData.cell.styles.cellWidth = 'wrap';
        }
      }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add photos if available
  if (data.observations.beforePhotos && data.observations.beforePhotos.length > 0) {
    if (yPos > 240) { yPos = 20; doc.addPage(); }
    yPos = await addPhotosSection(doc, yPos, 'Fotos ABANS:', data.observations.beforePhotos);
  }

  if (data.observations.afterPhotos && data.observations.afterPhotos.length > 0) {
    if (yPos > 240) { yPos = 20; doc.addPage(); }
    yPos = await addPhotosSection(doc, yPos, 'Fotos DESPRÉS:', data.observations.afterPhotos);
  }

  // Signatures
  if (yPos > 240) { yPos = 20; doc.addPage(); }
  doc.text('Signatures:', 14, yPos);
  yPos += 8;
  
  const signatureY = yPos;
  const signatureWidth = 80;
  const signatureHeight = 30;
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  // Technician Signature
  doc.rect(14, signatureY, signatureWidth, signatureHeight);
  doc.setFontSize(10);
  if (data.observations.technicianSignature) {
    doc.text('Signat Digitalment', 14 + signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Signatura del Tècnic', 14 + signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });

  // Supervisor Signature
  doc.rect(pageWidth - signatureWidth - 14, signatureY, signatureWidth, signatureHeight);
  if (data.observations.supervisorSignature) {
    doc.text('Signat Digitalment', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  } else {
    doc.text('', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight / 2, { align: 'center' });
  }
  doc.text('Signatura del Responsable', pageWidth - 14 - signatureWidth / 2, signatureY + signatureHeight + 5, { align: 'center' });


  // Add footer to all pages
  addFooter(doc);

  // Save the PDF
  doc.save(`OMP_${data.header.busNumber}_${format(data.header.date, 'yyyyMMdd')}.pdf`);
};
