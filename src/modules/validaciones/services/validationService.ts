import {
  resolveProjectStage,
  type CurrentValidationStep,
  type TechnicalSubArea,
} from "../../../shared/data/projectWorkflow";
import { updateProjectRecord, type ProjectRecord } from "../../../shared/data/projectStorage";
import { recordValidationEvent } from "../../../shared/data/validationHistoryStorage";

export type ValidationArea =
  | "Artes Gráficas"
  | "R&D Técnica"
  | "R&D Desarrollo";

export type ValidationActionResult = {
  ok: boolean;
  project?: ProjectRecord;
  message?: string;
};

/* ============================================================================
   HELPERS GENERALES
   ============================================================================ */

function getProjectCode(project: ProjectRecord): string {
  return String(project.code || project.id || "");
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeLower(value: unknown): string {
  return normalizeText(value).toLowerCase();
}

function isNoAplica(value: unknown): boolean {
  return normalizeLower(value) === "no aplica";
}

function getSpecialSpecifications(project: ProjectRecord): string {
  return normalizeText(
    project.specialDesignSpecs ||
      project.specialDesignComments ||
      ""
  );
}

function getSubclassification(project: ProjectRecord): string {
  return normalizeText(project.subClassification || "");
}

function getNow(): string {
  return new Date().toISOString();
}

function persistProject(project: ProjectRecord): ProjectRecord {
  const projectCode = getProjectCode(project);

  if (!projectCode) {
    throw new Error("No se pudo actualizar el proyecto porque no tiene código.");
  }

  updateProjectRecord(projectCode, project);
  return project;
}

/* ============================================================================
   REGLAS DE ARTES GRÁFICAS
   ============================================================================ */

/**
 * Regla oficial:
 * - Especificaciones Especiales = "No aplica" => Artes Gráficas automático.
 * - Cualquier otro valor => Artes Gráficas manual.
 */
export function requiresManualGraphicArtsReview(
  project: ProjectRecord
): boolean {
  const specialSpecifications = getSpecialSpecifications(project);
  return !isNoAplica(specialSpecifications);
}

export function isGraphicArtsApproved(project: ProjectRecord): boolean {
  return (
    project.graphicArtsValidationStatus === "Validado" ||
    project.graphicArtsValidationStatus === "Aprobado automático"
  );
}

/* ============================================================================
   DERIVACIÓN TÉCNICA
   ============================================================================ */

/**
 * Regla oficial:
 * - Área_Técnica => R&D Técnica
 * - Desarrollo_RD => R&D Desarrollo
 *
 * Importante:
 * No devolver R&D Técnica por defecto.
 * Si no se puede resolver, devolver null para evitar validar mal el flujo.
 */
export function resolveTechnicalValidatorBySubclassification(
  subClassification?: string
): TechnicalSubArea | null {
  const value = normalizeText(subClassification);

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

export function resolveTechnicalValidatorForProject(
  project: ProjectRecord
): TechnicalSubArea {
  const subArea = resolveTechnicalValidatorBySubclassification(
    getSubclassification(project)
  );

  if (!subArea) {
    throw new Error(
      "No se pudo derivar a R&D porque falta la Subsección Clasificación."
    );
  }

  return subArea;
}

export function isTechnicalValidationApproved(
  project: ProjectRecord
): boolean {
  return project.technicalValidationStatus === "Validado";
}

/**
 * El proyecto solo queda Validado cuando:
 * - Artes Gráficas está Validado o Aprobado automático.
 * - R&D Técnica o R&D Desarrollo está Validado.
 *
 * R&D NO debe aprobarse automáticamente.
 */
export function canProjectBeValidated(project: ProjectRecord): boolean {
  return isGraphicArtsApproved(project) && isTechnicalValidationApproved(project);
}

function assertAssignedTechnicalArea(
  project: ProjectRecord,
  area: ValidationArea
): void {
  if (area !== "R&D Técnica" && area !== "R&D Desarrollo") return;

  const assignedArea = project.technicalSubArea || project.currentValidationStep;

  if (assignedArea !== area) {
    throw new Error(
      `Este proyecto está asignado a ${
        assignedArea || "sin subárea técnica"
      }, no a ${area}.`
    );
  }
}

/* ============================================================================
   SOLICITUD DE VALIDACIÓN
   ============================================================================ */

/**
 * Se ejecuta cuando el Ejecutivo Comercial presiona "Solicitar validación".
 *
 * Flujo:
 * 1. El proyecto pasa a "En validación".
 * 2. Si Artes Gráficas requiere revisión manual:
 *    - currentValidationStep = "Artes Gráficas"
 *    - technicalValidationStatus = "Sin solicitar"
 *
 * 3. Si Artes Gráficas es automática:
 *    - graphicArtsValidationStatus = "Aprobado automático"
 *    - deriva inmediatamente a R&D Técnica o R&D Desarrollo
 *    - technicalValidationStatus = "Pendiente"
 *
 * Importante:
 * Artes Gráficas automática NO significa Proyecto Validado.
 * R&D siempre queda Pendiente cuando se deriva.
 */
export function requestValidation(project: ProjectRecord): ProjectRecord {
  const now = getNow();
  const needsGraphicArtsManual = requiresManualGraphicArtsReview(project);

  let updated: ProjectRecord = {
    ...project,
    status: "En validación",
    stage: resolveProjectStage("En validación"),
    statusUpdatedAt: now,
    stageUpdatedAt: now,
    updatedAt: now,
    validationRound: Number(project.validationRound || 0) + 1,
  };

  if (needsGraphicArtsManual) {
    updated = {
      ...updated,
      graphicArtsValidationStatus: "Pendiente revisión manual",
      currentValidationStep: "Artes Gráficas" as CurrentValidationStep,
      technicalSubArea: undefined,
      technicalValidationStatus: "Sin solicitar",
    };

    const saved = persistProject(updated);

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: "validation_requested",
      fromStatus: project.status,
      toStatus: "En validación",
      toValidationStep: "Artes Gráficas",
      graphicArtsStatus: "Pendiente revisión manual",
      technicalStatus: "Sin solicitar",
      validationRound: saved.validationRound,
    });

    return saved;
  }

  const subArea = resolveTechnicalValidatorForProject(updated);

  updated = {
    ...updated,
    graphicArtsValidationStatus: "Aprobado automático",
    graphicArtsValidatedAt: now,

    technicalSubArea: subArea,
    currentValidationStep: subArea,
    technicalValidationStatus: "Pendiente",

    status: "En validación",
    stage: resolveProjectStage("En validación"),
    statusUpdatedAt: now,
    stageUpdatedAt: now,
  };

  const saved = persistProject(updated);

  recordValidationEvent({
    projectCode: getProjectCode(project),
    timestamp: now,
    eventType: "validation_requested",
    fromStatus: project.status,
    toStatus: "En validación",
    graphicArtsStatus: "Aprobado automático",
    toValidationStep: subArea,
    technicalSubArea: subArea,
    technicalStatus: "Pendiente",
    isAutomatic: true,
    validationRound: saved.validationRound,
  });

  recordValidationEvent({
    projectCode: getProjectCode(project),
    timestamp: now,
    eventType: subArea === "R&D Técnica" ? "derived_to_rnd_tecnica" : "derived_to_rnd_desarrollo",
    fromValidationStep: "Artes Gráficas",
    toValidationStep: subArea,
    graphicArtsStatus: "Aprobado automático",
    technicalSubArea: subArea,
    technicalStatus: "Pendiente",
    validationRound: saved.validationRound,
  });

  return saved;
}

