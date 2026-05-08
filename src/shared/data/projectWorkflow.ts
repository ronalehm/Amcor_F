/* ============================================================================
   DEFINICIONES DE WORKFLOW - MÓDULO DE PROYECTOS ODISEO

   Este archivo centraliza toda la lógica de estados, etapas, validaciones
   y transiciones del flujo de proyectos en ODISEO.

   IMPORTANTE: ODISEO solo gestiona hasta P5_PREPARACION_ENVIO_SI
   NO se implementan estados técnicos del Sistema Integral.
   ============================================================================ */

// ============================================================================
// TIPOS PRINCIPALES: ETAPAS Y ESTADOS
// ============================================================================

export type ProjectStage =
  | "P0_REGISTRO_PROYECTO"
  | "P1_PREPARACION_FICHA_PROYECTO"
  | "P2_VALIDACION_VIABILIDAD_TECNICA"
  | "P3_COTIZACION_APROBACION_CLIENTE"
  | "P4_VALIDACION_COMERCIAL_TESORERIA"
  | "P5_PREPARACION_ENVIO_SI";

export type ProjectStatus =
  | "Registrado"
  | "En Curso"
  | "Ficha Completa"
  | "En Validación"
  | "Observado"
  | "Validado"
  | "En Cotización"
  | "Cotización Enviada"
  | "Aprobado por Cliente"
  | "En Validación Tesorería"
  | "Cliente Validado"
  | "Preparación SI"
  | "Enviado a SI"
  | "Desestimado";

// ============================================================================
// TIPOS DE VALIDACIÓN TÉCNICA INTERNA
// ============================================================================

export type GraphicArtsValidationStatus =
  | "Sin solicitar"
  | "Aprobado automático"
  | "Pendiente revisión manual"
  | "En revisión"
  | "Observado"
  | "Aprobado";

export type TechnicalValidationStatus =
  | "Sin solicitar"
  | "Pendiente"
  | "En revisión"
  | "Observado"
  | "Aprobado";

export type TechnicalComplexity = "Baja" | "Alta";

export type TechnicalValidatorType = "Área Técnica" | "Desarrollo R&D";

export type TreasuryValidationStatus =
  | "No solicitado"
  | "Pendiente"
  | "En revisión"
  | "Observado"
  | "Aprobado"
  | "Rechazado";

export type CurrentValidationStep =
  | "Artes Gráficas"
  | "Área Técnica"
  | "Desarrollo R&D"
  | "Tesorería"
  | null;

// ============================================================================
// TIPOS DE PRODUCTO PRELIMINAR
// ============================================================================

export type PreliminaryProductStatus =
  | "Registrado"
  | "En Cotización"
  | "Aprobado"
  | "Desestimado"
  | "Alta";

export type PreliminaryProductType = "Base" | "Variación";

export type ProjectProductSummaryStatus =
  | "Sin productos"
  | "Producto base registrado"
  | "Con variaciones"
  | "En cotización"
  | "Aprobados"
  | "Alta parcial"
  | "Alta completa"
  | "Con desestimados";

// ============================================================================
// ALIASES PARA COMPATIBILIDAD
// ============================================================================

export type WorkflowProjectStatus = ProjectStatus;
export type WorkflowProjectStage = ProjectStage;
export type AreaValidationStatus = GraphicArtsValidationStatus;

// ============================================================================
// CONSTANTES: LABELS Y MAPEOS
// ============================================================================

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  P0_REGISTRO_PROYECTO: "P0 - Registro de Proyecto",
  P1_PREPARACION_FICHA_PROYECTO: "P1 - Preparación de ficha de proyecto",
  P2_VALIDACION_VIABILIDAD_TECNICA: "P2 - Validación de viabilidad técnica",
  P3_COTIZACION_APROBACION_CLIENTE: "P3 - Cotización y aprobación cliente",
  P4_VALIDACION_COMERCIAL_TESORERIA: "P4 - Validación comercial / Tesorería",
  P5_PREPARACION_ENVIO_SI: "P5 - Preparación y envío a Sistema Integral",
};

