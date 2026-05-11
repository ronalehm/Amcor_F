import { updateProjectRecord, type ProjectRecord } from "../../../shared/data/projectStorage";
import type { TechnicalSubArea } from "../../../shared/data/projectWorkflow";

/**
 * Resuelve la subárea técnica según la subclasificación del proyecto
 */
export function resolveTechnicalValidatorBySubclassification(
  subClassification?: string
): TechnicalSubArea {
  if (subClassification === "Área_Técnica") return "R&D Técnica";
  if (subClassification === "Desarrollo_RD") return "R&D Desarrollo";
  // Default a R&D Técnica si no está definido
  return "R&D Técnica";
}

/**
 * Determina si Artes Gráficas requiere validación manual
 */
export function requiresManualGraphicArtsReview(project: ProjectRecord): boolean {
  return !!(
    project.requiresDesignWork ||
    project.isPreviousDesign ||
    project.specialDesignComments ||
    project.specialDesignSpecs ||
    project.artworkAttachments ||
    project.hasDigitalFiles
  );
}

/**
 * Determina si R&D/Área Técnica requiere validación manual
 */
export function requiresManualTechnicalReview(project: ProjectRecord): boolean {
  return !!(
    project.technicalComplexity === "Alta"
  );
}

/**
 * Inicia la secuencia de validación de un proyecto
 * - Cambia status a "En validación"
 * - Determina el primer paso (AG manual o automático)
 * - Si AG es automático, deriva a una sola subárea técnica según subClassification
 */
export function requestValidation(project: ProjectRecord): ProjectRecord {
  const now = new Date().toISOString();
  const needsGraphicArtsManual = requiresManualGraphicArtsReview(project);

  let updated: ProjectRecord = {
    ...project,
    status: "En validación" as const,
    statusUpdatedAt: now,
    validationRound: (project.validationRound || 0) + 1,
  };

  if (needsGraphicArtsManual) {
    // AG requiere validación manual
    updated.graphicArtsValidationStatus = "Pendiente revisión manual";
    updated.currentValidationStep = "Artes Gráficas";
  } else {
    // AG es automático → derivar a la subárea técnica correspondiente
    updated.graphicArtsValidationStatus = "Aprobado automático";

    // Resolver subárea técnica basado en subClassification
    const subArea = resolveTechnicalValidatorBySubclassification(project.subClassification);

    updated.technicalSubArea = subArea;

    // Determinar si R&D es automático o manual
    const needsTechnicalManual = requiresManualTechnicalReview(project);
    if (needsTechnicalManual) {
      updated.technicalValidationStatus = "Pendiente";
      updated.currentValidationStep = subArea;
    } else {
      // Ambas automáticas → proyecto validado directamente
      updated.technicalValidationStatus = "Aprobado automático";
      updated.status = "Validado" as const;
      updated.currentValidationStep = null;
      updated.lastValidatedAt = now;
    }
  }

  updateProjectRecord(project.code, updated);
  return updated;
}

/**
 * Registra una observación en el proyecto desde un área específica
 * El proyecto pasa a "Observado"
 */
export function observeProject(
  project: ProjectRecord,
  area: "Artes Gráficas" | "R&D Técnica" | "R&D Desarrollo",
  comment: string
): ProjectRecord {
  const now = new Date().toISOString();

  let updated: ProjectRecord = {
    ...project,
    status: "Observado" as const,
    statusUpdatedAt: now,
    lastObservationSource: area,
    lastObservationComment: comment,
    lastObservationAt: now,
    validationRound: (project.validationRound || 0) + 1,
  };

  // Marcar el area correspondiente como "Observado"
  if (area === "Artes Gráficas") {
    updated.graphicArtsValidationStatus = "Observado";
  } else {
    updated.technicalValidationStatus = "Observado";
  }

  updateProjectRecord(project.code, updated);
  return updated;
}

/**
 * Valida un proyecto desde un área específica
 * Después de AG validado, solo una subárea técnica puede validar
 */
export function approveValidation(
  project: ProjectRecord,
  area: "Artes Gráficas" | "R&D Técnica" | "R&D Desarrollo",
  comment?: string
): ProjectRecord {
  const now = new Date().toISOString();

  let updated: ProjectRecord = {
    ...project,
  };

  if (area === "Artes Gráficas") {
    // Validar Artes Gráficas y derivar a una sola subárea técnica
    updated.graphicArtsValidationStatus = "Validado";

    // Resolver subárea técnica basado en subClassification
    const subArea = resolveTechnicalValidatorBySubclassification(project.subClassification);

    updated.technicalSubArea = subArea;

    // Determinar si R&D es automático o manual
    const needsTechnicalManual = requiresManualTechnicalReview(project);
    if (needsTechnicalManual) {
      updated.technicalValidationStatus = "Pendiente";
      updated.currentValidationStep = subArea;
    } else {
      // R&D automático → proyecto validado
      updated.technicalValidationStatus = "Aprobado automático";
      updated.status = "Validado" as const;
      updated.currentValidationStep = null;
      updated.lastValidatedAt = now;
    }
  } else {
    // R&D Técnica o R&D Desarrollo validando
    // Solo la subárea técnica asignada puede validar
    updated.technicalValidationStatus = "Validado";

    // Verificar si AG ya está OK
    const graphicArtsOk =
      project.graphicArtsValidationStatus === "Validado" ||
      project.graphicArtsValidationStatus === "Aprobado automático";

    if (graphicArtsOk) {
      // Ambas validaciones OK → proyecto validado
      updated.status = "Validado" as const;
      updated.currentValidationStep = null;
      updated.lastValidatedAt = now;
    }
  }

  if (comment) {
    updated.lastObservationComment = comment;
  }

  updated.statusUpdatedAt = now;
  updateProjectRecord(project.code, updated);
  return updated;
}
