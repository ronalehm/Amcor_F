import type {
  ProjectStage,
  ProjectStatus as WorkflowProjectStatus,
  GraphicArtsValidationStatus,
  TechnicalValidationStatus,
  TechnicalComplexity,
  TechnicalSubArea,
  CurrentValidationStep,
} from "./projectWorkflow";
import { resolveProjectStage } from "./projectWorkflow";

const PROJECTS_STORAGE_KEY = "odiseo_created_projects";
const PROJECT_STATUS_HISTORY_KEY = "odiseo_project_status_history";

export type YesNo = "Sí" | "No";
export type YesNoPending = "Sí" | "No" | "A definir";
export type BooleanLike = boolean | YesNo;

export type PortalProjectStage = "P1" | "P2" | "P3" | "P4" | "P5";
export type SiProjectStage = "P6" | "P7" | "P8" | "P9";

// Aliases para compatibilidad
export type WorkflowProjectStage = ProjectStage;
export type WorkflowAreaValidationStatus = GraphicArtsValidationStatus;
export type ProjectStatus = WorkflowProjectStatus;

export type ValidationStatus =
  | "Sin solicitar"
  | "Pendiente de validación"
  | "En validación"
  | "Observada"
  | "Rechazada"
  | "Validada por áreas";

export type AreaValidation = "Artes Gráficas" | "R&D Técnica" | "R&D Desarrollo";
export type ValidationState = "Pendiente" | "Aprobada" | "Observada" | "Rechazada";

export interface AreaValidationRecord {
  area: AreaValidation;
  estado: ValidationState;
  validador?: string;
  fechaValidacion?: string;
  campoObservado?: string;
  accionRequerida?: string;
  comentarios: {
    id: string;
    comentario: string;
    campo?: string;
    accionRequerida?: string;
    fecha: string;
    autor?: string;
  }[];
}

export type SiExternalStatus =
  | "No enviado"
  | "P6 Desarrollo"
  | "P7 Lista para Alta"
  | "P8 Dado de Alta"
  | "P9 Finalizado";

