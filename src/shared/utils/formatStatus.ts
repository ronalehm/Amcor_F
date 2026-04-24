import type { ProjectStatus, ProjectTab } from "../types"

const STATUS_LABELS: Record<ProjectStatus, string> = {
  CREADO: "Creado",
  EN_PROCESO: "En proceso",
  VALIDACION_TECNICA: "Validación técnica",
  APROBADO: "Aprobado",
}

export function formatStatusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status] ?? String(status)
}

const STATUS_TO_TAB: Record<ProjectStatus, ProjectTab> = {
  CREADO: "borradores",
  EN_PROCESO: "activos",
  VALIDACION_TECNICA: "aprobaciones",
  APROBADO: "activos",
}

export function computeTabFromStatus(status: ProjectStatus): ProjectTab {
  return STATUS_TO_TAB[status] ?? "activos"
}
