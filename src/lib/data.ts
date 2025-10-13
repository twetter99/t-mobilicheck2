
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
      "tipo": "Preventivo Trimestral", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-trim-002", 
      "vehiculoId": "VEH-BAIXLLOB-202", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Trimestral", 
      "hora": "21:45", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-trim-003", 
      "vehiculoId": "VEH-BAIXLLOB-203", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Trimestral", 
      "hora": "22:30", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-trim-004", 
      "vehiculoId": "VEH-BAIXLLOB-204", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Trimestral", 
      "hora": "23:15", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-001", 
      "vehiculoId": "VEH-BAIXLLOB-301", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Anual", 
      "hora": "00:00", 
      "fecha": getFutureDate(3, 0), // Next day for times after midnight
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-002", 
      "vehiculoId": "VEH-BAIXLLOB-302", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Anual", 
      "hora": "00:45", 
      "fecha": getFutureDate(3, 0), // Next day for times after midnight
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-003", 
      "vehiculoId": "VEH-BAIXLLOB-303", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Anual", 
      "hora": "01:30", 
      "fecha": getFutureDate(3, 0), // Next day for times after midnight
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
    { 
      "id": "rev-anual-004", 
      "vehiculoId": "VEH-BAIXLLOB-304", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventivo Anual", 
      "hora": "02:15", 
      "fecha": getFutureDate(3, 0), // Next day for times after midnight
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral" 
    },
     {
      "id": "inst-001",
      "vehiculoId": "VEH-TUSGSAL-101",
      "operador": "TUSGSAL",
      "tipo": "Instalación",
      "hora": "10:00",
      "fecha": getFutureDate(4, 0),
      "ubicacion": "Cochera Badalona",
      "duracionEstimada": "22h",
      "observaciones": "Instalación completa de hardware. No requiere configuración de software."
    },
    {
      "id": "trasp-001",
      "vehiculoId": "VEH-SAGALES-501",
      "operador": "EMPRESA SAGALÉS, SA",
      "tipo": "Traspaso",
      "hora": "14:00",
      "fecha": getFutureDate(4, 0),
      "ubicacion": "Cochera Granollers",
      "duracionEstimada": "24h",
      "observaciones": "Traspaso de validadora de vehículo antiguo a nuevo."
    },
    {
      "id": "desinst-001",
      "vehiculoId": "VEH-SOLER-601",
      "operador": "SOLER Y SAURET, SA",
      "tipo": "Desinstalación",
      "hora": "16:00",
      "fecha": getFutureDate(4, 0),
      "ubicacion": "Cochera St. Feliu",
      "duracionEstimada": "6h",
      "observaciones": "Vehículo dado de baja. Retirar todo el equipamiento T-Mobilitat."
    },
  ],
  "operadores": [
    { "id": "op-01", "nombre": "ALSINA GRAELLS DE AUTO TRANSPORTES, SA" },
    { "id": "op-14", "nombre": "UTE BAIX LLOBREGAT" },
    { "id": "op-20", "nombre": "TUSGSAL" },
    { "id": "op-35", "nombre": "EMPRESA SAGALÉS, SA" },
    { "id": "op-40", "nombre": "SOLER Y SAURET, SA" }
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
