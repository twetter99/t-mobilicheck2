import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { FormValuesMagneticas } from './schema';
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

// Helper para convertir Object URL a Base64
const loadImageFromSource = (source: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (source.startsWith('data:')) {
      resolve(source);
    } else if (source.startsWith('blob:')) {
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
  });
};

export const generateMagneticasPdf = async (data: FormValuesMagneticas, task: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 14;
  let yPos = 20;

  // Función para agregar encabezado con logo naranja
  const addHeader = () => {
    doc.setFillColor(255, 140, 0); // Naranja
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('T-MobiliCheck', margin, 12);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Ordre de Manteniment Preventiu - Validadores Magnètiques', margin, 20);
    
    doc.setTextColor(0, 0, 0);
    yPos = 35;
  };

  // Función para agregar pie de página
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const footerText = `Document generat automàticament per T-MobiliCheck. Pàgina ${pageNum} de ${totalPages}`;
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
    
    // Timestamp
    const timestamp = `Generat el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ca })}`;
    doc.text(timestamp, margin, pageHeight - 10);
  };

  // Verificar si necesitamos nueva página
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      doc.addPage();
      addHeader();
      yPos = 35;
    }
  };

  // ============ PÁGINA 1: Header + Secciones 1-3 ============
  addHeader();

  // SECCIÓN 1: Dades de la Intervenció
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 140, 0);
  doc.text('1. DADES DE LA INTERVENCIÓ', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const datosIntervencion = [
    ['Contracte:', data.datosIntervencion.contrato],
    ['Operador:', data.datosIntervencion.operador],
    ['Estació/Ubicació:', data.datosIntervencion.estacion],
    ['Nº Validadora:', data.datosIntervencion.numeroValidadora],
    ['Matrícula:', data.datosIntervencion.matricula || 'N/A'],
    ['Tècnic:', data.datosIntervencion.tecnico],
    ['Data:', format(data.datosIntervencion.data, 'dd/MM/yyyy', { locale: ca })],
    ['Hora Programada:', data.datosIntervencion.horaProgramada],
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: datosIntervencion,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;
  checkPageBreak(40);

  // SECCIÓN 2: Inventari i Versions
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 140, 0);
  doc.text('2. INVENTARI I VERSIONS', margin, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const inventario = [
    ['Model Validadora:', data.inventarioVersiones.modelValidadora],
    ['Número de Sèrie:', data.inventarioVersiones.numeroSerie],
    ['Versió Firmware:', data.inventarioVersiones.versionFirmware],
    ['Versió Software:', data.inventarioVersiones.versionSoftware],
    ['Última Actualització:', format(data.inventarioVersiones.ultimaActualizacion, 'dd/MM/yyyy', { locale: ca })],
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: inventario,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;
  checkPageBreak(60);

  // SECCIÓN 3: Tasques de Manteniment (Checklist PPT 2.1.2)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 140, 0);
  doc.text('3. TASQUES DE MANTENIMENT (PPT 2.1.2)', margin, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Organizado por fases según PPT 2.1.2
  const checklist = [
    // FASE 1: Intervenció
    ['FASE', 'Fase 1: Intervenció'],
    [data.tareasMantenimiento["Desmuntatge de la validadora del vehicle"] ? CHECK_MARK : '\u2610', 'Desmuntatge de la validadora del vehicle'],
    
    // FASE 2: Taller
    ['FASE', 'Fase 2: Taller'],
    [data.tareasMantenimiento["Neteja interna de la validadora (pols)"] ? CHECK_MARK : '\u2610', 'Neteja interna de la validadora (pols)'],
    [data.tareasMantenimiento["Neteja externa de la validadora"] ? CHECK_MARK : '\u2610', 'Neteja externa de la validadora'],
    [data.tareasMantenimiento["Neteja de vies de pas de bitllets"] ? CHECK_MARK : '\u2610', 'Neteja de vies de pas de bitllets'],
    [data.tareasMantenimiento["Neteja de fotocèl·lules"] ? CHECK_MARK : '\u2610', 'Neteja de fotocèl·lules'],
    [data.tareasMantenimiento["Verificació i ajust de rodets de pressió del capçal magnètic"] ? CHECK_MARK : '\u2610', 'Verificació i ajust de rodets de pressió del capçal magnètic'],
    [data.tareasMantenimiento["Verificació/substitució del capçal magnètic"] ? CHECK_MARK : '\u2610', 'Verificació/substitució del capçal magnètic'],
    [data.tareasMantenimiento["Comprovació de tensió de corretges"] ? CHECK_MARK : '\u2610', 'Comprovació de tensió de corretges'],
    [data.tareasMantenimiento["Verificació i apreto de cargols de subjecció de motors"] ? CHECK_MARK : '\u2610', 'Verificació i apreto de cargols de subjecció de motors'],
    [data.tareasMantenimiento["Substitució preventiva de peces desgastades (si escau)"] ? CHECK_MARK : '\u2610', 'Substitució preventiva de peces desgastades (si escau)'],
    
    // FASE 3: Tancament Vehicle
    ['FASE', 'Fase 3: Tancament Vehicle'],
    [data.tareasMantenimiento["Restitució de l'equip al vehicle"] ? CHECK_MARK : '\u2610', "Restitució de l'equip al vehicle"],
    [data.tareasMantenimiento["Comprovació de comunicació amb sistema embarcat"] ? CHECK_MARK : '\u2610', 'Comprovació de comunicació amb sistema embarcat'],
    [data.tareasMantenimiento["Verificació a bord (Test d'explotació)"] ? CHECK_MARK : '\u2610', "Verificació a bord (Test d'explotació)"],
    [data.tareasMantenimiento["Obtenció i adjunció del justificant de test"] ? CHECK_MARK : '\u2610', 'Obtenció i adjunció del justificant de test'],
    
    // FASE 4: Documentació
    ['FASE', 'Fase 4: Documentació'],
    [data.tareasMantenimiento["Registre fotogràfic realitzat"] ? CHECK_MARK : '\u2610', 'Registre fotogràfic realitzat'],
    [data.tareasMantenimiento["Documentació tècnica actualitzada"] ? CHECK_MARK : '\u2610', 'Documentació tècnica actualitzada'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: checklist,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 160 }
    },
    didParseCell: (data: any) => {
      // Resaltar encabezados de fase
      if (data.cell.raw === 'FASE') {
        data.cell.styles.fillColor = [255, 140, 0];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 10;
      }
    },
    margin: { left: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;
  checkPageBreak(40);

  // SECCIÓN 4: Peces Substituïdes
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 140, 0);
  doc.text('4. PECES SUBSTITUÏDES', margin, yPos);
  yPos += 8;

  if (data.piezasSustituidas.length > 0) {
    const piezasData = data.piezasSustituidas.map(p => [
      p.descripcion,
      p.referencia,
      p.cantidad.toString(),
      p.motivo
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Descripció', 'Referència', 'Quantitat', 'Motiu']],
      body: piezasData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [255, 140, 0], textColor: 255 },
      margin: { left: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('No s\'han substituït peces durant aquesta intervenció', margin, yPos);
    yPos += 10;
  }

  checkPageBreak(60);

  // SECCIÓN 5: Incidències i Tancament (PPT)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 140, 0);
  doc.text('5. INCIDÈNCIES I TANCAMENT', margin, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const observaciones = [
    ['Hora Inici:', data.observacionesTancament.horaInicio],
    ['Hora Fi:', data.observacionesTancament.horaFin],
    ['Temps Total:', data.observacionesTancament.tiempoTotal || 'N/A'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: observaciones,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  if (data.observacionesTancament.observacionesGenerales) {
    doc.setFont('helvetica', 'bold');
    doc.text('Incidències Ocorregudes (PPT):', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(data.observacionesTancament.observacionesGenerales, pageWidth - 2 * margin);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 5 + 8;
  }

  checkPageBreak(40);

  // Incidencias
  if (data.observacionesTancament.tieneIncidencia && data.observacionesTancament.incidencia) {
    doc.setFillColor(255, 235, 205);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 69, 0);
    doc.text('⚠ INCIDÈNCIA DETECTADA', margin + 2, yPos);
    yPos += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const incidencia = [
      ['Títol:', data.observacionesTancament.incidencia.titulo],
      ['Prioritat:', data.observacionesTancament.incidencia.prioridad],
      ['Generar OT Correctiva:', data.observacionesTancament.incidencia.generarOrdenCorrectiva ? 'SÍ' : 'NO'],
    ];

    doc.autoTable({
      startY: yPos,
      head: [],
      body: incidencia,
      theme: 'grid',
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
      margin: { left: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Descripció:', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(data.observacionesTancament.incidencia.descripcion, pageWidth - 2 * margin);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 5 + 10;
  }

  // SECCIÓN 6: Adjunts (Fotografies) - Nueva página
  if (data.adjuntos.fotografias.length > 0) {
    doc.addPage();
    addHeader();
    yPos = 35;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 140, 0);
    doc.text('6. ADJUNTS - FOTOGRAFIES', margin, yPos);
    yPos += 10;

    const imageWidth = 55;
    const imageHeight = 45;
    const spacing = 5;
    const imagesPerRow = 3;

    for (let i = 0; i < data.adjuntos.fotografias.length; i++) {
      try {
        const imageData = await loadImageFromSource(data.adjuntos.fotografias[i]);
        
        const col = i % imagesPerRow;
        const row = Math.floor(i / imagesPerRow);
        
        const xPos = margin + col * (imageWidth + spacing);
        let currentYPos = yPos + row * (imageHeight + spacing);
        
        if (currentYPos + imageHeight > pageHeight - 30) {
          doc.addPage();
          addHeader();
          yPos = 35;
          currentYPos = yPos;
        }
        
        doc.addImage(imageData, 'JPEG', xPos, currentYPos, imageWidth, imageHeight);
        
        // Número de foto
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Foto ${i + 1}`, xPos, currentYPos + imageHeight + 3);
        doc.setTextColor(0, 0, 0);
        
        if (col === imagesPerRow - 1 || i === data.adjuntos.fotografias.length - 1) {
          yPos = currentYPos + imageHeight + 8;
        }
      } catch (error) {
        console.error('Error loading image for PDF:', error);
      }
    }
  }

  // Agregar firma digital y sello
  const totalPages = doc.internal.pages.length - 1; // -1 porque el array incluye una página vacía al inicio
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Generar nombre de archivo: OMP_VALMAG-C4-[NºValidadora]_[AAAAMMDD_HHMM].pdf
  const numeroValidadora = data.datosIntervencion.numeroValidadora.replace(/[^a-zA-Z0-9]/g, '-');
  const timestamp = format(new Date(), 'yyyyMMdd_HHmm');
  const filename = `OMP_VALMAG-C4-${numeroValidadora}_${timestamp}.pdf`;

  // Descargar PDF
  doc.save(filename);
};