export type ProjectRecord = {
  id: string;
  code: string;

  // Relación con portafolio
  portfolioCode: string;
  portfolioName: string;

  // Relación con cliente
  clientId?: number;
  clientCode?: string;
  clientName?: string;

  // Información principal
  projectName: string;
  projectDescription?: string;

  // Ejecutivo comercial
  ejecutivoId?: number;
  ejecutivoName?: string;
  ejecutivoIds?: Array<string | number>;
  ejecutivoNames?: string;
  executiveIds?: Array<string | number>;
  commercialExecutiveIds?: Array<string | number>;

  // Usuario Sistema Integral
  siUserId?: string;
  siUserCode?: string;

  // Estados / tracking principal
  status: ProjectStatus;
  currentPortalStage?: PortalProjectStage;
  siExternalStatus?: SiExternalStatus;
  siExternalStage?: SiProjectStage;
  completionPercentage?: number;

  // Workflow v2: Etapa y validaciones técnicas internas
  stage?: ProjectStage;
  graphicArtsValidationStatus?: GraphicArtsValidationStatus;
  technicalValidationStatus?: TechnicalValidationStatus;
  technicalComplexity?: TechnicalComplexity;
  technicalSubArea?: TechnicalSubArea;
  currentValidationStep?: CurrentValidationStep;

  // Workflow v2: Timestamps de transición
  validationRound?: number;
  lastObservationSource?: "Artes Gráficas" | "R&D Técnica" | "R&D Desarrollo";
  lastObservationComment?: string;
  lastObservationAt?: string;
  lastValidatedAt?: string;
  graphicArtsValidatedAt?: string;
  graphicArtsValidationComment?: string;
  technicalValidatedAt?: string;
  technicalValidationComment?: string;
  validationComment?: string;

  // Workflow v2: Productos Preliminares
  hasBasePreliminaryProduct?: boolean;
  basePreliminaryProductId?: string;
  preliminaryProductIds?: string[];

  // Datos heredados del portafolio
  plantaId?: number;
  plantaName?: string;

  wrappingId?: number;
  wrappingName?: string;
  envoltura?: string;

  useFinalId?: number;
  useFinalName?: string;
  usoFinal?: string;

  maquinaCliente?: string;
  packingMachineName?: string;

  sector?: string;
  segment?: string;
  subSegment?: string;
  afMarketId?: string;

  // Ruta de diseño
  hasArtworkDesign?: boolean;
  routeType?: "Con diseño" | "Sin diseño";
  designRoute?: "Con diseño" | "Sin diseño" | string;

  // Campos legacy usados en vistas anteriores
  format?: string;
  layers?: string;
  sustainability?: string;
  dimensions?: string;
  volume?: string;
  unit?: string;
  colors?: string;
  microns?: string;

  // === INFORMACIÓN GENERAL ===
  classification?: string;
  subClassification?: string;
  complexity?: "ALTA" | "BAJA" | string;
  complejidad?: "ALTA" | "BAJA" | string;
  projectType?: string;
  tipoProyecto?: string;
  approvedProductCode?: string;
  salesforceAction?: string;

  graphicResponsible?: string;
  graphicComments?: string;

  rdResponsible?: string;
  rdComments?: string;

  commercialFinanceResponsible?: string;

  // === DATOS DE PRODUCTO COMERCIAL ===
  blueprintFormat?: string;
  technicalApplication?: string;
  estimatedVolume?: string;
  unitOfMeasure?: string;
  customerPackingCode?: string;

  // Lógica de Formato de Plano para BOLSA
  tipoPresentacionBolsa?: string;
  tipoSelloBolsa?: string;
  acabadoBolsa?: string;
  tieneFuelleBolsa?: string;
  tipoFuelleBolsa?: string;

  // === ESPECIFICACIONES DE DISEÑO ===
  printClass?: string;
  printType?: string;

  isPreviousDesign?: BooleanLike;
  previousEdagCode?: string;
  previousEdagVersion?: string;

  specialDesignSpecs?: string;
  specialDesignComments?: string;
  edagCode?: string;
  edagVersion?: string;
  colorObjective?: string[];
  objetivoColor?: string[];
  colorObjectiveComment?: string;
  comentarioObjetivoColor?: string;
  designWorkInstructions?: string;
  instruccionesTrabajoDiseno?: string;

  hasDigitalFiles?: BooleanLike;
  artworkFileType?: string;
  artworkAttachments?: string;

  requiresDesignWork?: BooleanLike;
  hasDesignPlan?: BooleanLike;

  // === ESPECIFICACIONES DE ESTRUCTURA ===
  hasReferenceStructure?: BooleanLike;
  referenceEmCode?: string;
  referenceEmVersion?: string;

  structureType?: string;

  hasCustomerTechnicalSpec?: BooleanLike;
  customerTechnicalSpecAttachment?: string;

  // Capas
  layer1Material?: string;
  layer1Micron?: string;
  layer1Grammage?: string;

  layer2Material?: string;
  layer2Micron?: string;
  layer2Grammage?: string;

  layer3Material?: string;
  layer3Micron?: string;
  layer3Grammage?: string;

  layer4Material?: string;
  layer4Micron?: string;
  layer4Grammage?: string;

  specialStructureSpecs?: string;
  grammage?: string;
  grammageTolerance?: string;

  sampleRequest?: BooleanLike;

  // === DIMENSIONES Y ACCESORIOS ===
  width?: string;
  length?: string;
  repetition?: string;
  doyPackBase?: string;
  gussetWidth?: string;
  gussetType?: string;

  hasZipper?: BooleanLike;
  zipperType?: string;

  hasTinTie?: BooleanLike;

  hasValve?: BooleanLike;
  valveType?: string;

  hasDieCutHandle?: BooleanLike;

  hasReinforcement?: BooleanLike;
  reinforcementThickness?: string;
  reinforcementWidth?: string;

  hasAngularCut?: BooleanLike;

  hasRoundedCorners?: BooleanLike;
  roundedCornersType?: string;

  hasNotch?: BooleanLike;

  hasPerforation?: BooleanLike;
  pouchPerforationType?: string;
  bagPerforationType?: string;
  perforationLocation?: string;

  hasPreCut?: BooleanLike;
  preCutType?: string;

  otherAccessories?: string;

  // === TUCO / CORE ===
  coreMaterial?: string;
  coreDiameter?: string;
  externalDiameter?: string;
  externalVariationPlus?: string;
  externalVariationMinus?: string;
  maxRollWeight?: string;

  // === ESPECIFICACIONES FINANCIERAS / COMERCIALES ===
  saleType?: "Nacional" | "Internacional" | string;
  incoterm?: string;
  destinationCountry?: string;

  targetPrice?: string;
  salePrice?: string;
  currencyType?: string;
  paymentTerms?: string;

  customerAdditionalInfo?: string;

  peruvianProductLogo?: YesNoPending;
  printingFooter?: string;

  // === VALIDACIONES ===
  requiereValidacion: boolean;
  validacionSolicitada: boolean;
  fechaSolicitudValidacion?: string;
  estadoValidacionGeneral: ValidationStatus;
  validaciones: AreaValidationRecord[];

  // Workflow v2: Timestamps de transición (continuación)
  statusUpdatedAt?: string;
  stageUpdatedAt?: string;
  quoteStartedAt?: string;
  quoteCompletedAt?: string;
  clientApprovedAt?: string;
  desestimatedAt?: string;
  desestimatedReason?: string;
  closedFromStage?: ProjectStage;

  // Workflow v2: Resumen de productos
  productSummaryStatus?: "Sin productos" | "Producto base registrado" | "Con variaciones" | "En cotización" | "Aprobados" | "Alta parcial" | "Alta completa" | "Con desestimados";

  // RFQ y Licitación (se habilitan después de validación de áreas)
  licitacion?: YesNoPending;
  codigoRFQ?: string;

  // Auditoría
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatusHistoryRecord = {
  id: string;
  projectCode: string;
  fromStatus?: ProjectStatus;
  toStatus: ProjectStatus;
  fromStage?: PortalProjectStage | SiProjectStage;
  toStage?: PortalProjectStage | SiProjectStage;
  changedBy?: string;
  changedAt: string;
  comment?: string;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStorageArray<T>(key: string): T[] {
  if (!isBrowser()) return [];
  return safeParseArray<T>(localStorage.getItem(key));
}

function writeStorageArray<T>(key: string, records: T[]) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(records));
}

