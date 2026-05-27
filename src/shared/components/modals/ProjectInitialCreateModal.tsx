import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { Info, Search, X } from "lucide-react";
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

const MOTIVO_OPTIONS = [
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

const getCausalOptions = (motivo: string) => {
  if (motivo === "Producto nuevo") return CAUSAL_OPTIONS_NUEVO;
  if (motivo === "Producto modificado") return CAUSAL_OPTIONS_MODIFICADO;
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

const getMicronOptionsByMaterial = (material: string): string[] => {
  return MATERIAL_MICRON_CONFIG[material]?.micronOptions ?? [];
};

const getDefaultMicronByMaterial = (material: string): string => {
  return MATERIAL_MICRON_CONFIG[material]?.defaultMicron ?? "";
};

const formatLayerForTechnicalName = (material: string, micron?: string): string => {
  const label = getMaterialLabel(material);
  if (!micron || !material) return label;
  return `${label} ${micron} µ`;
};

const getUnitOptions = () => UNITS_OF_MEASURE.map((unit) => ({
  value: unit,
  label: (UNIT_LABELS as Record<string, string>)[unit] || unit,
}));

const UNIT_OPTIONS = getUnitOptions();

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

const getPortfolioFieldWithStorageFallback = (
  portfolio: PortfolioRecord | null | undefined,
  keys: string[],
): string => {
  const directValue = getRecordValue(portfolio, keys);

  if (directValue) return directValue;

  const code = getPortfolioCode(portfolio);

  if (!code) return "";

  const fullPortfolio = getAllPortfolioRecordsSafe().find(
    (item) => normalizeText(getPortfolioCode(item)) === normalizeText(code),
  );

  return getRecordValue(fullPortfolio, keys);
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

// User resolution helpers
const getAllUserRecordsSafe = (): AnyRecord[] => {
  const api = getStorageApi(userStorage);

  const functionNames = [
    "getAllUsers",
    "getUsers",
    "listUsers",
    "getUserRecords",
    "getAllUserRecords",
    "getUserList",
    "getStoredUsers",
    "getUsersFromStorage",
  ];

  for (const functionName of functionNames) {
    const fn = api[functionName];

    if (typeof fn === "function") {
      try {
        const rows = toArray<AnyRecord>((fn as () => unknown)());
        if (rows.length > 0) return rows;
      } catch {
        // Continuar con la siguiente alternativa.
      }
    }
  }

  const constantNames = [
    "USERS",
    "MOCK_USERS",
    "USER_RECORDS",
    "userRecords",
    "users",
    "DEFAULT_USERS",
    "INITIAL_USERS",
  ];

  for (const constantName of constantNames) {
    const rows = toArray<AnyRecord>(api[constantName]);
    if (rows.length > 0) return rows;
  }

  if (typeof window !== "undefined") {
    const rows: AnyRecord[] = [];

    Object.keys(window.localStorage).forEach((key) => {
      const normalizedKey = normalizeText(key);

      if (
        !normalizedKey.includes("user") &&
        !normalizedKey.includes("usuario")
      ) {
        return;
      }

      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || "");
        rows.push(...toArray<AnyRecord>(parsed));
      } catch {
        // Ignorar claves que no sean JSON.
      }
    });

    return rows.filter(
      (row) => getUserCodeFromAny(row) || getUserNameFromAny(row),
    );
  }

  return [];
};

const getUserCodeFromAny = (user: AnyRecord | undefined): string => {
  return getRecordValue(user, [
    "codigo",
    "code",
    "userCode",
    "id",
    "Id",
    "userId",
    "usuarioId",
    "employeeId",
    "codigoUsuario",
    "codUsuario",
  ]);
};

const getUserNameFromAny = (user: AnyRecord | undefined): string => {
  return getRecordValue(user, [
    "usuario",
    "nombre",
    "name",
    "userName",
    "username",
    "fullName",
    "nombreCompleto",
    "displayName",
    "commercialName",
    "nombreUsuario",
  ]);
};

const getUserEmailFromAny = (user: AnyRecord | undefined): string => {
  return getRecordValue(user, [
    "email",
    "correo",
    "mail",
    "emailAddress",
  ]);
};

const isUserReferenceCode = (value: unknown): boolean => {
  const raw = String(value ?? "").trim();

  if (!raw) return false;

  return (
    /^USR[-_]/i.test(raw) ||
    /^US[-_]/i.test(raw) ||
    /^USER[-_]/i.test(raw) ||
    /^EJC[-_]/i.test(raw)
  );
};

const resolvePortfolioExecutiveName = (
  portfolio: PortfolioRecord | null | undefined,
): string => {
  if (!portfolio) return "";

  const executiveNameKeys = [
    "ejecutivo",
    "ejecutivoComercial",
    "ejecutivoComercialName",
    "ejecutivoName",
    "nombreEjecutivo",
    "nombreEjecutivoComercial",
    "executive",
    "executiveName",
    "commercialExecutive",
    "commercialExecutiveName",
    "salesExecutive",
    "salesExecutiveName",
    "seller",
    "sellerName",
    "vendedor",
    "vendedorName",
    "nombreVendedor",
    "accountExecutive",
    "accountExecutiveName",
    "responsableComercial",
    "responsableComercialName",
    "executiveDisplayName",
    "commercialResponsible",
    "commercialResponsibleName",
  ];

  const executiveIdKeys = [
    "ejecutivoId",
    "ejecutivoComercialId",
    "executiveId",
    "commercialExecutiveId",
    "salesExecutiveId",
    "sellerId",
    "vendedorId",
    "accountExecutiveId",
    "responsableComercialId",
    "commercialResponsibleId",
    "ownerId",
    "userId",
    "usuarioId",
  ];

  const rawExecutiveNameOrCode = getPortfolioFieldWithStorageFallback(
    portfolio,
    executiveNameKeys,
  );

  const rawExecutiveId = getPortfolioFieldWithStorageFallback(
    portfolio,
    executiveIdKeys,
  );

  const valueToResolve = rawExecutiveId || rawExecutiveNameOrCode;

  if (!valueToResolve) return "";

const valueVariants = getUserCodeVariants(valueToResolve);
const normalizedValue = normalizeText(valueToResolve);

const matchedUser = getAllUserRecordsSafe().find((user) => {
  const userCodeVariants = getUserCodeVariants(getUserCodeFromAny(user));
  const userName = normalizeText(getUserNameFromAny(user));
  const userEmail = normalizeText(getUserEmailFromAny(user));

  const sameCode = userCodeVariants.some((code) =>
    valueVariants.includes(code),
  );

  return (
    sameCode ||
    (!!userName && userName === normalizedValue) ||
    (!!userEmail && userEmail === normalizedValue)
  );
});

  const resolvedUserName = getUserNameFromAny(matchedUser);

  if (resolvedUserName) return resolvedUserName;

  if (rawExecutiveNameOrCode && !isUserReferenceCode(rawExecutiveNameOrCode)) {
    return rawExecutiveNameOrCode;
  }

  return valueToResolve;
};

// Value normalization helpers
const normalizeMotivoValue = (value: string): string => {
  const normalized = normalizeText(value);

  if (normalized.includes("nuevo") && !normalized.includes("modificado")) {
    return "producto nuevo";
  }

  if (normalized.includes("modificado") || normalized.includes("modificacion")) {
    return "producto modificado";
  }

  return normalized;
};

const normalizeUserLookupValue = (value: unknown): string =>
  normalizeText(value).replace(/[^a-z0-9]/g, "");

const getUserCodeVariants = (value: unknown): string[] => {
  const normalized = normalizeUserLookupValue(value);

  if (!normalized) return [];

  const variants = new Set<string>([normalized]);

  // Caso USR-EJC-001003 vs US-EJC-001003
  if (normalized.startsWith("usr")) {
    variants.add(`us${normalized.slice(3)}`);
  }

  if (normalized.startsWith("us") && !normalized.startsWith("usr")) {
    variants.add(`usr${normalized.slice(2)}`);
  }

  return Array.from(variants);
};

const normalizeCausalValue = (value: string): string => {
  return normalizeText(value);
};

const normalizeMaterialValue = (value: unknown): string => {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  const entry = Object.entries(MATERIAL_MICRON_CONFIG).find(
    ([materialCode, config]) =>
      normalizeText(materialCode) === normalized ||
      normalizeText(config.label) === normalized,
  );

  return entry ? normalizeText(entry[0]) : normalized;
};

// Map de variantes de unidades a su forma normalizada
const UNIT_NORMALIZATION_MAP: Record<string, string> = {
  "gramos": "g",
  "gramo": "g",
  "g": "g",
  "kilogramos": "kg",
  "kilogramo": "kg",
  "kg": "kg",
  "mililitros": "ml",
  "mililitro": "ml",
  "ml": "ml",
  "litros": "l",
  "litro": "l",
  "l": "l",
};

const normalizeUnitValue = (value: string): string => {
  const normalized = normalizeText(value);
  return UNIT_NORMALIZATION_MAP[normalized] || normalized;
};

const parseMicronNumber = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = parseFloat(String(value).replace(/[^\d.]/g, ""));
  return isNaN(parsed) ? null : parsed;
};

