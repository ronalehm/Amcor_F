// Etapas del Proyecto (P0-P5 en el portal ODISEO)
export type ProjectStage =
  | "P0_REGISTRO_COMERCIAL"
  | "P1_PREPARACION_FICHA"
  | "P2_VALIDACION_INTERNA"
  | "P3_COTIZACION_APROBACION_CLIENTE"
  | "P4_VALIDACION_COMERCIAL_TESORERIA"
  | "P5_PREPARACION_ENVIO_SI";

export type WorkflowProjectStage = ProjectStage; // Alias para compatibilidad

// Estados del Proyecto (14 estados específicos)
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

export type WorkflowProjectStatus = ProjectStatus; // Alias para compatibilidad

// Estados internos de validación por área
export type AreaValidationStatus =
  | "Sin solicitar"
  | "Pendiente"
  | "En revisión"
  | "Observado"
  | "Aprobado";

// Estados de validación de Tesorería
export type TreasuryValidationStatus =
  | "No solicitado"
  | "Pendiente"
  | "En revisión"
  | "Observado"
  | "Aprobado"
  | "Rechazado";

// Estados de productos asociados al proyecto
export type ProjectProductStatus =
  | "Solicitado"
  | "En Preparación"
  | "Listo para SI"
  | "Enviado a SI"
  | "Recibido por SI"
  | "Ficha Preliminar Creada en SI"
  | "En Proceso SI"
  | "Observado / Bloqueado en SI"
  | "Aprobado"
  | "Dado de Alta"
  | "Desestimado";

// Tipos de productos asociados
export type ProjectProductType =
  | "Nuevo"
  | "Repetido"
  | "Modificado"
  | "Variante";

// Resumen del estado de productos en el proyecto
export type ProjectProductSummaryStatus =
  | "Sin productos"
  | "Productos en preparación"
  | "Productos listos para SI"
  | "Envío parcial a SI"
  | "Todos enviados a SI"
  | "Alta parcial"
  | "Alta completa"
  | "Con bloqueos en SI";

// Labels de las etapas
export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  P0_REGISTRO_COMERCIAL: "P0 - Registro comercial",
  P1_PREPARACION_FICHA: "P1 - Preparación de ficha",
  P2_VALIDACION_INTERNA: "P2 - Validación interna",
  P3_COTIZACION_APROBACION_CLIENTE: "P3 - Cotización y aprobación cliente",
  P4_VALIDACION_COMERCIAL_TESORERIA: "P4 - Validación comercial / Tesorería",
  P5_PREPARACION_ENVIO_SI: "P5 - Preparación y envío a Sistema Integral",
};

// Mapeo de estado del proyecto a su etapa
export const PROJECT_STATUS_TO_STAGE: Record<ProjectStatus, ProjectStage> = {
  "Registrado": "P0_REGISTRO_COMERCIAL",
  "En Curso": "P1_PREPARACION_FICHA",
  "Ficha Completa": "P1_PREPARACION_FICHA",
  "En Validación": "P2_VALIDACION_INTERNA",
  "Observado": "P2_VALIDACION_INTERNA",
  "Validado": "P2_VALIDACION_INTERNA",
  "En Cotización": "P3_COTIZACION_APROBACION_CLIENTE",
  "Cotización Enviada": "P3_COTIZACION_APROBACION_CLIENTE",
  "Aprobado por Cliente": "P3_COTIZACION_APROBACION_CLIENTE",
  "En Validación Tesorería": "P4_VALIDACION_COMERCIAL_TESORERIA",
  "Cliente Validado": "P4_VALIDACION_COMERCIAL_TESORERIA",
  "Preparación SI": "P5_PREPARACION_ENVIO_SI",
  "Enviado a SI": "P5_PREPARACION_ENVIO_SI",
  "Desestimado": "P0_REGISTRO_COMERCIAL",
};

// Mapeo inverso: etapa → posibles estados
export const STAGE_STATUSES: Record<ProjectStage, ProjectStatus[]> = {
  P0_REGISTRO_COMERCIAL: ["Registrado", "Desestimado"],
  P1_PREPARACION_FICHA: ["En Curso", "Ficha Completa"],
  P2_VALIDACION_INTERNA: ["En Validación", "Observado", "Validado"],
  P3_COTIZACION_APROBACION_CLIENTE: ["En Cotización", "Cotización Enviada", "Aprobado por Cliente"],
  P4_VALIDACION_COMERCIAL_TESORERIA: ["En Validación Tesorería", "Cliente Validado"],
  P5_PREPARACION_ENVIO_SI: ["Preparación SI", "Enviado a SI"],
};