function isFilled(value: unknown) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function booleanLikeToBoolean(value: BooleanLike | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  return value === "Sí";
}

function inferRouteType(project: Partial<ProjectRecord>): "Con diseño" | "Sin diseño" {
  if (project.routeType === "Con diseño" || project.routeType === "Sin diseño") {
    return project.routeType;
  }

  if (project.designRoute === "Con diseño" || project.designRoute === "Sin diseño") {
    return project.designRoute;
  }

  if (project.hasArtworkDesign === true) return "Con diseño";
  return "Sin diseño";
}

function inferPortalStage(status: ProjectStatus): PortalProjectStage {
  // Mapeo de estados a etapas portales P1-P3 (P4-P5 ya no existen)
  switch (status) {
    case "Registrado":
    case "En Preparación":
    case "Ficha Completa":
      return "P1";
    case "En validación":
    case "Observado":
    case "Validado":
      return "P2";
    case "En Cotización":
    case "Cotización Completa":
    case "Aprobado por Cliente":
      return "P3";
    case "Desestimado":
      return "P1"; // Default to P1
    default:
      return "P1";
  }
}

function normalizeProjectRecord(record: ProjectRecord): ProjectRecord {
  const now = new Date().toISOString();

  const routeType = inferRouteType(record);
  const hasArtworkDesign =
    record.hasArtworkDesign ?? routeType === "Con diseño";

  const blueprintFormat = record.blueprintFormat || record.format || "";
  const estimatedVolume = record.estimatedVolume || record.volume || "";
  const unitOfMeasure = record.unitOfMeasure || record.unit || "";

  const width = record.width || "";
  const length = record.length || "";
  const gussetWidth = record.gussetWidth || "";
  const dimensions =
    record.dimensions ||
    [width, length, gussetWidth].filter(Boolean).join(" x ");

  const microns =
    record.microns ||
    [
      record.layer1Micron,
      record.layer2Micron,
      record.layer3Micron,
      record.layer4Micron,
    ]
      .filter(Boolean)
      .join(" / ");

  return {
    ...record,

    id: record.id || record.code,
    code: record.code,

    portfolioName: record.portfolioName || "",
    projectName: record.projectName || "",

    status: record.status || "Registrado",
    currentPortalStage:
      record.currentPortalStage || inferPortalStage(record.status || "Registrado"),

    siExternalStatus: record.siExternalStatus || "No enviado",

    routeType,
    designRoute: record.designRoute || routeType,
    hasArtworkDesign,

    format: blueprintFormat,
    blueprintFormat,

    volume: estimatedVolume,
    estimatedVolume,

    unit: unitOfMeasure,
    unitOfMeasure,

    dimensions,
    microns,

    wrappingName: record.wrappingName || record.envoltura,
    envoltura: record.envoltura || record.wrappingName,

    useFinalName: record.useFinalName || record.usoFinal,
    usoFinal: record.usoFinal || record.useFinalName,

    packingMachineName:
      record.packingMachineName || record.maquinaCliente || "",
    maquinaCliente:
      record.maquinaCliente || record.packingMachineName || "",

    hasDigitalFiles: record.hasDigitalFiles,
    requiresDesignWork: record.requiresDesignWork,
    hasCustomerTechnicalSpec: record.hasCustomerTechnicalSpec,

    requiereValidacion: record.requiereValidacion ?? true,
    validacionSolicitada: record.validacionSolicitada ?? false,
    fechaSolicitudValidacion: record.fechaSolicitudValidacion,
    estadoValidacionGeneral: record.estadoValidacionGeneral || "Sin solicitar",
    validaciones: record.validaciones ?? [],

    // Nuevos campos de workflow
    stage: record.stage,
    graphicArtsValidationStatus: record.graphicArtsValidationStatus,
    technicalValidationStatus: record.technicalValidationStatus,
    technicalComplexity: record.technicalComplexity,
    technicalSubArea: record.technicalSubArea,
    currentValidationStep: record.currentValidationStep,
    statusUpdatedAt: record.statusUpdatedAt,
    stageUpdatedAt: record.stageUpdatedAt,
    quoteStartedAt: record.quoteStartedAt,
    quoteCompletedAt: record.quoteCompletedAt,
    clientApprovedAt: record.clientApprovedAt,
    desestimatedAt: record.desestimatedAt,
    desestimatedReason: record.desestimatedReason,
    closedFromStage: record.closedFromStage,
    basePreliminaryProductId: record.basePreliminaryProductId,
    preliminaryProductIds: record.preliminaryProductIds,
    productSummaryStatus: record.productSummaryStatus,

    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || now,
  };
}

