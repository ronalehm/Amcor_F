import { useEffect, useMemo, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Info, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import FormSelect from "../forms/FormSelect";
import FormInput from "../forms/FormInput";
import ClientSearch from "../forms/ClientSearch";
import PreviewRow from "../display/PreviewRow";

import * as portfolioStorage from "../../data/portfolioStorage";
import * as clientStorage from "../../data/clientStorage";
import * as projectStorage from "../../data/projectStorage";
import * as userStorage from "../../data/userStorage";

import { UNITS_OF_MEASURE, UNIT_LABELS } from "../../data/unitOfMeasureStorage";

type AnyRecord = Record<string, unknown>;
type PortfolioRecord = AnyRecord;
type ProjectRecord = AnyRecord;
type ClientRecord = AnyRecord;

interface ProjectInitialCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (projectId: string) => void;
  portfolio?: PortfolioRecord | null;
  initialPortfolioCode?: string;
}

type MatchScope =
  | "SAME_CLIENT_SAME_PORTFOLIO"
  | "SAME_CLIENT_OTHER_PORTFOLIO"
  | "OTHER_CLIENT";

interface SimilarityMatch {
  project: ProjectRecord;
  score: number;
  scope: MatchScope;
}

const ClientSearchField = ClientSearch as unknown as ComponentType<any>;

const CLASIFICACIÓN_OPTIONS = [
  { value: "Producto nuevo", label: "Producto nuevo" },
  { value: "Producto modificado", label: "Producto modificado" },
];

const CAUSAL_OPTIONS_NUEVO = [
  { value: "Nueva estructura", label: "Nueva estructura" },
  { value: "Nuevos insumos", label: "Nuevos insumos" },
  { value: "Nuevo formato de envasado", label: "Nuevo formato de envasado" },
  { value: "Diseño nuevo", label: "Diseño nuevo" },
];

const CAUSAL_OPTIONS_MODIFICADO = [
  { value: "Nuevo equipamiento / proceso / temperatura", label: "Nuevo equipamiento / proceso / temperatura" },
  { value: "Modifica dimensiones", label: "Modifica dimensiones" },
  { value: "Modifica propiedades", label: "Modifica propiedades" },
  { value: "Cambia estructura", label: "Cambia estructura" },
  { value: "Cambia materia prima", label: "Cambia materia prima" },
  { value: "Cambia diseño", label: "Cambia diseño" },
];

const getCausalOptions = (Clasificación: string) => {
  if (Clasificación === "Producto nuevo") return CAUSAL_OPTIONS_NUEVO;
  if (Clasificación === "Producto modificado") return CAUSAL_OPTIONS_MODIFICADO;
  return [];
};

const MATERIAL_MICRON_CONFIG: Record<
  string,
  {
    label: string;
    micronOptions?: string[];
    defaultMicron?: string;
  }
> = {
  BOPP: {
    label: "BOPP",
    micronOptions: ["13.5", "15", "17", "20", "25", "27", "30", "35"],
  },
  PET: {
    label: "PET / Poliéster",
    micronOptions: ["10", "12"],
    defaultMicron: "12",
  },
  BOPA: {
    label: "BOPA / Nylon",
    micronOptions: ["15"],
    defaultMicron: "15",
  },
  PAPEL: {
    label: "Papel",
    micronOptions: ["40", "60", "70"],
  },
  COEX: {
    label: "COEX",
    micronOptions: [],
  },
  ALUMINIO: {
    label: "Aluminio / Foil",
    micronOptions: ["7", "8", "9"],
    defaultMicron: "7",
  },
  AMPRIMA: {
    label: "AmPrima",
    micronOptions: ["25"],
  },
  PPCAST: {
    label: "PP Cast",
    micronOptions: ["20", "25", "30", "60"],
  },
  PE: {
    label: "PE / Polietileno",
    micronOptions: ["70", "80", "90"],
  },
  PE_SELLANTE: {
    label: "PE sellante",
    micronOptions: ["70", "80", "90"],
    defaultMicron: "80",
  },
  TERMOFORMADOS: {
    label: "Termoformados",
    micronOptions: ["75", "90", "100", "110", "150", "178", "200"],
  },
};

const MATERIAL_OPTIONS = Object.entries(MATERIAL_MICRON_CONFIG).map(
  ([value, config]) => ({
    value,
    label: config.label,
  }),
);

const getMaterialLabel = (material: string) =>
  MATERIAL_MICRON_CONFIG[material]?.label || material;

const getMicronOptionsByMaterial = (material: string) =>
  MATERIAL_MICRON_CONFIG[material]?.micronOptions || [];

const getDefaultMicronByMaterial = (material: string) =>
  MATERIAL_MICRON_CONFIG[material]?.defaultMicron || "";

const UNIT_OPTIONS = UNITS_OF_MEASURE.map((unit) => ({
  value: unit,
  label: (UNIT_LABELS as Record<string, string>)[unit] || unit,
}));

const normalizeText = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeClientCode = (value: unknown): string =>
  normalizeText(value).replace(/^cli\s+/, "cl ");

const normalizeCompanyName = (value: unknown): string =>
  normalizeText(value)
    .replace(/\./g, "")
    .replace(
      /\b(s a a|saa|s a c|sac|s a|sa|s r l|srl|e i r l|eirl)\b/g,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

    const isSameClient = (
  portfolio: PortfolioRecord,
  selectedClient: { code: string; name: string },
): boolean => {
  const portfolioClientName = normalizeCompanyName(
    getPortfolioClientName(portfolio),
  );

  const selectedClientName = normalizeCompanyName(selectedClient.name);

  /**
   * Regla principal:
   * Si el portafolio tiene nombre de cliente, el nombre es definitorio.
   * Esto evita que se cuelen portafolios de otro cliente por códigos inconsistentes.
   */
  if (portfolioClientName && selectedClientName) {
    return portfolioClientName === selectedClientName;
  }

  /**
   * Regla secundaria:
   * Solo usar código cuando no hay nombre de cliente suficiente para comparar.
   */
  const portfolioClientCode = normalizeClientCode(
    getPortfolioClientCode(portfolio),
  );

  const selectedClientCode = normalizeClientCode(selectedClient.code);

  return Boolean(
    portfolioClientCode &&
      selectedClientCode &&
      portfolioClientCode === selectedClientCode,
  );
};

const getRecordValue = (record: unknown, keys: string[]): string => {
  const source = record as AnyRecord | null;

  if (!source) return "";

  for (const key of keys) {
    const value = source[key];

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
};

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const commonArrayKeys = [
      "data",
      "records",
      "items",
      "rows",
      "values",
      "clients",
      "portfolios",
      "projects",
    ];

    for (const key of commonArrayKeys) {
      if (Array.isArray(source[key])) return source[key] as T[];
    }

    const values = Object.values(source);
    const firstArray = values.find(Array.isArray);
    if (Array.isArray(firstArray)) return firstArray as T[];

    return values.filter((item) => item && typeof item === "object") as T[];
  }

  return [];
};

const getStorageApi = (storage: unknown) =>
  storage as unknown as Record<string, unknown>;

const parseClientSearchValue = (value: string) => {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return {
      code: "",
      name: "",
      display: "",
    };
  }

  const parts = raw.split(" - ");

  if (parts.length >= 2) {
    return {
      code: parts[0].trim(),
      name: parts.slice(1).join(" - ").trim(),
      display: raw,
    };
  }

  const upper = raw.toUpperCase();

  return {
    code: upper.startsWith("CL") || upper.startsWith("CLI") ? raw : "",
    name: upper.startsWith("CL") || upper.startsWith("CLI") ? "" : raw,
    display: raw,
  };
};

const getPortfolioCode = (portfolio: PortfolioRecord | null | undefined) =>
  getRecordValue(portfolio, [
    "codigo",
    "code",
    "id",
    "portfolioCode",
    "portafolioCodigo",
  ]);

