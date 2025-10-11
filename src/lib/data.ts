// Set a consistent date in the future for mock data
// Using January 2026 to match the provided schedule's context
const getFutureDate = (day: number) => {
    const date = new Date('2026-01-01T00:00:00.000Z');
    date.setDate(day);
    return date.toISOString();
};


export const data = {
  "revisiones": [
    { 
      "id": "rev-001", 
      "vehiculoId": "VEH-BAIXLLOB-201", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Trimestral", 
      "hora": "09:00", 
      "fecha": getFutureDate(26),
      "ubicacion": "C/ Lobatona 13, Viladecans", 
      "duracionEstimada": "7h 30m", 
      "observaciones": "TORN DIÜRN - Flota nocturna" 
    },
    { 
      "id": "rev-002", 
      "vehiculoId": "VEH-ALSINA-300", 
      "operador": "ALSINA GRAELLS", 
      "tipo": "Semestral", 
      "hora": "09:00", 
      "fecha": getFutureDate(27),
      "ubicacion": "Barcelona / Vilanova", 
      "duracionEstimada": "7h 45m", 
      "observaciones": "TORN DIÜRN - Mussols i nocturns" 
    },
    { 
      "id": "rev-003", 
      "vehiculoId": "VEH-SAGALES-502", 
      "operador": "EMPRESA PLANA", 
      "tipo": "Anual", 
      "hora": "09:00", 
      "fecha": getFutureDate(28),
      "ubicacion": "Vilanova / L'Hospitalet", 
      "duracionEstimada": "7h", 
      "observaciones": "TORN DIÜRN - Serveis especials" 
    },
    { 
      "id": "rev-004", 
      "vehiculoId": "VEH-BAIXLLOB-202", 
      "operador": "UTE BAIX LLOBREGAT", 
      "tipo": "Trimestral", 
      "hora": "09:00", 
      "fecha": getFutureDate(29),
      "ubicacion": "Viladecans / Vilanova", 
      "duracionEstimada": "7h 45m", 
      "observaciones": "TORN DIÜRN - Flota nocturna" 
    },
    {
      "id": "rev-005",
      "vehiculoId": "VEH-SOLER-601",
      "operador": "SOLER Y SAURET",
      "tipo": "Anual",
      "hora": "09:00",
      "fecha": getFutureDate(30),
      "ubicacion": "Crta. Laureà Miró 426, Sant Feliu",
      "duracionEstimada": "6h",
      "observaciones": "TORN DIÜRN - Tancament mes"
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
