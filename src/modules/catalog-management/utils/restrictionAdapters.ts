import {
  getDimensionRestrictions,
  getValidationRestrictions,
} from "../../../shared/data/restrictionCatalogsStorage";
import type {
  DimensionRestrictionCatalog,
  ValidationRestrictionCatalog,
} from "../../../shared/data/restrictionCatalogs";

export interface EnrichedRestriction {
  id: string;
  name: string;
  type: "dimension" | "validation";
  productType: "LAMINA" | "BOLSA" | "POUCH";
  description: string;
  status: "Activo" | "Inactivo" | "Bloqueado";
  sourceData:
    | DimensionRestrictionCatalog
    | ValidationRestrictionCatalog;
}

export function getEnrichedRestrictions(): EnrichedRestriction[] {
  const dimensionRestrictions = getDimensionRestrictions();
  const validationRestrictions = getValidationRestrictions();

  const enriched: EnrichedRestriction[] = [
    ...dimensionRestrictions.map(
      (r): EnrichedRestriction => ({
        id: r.id,
        name: r.name,
        type: "dimension",
        productType: r.productType,
        description: `Restricción de dimensiones para ${r.productType}`,
        status: r.status,
        sourceData: r,
      })
    ),
    ...validationRestrictions.map(
      (r): EnrichedRestriction => ({
        id: r.id,
        name: r.name,
        type: "validation",
        productType: r.productType,
        description: r.description || `Validación de ${r.sourceField}`,
        status: r.status,
        sourceData: r,
      })
    ),
  ];

  return enriched;
}

export function getRestrictionsByType(
  type: "dimension" | "validation"
): EnrichedRestriction[] {
  return getEnrichedRestrictions().filter((r) => r.type === type);
}

export function getRestrictionsByProductType(
  productType: "LAMINA" | "BOLSA" | "POUCH"
): EnrichedRestriction[] {
  return getEnrichedRestrictions().filter((r) => r.productType === productType);
}

export function getRestrictionById(id: string): EnrichedRestriction | undefined {
  return getEnrichedRestrictions().find((r) => r.id === id);
}

export function getUniqueProductTypes(): ("LAMINA" | "BOLSA" | "POUCH")[] {
  const types = new Set(getEnrichedRestrictions().map((r) => r.productType));
  return Array.from(types).sort() as ("LAMINA" | "BOLSA" | "POUCH")[];
}

export function getRestrictionCountByType(): {
  all: number;
  dimension: number;
  validation: number;
} {
  const restrictions = getEnrichedRestrictions();
  return {
    all: restrictions.length,
    dimension: restrictions.filter((r) => r.type === "dimension").length,
    validation: restrictions.filter((r) => r.type === "validation").length,
  };
}

export function getProductTypeLabel(type: string): string {
  switch (type) {
    case "LAMINA":
      return "LÁMINA";
    case "BOLSA":
      return "BOLSA";
    case "POUCH":
      return "POUCH";
    default:
      return type;
  }
}

export function getTypeLabel(type: string): string {
  return type === "dimension" ? "Dimensiones" : "Validación";
}

export function getStatusColor(
  status: string
): "green" | "gray" | "red" {
  switch (status) {
    case "Activo":
      return "green";
    case "Inactivo":
      return "gray";
    case "Bloqueado":
      return "red";
    default:
      return "gray";
  }
}

export function getTypeColor(
  type: string
): "blue" | "amber" {
  return type === "dimension" ? "blue" : "amber";
}
