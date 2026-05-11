/**
 * CONFIGURACIÓN DE ETAPAS DEL PROYECTO - MÓDULO ODISEO
 *
 * Define las 3 etapas del flujo de proyectos en ODISEO (P1 a P3).
 * ODISEO gestiona solo hasta P3 (Gestión comercial de productos preliminares).
 * Los estados P4-P9 no están implementados en ODISEO.
 */

import type { ProjectStage as NewProjectStage } from "./projectWorkflow";

// Re-exportar ProjectStage para compatibilidad con componentes existentes
export type { ProjectStage as NewProjectStage } from "./projectWorkflow";

/**
 * Type de etapa que incluye tanto las nuevas (P0-P5) como las legacy (P1-P9)
 * para compatibilidad durante la transición de componentes
 * @deprecated Los componentes deben migrar a NewProjectStage gradualmente
 */
export type ProjectStage = NewProjectStage | "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7" | "P8" | "P9";

/**
 * Configuración de una etapa del proyecto
 */
export interface StageConfig {
  id: ProjectStage;
  name: string;
  description: string;
  responsibleArea: string;
  slaDays: number;
  skippable?: boolean; // Legacy: compatibilidad con componentes antiguos
}

/**
 * Configuraciones de las 3 etapas ODISEO (P1-P3)
 */
export const PROJECT_STAGE_CONFIGS: Record<NewProjectStage, StageConfig> = {
  P1_PREPARACION_FICHA_PROYECTO: {
    id: "P1_PREPARACION_FICHA_PROYECTO",
    name: "Preparación de Ficha de Proyecto",
    description:
      "Registra el proyecto y completa la ficha técnica: datos base del cliente, portafolio, ruta de diseño, dimensiones, estructura y especificaciones.",
    responsibleArea: "Ejecutivo Comercial",
    slaDays: 3,
  },

  P2_VALIDACION_VIABILIDAD_TECNICA: {
    id: "P2_VALIDACION_VIABILIDAD_TECNICA",
    name: "Validación de Viabilidad Técnica",
    description:
      "Artes Gráficas valida diseño e impresión. Luego, R&D Técnica o R&D Desarrollo valida estructura, especificaciones técnicas y viabilidad de manufactura.",
    responsibleArea: "Artes Gráficas / R&D Técnica / R&D Desarrollo",
    slaDays: 5,
  },

  P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES: {
    id: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
    name: "Gestión Comercial de Productos Preliminares",
    description:
      "Solicita cotización a proveedores, genera productos preliminares y envía presupuesto a cliente para aprobación.",
    responsibleArea: "Comercial Finance",
    slaDays: 7,
  },
};

/**
 * Array de todas las etapas ODISEO (P1-P3) en orden secuencial
 */
export const ALL_PROJECT_STAGES: StageConfig[] = [
  PROJECT_STAGE_CONFIGS.P1_PREPARACION_FICHA_PROYECTO,
  PROJECT_STAGE_CONFIGS.P2_VALIDACION_VIABILIDAD_TECNICA,
  PROJECT_STAGE_CONFIGS.P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES,
];

/**
 * Obtiene la configuración de una etapa por su ID
 */
export function getStageConfig(stageId: ProjectStage): StageConfig | undefined {
  return PROJECT_STAGE_CONFIGS[stageId];
}

/**
 * Verifica si un ID corresponde a una etapa ODISEO (P0-P5)
 */
export function isPortalStage(stageId: string): boolean {
  return stageId in PROJECT_STAGE_CONFIGS;
}

/**
 * Obtiene el orden secuencial de una etapa (0-5)
 */
export function getStageSequence(stageId: ProjectStage): number {
  return ALL_PROJECT_STAGES.findIndex((s) => s.id === stageId);
}

/**
 * Verifica si es posible avanzar de una etapa a otra
 */
export function canAdvanceStage(fromStage: ProjectStage, toStage: ProjectStage): boolean {
  const fromIdx = getStageSequence(fromStage);
  const toIdx = getStageSequence(toStage);
  return toIdx >= fromIdx && fromIdx !== -1 && toIdx !== -1;
}

// ============================================================================
// COMPATIBILIDAD LEGACY (para transición gradual de componentes)
// ============================================================================

/**
 * @deprecated Alias de ALL_PROJECT_STAGES para compatibilidad
 */
export const PORTAL_PROJECT_STAGES = ALL_PROJECT_STAGES.filter(
  (s) => !["P6", "P7", "P8", "P9"].includes(s.id as any)
);

/**
 * @deprecated No hay etapas SI en ODISEO. Mantener vacío para compatibilidad.
 */
export const SI_PROJECT_STAGES: StageConfig[] = [];

/**
 * Mapeo de etapas legacy (P1-P5, P6-P9) a nuevas etapas (P1-P3)
 * @deprecated Usar las nuevas etapas directamente
 */
export const LEGACY_STAGE_MAPPING: Record<string, ProjectStage> = {
  // Portal stages: P1-P5 → nuevas P1-P3
  P1: "P1_PREPARACION_FICHA_PROYECTO",
  P2: "P1_PREPARACION_FICHA_PROYECTO",
  P3: "P2_VALIDACION_VIABILIDAD_TECNICA",
  P4: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  P5: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",

  // SI stages: P6-P9 → P3 (gestión comercial, última etapa ODISEO)
  P6: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  P7: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  P8: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  P9: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
};

/**
 * Convierte una etapa legacy (P1-P9) a nueva etapa (P0-P5)
 * @deprecated Usar directamente las nuevas etapas
 */
export function convertLegacyStage(legacyStage: string): ProjectStage | undefined {
  return LEGACY_STAGE_MAPPING[legacyStage];
}
