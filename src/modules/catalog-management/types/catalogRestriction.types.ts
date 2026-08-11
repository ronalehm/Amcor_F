export type ManagementType = "catalog" | "restriction";

export type DetectedChangeAction =
  | "new"
  | "modified"
  | "status_changed"
  | "inactive"
  | "blocked"
  | "unchanged"
  | "error";

export type RestrictionDetectedChangeAction = "new" | "modified" | "inactive" | "blocked" | "unchanged";

export type ValidationStatus = "pending" | "validating" | "with_observations" | "valid" | "applied";

export type RecordStatus = "active" | "inactive" | "blocked";

export interface CatalogItem {
  id: string;
  name: string;
  code: string;
  source: "ODISEO" | "SISTEMA_INTEGRAL";
}

export interface RestrictionItem {
  id: string;
  name: string;
}

export interface CatalogChangePreviewRow {
  item: string;
  currentName: string;
  newName: string;
  currentStatus: string;
  newStatus: string;
  detectedAction: DetectedChangeAction;
  status: "valid" | "error" | "warning";
  observation?: string;
}

export interface RestrictionChangePreviewRow {
  id?: string;
  nombre?: string;
  tipoProducto?: string;
  cambiosDetectados?: string;
  ruleCode?: string;
  sourceField?: string;
  sourceValue?: string;
  dependentField?: string;
  allowedValue?: string;
  currentStatus?: string;
  newStatus?: string;
  detectedAction?: DetectedChangeAction | RestrictionDetectedChangeAction;
  status: "valid" | "error" | "warning" | "modificado";
  observation?: string;
}

export interface RestrictionExportData {
  id: string;
  nombre: string;
  codigo: string;
  tipoProducto: string;
  formatoPlan?: string;
  ancho_min?: number;
  ancho_max?: number;
  largo_min?: number;
  largo_max?: number;
  anchoFuelle_min?: number;
  anchoFuelle_max?: number;
  perimetro_min?: number;
  perimetro_max?: number;
  campoOrigen?: string;
  valorOrigen?: string;
  campoDependiente?: string;
  valoresPermitidos?: string;
  estado: string;
}

export interface RestrictionValidationSummary {
  status: ValidationStatus;
  totalRecords?: number;
  validRecords?: number;
  modifiedRecords: number;
  newRecords: number;
  inactivatedRecords: number;
  blockedRecords: number;
  criticalErrors: number;
  observations: number;
  rows: RestrictionChangePreviewRow[];
  detectedChanges?: Array<{
    id: string;
    action: RestrictionDetectedChangeAction;
    oldData: any;
    newData: any;
  }>;
}

export type ChangePreviewRow = CatalogChangePreviewRow | RestrictionChangePreviewRow;

export interface ValidationSummary {
  status: ValidationStatus;
  totalRecords?: number;
  validRecords?: number;
  newRecords: number;
  modifiedRecords: number;
  inactivatedRecords: number;
  blockedRecords: number;
  observations: number;
  criticalErrors: number;
  rows: ChangePreviewRow[];
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  user: string;
  managementType: ManagementType;
  element: string;
  action: string;
  processedRecords: number;
  result: "success" | "error";
  source?: "ODISEO" | "SISTEMA_INTEGRAL";
}

export interface ManagementState {
  managementType: ManagementType;
  selectedTarget: string;
  reason: string;
  uploadedFile: File | null;
  uploadedFileName: string;
  validationSummary: ValidationSummary | null;
  uploadStatus: ValidationStatus;
}