export const PROJECT_STATUS_TO_STAGE: Record<ProjectStatus, ProjectStage> = {
  Registrado: "P0_REGISTRO_PROYECTO",

  "En Curso": "P1_PREPARACION_FICHA_PROYECTO",
  "Ficha Completa": "P1_PREPARACION_FICHA_PROYECTO",

  "En Validación": "P2_VALIDACION_VIABILIDAD_TECNICA",
  Observado: "P2_VALIDACION_VIABILIDAD_TECNICA",
  Validado: "P2_VALIDACION_VIABILIDAD_TECNICA",

  "En Cotización": "P3_COTIZACION_APROBACION_CLIENTE",
  "Cotización Enviada": "P3_COTIZACION_APROBACION_CLIENTE",
  "Aprobado por Cliente": "P3_COTIZACION_APROBACION_CLIENTE",

  "En Validación Tesorería": "P4_VALIDACION_COMERCIAL_TESORERIA",
  "Cliente Validado": "P4_VALIDACION_COMERCIAL_TESORERIA",

  "Preparación SI": "P5_PREPARACION_ENVIO_SI",
  "Enviado a SI": "P5_PREPARACION_ENVIO_SI",

  Desestimado: "P0_REGISTRO_PROYECTO",
};

export const STAGE_STATUSES: Record<ProjectStage, ProjectStatus[]> = {
  P0_REGISTRO_PROYECTO: ["Registrado"],
  P1_PREPARACION_FICHA_PROYECTO: ["En Curso", "Ficha Completa"],
  P2_VALIDACION_VIABILIDAD_TECNICA: ["En Validación", "Observado", "Validado"],
  P3_COTIZACION_APROBACION_CLIENTE: [
    "En Cotización",
    "Cotización Enviada",
    "Aprobado por Cliente",
  ],
  P4_VALIDACION_COMERCIAL_TESORERIA: [
    "En Validación Tesorería",
    "Cliente Validado",
  ],
  P5_PREPARACION_ENVIO_SI: ["Preparación SI", "Enviado a SI"],
};

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Resuelve la etapa correspondiente a un estado visible
 */
export function resolveProjectStage(status: ProjectStatus): ProjectStage {
  return PROJECT_STATUS_TO_STAGE[status];
}

/**
 * Retorna los estados válidos para una etapa
 */
export function getStatusesForStage(stage: ProjectStage): ProjectStatus[] {
  return STAGE_STATUSES[stage] || [];
}

/**
 * Valida si una transición de estado es permitida
 */
export function canAdvanceTo(
  fromStatus: ProjectStatus,
  toStatus: ProjectStatus
): boolean {
  const fromStage = resolveProjectStage(fromStatus);
  const toStage = resolveProjectStage(toStatus);

  const stageSequence: ProjectStage[] = [
    "P0_REGISTRO_PROYECTO",
    "P1_PREPARACION_FICHA_PROYECTO",
    "P2_VALIDACION_VIABILIDAD_TECNICA",
    "P3_COTIZACION_APROBACION_CLIENTE",
    "P4_VALIDACION_COMERCIAL_TESORERIA",
    "P5_PREPARACION_ENVIO_SI",
  ];

  const fromIdx = stageSequence.indexOf(fromStage);
  const toIdx = stageSequence.indexOf(toStage);

  // Permitir avance secuencial o dentro de la misma etapa
  return toIdx >= fromIdx;
}

/**
 * Determina el estado de validación de Artes Gráficas basado en requerimiento de diseño
 */
export function computeGraphicArtsValidationStatus(
  requiresDesignWork?: boolean
): GraphicArtsValidationStatus {
  if (requiresDesignWork === false) {
    return "Aprobado automático";
  }
  return "Pendiente revisión manual";
}

/**
 * Verifica si un proyecto puede generar Producto Preliminar Base
 */
export function canGenerateBaseProduct(project: any): boolean {
  return (
    project.status === "Validado" &&
    !project.hasBasePreliminaryProduct
  );
}

/**
 * Verifica si se puede crear una variación desde un producto
 */
export function canCreateVariation(
  productStatus: PreliminaryProductStatus,
  isBaseProduct?: boolean
): boolean {
  if (isBaseProduct) return true;
  return productStatus === "Aprobado" || productStatus === "Alta";
}

/**
 * Verifica si un campo está bloqueado en variaciones
 */