// Función: obtener etapa a partir de estado
export function resolveStageFromStatus(status: ProjectStatus): ProjectStage {
  return PROJECT_STATUS_TO_STAGE[status];
}

// Función: obtener estados válidos para una etapa
export function getStatusesForStage(stage: ProjectStage): ProjectStatus[] {
  return STAGE_STATUSES[stage];
}

// Función: verificar si se puede avanzar de un estado a otro
export function canAdvanceTo(fromStatus: ProjectStatus, toStatus: ProjectStatus): boolean {
  const fromStage = resolveStageFromStatus(fromStatus);
  const toStage = resolveStageFromStatus(toStatus);

  // Etapas válidas en orden de progresión
  const stageOrder: ProjectStage[] = [
    "P0_REGISTRO_COMERCIAL",
    "P1_PREPARACION_FICHA",
    "P2_VALIDACION_INTERNA",
    "P3_COTIZACION_APROBACION_CLIENTE",
    "P4_VALIDACION_COMERCIAL_TESORERIA",
    "P5_PREPARACION_ENVIO_SI",
  ];

  const fromIndex = stageOrder.indexOf(fromStage);
  const toIndex = stageOrder.indexOf(toStage);

  // Permitir permanecer en la misma etapa o avanzar
  if (toIndex > fromIndex) return true;
  if (toIndex === fromIndex) return getStatusesForStage(fromStage).includes(toStatus);
  return false;
}

// Función: puede enviarse producto a SI según estado del proyecto
export function canSendProductToSi(projectStatus: ProjectStatus): boolean {
  return [
    "Cliente Validado",
    "Preparación SI",
    "Enviado a SI",
  ].includes(projectStatus);
}

// Función: puede crearse producto según estado del proyecto
export function canCreateProduct(projectStatus: ProjectStatus): boolean {
  return projectStatus !== "Desestimado";
}

// Función: resolver estado P2 a partir de validaciones de área
export function resolveP2ValidationStatus(
  rdStatus: AreaValidationStatus,
  agStatus: AreaValidationStatus
): AreaValidationStatus {
  // Si alguna está observada, el resultado es observado
  if (rdStatus === "Observado" || agStatus === "Observado") return "Observado";
  // Si ambas están aprobadas, resultado aprobado
  if (rdStatus === "Aprobado" && agStatus === "Aprobado") return "Aprobado";
  // Si ambas están pendientes o en revisión, en revisión
  if (rdStatus === "Pendiente" || agStatus === "Pendiente" ||
      rdStatus === "En revisión" || agStatus === "En revisión") {
    return "En revisión";
  }
  return "Sin solicitar";
}

// Función: calcular estado del proyecto a partir de validaciones P2
export function computeProjectStatusFromP2Validations(
  rdStatus: AreaValidationStatus,
  agStatus: AreaValidationStatus
): ProjectStatus {
  // Solo "Validado" si ambas aprueban
  if (rdStatus === "Aprobado" && agStatus === "Aprobado") return "Validado";
  // "Observado" si al menos una está observada
  if (rdStatus === "Observado" || agStatus === "Observado") return "Observado";
  // "En Validación" si está en proceso
  return "En Validación";
}

// Función: puede crearse producto desde uno aprobado
export function canCreateProductFromApprovedProduct(
  projectStatus: ProjectStatus,
  productStatus: ProjectProductStatus
): boolean {
  if (projectStatus === "Desestimado") return false;
  return [
    "Aprobado",
    "Dado de Alta",
    "Ficha Preliminar Creada en SI",
    "En Proceso SI",
  ].includes(productStatus);
}

// Función: calcular resumen del estado de productos
export function computeProductSummaryStatus(
  products: Array<{ status: ProjectProductStatus }>
): ProjectProductSummaryStatus {
  if (products.length === 0) return "Sin productos";

  const statuses = products.map(p => p.status);
  const hasBlocked = statuses.some(s => s === "Observado / Bloqueado en SI");
  const hasPreparing = statuses.some(s => s === "Solicitado" || s === "En Preparación");
  const hasReady = statuses.some(s => s === "Listo para SI");
  const hasSent = statuses.some(s => s === "Enviado a SI" || s === "Recibido por SI");
  const hasHighStatus = statuses.some(s =>
    s === "Aprobado" || s === "Ficha Preliminar Creada en SI" || s === "En Proceso SI" || s === "Dado de Alta"
  );

  if (hasBlocked) return "Con bloqueos en SI";
  if (hasPreparing && !hasSent && !hasHighStatus) return "Productos en preparación";
  if (hasReady && !hasSent && !hasHighStatus) return "Productos listos para SI";
  if (hasSent && !hasHighStatus) return "Envío parcial a SI";
  if (hasSent && hasHighStatus && statuses.some(s => s !== "Dado de Alta" && s !== "Aprobado" && s !== "Desestimado")) return "Alta parcial";
  if (statuses.every(s => s === "Aprobado" || s === "Dado de Alta" || s === "Desestimado")) return "Alta completa";
  if (statuses.every(s => s === "Enviado a SI" || s === "Recibido por SI" ||
                         s === "Ficha Preliminar Creada en SI" || s === "En Proceso SI" || s === "Aprobado" || s === "Dado de Alta")) {
    return "Todos enviados a SI";
  }

  return "Productos en preparación";
}