const parseVolumeNumber = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = parseFloat(String(value).replace(/[^\d.]/g, ""));
  return isNaN(parsed) ? null : parsed;
};

const getExistingLayerMaterial = (
  existing: ProjectRecord,
  index: number,
): string => {
  const keysByIndex = [
    [
      "layer1Material",
      "layer1MaterialLabel",
      "capa1",
      "materialCapa1",
      "material1",
    ],
    [
      "layer2Material",
      "layer2MaterialLabel",
      "capa2",
      "materialCapa2",
      "material2",
    ],
    [
      "layer3Material",
      "layer3MaterialLabel",
      "capa3",
      "materialCapa3",
      "material3",
    ],
    [
      "layer4Material",
      "layer4MaterialLabel",
      "capa4",
      "materialCapa4",
      "material4",
    ],
  ];

  return getRecordValue(existing, keysByIndex[index] || []);
};

const getExistingLayerMicron = (
  existing: ProjectRecord,
  index: number,
): number | null => {
  const keysByIndex = [
    ["layer1Micraje", "layer1Micron", "micrajeCapa1", "micraje1"],
    ["layer2Micraje", "layer2Micron", "micrajeCapa2", "micraje2"],
    ["layer3Micraje", "layer3Micron", "micrajeCapa3", "micraje3"],
    ["layer4Micraje", "layer4Micron", "micrajeCapa4", "micraje4"],
  ];

  return parseMicronNumber(getRecordValue(existing, keysByIndex[index] || []));
};

const DEBUG_PROJECT_SIMILARITY = false;

const getProjectsFromPortfolioRecord = (
  portfolio: PortfolioRecord | null | undefined,
): ProjectRecord[] => {
  if (!portfolio) return [];

  const possibleProjectCollections = [
    portfolio.projects,
    portfolio.proyectos,
    portfolio.associatedProjects,
    portfolio.proyectosAsociados,
    portfolio.validationProjects,
    portfolio.projectRecords,
  ];

  const projects = possibleProjectCollections.flatMap((value) =>
    toArray<ProjectRecord>(value),
  );

  const portfolioCode = getPortfolioCode(portfolio);
  const portfolioName = getPortfolioName(portfolio);
  const clientCode = getPortfolioClientCode(portfolio);
  const clientName = getPortfolioClientName(portfolio);
  const envoltura = getRecordValue(portfolio, ["env", "envoltura", "wrappingName"]);
  const usoFinal = getRecordValue(portfolio, ["uf", "usoFinal", "useFinalName"]);
  const maquinaCliente = getRecordValue(portfolio, [
    "maq",
    "maquinaCliente",
    "packingMachineName",
  ]);
  const afMarketId = getRecordValue(portfolio, ["af", "afMarketId", "afMarketID"]);

  return projects.map((project) => ({
    ...project,
    portfolioCode: getRecordValue(project, ["portfolioCode", "portafolioCodigo", "portfolioId"]) || portfolioCode,
    portfolioName: getRecordValue(project, ["portfolioName", "portafolioNombre"]) || portfolioName,
    clientCode: getRecordValue(project, ["clientCode", "clienteCodigo", "clientId"]) || clientCode,
    clientName: getRecordValue(project, ["clientName", "cliente", "nombreCliente"]) || clientName,
    envoltura: getRecordValue(project, ["envoltura", "wrappingName", "env"]) || envoltura,
    usoFinal: getRecordValue(project, ["usoFinal", "useFinalName", "uf"]) || usoFinal,
    maquinaCliente:
      getRecordValue(project, ["maquinaCliente", "packingMachineName", "maq"]) ||
      maquinaCliente,
    afMarketId: getRecordValue(project, ["afMarketId", "afMarketID"]) || afMarketId,
  }));
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

  const constantNames = [
    "PROJECTS",
    "MOCK_PROJECTS",
    "PROJECT_RECORDS",
    "projectRecords",
    "projects",
  ];

  for (const constantName of constantNames) {
    const rows = toArray<ProjectRecord>(api[constantName]);
    if (rows.length > 0) return rows;
  }

  if (typeof window !== "undefined") {
    const rows: ProjectRecord[] = [];

    Object.keys(window.localStorage).forEach((key) => {
      const normalizedKey = normalizeText(key);

      if (
        !normalizedKey.includes("project") &&
        !normalizedKey.includes("proyecto")
      ) {
        return;
      }

      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || "");
        rows.push(...toArray<ProjectRecord>(parsed));
      } catch {
        // Ignorar claves que no sean JSON.
      }
    });

    return rows.filter((row) => getProjectCode(row) || getProjectName(row));
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
    motivo?: string;
    causal?: string;
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
    existing.portfolioCode ??
      existing.portafolioCodigo ??
      existing.portfolioId ??
      existing.portafolioId ??
      existing.codigoPortafolio ??
      "",
  );

  const samePortfolio =
    candidate.portfolioCode &&
    normalizeText(candidate.portfolioCode) === existingPortfolioCode;

  if (!samePortfolio) return false;

  // Envoltura - flexible: allow if candidate empty (sparse data)
  const envCand = normalizeText(candidate.envoltura);
  const envExist = normalizeText(
    existing.envoltura ?? existing.wrappingName ?? existing.env,
  );

  if (envCand && envExist && envCand !== envExist) return false;

  // UsoFinal or AfMarket - flexible matching
  const usoFinalCand = normalizeText(candidate.usoFinal);
  const usoFinalExist = normalizeText(
    existing.usoFinal ?? existing.useFinalName ?? existing.uf,
  );

  const afMarketCand = normalizeText(candidate.afMarketId || "");
  const afMarketExist = normalizeText(
    existing.afMarketId ?? existing.afMarketID ?? "",
  );

  const sameUsoFinalOrMarket =
    (usoFinalCand && usoFinalExist && usoFinalCand === usoFinalExist) ||
    (afMarketCand && afMarketExist && afMarketCand === afMarketExist) ||
    (!usoFinalExist && !afMarketExist);

  if (!sameUsoFinalOrMarket) return false;

  // Maquina - flexible: allow if candidate empty or existing empty
  const maquinaCand = normalizeText(candidate.maquinaCliente);
  const maquinaExist = normalizeText(
    existing.maquinaCliente ?? existing.packingMachineName ?? existing.maq,
  );

  const sameMaquina =
    maquinaCand && maquinaExist ? maquinaCand === maquinaExist : true;

  if (!sameMaquina) return false;

  // Motivo - normalized comparison
  const motivoCand = normalizeMotivoValue(String(candidate.motivo || ""));
  const motivoExist = normalizeMotivoValue(
    String(
      existing.motivo ??
        existing.clasificacion ??
        existing.classification ??
        existing.requestReason ??
        existing.tipoSolicitud ??
        "",
    ),
  );

  if (motivoCand && motivoExist && motivoCand !== motivoExist) return false;

  // Causal - normalized comparison
  const casualCand = normalizeCausalValue(String(candidate.causal || ""));
  const casualExist = normalizeCausalValue(
    String(
      existing.causal ??
        existing.motivoNuevaValidacion ??
        existing.tipoProyecto ??
        existing.validationReason ??
        existing.causalValidacion ??
        "",
    ),
  );

  if (casualCand && casualExist && casualCand !== casualExist) return false;

  return true;
};