/* ============================================================================
   TOMAR EN REVISIÓN
   ============================================================================ */

export function startValidationReview(
  project: ProjectRecord,
  area: ValidationArea
): ProjectRecord {
  const now = getNow();

  let updated: ProjectRecord = {
    ...project,
    status: "En validación",
    stage: resolveProjectStage("En validación"),
    updatedAt: now,
  };

  if (area === "Artes Gráficas") {
    updated = {
      ...updated,
      graphicArtsValidationStatus: "En revisión",
      currentValidationStep: "Artes Gráficas",
    };

    return persistProject(updated);
  }

  assertAssignedTechnicalArea(project, area);

  updated = {
    ...updated,
    technicalSubArea: area,
    technicalValidationStatus: "En revisión",
    currentValidationStep: area,
  };

  return persistProject(updated);
}

/* ============================================================================
   APROBAR VALIDACIÓN
   ============================================================================ */

/**
 * Reglas:
 *
 * 1. Si valida Artes Gráficas:
 *    - NO se valida el proyecto.
 *    - Se deriva a R&D Técnica o R&D Desarrollo.
 *    - technicalValidationStatus queda "Pendiente".
 *
 * 2. Si valida R&D Técnica o R&D Desarrollo:
 *    - Recién ahí el proyecto pasa a "Validado",
 *      siempre que Artes Gráficas ya esté aprobada.
 */