// Función: obtener acciones disponibles para un estado de proyecto
export function getActionsForProjectStatus(status: ProjectStatus): string[] {
  const actions: Record<ProjectStatus, string[]> = {
    "Registrado": ["Continuar edición"],
    "En Curso": ["Actualizar proyecto"],
    "Ficha Completa": ["Solicitar validación"],
    "En Validación": ["Ver validaciones"],
    "Observado": ["Corregir ficha", "Actualizar proyecto"],
    "Validado": ["Solicitar cotización"],
    "En Cotización": ["Registrar cotización", "Enviar cotización al cliente"],
    "Cotización Enviada": ["Registrar aprobación del cliente", "Desestimar"],
    "Aprobado por Cliente": ["Solicitar validación Tesorería"],
    "En Validación Tesorería": ["Ver estado Tesorería"],
    "Cliente Validado": ["Preparar envío a SI"],
    "Preparación SI": ["Enviar productos a Sistema Integral"],
    "Enviado a SI": ["Ver seguimiento SI", "Crear producto adicional", "Crear producto desde aprobado"],
    "Desestimado": ["Ver motivo de cierre"],
  };
  return actions[status] || [];
}

// Función: obtener acciones disponibles para un estado de producto
export function getActionsForProductStatus(status: ProjectProductStatus): string[] {
  const actions: Record<ProjectProductStatus, string[]> = {
    "Solicitado": ["Completar información", "Desestimar producto"],
    "En Preparación": ["Actualizar producto", "Marcar listo para SI"],
    "Listo para SI": ["Enviar producto a SI"],
    "Enviado a SI": ["Ver envío"],
    "Recibido por SI": ["Ver seguimiento SI"],
    "Ficha Preliminar Creada en SI": ["Ver ficha SI"],
    "En Proceso SI": ["Ver seguimiento SI"],
    "Observado / Bloqueado en SI": ["Ver observación", "Reenviar información si aplica"],
    "Aprobado": ["Ver detalles", "Crear producto desde aprobado"],
    "Dado de Alta": ["Ver SKU", "Crear producto desde aprobado"],
    "Desestimado": ["Ver motivo"],
  };
  return actions[status] || [];
}

// Estados legacy de ODISEO (para compatibilidad hacia atrás)
export type LegacyProjectStatus =
  | "Borrador"
  | "Registrado"
  | "Ficha en proceso"
  | "Ficha completa"
  | "Pendiente de validación"
  | "En validación"
  | "Observada"
  | "Rechazada"
  | "Validada por áreas"
  | "Lista para RFQ"
  | "Pendiente de precio"
  | "Precio cargado"
  | "Ficha aprobada"
  | "Aprobado"
  | "Dado de alta"
  | "Desestimado"
  | "Aprobado para fabricación"
  | "Aprobado para muestra";

// Función: mapear estados legacy al nuevo modelo
export function mapLegacyStatusToNew(legacyStatus: LegacyProjectStatus): ProjectStatus {
  const mapping: Record<LegacyProjectStatus, ProjectStatus> = {
    "Borrador": "Registrado",
    "Registrado": "Registrado",
    "Ficha en proceso": "En Curso",
    "Ficha completa": "Ficha Completa",
    "Pendiente de validación": "En Validación",
    "En validación": "En Validación",
    "Observada": "Observado",
    "Rechazada": "Desestimado",
    "Validada por áreas": "Validado",
    "Lista para RFQ": "En Cotización",
    "Pendiente de precio": "En Cotización",
    "Precio cargado": "Cotización Enviada",
    "Ficha aprobada": "Aprobado por Cliente",
    "Aprobado": "Aprobado por Cliente",
    "Dado de alta": "Enviado a SI",
    "Desestimado": "Desestimado",
    "Aprobado para fabricación": "Enviado a SI",
    "Aprobado para muestra": "Enviado a SI",
  };
  return mapping[legacyStatus] || "Registrado";
}