const calculatePreliminarySimilarity = (
  candidate: {
    layer1?: string;
    layer2?: string;
    layer3?: string;
    layer4?: string;
    layer1Micron?: string;
    layer2Micron?: string;
    layer3Micron?: string;
    layer4Micron?: string;
    volumen?: string;
    unidad?: string;
  },
  existing: ProjectRecord,
): number => {
  let score = 0;

  const candidateLayers = [
    candidate.layer1,
    candidate.layer2,
    candidate.layer3,
    candidate.layer4,
  ].filter(Boolean);

  const candidateMicrons = [
    candidate.layer1Micron,
    candidate.layer2Micron,
    candidate.layer3Micron,
    candidate.layer4Micron,
  ];

  const existingLayers = [
    getExistingLayerMaterial(existing, 0),
    getExistingLayerMaterial(existing, 1),
    getExistingLayerMaterial(existing, 2),
    getExistingLayerMaterial(existing, 3),
  ].filter(Boolean);

  // Check if candidate has any micron data
  const candidateHasMicron = candidateMicrons.some(Boolean);
  const existingHasMicron = [0, 1, 2, 3].some(
    (index) => getExistingLayerMicron(existing, index) !== null,
  );

  // Determine weighting based on data presence
  let materialWeight: number;
  let capasWeight: number;
  let volumenWeight: number;
  let micronWeight: number;

  if (candidateHasMicron && existingHasMicron) {
    // Both have micron: 45% materials, 20% capas, 15% volumen, 20% micron
    materialWeight = 45;
    capasWeight = 20;
    volumenWeight = 15;
    micronWeight = 20;
  } else {
    // At least one missing micron: 65% materials, 20% capas, 15% volumen, 0% micron
    materialWeight = 65;
    capasWeight = 20;
    volumenWeight = 15;
    micronWeight = 0;
  }

  // 1. Materiales por capa - normalized comparison
  if (candidateLayers.length > 0 && existingLayers.length > 0) {
    let materialMatches = 0;
    const maxLayers = Math.max(candidateLayers.length, existingLayers.length);

    candidateLayers.forEach((candMaterial, index) => {
      if (existingLayers[index]) {
        const candNorm = normalizeMaterialValue(candMaterial);
        const existNorm = normalizeMaterialValue(existingLayers[index]);
        if (candNorm && existNorm && candNorm === existNorm) {
          materialMatches += 1;
        }
      }
    });

    const materialScore = Math.round((materialMatches / maxLayers) * materialWeight);
    score += materialScore;
  }

  // 2. Cantidad de capas
  if (candidateLayers.length === existingLayers.length && candidateLayers.length > 0) {
    score += capasWeight;
  } else if (candidateLayers.length > 0 && existingLayers.length > 0) {
    const capasRatio = Math.min(candidateLayers.length, existingLayers.length) /
                       Math.max(candidateLayers.length, existingLayers.length);
    score += Math.round(capasRatio * capasWeight);
  }

  // 3. Volumen referencial + unidad
  const volumenCand = parseVolumeNumber(candidate.volumen);
  const unidadCand = normalizeUnitValue(String(candidate.unidad || ""));

  const volumenExistRaw = existing.volumenReferencial ??
                          existing.volumenCantidadReferencial ??
                          existing.volumen;
  const volumenExist = parseVolumeNumber(String(volumenExistRaw || ""));
  const unidadExist = normalizeUnitValue(String(existing.unidad ?? existing.unidadVolumen ?? ""));

  if (
    volumenCand !== null &&
    volumenExist !== null &&
    unidadCand &&
    unidadExist &&
    unidadCand === unidadExist
  ) {
    const tolerance = volumenExist * 0.05;
    if (Math.abs(volumenCand - volumenExist) <= tolerance) {
      score += volumenWeight;
    } else {
      const similarity = Math.max(0, 1 - Math.abs(volumenCand - volumenExist) / volumenExist);
      score += Math.round(similarity * volumenWeight * 0.5);
    }
  }

  // 4. Micraje (only if both have micron data) - numeric comparison with 5% tolerance
  if (micronWeight > 0 && candidateHasMicron && existingHasMicron) {
    let micronMatches = 0;
    let matchCount = 0;

    candidateLayers.forEach((candMaterial, index) => {
      const candMicron = parseMicronNumber(candidateMicrons[index]);
      const existingMaterial = existingLayers[index];
      const existingMicron = getExistingLayerMicron(existing, index);

      if (candMaterial && existingMaterial) {
        const candNorm = normalizeMaterialValue(candMaterial);
        const existNorm = normalizeMaterialValue(existingMaterial);
        if (candNorm && existNorm && candNorm === existNorm) {
          matchCount += 1;

          if (candMicron !== null && existingMicron !== null) {
            const tolerance = existingMicron * 0.05;
            if (Math.abs(candMicron - existingMicron) <= tolerance) {
              micronMatches += 1;
            }
          }
        }
      }
    });

    if (matchCount > 0) {
      const micronScore = Math.round((micronMatches / matchCount) * micronWeight);
      score += micronScore;
    }
  }

  if (DEBUG_PROJECT_SIMILARITY) {
    console.log("[SIMILARITY]", {
      candidateLayers,
      existingLayers,
      score,
    });
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
  const [quotationFile, setQuotationFile] = useState<File | null>(null);
  const [portfolioCode, setPortfolioCode] = useState(
    initialPortfolioCode || "",
  );
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

  const [motivo, setMotivo] = useState("");
  const [causal, setCausal] = useState("");
  const [projectName, setProjectName] = useState("");
  const [volumen, setVolumen] = useState("");
  const [unidad, setUnidad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [layer1, setLayer1] = useState("");
const [layer2, setLayer2] = useState("");
const [layer3, setLayer3] = useState("");
const [layer4, setLayer4] = useState("");
const [layer1Micron, setLayer1Micron] = useState("");
const [layer2Micron, setLayer2Micron] = useState("");
const [layer3Micron, setLayer3Micron] = useState("");
const [layer4Micron, setLayer4Micron] = useState("");
const [visibleLayerCount, setVisibleLayerCount] = useState(1);

  const [comentarios, setComentarios] = useState("");

  const [productoBaseId, setProductoBaseId] = useState("");
  const [productoBaseNombre, setProductoBaseNombre] = useState("");
  const [productoBaseCodigo, setProductoBaseCodigo] = useState("");
  const [productoBaseVersion, setProductoBaseVersion] = useState("");

  const [similarityMatches, setSimilarityMatches] = useState<SimilarityMatch[]>(
    [],
  );
  const [selectedReference, setSelectedReference] = useState<{
    projectId?: string;
    projectCode?: string;
    projectName?: string;
    score?: number;
    datosSugeridosMomento2?: AnyRecord;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [creationSteps, setCreationSteps] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [stepNotice, setStepNotice] = useState<{
    key: string;
    message: string;
  } | null>(null);

  const [previewProject, setPreviewProject] = useState<ProjectRecord | null>(null);

  const stepNoticeTimeoutRef = useRef<number | null>(null);

  const showStepNotice = (key: string, message: string) => {
    setStepNotice({ key, message });

    if (stepNoticeTimeoutRef.current) {
      window.clearTimeout(stepNoticeTimeoutRef.current);
    }

    stepNoticeTimeoutRef.current = window.setTimeout(() => {
      setStepNotice(null);
      stepNoticeTimeoutRef.current = null;
    }, 5000);
  };

  const isPortfolioLocked = Boolean(propPortfolio || initialPortfolioCode);

  // Resolve selected client early for use in completion flags
  const resolvedSelectedClient = useMemo(
    () => resolveSelectedClient(selectedClientId, selectedClient),
    [selectedClientId, selectedClient],
  );

  // Get selected portfolio early for use in completion flags
  const selectedPortfolio = useMemo(() => {
    if (propPortfolio) return propPortfolio;
    if (portfolioCode) return getPortfolioByCodeSafe(portfolioCode);
    return null;
  }, [propPortfolio, portfolioCode]);

  // Field completion flags - portfolioBelongsToClient will be calculated below after portfoliosForClient is available
  // For now, we use a simple check
  const isClientStepComplete = Boolean(isPortfolioLocked || selectedClientId);

  const isMotivoStepComplete = Boolean(motivo);
  const isCausalStepComplete = Boolean(causal);

  const requiresProductoBase = motivo === "Producto modificado";

  const isProductoBaseStepComplete = Boolean(
    !requiresProductoBase ||
      productoBaseCodigo.trim() ||
      productoBaseNombre.trim()
  );

  const isProductoBaseVersionStepComplete = Boolean(
    !requiresProductoBase || productoBaseVersion.trim()
  );

  const isProjectNameStepComplete = Boolean(projectName.trim());
  const isVolumenStepComplete = Boolean(volumen.trim());
  const isUnidadStepComplete = Boolean(unidad);
  const isDescripcionStepComplete = Boolean(descripcion.trim());

  // Computed editability flags
  const canEditPortfolio = isClientStepComplete && !isPortfolioLocked;
  // canEditMotivo will be set after isPortfolioStepComplete is computed
  const canEditCausal = isMotivoStepComplete;
  const canEditProductoBase = isCausalStepComplete && requiresProductoBase;
  const canEditProductoBaseVersion =
    canEditProductoBase && isProductoBaseStepComplete;
  const canEditProjectName =
    isCausalStepComplete &&
    (!requiresProductoBase ||
      (isProductoBaseStepComplete && isProductoBaseVersionStepComplete));
  const canEditVolumen = canEditProjectName && isProjectNameStepComplete;
  const canEditUnidad = canEditVolumen && isVolumenStepComplete;
  const canEditDescripcion = canEditUnidad && isUnidadStepComplete;
  const canEditMateriales = canEditDescripcion && isDescripcionStepComplete;
  const canEditComentarios = canEditDescripcion && isDescripcionStepComplete;

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

  const inheritedExecutiveName = resolvePortfolioExecutiveName(selectedPortfolio);

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

  // Check if portfolio belongs to selected client
  const portfolioBelongsToClient = useMemo(() => {
    if (isPortfolioLocked) return true;
    if (!selectedPortfolio) return false;

    return portfoliosForClient.some(
      (item) =>
        normalizeText(getPortfolioCode(item)) ===
        normalizeText(getPortfolioCode(selectedPortfolio)),
    );
  }, [isPortfolioLocked, selectedPortfolio, portfoliosForClient]);

  // Fixed isPortfolioStepComplete - allows Motivo to enable for locked portfolios
  const isPortfolioStepComplete = Boolean(
    selectedPortfolio && portfolioBelongsToClient
  );

  const canEditMotivo = isPortfolioStepComplete;

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
    layer1 ? formatLayerForTechnicalName(layer1, layer1Micron) : "",
    layer2 ? formatLayerForTechnicalName(layer2, layer2Micron) : "",
    layer3 ? formatLayerForTechnicalName(layer3, layer3Micron) : "",
    layer4 ? formatLayerForTechnicalName(layer4, layer4Micron) : "",
  ]
    .filter(Boolean)
    .join(" - ");

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

  const requiredBaseFieldsFilled = Boolean(
    (isPortfolioLocked || selectedClientId) &&
      selectedPortfolio &&
      portfolioBelongsToClient &&
      motivo &&
      causal &&
      projectName.trim() &&
      volumen.trim() &&
      unidad &&
      descripcion.trim() &&
      (motivo !== "Producto modificado" ||
        ((productoBaseCodigo.trim() || productoBaseNombre.trim()) &&
          productoBaseVersion.trim()))
  );

  const hasMaterialsForSimilarity = [layer1, layer2, layer3, layer4].some(Boolean);

  const hasMinDataForSimilarity = requiredBaseFieldsFilled && hasMaterialsForSimilarity;

  const hasMinDataForSearch = hasMinDataForSimilarity;

  const projectsForSimilarity = useMemo(() => {
    const fromStorage = getProjectRecordsSafe();
    const fromPortfolio = getProjectsFromPortfolioRecord(selectedPortfolio);

    const merged = [...fromStorage, ...fromPortfolio];

    const seen = new Set<string>();

    return merged.filter((project) => {
      const key =
        getProjectCode(project) ||
        `${getProjectName(project)}-${getRecordValue(project, ["portfolioCode", "portafolioCodigo"])}`;

      if (!key) return true;

      const normalizedKey = normalizeText(key);

      if (seen.has(normalizedKey)) return false;

      seen.add(normalizedKey);
      return true;
    });
  }, [selectedPortfolio]);

  useEffect(() => {
    if (!isOpen) {
      setStepNotice(null);
      setSelectedReference(null);
      setPreviewProject(null);
      if (stepNoticeTimeoutRef.current) {
        window.clearTimeout(stepNoticeTimeoutRef.current);
        stepNoticeTimeoutRef.current = null;
      }
      return;
    }

    const initialCode = initialPortfolioCode || getPortfolioCode(propPortfolio);

    setSelectedClientId("");
    setSelectedClient(null);
    setPortfolioCode(initialCode || "");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);

    setMotivo("");
    setCausal("");
    setProjectName("");
    setVolumen("");
    setUnidad("");
    setDescripcion("");

    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");

    setLayer1("");
    setLayer2("");
    setLayer3("");
    setLayer4("");
    setLayer1Micron("");
    setLayer2Micron("");
    setLayer3Micron("");
    setLayer4Micron("");
    setVisibleLayerCount(1);

    setComentarios("");

    setSimilarityMatches([]);
    setErrors({});
    setStepNotice(null);
    setSelectedReference(null);
    setPreviewProject(null);
  }, [isOpen, initialPortfolioCode, propPortfolio]);

  useEffect(() => {
    return () => {
      if (stepNoticeTimeoutRef.current) {
        window.clearTimeout(stepNoticeTimeoutRef.current);
        stepNoticeTimeoutRef.current = null;
      }
    };
  }, []);

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
      motivo,
      causal,
      layer1,
      layer2,
      layer3,
      layer4,
      layer1Micron,
      layer2Micron,
      layer3Micron,
      layer4Micron,
      descripcion,
      volumen,
      unidad,
    };

    if (DEBUG_PROJECT_SIMILARITY) {
      const all = projectsForSimilarity;
      const filtered = all.filter((project) =>
        doesProjectPassMandatoryFilter(candidateData, project),
      );

      console.log("[ODISEO] Similarity candidateData", candidateData);
      console.log("[ODISEO] Total projects for similarity", all.length);
      console.log("[ODISEO] Projects passing mandatory filter", filtered.length);
      console.table(
        filtered.map((project) => ({
          code: getProjectCode(project),
          name: getProjectName(project),
          motivo: project.motivo,
          clasificacion: project.clasificacion,
          causal: project.causal,
          tipoProyecto: project.tipoProyecto,
          portfolioCode: project.portfolioCode,
          layer1: project.layer1Material,
          layer2: project.layer2Material,
          layer3: project.layer3Material,
          layer4: project.layer4Material,
          score: calculatePreliminarySimilarity(candidateData, project),
        })),
      );
    }
    const results = projectsForSimilarity
      .filter((project) => doesProjectPassMandatoryFilter(candidateData, project))
      .map((project) => ({
        project,
        score: calculatePreliminarySimilarity(candidateData, project),
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
    projectsForSimilarity,
    inheritedClientCode,
    inheritedClientName,
    inheritedPortfolioCode,
    inheritedAfMarketId,
    resolvedSelectedClient.code,
    resolvedSelectedClient.name,
    envoltura,
    usoFinal,
    maquinaCliente,
    motivo,
    causal,
    volumen,
    unidad,
    layer1,
    layer2,
    layer3,
    layer4,
    layer1Micron,
    layer2Micron,
    layer3Micron,
    layer4Micron,
    descripcion,
    nombreTecnicoCalculado,
    estructuraCalculada,
  ]);

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
      motivo,
      causal,
    };

    return projectsForSimilarity.filter((project) =>
      doesProjectPassMandatoryFilter(candidateData, project),
    ).length;
  }, [
    hasMinDataForSearch,
    projectsForSimilarity,
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

  const canCreate = requiredBaseFieldsFilled;

  const validateForm = useMemo(() => {
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

    if (!motivo) {
      newErrors.motivo = "Selecciona el motivo.";
    }

    if (!causal) {
      newErrors.causal = "Selecciona el motivo.";
    }

    if (!projectName.trim()) {
      newErrors.projectName = "Ingresa el nombre del proyecto.";
    }

    if (!volumen.trim()) {
      newErrors.volumen = projectName.trim()
        ? "Ingresa el volumen/cantidad referencial."
        : "Completa primero el nombre del proyecto.";
    }

    if (!unidad) {
      newErrors.unidad = volumen.trim()
        ? "Selecciona la unidad."
        : "Completa primero el volumen referencial.";
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = "Ingresa la descripción breve de la necesidad.";
    }

    if (motivo === "Producto modificado") {
      if (!productoBaseCodigo.trim() && !productoBaseNombre.trim()) {
        newErrors.productoBase = "Selecciona o ingresa el producto base vigente.";
      }

      if (!productoBaseVersion.trim()) {
        newErrors.productoBaseVersion = "Ingresa la versión del producto base.";
      }
    }

    return newErrors;
  }, [
    selectedClientId,
    isPortfolioLocked,
    selectedPortfolio,
    portfolioBelongsToClient,
    motivo,
    causal,
    projectName,
    volumen,
    unidad,
    descripcion,
    productoBaseCodigo,
    productoBaseNombre,
    productoBaseVersion,
  ]);

  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
    setSelectedClient(null);
    setPortfolioCode("");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);
    setMotivo("");
    setCausal("");
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setProjectName("");
    setVolumen("");
    setUnidad("");
    setDescripcion("");
    setLayer1("");
    setLayer2("");
    setLayer3("");
    setLayer4("");
    setLayer1Micron("");
    setLayer2Micron("");
    setLayer3Micron("");
    setLayer4Micron("");
    setVisibleLayerCount(1);
    setComentarios("");
    setSimilarityMatches([]);
    setSelectedReference(null);
    setErrors((prev) => ({
      ...prev,
      clientId: "",
      portfolioCode: "",
      motivo: "",
      causal: "",
      productoBase: "",
      productoBaseVersion: "",
      projectName: "",
      volumen: "",
      unidad: "",
      descripcion: "",
      layer1: "",
      comentarios: "",
    }));

    if (value) {
      showStepNotice("client", "Cliente seleccionado. Portafolio Base se habilitó.");
    }
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
    setMotivo("");
    setCausal("");
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setProjectName("");
    setVolumen("");
    setUnidad("");
    setDescripcion("");
    setLayer1("");
    setLayer2("");
    setLayer3("");
    setLayer4("");
    setLayer1Micron("");
    setLayer2Micron("");
    setLayer3Micron("");
    setLayer4Micron("");
    setVisibleLayerCount(1);
    setComentarios("");
    setSimilarityMatches([]);
    setSelectedReference(null);
    setErrors((prev) => ({
      ...prev,
      portfolioCode: "",
      motivo: "",
      causal: "",
      productoBase: "",
      productoBaseVersion: "",
      projectName: "",
      volumen: "",
      unidad: "",
      descripcion: "",
      layer1: "",
      comentarios: "",
    }));

    showStepNotice("portfolio", "Portafolio seleccionado. Motivo se habilitó.");
  };

  const clearPortfolio = () => {
    setPortfolioCode("");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);
    setMotivo("");
    setCausal("");
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setProjectName("");
    setVolumen("");
    setUnidad("");
    setDescripcion("");
    setLayer1("");
    setLayer2("");
    setLayer3("");
    setLayer4("");
    setLayer1Micron("");
    setLayer2Micron("");
    setLayer3Micron("");
    setLayer4Micron("");
    setVisibleLayerCount(1);
    setComentarios("");
    setSimilarityMatches([]);
    setSelectedReference(null);
  };

  const getLayerValue = (index: number) => {
  const values = [layer1, layer2, layer3, layer4];
  return values[index] || "";
};