const getPortfolioName = (portfolio: PortfolioRecord | null | undefined) =>
  getRecordValue(portfolio, [
    "nom",
    "nombre",
    "name",
    "portfolioName",
    "description",
    "descripcion",
  ]);

const getPortfolioClientCode = (
  portfolio: PortfolioRecord | null | undefined,
) =>
  getRecordValue(portfolio, [
    "clientCode",
    "codigoCliente",
    "clientId",
    "clienteId",
    "customerCode",
    "codigoClienteSI",
    "clienteCodigo",
  ]);

const getPortfolioClientName = (
  portfolio: PortfolioRecord | null | undefined,
) =>
  getRecordValue(portfolio, [
    "cli",
    "cliente",
    "clientName",
    "nombreCliente",
    "razonSocialCliente",
    "customerName",
    "clienteNombre",
    "client",
    "customer",
  ]);

const getClientCodeFromAny = (client: unknown) =>
  getRecordValue(client, [
    "code",
    "codigo",
    "id",
    "clientCode",
    "clienteCodigo",
    "codigoCliente",
  ]);

const getClientNameFromAny = (client: unknown) =>
  getRecordValue(client, [
    "businessName",
    "name",
    "nombre",
    "razonSocial",
    "clientName",
    "cliente",
  ]);

const getAllClientRecordsSafe = (): ClientRecord[] => {
  const api = getStorageApi(clientStorage);

  const functionNames = [
    "getClientRecords",
    "getAllClientRecords",
    "getClients",
    "getAllClients",
    "listClients",
    "getClientList",
  ];

  for (const functionName of functionNames) {
    const fn = api[functionName];

    if (typeof fn === "function") {
      try {
        const rows = toArray<ClientRecord>((fn as () => unknown)());
        if (rows.length > 0) return rows;
      } catch {
        // Continuar con la siguiente alternativa.
      }
    }
  }

  const constantNames = [
    "CLIENTS",
    "MOCK_CLIENTS",
    "CLIENT_RECORDS",
    "clientRecords",
    "clients",
  ];

  for (const constantName of constantNames) {
    const rows = toArray<ClientRecord>(api[constantName]);
    if (rows.length > 0) return rows;
  }

  if (typeof window !== "undefined") {
    const rows: ClientRecord[] = [];

    Object.keys(window.localStorage).forEach((key) => {
      const normalizedKey = normalizeText(key);

      if (
        !normalizedKey.includes("client") &&
        !normalizedKey.includes("cliente")
      ) {
        return;
      }

      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || "");
        rows.push(...toArray<ClientRecord>(parsed));
      } catch {
        // Ignorar claves que no sean JSON.
      }
    });

    return rows.filter(
      (row) => getClientCodeFromAny(row) || getClientNameFromAny(row),
    );
  }

  return [];
};

const resolveSelectedClient = (
  selectedClientValue: string,
  selectedClientObject?: unknown,
) => {
  const parsed = parseClientSearchValue(selectedClientValue);

  const objectCode = getClientCodeFromAny(selectedClientObject);
  const objectName = getClientNameFromAny(selectedClientObject);

  const rawCode = parsed.code || objectCode || selectedClientValue;
  const rawName = parsed.name || objectName;

  const normalizedRawCode = normalizeClientCode(rawCode);
  const normalizedRawName = normalizeText(rawName);

  const foundClient = getAllClientRecordsSafe().find((client) => {
    const clientCode = normalizeClientCode(getClientCodeFromAny(client));
    const clientName = normalizeText(getClientNameFromAny(client));

    return (
      (!!normalizedRawCode &&
        !!clientCode &&
        clientCode === normalizedRawCode) ||
      (!!normalizedRawName && !!clientName && clientName === normalizedRawName)
    );
  });

  return {
    code: getClientCodeFromAny(foundClient) || rawCode,
    name: getClientNameFromAny(foundClient) || rawName,
  };
};

const getAllPortfolioRecordsSafe = (): PortfolioRecord[] => {
  const api = getStorageApi(portfolioStorage);

  const functionNames = [
    "getPortfolioRecords",
    "getAllPortfolioRecords",
    "getPortfolios",
    "getAllPortfolios",
    "listPortfolios",
    "getPortfolioList",
  ];

  for (const functionName of functionNames) {
    const fn = api[functionName];

    if (typeof fn === "function") {
      try {
        const rows = toArray<PortfolioRecord>((fn as () => unknown)());
        if (rows.length > 0) return rows;
      } catch {
        // Continuar con la siguiente alternativa.
      }
    }
  }

  const constantNames = [
    "PORTFOLIO_RECORDS",
    "PORTFOLIOS",
    "MOCK_PORTFOLIOS",
    "portfolioRecords",
    "portfolios",
  ];

  for (const constantName of constantNames) {
    const rows = toArray<PortfolioRecord>(api[constantName]);
    if (rows.length > 0) return rows;
  }

  if (typeof window !== "undefined") {
    const rows: PortfolioRecord[] = [];

    Object.keys(window.localStorage).forEach((key) => {
      const normalizedKey = normalizeText(key);

      if (
        !normalizedKey.includes("portfolio") &&
        !normalizedKey.includes("portafolio")
      ) {
        return;
      }

      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || "");
        rows.push(...toArray<PortfolioRecord>(parsed));
      } catch {
        // Ignorar claves que no sean JSON.
      }
    });

    return rows.filter((row) => getPortfolioCode(row) || getPortfolioName(row));
  }

  return [];
};

const getPortfolioByCodeSafe = (code: string): PortfolioRecord | null => {
  if (!code) return null;

  const api = getStorageApi(portfolioStorage);
  const fn = api.getPortfolioByCode;

  if (typeof fn === "function") {
    try {
      const result = (fn as (value: string) => unknown)(code);
      if (result) return result as PortfolioRecord;
    } catch {
      // Fallback abajo.
    }
  }

  return (
    getAllPortfolioRecordsSafe().find(
      (portfolio) =>
        normalizeText(getPortfolioCode(portfolio)) === normalizeText(code),
    ) || null
  );
};

const portfolioMatchesSelectedClient = (
  portfolio: PortfolioRecord,
  selectedClient: { code: string; name: string },
): boolean => {
  /**
   * Usar la misma regla estricta del dropdown.
   * El cliente seleccionado debe ser definitorio.
   */
  return isSameClient(portfolio, selectedClient);
};

const getProjectRecordsSafe = (): ProjectRecord[] => {
  const api = getStorageApi(projectStorage);

  const functionNames = [
    "getProjectRecords",
    "getProjects",
    "getAllProjects",
    "listProjects",
  ];

  for (const functionName of functionNames) {
    const fn = api[functionName];

    if (typeof fn === "function") {
      try {
        const rows = toArray<ProjectRecord>((fn as () => unknown)());
        if (rows.length > 0) return rows;
      } catch {
        // Continuar con la siguiente alternativa.
      }
    }
  }

  return [];
};

const createProjectFromPortfolioSafe = (payload: {
  portfolio: PortfolioRecord;
  initialData: AnyRecord;
  createdBy?: string;
}) => {
  const api = getStorageApi(projectStorage);
  const fn = api.createProjectFromPortfolio;

  if (typeof fn === "function") {
    return (fn as (value: typeof payload) => unknown)(payload);
  }

  return {
    id: `PRJ-${Date.now()}`,
    projectCode: `PRJ-${Date.now()}`,
    ...payload.initialData,
  };
};

const getCurrentUserSafe = () => {
  const api = getStorageApi(userStorage);
  const fn = api.getCurrentUser;

  if (typeof fn !== "function") return null;

  try {
    return fn() as AnyRecord;
  } catch {
    return null;
  }
};