export function calculateProjectCompletion(
  project: Partial<ProjectRecord>
): number {
  const coreFields: Array<keyof ProjectRecord> = [
    "portfolioCode",
    "portfolioName",
    "clientName",
    "projectName",
    "ejecutivoName",
    "plantaName",
    "wrappingName",
    "useFinalName",
    "subSegment",
    "segment",
    "sector",
    "afMarketId",
    "packingMachineName",
    "salesforceAction",
    "blueprintFormat",
    "technicalApplication",
    "estimatedVolume",
    "unitOfMeasure",
    "routeType",
  ];

  const filledFields = coreFields.filter((field) =>
    isFilled(project[field])
  ).length;

  return Math.round((filledFields / coreFields.length) * 100);
}

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "PRJ-000001",
    code: "PR-000001",

    portfolioCode: "PO-000001",
    portfolioName: "Alacena Mayonesa 250 ml",

    clientCode: "CLI-000001",
    clientName: "Alicorp S.A.A.",

    projectName: "Doypack Mayonesa 250 ml",
    projectDescription: "Proyecto para empaque flexible de mayonesa.",

    ejecutivoName: "BALDEON, EDUARDO",

    plantaName: "AF Lima",
    wrappingName: "POUCH",
    envoltura: "POUCH",

    useFinalName: "Sauces",
    usoFinal: "Sauces",
    subSegment: "Processed Food",
    segment: "Food",
    sector: "Fresh Food",
    afMarketId: "45073435",

    maquinaCliente: "HFFS - Stand up Pouch",
    packingMachineName: "HFFS - Stand up Pouch",

    classification: "Nuevo",
    subClassification: "SFDC - R&D",
    projectType: "ICO",
    salesforceAction: "Nueva oportunidad",

    blueprintFormat: "Stand Up Pouch",
    technicalApplication: "Pastoso/Ketchup, Mayonesa",
    estimatedVolume: "500",
    unitOfMeasure: "KG",

    printClass: "Flexo",
    printType: "Nuevo",
    isPreviousDesign: "No",
    hasDigitalFiles: "Sí",
    artworkFileType: "AI",
    requiresDesignWork: "Sí",

    structureType: "Trilaminado",
    layer1Material: "PET - Cristal",
    layer1Micron: "12",
    layer2Material: "ALU",
    layer2Micron: "7",
    layer3Material: "PE - PEBD",
    layer3Micron: "80",
    grammage: "40",
    grammageTolerance: "±5%",

    width: "100",
    length: "150",
    gussetWidth: "30",
    dimensions: "100 x 150 x 30",

    hasZipper: "No",
    hasValve: "No",
    hasRoundedCorners: "Sí",
    roundedCornersType: "Radio estándar",

    saleType: "Nacional",
    incoterm: "No aplica",
    destinationCountry: "Perú",
    currencyType: "Soles",
    paymentTerms: "Crédito 30 días",

    hasArtworkDesign: true,
    routeType: "Con diseño",
    designRoute: "Con diseño",

    status: "En validación",
    currentPortalStage: "P2",
    siExternalStatus: "No enviado",

    completionPercentage: 100,

    requiereValidacion: true,
    validacionSolicitada: true,
    fechaSolicitudValidacion: "2026-04-20T10:30:00.000Z",
    estadoValidacionGeneral: "En validación",
    validaciones: [
      {
        area: "Artes Gráficas",
        estado: "Aprobada",
        validador: "Ana Pérez",
        fechaValidacion: "2026-04-22T14:30:00.000Z",
        comentarios: [
          {
            id: "COM-001",
            comentario: "Diseño aprobado",
            fecha: "2026-04-22T14:30:00.000Z",
          },
        ],
      },
      {
        area: "R&D Técnica",
        estado: "Pendiente",
        comentarios: [],
      },
      {
        area: "R&D Desarrollo",
        estado: "Pendiente",
        comentarios: [],
      },
    ],

    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "PRJ-000002",
    code: "PR-000002",

    portfolioCode: "PO-000002",
    portfolioName: "Doypack Mayonesa 1KG",

    clientCode: "CLI-000001",
    clientName: "Alicorp S.A.A.",

    projectName: "Doypack Mayonesa 1KG",
    projectDescription: "Proyecto de extensión de línea.",

    ejecutivoName: "BALDEON, EDUARDO",

    plantaName: "AF Lima",
    wrappingName: "POUCH",
    envoltura: "POUCH",

    useFinalName: "Sauces",
    usoFinal: "Sauces",
    subSegment: "Processed Food",
    segment: "Food",
    sector: "Fresh Food",
    afMarketId: "45073435",

    maquinaCliente: "HFFS - Stand up Pouch",
    packingMachineName: "HFFS - Stand up Pouch",

    classification: "Nuevo",
    subClassification: "SFDC - Técnica",
    projectType: "RFQ",
    salesforceAction: "Extensión de línea",

    blueprintFormat: "Stand Up Pouch",
    technicalApplication: "Pastoso/Ketchup, Mayonesa",
    estimatedVolume: "1000",
    unitOfMeasure: "KG",

    structureType: "Trilaminado",

    hasArtworkDesign: false,
    routeType: "Sin diseño",
    designRoute: "Sin diseño",

    status: "Registrado",
    currentPortalStage: "P1",
    siExternalStatus: "No enviado",

    completionPercentage: 80,

    requiereValidacion: true,
    validacionSolicitada: false,
    estadoValidacionGeneral: "Sin solicitar",
    validaciones: [],

    createdAt: "2026-02-02T00:00:00.000Z",
    updatedAt: "2026-02-02T00:00:00.000Z",
  },
];

