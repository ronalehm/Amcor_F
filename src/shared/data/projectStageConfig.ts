/**
 * CONFIGURACIÓN DE ETAPAS DEL PROYECTO - MÓDULO ODISEO
 *
 * Define las 6 etapas del flujo de proyectos en ODISEO (P0 a P5).
 * ODISEO gestiona solo hasta P5 (Preparación de envío a SI).
 * Los estados P6-P9 del Sistema Integral no están aquí.
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
 * Configuraciones de las 6 etapas ODISEO (P0-P5)
 */
export const PROJECT_STAGE_CONFIGS: Record<NewProjectStage, StageConfig> = {
  P0_REGISTRO_PROYECTO: {
    id: "P0_REGISTRO_PROYECTO",
    name: "Registro de Proyecto",
    description:
      "Ejecutivo comercial registra el proyecto con datos base del cliente, portafolio y ruta de diseño.",
    responsibleArea: "Ejecutivo Comercial",
    slaDays: 1,
  },

  P1_PREPARACION_FICHA_PROYECTO: {
    id: "P1_PREPARACION_FICHA_PROYECTO",
    name: "Preparación de Ficha de Proyecto",
    description:
      "Ejecutivo comercial completa la ficha técnica del proyecto: dimensiones, estructura, especificaciones de diseño y comerciales.",
    responsibleArea: "Ejecutivo Comercial",
    slaDays: 3,
  },

  P2_VALIDACION_VIABILIDAD_TECNICA: {
    id: "P2_VALIDACION_VIABILIDAD_TECNICA",
    name: "Validación de Viabilidad Técnica",
    description:
      "Artes Gráficas valida diseño e impresión. Luego, Área Técnica o Desarrollo R&D valida estructura, especificaciones técnicas y viabilidad de manufactura.",
    responsibleArea: "Artes Gráficas / Área Técnica / Desarrollo R&D",
    slaDays: 5,
  },

  P3_COTIZACION_APROBACION_CLIENTE: {
    id: "P3_COTIZACION_APROBACION_CLIENTE",
    name: "Cotización y Aprobación Cliente",
    description:
      "Comercial Finance solicita cotización a proveedores y envía presupuesto a cliente para aprobación.",
    responsibleArea: "Comercial Finance",
    slaDays: 7,
  },

  P4_VALIDACION_COMERCIAL_TESORERIA: {
    id: "P4_VALIDACION_COMERCIAL_TESORERIA",
    name: "Validación Comercial / Tesorería",
    description:
      "Tesorería valida aspectos comerciales, términos de pago, margen y términos finales con cliente.",
    responsibleArea: "Tesorería",
    slaDays: 3,
  },

  P5_PREPARACION_ENVIO_SI: {
    id: "P5_PREPARACION_ENVIO_SI",
    name: "Preparación y Envío a Sistema Integral",
    description:
      "Ejecutivo comercial prepara el proyecto para envío al Sistema Integral: genera producto preliminar base y coordina traspaso.",
    responsibleArea: "Ejecutivo Comercial",
    slaDays: 2,
  },
};

/**
 * Array de todas las etapas ODISEO (P0-P5) en orden secuencial
 */
export const ALL_PROJECT_STAGES: StageConfig[] = [
  PROJECT_STAGE_CONFIGS.P0_REGISTRO_PROYECTO,
  PROJECT_STAGE_CONFIGS.P1_PREPARACION_FICHA_PROYECTO,
  PROJECT_STAGE_CONFIGS.P2_VALIDACION_VIABILIDAD_TECNICA,
  PROJECT_STAGE_CONFIGS.P3_COTIZACION_APROBACION_CLIENTE,
  PROJECT_STAGE_CONFIGS.P4_VALIDACION_COMERCIAL_TESORERIA,
  PROJECT_STAGE_CONFIGS.P5_PREPARACION_ENVIO_SI,
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
 * Mapeo de etapas legacy (P1-P5, P6-P9) a nuevas etapas (P0-P5)
 * @deprecated Usar las nuevas etapas directamente
 */
export const LEGACY_STAGE_MAPPING: Record<string, ProjectStage> = {
  // Portal stages: P1-P5 → nuevos P0-P5
  P1: "P0_REGISTRO_PROYECTO",
  P2: "P1_PREPARACION_FICHA_PROYECTO",
  P3: "P2_VALIDACION_VIABILIDAD_TECNICA",
  P4: "P3_COTIZACION_APROBACION_CLIENTE",
  P5: "P4_VALIDACION_COMERCIAL_TESORERIA",

  // SI stages: P6-P9 → P5 (preparación para SI)
  P6: "P5_PREPARACION_ENVIO_SI",
  P7: "P5_PREPARACION_ENVIO_SI",
  P8: "P5_PREPARACION_ENVIO_SI",
  P9: "P5_PREPARACION_ENVIO_SI",
};

/**
 * Convierte una etapa legacy (P1-P9) a nueva etapa (P0-P5)
 * @deprecated Usar directamente las nuevas etapas
 */
export function convertLegacyStage(legacyStage: string): ProjectStage | undefined {
  return LEGACY_STAGE_MAPPING[legacyStage];
}