export function isLockedField(fieldName: string): boolean {
  const lockedFields = [
    "structureType",
    "blueprintFormat",
    "printType",
    "printClass",
    "layer1Material",
    "layer1Micron",
    "layer1Grammage",
    "layer2Material",
    "layer2Micron",
    "layer2Grammage",
    "layer3Material",
    "layer3Micron",
    "layer3Grammage",
    "layer4Material",
    "layer4Micron",
    "layer4Grammage",
    "grammage",
    "grammageTolerance",
    "referenceEmCode",
    "referenceEmVersion",
    "bomReference",
  ];
  return lockedFields.includes(fieldName);
}

/**
 * Calcula el estado resumen de productos del proyecto
 */
export function computeProjectProductSummaryStatus(
  products: any[]
): ProjectProductSummaryStatus {
  if (products.length === 0) {
    return "Sin productos";
  }

  const hasBase = products.some((p) => p.isBaseProduct);
  const hasVariations = products.some((p) => p.isDerived);
  const hasDesestimados = products.some((p) => p.status === "Desestimado");
  const inQuote = products.some((p) => p.status === "En Cotización");
  const approved = products.filter((p) => p.status === "Aprobado");
  const alta = products.filter((p) => p.status === "Alta");
  const activeProducts = products.filter((p) => p.status !== "Desestimado");

  if (hasDesestimados && activeProducts.length > 0) {
    return "Con desestimados";
  }

  if (alta.length === activeProducts.length && activeProducts.length > 0) {
    return "Alta completa";
  }

  if (alta.length > 0 && activeProducts.length > 0) {
    return "Alta parcial";
  }

  if (approved.length === activeProducts.length && activeProducts.length > 0) {
    return "Aprobados";
  }

  if (inQuote) {
    return "En cotización";
  }

  if (hasVariations) {
    return "Con variaciones";
  }

  if (hasBase && !hasVariations) {
    return "Producto base registrado";
  }

  return "Sin productos";
}

/**
 * Retorna las acciones disponibles para un estado de proyecto
 */
export function getActionsForProjectStatus(
  status: ProjectStatus
): string[] {
  switch (status) {
    case "Registrado":
    case "En Curso":
      return [];

    case "Ficha Completa":
      return ["solicitar-validacion"];

    case "En Validación":
      return ["aprobar-ag", "observar-ag", "aprobar-tecnica", "observar-tecnica"];

    case "Observado":
      return ["ver-observaciones"];

    case "Validado":
      return ["solicitar-cotizacion"];

    case "En Cotización":
      return ["enviar-cotizacion"];

    case "Cotización Enviada":
      return ["aprobar-cliente"];

    case "Aprobado por Cliente":
      return ["solicitar-tesoreria"];

    case "En Validación Tesorería":
      return ["aprobar-tesoreria", "observar-tesoreria", "rechazar-tesoreria"];

    case "Cliente Validado":
      return ["preparar-si"];

    case "Preparación SI":
      return ["enviar-si"];

    case "Enviado a SI":
      return [];

    case "Desestimado":
      return [];

    default:
      return [];
  }
}

/**
 * Normaliza los campos de workflow de un proyecto
 * Asegura que todos los campos requeridos tengan valores por defecto
 */
export function normalizeProjectWorkflow(project: any): any {
  const status = project.status || "Registrado";
  const stage = project.stage || resolveProjectStage(status as ProjectStatus);

  return {
    ...project,
    status,
    stage,
    completionPercentage: project.completionPercentage ?? 0,
    graphicArtsValidationStatus:
      project.graphicArtsValidationStatus || "Sin solicitar",
    technicalValidationStatus:
      project.technicalValidationStatus || "Sin solicitar",
    treasuryValidationStatus:
      project.treasuryValidationStatus || "No solicitado",
    currentValidationStep: project.currentValidationStep ?? null,
    validationRound: project.validationRound ?? 0,
    hasBasePreliminaryProduct: project.hasBasePreliminaryProduct ?? false,
    preliminaryProductIds: project.preliminaryProductIds ?? [],
  };
}

/**
 * Retorna las acciones disponibles para un estado de producto preliminar
 */
export function getActionsForProductStatus(
  status: PreliminaryProductStatus
): string[] {
  switch (status) {
    case "Registrado":
      return ["editar", "crear-variacion", "desestimar"];

    case "En Cotización":
      return ["editar", "crear-variacion", "desestimar"];

    case "Aprobado":
      return ["editar", "crear-variacion", "desestimar"];

    case "Alta":
      return ["crear-variacion"];

    case "Desestimado":
      return [];

    default:
      return [];
  }
}