function persistProjects(records: ProjectRecord[]) {
  writeStorageArray(PROJECTS_STORAGE_KEY, records);
}

export function getCreatedProjects(): ProjectRecord[] {
  return readStorageArray<ProjectRecord>(PROJECTS_STORAGE_KEY).map(
    normalizeProjectRecord
  );
}

export function getInitialProjects(): ProjectRecord[] {
  return INITIAL_PROJECTS.map(normalizeProjectRecord);
}

export function getProjectRecords(): ProjectRecord[] {
  const createdProjects = getCreatedProjects();

  const createdCodes = new Set(
    createdProjects.map((project) => project.code)
  );

  const initialWithoutDuplicates = getInitialProjects().filter(
    (project) => !createdCodes.has(project.code)
  );

  const allProjects = [...createdProjects, ...initialWithoutDuplicates];
  return allProjects.map(normalizeProjectWorkflow);
}

/**
 * Normaliza los campos de workflow v2 de un proyecto
 * Asegura que todos los campos requeridos tengan valores por defecto
 */
function normalizeProjectWorkflow(project: ProjectRecord): ProjectRecord {
  const status = project.status || "Registrado";
  const stage = project.stage || resolveProjectStage(status as any);

  return {
    ...project,
    status,
    stage: stage as ProjectStage,
    completionPercentage: project.completionPercentage ?? 0,
    graphicArtsValidationStatus:
      project.graphicArtsValidationStatus || "Sin solicitar",
    technicalValidationStatus:
      project.technicalValidationStatus || "Sin solicitar",
    currentValidationStep: project.currentValidationStep ?? null,
    validationRound: project.validationRound ?? 0,
    hasBasePreliminaryProduct: project.hasBasePreliminaryProduct ?? false,
    basePreliminaryProductId: project.basePreliminaryProductId,
    preliminaryProductIds: project.preliminaryProductIds ?? [],
  };
}