const dimTolerance = (a: string, b: string): boolean => {
  const first = Number.parseFloat(String(a).replace(",", "."));
  const second = Number.parseFloat(String(b).replace(",", "."));

  if (Number.isNaN(first) || Number.isNaN(second)) {
    return normalizeText(a) === normalizeText(b);
  }

  return Math.abs(first - second) / Math.max(first, second, 1) <= 0.05;
};

const isFuelleRequired = (envoltura: string) => {
  const normalized = normalizeText(envoltura);
  return normalized === "pouch" || normalized === "bolsa";
};

const getMatchScope = (
  candidateClientCode: string | undefined,
  candidateClientName: string | undefined,
  candidatePortfolioCode: string | undefined,
  existing: ProjectRecord,
): MatchScope => {
  const existingClientCode = normalizeClientCode(
    existing.clientCode ?? existing.clienteCodigo ?? existing.clientId,
  );

  const existingClientName = normalizeText(
    existing.clientName ?? existing.cliente ?? existing.nombreCliente,
  );

  const existingPortfolioCode = normalizeText(
    existing.portfolioCode ?? existing.portafolioCodigo ?? existing.portfolioId,
  );

  const sameClient =
    (!!candidateClientCode &&
      normalizeClientCode(candidateClientCode) === existingClientCode) ||
    (!!candidateClientName &&
      normalizeText(candidateClientName) === existingClientName);

  const samePortfolio =
    !!candidatePortfolioCode &&
    normalizeText(candidatePortfolioCode) === existingPortfolioCode;

  if (sameClient && samePortfolio) return "SAME_CLIENT_SAME_PORTFOLIO";
  if (sameClient) return "SAME_CLIENT_OTHER_PORTFOLIO";

  return "OTHER_CLIENT";
};

const doesProjectPassMandatoryFilter = (
  candidate: {
    clientCode?: string;
    clientName?: string;
    portfolioCode?: string;
    envoltura?: string;
    usoFinal?: string;
    maquinaCliente?: string;
    afMarketId?: string;
  },
  existing: ProjectRecord,
): boolean => {
  const existingClientCode = normalizeClientCode(
    existing.clientCode ?? existing.clienteCodigo ?? existing.clientId,
  );
  const existingClientName = normalizeText(
    existing.clientName ?? existing.cliente ?? existing.nombreCliente,
  );

  const sameClient =
    (candidate.clientCode &&
      normalizeClientCode(candidate.clientCode) === existingClientCode) ||
    (candidate.clientName &&
      normalizeText(candidate.clientName) === existingClientName);

  if (!sameClient) return false;

  const existingPortfolioCode = normalizeText(
    existing.portfolioCode ?? existing.portafolioCodigo ?? existing.portfolioId,
  );

  const samePortfolio =
    candidate.portfolioCode &&
    normalizeText(candidate.portfolioCode) === existingPortfolioCode;

  if (!samePortfolio) return false;

  const envCand = normalizeText(candidate.envoltura);
  const envExist = normalizeText(
    existing.envoltura ?? existing.wrappingName ?? existing.env,
  );

  const sameEnvoltura = envCand && envCand === envExist;

  if (!sameEnvoltura) return false;

  const usoFinalCand = normalizeText(candidate.usoFinal);
  const usoFinalExist = normalizeText(
    existing.usoFinal ?? existing.useFinalName ?? existing.uf,
  );

  const afMarketCand = normalizeText(candidate.afMarketId || "");
  const afMarketExist = normalizeText(
    existing.afMarketId ?? existing.afMarketID ?? "",
  );

  const sameUsoFinalOrMarket =
    (usoFinalCand && usoFinalCand === usoFinalExist) ||
    (afMarketCand && afMarketCand === afMarketExist);

  if (!sameUsoFinalOrMarket) return false;

  const maquinaCand = normalizeText(candidate.maquinaCliente);
  const maquinaExist = normalizeText(
    existing.maquinaCliente ?? existing.packingMachineName ?? existing.maq,
  );

  const sameMaquina = maquinaCand && maquinaCand === maquinaExist;

  if (!sameMaquina) return false;

  return true;
};

const calculateSimilarityToExisting = (
  candidate: {
    clientCode?: string;
    clientName?: string;
    portfolioCode?: string;
    envoltura?: string;
    usoFinal?: string;
    maquinaCliente?: string;
    estructuraCalculada?: string;
    layer1?: string;
    layer2?: string;
    layer3?: string;
    layer4?: string;
    layer1Micron?: string;
    layer2Micron?: string;
    layer3Micron?: string;
    layer4Micron?: string;
    ancho?: string;
    largo?: string;
    anchoFuelle?: string;
    causal?: string;
    nombreTecnicoCalculado?: string;
    descripcion?: string;
    afMarketId?: string;
  },
  existing: ProjectRecord,
): number => {
  let score = 0;

  const candidateLayers = [
    { material: candidate.layer1, micron: candidate.layer1Micron },
    { material: candidate.layer2, micron: candidate.layer2Micron },
    { material: candidate.layer3, micron: candidate.layer3Micron },
    { material: candidate.layer4, micron: candidate.layer4Micron },
  ].filter((layer) => layer.material);

  const existingLayersData = [
    {
      material: existing.layer1Material ?? existing.capa1,
      micron: existing.layer1Micraje,
    },
    {
      material: existing.layer2Material ?? existing.capa2,
      micron: existing.layer2Micraje,
    },
    {
      material: existing.layer3Material ?? existing.capa3,
      micron: existing.layer3Micraje,
    },
    {
      material: existing.layer4Material ?? existing.capa4,
      micron: existing.layer4Micraje,
    },
  ].filter((layer) => layer.material);

  if (
    candidateLayers.length > 0 &&
    existingLayersData.length > 0
  ) {
    let materialMatches = 0;
    let micronMatches = 0;
    const maxLayers = Math.max(
      candidateLayers.length,
      existingLayersData.length,
    );

    candidateLayers.forEach((candLayer, index) => {
      if (
        existingLayersData[index] &&
        normalizeText(candLayer.material) ===
          normalizeText(existingLayersData[index].material)
      ) {
        materialMatches += 1;
      }

      if (
        candLayer.micron &&
        existingLayersData[index]?.micron &&
        dimTolerance(candLayer.micron, String(existingLayersData[index].micron))
      ) {
        micronMatches += 1;
      }
    });

    const materialScore = Math.round(
      (materialMatches / maxLayers) * 35,
    );
    const micronScore = Math.round((micronMatches / maxLayers) * 25);

    score += materialScore + micronScore;
  }

  const estructuraCand = normalizeText(candidate.estructuraCalculada);
  const estructuraExist = normalizeText(
    existing.estructuraCalculada ??
      existing.structureType ??
      existing.structureSummary,
  );

  if (estructuraCand && estructuraCand === estructuraExist) {
    score += 15;
  } else if (estructuraCand && estructuraExist) {
    const candLayers = candidateLayers.length;
    const existLayers = existingLayersData.length;
    if (candLayers === existLayers) {
      score += 8;
    }
  }

  const existingWidth = String(existing.width ?? existing.ancho ?? "");
  const existingLength = String(existing.length ?? existing.largo ?? "");
  const existingGusset = String(
    existing.gussetWidth ?? existing.anchoFuelle ?? existing.fuelle ?? "",
  );

  let dimensionMatches = 0;

  if (
    candidate.ancho &&
    existingWidth &&
    dimTolerance(candidate.ancho, existingWidth)
  ) {
    dimensionMatches += 1;
  }

  if (
    candidate.largo &&
    existingLength &&
    dimTolerance(candidate.largo, existingLength)
  ) {
    dimensionMatches += 1;
  }

  if (
    candidate.anchoFuelle &&
    existingGusset &&
    dimTolerance(candidate.anchoFuelle, existingGusset)
  ) {
    dimensionMatches += 1;
  }

  if (dimensionMatches > 0) {
    score += Math.round((dimensionMatches / 3) * 15);
  }

  const ClasificaciónExistente = normalizeText(
    existing.ClasificaciónNuevaValidacion ??
      existing.validationReason ??
      existing.classification,
  );

  if (
    candidate.causal &&
    normalizeText(candidate.causal) === ClasificaciónExistente
  ) {
    score += 10;
  }

  return Math.min(100, score);
};

