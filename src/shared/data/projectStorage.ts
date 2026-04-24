const PROJECTS_STORAGE_KEY = "odiseo_created_projects";
const PROJECT_STATUS_HISTORY_KEY = "odiseo_project_status_history";

export type YesNo = "Sí" | "No";
export type YesNoPending = "Sí" | "No" | "A definir";
export type BooleanLike = boolean | YesNo;

export type PortalProjectStage = "P1" | "P2" | "P3" | "P4" | "P5";
export type SiProjectStage = "P6" | "P7" | "P8" | "P9";

export type ProjectStatus =
  | "Borrador"
  | "En validación"
  | "Aprobado"
  | "Dado de alta"
  | "Desestimado"
  | "Aprobado para fabricación"
  | "Aprobado para muestra"
  | "Registrado"
  | "Rechazado";

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

  // Estados / tracking principal
  status: ProjectStatus;
  currentPortalStage?: PortalProjectStage;
  siExternalStatus?: SiExternalStatus;
  siExternalStage?: SiProjectStage;
  completionPercentage?: number;

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
  projectType?: string;
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

  // === ESPECIFICACIONES DE DISEÑO ===
  printClass?: string;
  printType?: string;

  isPreviousDesign?: BooleanLike;
  previousEdagCode?: string;
  previousEdagVersion?: string;

  specialDesignSpecs?: string;
  specialDesignComments?: string;

  hasDigitalFiles?: BooleanLike;
  artworkFileType?: string;
  artworkAttachments?: string;

  requiresDesignWork?: BooleanLike;

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
  if (status === "En validación") return "P2";
  if (status === "Aprobado para muestra") return "P3";
  if (status === "Aprobado para fabricación") {
    return "P4";
  }
  if (
    status === "Dado de alta" ||
    status === "Registrado"
  ) {
    return "P5";
  }

  return "P1";
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

    status: "Borrador",
    currentPortalStage: "P1",
    siExternalStatus: "No enviado",

    completionPercentage: 80,
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

  return [...createdProjects, ...initialWithoutDuplicates];
}

export function getProjectByCode(
  code: string
): ProjectRecord | undefined {
  return getProjectRecords().find((project) => project.code === code);
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

export function getProjectsSummary() {
  const projects = getProjectRecords();

  const activeProjects = projects.filter(
    (project) =>
      project.status !== "Dado de alta" &&
      project.status !== "Desestimado" &&
      project.status !== "Aprobado para fabricación" &&
      project.status !== "Aprobado para muestra"
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