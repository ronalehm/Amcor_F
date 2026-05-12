/* ============================================================================
   DEFINICIONES DE WORKFLOW - MÓDULO DE PROYECTOS ODISEO

   Este archivo centraliza toda la lógica de estados, etapas, validaciones
   y transiciones del flujo de proyectos en ODISEO.

   IMPORTANTE: ODISEO gestiona 4 etapas (P0-P3).
   NO se implementan P4-P5 (Sistema Integral) ni estados técnicos de SI.
   ============================================================================ */

// ============================================================================
// TIPOS PRINCIPALES: ETAPAS Y ESTADOS
// ============================================================================

export type ProjectStage =
  | "P1_PREPARACION_FICHA_PROYECTO"
  | "P2_VALIDACION_VIABILIDAD_TECNICA"
  | "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES";

export type ProjectStatus =
  | "Registrado"
  | "En Preparación"
  | "Ficha Completa"
  | "En validación"
  | "Observado"
  | "Validado"
  | "En Cotización"
  | "Cotización Completa"
  | "Aprobado por Cliente"
  | "Desestimado";

// ============================================================================
// TIPOS DE VALIDACIÓN TÉCNICA INTERNA
// ============================================================================

export type GraphicArtsValidationStatus =
  | "Sin solicitar"
  | "Aprobado automático"
  | "Revisión manual"
  | "En revisión"
  | "Observado"
  | "Validado";

export type TechnicalValidationStatus =
  | "Sin solicitar"
  | "Aprobado automático"
  | "Pendiente"
  | "En revisión"
  | "Observado"
  | "Validado";

export type TechnicalComplexity = "Baja" | "Alta";

export type TechnicalSubArea = "R&D Técnica" | "R&D Desarrollo";

export type CurrentValidationStep =
  | "Artes Gráficas"
  | "R&D Técnica"
  | "R&D Desarrollo"
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
  P1_PREPARACION_FICHA_PROYECTO: "P1 - Preparación de ficha de proyecto",
  P2_VALIDACION_VIABILIDAD_TECNICA: "P2 - Validación de viabilidad técnica",
  P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES: "P3 - Gestión comercial de productos preliminares",
};

export const PROJECT_STATUS_TO_STAGE: Record<ProjectStatus, ProjectStage> = {
  Registrado: "P1_PREPARACION_FICHA_PROYECTO",

  "En Preparación": "P1_PREPARACION_FICHA_PROYECTO",
  "Ficha Completa": "P1_PREPARACION_FICHA_PROYECTO",

  "En validación": "P2_VALIDACION_VIABILIDAD_TECNICA",
  Observado: "P2_VALIDACION_VIABILIDAD_TECNICA",
  Validado: "P2_VALIDACION_VIABILIDAD_TECNICA",

  "En Cotización": "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  "Cotización Completa": "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  "Aprobado por Cliente": "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",

  Desestimado: "P1_PREPARACION_FICHA_PROYECTO",
};

export const STAGE_STATUSES: Record<ProjectStage, ProjectStatus[]> = {
  P1_PREPARACION_FICHA_PROYECTO: [
    "Registrado",
    "En Preparación",
    "Ficha Completa",
  ],
  P2_VALIDACION_VIABILIDAD_TECNICA: ["En validación", "Observado", "Validado"],
  P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES: [
    "En Cotización",
    "Cotización Completa",
    "Aprobado por Cliente",
  ],
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
    "P1_PREPARACION_FICHA_PROYECTO",
    "P2_VALIDACION_VIABILIDAD_TECNICA",
    "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
  ];

  const fromIdx = stageSequence.indexOf(fromStage);
  const toIdx = stageSequence.indexOf(toStage);

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
  return "Revisión manual";
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
 * Retorna las acciones disponibles para un estado de proyecto
 */
export function getActionsForProjectStatus(
  status: ProjectStatus
): string[] {
  switch (status) {
    case "Registrado":
      return ["continuar-edicion"];

    case "En Preparación":
      return ["actualizar-proyecto"];

    case "Ficha Completa":
      return ["solicitar-validacion"];

    case "En validación":
      return ["ver-validaciones"];

    case "Observado":
      return ["ver-observaciones", "corregir-ficha"];

    case "Validado":
      return ["generar-producto-preliminar"];

    case "En Cotización":
      return ["ver-productos", "exportar-excel"];

    case "Cotización Completa":
      return ["registrar-aprobacion-cliente"];

    case "Aprobado por Cliente":
      return ["ver-resumen-aprobacion"];

    case "Desestimado":
      return ["ver-motivo-cierre"];

    default:
      return [];
  }
}