const getRecomendacion = (score: number, scope: MatchScope): string => {
  if (score >= 90 && scope === "SAME_CLIENT_SAME_PORTFOLIO") {
    return "Reutilizar proyecto existente. Creación bloqueada por duplicidad.";
  }

  if (score >= 90) {
    return "Usar como referencia técnica. No es duplicado del portafolio actual.";
  }

  if (score >= 70) {
    return "Revisar antes de crear. Existe un proyecto similar que puede servir de referencia.";
  }

  return "Puedes crear un nuevo proyecto. No se encontraron coincidencias relevantes.";
};

const getScopeLabel = (scope: MatchScope): string => {
  switch (scope) {
    case "SAME_CLIENT_SAME_PORTFOLIO":
      return "Mismo cliente · Mismo portafolio";
    case "SAME_CLIENT_OTHER_PORTFOLIO":
      return "Mismo cliente · Otro portafolio";
    case "OTHER_CLIENT":
      return "Otro cliente";
    default:
      return "—";
  }
};

const getProjectCode = (project: ProjectRecord) =>
  getRecordValue(project, ["code", "projectCode", "id"]);

const getProjectName = (project: ProjectRecord) =>
  getRecordValue(project, [
    "nombreTecnicoCalculado",
    "technicalName",
    "nombreCalculado",
    "projectName",
    "name",
  ]);

const getProjectStatus = (project: ProjectRecord) =>
  getRecordValue(project, ["status", "estado"]);

const DEBUG_PORTFOLIO_FILTER = false;