export function getProjectByCode(
  code: string
): ProjectRecord | undefined {
  const project = getProjectRecords().find((project) => project.code === code);
  return project ? normalizeProjectWorkflow(project) : undefined;
}

export function getProjectsByClientCode(
  clientCode: string
): ProjectRecord[] {
  return getProjectRecords().filter(
    (project) => project.clientCode === clientCode
  );
}

export function getProjectsByPortfolioCode(
  portfolioCode: string
): ProjectRecord[] {
  return getProjectRecords().filter(
    (project) => project.portfolioCode === portfolioCode
  );
}

export function getProjectsByValidationStatus(status: ValidationStatus): ProjectRecord[] {
  return getProjectRecords().filter(
    (project) => project.estadoValidacionGeneral === status
  );
}

export function getProjectsByValidationState(states: ValidationState[]): ProjectRecord[] {
  return getProjectRecords().filter((project) =>
    project.validaciones.some((v) => states.includes(v.estado))
  );
}

export function getObservedProjects(): ProjectRecord[] {
  return getProjectRecords().filter((project) =>
    project.validaciones.some((v) => v.estado === "Observada")
  );
}

export function getRejectedProjects(): ProjectRecord[] {
  return getProjectRecords().filter((project) =>
    project.validaciones.some((v) => v.estado === "Rechazada")
  );
}

export function getProjectsInValidation(): ProjectRecord[] {
  return getProjectRecords().filter((project) => {
    const normalizedProject = normalizeProjectWorkflow(project);
    return normalizedProject.status === "En validación";
  });
}

export function saveProjectRecord(record: ProjectRecord) {
  const saved = getCreatedProjects();
  const filtered = saved.filter((project) => project.code !== record.code);

  const normalized = normalizeProjectRecord({
    ...record,
    id: record.id || record.code,
    completionPercentage: calculateProjectCompletion(record),
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || new Date().toISOString(),
  });

  persistProjects([normalized, ...filtered]);

  addProjectStatusHistory({
    projectCode: normalized.code,
    toStatus: normalized.status,
    toStage: normalized.currentPortalStage,
    changedBy: "Sistema",
    comment: "Creación de proyecto",
  });
}

