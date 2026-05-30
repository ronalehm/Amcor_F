import type { CatalogItem, RestrictionItem, CatalogChangePreviewRow, RestrictionChangePreviewRow, ChangeLogEntry } from "../types/catalogRestriction.types";

export const CATALOGS: CatalogItem[] = [
  { id: "cat-001", name: "Tipo de envoltura", code: "WRAP_TYPE" },
  { id: "cat-002", name: "Unidad de medida", code: "MEASURE_UNIT" },
  { id: "cat-003", name: "Familia de producto", code: "PRODUCT_FAMILY" },
  { id: "cat-004", name: "Estado de producto", code: "PRODUCT_STATUS" },
  { id: "cat-005", name: "Línea de negocio", code: "BUSINESS_LINE" },
];

export const RESTRICTIONS: RestrictionItem[] = [
  { id: "res-001", name: "Restricciones por tipo de envoltura" },
  { id: "res-002", name: "Restricciones por unidad de medida" },
  { id: "res-003", name: "Restricciones por familia de producto" },
  { id: "res-004", name: "Restricciones por línea de negocio" },
];

export const CATALOG_VALID_WRAP_TYPES = [
  "POUCH",
  "BOLSA",
  "LAMINA",
];

export const MOCK_CATALOG_PREVIEW_ROWS: CatalogChangePreviewRow[] = [
  {
    item: "ENV-001",
    currentName: "POUCH",
    newName: "POUCH",
    currentStatus: "Activo",
    newStatus: "Activo",
    detectedAction: "unchanged",
    status: "valid",
    observation: undefined,
  },
  {
    item: "ENV-002",
    currentName: "BOLSA",
    newName: "BOLSA FLEX",
    currentStatus: "Activo",
    newStatus: "Activo",
    detectedAction: "modified",
    status: "valid",
    observation: undefined,
  },
  {
    item: "ENV-003",
    currentName: "LAMINA",
    newName: "LAMINA",
    currentStatus: "Activo",
    newStatus: "Inactivo",
    detectedAction: "inactive",
    status: "valid",
    observation: undefined,
  },
  {
    item: "ENV-004",
    currentName: "",
    newName: "FILM",
    currentStatus: "",
    newStatus: "Activo",
    detectedAction: "new",
    status: "error",
    observation: "El valor FILM no es un tipo de envoltura válido. Use: POUCH, BOLSA, LAMINA",
  },
];

export const MOCK_RESTRICTION_PREVIEW_ROWS: RestrictionChangePreviewRow[] = [
  {
    ruleCode: "RES-001",
    sourceField: "Tipo de envoltura",
    sourceValue: "POUCH",
    dependentField: "Unidad",
    allowedValue: "g",
    currentStatus: "Activo",
    newStatus: "Activo",
    detectedAction: "unchanged",
    status: "valid",
    observation: undefined,
  },
  {
    ruleCode: "RES-002",
    sourceField: "Tipo de envoltura",
    sourceValue: "BOLSA",
    dependentField: "Material",
    allowedValue: "PE",
    currentStatus: "",
    newStatus: "Activo",
    detectedAction: "new",
    status: "valid",
    observation: undefined,
  },
  {
    ruleCode: "RES-003",
    sourceField: "Tipo de envoltura",
    sourceValue: "LAMINA",
    dependentField: "Proceso",
    allowedValue: "Impresión",
    currentStatus: "Activo",
    newStatus: "Inactivo",
    detectedAction: "inactive",
    status: "valid",
    observation: undefined,
  },
];

export const MOCK_CHANGE_LOG: ChangeLogEntry[] = [
  {
    id: "log-001",
    timestamp: "30/05/2026 10:30",
    user: "Administrador",
    managementType: "catalog",
    element: "Tipo de envoltura",
    action: "Actualización por plantilla",
    processedRecords: 3,
    result: "success",
  },
  {
    id: "log-002",
    timestamp: "30/05/2026 10:45",
    user: "Administrador",
    managementType: "restriction",
    element: "Restricciones por tipo de envoltura",
    action: "Actualización por plantilla",
    processedRecords: 2,
    result: "success",
  },
  {
    id: "log-003",
    timestamp: "29/05/2026 14:20",
    user: "Administrador",
    managementType: "catalog",
    element: "Unidad de medida",
    action: "Actualización por plantilla",
    processedRecords: 5,
    result: "success",
  },
];
