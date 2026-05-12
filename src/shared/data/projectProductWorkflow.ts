/* ============================================================================
   WORKFLOW DE PRODUCTO PRELIMINAR - MÓDULO DE PROYECTOS ODISEO

   Este archivo centraliza toda la lógica de estados del Producto Preliminar.
   Los Productos Preliminares son fichas de producto a cotizar.
   No son SKU técnicos — esos son responsabilidad del Sistema Integral.
   ============================================================================ */

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
  | "Cotización completa"
  | "Aprobados"
  | "Alta parcial"
  | "Alta completa"
  | "Con desestimados";

// ============================================================================
// FUNCIONES DE NORMALIZACIÓN
// ============================================================================

/**
 * Normaliza estados antiguos de producto al modelo oficial
 */
export function normalizePreliminaryProductStatus(
  rawStatus?: string
): PreliminaryProductStatus {
  if (!rawStatus) return "Registrado";

  const status = String(rawStatus).trim().toLowerCase();

  if (status.includes("registr")) return "Registrado";
  if (status.includes("generado") || status.includes("variación generada"))
    return "Registrado";
  if (status.includes("cotización")) return "En Cotización";
  if (status.includes("aprobado")) return "Aprobado";
  if (status.includes("alta") || status.includes("dado de alta"))
    return "Alta";
  if (status.includes("desestim")) return "Desestimado";

  return "Registrado";
}

// ============================================================================
// FUNCIONES DE TRANSICIÓN Y VALIDACIÓN
// ============================================================================

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

// ============================================================================
// FUNCIONES DE RESUMEN Y ESTADO
// ============================================================================

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
 * Retorna las acciones disponibles para un estado de producto preliminar
 */
export function getActionsForProductStatus(
  status: PreliminaryProductStatus
): string[] {
  switch (status) {
    case "Registrado":
      return ["editar", "seleccionar-cotizacion", "crear-variacion", "desestimar"];

    case "En Cotización":
      return [
        "editar",
        "registrar-cotizacion-completada",
        "crear-variacion",
        "desestimar",
      ];

    case "Aprobado":
      return ["crear-variacion", "marcar-alta", "desestimar"];

    case "Alta":
      return ["crear-variacion"];

    case "Desestimado":
      return ["ver-motivo"];

    default:
      return [];
  }
}
