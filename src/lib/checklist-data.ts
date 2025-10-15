export type ChecklistStep = {
  id: string;
  title: string;
  description: string;
};

export type Checklist = {
  [key: string]: ChecklistStep[];
};

export const checklists: Checklist = {
  "instalacion": [
    { id: "inst-01", title: "Verificación de Componentes", description: "Asegurar que todos los equipos (pupitre, validadoras, antenas, etc.) estén presentes." },
    { id: "inst-02", title: "Montaje Físico del Pupitre", description: "Fijar el soporte y el pupitre en la posición definida por el fabricante." },
    { id: "inst-03", title: "Montaje de Validadoras", description: "Instalar las validadoras en las entradas y salidas correspondientes." },
    { id: "inst-04", title: "Conexionado Eléctrico", description: "Conectar todos los componentes a la placa de conexiones siguiendo el esquema." },
    { id: "inst-05", title: "Verificación de Arranque", description: "Conectar la alimentación y comprobar que el sistema arranca correctamente." },
    { id: "inst-06", title: "Fotografías Finales", description: "Hacer fotos de la instalación finalizada desde diferentes ángulos." },
  ],
  "traspaso": [
    { id: "trasp-01", title: "Fotografías Iniciales (Vehículo Origen)", description: "Documentar el estado de la instalación antes de desmontar." },
    { id: "trasp-02", title: "Desconexión y Desmontaje", description: "Retirar con cuidado todos los componentes del vehículo de origen." },
    { id: "trasp-03", title: "Verificación de Componentes", description: "Comprobar que no haya daños en ningún componente durante el traspaso." },
    { id: "trasp-04", title: "Instalación en Vehículo Destino", description: "Seguir los pasos de una instalación nueva en el vehículo de destino." },
    { id: "trasp-05", title: "Verificación Funcional", description: "Comprobar que todo el sistema funciona correctamente en la nueva ubicación." },
    { id: "trasp-06", title: "Fotografías Finales (Vehículo Destino)", description: "Documentar el estado de la nueva instalación." },
  ],
  "desinstalacion": [
    { id: "desinst-01", title: "Fotografías Iniciales", description: "Documentar el estado de la instalación antes de empezar." },
    { id: "desinst-02", title: "Apagado y Desconexión Segura", description: "Asegurar que el sistema esté completamente apagado antes de desconectar." },
    { id: "desinst-03", title: "Desmontaje de Componentes", description: "Retirar todos los equipos T-Mobilitat del vehículo." },
    { id: "desinst-04", "title": "Embalaje y Etiquetado", "description": "Guardar y etiquetar correctamente cada componente para el almacén." },
    { id: "desinst-05", title: "Fotografías Finales", description: "Hacer fotos del estado del vehículo una vez retirados los equipos." },
  ]
};