export function updateProjectRecord(
  code: string,
  updatedRecord: ProjectRecord
) {
  const saved = getCreatedProjects();
  const existsInCreated = saved.some((project) => project.code === code);

  const previous = getProjectByCode(code);

  const normalized = normalizeProjectRecord({
    ...updatedRecord,
    code,
    completionPercentage: calculateProjectCompletion(updatedRecord),
    updatedAt: new Date().toISOString(),
  });

  if (!existsInCreated) {
    persistProjects([normalized, ...saved]);
  } else {
    const updated = saved.map((project) =>
      project.code === code
        ? {
            ...project,
            ...normalized,
            code,
            updatedAt: new Date().toISOString(),
          }
        : project
    );

    persistProjects(updated);
  }

  if (
    previous &&
    (previous.status !== normalized.status ||
      previous.currentPortalStage !== normalized.currentPortalStage)
  ) {
    addProjectStatusHistory({
      projectCode: code,
      fromStatus: previous.status,
      toStatus: normalized.status,
      fromStage: previous.currentPortalStage,
      toStage: normalized.currentPortalStage,
      changedBy: "Sistema",
      comment: "Actualización de proyecto",
    });
  }
}

export function deleteProjectRecord(code: string) {
  const saved = getCreatedProjects();
  persistProjects(saved.filter((project) => project.code !== code));
}

export function updateProjectStatus(
  code: string,
  status: ProjectStatus,
  changedBy = "Sistema",
  comment?: string
) {
  const project = getProjectByCode(code);
  if (!project) return;

  const nextStage = inferPortalStage(status);

  updateProjectRecord(code, {
    ...project,
    status,
    currentPortalStage: nextStage,
    updatedAt: new Date().toISOString(),
  });

  addProjectStatusHistory({
    projectCode: code,
    fromStatus: project.status,
    toStatus: status,
    fromStage: project.currentPortalStage,
    toStage: nextStage,
    changedBy,
    comment,
  });
}

export function updateProjectSiExternalStatus(
  code: string,
  siExternalStatus: SiExternalStatus,
  changedBy = "Sistema Integral",
  comment?: string
) {
  const project = getProjectByCode(code);
  if (!project) return;

  const stageMap: Record<SiExternalStatus, SiProjectStage | undefined> = {
    "No enviado": undefined,
    "P6 Desarrollo": "P6",
    "P7 Lista para Alta": "P7",
    "P8 Dado de Alta": "P8",
    "P9 Finalizado": "P9",
  };

  updateProjectRecord(code, {
    ...project,
    siExternalStatus,
    siExternalStage: stageMap[siExternalStatus],
    updatedAt: new Date().toISOString(),
  });

  addProjectStatusHistory({
    projectCode: code,
    fromStatus: project.status,
    toStatus: project.status,
    fromStage: project.siExternalStage,
    toStage: stageMap[siExternalStatus],
    changedBy,
    comment: comment || `Actualización de estado externo: ${siExternalStatus}`,
  });
}

export function getNextProjectNumber() {
  const projects = getProjectRecords();

  const numbers = projects
    .map((project) => Number(project.code.replace("PR-", "")))
    .filter((number) => !Number.isNaN(number));

  return Math.max(0, ...numbers) + 1;
}

export function getNextProjectCode() {
  return `PR-${String(getNextProjectNumber()).padStart(6, "0")}`;
}

