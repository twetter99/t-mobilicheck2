// Set today's date for mock data
const today = new Date();
const todayISO = today.toISOString().split('T')[0];

export const data = {
  "revisiones": [
    { 
      "id": "rev-001", 
      "vehiculoId": "VEH-TUSGSAL-101", 
      "operador": "ALSINA GRAELLS", 
      "tipo": "Trimestral", 
      "hora": "21:00", 
      "fecha": `${todayISO}T21:00:00.000Z`,
      "ubicacion": "Cochera Norte", 
      "duracionEstimada": "2h", 
      "observaciones": "Turno nocturno. Prioridad normal." 
    },
    { 
      "id": "rev-002", 
      "vehiculoId": "VEH-BAIXLLOB-201", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Anual", 
      "hora": "22:30", 
      "fecha": `${todayISO}T22:30:00.000Z`,
      "ubicacion": "Cochera Viladecans", 
      "duracionEstimada": "4h", 
      "observaciones": "Revisión completa de infraestructura. Vehículo inmovilizado hasta fin de revisión." 
    },
    { 
      "id": "rev-003", 
      "vehiculoId": "VEH-SAGALES-502", 
      "operador": "EMPRESA PLANA", 
      "tipo": "Semestral", 
      "hora": "01:00", 
      "fecha": `${todayISO}T01:00:00.000Z`,
      "ubicacion": "Taller Central", 
      "duracionEstimada": "3h", 
      "observaciones": "Turno nocturno" 
    },
    { 
      "id": "rev-004", 
      "vehiculoId": "VEH-SOLER-601", 
      "operador": "SOLER Y SAURET", 
      "tipo": "Trimestral", 
      "hora": "03:00", 
      "fecha": `${todayISO}T03:00:00.000Z`,
      "ubicacion": "Cochera Sur", 
      "duracionEstimada": "2h", 
      "observaciones": "Turno nocturno. Cliente reporta fallos esporádicos en validadora de salida." 
    },
    {
      "id": "rev-005",
      "vehiculoId": "VEH-ALSINA-300",
      "operador": "CINTOI BUS",
      "tipo": "Bianual",
      "hora": "23:00",
      "fecha": "2026-03-15T23:00:00.000Z", // Past date for testing
      "ubicacion": "Cochera Norte",
      "duracionEstimada": "5h",
      "observaciones": "Sustitución de baterías planificada."
    },
    { 
      "id": "rev-006", 
      "vehiculoId": "VEH-HISPANO-01",
      "operador": "LA HISPANO DE FUENTE",
      "tipo": "Trimestral", 
      "hora": "04:30", 
      "fecha": `${todayISO}T04:30:00.000Z`,
      "ubicacion": "Taller Central", 
      "duracionEstimada": "1.5h", 
      "observaciones": "Turno nocturno." 
    }
  ],
  "operadores": [
    { "id": "op-01", "nombre": "ALSINA GRAELLS" },
    { "id": "op-09", "nombre": "LA HISPANO DE FUENTE" },
    { "id": "op-14", "nombre": "UTE BAIX LLOBREGAT" },
    { "id": "op-21", "nombre": "CINTOI BUS" },
    { "id": "op-22", "nombre": "EMPRESA PLANA" },
    { "id": "op-39", "nombre": "UTE VALLDOREIX" },
    { "id": "op-40", "nombre": "SOLER Y SAURET" }
  ],
  "autobuses": [
    { "id": "6916-HCR", "uniqueId": "VEH-ALSINA-300", "modelo": "Mercedes Citaro", "operadorId": "op-01" },
    { "id": "6917-HCR", "uniqueId": "VEH-ALSINA-301", "modelo": "Mercedes Citaro", "operadorId": "op-01" },
    { "id": "B-1234-CD", "uniqueId": "VEH-TUSGSAL-101", "modelo": "Mercedes Citaro", "operadorId": "op-01" },
    { "id": "B-5678-EF", "uniqueId": "VEH-HISPANO-01", "modelo": "Iveco Urbanway", "operadorId": "op-09" },
    { "id": "C-3456-IJ", "uniqueId": "VEH-BAIXLLOB-201", "modelo": "Mercedes Citaro Hybrid", "operadorId": "op-14" },
    { "id": "C-7890-KL", "uniqueId": "VEH-BAIXLLOB-202", "modelo": "Scania Citywide", "operadorId": "op-14" },
    { "id": "D-1122-MN", "uniqueId": "VEH-CINTOI-01", "modelo": "Volvo 7900", "operadorId": "op-21" },
    { "id": "D-3344-OP", "uniqueId": "VEH-SAGALES-502", "modelo": "Mercedes Citaro", "operadorId": "op-22" },
    { "id": "E-5566-QR", "uniqueId": "VEH-SOLER-601", "modelo": "MAN Lion's City Hybrid", "operadorId": "op-40" },
    { "id": "E-7788-ST", "uniqueId": "VEH-SOLER-602", "modelo": "Mercedes Citaro", "operadorId": "op-40" }
  ],
  "tecnicos": [
    { "id": "tec-01", "nombre": "A.P.U." }
  ]
};
