import {
  DIMENSION_RESTRICTIONS_CATALOG,
  VALIDATION_RESTRICTIONS_CATALOG,
  type DimensionRestrictionCatalog,
  type ValidationRestrictionCatalog,
} from "./restrictionCatalogs";
import { addRestrictionChangeLogEntry } from "./restrictionChangeLog";

const DIMENSION_RESTRICTIONS_KEY = "odiseo_dimension_restrictions";
const VALIDATION_RESTRICTIONS_KEY = "odiseo_validation_restrictions";

// Dimension Restrictions
export function getDimensionRestrictions(): DimensionRestrictionCatalog[] {
  const stored = localStorage.getItem(DIMENSION_RESTRICTIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default data
  const restrictions = DIMENSION_RESTRICTIONS_CATALOG;
  localStorage.setItem(DIMENSION_RESTRICTIONS_KEY, JSON.stringify(restrictions));
  return restrictions;
}

export function getDimensionRestrictionById(
  id: string
): DimensionRestrictionCatalog | undefined {
  return getDimensionRestrictions().find((r) => r.id === id);
}

export function getDimensionRestrictionsByProductType(
  productType: "LAMINA" | "BOLSA" | "POUCH"
): DimensionRestrictionCatalog[] {
  return getDimensionRestrictions().filter((r) => r.productType === productType);
}

export function updateDimensionRestriction(
  id: string,
  updates: Partial<DimensionRestrictionCatalog>
): DimensionRestrictionCatalog | undefined {
  const restrictions = getDimensionRestrictions();
  const index = restrictions.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  restrictions[index] = {
    ...restrictions[index],
    ...updates,
    id: restrictions[index].id, // Prevent ID change
  };
  localStorage.setItem(DIMENSION_RESTRICTIONS_KEY, JSON.stringify(restrictions));
  return restrictions[index];
}

export function addDimensionRestriction(
  restriction: Omit<DimensionRestrictionCatalog, "id">
): DimensionRestrictionCatalog {
  const restrictions = getDimensionRestrictions();
  const newRestriction: DimensionRestrictionCatalog = {
    ...restriction,
    id: `dim-${Date.now()}`,
  };
  restrictions.push(newRestriction);
  localStorage.setItem(DIMENSION_RESTRICTIONS_KEY, JSON.stringify(restrictions));
  return newRestriction;
}

export function deleteDimensionRestriction(id: string): boolean {
  const restrictions = getDimensionRestrictions();
  const toDelete = restrictions.find((r) => r.id === id);
  if (!toDelete) return false;

  const filtered = restrictions.filter((r) => r.id !== id);
  localStorage.setItem(DIMENSION_RESTRICTIONS_KEY, JSON.stringify(filtered));

  // Registrar en bitácora
  addRestrictionChangeLogEntry({
    restrictionId: id,
    restrictionName: toDelete.name,
    restrictionType: "dimension",
    action: "deleted",
    changes: { deleted: { old: toDelete, new: null } },
    result: "success",
  });

  return true;
}

// Validation Restrictions
export function getValidationRestrictions(): ValidationRestrictionCatalog[] {
  const stored = localStorage.getItem(VALIDATION_RESTRICTIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default data
  const restrictions = VALIDATION_RESTRICTIONS_CATALOG;
  localStorage.setItem(VALIDATION_RESTRICTIONS_KEY, JSON.stringify(restrictions));
  return restrictions;
}

export function getValidationRestrictionById(
  id: string
): ValidationRestrictionCatalog | undefined {
  return getValidationRestrictions().find((r) => r.id === id);
}

export function getValidationRestrictionsByProductType(
  productType: "LAMINA" | "BOLSA" | "POUCH"
): ValidationRestrictionCatalog[] {
  return getValidationRestrictions().filter((r) => r.productType === productType);
}

export function updateValidationRestriction(
  id: string,
  updates: Partial<ValidationRestrictionCatalog>
): ValidationRestrictionCatalog | undefined {
  const restrictions = getValidationRestrictions();
  const index = restrictions.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  restrictions[index] = {
    ...restrictions[index],
    ...updates,
    id: restrictions[index].id, // Prevent ID change
  };
  localStorage.setItem(VALIDATION_RESTRICTIONS_KEY, JSON.stringify(restrictions));
  return restrictions[index];
}

export function addValidationRestriction(
  restriction: Omit<ValidationRestrictionCatalog, "id">
): ValidationRestrictionCatalog {
  const restrictions = getValidationRestrictions();
  const newRestriction: ValidationRestrictionCatalog = {
    ...restriction,
    id: `val-${Date.now()}`,
  };
  restrictions.push(newRestriction);
  localStorage.setItem(VALIDATION_RESTRICTIONS_KEY, JSON.stringify(restrictions));
  return newRestriction;
}

export function deleteValidationRestriction(id: string): boolean {
  const restrictions = getValidationRestrictions();
  const toDelete = restrictions.find((r) => r.id === id);
  if (!toDelete) return false;

  const filtered = restrictions.filter((r) => r.id !== id);
  localStorage.setItem(VALIDATION_RESTRICTIONS_KEY, JSON.stringify(filtered));

  // Registrar en bitácora
  addRestrictionChangeLogEntry({
    restrictionId: id,
    restrictionName: toDelete.name,
    restrictionType: "validation",
    action: "deleted",
    changes: { deleted: { old: toDelete, new: null } },
    result: "success",
  });

  return true;
}

// Helper: Reset to defaults
export function resetRestrictionCatalogs(): void {
  localStorage.setItem(
    DIMENSION_RESTRICTIONS_KEY,
    JSON.stringify(DIMENSION_RESTRICTIONS_CATALOG)
  );
  localStorage.setItem(
    VALIDATION_RESTRICTIONS_KEY,
    JSON.stringify(VALIDATION_RESTRICTIONS_CATALOG)
  );
}