/**
 * Normaliza estados antiguos al modelo oficial
 * Usada para migraciones de datos
 */
export function normalizeProjectStatus(rawStatus?: string): ProjectStatus {
  if (!rawStatus) return "Registrado";

  const status = String(rawStatus).trim();

  switch (status) {
    case "Registrado":
      return "Registrado";

    case "En Curso":
    case "En preparación":
    case "En Preparación":
      return "En Preparación";

    case "Ficha completa":
    case "Ficha Completa":
      return "Ficha Completa";

    case "En Validación":
    case "En validación":
    case "En Evaluación":
    case "En evaluación":
      return "En validación";

    case "Observada":
    case "Observado":
      return "Observado";

    case "Lista para RFQ":
    case "Validado":
      return "Validado";

    case "En Cotización":
      return "En Cotización";

    case "Cotización Completa":
    case "Cotización completa":
    case "Cotización Enviada":
      return "Cotización Completa";

    case "Aprobado por Cliente":
      return "Aprobado por Cliente";

    case "Desestimado":
    case "Rechazado":
    case "Cancelado":
      return "Desestimado";

    default:
      return "Registrado";
  }
}

/**
 * Normaliza currentValidationStep a los valores estándar
 */
function normalizeCurrentValidationStep(value: any): CurrentValidationStep {
  if (!value) return null;
  if (value === "Artes Gráficas") return "Artes Gráficas";
  if (
    value === "Área Técnica" ||
    value === "Area Técnica" ||
    value === "Área_Técnica" ||
    value === "Area_Tecnica" ||
    value === "R&D Técnica"
  ) {
    return "R&D Técnica";
  }
  if (
    value === "Desarrollo R&D" ||
    value === "Desarrollo_RD" ||
    value === "Desarrollo RD" ||
    value === "R&D Desarrollo"
  ) {
    return "R&D Desarrollo";
  }
  return null;
}

/**
 * Normaliza technicalSubArea a los valores estándar
 */
function normalizeTechnicalSubArea(value: any): TechnicalSubArea | null {
  if (!value) return null;
  if (
    value === "Área Técnica" ||
    value === "Area Técnica" ||
    value === "Área_Técnica" ||
    value === "Area_Tecnica" ||
    value === "R&D Técnica"
  ) {
    return "R&D Técnica";
  }
  if (
    value === "Desarrollo R&D" ||
    value === "Desarrollo_RD" ||
    value === "Desarrollo RD" ||
    value === "R&D Desarrollo"
  ) {
    return "R&D Desarrollo";
  }
  return null;
}

/**
 * Resuelve la subárea técnica (R&D Técnica o R&D Desarrollo) basada en subclasificación
 */
export function resolveTechnicalSubAreaBySubclassification(
  subclassification?: string
): TechnicalSubArea | null {
  if (!subclassification) return null;

  const value = subclassification.trim();

  if (
    value === "Área_Técnica" ||
    value === "Area_Tecnica" ||
    value === "Área Técnica" ||
    value === "Area Tecnica"
  ) {
    return "R&D Técnica";
  }

  if (
    value === "Desarrollo_RD" ||
    value === "Desarrollo R&D" ||
    value === "Desarrollo RD"
  ) {
    return "R&D Desarrollo";
  }

  return null;
}

/**
 * Resuelve la subárea técnica basada en el tipo de proyecto
 */
export function resolveTechnicalSubAreaByProjectType(
  projectType?: string
): TechnicalSubArea | null {
  if (!projectType) return null;

  const type = projectType.trim();

  const rdDesarrolloTypes = [
    "Producto nuevo",
    "Nuevo equipamiento de envasado",
    "Nuevos insumos",
    "Nueva estructura",
    "Nuevo formato de envasado",
    "Nuevos accesorios",
    "Nuevos procesos por el lado del cliente",
    "Nuevas temperaturas de envasado y almacenaje",
  ];

  const rdTecnicaTypes = [
    "Extensión de línea por familia (EM de referencia)",
    "Modifica Dimensiones",
    "Modifica Propiedades",
    "Portafolio Estándar",
    "ICO (Intercompany), BCP (Business Continous Production)",
  ];

  if (rdDesarrolloTypes.includes(type)) {
    return "R&D Desarrollo";
  }

  if (rdTecnicaTypes.includes(type)) {
    return "R&D Técnica";
  }

  return null;
}