export function createProjectFromPortfolio(params: {
  portfolio: any;
  initialData: {
    clasificacion: string;
    complejidad?: "ALTA" | "BAJA" | string;
    tipoProyecto: string;
    approvedProductCode?: string;
    licitacion: "Sí" | "No";
    codigoLicitacion?: string;
  };
  createdBy?: string;
}): ProjectRecord {
  const now = new Date().toISOString();
  const code = getNextProjectCode();

  const project: ProjectRecord = {
    code,
    id: code,

    portfolioCode: params.portfolio.codigo || params.portfolio.code || params.portfolio.id || "",
    portfolioName: params.portfolio.nombre || params.portfolio.name || params.portfolio.nom || "",

    clientId: params.portfolio.clientId || params.portfolio.clienteId,
    clientCode: params.portfolio.clientCode || params.portfolio.codigoCliente || params.portfolio.cli,
    clientName: params.portfolio.clientName || params.portfolio.cliente || params.portfolio.cli,

    plantaId: params.portfolio.plantaId,
    plantaName: params.portfolio.plantaName || params.portfolio.planta || params.portfolio.pl,

    envoltura: params.portfolio.envoltura || params.portfolio.env,
    wrappingName: params.portfolio.envoltura || params.portfolio.env,
    usoFinal: params.portfolio.usoFinal || params.portfolio.uf,
    useFinalName: params.portfolio.usoFinal || params.portfolio.uf,
    sector: params.portfolio.sector,
    segment: params.portfolio.segmento || params.portfolio.seg,
    subSegment: params.portfolio.subSegmento || params.portfolio.subsegmento || params.portfolio.subseg,
    afMarketId: params.portfolio.afMarketId || params.portfolio.afmarketId || params.portfolio.af,
    maquinaCliente: params.portfolio.maquinaCliente || params.portfolio.maq,
    packingMachineName: params.portfolio.maquinaCliente || params.portfolio.maq,

    classification: params.initialData.clasificacion,
    complexity: params.initialData.complejidad || "",
    complejidad: params.initialData.complejidad || "",
    projectType: params.initialData.tipoProyecto || "",
    tipoProyecto: params.initialData.tipoProyecto || "",
    approvedProductCode: params.initialData.approvedProductCode || "",
    licitacion: params.initialData.licitacion,
    codigoRFQ:
      params.initialData.licitacion === "Sí"
        ? params.initialData.codigoLicitacion?.trim()
        : "",
    projectName: "", // To be filled in the full form
    projectDescription: "",

    status: "Registrado",
    stage: "P1_PREPARACION_FICHA_PROYECTO",
    completionPercentage: 0,

    requiereValidacion: true,
    validacionSolicitada: false,
    estadoValidacionGeneral: "Sin solicitar",
    validaciones: [],

    createdAt: now,
    updatedAt: now,
    statusUpdatedAt: now,
    stageUpdatedAt: now,
  };

  saveProjectRecord(project);
  return project;
}


export function getProjectsSummary() {
  const projects = getProjectRecords();

  const activeProjects = projects.filter(
    (project) => project.status !== "Desestimado"
  );

  const byStatus = projects.reduce<Record<string, number>>((acc, project) => {
    const status = project.status || "Sin estado";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const byPortalStage = projects.reduce<Record<string, number>>(
    (acc, project) => {
      const stage = project.currentPortalStage || inferPortalStage(project.status);
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    },
    {}
  );

  const bySiExternalStatus = projects.reduce<Record<string, number>>(
    (acc, project) => {
      const status = project.siExternalStatus || "No enviado";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const withDesign = projects.filter(
    (project) => project.hasArtworkDesign === true
  ).length;

  const withoutDesign = projects.filter(
    (project) => project.hasArtworkDesign === false
  ).length;

  return {
    total: projects.length,
    active: activeProjects.length,
    closed: projects.length - activeProjects.length,
    byStatus,
    byPortalStage,
    bySiExternalStatus,
    withDesign,
    withoutDesign,
  };
}

export function getProjectStatusHistory(): ProjectStatusHistoryRecord[] {
  return readStorageArray<ProjectStatusHistoryRecord>(
    PROJECT_STATUS_HISTORY_KEY
  );
}

export function getProjectStatusHistoryByProject(
  projectCode: string
): ProjectStatusHistoryRecord[] {
  return getProjectStatusHistory().filter(
    (record) => record.projectCode === projectCode
  );
}

export function addProjectStatusHistory(
  payload: Omit<ProjectStatusHistoryRecord, "id" | "changedAt">
) {
  const history = getProjectStatusHistory();

  const record: ProjectStatusHistoryRecord = {
    id: `HIS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    changedAt: new Date().toISOString(),
    ...payload,
  };

  writeStorageArray(PROJECT_STATUS_HISTORY_KEY, [record, ...history]);

  return record;
}

export function clearProjectStorage() {
  if (!isBrowser()) return;
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
  localStorage.removeItem(PROJECT_STATUS_HISTORY_KEY);
}

export function resetProjectStorageWithInitialData() {
  persistProjects(getInitialProjects());
  writeStorageArray(PROJECT_STATUS_HISTORY_KEY, []);
}