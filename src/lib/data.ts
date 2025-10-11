// Set a consistent date in the future for mock data
// Using January 2026 to match the provided schedule's context
const getFutureDate = (day: number, month: number = 0, year: number = 2026) => {
    // month is 0-indexed (0 for January)
    const date = new Date(Date.UTC(year, month, day, 21, 0, 0));
    return date.toISOString();
};


export const data = {
  "revisiones": [
    { 
      "id": "rev-trim-001", 
      "vehiculoId": "VEH-BAIXLLOB-201", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Trimestral", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-trim-002", 
      "vehiculoId": "VEH-BAIXLLOB-202", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Trimestral", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-trim-003", 
      "vehiculoId": "VEH-BAIXLLOB-203", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Trimestral", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-trim-004", 
      "vehiculoId": "VEH-BAIXLLOB-204", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Trimestral", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-001", 
      "vehiculoId": "VEH-BAIXLLOB-301", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Anual", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-002", 
      "vehiculoId": "VEH-BAIXLLOB-302", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Anual", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-003", 
      "vehiculoId": "VEH-BAIXLLOB-303", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Anual", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-004", 
      "vehiculoId": "VEH-BAIXLLOB-304", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Anual", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-002", 
      "vehiculoId": "VEH-ALSINA-300", 
      "operador": "ALSINA GRAELLS", 
      "tipo": "Semestral", 
      "hora": "09:00", 
      "fecha": getFutureDate(27, 0),
      "ubicacion": "Barcelona / Vilanova", 
      "duracionEstimada": "7h 45m", 
      "observaciones": "TORN DIÜRN - Mussols i nocturns" 
    },
  ],
  "operadores": [
    { "id": "op-01", "nombre": "ALSINA GRAELLS DE AUTO TRANSPORTES, SA" },
    { "id": "op-02", "nombre": "AUTOCARES JULIÀ, SL" },
    { "id": "op-03", "nombre": "AUTOCARS DEL PENEDÈS, SA" },
    { "id": "op-04", "nombre": "AUTOCARS PRAT, SA" },
    { "id": "op-05", "nombre": "AUTOCARS R. FONT, SAU" },
    { "id": "op-06", "nombre": "AUTOCARS VENDRELL, SL" },
    { "id": "op-07", "nombre": "AUTOCORB, SA" },
    { "id": "op-08", "nombre": "BUS CASTELLVI, SA" },
    { "id": "op-09", "nombre": "LA HISPANO DE FUENTE EN SEGURES SA" },
    { "id": "op-10", "nombre": "HISPANO LLACUNENSE, SL" },
    { "id": "op-11", "nombre": "MONTFERRI HERMANOS, SL" },
    { "id": "op-12", "nombre": "TRANSPORTS MIR" },
    { "id": "op-13", "nombre": "TUS, SCCL" },
    { "id": "op-14", "nombre": "UTE BAIX LLOBREGAT" },
    { "id": "op-15", "nombre": "CTSA-Mataró Bus (Avanza)" },
    { "id": "op-16", "nombre": "RubíBus CTSL (Avanza)" },
    { "id": "op-17", "nombre": "TMESA (Avanza)" },
    { "id": "op-18", "nombre": "MASATS TRANSPORTS GENERALS, SA (Direxis)" },
    { "id": "op-19", "nombre": "TRANSPORTES GENERALES DE OLESA, SA (Direxis)" },
    { "id": "op-20", "nombre": "TUSGSAL" },
    { "id": "op-21", "nombre": "CINTOI BUS, SL (Empresa Plana)" },
    { "id": "op-22", "nombre": "EMPRESA PLANA, SL" },
    { "id": "op-23", "nombre": "UTE HORTA I GRÀCIA (Monbus)" },
    { "id": "op-24", "nombre": "LA HISPANO IGUALADINA, SL (Monbus)" },
    { "id": "op-25", "nombre": "UTE Port (Monbus)" },
    { "id": "op-26", "nombre": "UTE SANT BOI, BARCELONA Y OTROS (Monbus)" },
    { "id": "op-27", "nombre": "EMPRESA CASAS, SA (Moventia)" },
    { "id": "op-28", "nombre": "MARFINA BUS, SA - LA VALLESANA, SA (Moventia)" },
    { "id": "op-29", "nombre": "MOVENTIA L'HOSPITALET (Moventia)" },
    { "id": "op-30", "nombre": "TRANSPORTS CIUTAT COMTAL, SA (Moventia)" },
    { "id": "op-31", "nombre": "TRANSPORTS PUJOL I PUJOL" },
    { "id": "op-32", "nombre": "25 OSONA BUS, SA (Sagalés)" },
    { "id": "op-33", "nombre": "BARCELONA BUS, SL (Sagalés)" },
    { "id": "op-34", "nombre": "CINGLES BUS, SA (Sagalés)" },
    { "id": "op-35", "nombre": "EMPRESA SAGALÉS, SA" },
    { "id": "op-36", "nombre": "FERROCARRILES Y TRANSPORTES, SA (Sagalés)" },
    { "id": "op-37", "nombre": "MANRESA BUS, SA (Sagalés)" },
    { "id": "op-38", "nombre": "17 BAGES BUS, SA (Soler i Sauret)" },
    { "id": "op-39", "nombre": "UTE VALLDOREIX (Soler i Sauret)" },
    { "id": "op-40", "nombre": "SOLER Y SAURET, SA" },
    { "id": "op-41", "nombre": "TEISA" },
    { "id": "op-42", "nombre": "HISPANO HILARIENCA, SAU (TEISA)" }
  ],
  "autobuses": [
    { "id": "6916-HCR", "uniqueId": "VEH-ALSINA-300", "modelo": "Mercedes Citaro", "operadorId": "op-01" },
    { "id": "6917-HCR", "uniqueId": "VEH-ALSINA-301", "modelo": "Mercedes Citaro", "operadorId": "op-01" },
    { "id": "4444-HCR", "uniqueId": "VEH-ALSINA-445", "modelo": "Mercedes Citaro", "operadorId": "op-01" },
    { "id": "7001-HCR", "uniqueId": "VEH-JULIA-302", "modelo": "Mercedes Citaro", "operadorId": "op-02" },
    { "id": "7002-HCR", "uniqueId": "VEH-JULIA-303", "modelo": "Mercedes Citaro", "operadorId": "op-02" },
    { "id": "4602-JKD", "uniqueId": "VEH-PENEDES-326", "modelo": "Mercedes Citaro LE", "operadorId": "op-03" },
    { "id": "2223-JKD", "uniqueId": "VEH-PENEDES-204", "modelo": "Mercedes Citaro LE", "operadorId": "op-03" },
    { "id": "4192-KFL", "uniqueId": "VEH-PRAT-338", "modelo": "Otokar Vectio LE", "operadorId": "op-04" },
    { "id": "1111-KFL", "uniqueId": "VEH-PRAT-287", "modelo": "Otokar Vectio LE", "operadorId": "op-04" },
    { "id": "5400-LFN", "uniqueId": "VEH-FONT-342", "modelo": "Mercedes Citaro Hybrid", "operadorId": "op-05" },
    { "id": "5993-LMS", "uniqueId": "VEH-VENDRELL-344", "modelo": "Solaris Urbino 12 Hybrid", "operadorId": "op-06" },
    { "id": "3806-MBW", "uniqueId": "VEH-AUTOCORB-349", "modelo": "Solaris Urbino 12 Hybrid", "operadorId": "op-07" },
    { "id": "B-1234-CD", "uniqueId": "VEH-TUSGSAL-101", "modelo": "Mercedes Citaro", "operadorId": "op-20" },
    { "id": "B-5678-EF", "uniqueId": "VEH-TUSGSAL-102", "modelo": "Iveco Urbanway", "operadorId": "op-20" },
    { "id": "B-9012-GH", "uniqueId": "VEH-TUSGSAL-103", "modelo": "MAN Lion's City", "operadorId": "op-20" },
    { "id": "C-3456-IJ", "uniqueId": "VEH-BAIXLLOB-201", "modelo": "Mercedes Citaro Hybrid", "operadorId": "op-14" },
    { "id": "C-7890-KL", "uniqueId": "VEH-BAIXLLOB-202", "modelo": "Scania Citywide", "operadorId": "op-14" },
    { "id": "C-1111-IJ", "uniqueId": "VEH-BAIXLLOB-203", "modelo": "Mercedes Citaro Hybrid", "operadorId": "op-14" },
    { "id": "C-2222-KL", "uniqueId": "VEH-BAIXLLOB-204", "modelo": "Scania Citywide", "operadorId": "op-14" },
    { "id": "C-3333-IJ", "uniqueId": "VEH-BAIXLLOB-301", "modelo": "Mercedes Citaro Hybrid", "operadorId": "op-14" },
    { "id": "C-4444-KL", "uniqueId": "VEH-BAIXLLOB-302", "modelo": "Scania Citywide", "operadorId": "op-14" },
    { "id": "C-5555-IJ", "uniqueId": "VEH-BAIXLLOB-303", "modelo": "Mercedes Citaro Hybrid", "operadorId": "op-14" },
    { "id": "C-6666-KL", "uniqueId": "VEH-BAIXLLOB-304", "modelo": "Scania Citywide", "operadorId": "op-14" },
    { "id": "D-1122-MN", "uniqueId": "VEH-SAGALES-501", "modelo": "Volvo 7900", "operadorId": "op-35" },
    { "id": "D-3344-OP", "uniqueId": "VEH-SAGALES-502", "modelo": "Mercedes Citaro", "operadorId": "op-35" },
    { "id": "E-5566-QR", "uniqueId": "VEH-SOLER-601", "modelo": "MAN Lion's City Hybrid", "operadorId": "op-40" },
    { "id": "E-7788-ST", "uniqueId": "VEH-SOLER-602", "modelo": "Mercedes Citaro", "operadorId": "op-40" }
  ],
  "tecnicos": [
    { "id": "tec-01", "nombre": "A.P.U." }
  ]
};