/**
 * Normaliza los campos de workflow de un proyecto
 * Asegura que todos los campos requeridos tengan valores por defecto
 * INCLUYE LÓGICA DEFENSIVA para corregir proyectos mal guardados
 */
export function normalizeProjectWorkflow(project: any): any {
  const rawStatus = project.status || "Registrado";
  let status = normalizeProjectStatus(rawStatus);

  // Detectar y normalizar technicalSubArea desde varios campos posibles
  let technicalSubArea: TechnicalSubArea | null =
    normalizeTechnicalSubArea(project.technicalSubArea) ||
    resolveTechnicalSubAreaByProjectType(project.projectType || project.tipoProyecto) ||
    resolveTechnicalSubAreaBySubclassification(
      project.subClassification ||
        project.subseccionClasificacion ||
        project.subsectionClassification ||
        project.technicalSubclassification
    );

  let technicalValidationStatus =
    project.technicalValidationStatus || "Sin solicitar";

  let currentValidationStep = normalizeCurrentValidationStep(
    project.currentValidationStep
  );

  // LÓGICA DEFENSIVA 1: Si R&D tiene "Aprobado automático", corregir a "Pendiente"
  const hasTechnicalArea =
    technicalSubArea === "R&D Técnica" ||
    technicalSubArea === "R&D Desarrollo";

  if (
    hasTechnicalArea &&
    technicalValidationStatus === "Aprobado automático"
  ) {
    technicalValidationStatus = "Pendiente";
  }

  // LÓGICA DEFENSIVA 2: Si status es "Validado" pero R&D no está validado, corregir
  if (
    status === "Validado" &&
    hasTechnicalArea &&
    technicalValidationStatus !== "Validado"
  ) {
    status = "En validación";
    currentValidationStep = technicalSubArea;
    technicalValidationStatus = "Pendiente";
  }

  // LÓGICA DEFENSIVA 3: Si está en validación sin currentValidationStep pero tiene R&D pendiente
  if (
    status === "En validación" &&
    !currentValidationStep &&
    hasTechnicalArea &&
    technicalValidationStatus !== "Validado"
  ) {
    currentValidationStep = technicalSubArea;
  }

  // LÓGICA DEFENSIVA 4: Si está en validación sin currentValidationStep pero AG está pendiente
  if (
    status === "En validación" &&
    !currentValidationStep &&
    (
      project.graphicArtsValidationStatus === "Revisión manual" ||
      project.graphicArtsValidationStatus === "En revisión"
    )
  ) {
    currentValidationStep = "Artes Gráficas";
  }

  const stage = resolveProjectStage(status);

  return {
    ...project,
    status,
    stage,
    completionPercentage: project.completionPercentage ?? 0,
    graphicArtsValidationStatus:
      project.graphicArtsValidationStatus || "Sin solicitar",
    technicalValidationStatus,
    currentValidationStep,
    technicalSubArea,
    validationRound: project.validationRound ?? 0,
    hasBasePreliminaryProduct: project.hasBasePreliminaryProduct ?? false,
    preliminaryProductIds: project.preliminaryProductIds ?? [],
    statusUpdatedAt: project.statusUpdatedAt ?? null,
    stageUpdatedAt: project.stageUpdatedAt ?? null,
    quoteStartedAt: project.quoteStartedAt ?? null,
    quoteCompletedAt: project.quoteCompletedAt ?? null,
    clientApprovedAt: project.clientApprovedAt ?? null,
    desestimatedAt: project.desestimatedAt ?? null,
    desestimatedReason: project.desestimatedReason ?? null,
  };
}

/**
 * Área responsable visible en UI
 */
export type ProjectResponsibleArea =
  | "Comercial"
  | "Artes Gráficas"
  | "R&D Técnica"
  | "R&D Desarrollo";

/**
 * Determina el área responsable de un proyecto basada en su estado actual
 * REGLA CRÍTICA: Proyectos en "En validación" NUNCA devuelven "Comercial"
 */
