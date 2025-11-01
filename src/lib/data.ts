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
      "tipo": "Preventiu Trimestral", 
      "hora": "21:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral",
      "prioridad": "Mitjana",
      "estado": "Pendent",
      "contract": "T-Mobilitat"
    },
    { 
      "id": "rev-trim-002", 
      "vehiculoId": "VEH-BAIXLLOB-202", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventiu Trimestral", 
      "hora": "21:45", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral",
      "prioridad": "Mitjana",
      "estado": "Pendent",
      "contract": "T-Mobilitat"
    },
    { 
      "id": "rev-trim-003", 
      "vehiculoId": "VEH-BAIXLLOB-203", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventiu Trimestral", 
      "hora": "22:30", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral",
      "prioridad": "Mitjana",
      "estado": "Completada",
      "contract": "T-Mobilitat"
    },
    { 
      "id": "rev-trim-004", 
      "vehiculoId": "VEH-BAIXLLOB-204", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventiu Trimestral", 
      "hora": "23:15", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13", 
      "duracionEstimada": "45m", 
      "observaciones": "TORN NOCTURN - Inici any laboral",
      "prioridad": "Mitjana",
      "estado": "Pendent",
      "contract": "T-Mobilitat"
    },
    { 
      "id": "rev-anual-001", 
      "vehiculoId": "VEH-BAIXLLOB-301", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Preventiu Anual", 
      "hora": "00:00", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13", 
      "duracionEstimada": "1h 30m", 
      "observaciones": "TORN NOCTURN - Inici any laboral",
      "prioridad": "Alta",
      "estado": "En Progrés",
      "contract": "T-Mobilitat"
    },
    { 
      "id": "corr-001", 
      "vehiculoId": "VEH-BAIXLLOB-303", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Correctiu", 
      "hora": "01:30", 
      "fecha": getFutureDate(2, 0),
      "ubicacion": "C/ Lobatona 13", 
      "duracionEstimada": "1h 30m", 
      "observaciones": "AVARIA: La validadora no respon. Possible problema d'alimentació.",
      "prioridad": "Crítica",
      "estado": "Pendent",
      "contract": "T-Mobilitat"
    },
     {
      "id": "inst-001",
      "vehiculoId": "VEH-TUSGSAL-101",
      "operador": "TUSGSAL",
      "tipo": "Instal·lació",
      "hora": "10:00",
      "fecha": getFutureDate(2, 0),
      "ubicacion": "Cotxera Badalona",
      "duracionEstimada": "30m",
      "observaciones": "Instal·lació completa de maquinari. No requereix configuració de programari.",
      "prioridad": "Mitjana",
      "estado": "Pendent",
      "contract": "T-Mobilitat"
    },
    {
      "id": "trasp-001",
      "vehiculoId": "VEH-SAGALES-501",
      "operador": "EMPRESA SAGALÉS, SA",
      "tipo": "Traspàs",
      "hora": "14:00",
      "fecha": getFutureDate(2, 0),
      "ubicacion": "Cotxera Granollers",
      "duracionEstimada": "30m",
      "observaciones": "Traspàs de validadora de vehicle antic a nou.",
      "prioridad": "Baixa",
      "estado": "Pendent",
      "contract": "T-Mobilitat"
    }
  ],
  "validadors_tasks": [
    {
      "id": "val-001",
      "contract": "C-4/2025",
      "operador": "TMB",
      "cochera": "Horta",
      "vehiculo": "5432",
      "n_validadora": "V-5432-1",
      "tipo": "Preventiu",
      "prioridad": "Normal",
      "distancia": "2.5km",
      "estimacion": "00:30",
      "turno": "Diurn",
      "estado": "Pendent",
      "hora": "09:30",
      "fecha": getFutureDate(2,0),
      "last_revision": "2025-10-15T10:00:00.000Z"
    },
    {
      "id": "val-002",
      "contract": "C-4/2025",
      "operador": "TMB",
      "cochera": "Horta",
      "vehiculo": "5433",
      "n_validadora": "V-5433-2",
      "tipo": "Correctiu",
      "prioridad": "Alta",
      "distancia": "2.5km",
      "estimacion": "01:00",
      "turno": "Diurn",
      "estado": "En curs",
      "hora": "11:00",
      "fecha": getFutureDate(2,0),
      "sla": "4h"
    },
    {
      "id": "val-003",
      "contract": "C-4/2025",
      "operador": "TMB",
      "cochera": "Zona Franca",
      "vehiculo": "8102",
      "n_validadora": "V-8102-1",
      "tipo": "Extra",
      "prioridad": "Crítica",
      "distancia": "8.1km",
      "estimacion": "01:30",
      "turno": "Nocturn",
      "estado": "Pendent",
      "hora": "22:00",
      "fecha": getFutureDate(2,0)
    },
    {
      "id": "c4-0001",
      "contract": "C-4/2025",
      "operador": "UTE BAIX LLOBREGAT",
      "cochera": "Cotxera Nord",
      "vehiculo": "8102",
      "n_validadora": "VAL-112233",
      "tipo": "Preventiu",
      "prioridad": "Alta",
      "distancia": "1.2km",
      "estimacion": "01:30",
      "turno": "Nocturn",
      "estado": "Pendent",
      "hora": "08:30",
      "fecha": getFutureDate(2, 0),
      "note": "Revisió semestral. Comprovar lectura i connexió SAE."
    }
  ],
  "operadores": [
    { "id": "op-01", "nombre": "ALSINA GRAELLS DE AUTO TRANSPORTES, SA" },
    { "id": "op-14", "nombre": "UTE BAIX LLOBREGAT" },
    { "id": "op-20", "nombre": "TUSGSAL" },
    { "id": "op-35", "nombre": "EMPRESA SAGALÉS, SA" },
    { "id": "op-40", "nombre": "SOLER I SAURET, SA" },
    { "id": "op-tmb", "nombre": "TMB" }
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
  ],
  "eventosProximos": [
    {
      "id": "evt-001",
      "titulo": "Traspàs Programat",
      "fecha": getFutureDate(8, 0), // 8 de Gener
      "descripcion": "Traspàs programat a la Cotxera Nord",
      "operador": "UTE BAIX LLOBREGAT",
      "ubicacion": "Cotxera Nord",
      "tipo": "Traspàs"
    }
  ]
};
