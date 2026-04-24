export type PortalStage = "P1" | "P2" | "P3" | "P4" | "P5";
export type SiStage = "P6" | "P7" | "P8" | "P9";
export type ProjectStage = PortalStage | SiStage;

export interface StageConfig {
  id: ProjectStage;
  name: string;
  description: string;
  responsibleArea: string;
  slaDays: number;
  skippable?: boolean;
}

export const PORTAL_PROJECT_STAGES: StageConfig[] = [
  {
    id: "P1",
    name: "Registro de Proyecto",
    description: "Comercial registra el proyecto con datos base y completa la ficha.",
    responsibleArea: "Comercial",
    slaDays: 2,
  },
  {
    id: "P2",
    name: "Validación Artes Gráficas",
    description: "Validación de diseño, arte, impresión y requisitos gráficos.",
    responsibleArea: "Artes Gráficas",
    slaDays: 3,
    skippable: true, // Puede saltarse si no hay diseño
  },
  {
    id: "P3",
    name: "Validación Técnica / R&D",
    description: "Validación de especificaciones técnicas, estructura, aplicación y máquina.",
    responsibleArea: "R&D",
    slaDays: 5,
  },
  {
    id: "P4",
    name: "Evaluación Técnico-Económica",
    description: "Evaluación de viabilidad económica, costos y rango de precios.",
    responsibleArea: "Comercial Finance",
    slaDays: 4,
  },
  {
    id: "P5",
    name: "Aprobación / Cierre para Alta",
    description: "Registro de oferta técnica, económica y pase a desarrollo.",
    responsibleArea: "Comercial",
    slaDays: 2,
  }
];

export const SI_PROJECT_STAGES: StageConfig[] = [
  {
    id: "P6",
    name: "Desarrollo",
    description: "Desarrollo de muestra física en planta.",
    responsibleArea: "Sistema Integral",
    slaDays: 0,
  },
  {
    id: "P7",
    name: "Lista para Alta",
    description: "Muestra aprobada, lista para pase a producción.",
    responsibleArea: "Sistema Integral",
    slaDays: 0,
  },
  {
    id: "P8",
    name: "Dado de Alta",
    description: "Alta en ERP completada.",
    responsibleArea: "Sistema Integral",
    slaDays: 0,
  },
  {
    id: "P9",
    name: "Finalizado",
    description: "Proyecto cerrado operativamente.",
    responsibleArea: "Sistema Integral",
    slaDays: 0,
  }
];

export const ALL_PROJECT_STAGES = [...PORTAL_PROJECT_STAGES, ...SI_PROJECT_STAGES];

export function getStageConfig(stageId: ProjectStage): StageConfig | undefined {
  return ALL_PROJECT_STAGES.find(s => s.id === stageId);
}

export function isPortalStage(stageId: ProjectStage): boolean {
  return PORTAL_PROJECT_STAGES.some(s => s.id === stageId);
}