export function getResponsibleAreaForProject(
  project: any
): ProjectResponsibleArea {
  const normalizedProject = normalizeProjectWorkflow(project);
  const { status, currentValidationStep, graphicArtsValidationStatus, technicalSubArea, technicalValidationStatus } = normalizedProject;

  // No-validation statuses return "Comercial"
  if (status !== "En validación") {
    return "Comercial";
  }

  // Durante validación: Usa currentValidationStep como fuente de verdad
  if (currentValidationStep === "Artes Gráficas") {
    return "Artes Gráficas";
  }

  if (currentValidationStep === "R&D Técnica") {
    return "R&D Técnica";
  }

  if (currentValidationStep === "R&D Desarrollo") {
    return "R&D Desarrollo";
  }

  // Si no hay currentValidationStep, inferir del estado de AG
  if (
    graphicArtsValidationStatus === "Revisión manual" ||
    graphicArtsValidationStatus === "En revisión"
  ) {
    return "Artes Gráficas";
  }

  // Si AG está completo y hay área técnica, usar esa
  if (
    technicalSubArea === "R&D Técnica" &&
    technicalValidationStatus !== "Validado"
  ) {
    return "R&D Técnica";
  }

  if (
    technicalSubArea === "R&D Desarrollo" &&
    technicalValidationStatus !== "Validado"
  ) {
    return "R&D Desarrollo";
  }

  // Última opción: si está en validación sin determinación clara, usar Artes Gráficas
  return "Artes Gráficas";
}

/**
 * Verifica si un proyecto puede avanzar a estado "Validado"
 * Requiere que AMBAS validaciones (AG y R&D) estén completas
 */
export function canProjectBeValidated(project: any): boolean {
  const graphicArtsOk =
    project.graphicArtsValidationStatus === "Validado" ||
    project.graphicArtsValidationStatus === "Aprobado automático";

  const technicalOk = project.technicalValidationStatus === "Validado";

  return graphicArtsOk && technicalOk;
}

/**
 * Verifica si un valor es significativo (no vacío, no null, no undefined)
 */