const setLayerValue = (index: number, value: string) => {
  if (index === 0) setLayer1(value);
  if (index === 1) setLayer2(value);
  if (index === 2) setLayer3(value);
  if (index === 3) setLayer4(value);
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

  setErrors((prev) => ({
    ...prev,
    layer1: "",
  }));

  if (value) {
    const defaultMicron = getDefaultMicronByMaterial(value);
    if (defaultMicron) {
      setLayerMicronValue(index, defaultMicron);
    }
    setSimilarityMatches([]);
    setSelectedReference(null);
  } else {
    clearLayersAfter(index);
    clearLayerMicronsAfter(index);
    setVisibleLayerCount(Math.max(1, index + 1));
    setSimilarityMatches([]);
    setSelectedReference(null);
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
    setErrors(validateForm);
    return Object.keys(validateForm).length === 0;
  };

  const isProjectValidReference = (project: ProjectRecord): boolean => {
    const status = normalizeText(getProjectStatus(project));
    const estadoValidacion = normalizeText(
      getRecordValue(project, ["estadoValidacion", "validationStatus"])
    );

    return (
      status.includes("validado") ||
      status.includes("aprobado") ||
      estadoValidacion.includes("validado") ||
      estadoValidacion.includes("aprobado")
    );
  };

  const buildMoment2ReferenceData = (project: ProjectRecord): AnyRecord => {
    return {
      sourceProjectId: getRecordValue(project, ["id", "projectId"]),
      sourceProjectCode: getProjectCode(project),
      sourceProjectName: getProjectName(project),

      estructuraCalculada: project.estructuraCalculada,
      cantidadCapasReferencial: project.cantidadCapasReferencial,
      estructuraMateriales: project.estructuraMateriales,
      estructuraMaterialesReferencial: project.estructuraMaterialesReferencial,

      layer1Material: project.layer1Material,
      layer1MaterialLabel: project.layer1MaterialLabel,
      layer1Micraje: project.layer1Micraje ?? project.layer1Micron,

      layer2Material: project.layer2Material,
      layer2MaterialLabel: project.layer2MaterialLabel,
      layer2Micraje: project.layer2Micraje ?? project.layer2Micron,

      layer3Material: project.layer3Material,
      layer3MaterialLabel: project.layer3MaterialLabel,
      layer3Micraje: project.layer3Micraje ?? project.layer3Micron,

      layer4Material: project.layer4Material,
      layer4MaterialLabel: project.layer4MaterialLabel,
      layer4Micraje: project.layer4Micraje ?? project.layer4Micron,

      ancho: project.ancho,
      largo: project.largo,
      anchoFuelle: project.anchoFuelle,
      espesorTotal: project.espesorTotal,
      gramaje: project.gramaje,
      barrera: project.barrera,
      tipoImpresion: project.tipoImpresion,
      cantidadColores: project.cantidadColores,
      acabado: project.acabado,
      accesorios: project.accesorios,
      tipoSellado: project.tipoSellado,
      zipper: project.zipper,
      valvula: project.valvula,
      troquel: project.troquel,
      disenoEspecial: project.disenoEspecial,
      criteriosTecnicos: project.criteriosTecnicos,
      comentariosTecnicos: project.comentariosTecnicos,
    };
  };

  const applyReferenceProject = (match: SimilarityMatch) => {
    const project = match.project;

    setSelectedReference({
      projectId: getRecordValue(project, ["id", "projectId", "code", "projectCode"]),
      projectCode: getProjectCode(project),
      projectName: getProjectName(project),
      score: match.score,
      datosSugeridosMomento2: buildMoment2ReferenceData(project),
    });

    setErrors({});
  };

  const applyReferenceProjectFromProject = (project: ProjectRecord, score: number = 0) => {
    setSelectedReference({
      projectId: getRecordValue(project, ["id", "projectId", "code", "projectCode"]),
      projectCode: getProjectCode(project),
      projectName: getProjectName(project),
      score: score,
      datosSugeridosMomento2: buildMoment2ReferenceData(project),
    });

    setPreviewProject(null);
    setErrors({});
  };

  const handleCreate = async () => {
    if (!validate()) return;

    setIsCreating(true);
    setCreationSteps([]);

    const addStep = (step: string) => {
      console.log(`[ODISEO] ${step}`);
      setCreationSteps((prev) => [...prev, step]);
    };

    try {
      addStep("✓ Validando datos del formulario...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      addStep("✓ Preparando información del portafolio...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      addStep("✓ Compilando estructura de capas y materiales...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      addStep("✓ Calculando nombre técnico y estructura...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      addStep("✓ Preparando datos heredados del portafolio...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      addStep("✓ Registrando proyecto en el sistema...");

      const createdProject = createProjectFromPortfolioSafe({
        portfolio: selectedPortfolio!,
        initialData: {
          clasificacion: "Nuevo",
          tipoProyecto: causal,
          motivoNuevaValidacion: causal,
          motivo,
          causal,
          licitacion: "No",
          status: "Registrado",
          estadoValidacion: "Pendiente de solicitud",

          projectName: projectName.trim(),
          volumenCantidadReferencial: volumen.trim(),
          unidad: normalizeUnitValue(unidad),
          descripcionNecesidad: descripcion.trim(),

          layer1Material: layer1,
          layer1MaterialLabel: getMaterialLabel(layer1),
          layer1Micraje: layer1Micron || undefined,

          layer2Material: layer2 || undefined,
          layer2MaterialLabel: layer2 ? getMaterialLabel(layer2) : undefined,
          layer2Micraje: layer2Micron || undefined,

          layer3Material: layer3 || undefined,
          layer3MaterialLabel: layer3 ? getMaterialLabel(layer3) : undefined,
          layer3Micraje: layer3Micron || undefined,

          layer4Material: layer4 || undefined,
          layer4MaterialLabel: layer4 ? getMaterialLabel(layer4) : undefined,
          layer4Micraje: layer4Micron || undefined,

          estructuraCalculada,
          cantidadCapasReferencial: [layer1, layer2, layer3, layer4].filter(Boolean).length,
          estructuraMateriales: [
            layer1 ? getMaterialLabel(layer1) : "",
            layer2 ? getMaterialLabel(layer2) : "",
            layer3 ? getMaterialLabel(layer3) : "",
            layer4 ? getMaterialLabel(layer4) : "",
          ]
            .filter(Boolean)
            .join(" / "),
          estructuraMaterialesReferencial: [
            layer1 ? formatLayerForTechnicalName(layer1, layer1Micron) : "",
            layer2 ? formatLayerForTechnicalName(layer2, layer2Micron) : "",
            layer3 ? formatLayerForTechnicalName(layer3, layer3Micron) : "",
            layer4 ? formatLayerForTechnicalName(layer4, layer4Micron) : "",
          ]
            .filter(Boolean)
            .join(" / "),
          volumenReferencial: volumen.trim(),

          comentarios: comentarios.trim() || undefined,
          nombreTecnicoCalculado,

          clientCode: inheritedClientCode || resolvedSelectedClient.code,
          clientName: inheritedClientName || resolvedSelectedClient.name,
          portfolioCode: inheritedPortfolioCode,
          portfolioName: inheritedPortfolioName,
          envoltura,
          usoFinal,
          maquinaCliente,
          ejecutivoComercial: inheritedExecutiveName || undefined,
          ejecutivoName: inheritedExecutiveName || undefined,
          executiveName: inheritedExecutiveName || undefined,
          segmento: inheritedSegment,
          subSegmento: inheritedSubSegment,
          sector: inheritedSector,
          afMarketId: inheritedAfMarketId,

          ...(motivo === "Producto modificado" && {
            productoBaseId: productoBaseId || undefined,
            productoBaseCodigo: productoBaseCodigo.trim(),
            productoBaseNombre: productoBaseNombre.trim(),
            productoBaseVersion: productoBaseVersion.trim(),
          }),

          proyectoReferenciaId: selectedReference?.projectId,
          proyectoReferenciaCodigo: selectedReference?.projectCode,
          proyectoReferenciaNombre: selectedReference?.projectName,
          porcentajeSimilitudPreliminar: selectedReference?.score,
          referenciaParaMomento2: Boolean(selectedReference),
          datosSugeridosMomento2: selectedReference?.datosSugeridosMomento2,
        },
        createdBy: String(currentUser?.id ?? "system"),
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
      addStep("✓ Guardando datos en el almacenamiento...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      const createdProjectCode =
        getRecordValue(createdProject, ["code", "projectCode", "id"]) ||
        getRecordValue(createdProject, ["codigo"]);

      addStep(`✓ ¡Proyecto creado exitosamente! (${createdProjectCode})`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      onProjectCreated?.(createdProjectCode);
      onClose();
      navigate("/projects");
    } catch (error) {
      addStep(`✗ Error durante la creación: ${error}`);
      console.error("[ODISEO] Error creating project:", error);
      setIsCreating(false);
    }
  };

  const handleCreateClick = () => {
    handleCreate();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Crear Producto Preliminar 1</h3>
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Importar sustento de cotización aprobada
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setQuotationFile(file);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                  />
                </div>
                {quotationFile && (
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Archivo cargado: {quotationFile.name}
                  </p>
                )}
              </div>

              {!isPortfolioLocked && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
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
                    {stepNotice?.key === "client" && (
                      <p className="text-xs font-medium text-green-600">
                        {stepNotice.message}
                      </p>
                    )}
                  </div>

                  <div className={`relative z-[10040] space-y-1 transition-all duration-500 ${
                    !canEditPortfolio
                      ? "opacity-50 scale-95"
                      : "opacity-100 scale-100"
                  }`}>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Portafolio Base *
                    </label>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={portfolioSearchTerm}
                        disabled={!canEditPortfolio}
                        onChange={(event) => {
                          if (!canEditPortfolio) return;
                          setPortfolioSearchTerm(event.target.value);
                          setPortfolioCode("");
                          setIsPortfolioDropdownOpen(true);
                          setErrors((prev) => ({
                            ...prev,
                            portfolioCode: "",
                          }));
                        }}
                        onFocus={() => {
                          if (canEditPortfolio)
                            setIsPortfolioDropdownOpen(true);
                        }}
                        onBlur={() => {
                          window.setTimeout(
                            () => setIsPortfolioDropdownOpen(false),
                            150,
                          );
                        }}
                        placeholder={
                          canEditPortfolio
                            ? "Buscar portafolio por código o nombre..."
                            : "Selecciona primero un cliente"
                        }
                        className={[
                          "h-11 w-full rounded-lg border pl-10 pr-10 text-sm shadow-sm transition-colors",
                          "placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary",
                          canEditPortfolio
                            ? "border-slate-300 bg-white text-slate-800"
                            : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400",
                          errors.portfolioCode
                            ? "border-red-300 bg-red-50 text-slate-800"
                            : "",
                        ].join(" ")}
                      />

                      {canEditPortfolio && (portfolioSearchTerm || portfolioCode) && (
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

                    {canEditPortfolio && isPortfolioDropdownOpen && (
                      <div className="absolute left-0 right-0 z-[10050] mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-300 bg-white shadow-2xl ring-1 ring-slate-900/5">
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
                                className="w-full border-b border-slate-100 bg-white px-4 py-3 text-left transition hover:bg-blue-50"
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
                          <div className="space-y-2">
                            <div className="px-4 py-3 text-sm text-slate-500">
                              Este cliente no tiene portafolios disponibles con
                              ese criterio.
                            </div>
                            <button
                              type="button"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                setIsPortfolioDropdownOpen(false);
                                onClose();
                                navigate("/portfolio/new");
                              }}
                              className="w-full border-t border-slate-100 bg-gradient-to-r from-blue-50 to-blue-50 px-4 py-3 text-left transition hover:bg-blue-100"
                            >
                              <p className="text-sm font-semibold text-blue-600">
                                + Crear Portafolio Base
                              </p>
                              <p className="mt-0.5 text-xs text-blue-500">
                                Crear un nuevo portafolio para este cliente
                              </p>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {canEditPortfolio && (
                      <p className="text-xs text-slate-500">
                        {portfoliosForClient.length} portafolio(s) del cliente
                      </p>
                    )}

                    {stepNotice?.key === "portfolio" && (
                      <p className="text-xs font-medium text-green-600">
                        {stepNotice.message}
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
                  value={motivo}
                  onChange={(value) => {
                    setMotivo(value);
                    setCausal("");
                    setProjectName("");
                    setVolumen("");
                    setUnidad("");
                    setDescripcion("");
                    setLayer1("");
                    setLayer2("");
                    setLayer3("");
                    setLayer4("");
                    setLayer1Micron("");
                    setLayer2Micron("");
                    setLayer3Micron("");
                    setLayer4Micron("");
                    setVisibleLayerCount(1);
                    setComentarios("");

                    if (value !== "Producto modificado") {
                      setProductoBaseId("");
                      setProductoBaseNombre("");
                      setProductoBaseCodigo("");
                      setProductoBaseVersion("");
                    }

                    setSimilarityMatches([]);
                    setSelectedReference(null);
                    setErrors((prev) => ({
                      ...prev,
                      motivo: "",
                      causal: "",
                      productoBase: "",
                      productoBaseVersion: "",
                      projectName: "",
                      volumen: "",
                      unidad: "",
                      descripcion: "",
                      layer1: "",
                      comentarios: "",
                    }));

                    if (value) {
                      showStepNotice("motivo", "Motivo seleccionado. Se habilitó seleccionar el siguiente paso.");
                    }
                  }}
                  options={MOTIVO_OPTIONS}
                  error={errors.motivo}
                  placeholder="-- Seleccione --"
                  disabled={!canEditMotivo}
                />

                <FormSelect
                  label="Motivo *"
                  value={causal}
                  onChange={(value) => {
                    setCausal(value);
                    setProjectName("");
                    setVolumen("");
                    setUnidad("");
                    setDescripcion("");
                    setLayer1("");
                    setLayer2("");
                    setLayer3("");
                    setLayer4("");
                    setLayer1Micron("");
                    setLayer2Micron("");
                    setLayer3Micron("");
                    setLayer4Micron("");
                    setVisibleLayerCount(1);
                    setComentarios("");
                    setSimilarityMatches([]);
                    setSelectedReference(null);
                    setErrors((prev) => ({
                      ...prev,
                      causal: "",
                      projectName: "",
                      volumen: "",
                      unidad: "",
                      descripcion: "",
                      layer1: "",
                      comentarios: "",
                    }));

                    if (value) {
                      if (motivo === "Producto modificado") {
                        showStepNotice(
                          "causal",
                          "Motivo seleccionado. Producto base se habilitó.",
                        );
                      } else {
                        showStepNotice(
                          "causal",
                          "Motivo seleccionado. Nombre del Proyecto se habilitó.",
                        );
                      }
                    }
                  }}
                  options={getCausalOptions(motivo)}
                  error={errors.causal}
                  placeholder="-- Seleccione --"
                  disabled={!canEditCausal}
                />
              </div>

              {motivo === "Producto modificado" && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormInput
                    label="Producto base / SKU vigente *"
                    value={productoBaseCodigo || productoBaseNombre}
                    onChange={(value) => {
                      const wasEmpty = !productoBaseCodigo.trim() && !productoBaseNombre.trim();
                      setProductoBaseCodigo(value);
                      setProductoBaseNombre(value);
                      setProjectName("");
                      setVolumen("");
                      setUnidad("");
                      setDescripcion("");
                      setLayer1("");
                      setLayer2("");
                      setLayer3("");
                      setLayer4("");
                      setLayer1Micron("");
                      setLayer2Micron("");
                      setLayer3Micron("");
                      setLayer4Micron("");
                      setVisibleLayerCount(1);
                      setComentarios("");
                      setSimilarityMatches([]);
                      setSelectedReference(null);
                      setErrors((prev) => ({
                        ...prev,
                        productoBase: "",
                        projectName: "",
                        volumen: "",
                        unidad: "",
                        descripcion: "",
                        layer1: "",
                        comentarios: "",
                      }));

                      if (wasEmpty && value.trim()) {
                        showStepNotice(
                          "productoBase",
                          "Producto base completado. Versión se habilitó.",
                        );
                      }
                    }}
                    placeholder="Buscar o ingresar producto vigente"
                    error={errors.productoBase}
                    disabled={!canEditProductoBase}
                  />

                  <FormInput
                    label="Versión del producto base *"
                    value={productoBaseVersion}
                    onChange={(value) => {
                      const wasEmpty = !productoBaseVersion.trim();
                      setProductoBaseVersion(value);
                      setProjectName("");
                      setVolumen("");
                      setUnidad("");
                      setDescripcion("");
                      setLayer1("");
                      setLayer2("");
                      setLayer3("");
                      setLayer4("");
                      setLayer1Micron("");
                      setLayer2Micron("");
                      setLayer3Micron("");
                      setLayer4Micron("");
                      setVisibleLayerCount(1);
                      setComentarios("");
                      setSimilarityMatches([]);
                      setSelectedReference(null);
                      setErrors((prev) => ({
                        ...prev,
                        productoBaseVersion: "",
                        projectName: "",
                        volumen: "",
                        unidad: "",
                        descripcion: "",
                        layer1: "",
                        comentarios: "",
                      }));

                      if (wasEmpty && value.trim()) {
                        showStepNotice(
                          "productoBaseVersion",
                          "Versión completada. Nombre del Proyecto se habilitó.",
                        );
                      }
                    }}
                    placeholder="Ej. V1"
                    error={errors.productoBaseVersion}
                    disabled={!canEditProductoBaseVersion}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className={`space-y-1 transition-all duration-300 ${!projectName.trim() ? "opacity-100" : "opacity-100"}`}>
                  <FormInput
                    label="Nombre del Producto *"
                    value={projectName}
                    onChange={(value) => {
                      const wasEmpty = !projectName.trim();
                      setProjectName(value);
                      setVolumen("");
                      setUnidad("");
                      setDescripcion("");
                      setLayer1("");
                      setLayer2("");
                      setLayer3("");
                      setLayer4("");
                      setLayer1Micron("");
                      setLayer2Micron("");
                      setLayer3Micron("");
                      setLayer4Micron("");
                      setVisibleLayerCount(1);
                      setComentarios("");
                      setSimilarityMatches([]);
                      setSelectedReference(null);
                      setErrors((prev) => ({
                        ...prev,
                        projectName: "",
                        volumen: "",
                        unidad: "",
                        descripcion: "",
                        layer1: "",
                        comentarios: "",
                      }));

                      if (wasEmpty && value.trim()) {
                        showStepNotice(
                          "projectName",
                          "Nombre completado. Volumen referencial se habilitó.",
                        );
                      }
                    }}
                    placeholder="Ej. Salsa Premium"
                    error={errors.projectName}
                    disabled={!canEditProjectName}
                  />
                  {stepNotice?.key === "projectName" && (
                    <p className="text-xs font-medium text-green-600">
                      {stepNotice.message}
                    </p>
                  )}
                </div>

                <div className={`space-y-1 transition-all duration-500 ${
                  !projectName.trim()
                    ? "opacity-50 scale-95"
                    : "opacity-100 scale-100"
                }`}>
                  <FormInput
                    label="Volumen referencial *"
                    value={volumen}
                    onChange={(value) => {
                      const wasEmpty = !volumen.trim();
                      setVolumen(value);
                      setUnidad("");
                      setDescripcion("");
                      setLayer1("");
                      setLayer2("");
                      setLayer3("");
                      setLayer4("");
                      setLayer1Micron("");
                      setLayer2Micron("");
                      setLayer3Micron("");
                      setLayer4Micron("");
                      setVisibleLayerCount(1);
                      setComentarios("");
                      setSimilarityMatches([]);
                      setSelectedReference(null);
                      setErrors((prev) => ({
                        ...prev,
                        volumen: "",
                        unidad: "",
                        descripcion: "",
                        layer1: "",
                        comentarios: "",
                      }));

                      if (wasEmpty && value.trim()) {
                        showStepNotice(
                          "volumen",
                          "Volumen completado. Unidad se habilitó.",
                        );
                      }
                    }}
                    placeholder="Ej. 500"
                    error={errors.volumen}
                    disabled={!canEditVolumen}
                  />
                  {stepNotice?.key === "volumen" && (
                    <p className="text-xs font-medium text-green-600">
                      {stepNotice.message}
                    </p>
                  )}
                </div>

                <div className={`space-y-1 transition-all duration-700 ${
                  !volumen.trim()
                    ? "opacity-50 scale-95"
                    : "opacity-100 scale-100"
                }`}>
                  <FormSelect
                    label="Unidad *"
                    value={unidad}
                    onChange={(value) => {
                      setUnidad(value);
                      setDescripcion("");
                      setLayer1("");
                      setLayer2("");
                      setLayer3("");
                      setLayer4("");
                      setLayer1Micron("");
                      setLayer2Micron("");
                      setLayer3Micron("");
                      setLayer4Micron("");
                      setVisibleLayerCount(1);
                      setComentarios("");
                      setSimilarityMatches([]);
                      setSelectedReference(null);
                      setErrors((prev) => ({
                        ...prev,
                        unidad: "",
                        descripcion: "",
                        layer1: "",
                        comentarios: "",
                      }));

                      if (value) {
                        showStepNotice(
                          "unidad",
                          "Unidad seleccionada. Descripción se habilitó.",
                        );
                      }
                    }}
                    options={UNIT_OPTIONS}
                    placeholder="-- Seleccione --"
                    error={errors.unidad}
                    disabled={!canEditUnidad}
                  />
                  {stepNotice?.key === "unidad" && (
                    <p className="text-xs font-medium text-green-600">
                      {stepNotice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Descripción breve de la necesidad *
                </label>

                <textarea
                  value={descripcion}
                  onChange={(event) => {
                    const wasEmpty = !descripcion.trim();
                    setDescripcion(event.target.value);
                    setLayer1("");
                    setLayer2("");
                    setLayer3("");
                    setLayer4("");
                    setLayer1Micron("");
                    setLayer2Micron("");
                    setLayer3Micron("");
                    setLayer4Micron("");
                    setVisibleLayerCount(1);
                    setComentarios("");
                    setSimilarityMatches([]);
                    setSelectedReference(null);
                    setErrors((prev) => ({
                      ...prev,
                      descripcion: "",
                      layer1: "",
                      comentarios: "",
                    }));

                    if (wasEmpty && event.target.value.trim()) {
                      showStepNotice(
                        "descripcion",
                        "Descripción completada. Materiales y Comentarios se habilitaron.",
                      );
                    }
                  }}
                  placeholder="Describe la necesidad técnica o comercial..."
                  disabled={!canEditDescripcion}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${
                    canEditDescripcion
                      ? "border-slate-300 bg-white text-slate-800"
                      : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                  rows={2}
                />

                {stepNotice?.key === "descripcion" && (
                  <p className="text-xs font-medium text-green-600">
                    {stepNotice.message}
                  </p>
                )}

                {errors.descripcion && (
                  <span className="block text-xs text-red-600">
                    {errors.descripcion}
                  </span>
                )}
              </div>

              <div className={`space-y-3 border-t border-slate-200 pt-4 transition-opacity ${canEditMateriales ? "opacity-100" : "opacity-60"}`}>
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
        Materiales por capa
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Opcional. El micraje mejora la precisión de búsqueda de similitudes.
      </p>
    </div>

    <div className="flex items-center gap-2">
      {visibleLayerCount > 1 && (
        <button
          type="button"
          onClick={handleRemoveLastLayer}
          disabled={!canEditMateriales}
          className={`h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold transition ${
            canEditMateriales
              ? "text-slate-600 hover:bg-slate-50"
              : "cursor-not-allowed bg-slate-50 text-slate-400"
          }`}
        >
          Quitar capa
        </button>
      )}

      <button
        type="button"
        onClick={handleAddLayer}
        disabled={
          !canEditMateriales ||
          visibleLayerCount >= 4 ||
          !getLayerValue(visibleLayerCount - 1)
        }
        className={[
          "h-9 rounded-lg px-3 text-xs font-semibold transition",
          !canEditMateriales ||
          visibleLayerCount >= 4 ||
          !getLayerValue(visibleLayerCount - 1)
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
    const selectedMicron = getLayerMicronValue(index);
    const micronOptions = getMicronOptionsByMaterial(selectedMaterial);
    const hasMicronOptions = micronOptions.length > 0;

    return (
      <div
        key={`layer-${layerNumber}`}
        className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
      >
        <FormSelect
          label={`Capa ${layerNumber}`}
          value={selectedMaterial}
          onChange={(value) => handleLayerChange(index, value)}
          options={MATERIAL_OPTIONS}
          placeholder="Material"
          error={isFirstLayer ? errors.layer1 : undefined}
          disabled={!canEditMateriales}
        />

        {selectedMaterial && (
          <div className="mt-2">
            {hasMicronOptions ? (
              <FormSelect
                label={`Micraje ${layerNumber}`}
                value={selectedMicron}
                onChange={(value) => setLayerMicronValue(index, value)}
                options={micronOptions.map((option) => ({
                  value: option,
                  label: `${option} µ`,
                }))}
                placeholder="Opcional"
                disabled={!canEditMateriales}
              />
            ) : (
              <FormInput
                label={`Micraje ${layerNumber}`}
                value={selectedMicron}
                onChange={(value) => setLayerMicronValue(index, value)}
                placeholder="Opcional (µ)"
                disabled={!canEditMateriales}
              />
            )}
          </div>
        )}
      </div>
    );
  })}
</div>

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
                  disabled={!canEditComentarios}
                  className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${
                    canEditComentarios
                      ? "bg-white text-slate-800"
                      : "cursor-not-allowed bg-slate-50 text-slate-400"
                  }`}
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
                      label="Ejecutivo comercial"
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
                      label="Máquina de Envasado"
                      value={maquinaCliente || "—"}
                    />
                  </div>
                ) : (
                  <p className="py-4 text-center text-xs text-slate-500">
                    Selecciona un portafolio para ver su herencia.
                  </p>
                )}
              </div>

              {requiredBaseFieldsFilled && !hasMaterialsForSimilarity && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="mb-3 flex items-start gap-2">
                    <Info size={16} className="mt-0.5 flex-shrink-0 text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-700">Búsqueda de similitud</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Completa los materiales por capa para buscar proyectos similares. El micraje es opcional pero mejora la precisión de la búsqueda.
                  </p>
                </div>
              )}

              {requiredBaseFieldsFilled && hasMaterialsForSimilarity && !topMatch && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="mb-3 flex items-start gap-2">
                    <Info size={16} className="mt-0.5 flex-shrink-0 text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-700">
                      Búsqueda de similitud
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600">
                    No se encontraron referencias preliminares relevantes para el mismo cliente,
                    portafolio, envoltura, uso final, máquina, motivo y causal.
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Proyectos evaluados: {projectsForSimilarity.length}.{" "}
                    Candidatos del mismo contexto: {projectsPassingMandatoryFilter}.
                  </p>
                </div>
              )}

              {hasMinDataForSearch && topMatch && topScore >= 50 && (
                <div
                  className={[
                    "rounded-xl border p-4",
                    topScore >= 85
                      ? "border-blue-200 bg-blue-50"
                      : "border-slate-200 bg-slate-50",
                  ].join(" ")}
                >
                  <div className="mb-3 flex items-start gap-2">
                    <Info
                      size={16}
                      className={[
                        "mt-0.5 flex-shrink-0",
                        topScore >= 85 ? "text-blue-600" : "text-slate-600",
                      ].join(" ")}
                    />

                    <h4 className="text-sm font-bold">
                      {topScore >= 85 ? "Coincidencia preliminar alta" : "Referencia preliminar disponible"}
                    </h4>
                  </div>

                  {topMatch && topScore >= 50 ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        {topScore >= 85
                          ? "Se encontró un proyecto similar dentro del mismo cliente, portafolio, envoltura, uso final, máquina, motivo y causal."
                          : "Este proyecto puede servir como referencia para completar información del Momento 2."}
                      </p>

                      <p className="text-xs font-semibold text-slate-700">
                        {getProjectCode(topMatch.project)} ·{" "}
                        {getProjectName(topMatch.project)}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">
                            Similitud preliminar
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

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setPreviewProject(topMatch.project)}
                        >
                          Ver proyecto
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => applyReferenceProject(topMatch)}
                        >
                          Usar como referencia
                        </Button>
                      </div>
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

              {selectedReference && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-green-700">
                        Referencia seleccionada para Momento 2
                      </h4>
                      <p className="mt-1 text-xs text-green-600">
                        Los datos técnicos de este proyecto se usarán para precargar el Momento 2
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded border border-green-100 bg-white p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {selectedReference.projectCode}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {selectedReference.projectName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-green-700">
                          {Math.round(selectedReference.score)}% similitud
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedReference(null)}
                      className="mt-2 w-full rounded border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                    >
                      Quitar referencia
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleCreateClick}
            disabled={!canCreate || isCreating}
          >
            {isCreating ? "Creando Proyecto..." : "Crear Producto Preliminar 1"}
          </Button>
        </div>

        {isCreating && creationSteps.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-600">
                Progreso de Creación
              </h4>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg bg-white p-3">
                {creationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <span className="flex-shrink-0 text-green-600">
                      {step.includes("✓") ? "✓" : "✗"}
                    </span>
                    <span className={step.includes("✗") ? "text-red-600" : "text-slate-700"}>
                      {step}
                    </span>
                  </div>
                ))}
                {creationSteps.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-brand-primary" />
                    <span>Procesando...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {previewProject && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">
                Ficha de proyecto de referencia
              </h3>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <PreviewRow
                    label="Código"
                    value={getProjectCode(previewProject) || "—"}
                  />
                  <PreviewRow
                    label="Estado"
                    value={getProjectStatus(previewProject) || "—"}
                  />
                  <PreviewRow
                    label="Cliente"
                    value={
                      getRecordValue(previewProject, ["clientName", "cliente", "nombreCliente"]) ||
                      "—"
                    }
                  />
                  <PreviewRow
                    label="Portafolio"
                    value={
                      getRecordValue(previewProject, [
                        "portfolioName",
                        "portafolioNombre",
                        "portfolioCode",
                      ]) || "—"
                    }
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 text-sm font-bold text-slate-900">
                    Información Momento 1
                  </h4>
                  <div className="space-y-2">
                    <PreviewRow
                      label="Nombre técnico"
                      value={getProjectName(previewProject) || "—"}
                    />
                    <PreviewRow
                      label="Clasificación / Motivo"
                      value={
                        getRecordValue(previewProject, [
                          "motivo",
                          "clasificacion",
                        ]) || "—"
                      }
                    />
                    <PreviewRow
                      label="Tipo / Causal"
                      value={
                        getRecordValue(previewProject, [
                          "causal",
                          "tipoProyecto",
                          "motivoNuevaValidacion",
                        ]) || "—"
                      }
                    />
                    <PreviewRow
                      label="Volumen referencial"
                      value={
                        (getRecordValue(previewProject, [
                          "volumenReferencial",
                          "volumenCantidadReferencial",
                        ]) ||
                          "") &&
                        `${getRecordValue(previewProject, [
                          "volumenReferencial",
                          "volumenCantidadReferencial",
                        ])} ${getRecordValue(previewProject, ["unidad", "unidadVolumen"]) || ""}`
                      }
                    />
                    <PreviewRow
                      label="Descripción"
                      value={
                        getRecordValue(previewProject, [
                          "descripcionNecesidad",
                          "descripcion",
                        ]) || "—"
                      }
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 text-sm font-bold text-slate-900">
                    Estructura y Materiales
                  </h4>
                  <div className="space-y-2">
                    <PreviewRow
                      label="Estructura calculada"
                      value={String(previewProject.estructuraCalculada || "") || "—"}
                    />
                    <PreviewRow
                      label="Materiales"
                      value={String(previewProject.estructuraMaterialesReferencial || "") || "—"}
                    />
                  </div>

                  {[0, 1, 2, 3].map((index) => {
                    const material = getExistingLayerMaterial(previewProject, index);
                    if (!material) return null;

                    const micron = getExistingLayerMicron(previewProject, index);
                    return (
                      <div key={`layer-${index}`} className="mt-3 border-t border-slate-200 pt-3">
                        <PreviewRow
                          label={`Capa ${index + 1}`}
                          value={material || "—"}
                        />
                        {micron !== null && (
                          <PreviewRow
                            label={`Micraje ${index + 1}`}
                            value={`${micron} µ`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {[
                  ["ancho", "Ancho"],
                  ["largo", "Largo"],
                  ["anchoFuelle", "Ancho Fuelle"],
                  ["tipoImpresion", "Tipo de Impresión"],
                  ["accesorios", "Accesorios"],
                  ["criteriosTecnicos", "Criterios Técnicos"],
                  ["comentariosTecnicos", "Comentarios Técnicos"],
                ].some(([key]) => previewProject[key as keyof typeof previewProject]) && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-bold text-slate-900">
                      Información Momento 2
                    </h4>
                    <div className="space-y-2">
                      {[
                        ["ancho", "Ancho"],
                        ["largo", "Largo"],
                        ["anchoFuelle", "Ancho Fuelle"],
                        ["tipoImpresion", "Tipo de Impresión"],
                        ["accesorios", "Accesorios"],
                        ["criteriosTecnicos", "Criterios Técnicos"],
                        ["comentariosTecnicos", "Comentarios Técnicos"],
                      ].map(([key, label]) => {
                        const value = previewProject[key as keyof typeof previewProject];
                        if (!value) return null;
                        return (
                          <PreviewRow
                            key={key}
                            label={label}
                            value={String(value) || "—"}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {getRecordValue(previewProject, [
                  "comentarios",
                  "comentariosTecnicos",
                ]) && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-2 text-sm font-bold text-slate-900">
                      Comentarios
                    </h4>
                    <p className="text-xs text-slate-700">
                      {getRecordValue(previewProject, [
                        "comentarios",
                        "comentariosTecnicos",
                      ])}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setPreviewProject(null)}
              >
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const topMatchIdx = similarityMatches.findIndex(
                    (m) => getProjectCode(m.project) === getProjectCode(previewProject),
                  );
                  if (topMatchIdx >= 0) {
                    applyReferenceProject(similarityMatches[topMatchIdx]);
                  } else {
                    applyReferenceProjectFromProject(previewProject, 0);
                  }
                }}
              >
                Usar como referencia
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