export default function ProjectInitialCreateModal({
  isOpen,
  onClose,
  onProjectCreated,
  portfolio: propPortfolio,
  initialPortfolioCode,
}: ProjectInitialCreateModalProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUserSafe();

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(
    null,
  );
  const [portfolioCode, setPortfolioCode] = useState(
    initialPortfolioCode || "",
  );
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

  const [Clasificación, setClasificación] = useState("");
  const [causal, setCausal] = useState("");
  const [projectName, setProjectName] = useState("");
  const [volumen, setVolumen] = useState("");
  const [unidad, setUnidad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [layer1, setLayer1] = useState("");
const [layer2, setLayer2] = useState("");
const [layer3, setLayer3] = useState("");
const [layer4, setLayer4] = useState("");
const [visibleLayerCount, setVisibleLayerCount] = useState(1);
const [layer1Micron, setLayer1Micron] = useState("");
const [layer2Micron, setLayer2Micron] = useState("");
const [layer3Micron, setLayer3Micron] = useState("");
const [layer4Micron, setLayer4Micron] = useState("");

  const [ancho, setAncho] = useState("");
  const [largo, setLargo] = useState("");
  const [anchoFuelle, setAnchoFuelle] = useState("");
  const [comentarios, setComentarios] = useState("");

  const [similarityMatches, setSimilarityMatches] = useState<SimilarityMatch[]>(
    [],
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPortfolioLocked = Boolean(propPortfolio || initialPortfolioCode);

  const resolvedSelectedClient = useMemo(
    () => resolveSelectedClient(selectedClientId, selectedClient),
    [selectedClientId, selectedClient],
  );

  const selectedPortfolio = useMemo(() => {
    if (propPortfolio) return propPortfolio;
    if (portfolioCode) return getPortfolioByCodeSafe(portfolioCode);
    return null;
  }, [propPortfolio, portfolioCode]);

  const portfoliosForClient = useMemo(() => {
    if (isPortfolioLocked) return [];
    if (!selectedClientId) return [];

    const allPortfolios = getAllPortfolioRecordsSafe();

    return allPortfolios
      .filter((portfolio) =>
        portfolioMatchesSelectedClient(portfolio, resolvedSelectedClient),
      )
      .sort((a, b) =>
        getPortfolioName(a).localeCompare(getPortfolioName(b), "es"),
      );
  }, [
    isPortfolioLocked,
    selectedClientId,
    resolvedSelectedClient.code,
    resolvedSelectedClient.name,
  ]);

  useEffect(() => {
    if (!DEBUG_PORTFOLIO_FILTER || !selectedClientId) return;

    console.log("[ODISEO] Cliente seleccionado RAW:", selectedClientId);
    console.log("[ODISEO] Cliente resuelto:", resolvedSelectedClient);
    console.log(
      "[ODISEO] Total portafolios leídos:",
      getAllPortfolioRecordsSafe().length,
    );
    console.log("[ODISEO] Portafolios filtrados:", portfoliosForClient.length);

    console.table(
      getAllPortfolioRecordsSafe().map((portfolio) => ({
        code: getPortfolioCode(portfolio),
        name: getPortfolioName(portfolio),
        clientCode: getPortfolioClientCode(portfolio),
        clientName: getPortfolioClientName(portfolio),
        match: portfolioMatchesSelectedClient(
          portfolio,
          resolvedSelectedClient,
        ),
      })),
    );
  }, [selectedClientId, resolvedSelectedClient, portfoliosForClient]);

const filteredPortfoliosForClient = useMemo(() => {
  const search = normalizeText(portfolioSearchTerm);

  if (!selectedClientId) return [];

  const onlySelectedClientPortfolios = portfoliosForClient.filter((portfolio) =>
    isSameClient(portfolio, {
      code: resolvedSelectedClient.code,
      name: resolvedSelectedClient.name,
    }),
  );

  if (!search) return onlySelectedClientPortfolios;

  return onlySelectedClientPortfolios.filter((portfolio) => {
    const code = normalizeText(getPortfolioCode(portfolio));
    const name = normalizeText(getPortfolioName(portfolio));

    return code.includes(search) || name.includes(search);
  });
}, [
  portfolioSearchTerm,
  portfoliosForClient,
  selectedClientId,
  resolvedSelectedClient.code,
  resolvedSelectedClient.name,
]);

  const inheritedPortfolioCode = getPortfolioCode(selectedPortfolio);
  const inheritedPortfolioName = getPortfolioName(selectedPortfolio);
  const inheritedClientName = getPortfolioClientName(selectedPortfolio);
  const inheritedClientCode = getPortfolioClientCode(selectedPortfolio);

  const inheritedPlantName = getRecordValue(selectedPortfolio, [
    "pl",
    "plantaName",
    "plantName",
    "planta",
  ]);

  const inheritedExecutiveName = getRecordValue(selectedPortfolio, [
    "ejecutivoName",
    "executiveName",
    "ejecutivoComercial",
    "executive",
  ]);

  const envoltura = getRecordValue(selectedPortfolio, [
    "env",
    "envoltura",
    "wrappingName",
  ]);

  const usoFinal = getRecordValue(selectedPortfolio, [
    "uf",
    "usoFinal",
    "useFinalName",
  ]);

  const maquinaCliente = getRecordValue(selectedPortfolio, [
    "maq",
    "maquinaCliente",
    "packingMachineName",
  ]);

  const inheritedSegment = getRecordValue(selectedPortfolio, [
    "seg",
    "segmento",
    "segment",
  ]);

  const inheritedSubSegment = getRecordValue(selectedPortfolio, [
    "subseg",
    "subSegmento",
    "subSegment",
  ]);

  const inheritedSector = getRecordValue(selectedPortfolio, ["sector"]);

  const inheritedAfMarketId = getRecordValue(selectedPortfolio, [
    "af",
    "afMarketId",
    "afMarketID",
  ]);

  const requiereAnchoFuelle = isFuelleRequired(envoltura);



  const portfolioBelongsToClient = useMemo(() => {
    if (isPortfolioLocked) return true;
    if (!selectedPortfolio) return false;

    return portfoliosForClient.some(
      (item) =>
        normalizeText(getPortfolioCode(item)) ===
        normalizeText(getPortfolioCode(selectedPortfolio)),
    );
  }, [isPortfolioLocked, selectedPortfolio, portfoliosForClient]);

const estructuraCalculada = useMemo(() => {
  const caps = [layer1, layer2, layer3, layer4].filter(Boolean).length;

  if (caps === 1) return "Monocapa";
  if (caps === 2) return "Bilaminado";
  if (caps === 3) return "Trilaminado";
  if (caps === 4) return "Tetralaminado";

  return "";
}, [layer1, layer2, layer3, layer4]);

const nombreTecnicoCalculado = useMemo(() => {
  const capasStr = [
    layer1 ? `${getMaterialLabel(layer1)} ${layer1Micron} µ` : "",
    layer2 ? `${getMaterialLabel(layer2)} ${layer2Micron} µ` : "",
    layer3 ? `${getMaterialLabel(layer3)} ${layer3Micron} µ` : "",
    layer4 ? `${getMaterialLabel(layer4)} ${layer4Micron} µ` : "",
  ]
    .filter(Boolean)
    .join(" / ");

  return [
    projectName.trim(),
    volumen.trim() && unidad ? `${volumen.trim()} ${unidad}` : "",
    envoltura,
    capasStr,
  ]
    .filter(Boolean)
    .join(" - ")
    .replace(/\s+/g, " ")
    .trim();
}, [
  projectName,
  volumen,
  unidad,
  envoltura,
  layer1,
  layer2,
  layer3,
  layer4,
  layer1Micron,
  layer2Micron,
  layer3Micron,
  layer4Micron,
]);

  const hasMinDataForSearch = Boolean(
    selectedPortfolio &&
    causal &&
    projectName.trim() &&
    volumen.trim() &&
    unidad &&
    descripcion.trim() &&
    layer1 &&
    ancho.trim() &&
    largo.trim() &&
    (!requiereAnchoFuelle || anchoFuelle.trim()),
  );

  useEffect(() => {
    if (!isOpen) return;

    const initialCode = initialPortfolioCode || getPortfolioCode(propPortfolio);

    setSelectedClientId("");
    setSelectedClient(null);
    setPortfolioCode(initialCode || "");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);

    setClasificación("");
    setCausal("");
    setProjectName("");
    setVolumen("");
    setUnidad(UNITS_OF_MEASURE[0] || "");
    setDescripcion("");

    setLayer1("");
setLayer2("");
setLayer3("");
setLayer4("");
setVisibleLayerCount(1);
setLayer1Micron("");
setLayer2Micron("");
setLayer3Micron("");
setLayer4Micron("");

    setAncho("");
    setLargo("");
    setAnchoFuelle("");
    setComentarios("");

    setSimilarityMatches([]);
    setShowConfirmDialog(false);
    setErrors({});
  }, [isOpen, initialPortfolioCode, propPortfolio]);

  useEffect(() => {
    if (!layer1) {
      setLayer2("");
      setLayer3("");
      setLayer4("");
    }
  }, [layer1]);

  useEffect(() => {
    if (!layer2) {
      setLayer3("");
      setLayer4("");
    }
  }, [layer2]);

  useEffect(() => {
    if (!layer3) {
      setLayer4("");
    }
  }, [layer3]);

  useEffect(() => {
    if (!hasMinDataForSearch) {
      setSimilarityMatches([]);
      return;
    }

    const candidateData = {
      clientCode: inheritedClientCode || resolvedSelectedClient.code,
      clientName: inheritedClientName || resolvedSelectedClient.name,
      portfolioCode: inheritedPortfolioCode,
      envoltura,
      usoFinal,
      maquinaCliente,
      afMarketId: inheritedAfMarketId,
      estructuraCalculada,
      nombreTecnicoCalculado,
      causal,
      layer1,
      layer2,
      layer3,
      layer4,
      layer1Micron,
      layer2Micron,
      layer3Micron,
      layer4Micron,
      ancho,
      largo,
      anchoFuelle,
      descripcion,
    };

    const results = getProjectRecordsSafe()
      .filter((project) => doesProjectPassMandatoryFilter(candidateData, project))
      .map((project) => ({
        project,
        score: calculateSimilarityToExisting(candidateData, project),
        scope: getMatchScope(
          candidateData.clientCode,
          candidateData.clientName,
          candidateData.portfolioCode,
          project,
        ),
      }))
      .filter((match) => match.score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setSimilarityMatches(results);
  }, [
    hasMinDataForSearch,
    inheritedClientCode,
    inheritedClientName,
    inheritedPortfolioCode,
    inheritedAfMarketId,
    resolvedSelectedClient.code,
    resolvedSelectedClient.name,
    envoltura,
    usoFinal,
    maquinaCliente,
    estructuraCalculada,
    nombreTecnicoCalculado,
    causal,
    layer1,
    layer2,
    layer3,
    layer4,
    layer1Micron,
    layer2Micron,
    layer3Micron,
    layer4Micron,
    ancho,
    largo,
    anchoFuelle,
    descripcion,
  ]);

  const allProjects = getProjectRecordsSafe();
  const projectsPassingMandatoryFilter = useMemo(() => {
    if (!hasMinDataForSearch) return 0;

    const candidateData = {
      clientCode: inheritedClientCode || resolvedSelectedClient.code,
      clientName: inheritedClientName || resolvedSelectedClient.name,
      portfolioCode: inheritedPortfolioCode,
      envoltura,
      usoFinal,
      maquinaCliente,
      afMarketId: inheritedAfMarketId,
    };

    return allProjects.filter((project) =>
      doesProjectPassMandatoryFilter(candidateData, project),
    ).length;
  }, [
    hasMinDataForSearch,
    inheritedClientCode,
    inheritedClientName,
    inheritedPortfolioCode,
    inheritedAfMarketId,
    resolvedSelectedClient.code,
    resolvedSelectedClient.name,
    envoltura,
    usoFinal,
    maquinaCliente,
  ]);

  const topMatch = similarityMatches[0];
  const topScore = topMatch?.score ?? 0;
  const topScope = topMatch?.scope;

  const isBlockingDuplicate =
    topScore >= 90 && topScope === "SAME_CLIENT_SAME_PORTFOLIO";

  const isWarningDuplicate =
    topScore >= 70 &&
    topScore < 90 &&
    topScope === "SAME_CLIENT_SAME_PORTFOLIO";

  const requiredFieldsFilled = Boolean(
  (isPortfolioLocked || selectedClientId) &&
    selectedPortfolio &&
    portfolioBelongsToClient &&
    Clasificación &&
    causal &&
    projectName.trim() &&
    volumen.trim() &&
    unidad &&
    descripcion.trim() &&
    layer1 &&
    layer1Micron.trim() &&
    (!layer2 || layer2Micron.trim()) &&
    (!layer3 || layer3Micron.trim()) &&
    (!layer4 || layer4Micron.trim()) &&
    ancho.trim() &&
    largo.trim() &&
    (!requiereAnchoFuelle || anchoFuelle.trim()),
);

  const canCreate = requiredFieldsFilled && !isBlockingDuplicate;

  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
    setSelectedClient(null);
    setPortfolioCode("");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);
    setSimilarityMatches([]);
    setErrors((prev) => ({
      ...prev,
      clientId: "",
      portfolioCode: "",
    }));
  };

  const handlePortfolioSelect = (portfolio: PortfolioRecord) => {
    const selectedCode = normalizeText(getPortfolioCode(portfolio));

    const existsInClientList = portfoliosForClient.some(
      (item) => normalizeText(getPortfolioCode(item)) === selectedCode,
    );

    if (!existsInClientList) {
      setErrors((prev) => ({
        ...prev,
        portfolioCode:
          "El portafolio seleccionado no pertenece al cliente seleccionado.",
      }));
      return;
    }

    const code = getPortfolioCode(portfolio);
    const name = getPortfolioName(portfolio);

    setPortfolioCode(code);
    setPortfolioSearchTerm(`${code} - ${name}`);
    setIsPortfolioDropdownOpen(false);
    setSimilarityMatches([]);
    setErrors((prev) => ({
      ...prev,
      portfolioCode: "",
    }));
  };

  const clearPortfolio = () => {
    setPortfolioCode("");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);
    setSimilarityMatches([]);
  };

  const getLayerValue = (index: number) => {
  const values = [layer1, layer2, layer3, layer4];
  return values[index] || "";
};

