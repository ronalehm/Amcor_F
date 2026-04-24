export const CATALOGS = {
  AREAS: [
    { id: "COM", name: "Comercial" },
    { id: "RND", name: "R&D" },
    { id: "CX", name: "Customer Experience" },
    { id: "QA", name: "Calidad" },
    { id: "PROD", name: "Producción" },
    { id: "PRE", name: "Pre-Prensa" },
  ],
  PROJECT_STATUSES: [
    { id: "REGISTRADO", name: "Registrado", badgeType: "info" },
    { id: "EN_EVALUACION", name: "En Evaluación", badgeType: "warning" },
    { id: "OBSERVADO", name: "Observado", badgeType: "error" },
    { id: "EN_DESARROLLO", name: "En Desarrollo", badgeType: "info" },
    { id: "APROBADO", name: "Aprobado", badgeType: "success" },
    { id: "RECHAZADO", name: "Rechazado", badgeType: "error" },
  ],
  PORTFOLIO_STATUSES: [
    { id: "BORRADOR", name: "Borrador", badgeType: "neutral" },
    { id: "ACTIVO", name: "Activo", badgeType: "success" },
    { id: "INACTIVO", name: "Inactivo", badgeType: "error" },
  ],
  PRIORITIES: [
    { id: "LOW", name: "Baja" },
    { id: "MEDIUM", name: "Media" },
    { id: "HIGH", name: "Alta" },
  ],
  PROJECT_TYPES: [
    { id: "NUEVO", name: "Nuevo Producto" },
    { id: "MODIFICACION", name: "Modificación" },
    { id: "REPLICA", name: "Réplica" },
  ],
};

export function getAreas() {
  return CATALOGS.AREAS;
}

export function getProjectStatuses() {
  return CATALOGS.PROJECT_STATUSES;
}

export function getPortfolioStatuses() {
  return CATALOGS.PORTFOLIO_STATUSES;
}

export function getPriorities() {
  return CATALOGS.PRIORITIES;
}

export function getProjectTypes() {
  return CATALOGS.PROJECT_TYPES;
}