export function approveValidation(
  project: ProjectRecord,
  area: ValidationArea,
  comment?: string
): ProjectRecord {
  const now = getNow();

  let updated: ProjectRecord = {
    ...project,
    updatedAt: now,
    validationComment: comment || project.validationComment,
  };

  if (area === "Artes Gráficas") {
    const subArea = resolveTechnicalValidatorForProject(project);

    updated = {
      ...updated,
      graphicArtsValidationStatus: "Validado",
      graphicArtsValidatedAt: now,
      graphicArtsValidationComment: comment || "",

      technicalSubArea: subArea,
      currentValidationStep: subArea,
      technicalValidationStatus: "Pendiente",

      status: "En validación",
      stage: resolveProjectStage("En validación"),
      statusUpdatedAt: now,
      stageUpdatedAt: now,
    };

    const saved = persistProject(updated);

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: "graphic_arts_approved",
      fromStatus: project.status,
      toStatus: "En validación",
      fromValidationStep: project.currentValidationStep,
      toValidationStep: subArea,
      graphicArtsStatus: "Validado",
      technicalSubArea: subArea,
      technicalStatus: "Pendiente",
      comment,
    });

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: subArea === "R&D Técnica" ? "derived_to_rnd_tecnica" : "derived_to_rnd_desarrollo",
      fromValidationStep: "Artes Gráficas",
      toValidationStep: subArea,
      graphicArtsStatus: "Validado",
      technicalSubArea: subArea,
      technicalStatus: "Pendiente",
    });

    return saved;
  }

  if (area === "R&D Técnica" || area === "R&D Desarrollo") {
    assertAssignedTechnicalArea(project, area);

    const graphicArtsOk =
      project.graphicArtsValidationStatus === "Validado" ||
      project.graphicArtsValidationStatus === "Aprobado automático";

    if (!graphicArtsOk) {
      throw new Error(
        "No se puede validar R&D porque Artes Gráficas aún no está aprobada."
      );
    }

    updated = {
      ...updated,
      technicalSubArea: area,
      technicalValidationStatus: "Validado",
      technicalValidatedAt: now,
      technicalValidationComment: comment || "",

      currentValidationStep: null,
      status: "Validado",
      stage: resolveProjectStage("Validado"),
      statusUpdatedAt: now,
      stageUpdatedAt: now,
      lastValidatedAt: now,
    };

    const saved = persistProject(updated);

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: "rnd_approved",
      fromStatus: project.status,
      toStatus: "Validado",
      fromValidationStep: project.currentValidationStep,
      graphicArtsStatus: project.graphicArtsValidationStatus,
      technicalSubArea: area,
      technicalStatus: "Validado",
      comment,
    });

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: "project_validated",
      fromStatus: "En validación",
      toStatus: "Validado",
      graphicArtsStatus: project.graphicArtsValidationStatus,
      technicalSubArea: area,
      technicalStatus: "Validado",
      comment: "✅ Proyecto completamente validado",
    });

    return saved;
  }

  return persistProject(updated);
}

/* ============================================================================
   OBSERVAR VALIDACIÓN
   ============================================================================ */