const getLayerMicronValue = (index: number) => {
  const values = [layer1Micron, layer2Micron, layer3Micron, layer4Micron];
  return values[index] || "";
};

const setLayerMicronValue = (index: number, value: string) => {
  if (index === 0) setLayer1Micron(value);
  if (index === 1) setLayer2Micron(value);
  if (index === 2) setLayer3Micron(value);
  if (index === 3) setLayer4Micron(value);
};

const clearLayerMicronsAfter = (index: number) => {
  if (index < 0) return;

  if (index < 1) setLayer2Micron("");
  if (index < 2) setLayer3Micron("");
  if (index < 3) setLayer4Micron("");
};

const setLayerValue = (index: number, value: string) => {
  if (index === 0) setLayer1(value);
  if (index === 1) setLayer2(value);
  if (index === 2) setLayer3(value);
  if (index === 3) setLayer4(value);
};

const clearLayersAfter = (index: number) => {
  if (index < 0) return;

  if (index < 1) {
    setLayer2("");
    setLayer2Micron("");
  }

  if (index < 2) {
    setLayer3("");
    setLayer3Micron("");
  }

  if (index < 3) {
    setLayer4("");
    setLayer4Micron("");
  }
};

const handleLayerChange = (index: number, value: string) => {
  setLayerValue(index, value);

  const defaultMicron = getDefaultMicronByMaterial(value);
  setLayerMicronValue(index, defaultMicron);

  setErrors((prev) => ({
    ...prev,
    layer1: "",
    [`layer${index + 1}Micron`]: "",
  }));

  if (!value) {
    setLayerMicronValue(index, "");
    clearLayersAfter(index);
    clearLayerMicronsAfter(index);
    setVisibleLayerCount(Math.max(1, index + 1));
  }
};

const handleAddLayer = () => {
  if (visibleLayerCount >= 4) return;

  const lastVisibleLayerValue = getLayerValue(visibleLayerCount - 1);

  if (!lastVisibleLayerValue) return;

  setVisibleLayerCount((prev) => Math.min(prev + 1, 4));
};

const handleRemoveLastLayer = () => {
  if (visibleLayerCount <= 1) return;

  const layerIndexToRemove = visibleLayerCount - 1;

  setLayerValue(layerIndexToRemove, "");
  clearLayersAfter(layerIndexToRemove);

  setVisibleLayerCount((prev) => Math.max(prev - 1, 1));
};

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedClientId && !isPortfolioLocked) {
      newErrors.clientId = "Selecciona un cliente.";
    }

    if (!selectedPortfolio) {
      newErrors.portfolioCode = "Selecciona un portafolio base.";
    }

    if (!portfolioBelongsToClient) {
      newErrors.portfolioCode =
        "El portafolio seleccionado no pertenece al cliente seleccionado.";
    }

    if (!Clasificación) {
      newErrors.Clasificación = "Selecciona Clasificación.";
    }

    if (!causal) {
      newErrors.causal = "Selecciona el causal.";
    }

    if (!projectName.trim()) {
      newErrors.projectName = "Ingresa el nombre del proyecto.";
    }

    if (!volumen.trim()) {
      newErrors.volumen = "Ingresa el volumen/cantidad referencial.";
    }

    if (!unidad) {
      newErrors.unidad = "Selecciona la unidad.";
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = "Ingresa la descripción breve de la necesidad.";
    }

    if (!layer1) {
      newErrors.layer1 = "Selecciona la capa 1.";
    }
if (layer1 && !layer1Micron.trim()) {
  newErrors.layer1Micron = "Ingresa el micraje de la capa 1.";
}

if (layer2 && !layer2Micron.trim()) {
  newErrors.layer2Micron = "Ingresa el micraje de la capa 2.";
}

if (layer3 && !layer3Micron.trim()) {
  newErrors.layer3Micron = "Ingresa el micraje de la capa 3.";
}

