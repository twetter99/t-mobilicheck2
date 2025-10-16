export type ChecklistStep = {
  id: string;
  title: string;
  description: string;
};

export type Checklist = {
  [key: string]: ChecklistStep[];
};

export const checklists: Checklist = {
  "instal·lacio": [
    { id: "inst-01", title: "Verificació de Components", description: "Assegurar que tots els equips (pupitre, validadores, antenes, etc.) estiguin presents." },
    { id: "inst-02", title: "Muntatge Físic del Pupitre", description: "Fixar el suport i el pupitre a la posició definida pel fabricant." },
    { id: "inst-03", title: "Muntatge de Validadors", description: "Instal·lar els validadors a les entrades i sortides corresponents." },
    { id: "inst-04", title: "Connexionat Elèctric", description: "Connectar tots els components a la placa de connexions seguint l'esquema." },
    { id: "inst-05", title: "Verificació d'Arrencada", description: "Connectar l'alimentació i comprovar que el sistema arrenca correctament." },
    { id: "inst-06", title: "Fotografies Finals", description: "Fer fotos de la instal·lació finalitzada des de diferents angles." },
  ],
  "traspas": [
    { id: "trasp-01", title: "Fotografies Inicials (Vehicle Origen)", description: "Documentar l'estat de la instal·lació abans de desmuntar." },
    { id: "trasp-02", title: "Desconnexió i Desmuntatge", description: "Retirar amb cura tots els components del vehicle d'origen." },
    { id: "trasp-03", title: "Verificació de Components", description: "Comprovar que no hi hagi danys en cap component durant el traspàs." },
    { id: "trasp-04", title: "Instal·lació en Vehicle Destí", description: "Seguir els passos d'una instal·lació nova al vehicle de destinació." },
    { id: "trasp-05", title: "Verificació Funcional", description: "Comprovar que tot el sistema funciona correctament a la nova ubicació." },
    { id: "trasp-06", title: "Fotografies Finals (Vehicle Destí)", description: "Documentar l'estat de la nova instal·lació." },
  ],
  "desinstal·lacio": [
    { id: "desinst-01", title: "Fotografies Inicials", description: "Documentar l'estat de la instal·lació abans de començar." },
    { id: "desinst-02", title: "Apagat i Desconnexió Segura", description: "Assegurar que el sistema estigui completament apagat abans de desconnectar." },
    { id: "desinst-03", title: "Desmuntatge de Components", description: "Retirar tots els equips T-Mobilitat del vehicle." },
    { id: "desinst-04", "title": "Embalatge i Etiquetatge", "description": "Guardar i etiquetar correctament cada component per al magatzem." },
    { id: "desinst-05", title: "Fotografies Finals", description: "Fer fotos de l'estat del vehicle un cop retirats els equips." },
  ]
};