function hasValue(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

/**
 * Verifica si existe al menos un dato EDITABLE en las secciones 2-6
 * Excluye campos heredados del portafolio y campos de solo lectura
 *
 * Solo considera campos que el usuario puede editar directamente
 */
export function hasAnyEditableSection2To6Data(project: any): boolean {
  // Campos editables de Sección 2: Producto Comercial
  const section2EditableFields = [
    "classification",
    "subClassification",
    "projectType",
    "blueprintFormat",
    "technicalApplication",
    "customerPackingCode",
  ];

  // Campos editables de Sección 3: Diseño
  const section3EditableFields = [
    "hasEdagReference",
    "requiresDesignWork",
    "printType",
    "printClass",
    "specialDesignComments",
    "designPlanFiles",
    "edagCode",
    "edagVersion",
    "referenceEdagCode",
    "referenceEdagVersion",
  ];

  // Campos editables de Sección 4: Estructura
  const section4EditableFields = [
    "hasReferenceStructure",
    "referenceEmCode",
    "referenceEmVersion",
    "structureType",
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
    "grammageTolerance",
    "grammage",
    "specialStructureSpecs",
  ];

  // Campos editables de Sección 5: Condiciones Comerciales
  const section5EditableFields = [
    "estimatedVolume",
    "unitOfMeasure",
    "targetPrice",
    "currencyType",
    "saleType",
    "incoterm",
    "destinationCountry",
    "customerAdditionalInfo",
  ];

  // Campos editables de Sección 6: Información Adicional
  const section6EditableFields = [
    "designPlanFiles",
    "deliveryAddress",
    "additionalComment",
    "licitacion",
    "codigoRFQ",
  ];

  const allEditableFields = [
    ...section2EditableFields,
    ...section3EditableFields,
    ...section4EditableFields,
    ...section5EditableFields,
    ...section6EditableFields,
  ];

  return allEditableFields.some((field) => hasValue(project[field]));
}

/**
 * Verifica si existe al menos un dato en las secciones 2-6 del proyecto
 * Sección 1: Datos básicos (obligatorios)
 * Sección 2: Portafolio / Productos
 * Sección 3: Ruta de diseño / Especificaciones de impresión
 * Sección 4: Dimensiones / Estructura
 * Sección 5: Especificaciones técnicas
 * Sección 6: Requisitos técnicos / Otros
 */
export function hasAnySection2To6Data(project: any): boolean {
  // Sección 2: Portfolio
  if (hasValue(project.portfolioCode) || hasValue(project.portfolioName)) {
    return true;
  }

  // Sección 3: Ruta de diseño y especificaciones de impresión
  if (
    hasValue(project.routeDescription) ||
    hasValue(project.designPath) ||
    hasValue(project.blueprintFormat) ||
    hasValue(project.printType) ||
    hasValue(project.colorSpecification) ||
    hasValue(project.colorSpecificationDetails) ||
    hasValue(project.coatings) ||
    hasValue(project.printingSpecifications)
  ) {
    return true;
  }

  // Sección 4: Dimensiones y estructura
  if (
    hasValue(project.width) ||
    hasValue(project.height) ||
    hasValue(project.depth) ||
    hasValue(project.structureType) ||
    hasValue(project.structureDescription) ||
    hasValue(project.materialType) ||
    hasValue(project.thicknessValue) ||
    hasValue(project.thicknessUnit) ||
    hasValue(project.flute) ||
    hasValue(project.liners) ||
    hasValue(project.density)
  ) {
    return true;
  }

  // Sección 5: Especificaciones técnicas
  if (
    hasValue(project.estimatedVolume) ||
    hasValue(project.unitOfMeasure) ||
    hasValue(project.targetPrice) ||
    hasValue(project.currencyType) ||
    hasValue(project.accessories) ||
    hasValue(project.specialRequirements) ||
    hasValue(project.technicalComplexity) ||
    hasValue(project.requiresDesignWork)
  ) {
    return true;
  }

  // Sección 6: Otros requisitos
  if (
    hasValue(project.observations) ||
    hasValue(project.additionalNotes) ||
    hasValue(project.closureMechanism) ||
    hasValue(project.printPosition) ||
    hasValue(project.dieCutSpecifications) ||
    hasValue(project.environmentalRequirements)
  ) {
    return true;
  }

  return false;
}

/**
 * Calcula el estado de preparación correcto basado en los datos completados
 *
 * - Registrado: Solo sección 1 (datos básicos) completada
 * - En Preparación: Al menos un campo EDITABLE de secciones 2-6, pero incompleto
 * - Ficha Completa: Todos los campos obligatorios de secciones 1-6 completados
 *
 * NO modifica estados avanzados (En validación, Observado, Validado, etc.)
 * NO considera campos heredados del portafolio como avance de secciones 2-6
 */
export function computeProjectPreparationStatus(params: {
  project: any;
  completionPercentage: number;
  currentStatus?: ProjectStatus;
}): ProjectStatus {
  const { project, completionPercentage, currentStatus } = params;

  // Definir estados avanzados que NO deben ser modificados automáticamente
  const advancedStatuses: ProjectStatus[] = [
    "En validación",
    "Observado",
    "Validado",
    "En Cotización",
    "Cotización Completa",
    "Aprobado por Cliente",
    "Desestimado",
  ];

  // Si el estado actual es avanzado, mantenerlo sin cambios
  if (currentStatus && advancedStatuses.includes(currentStatus)) {
    return currentStatus;
  }

  // Si completó 100% de campos obligatorios, es Ficha Completa
  if (completionPercentage === 100) {
    return "Ficha Completa";
  }

  // Si tiene datos EDITABLES en secciones 2-6, está en preparación
  // (excluye campos heredados y de solo lectura)
  if (hasAnyEditableSection2To6Data(project)) {
    return "En Preparación";
  }

  // Si solo tiene datos básicos (sección 1), es Registrado
  return "Registrado";
}

// ============================================================================
// VALIDACIÓN DE ARTES GRÁFICAS
// ============================================================================

/**
 * Helper para comparar "No aplica" ignorando mayúsculas y espacios
 */
function isNoAplica(value: unknown): boolean {
  return String(value || "").trim().toLowerCase() === "no aplica";
}

/**
 * Determina si la validación de Artes Gráficas debe ser manual
 * Retorna true si requiere validación manual (especificaciones != "No aplica")
 * Retorna false si puede ser automática (especificaciones = "No aplica")
 */
export function requiresManualGraphicArtsValidation(project: any): boolean {
  const specialSpecs =
    project.especificacionesEspeciales ||
    project.specialSpecifications ||
    project.specialDesignSpecs ||
    project.designSpecialSpecs ||
    "";

  return !isNoAplica(specialSpecs);
}

// Re-exportar funciones y tipos de producto desde projectProductWorkflow.ts
export {
  computeProjectProductSummaryStatus,
  getActionsForProductStatus,
  canCreateVariation,
  isLockedField,
  normalizePreliminaryProductStatus,
} from "./projectProductWorkflow";