if (layer4 && !layer4Micron.trim()) {
  newErrors.layer4Micron = "Ingresa el micraje de la capa 4.";
}
    if (!ancho.trim()) {
      newErrors.ancho = "Ingresa el ancho.";
    }

    if (!largo.trim()) {
      newErrors.largo = "Ingresa el largo.";
    }

    if (requiereAnchoFuelle && !anchoFuelle.trim()) {
      newErrors.anchoFuelle = "Ingresa el ancho de fuelle.";
    }


    if (isBlockingDuplicate) {
      newErrors.similarity =
        "No se puede crear proyecto. Existe uno muy similar en el mismo portafolio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const createdProject = createProjectFromPortfolioSafe({
      portfolio: selectedPortfolio!,
      initialData: {
        clasificacion: "Nuevo",
        tipoProyecto: causal,
       ClasificaciónNuevaValidacion: causal,
        Clasificación,
        causal,
        licitacion: "No",
        status: "Registrado",

        projectName: projectName.trim(),
        volumenCantidadReferencial: volumen.trim(),
        unidad,
        descripcionNecesidad: descripcion.trim(),

        layer1Material: layer1,
layer1MaterialLabel: getMaterialLabel(layer1),
layer1Micraje: layer1Micron.trim(),

layer2Material: layer2 || undefined,
layer2MaterialLabel: layer2 ? getMaterialLabel(layer2) : undefined,
layer2Micraje: layer2 ? layer2Micron.trim() : undefined,

layer3Material: layer3 || undefined,
layer3MaterialLabel: layer3 ? getMaterialLabel(layer3) : undefined,
layer3Micraje: layer3 ? layer3Micron.trim() : undefined,

layer4Material: layer4 || undefined,
layer4MaterialLabel: layer4 ? getMaterialLabel(layer4) : undefined,
layer4Micraje: layer4 ? layer4Micron.trim() : undefined,

estructuraCalculada,
estructuraMateriales: [
  layer1 ? `${getMaterialLabel(layer1)} ${layer1Micron.trim()} µ` : "",
  layer2 ? `${getMaterialLabel(layer2)} ${layer2Micron.trim()} µ` : "",
  layer3 ? `${getMaterialLabel(layer3)} ${layer3Micron.trim()} µ` : "",
  layer4 ? `${getMaterialLabel(layer4)} ${layer4Micron.trim()} µ` : "",
]
  .filter(Boolean)
  .join(" / "),

        ancho: ancho.trim(),
        largo: largo.trim(),
        anchoFuelle: requiereAnchoFuelle ? anchoFuelle.trim() : undefined,

        comentarios: comentarios.trim() || undefined,
        nombreTecnicoCalculado,

        clientCode: inheritedClientCode || resolvedSelectedClient.code,
        clientName: inheritedClientName || resolvedSelectedClient.name,
        portfolioCode: inheritedPortfolioCode,
        portfolioName: inheritedPortfolioName,
        envoltura,
        usoFinal,
        maquinaCliente,
        segmento: inheritedSegment,
        subSegmento: inheritedSubSegment,
        sector: inheritedSector,
        afMarketId: inheritedAfMarketId,

        mejorProyectoSimilar: topMatch
          ? getProjectCode(topMatch.project)
          : undefined,
        porcentajeSimilitud: topScore > 0 ? topScore : undefined,
        alcanceSimilitud: topMatch?.scope,
        recomendacionOdiseo: topMatch
          ? getRecomendacion(topMatch.score, topMatch.scope)
          : "Puedes crear un nuevo proyecto.",
      },
      createdBy: String(currentUser?.id ?? "system"),
    });

    const createdProjectCode =
      getRecordValue(createdProject, ["code", "projectCode", "id"]) ||
      getRecordValue(createdProject, ["codigo"]);

    setShowConfirmDialog(false);
    onProjectCreated?.(createdProjectCode);
    onClose();
    navigate("/projects");
  };

  const handleCreateClick = () => {
    if (isWarningDuplicate) {
      setShowConfirmDialog(true);
      return;
    }

    handleCreate();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Crear Proyecto</h3>
            <p className="text-sm text-slate-500">
              Momento 1: Captura la base técnica mínima para validación
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              {!isPortfolioLocked && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ClientSearchField
                    label="Cliente *"
                    value={selectedClientId}
                    onChange={handleClientChange}
                    onSelect={(client: ClientRecord) => {
                      setSelectedClient(client);
                      setErrors((prev) => ({ ...prev, clientId: "" }));
                    }}
                    error={errors.clientId}
                  />

                  <div className="relative space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Portafolio Base *
                    </label>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={portfolioSearchTerm}
                        disabled={!selectedClientId}
                        onChange={(event) => {
                          setPortfolioSearchTerm(event.target.value);
                          setPortfolioCode("");
                          setIsPortfolioDropdownOpen(true);
                          setErrors((prev) => ({
                            ...prev,
                            portfolioCode: "",
                          }));
                        }}
                        onFocus={() => {
                          if (selectedClientId)
                            setIsPortfolioDropdownOpen(true);
                        }}
                        onBlur={() => {
                          window.setTimeout(
                            () => setIsPortfolioDropdownOpen(false),
                            150,
                          );
                        }}
                        placeholder={
                          selectedClientId
                            ? "Buscar portafolio por código o nombre..."
                            : "Selecciona primero un cliente"
                        }
                        className={[
                          "h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm transition-all",
                          "placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary",
                          !selectedClientId
                            ? "cursor-not-allowed bg-slate-50 text-slate-400"
                            : "",
                          errors.portfolioCode
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300",
                        ].join(" ")}
                      />

                      {(portfolioSearchTerm || portfolioCode) && (
                        <button
                          type="button"
                          onClick={clearPortfolio}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          aria-label="Limpiar portafolio"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {selectedClientId && isPortfolioDropdownOpen && (
                      <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                        {filteredPortfoliosForClient.length > 0 ? (
                          filteredPortfoliosForClient.map((portfolio) => {
                            const code = getPortfolioCode(portfolio);
                            const name = getPortfolioName(portfolio);
                            const clientName =
                              getPortfolioClientName(portfolio);

                            return (
                              <button
                                key={code}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handlePortfolioSelect(portfolio)}
                                className="w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">
                                      {name || code}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      Código: {code}
                                    </p>
                                  </div>

                                  <span className="shrink-0 text-xs font-medium text-slate-500">
                                    Cliente:{" "}
                                    {clientName ||
                                      resolvedSelectedClient.name ||
                                      "—"}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            Este cliente no tiene portafolios disponibles con
                            ese criterio.
                          </div>
                        )}
                      </div>
                    )}

                    {selectedClientId && (
                      <p className="text-xs text-slate-500">
                        {portfoliosForClient.length} portafolio(s) del cliente
                      </p>
                    )}

                    {errors.portfolioCode && (
                      <span className="block text-xs text-red-600">
                        {errors.portfolioCode}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FormSelect
                  label="Clasificación *"
                  value={Clasificación}
                  onChange={(value) => {
                    setClasificación(value);
                    setCausal("");
                    setErrors((prev) => ({
                      ...prev,
                     Clasificación: "",
                      causal: "",
                    }));
                  }}
                  options={CLASIFICACIÓN_OPTIONS}
                  error={errors.Clasificación}
                  placeholder="-- Seleccione --"
                  disabled={!selectedPortfolio}
                />

                <FormSelect
                  label="Causal *"
                  value={causal}
                  onChange={(value) => {
                    setCausal(value);
                    setErrors((prev) => ({
                      ...prev,
                      causal: "",
                    }));
                  }}
                  options={getCausalOptions(Clasificación)}
                  error={errors.causal}
                  placeholder="-- Seleccione --"
                  disabled={!Clasificación}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FormInput
                  label="Nombre del Proyecto *"
                  value={projectName}
                  onChange={(value) => {
                    setProjectName(value);
                    setErrors((prev) => ({ ...prev, projectName: "" }));
                  }}
                  placeholder="Ej. Salsa Premium"
                  error={errors.projectName}
                />

                <FormInput
                  label="Volumen/cantidad referencial *"
                  value={volumen}
                  onChange={(value) => {
                    setVolumen(value);
                    setErrors((prev) => ({ ...prev, volumen: "" }));
                  }}
                  placeholder="Ej. 500"
                  error={errors.volumen}
                />

                <FormSelect
                  label="Unidad *"
                  value={unidad}
                  onChange={(value) => {
                    setUnidad(value);
                    setErrors((prev) => ({ ...prev, unidad: "" }));
                  }}
                  options={UNIT_OPTIONS}
                  placeholder="-- Seleccione --"
                  error={errors.unidad}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Descripción breve de la necesidad *
                </label>

                <textarea
                  value={descripcion}
                  onChange={(event) => {
                    setDescripcion(event.target.value);
                    setErrors((prev) => ({ ...prev, descripcion: "" }));
                  }}
                  placeholder="Describe la necesidad técnica o comercial..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  rows={2}
                />

                {errors.descripcion && (
                  <span className="block text-xs text-red-600">
                    {errors.descripcion}
                  </span>
                )}
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-4">
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
        Materiales por capa *
      </label>
    </div>

    <div className="flex items-center gap-2">
      {visibleLayerCount > 1 && (
        <button
          type="button"
          onClick={handleRemoveLastLayer}
          className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Quitar capa
        </button>
      )}

      <button
        type="button"
        onClick={handleAddLayer}
        disabled={
          visibleLayerCount >= 4 ||
!getLayerValue(visibleLayerCount - 1) ||
!getLayerMicronValue(visibleLayerCount - 1)
        }
        className={[
          "h-9 rounded-lg px-3 text-xs font-semibold transition",
          visibleLayerCount >= 4 ||
!getLayerValue(visibleLayerCount - 1) ||
!getLayerMicronValue(visibleLayerCount - 1)
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "border border-brand-primary bg-white text-brand-primary hover:bg-brand-primary/5",
        ].join(" ")}
      >
        + Nueva capa
      </button>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
  {Array.from({ length: visibleLayerCount }).map((_, index) => {
    const layerNumber = index + 1;
    const isFirstLayer = index === 0;
    const selectedMaterial = getLayerValue(index);
    const micronOptions = getMicronOptionsByMaterial(selectedMaterial);

    const micronSelectOptions = micronOptions.map((micron) => ({
      value: micron,
      label: `${micron} µ`,
    }));

    return (
      <div
        key={`layer-${layerNumber}`}
        className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
      >
        <FormSelect
          label={`Capa ${layerNumber}${isFirstLayer ? " *" : ""}`}
          value={selectedMaterial}
          onChange={(value) => handleLayerChange(index, value)}
          options={MATERIAL_OPTIONS}
          placeholder="Material"
          error={isFirstLayer ? errors.layer1 : undefined}
        />

        {micronOptions.length > 0 ? (
          <FormSelect
            label="Micraje (µ) *"
            value={getLayerMicronValue(index)}
            onChange={(value) => {
              setLayerMicronValue(index, value);
              setErrors((prev) => ({
                ...prev,
                [`layer${layerNumber}Micron`]: "",
              }));
            }}
            options={micronSelectOptions}
            placeholder="Seleccionar"
            error={errors[`layer${layerNumber}Micron`]}
            disabled={!selectedMaterial}
          />
        ) : (
          <FormInput
            label="Micraje (µ) *"
            value={getLayerMicronValue(index)}
            onChange={(value) => {
              setLayerMicronValue(index, value);
              setErrors((prev) => ({
                ...prev,
                [`layer${layerNumber}Micron`]: "",
              }));
            }}
            placeholder="Ej. 80"
            error={errors[`layer${layerNumber}Micron`]}
            disabled={!selectedMaterial}
          />
        )}
      </div>
    );
  })}
</div>

</div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FormInput
                  label="Ancho (mm) *"
                  value={ancho}
                  onChange={(value) => {
                    setAncho(value);
                    setErrors((prev) => ({ ...prev, ancho: "" }));
                  }}
                  placeholder="Ej. 100"
                  error={errors.ancho}
                />

                <FormInput
                  label="Largo (mm) *"
                  value={largo}
                  onChange={(value) => {
                    setLargo(value);
                    setErrors((prev) => ({ ...prev, largo: "" }));
                  }}
                  placeholder="Ej. 150"
                  error={errors.largo}
                />

                {requiereAnchoFuelle && (
                  <FormInput
                    label="Ancho de fuelle (mm) *"
                    value={anchoFuelle}
                    onChange={(value) => {
                      setAnchoFuelle(value);
                      setErrors((prev) => ({ ...prev, anchoFuelle: "" }));
                    }}
                    placeholder="Ej. 30"
                    error={errors.anchoFuelle}
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Comentarios
                </label>

                <textarea
                  value={comentarios}
                  onChange={(event) => {
                    setComentarios(event.target.value);
                    setErrors((prev) => ({ ...prev, comentarios: "" }));
                  }}
                  placeholder="Comentarios técnicos iniciales."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  rows={2}
                />

                {errors.comentarios && (
                  <span className="block text-xs text-red-600">
                    {errors.comentarios}
                  </span>
                )}
              </div>
                            {estructuraCalculada && (
                <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                  <h4 className="mb-3 border-b border-green-100 pb-2 text-sm font-bold text-green-700">
                    Resultado
                  </h4>

                  <div className="space-y-2">
                    <PreviewRow
                      label="Estructura"
                      value={estructuraCalculada}
                    />
                    <PreviewRow
                      label="Nombre técnico"
                      value={nombreTecnicoCalculado || "—"}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <h4 className="mb-3 border-b border-brand-primary/10 pb-2 text-sm font-bold text-brand-primary">
                  Herencia del Portafolio
                </h4>

                {selectedPortfolio ? (
                  <div className="space-y-2">
                    <PreviewRow
                      label="Portafolio"
                      value={inheritedPortfolioName || inheritedPortfolioCode}
                    />
                    <PreviewRow
                      label="Cliente"
                      value={
                        inheritedClientName ||
                        resolvedSelectedClient.name ||
                        "—"
                      }
                    />
                    <PreviewRow
                      label="Planta"
                      value={inheritedPlantName || "—"}
                    />
                    <PreviewRow
                      label="Ejecutivo"
                      value={inheritedExecutiveName || "—"}
                    />
                    <PreviewRow label="Envoltura" value={envoltura || "—"} />
                    <PreviewRow label="Uso Final" value={usoFinal || "—"} />
                    <PreviewRow
                      label="Segmento"
                      value={inheritedSegment || "—"}
                    />
                    <PreviewRow
                      label="Sub-segmento"
                      value={inheritedSubSegment || "—"}
                    />
                    <PreviewRow label="Sector" value={inheritedSector || "—"} />
                    <PreviewRow
                      label="AFMarketID"
                      value={inheritedAfMarketId || "—"}
                    />
                    <PreviewRow
                      label="Máquina / Envasado"
                      value={maquinaCliente || "—"}
                    />
                  </div>
                ) : (
                  <p className="py-4 text-center text-xs text-slate-500">
                    Selecciona un portafolio para ver su herencia.
                  </p>
                )}
              </div>

              {hasMinDataForSearch && (
                <div
                  className={[
                    "rounded-xl border p-4",
                    isBlockingDuplicate
                      ? "border-red-200 bg-red-50"
                      : isWarningDuplicate
                        ? "border-yellow-200 bg-yellow-50"
                        : topScore > 0
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-slate-50",
                  ].join(" ")}
                >
                  <div className="mb-3 flex items-start gap-2">
                    {isBlockingDuplicate || isWarningDuplicate ? (
                      <AlertCircle
                        size={16}
                        className={[
                          "mt-0.5 flex-shrink-0",
                          isBlockingDuplicate
                            ? "text-red-600"
                            : "text-yellow-600",
                        ].join(" ")}
                      />
                    ) : (
                      <Info
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-slate-600"
                      />
                    )}

                    <h4 className="text-sm font-bold">
                      Proyecto Técnico Objetivo
                    </h4>
                  </div>

                  {topMatch && topScore >= 70 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-700">
                        {getProjectCode(topMatch.project)} ·{" "}
                        {getProjectName(topMatch.project)}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">
                            Similitud técnica
                          </span>
                          <div className="font-bold text-slate-900">
                            {Math.round(topMatch.score)}%
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500">Estado</span>
                          <div className="font-bold text-slate-900">
                            {getProjectStatus(topMatch.project) || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-2">
                        <span className="text-xs text-slate-500">Alcance</span>
                        <div className="text-xs font-bold text-slate-900">
                          {getScopeLabel(topMatch.scope)}
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-2">
                        <p className="text-xs text-slate-700">
                          <strong>Recomendación ODISEO:</strong>{" "}
                          {getRecomendacion(topMatch.score, topMatch.scope)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/projects/${getProjectCode(topMatch.project)}`,
                          )
                        }
                      >
                        Ver proyecto
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">
                      {projectsPassingMandatoryFilter === 0
                        ? "No se encontraron proyectos similares bajo el mismo cliente, portafolio, envoltura, uso final y máquina. Puedes crear un nuevo proyecto."
                        : "No se encontraron coincidencias técnicas relevantes para este contexto."}
                    </p>
                  )}

                  {similarityMatches.length > 1 && (
                    <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                      <p className="text-xs font-bold text-slate-600">
                        Otras coincidencias:
                      </p>

                      {similarityMatches.slice(1).map((match) => (
                        <div
                          key={getProjectCode(match.project)}
                          className="rounded border border-slate-100 bg-white p-2 text-xs"
                        >
                          <div className="flex justify-between">
                            <span className="font-semibold">
                              {getProjectCode(match.project)}
                            </span>
                            <span className="font-bold">
                              {Math.round(match.score)}%
                            </span>
                          </div>
                          <div className="mt-1 text-slate-600">
                            {getProjectName(match.project)}
                          </div>
                          <div className="mt-1 text-slate-500">
                            {getScopeLabel(match.scope)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleCreateClick}
            disabled={!canCreate}
            title={
              isBlockingDuplicate
                ? "No se puede crear: existe un proyecto muy similar en el mismo portafolio."
                : ""
            }
          >
            Crear Proyecto
          </Button>
        </div>

        {showConfirmDialog && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
            <div className="max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Confirmar creación
              </h3>
              <p className="mb-6 text-sm text-slate-600">
                Existe un proyecto similar con similitud del{" "}
                {Math.round(topScore)}%. ¿Deseas continuar creando uno nuevo?
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                  Crear igual
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