export function observeValidation(
  project: ProjectRecord,
  area: ValidationArea,
  comment: string
): ProjectRecord {
  const trimmedComment = normalizeText(comment);

  if (!trimmedComment) {
    throw new Error("El comentario es obligatorio para observar la validación.");
  }

  const now = getNow();

  let updated: ProjectRecord = {
    ...project,
    status: "Observado",
    stage: resolveProjectStage("Observado"),
    statusUpdatedAt: now,
    stageUpdatedAt: now,
    updatedAt: now,
    lastObservationSource: area,
    lastObservationComment: trimmedComment,
    lastObservationAt: now,
  };

  if (area === "Artes Gráficas") {
    updated = {
      ...updated,
      graphicArtsValidationStatus: "Observado",
      currentValidationStep: "Artes Gráficas",
    };

    const saved = persistProject(updated);

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: "graphic_arts_observed",
      fromStatus: project.status,
      toStatus: "Observado",
      fromValidationStep: project.currentValidationStep,
      toValidationStep: "Artes Gráficas",
      graphicArtsStatus: "Observado",
      comment: trimmedComment,
      observation: trimmedComment,
    });

    return saved;
  }

  if (area === "R&D Técnica" || area === "R&D Desarrollo") {
    assertAssignedTechnicalArea(project, area);

    updated = {
      ...updated,
      technicalSubArea: area,
      technicalValidationStatus: "Observado",
      currentValidationStep: area,
    };

    const saved = persistProject(updated);

    recordValidationEvent({
      projectCode: getProjectCode(project),
      timestamp: now,
      eventType: "rnd_observed",
      fromStatus: project.status,
      toStatus: "Observado",
      fromValidationStep: project.currentValidationStep,
      toValidationStep: area,
      technicalSubArea: area,
      technicalStatus: "Observado",
      comment: trimmedComment,
      observation: trimmedComment,
    });

    return saved;
  }

  return persistProject(updated);
}

/* ============================================================================
   COMPATIBILIDAD: observeProject
   ============================================================================ */

/**
 * Alias para componentes antiguos que todavía llamen observeProject().
 */
export function observeProject(
  project: ProjectRecord,
  area: ValidationArea,
  comment: string
): ProjectRecord {
  return observeValidation(project, area, comment);
}

/* ============================================================================
   CORRECCIÓN / REENVÍO DESPUÉS DE OBSERVADO
   ============================================================================ */

/**
 * Cuando el Ejecutivo corrige una ficha observada, debe volver a Ficha Completa
 * para que pueda solicitar validación nuevamente.
 */
export function returnObservedProjectToComplete(
  project: ProjectRecord
): ProjectRecord {
  const now = getNow();

  const updated: ProjectRecord = {
    ...project,
    status: "Ficha Completa",
    stage: resolveProjectStage("Ficha Completa"),
    statusUpdatedAt: now,
    stageUpdatedAt: now,
    updatedAt: now,
    currentValidationStep: null,
  };

  return persistProject(updated);
}

/* ============================================================================
   UTILIDADES PARA UI
   ============================================================================ */

export function getValidationAreaForProject(
  project: ProjectRecord
): ValidationArea | null {
  if (project.status !== "En validación") return null;

  if (project.currentValidationStep === "Artes Gráficas") {
    return "Artes Gráficas";
  }

  if (project.currentValidationStep === "R&D Técnica") {
    return "R&D Técnica";
  }

  if (project.currentValidationStep === "R&D Desarrollo") {
    return "R&D Desarrollo";
  }

  if (
    project.graphicArtsValidationStatus === "Pendiente revisión manual" ||
    project.graphicArtsValidationStatus === "En revisión"
  ) {
    return "Artes Gráficas";
  }

  if (
    project.technicalSubArea === "R&D Técnica" &&
    (project.technicalValidationStatus === "Pendiente" ||
      project.technicalValidationStatus === "En revisión")
  ) {
    return "R&D Técnica";
  }

  if (
    project.technicalSubArea === "R&D Desarrollo" &&
    (project.technicalValidationStatus === "Pendiente" ||
      project.technicalValidationStatus === "En revisión")
  ) {
    return "R&D Desarrollo";
  }

  return null;
}

export function isProjectPendingValidation(project: ProjectRecord): boolean {
  return Boolean(getValidationAreaForProject(project));
}