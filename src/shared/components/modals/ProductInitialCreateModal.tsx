import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { Info, Layers3, Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type SkuLifecycleCode } from "../../data/projectWorkflow";
import Button from "../ui/Button";
import FormSelect from "../forms/FormSelect";
import FormInput from "../forms/FormInput";
import ClientSearch from "../forms/ClientSearch";
import ApprovedProductSearch from "../forms/ApprovedProductSearch";
import PreviewRow from "../display/PreviewRow";

import * as portfolioStorage from "../../data/portfolioStorage";
import * as clientStorage from "../../data/clientStorage";
import * as projectStorage from "../../data/projectStorage";
import * as userStorage from "../../data/userStorage";
import { getAllApprovedProducts } from "../../data/approvedProductStorage";
import { getActiveExecutiveRecords } from "../../data/executiveStorage";

import { getCatalogOptions } from "../../catalogs";
import { PRODUCT_CATALOGS, getModificationOptionsByClassification } from "../../data/productCatalogs";
import {
  getActiveProductClassificationOptions,
  getActiveModificationOptionsByClassification,
  normalizeProductClassificationToCatalog,
} from "../../data/productModificationCatalog";
import {
  getActiveUnitMeasureOptions,
  normalizeUnitMeasureCode,
} from "../../data/unitMeasureCatalog";
import {
  getActiveMaterialGroupOptions,
  getMaterialLayerOptionsByGroup,
  getMicronFrontendControl,
  getMicronRecordsByMaterial,
  resolveMaterialLayer,
  buildLayerTechnicalSnapshot,
  type MicronFrontendControl,
} from "../../data/productMaterialCatalog";
import {
  getAllowedOriginLifecycle,
  getOriginProductHelpText,
  getOriginProductLabel,
  isOriginProductAllowed,
  getInitialSuggestedSkuLifecycle,
  type TipoSolicitud,
} from "../../utils/productCreationRules";
import {
  generateNewEDAG,
  generateNewEM,
} from "../../utils/productCodeRules";
import {
  generateSKUForNewRequest,
} from "../../utils/productSkuCodeUtils";
import ProductStructureConfigurator from "../../../modules/products/components/ProductStructureConfigurator";
import ValidStructureCombinationsModal from "./ValidStructureCombinationsModal";
import NewStructureRequestModal from "./NewStructureRequestModal";
import {
  validateProductStructureValue,
  getFirstStructureError,
} from "../../utils/productStructureValidation";
import {
  findCompatibleStructureCombinations,
  findExactStructureCombination,
  getValidatedStructureCombinationsByType,
  rankStructureCombinations,
  type StructureCombinationOption,
} from "../../utils/productStructureCombinations";
import { getStructureLayerCount, type ProductStructureType } from "../../data/productStructureMatrix";
import type { ProductStructureValue } from "../../types/productStructure.types";
import {
  extractWrappingTypeCode,
  getValidStructureTypesForWrapping,
} from "../../data/productStructureByWrappingType";

type AnyRecord = Record<string, unknown>;
type PortfolioRecord = AnyRecord;
type ProjectRecord = AnyRecord;
type ClientRecord = AnyRecord;

// ProductRequestCase: casuística única que determina el flujo
type ProductRequestCase =
  | "NEW_WITH_NEW_STRUCTURE"
  | "NEW_FROM_BASE"
  | "MODIFIED_FROM_APPROVED"
  | null;

// SelectedProductReference: solo para Momento 2, no cambia clasificación
type SelectedProductReference = {
  projectId?: string;
  projectCode?: string;
  skuCode?: string;
  projectName?: string;
  score?: number;
  scope?: MatchScope;
  status?: string;
  datosSugeridosMomento2?: AnyRecord;
};

// Parser de SKU único: formato SKU-XXXXX-L-VV
// L = ciclo de vida (E, B, A, I)
// VV = versión (00-99)
// Nota: SkuLifecycleCode ya está importado desde projectWorkflow
type ParsedSkuCode = {
  productIdentityCode: string; // XXXXX (5 dígitos)
  lifecycleCode: SkuLifecycleCode; // E, B, A, I
  versionCode: string; // VV (2 dígitos)
  sequence: number; // número XXXXX como entero
  version: number; // número VV como entero
};

// Patrón de SKU: SKU-00025-E-01 (solo E, B, A, I - no P)
const SKU_PATTERN = /^SKU-(\d{5})-([EBAI])-(\d{2})$/i;

// Parser único de código SKU - formato validado
const parseSkuCode = (value: string): ParsedSkuCode => {
  const normalized = value.trim().toUpperCase();
  const match = SKU_PATTERN.exec(normalized);

  if (!match) {
    throw new Error(
      `Código SKU inválido: ${value}. Formato esperado: SKU-XXXXX-L-VV (L: E|B|A|I, VV: 00-99)`,
    );
  }

  return {
    productIdentityCode: match[1],
    lifecycleCode: match[2] as SkuLifecycleCode,
    versionCode: match[3],
    sequence: Number(match[1]),
    version: Number(match[3]),
  };
};

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

interface SimilarityScopeFilters {
  sameClientSamePortfolio: boolean;
  sameClientOtherPortfolio: boolean;
  otherClients: boolean;
}

interface SimilarityCriteriaFilters {
  structureType: boolean;
  layerCount: boolean;
  materials: boolean;
  microns: boolean;
  wrapping: boolean;
  finalUse: boolean;
  volume: boolean;
  packingMachine: boolean;
}

interface SimilarityCandidateData {
  clientCode?: string;
  clientName?: string;
  portfolioCode?: string;
  envoltura?: string;
  usoFinal?: string;
  maquinaCliente?: string;
  afMarketId?: string;
  estructuraCalculada?: string;
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
}

const DEFAULT_SIMILARITY_SCOPE_FILTERS: SimilarityScopeFilters = {
  sameClientSamePortfolio: true,
  sameClientOtherPortfolio: true,
  otherClients: false,
};

const DEFAULT_SIMILARITY_CRITERIA: SimilarityCriteriaFilters = {
  structureType: true,
  layerCount: true,
  materials: true,
  microns: true,
  wrapping: true,
  finalUse: true,
  volume: false,
  packingMachine: false,
};

const SIMILARITY_MINIMUM_SCORE = 60;
const MICRON_TOLERANCE_PERCENT = 5;
const VOLUME_TOLERANCE_PERCENT = 10;

const SIMILARITY_WEIGHTS = {
  materials: 30,
  structureType: 15,
  layerCount: 10,
  microns: 15,
  wrapping: 10,
  finalUse: 10,
  volume: 5,
  packingMachine: 5,
} as const;

const SCOPE_SORT_BONUS: Record<MatchScope, number> = {
  SAME_CLIENT_SAME_PORTFOLIO: 5,
  SAME_CLIENT_OTHER_PORTFOLIO: 2,
  OTHER_CLIENT: 0,
};

const isScopeEnabled = (
  scope: MatchScope,
  filters: SimilarityScopeFilters,
): boolean => {
  switch (scope) {
    case "SAME_CLIENT_SAME_PORTFOLIO":
      return filters.sameClientSamePortfolio;
    case "SAME_CLIENT_OTHER_PORTFOLIO":
      return filters.sameClientOtherPortfolio;
    case "OTHER_CLIENT":
      return filters.otherClients;
    default:
      return false;
  }
};

const compareSimilarityMatches = (
  a: SimilarityMatch,
  b: SimilarityMatch,
): number => {
  const rankA = a.score + SCOPE_SORT_BONUS[a.scope];
  const rankB = b.score + SCOPE_SORT_BONUS[b.scope];

  if (rankA !== rankB) return rankB - rankA;
  return b.score - a.score;
};

const ClientSearchField = ClientSearch as unknown as ComponentType<any>;

// Obtener opciones de Clasificación desde TABMODPRODODISEO
const getClassificationOptions = () => {
  return getActiveProductClassificationOptions();
};

// Funciones helper para validar clasificación
const isProductoNuevo = (classification: string): boolean => {
  const normalized = normalizeProductClassificationToCatalog(classification);
  return normalized === "Producto Nuevo";
};

const isProductoModificado = (classification: string): boolean => {
  const normalized = normalizeProductClassificationToCatalog(classification);
  return normalized === "Producto Modificado";
};

// Normalize classification to match productCreationRules expectations
const normalizeClassification = (classification: string): TipoSolicitud => {
  const lower = classification.toLowerCase().trim();
  if (lower === "producto nuevo") return "Producto nuevo";
  if (lower === "producto modificado") return "Producto modificado";
  if (lower === "extensión de línea") return "Extensión de línea";
  if (lower === "ico / bcp") return "ICO / BCP";
  return classification as TipoSolicitud;
};

// Obtener opciones de Modificación desde TABMODPRODODISEO
const getModificationOptions = (classification: string) => {
  const normalized = normalizeProductClassificationToCatalog(classification);
  if (!normalized) return [];
  return getActiveModificationOptionsByClassification(normalized);
};

// Helper: verificar si una modificación específica está presente
const hasModification = (
  modifications: string[],
  expected: string,
): boolean =>
  modifications.some(
    (value) =>
      normalizeText(value) === normalizeText(expected),
  );

// Helper: determinar la casuística única basada en classification y modifications
const resolveProductRequestCase = (
  classification: string,
  modifications: string[],
): ProductRequestCase => {
  if (!classification || modifications.length === 0) {
    return null;
  }

  if (
    isProductoNuevo(classification) &&
    hasModification(modifications, "Nueva estructura")
  ) {
    return "NEW_WITH_NEW_STRUCTURE";
  }

  if (isProductoNuevo(classification)) {
    return "NEW_FROM_BASE";
  }

  if (isProductoModificado(classification)) {
    return "MODIFIED_FROM_APPROVED";
  }

  return null;
};

// Helpers de acceso estable para identificadores
const getStableProjectId = (
  project: ProjectRecord,
): string =>
  getRecordValue(project, [
    "id",
    "projectId",
    "projectCode",
    "projectRequestCode",
  ]);

const getStableProjectCode = (
  project: ProjectRecord,
): string =>
  getRecordValue(project, [
    "projectCode",
    "projectRequestCode",
    "id",
  ]);

// Material options removed - using ProductStructureConfigurator for layer management

const getMaterialLabel = (materialCode: string): string => {
  const material = resolveMaterialLayer(materialCode);
  if (!material) return materialCode;
  return material.TbMatCapNom;
};

const getMicronControlForMaterial = (materialCode: string): MicronFrontendControl => {
  return getMicronFrontendControl(materialCode);
};

const formatLayerForTechnicalName = (materialCode: string, micron?: string): string => {
  const label = getMaterialLabel(materialCode);
  if (!micron || !materialCode) return label;
  return `${label} ${micron} µm`;
};

const UNIT_OPTIONS = getActiveUnitMeasureOptions();

const normalizeText = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeClientCode = (value: unknown): string =>
  normalizeText(value)
    .replace(/^cli\s+/, "cl ")
    .replace(/[^a-z0-9]/g, "")
    .replace(/^cli/, "cl");

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
  const portfolioClientCode = normalizeClientCode(
    getPortfolioClientCode(portfolio),
  );

  const selectedClientCode = normalizeClientCode(selectedClient.code);

  /**
   * Regla principal:
   * Priorizar comparación por código de cliente.
   * El código es más confiable que el nombre que puede variar en escritura.
   */
  if (portfolioClientCode && selectedClientCode) {
    return portfolioClientCode === selectedClientCode;
  }

  /**
   * Regla secundaria:
   * Si no hay código suficiente, usar nombre de cliente como fallback.
   */
  const portfolioClientName = normalizeCompanyName(
    getPortfolioClientName(portfolio),
  );

  const selectedClientName = normalizeCompanyName(selectedClient.name);

  if (portfolioClientName && selectedClientName) {
    return portfolioClientName === selectedClientName;
  }

  return false;
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
    "codigoPortafolio",
    "idPortafolio",
    "portfolioId",
  ]);

const getPortfolioName = (portfolio: PortfolioRecord | null | undefined) =>
  getRecordValue(portfolio, [
    "nom",
    "nombre",
    "name",
    "portfolioName",
    "description",
    "descripcion",
    "nombrePortafolio",
    "tituloPortafolio",
    "portfolioTitle",
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
    "CLMaCCLi",
    "code",
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
    "razonSocial",
    "businessName",
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

  const normalizedValue = normalizeText(valueToResolve);

  // Try to find in commercial executives first (if ID-based)
  if (rawExecutiveId) {
    const executives = getActiveExecutiveRecords();
    const matchedExecutive = executives.find((exec) => {
      const execId = String(exec.id || "");
      const execName = normalizeText(String(exec.name || ""));
      const execCode = normalizeText(String(exec.code || ""));

      return (
        execId === String(rawExecutiveId) ||
        (!!execName && execName === normalizedValue) ||
        (!!execCode && execCode === normalizedValue)
      );
    });

    if (matchedExecutive) {
      if (matchedExecutive.name) return matchedExecutive.name;
    }
  }

  // Fallback to user records
  const valueVariants = getUserCodeVariants(valueToResolve);
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
  if (!value) return "";

  const material = resolveMaterialLayer(value);
  return material ? material.TbMatCapCod : String(value);
};

// Normalizar valor de unidad usando el catálogo TABUNIMEDODISEO
const normalizeUnitValue = (value: string): string => {
  const normalized = normalizeUnitMeasureCode(value);
  return normalized || normalizeText(value).toUpperCase();
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

  // Fallback: preserve SKU codes from initialData
  const technicalRequestCode = `PRJ-${Date.now()}`;
  const skuCode = payload.initialData.skuCode || payload.initialData.code || "";

  return {
    id: technicalRequestCode,
    projectCode: technicalRequestCode,
    projectRequestCode: technicalRequestCode,
    ...payload.initialData,
    // Ensure SKU is not overwritten
    code: skuCode,
    productCode: skuCode,
    skuCode: skuCode,
    currentSkuCode: skuCode,
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

const inferStructureTypeByLayerCount = (layerCount: number): string => {
  switch (layerCount) {
    case 1:
      return "Monocapa";
    case 2:
      return "Bilaminado";
    case 3:
      return "Trilaminado";
    case 4:
      return "Tetralaminado";
    default:
      return "";
  }
};

const calculatePreliminarySimilarity = (
  candidate: SimilarityCandidateData,
  existing: ProjectRecord,
  criteria: SimilarityCriteriaFilters,
): number => {
  const candidateLayers = [
    candidate.layer1,
    candidate.layer2,
    candidate.layer3,
    candidate.layer4,
  ];

  const existingLayers = [0, 1, 2, 3].map((index) =>
    getExistingLayerMaterial(existing, index),
  );

  const candidateLayerCount = candidateLayers.filter(Boolean).length;
  const existingLayerCount = existingLayers.filter(Boolean).length;

  if (candidateLayerCount === 0 || existingLayerCount === 0) return 0;

  let weightedMatchedScore = 0;
  let comparableWeight = 0;
  let comparableCriteria = 0;

  const addCriterion = (
    weight: number,
    similarityRatio: number | null,
  ) => {
    if (similarityRatio === null) return;

    comparableWeight += weight;
    comparableCriteria += 1;
    weightedMatchedScore += weight * Math.max(0, Math.min(1, similarityRatio));
  };

  if (criteria.structureType) {
    const candidateStructure = normalizeText(
      candidate.estructuraCalculada ||
        inferStructureTypeByLayerCount(candidateLayerCount),
    );
    const existingStructure = normalizeText(
      existing.estructuraCalculada ??
        existing.structureType ??
        inferStructureTypeByLayerCount(existingLayerCount),
    );

    addCriterion(
      SIMILARITY_WEIGHTS.structureType,
      candidateStructure && existingStructure
        ? Number(candidateStructure === existingStructure)
        : null,
    );
  }

  if (criteria.layerCount) {
    const ratio =
      Math.min(candidateLayerCount, existingLayerCount) /
      Math.max(candidateLayerCount, existingLayerCount);
    addCriterion(SIMILARITY_WEIGHTS.layerCount, ratio);
  }

  if (criteria.materials) {
    const maxLayers = Math.max(candidateLayerCount, existingLayerCount);
    let materialMatches = 0;

    for (let index = 0; index < maxLayers; index += 1) {
      const candidateMaterial = normalizeText(
        normalizeMaterialValue(candidateLayers[index]),
      );
      const existingMaterial = normalizeText(
        normalizeMaterialValue(existingLayers[index]),
      );

      if (
        candidateMaterial &&
        existingMaterial &&
        candidateMaterial === existingMaterial
      ) {
        materialMatches += 1;
      }
    }

    addCriterion(
      SIMILARITY_WEIGHTS.materials,
      maxLayers > 0 ? materialMatches / maxLayers : null,
    );
  }

  if (criteria.microns) {
    const candidateMicrons = [
      candidate.layer1Micron,
      candidate.layer2Micron,
      candidate.layer3Micron,
      candidate.layer4Micron,
    ];

    let comparableMicrons = 0;
    let micronMatches = 0;

    for (let index = 0; index < 4; index += 1) {
      const candidateMaterial = normalizeText(
        normalizeMaterialValue(candidateLayers[index]),
      );
      const existingMaterial = normalizeText(
        normalizeMaterialValue(existingLayers[index]),
      );
      const candidateMicron = parseMicronNumber(candidateMicrons[index]);
      const existingMicron = getExistingLayerMicron(existing, index);

      if (
        !candidateMaterial ||
        !existingMaterial ||
        candidateMaterial !== existingMaterial ||
        candidateMicron === null ||
        existingMicron === null
      ) {
        continue;
      }

      comparableMicrons += 1;
      const tolerance =
        existingMicron * (MICRON_TOLERANCE_PERCENT / 100);

      if (Math.abs(candidateMicron - existingMicron) <= tolerance) {
        micronMatches += 1;
      }
    }

    addCriterion(
      SIMILARITY_WEIGHTS.microns,
      comparableMicrons > 0 ? micronMatches / comparableMicrons : null,
    );
  }

  if (criteria.wrapping) {
    const candidateWrapping = normalizeText(candidate.envoltura);
    const existingWrapping = normalizeText(
      existing.envoltura ?? existing.wrappingName ?? existing.env,
    );

    addCriterion(
      SIMILARITY_WEIGHTS.wrapping,
      candidateWrapping && existingWrapping
        ? Number(candidateWrapping === existingWrapping)
        : null,
    );
  }

  if (criteria.finalUse) {
    const candidateAfMarket = normalizeText(candidate.afMarketId);
    const existingAfMarket = normalizeText(
      existing.afMarketId ?? existing.afMarketID,
    );
    const candidateFinalUse = normalizeText(candidate.usoFinal);
    const existingFinalUse = normalizeText(
      existing.usoFinal ?? existing.useFinalName ?? existing.uf,
    );

    let finalUseRatio: number | null = null;

    if (candidateAfMarket && existingAfMarket) {
      finalUseRatio = Number(candidateAfMarket === existingAfMarket);
    } else if (candidateFinalUse && existingFinalUse) {
      finalUseRatio = Number(candidateFinalUse === existingFinalUse);
    }

    addCriterion(SIMILARITY_WEIGHTS.finalUse, finalUseRatio);
  }

  if (criteria.volume) {
    const candidateVolume = parseVolumeNumber(candidate.volumen);
    const existingVolume = parseVolumeNumber(
      String(
        existing.volumenReferencial ??
          existing.volumenCantidadReferencial ??
          existing.volumen ??
          "",
      ),
    );
    const candidateUnit = normalizeUnitValue(String(candidate.unidad || ""));
    const existingUnit = normalizeUnitValue(
      String(existing.unidad ?? existing.unidadVolumen ?? ""),
    );

    let volumeRatio: number | null = null;

    if (
      candidateVolume !== null &&
      existingVolume !== null &&
      candidateUnit &&
      existingUnit &&
      candidateUnit === existingUnit
    ) {
      const differenceRatio =
        existingVolume === 0
          ? Number(candidateVolume === existingVolume)
          : Math.abs(candidateVolume - existingVolume) / existingVolume;
      const toleranceRatio = VOLUME_TOLERANCE_PERCENT / 100;

      volumeRatio =
        differenceRatio <= toleranceRatio
          ? 1
          : Math.max(0, 1 - differenceRatio);
    }

    addCriterion(SIMILARITY_WEIGHTS.volume, volumeRatio);
  }

  if (criteria.packingMachine) {
    const candidateMachine = normalizeText(candidate.maquinaCliente);
    const existingMachine = normalizeText(
      existing.maquinaCliente ?? existing.packingMachineName ?? existing.maq,
    );

    addCriterion(
      SIMILARITY_WEIGHTS.packingMachine,
      candidateMachine && existingMachine
        ? Number(candidateMachine === existingMachine)
        : null,
    );
  }

  if (comparableCriteria < 3 || comparableWeight === 0) return 0;

  const normalizedScore =
    (weightedMatchedScore / comparableWeight) * 100;

  if (DEBUG_PROJECT_SIMILARITY) {
    console.log("[SIMILARITY]", {
      candidateLayers,
      existingLayers,
      comparableCriteria,
      comparableWeight,
      weightedMatchedScore,
      normalizedScore,
    });
  }

  return Math.max(0, Math.min(100, Math.round(normalizedScore)));
};

const getRecomendacion = (score: number, scope: MatchScope): string => {
  if (score >= 90 && scope === "SAME_CLIENT_SAME_PORTFOLIO") {
    return "Reutilizar producto existente. Creación bloqueada por duplicidad.";
  }

  if (score >= 90) {
    return "Usar como referencia técnica. No es duplicado del portafolio actual.";
  }

  if (score >= 70) {
    return "Revisar antes de crear. Existe un producto similar que puede servir de referencia.";
  }

  return "Puedes crear un nuevo producto. No se encontraron coincidencias relevantes.";
};

const getScopeLabel = (scope: MatchScope): string => {
  switch (scope) {
    case "SAME_CLIENT_SAME_PORTFOLIO":
      return "Portafolio actual";
    case "SAME_CLIENT_OTHER_PORTFOLIO":
      return "Otro portafolio del cliente";
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

const getProjectSkuCode = (project: ProjectRecord): string =>
  getRecordValue(project, ["skuCode", "sku", "codigoSku"]) || "";

const getProjectClassification = (project: ProjectRecord): string =>
  getRecordValue(project, ["clasificacion", "classification", "TbModProdClas"]) || "";

const getProjectModifications = (project: ProjectRecord): string[] => {
  const modsRaw = getRecordValue(project, ["modificacion", "modifications", "causal"]);
  if (!modsRaw) return [];
  if (typeof modsRaw === "string") return [modsRaw];
  if (Array.isArray(modsRaw)) return modsRaw;
  return [];
};

const getProductDisplayName = (project: ProjectRecord): string =>
  getRecordValue(project, [
    "productName",
    "nombreProducto",
    "projectName",
    "name",
  ]) || getProjectName(project) || "Producto sin nombre";

// Limpiar nombre: remover "Aprobada" y segmentos de volumen/unidad
const getCleanProductName = (displayName: string): string => {
  if (!displayName) return "";

  // Remover "Aprobada" / "aprobada" (incluyendo guiones adyacentes)
  let cleaned = displayName
    .replace(/\s*[-–]\s*[Aa]probada\s*/g, " ")
    .replace(/[Aa]probada\s*[-–]\s*/g, " ");

  // Remover patrones de volumen/unidad/empaque al final
  // Casos: "- Tubo 150ml", "Tubo 150ml", "- 5kg", "Sachet 20ml", etc
  const packagingTypes = "Sachet|Balde|Bolsa|Caja|Pack|Pallet|Tubo|Botella|Lata|Barril|Bidón|Jeringa";

  // Patrón 1: Empaque + volumen (con o sin guion)
  cleaned = cleaned.replace(
    new RegExp(`\\s*[-–]?\\s*(${packagingTypes})\\s+[\\d]+\\s*[a-zA-Z]{1,3}\\s*$`, "i"),
    ""
  );

  // Patrón 2: Solo números + unidad (ej: "500g", "20ml")
  cleaned = cleaned.replace(/\s*[-–]?\s*[\d]+\s*[a-zA-Z]{1,3}\s*$/i, "");

  return cleaned.replace(/\s+/g, " ").trim();
};

// Extraer volumen y unidad del nombre del producto
const extractVolumeAndUnit = (displayName: string): { volume: string; unit: string } => {
  if (!displayName) return { volume: "", unit: "" };

  // Patrón: empaque + número + unidad o solo número + unidad
  // Ejemplos: "Balde 5kg", "500ml", "Tubo 150ml"
  const packagingTypes = "Sachet|Balde|Bolsa|Caja|Pack|Pallet|Tubo|Botella|Lata|Barril|Bidón|Jeringa";

  // Buscar: Empaque + número + unidad
  const match1 = new RegExp(`(${packagingTypes})\\s+([\\d]+)\\s*([a-zA-Z]{1,3})`, "i").exec(displayName);
  if (match1) {
    const unitText = match1[3].toLowerCase();
    const unitCode = normalizeUnitMeasureCode(unitText);
    return { volume: match1[2], unit: unitCode };
  }

  // Buscar: solo número + unidad
  const match2 = /[-–]?\s*([\d]+)\s*([a-zA-Z]{1,3})\s*$/.exec(displayName);
  if (match2) {
    const unitText = match2[2].toLowerCase();
    const unitCode = normalizeUnitMeasureCode(unitText);
    return { volume: match2[1], unit: unitCode };
  }

  return { volume: "", unit: "" };
};

const getProductMaterialSummary = (project: ProjectRecord): string =>
  [0, 1, 2, 3]
    .map((index) => {
      const materialCode = getExistingLayerMaterial(project, index);
      if (!materialCode) return "";

      const materialName = getMaterialLabel(materialCode);
      const micron = getExistingLayerMicron(project, index);

      return micron !== null
        ? `${materialName} ${micron} µm`
        : materialName;
    })
    .filter(Boolean)
    .join(" / ");

const getSimilarityContextLabel = (match: SimilarityMatch): string => {
  if (match.scope === "SAME_CLIENT_SAME_PORTFOLIO") {
    return "Portafolio actual";
  }

  const portfolioName = getRecordValue(match.project, [
    "portfolioName",
    "portafolioNombre",
    "portfolioCode",
    "portafolioCodigo",
  ]);

  if (match.scope === "SAME_CLIENT_OTHER_PORTFOLIO") {
    return portfolioName
      ? `Otro portafolio · ${portfolioName}`
      : "Otro portafolio del cliente";
  }

  const clientName = getRecordValue(match.project, [
    "clientName",
    "cliente",
    "nombreCliente",
  ]);

  return clientName ? `Otro cliente · ${clientName}` : "Otro cliente";
};

const DEBUG_PORTFOLIO_FILTER = false;

const normalizeVersion = (version: string | undefined): string => {
  if (!version) return "00";
  // Remover espacios y caracteres no numéricos
  const cleanVersion = version.replace(/\D/g, "") || "0";
  const versionNum = parseInt(cleanVersion, 10);
  return String(versionNum).padStart(2, "0");
};

const incrementVersion = (currentVersion: string): string => {
  const normalized = normalizeVersion(currentVersion);
  const versionNum = parseInt(normalized, 10);
  const nextVersion = versionNum + 1;
  return String(nextVersion).padStart(2, "0");
};

const resolveSkuLifecycleCodeFromProduct = (
  product: AnyRecord | null,
  fallbackCode?: string,
): SkuLifecycleCode | undefined => {
  const explicitCode = String(
    product?.skuLifecycleCode ||
      product?.cicloVida ||
      product?.lifecycleCode ||
      product?.cycleCode ||
      "",
  ).trim().toUpperCase();

  if (["E", "B", "A", "P"].includes(explicitCode)) {
    return explicitCode as SkuLifecycleCode;
  }

  const codeCandidate = String(
    product?.code ||
      product?.id ||
      fallbackCode ||
      "",
  ).toUpperCase();

  const match = codeCandidate.match(/SKU-\d+-(E|B|A|P)(?:-\d+)?/);

  if (match?.[1]) {
    return match[1] as SkuLifecycleCode;
  }

  const statusCandidate = normalizeText(
    product?.status ||
      product?.estado ||
      product?.lifecycleLabel ||
      product?.productType ||
      "",
  );

  if (statusCandidate.includes("base")) return "B";
  if (statusCandidate.includes("aprobado")) return "A";
  if (statusCandidate.includes("portafolio")) return "E"; // Preliminar, no "P"
  if (statusCandidate.includes("muestra")) return "E";

  return undefined;
};

const formatSkuWithVersion = (code: string, version: string): string => {
  if (!code) return "";
  if (/SKU-\d+-(E|B|A|P|I)-\d{2}$/i.test(code)) return code;
  if (!version) return code;
  return `${code}-${normalizeVersion(version)}`;
};

const getNextAvailableSku = (): string => {
  const products = getAllApprovedProducts();
  let maxNumber = 0;

  products.forEach((product) => {
    const code = String(product.code || "");
    // Extraer el número del formato SKU-XXXXX-*-*
    const match = code.match(/SKU-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  });

  const nextNumber = maxNumber + 1;
  const paddedNumber = String(nextNumber).padStart(5, "0");
  return `SKU-${paddedNumber}`;
};

// ============= Helpers de decisión SKU =============

const isNuevaEstructura = (modificationValues: string[]): boolean => {
  return modificationValues.some(
    (value) => normalizeText(value) === normalizeText("Nueva estructura"),
  );
};

const shouldRequireCurrentSku = (
  classification: string,
  modificationValues: string[],
): boolean => {
  if (!classification || modificationValues.length === 0) return false;

  // Producto Modificado siempre requiere SKU actual.
  if (isProductoModificado(classification)) return true;

  // Producto Nuevo + Nueva estructura no requiere SKU base obligatorio.
  if (isProductoNuevo(classification) && isNuevaEstructura(modificationValues)) {
    return false;
  }

  // Producto Nuevo + otras casuísticas puede/requiere SKU base como referencia.
  if (isProductoNuevo(classification)) return true;

  return false;
};

const shouldGenerateNewSkuSequence = (
  classification: string,
): boolean => {
  // Todo Producto Nuevo genera nuevo correlativo.
  return isProductoNuevo(classification);
};

const shouldGenerateVersionFromCurrentSku = (
  classification: string,
): boolean => {
  // Solo Producto Modificado versiona el SKU actual.
  return isProductoModificado(classification);
};

const getSkuSourceRecords = (): Array<Record<string, unknown>> => {
  const projects = projectStorage.getProjectRecords
    ? projectStorage.getProjectRecords()
    : [];

  const approvedProducts = getAllApprovedProducts
    ? getAllApprovedProducts()
    : [];

  return [
    ...(projects as Array<Record<string, unknown>>),
    ...(approvedProducts as Array<Record<string, unknown>>),
  ];
};

const canRunSimilaritySearch = (
  classification: string,
  modificationValues: string[],
): boolean => {
  return isProductoNuevo(classification) && isNuevaEstructura(modificationValues);
};

// Función mejorada para hidratar desde producto origen
// Comportamiento diferente según casuística (requestCase)
const hydrateFromOriginProduct = (
  originProduct: AnyRecord,
  currentRequestCase: ProductRequestCase,
  setters: any,
) => {
  if (!originProduct || !currentRequestCase) return;
  // Para Nueva estructura, no heredar nada
  if (currentRequestCase === "NEW_WITH_NEW_STRUCTURE") return;

  const originSkuCode = getProjectSkuCode(originProduct);
  const originName = getCleanProductName(getProductDisplayName(originProduct));

  // Guardar identificador estable y SKU
  setters.setProductoBaseId(getStableProjectId(originProduct));
  setters.setProductoBaseCodigo(originSkuCode);
  setters.setProductoBaseVersion(String(originProduct.version || "00"));
  setters.setSelectedBaseProduct(originProduct);

  // Heredar estructura (igual para ambas casuísticas con origen)
  const inheritedMaterialCodes = [
    originProduct.layer1Material,
    originProduct.layer2Material,
    originProduct.layer3Material,
    originProduct.layer4Material,
  ].filter(Boolean);

  const inheritedMicrons = [
    String(originProduct.layer1Micron || ""),
    String(originProduct.layer2Micron || ""),
    String(originProduct.layer3Micron || ""),
    String(originProduct.layer4Micron || ""),
  ];

  const inheritedStructureType =
    inheritedMaterialCodes.length === 1
      ? "Monocapa"
      : inheritedMaterialCodes.length === 2
        ? "Bilaminado"
        : inheritedMaterialCodes.length === 3
          ? "Trilaminado"
          : inheritedMaterialCodes.length === 4
            ? "Tetralaminado"
            : "";

  // Heredar materiales con sus nombres originales (no normalizados a código)
  const normalizedLayers = inheritedMaterialCodes.map((materialCode, index) => ({
    materialCode: String(materialCode || ""), // Usar nombre original, no código
    micronRuleCode: "",
    micronValue: inheritedMicrons[index] || "",
  }));

  setters.setProductStructure({
    structureType: inheritedStructureType,
    layers: normalizedLayers,
  });

  // Actualizar estados individuales de capas para la UI
  setters.setLayer1(String(originProduct.layer1Material || ""));
  setters.setLayer2(String(originProduct.layer2Material || ""));
  setters.setLayer3(String(originProduct.layer3Material || ""));
  setters.setLayer4(String(originProduct.layer4Material || ""));

  setters.setLayer1Micron(String(originProduct.layer1Micron || ""));
  setters.setLayer2Micron(String(originProduct.layer2Micron || ""));
  setters.setLayer3Micron(String(originProduct.layer3Micron || ""));
  setters.setLayer4Micron(String(originProduct.layer4Micron || ""));

  // Heredar volumen y unidad - con fallback desde capacidad del producto y nombre
  const displayName = getProductDisplayName(originProduct);
  const extracted = extractVolumeAndUnit(displayName);

  const volumeValue =
    originProduct.volumenCantidadReferencial ||
    originProduct.estimatedVolume ||
    originProduct.capacityValue ||
    extracted.volume;

  const unitValue =
    originProduct.unidad ||
    originProduct.unitOfMeasure ||
    originProduct.capacityUnit ||
    extracted.unit;

  setters.setVolumen(String(volumeValue || ""));
  setters.setUnidad(String(unitValue || ""));

  // Comportamiento específico por casuística
  if (currentRequestCase === "NEW_FROM_BASE") {
    // Producto Nuevo desde Base: nombre heredado pero EDITABLE
    setters.setProjectName(originName);
    setters.setDescripcion(
      String(
        originProduct.descripcionNecesidad ||
          originProduct.projectDescription ||
          "",
      ),
    );
  } else if (currentRequestCase === "MODIFIED_FROM_APPROVED") {
    // Producto Modificado: nombre heredado y BLOQUEADO, descripción heredada
    setters.setProjectName(originName);
    setters.setDescripcion(
      String(
        originProduct.descripcionNecesidad ||
          originProduct.projectDescription ||
          "",
      ),
    );
  }

  setters.setIsInheritedFromBase(true);
  setters.setSimilarityMatches([]);
  setters.setSelectedReference(null);
};

// Factory function para crear la función clearBaseProductFields
const createClearFunction = (setters: any) => {
  return () => {
    setters.setProductoBaseId("");
    setters.setProductoBaseNombre("");
    setters.setProductoBaseCodigo("");
    setters.setProductoBaseVersion("");
    setters.setUnidad("");
    setters.setDescripcion("");
    setters.setLayer1("");
    setters.setLayer2("");
    setters.setLayer3("");
    setters.setLayer4("");
    setters.setLayer1Micron("");
    setters.setLayer2Micron("");
    setters.setLayer3Micron("");
    setters.setLayer4Micron("");
    setters.setIsInheritedFromBase(false);
    setters.setNewSkuCode("");
    setters.setSelectedBaseProduct(null);
  };
};

// Factory function para crear resetProductStructure
const createResetProductStructureFunction = (setters: any) => {
  return () => {
    setters.setProductStructure({
      structureType: "",
      layers: [],
    });
    setters.setLayer1("");
    setters.setLayer2("");
    setters.setLayer3("");
    setters.setLayer4("");
    setters.setLayer1Micron("");
    setters.setLayer2Micron("");
    setters.setLayer3Micron("");
    setters.setLayer4Micron("");
  };
};

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
  const [declaresApproved, setDeclaresApproved] = useState(false);
  const [portfolioCode, setPortfolioCode] = useState(
    initialPortfolioCode || "",
  );
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

  const [classification, setClassification] = useState("");
  const [modifications, setModifications] = useState<string[]>([]);
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

  const [productStructure, setProductStructure] = useState<ProductStructureValue>({
    structureType: "",
    layers: [],
  });

  const [comentarios, setComentarios] = useState("");

  const [productoBaseId, setProductoBaseId] = useState("");
  const [productoBaseNombre, setProductoBaseNombre] = useState("");
  const [productoBaseCodigo, setProductoBaseCodigo] = useState("");
  const [productoBaseVersion, setProductoBaseVersion] = useState("");
  const [isInheritedFromBase, setIsInheritedFromBase] = useState(false);
  const [newSkuCode, setNewSkuCode] = useState("");
  const [selectedBaseProduct, setSelectedBaseProduct] = useState<AnyRecord | null>(null);

  const [similarityMatches, setSimilarityMatches] = useState<SimilarityMatch[]>(
    [],
  );
  const [isSimilarityFiltersOpen, setIsSimilarityFiltersOpen] =
    useState(false);
  const [similarityScopeFilters, setSimilarityScopeFilters] =
    useState<SimilarityScopeFilters>(DEFAULT_SIMILARITY_SCOPE_FILTERS);
  const [selectedReference, setSelectedReference] =
    useState<SelectedProductReference | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [creationSteps, setCreationSteps] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const [stepNotice, setStepNotice] = useState<{
    key: string;
    message: string;
  } | null>(null);

  const [previewProject, setPreviewProject] = useState<ProjectRecord | null>(null);
  const [isStructureCombinationsOpen, setIsStructureCombinationsOpen] =
    useState(false);
  const [isNewStructureRequestOpen, setIsNewStructureRequestOpen] =
    useState(false);
  const [structureRequestNotice, setStructureRequestNotice] = useState("");

  const stepNoticeTimeoutRef = useRef<number | null>(null);
  const similarityFiltersRef = useRef<HTMLDivElement | null>(null);

  const updateSimilarityScopeFilter = (
    key: keyof SimilarityScopeFilters,
    checked: boolean,
  ) => {
    setSimilarityScopeFilters((current) => {
      const next = { ...current, [key]: checked };
      const hasActiveScope = Object.values(next).some(Boolean);

      return hasActiveScope
        ? next
        : { ...next, sameClientSamePortfolio: true };
    });
  };

  const resetSimilarityFilters = () => {
    setSimilarityScopeFilters({ ...DEFAULT_SIMILARITY_SCOPE_FILTERS });
  };

  // ============= Reseteos Controlados =============

  const resetProductStructure = () => {
    setProductStructure({
      structureType: "",
      layers: [],
    });

    setLayer1("");
    setLayer2("");
    setLayer3("");
    setLayer4("");

    setLayer1Micron("");
    setLayer2Micron("");
    setLayer3Micron("");
    setLayer4Micron("");

    setIsStructureCombinationsOpen(false);
    setIsNewStructureRequestOpen(false);
    setStructureRequestNotice("");

    setSimilarityMatches([]);
    setSelectedReference(null);
  };

  const resetOriginProduct = () => {
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setSelectedBaseProduct(null);
    setIsInheritedFromBase(false);
  };

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

  // ============= Casuística Única =============

  const requestCase = useMemo(
    () =>
      resolveProductRequestCase(
        classification,
        modifications,
      ),
    [classification, modifications],
  );

  const isNewWithNewStructure =
    requestCase === "NEW_WITH_NEW_STRUCTURE";

  const isNewFromBase =
    requestCase === "NEW_FROM_BASE";

  const isModifiedFromApproved =
    requestCase === "MODIFIED_FROM_APPROVED";

  // Determinar si las modificaciones afectan estructura
  const modificationsAffectStructure = modifications.some((value) =>
    [
      "Nueva estructura",
      "Cambia estructura",
      "Cambia materia prima",
      "Nuevos insumos",
    ].some(
      (expected) =>
        normalizeText(value) === normalizeText(expected),
    ),
  );

  // Validación de estructura obligatoria según casuística
  const requiresValidatedStructure =
    isNewWithNewStructure ||
    modificationsAffectStructure;

  // ============= Product Structure Handler =============

  const handleProductStructureChange = (nextValue: ProductStructureValue) => {
    const validation = validateProductStructureValue(nextValue);
    const normalized = validation.normalizedValue;
    const layers = normalized.layers;

    setProductStructure(normalized);

    setLayer1(layers[0]?.materialCode ?? "");
    setLayer2(layers[1]?.materialCode ?? "");
    setLayer3(layers[2]?.materialCode ?? "");
    setLayer4(layers[3]?.materialCode ?? "");

    setLayer1Micron(layers[0]?.micronValue ?? "");
    setLayer2Micron(layers[1]?.micronValue ?? "");
    setLayer3Micron(layers[2]?.micronValue ?? "");
    setLayer4Micron(layers[3]?.micronValue ?? "");

    setErrors((previous) => ({
      ...previous,
      productStructure: "",
      layer1: "",
      layer2: "",
      layer3: "",
      layer4: "",
    }));

    setSimilarityMatches([]);
    setSelectedReference(null);
  };

  // ============= SKU Generation Helpers =============

  const getSelectedCurrentSkuCode = (): string => {
    const selectedBaseSkuCode = selectedBaseProduct
      ? String(
          selectedBaseProduct.skuCode ||
            selectedBaseProduct.currentSkuCode ||
            selectedBaseProduct.productCode ||
            selectedBaseProduct.code ||
            selectedBaseProduct.approvedProductCode ||
            "",
        )
      : "";

    return formatSkuWithVersion(
      selectedBaseSkuCode || productoBaseCodigo.trim(),
      productoBaseVersion.trim(),
    );
  };

  const buildPreviewSkuCode = (): string => {
    if (!classification || modifications.length === 0) return "";

    const sourceRecords = getSkuSourceRecords();

    // Producto Nuevo: siempre nuevo correlativo, versión 00.
    if (shouldGenerateNewSkuSequence(classification)) {
      const skuResult = generateSKUForNewRequest(
        "Nuevo",
        sourceRecords,
        undefined,
      );

      if (skuResult.errors.length > 0) return "";

      return skuResult.skuCode;
    }

    // Producto Modificado: mismo correlativo del SKU actual + versión +1.
    if (shouldGenerateVersionFromCurrentSku(classification)) {
      const currentSkuCode = getSelectedCurrentSkuCode();

      if (!currentSkuCode) return "";

      const skuResult = generateSKUForNewRequest(
        "Modificado",
        sourceRecords,
        currentSkuCode,
      );

      if (skuResult.errors.length > 0) return "";

      return skuResult.skuCode;
    }

    return "";
  };

  // Requisitos de producto origen basados en casuística
  const mustUseCurrentSku = isNewFromBase || isModifiedFromApproved;

  // Modificación de estructura permitida solo en casuísticas específicas
  const canModifyLayerStructure =
    isNewWithNewStructure ||
    hasModification(modifications, "Cambia estructura");

  // Búsqueda de similitud solo para Producto Nuevo + Nueva estructura
  const shouldShowSimilaritySearch = isNewWithNewStructure;

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

  // Validate product structure
  const structureValidation = useMemo(
    () => validateProductStructureValue(productStructure),
    [productStructure],
  );

  // Structure combinations
  const expectedStructureLayerCount = getStructureLayerCount(
    productStructure.structureType,
  );

  const selectedStructureMaterialCodes = useMemo(
    () =>
      Array.from({ length: expectedStructureLayerCount }).map(
        (_, index) => productStructure.layers[index]?.materialCode ?? "",
      ),
    [productStructure.layers, expectedStructureLayerCount],
  );

  const structureCombinations = useMemo(
    () => getValidatedStructureCombinationsByType(productStructure.structureType),
    [productStructure.structureType],
  );

  const exactStructureCombination = useMemo(
    () => {
      const match = findExactStructureCombination({
        structureType: productStructure.structureType,
        selectedMaterialCodes: selectedStructureMaterialCodes,
      });

      return match?.status === "VALIDADA"
        ? match
        : null;
    },
    [productStructure.structureType, selectedStructureMaterialCodes],
  );

  const compatibleStructureCombinations = useMemo(
    () =>
      findCompatibleStructureCombinations({
        structureType: productStructure.structureType,
        selectedMaterialCodes: selectedStructureMaterialCodes,
      }),
    [productStructure.structureType, selectedStructureMaterialCodes],
  );

  const closestStructureMatch = useMemo(
    () =>
      rankStructureCombinations({
        structureType: productStructure.structureType,
        selectedMaterialCodes: selectedStructureMaterialCodes,
      })[0] ?? null,
    [productStructure.structureType, selectedStructureMaterialCodes],
  );

  const isStructureSequenceComplete = Boolean(
    expectedStructureLayerCount > 0 &&
      selectedStructureMaterialCodes.length === expectedStructureLayerCount &&
      selectedStructureMaterialCodes.every(Boolean),
  );

  const currentStructureSequenceLabel = selectedStructureMaterialCodes
    .map((materialCode) =>
      materialCode ? getMaterialLabel(materialCode) : "Pendiente",
    )
    .join(" → ");

  // Estados de validación de estructura (3 niveles)
  const isStructureIncomplete = Boolean(
    productStructure.structureType &&
    !isStructureSequenceComplete,
  );

  const isStructureValidated = Boolean(
    isStructureSequenceComplete &&
    exactStructureCombination?.status === "VALIDADA",
  );

  const isStructureNotValidated = Boolean(
    isStructureSequenceComplete &&
    !exactStructureCombination,
  );

  // Field completion flags - portfolioBelongsToClient will be calculated below after portfoliosForClient is available
  // For now, we use a simple check
  const isClientStepComplete = Boolean(isPortfolioLocked || selectedClientId);

  const isClassificationStepComplete = Boolean(classification);
  const isModificationsStepComplete = modifications.length > 0;

  const isProductoBaseStepComplete = Boolean(
    !mustUseCurrentSku ||
      productoBaseCodigo.trim() ||
      productoBaseNombre.trim()
  );

  const isProductoBaseVersionStepComplete = Boolean(
    !mustUseCurrentSku || productoBaseVersion.trim()
  );

  const isVolumenStepComplete = Boolean(volumen.trim());
  const isUnidadStepComplete = Boolean(unidad);
  const isDescripcionStepComplete = Boolean(descripcion.trim());

  // Checkbox es requisito previo para editar cualquier campo
  const canEditForm = declaresApproved;

  // Computed editability flags
  const canEditPortfolio = canEditForm && isClientStepComplete && !isPortfolioLocked;
  // canEditClassification will be set after isPortfolioStepComplete is computed
  const canEditModifications = canEditForm && isClassificationStepComplete;
  const canEditProductoBase = canEditForm && isModificationsStepComplete && mustUseCurrentSku;
  const canEditProductoBaseVersion =
    canEditProductoBase && isProductoBaseStepComplete;
  // Nombre solo editable en casuísticas de Producto Nuevo
  // En Producto Modificado está bloqueado (heredado del origen)
  // Para Producto Modificado: todo bloqueado excepto SKU Actual
  const isProductoModificadoMode = isModifiedFromApproved;

  // Flujo básico: habilitar nombre/volumen/unidad simultáneamente cuando requisitos se cumplen
  const basicFlowReady =
    canEditForm &&
    isModificationsStepComplete &&
    (!mustUseCurrentSku ||
      (isProductoBaseStepComplete && isProductoBaseVersionStepComplete));

  // Campos editables: después de seleccionar SKU Actual O si marcó checkbox
  const canEditBasicFields =
    (canEditForm || Boolean(selectedBaseProduct)) && !isModifiedFromApproved;
  const canEditProjectName = canEditBasicFields;
  const canEditVolumen = canEditBasicFields;
  const canEditUnidad = canEditBasicFields;
  const canEditDescripcion = canEditBasicFields;
  const canEditMateriales = basicFlowReady && !isModifiedFromApproved && isDescripcionStepComplete;
  const canEditComentarios = basicFlowReady && !isModifiedFromApproved && isDescripcionStepComplete;

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

  // Calcular tipos de estructura válidos basándose en la envoltura
  const validStructureTypes = useMemo(() => {
    if (!envoltura) {
      return undefined; // Si no hay envoltura, mostrar todos los tipos
    }

    const wrappingCode = extractWrappingTypeCode(envoltura);
    if (!wrappingCode) {
      return undefined; // Si no se puede extraer el código, mostrar todos los tipos
    }

    const allTypes = [
      "Monocapa" as const,
      "Bilaminado" as const,
      "Trilaminado" as const,
      "Tetralaminado" as const,
    ];

    return getValidStructureTypesForWrapping(wrappingCode, allTypes);
  }, [envoltura]);

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
    "afMarketId",
    "afMarketID",
    "af",
    "afmarket",
    "mercadoAf",
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

  // Fixed isPortfolioStepComplete - allows Classification to enable for locked portfolios
  const isPortfolioStepComplete = Boolean(
    selectedPortfolio && portfolioBelongsToClient
  );

  const canEditClassification = canEditForm && isPortfolioStepComplete;

const estructuraCalculada = useMemo(() => {
  return productStructure.structureType || "";
}, [productStructure.structureType]);

const nombreTecnicoCalculado = useMemo(() => {
  const capasStr = [
    layer1 ? formatLayerForTechnicalName(layer1, layer1Micron) : "",
    layer2 ? formatLayerForTechnicalName(layer2, layer2Micron) : "",
    layer3 ? formatLayerForTechnicalName(layer3, layer3Micron) : "",
    layer4 ? formatLayerForTechnicalName(layer4, layer4Micron) : "",
  ]
    .filter(Boolean)
    .join(" - ");

  // Nombre del producto: sin volumen ni unidad (van en campos separados)
  return [
    projectName.trim(),
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
    declaresApproved &&
      (isPortfolioLocked || selectedClientId) &&
      selectedPortfolio &&
      portfolioBelongsToClient &&
      classification &&
      modifications.length > 0 &&
      projectName.trim() &&
      volumen.trim() &&
      unidad &&
      descripcion.trim() &&
      (!isProductoModificado(classification) ||
        ((productoBaseCodigo.trim() || productoBaseNombre.trim()) &&
          productoBaseVersion.trim()))
  );

  // Estructura validada para similitud: completa y homologada
  const hasValidatedStructureForSimilarity = Boolean(
    isStructureSequenceComplete &&
    structureValidation.canSave &&
    exactStructureCombination?.status === "VALIDADA",
  );

  const hasMinDataForSimilarity =
    shouldShowSimilaritySearch &&
    requiredBaseFieldsFilled &&
    hasValidatedStructureForSimilarity;

  const hasMinDataForSearch = hasMinDataForSimilarity;

  const projectsForSimilarity = useMemo(() => {
    const fromStorage = getProjectRecordsSafe();
    const fromPortfolio = getProjectsFromPortfolioRecord(selectedPortfolio);

    const merged = [...fromStorage, ...fromPortfolio];

    const seen = new Set<string>();

    return merged.filter((project) => {
      // Include all products with SKU code (approved, preliminary, etc.)
      if (!getProjectSkuCode(project)) return false;

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

    setClassification("");
    setModifications([]);
    setProjectName("");
    setVolumen("");
    setUnidad("");
    setDescripcion("");

    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setSelectedBaseProduct(null);

    setLayer1("");
    setLayer2("");
    setLayer3("");
    setLayer4("");
    setLayer1Micron("");
    setLayer2Micron("");
    setLayer3Micron("");
    setLayer4Micron("");

    setProductStructure({
      structureType: "",
      layers: [],
    });
    setIsStructureCombinationsOpen(false);

    setComentarios("");

    setSimilarityMatches([]);
    setSimilarityScopeFilters({ ...DEFAULT_SIMILARITY_SCOPE_FILTERS });
    setIsSimilarityFiltersOpen(false);
    setErrors({});
    setShowValidationSummary(false);
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
    if (!isSimilarityFiltersOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        similarityFiltersRef.current &&
        !similarityFiltersRef.current.contains(target)
      ) {
        setIsSimilarityFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSimilarityFiltersOpen]);

  useEffect(() => {
    if (!shouldShowSimilaritySearch) {
      setSimilarityMatches([]);
      setSelectedReference(null);
      setPreviewProject(null);
    }
  }, [shouldShowSimilaritySearch, classification, modifications]);

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

  // Actualizar preview del SKU cuando cambian los factores clave
  useEffect(() => {
    const previewSkuCode = buildPreviewSkuCode();
    setNewSkuCode(previewSkuCode);
  }, [
    classification,
    modifications,
    selectedBaseProduct,
    productoBaseCodigo,
    productoBaseVersion,
  ]);

  useEffect(() => {
    if (!shouldShowSimilaritySearch || !hasMinDataForSearch) {
      setSimilarityMatches([]);
      setSelectedReference(null);
      return;
    }

    const candidateData: SimilarityCandidateData = {
      clientCode: inheritedClientCode || resolvedSelectedClient.code,
      clientName: inheritedClientName || resolvedSelectedClient.name,
      portfolioCode: inheritedPortfolioCode,
      envoltura,
      usoFinal,
      maquinaCliente,
      afMarketId: inheritedAfMarketId,
      estructuraCalculada,
      layer1,
      layer2,
      layer3,
      layer4,
      layer1Micron,
      layer2Micron,
      layer3Micron,
      layer4Micron,
      volumen,
      unidad,
    };

    const results = projectsForSimilarity
      .map((project) => {
        const scope = getMatchScope(
          candidateData.clientCode,
          candidateData.clientName,
          candidateData.portfolioCode,
          project,
        );

        return {
          project,
          scope,
          score: calculatePreliminarySimilarity(
            candidateData,
            project,
            DEFAULT_SIMILARITY_CRITERIA,
          ),
        };
      })
      .filter((match) =>
        isScopeEnabled(match.scope, similarityScopeFilters),
      )
      .filter((match) => match.score >= SIMILARITY_MINIMUM_SCORE)
      .sort(compareSimilarityMatches)
      .slice(0, 10);

    if (DEBUG_PROJECT_SIMILARITY) {
      console.log("[ODISEO] Similarity candidateData", candidateData);
      console.table(
        results.map((match) => ({
          code: getProjectCode(match.project),
          name: getProjectName(match.project),
          scope: match.scope,
          score: match.score,
        })),
      );
    }

    setSimilarityMatches(results);
  }, [
    shouldShowSimilaritySearch,
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
    estructuraCalculada,
    similarityScopeFilters,
  ]);

  // Hidratar campos desde producto origen - solo para NEW_FROM_BASE y MODIFIED_FROM_APPROVED
  // Para NEW_WITH_NEW_STRUCTURE no se hereda nada
  // Limpiar estructura cuando cambia a Nueva Estructura
  useEffect(() => {
    if (requestCase === "NEW_WITH_NEW_STRUCTURE") {
      // Para Nueva Estructura, siempre limpiar la estructura heredada
      setProductStructure({ structureType: "", layers: [] });
      setLayer1("");
      setLayer2("");
      setLayer3("");
      setLayer4("");
      setLayer1Micron("");
      setLayer2Micron("");
      setLayer3Micron("");
      setLayer4Micron("");
    }
  }, [requestCase]);

  // Hidratar desde producto base para NEW_FROM_BASE y MODIFIED_FROM_APPROVED
  useEffect(() => {
    if (!selectedBaseProduct || !requestCase) return;
    if (requestCase === "NEW_WITH_NEW_STRUCTURE") return; // No heredar para nueva estructura

    const setters = {
      setProductoBaseId,
      setProductoBaseCodigo,
      setProductoBaseVersion,
      setSelectedBaseProduct,
      setProjectName,
      setVolumen,
      setUnidad,
      setDescripcion,
      setProductStructure,
      setLayer1,
      setLayer2,
      setLayer3,
      setLayer4,
      setLayer1Micron,
      setLayer2Micron,
      setLayer3Micron,
      setLayer4Micron,
      setIsInheritedFromBase,
      setSimilarityMatches,
      setSelectedReference,
    };

    hydrateFromOriginProduct(selectedBaseProduct, requestCase, setters);

    setErrors((prev) => ({
      ...prev,
      originProduct: "",
    }));
  }, [selectedBaseProduct, requestCase]);

  const topMatch = similarityMatches[0];

  const selectedReferenceMatch = selectedReference
    ? similarityMatches.find(
        (match) =>
          getStableProjectCode(match.project) === selectedReference.projectCode,
      )
    : undefined;

  const displayedMatch = selectedReferenceMatch || topMatch;

  const isDisplayedReferenceSelected = Boolean(
    selectedReference &&
      displayedMatch &&
      getStableProjectCode(displayedMatch.project) === selectedReference.projectCode,
  );

  useEffect(() => {
    if (!selectedReference) return;

    const stillAvailable = similarityMatches.some(
      (match) =>
        getStableProjectCode(match.project) === selectedReference.projectCode,
    );

    if (!stillAvailable) {
      setSelectedReference(null);
    }
  }, [similarityMatches, selectedReference]);

  useEffect(() => {
    if (
      showValidationSummary &&
      Object.keys(errors).length === 0
    ) {
      setShowValidationSummary(false);
    }
  }, [errors, showValidationSummary]);

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

    if (!classification) {
      newErrors.classification = "Selecciona la clasificación.";
    }

    if (modifications.length === 0) {
      newErrors.modifications = "Selecciona al menos una modificación.";
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

    // Validate SKU base requirement based on new logic
    if (classification && modifications.length > 0 && mustUseCurrentSku) {
      const hasOriginProductSelected = Boolean(
        selectedBaseProduct ||
          productoBaseCodigo.trim() ||
          productoBaseNombre.trim()
      );

      if (!hasOriginProductSelected) {
        newErrors.productoBase = isProductoNuevo(classification)
          ? "Selecciona un SKU base o referencia técnica para esta solicitud."
          : "Selecciona un SKU actual para generar la nueva versión.";
      }

      if (!productoBaseVersion.trim()) {
        newErrors.productoBaseVersion = isProductoNuevo(classification)
          ? "El SKU base debe tener versión."
          : "El SKU actual debe tener versión.";
      }
    }

    if (!declaresApproved) {
      newErrors.declaresApproved = "Debe confirmar que el producto se encuentra aprobado.";
    }

    // Validación de estructura solo si es requerida
    if (requiresValidatedStructure) {
      if (!productStructure.structureType) {
        newErrors.productStructure =
          "Selecciona el tipo de estructura.";
      } else if (!structureValidation.canSave) {
        newErrors.productStructure =
          getFirstStructureError(structureValidation) ||
          "Completa la estructura del producto.";
      } else if (!isStructureSequenceComplete) {
        newErrors.productStructure =
          "Completa los materiales de todas las capas.";
      } else if (!exactStructureCombination) {
        newErrors.productStructure =
          "La estructura seleccionada no corresponde a una combinación homologada.";
      }
    }

    return newErrors;
  }, [
    selectedClientId,
    isPortfolioLocked,
    selectedPortfolio,
    portfolioBelongsToClient,
    classification,
    modifications,
    projectName,
    volumen,
    unidad,
    descripcion,
    productoBaseCodigo,
    productoBaseNombre,
    productoBaseVersion,
    selectedBaseProduct,
    declaresApproved,
    structureValidation,
  ]);

  const handleApplyStructureCombination = (
    combination: StructureCombinationOption,
  ) => {
    if (!combination.canApply) return;

    const nextLayers = combination.materialCodes.map(
      (materialCode, index) => {
        const previousLayer = productStructure.layers[index];
        const sameMaterial = previousLayer?.materialCode === materialCode;

        return {
          materialCode,
          micronRuleCode: sameMaterial
            ? previousLayer?.micronRuleCode ?? ""
            : "",
          micronValue: sameMaterial
            ? previousLayer?.micronValue ?? ""
            : "",
        };
      },
    );

    handleProductStructureChange({
      structureType: combination.structureType,
      layers: nextLayers,
    });

    setIsStructureCombinationsOpen(false);
  };

  const handleRequestNewStructure = () => {
    setIsNewStructureRequestOpen(true);
  };

  const handleSaveNewStructureRequest = (values: {
    reason: string;
    comment: string;
  }) => {
    const storageKey = "odiseo.pendingStructureRequests";
    let currentDrafts: Array<Record<string, unknown>> = [];

    try {
      currentDrafts = JSON.parse(
        window.localStorage.getItem(storageKey) || "[]",
      );
    } catch {
      currentDrafts = [];
    }

    const draft = {
      id: `EST-REQ-${Date.now()}`,
      status: "PENDIENTE_HOMOLOGACION",
      createdAt: new Date().toISOString(),
      structureType: productStructure.structureType,
      materialCodes: selectedStructureMaterialCodes,
      materialNames: selectedStructureMaterialCodes.map(getMaterialLabel),
      sequence: currentStructureSequenceLabel,
      reason: values.reason,
      comment: values.comment,
      clientCode: inheritedClientCode || resolvedSelectedClient.code,
      clientName: inheritedClientName || resolvedSelectedClient.name,
      portfolioCode: inheritedPortfolioCode,
      portfolioName: inheritedPortfolioName,
      useFinal: usoFinal,
    };

    window.localStorage.setItem(
      storageKey,
      JSON.stringify([...currentDrafts, draft]),
    );

    setIsNewStructureRequestOpen(false);
    setIsStructureCombinationsOpen(false);
    showStepNotice(
      "productStructure",
      "Solicitud de nueva estructura guardada como borrador pendiente de homologación.",
    );
  };

  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
    setSelectedClient(null);
    setPortfolioCode("");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);
    setClassification("");
    setModifications([]);
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setSelectedBaseProduct(null);
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
    setProductStructure({
      structureType: "",
      layers: [],
    });
    setIsStructureCombinationsOpen(false);
    setComentarios("");
    setSimilarityMatches([]);
    setSelectedReference(null);
    setErrors((prev) => ({
      ...prev,
      clientId: "",
      portfolioCode: "",
      classification: "",
      modifications: "",
      originProduct: "",
      projectName: "",
      volumen: "",
      unidad: "",
      descripcion: "",
      productStructure: "",
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
    setClassification("");
    setModifications([]);
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setSelectedBaseProduct(null);
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
    setComentarios("");
    setSimilarityMatches([]);
    setSelectedReference(null);
    setErrors((prev) => ({
      ...prev,
      portfolioCode: "",
      classification: "",
      modifications: "",
      productoBase: "",
      productoBaseVersion: "",
      projectName: "",
      volumen: "",
      unidad: "",
      descripcion: "",
      layer1: "",
      comentarios: "",
    }));

    showStepNotice("portfolio", "Portafolio seleccionado. Clasificación se habilitó.");
  };

  const clearPortfolio = () => {
    setPortfolioCode("");
    setPortfolioSearchTerm("");
    setIsPortfolioDropdownOpen(false);
    setClassification("");
    setModifications([]);
    setProductoBaseId("");
    setProductoBaseNombre("");
    setProductoBaseCodigo("");
    setProductoBaseVersion("");
    setSelectedBaseProduct(null);
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

// Layer management functions removed - using ProductStructureConfigurator component

  const validate = () => {
    const nextErrors = validateForm;
    const isValid =
      Object.keys(nextErrors).length === 0;

    setErrors(nextErrors);
    setShowValidationSummary(!isValid);

    return isValid;
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
      projectId: getStableProjectId(project),
      projectCode: getStableProjectCode(project),
      skuCode: getProjectSkuCode(project),
      projectName: getProductDisplayName(project),
      score: match.score,
      scope: match.scope,
      status: getProjectStatus(project),
      datosSugeridosMomento2: buildMoment2ReferenceData(project),
    });

    setIsSimilarityFiltersOpen(false);
    setErrors((previous) => ({
      ...previous,
      referenceProduct: "",
    }));

    // Scroll hacia arriba para mostrar la referencia aplicada
    setTimeout(() => {
      const scrollContainer = document.querySelector(
        '[data-scroll-container="moment2-reference"]'
      );
      if (scrollContainer) {
        scrollContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const applyReferenceProjectFromProject = (
    project: ProjectRecord,
    score: number = 0,
  ) => {
    const scope = getMatchScope(
      inheritedClientCode || resolvedSelectedClient.code,
      inheritedClientName || resolvedSelectedClient.name,
      inheritedPortfolioCode,
      project,
    );

    setSelectedReference({
      projectId: getStableProjectId(project),
      projectCode: getStableProjectCode(project),
      skuCode: getProjectSkuCode(project),
      projectName: getProductDisplayName(project),
      score,
      scope,
      status: getProjectStatus(project),
      datosSugeridosMomento2: buildMoment2ReferenceData(project),
    });

    setPreviewProject(null);
    setIsSimilarityFiltersOpen(false);
    setErrors((previous) => ({
      ...previous,
      referenceProduct: "",
    }));
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

      // Classification es la fuente principal
      const normalizedClassification = isProductoModificado(classification)
        ? "Modificado"
        : "Nuevo";

      // Helper para extraer material group desde el catálogo
      const extractMaterialGroup = (materialCode: string): string => {
        if (!materialCode) return "";
        const material = resolveMaterialLayer(materialCode);
        return material ? material.TbMatCapGmp : "";
      };

      // Calcular snapshots para cada capa una sola vez
      const layer1Snapshot = layer1 ? buildLayerTechnicalSnapshot({ materialValue: layer1, micronValue: layer1Micron }) : null;
      const layer2Snapshot = layer2 ? buildLayerTechnicalSnapshot({ materialValue: layer2, micronValue: layer2Micron }) : null;
      const layer3Snapshot = layer3 ? buildLayerTechnicalSnapshot({ materialValue: layer3, micronValue: layer3Micron }) : null;
      const layer4Snapshot = layer4 ? buildLayerTechnicalSnapshot({ materialValue: layer4, micronValue: layer4Micron }) : null;

      // Generar códigos de producto (SKU, EDAG, EM)
      const sourceRecords = getSkuSourceRecords();
      const currentSkuCode = getSelectedCurrentSkuCode();

      let skuResult;

      if (requestCase === "NEW_WITH_NEW_STRUCTURE") {
        // Casuística 1: Producto Nuevo + Nueva Estructura = nuevo correlativo E-00
        skuResult = generateSKUForNewRequest(
          "Nuevo",
          sourceRecords,
          undefined,
        );
      } else if (requestCase === "NEW_FROM_BASE") {
        // Casuística 2: Producto Nuevo desde Base B = mantener correlativo, cambiar a E-00
        if (!currentSkuCode) {
          addStep("✗ Error generando SKU: falta SKU base para Producto Nuevo desde Base.");
          setIsCreating(false);
          return;
        }

        skuResult = generateSKUForNewRequest(
          "NuevoDesdeBase",
          sourceRecords,
          currentSkuCode,
        );
      } else if (requestCase === "MODIFIED_FROM_APPROVED") {
        // Casuística 3: Producto Modificado desde A = mantener correlativo, incrementar versión
        if (!currentSkuCode) {
          addStep("✗ Error generando SKU: falta SKU actual para Producto Modificado.");
          setIsCreating(false);
          return;
        }

        skuResult = generateSKUForNewRequest(
          "Modificado",
          sourceRecords,
          currentSkuCode,
        );
      } else {
        addStep("✗ Error generando SKU: casuística no reconocida.");
        setIsCreating(false);
        return;
      }

      if (skuResult.errors.length > 0) {
        addStep(`✗ Error generando SKU: ${skuResult.errors.join(", ")}`);
        setIsCreating(false);
        return;
      }

      const generatedSkuCode = newSkuCode || skuResult.skuCode;
      const edagCode = generateNewEDAG(60000 + sourceRecords.length);
      const emCode = generateNewEM(50000 + sourceRecords.length);

      // Parser único del SKU - versión 00 se preserva correctamente
      let parsedSku: ParsedSkuCode;
      try {
        parsedSku = parseSkuCode(generatedSkuCode);
      } catch (error) {
        addStep(`✗ Error parseando SKU: ${error}`);
        setIsCreating(false);
        return;
      }

      const createdProject = createProjectFromPortfolioSafe({
        portfolio: selectedPortfolio!,
        initialData: {
          // Códigos de producto generados automáticamente
          // SKU: guardar en múltiples aliases para garantizar que se preserve
          code: generatedSkuCode,
          productCode: generatedSkuCode,
          skuCode: generatedSkuCode,
          currentSkuCode: generatedSkuCode,
          codigoSku: generatedSkuCode,
          codigoProducto: generatedSkuCode,
          codigoProductoOdiseo: generatedSkuCode,

          // Componentes del SKU parseados (versión 00 se preserva correctamente)
          productIdentityCode: parsedSku.productIdentityCode,
          skuSequence: parsedSku.sequence,
          skuLifecycleCode: parsedSku.lifecycleCode,
          skuLifecycleName: 'Preliminar',
          skuVersion: parsedSku.version,
          skuVersionCode: parsedSku.versionCode,

          productLifecycleCode: 'E',
          productLifecycleName: 'Preliminar',

          // EDAG y EM
          edagCode,
          edagSequence: 60000 + sourceRecords.length,
          edagVersion: 0,
          emCode,
          emSequence: 50000 + sourceRecords.length,
          emVersion: 0,

          // Principal: classification y modifications
          classification: normalizedClassification,
          clasificacion: normalizedClassification,

          modifications: [...modifications],
          modificaciones: [...modifications],
          causales: [...modifications],

          // Legacy aliases para compatibilidad
          projectType: modifications[0] || "",
          tipoProyecto: modifications[0] || "",
          motivoNuevaValidacion: modifications[0] || "",
          causal: modifications[0] || "",
          motivo: classification,

          licitacion: "No",
          status: "Registrado",
          siProductCode: "",
          estadoValidacion: "Pendiente de solicitud",

          projectName: projectName.trim(),
          volumenCantidadReferencial: volumen.trim(),
          estimatedVolume: volumen.trim(),
          unidad: normalizeUnitValue(unidad),
          unitOfMeasure: normalizeUnitValue(unidad),
          descripcionNecesidad: descripcion.trim(),
          projectDescription: descripcion.trim(),

          ...(layer1Snapshot && {
            layer1Snapshot,
            layer1Material: layer1,
            layer1MaterialCode: layer1,
            layer1MaterialLabel: layer1Snapshot.materialName,
            layer1MaterialId: layer1Snapshot.materialId,
            layer1MaterialGroup: layer1Snapshot.materialGroup,
            layer1Micraje: layer1Micron || undefined,
            layer1Micron: layer1Micron || undefined,
            layer1MicronCode: layer1Snapshot.micronCode,
            layer1MicronType: layer1Snapshot.micronType,
            layer1Grammage: layer1Snapshot.grammage,
          }),

          ...(layer2Snapshot && {
            layer2Snapshot,
            layer2Material: layer2,
            layer2MaterialCode: layer2,
            layer2MaterialLabel: layer2Snapshot.materialName,
            layer2MaterialId: layer2Snapshot.materialId,
            layer2MaterialGroup: layer2Snapshot.materialGroup,
            layer2Micraje: layer2Micron || undefined,
            layer2Micron: layer2Micron || undefined,
            layer2MicronCode: layer2Snapshot.micronCode,
            layer2MicronType: layer2Snapshot.micronType,
            layer2Grammage: layer2Snapshot.grammage,
          }),

          ...(layer3Snapshot && {
            layer3Snapshot,
            layer3Material: layer3,
            layer3MaterialCode: layer3,
            layer3MaterialLabel: layer3Snapshot.materialName,
            layer3MaterialId: layer3Snapshot.materialId,
            layer3MaterialGroup: layer3Snapshot.materialGroup,
            layer3Micraje: layer3Micron || undefined,
            layer3Micron: layer3Micron || undefined,
            layer3MicronCode: layer3Snapshot.micronCode,
            layer3MicronType: layer3Snapshot.micronType,
            layer3Grammage: layer3Snapshot.grammage,
          }),

          ...(layer4Snapshot && {
            layer4Snapshot,
            layer4Material: layer4,
            layer4MaterialCode: layer4,
            layer4MaterialLabel: layer4Snapshot.materialName,
            layer4MaterialId: layer4Snapshot.materialId,
            layer4MaterialGroup: layer4Snapshot.materialGroup,
            layer4Micraje: layer4Micron || undefined,
            layer4Micron: layer4Micron || undefined,
            layer4MicronCode: layer4Snapshot.micronCode,
            layer4MicronType: layer4Snapshot.micronType,
            layer4Grammage: layer4Snapshot.grammage,
          }),

          estructuraCalculada,
          structureType: estructuraCalculada,
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

          // CORRECCIÓN: Guardar también como additionalComment (no solo comentarios)
          comentarios: comentarios.trim() || undefined,
          additionalComment: comentarios.trim() || undefined,
          nombreTecnicoCalculado,

          clientCode: inheritedClientCode || resolvedSelectedClient.code,
          clientName: inheritedClientName || resolvedSelectedClient.name,
          portfolioCode: inheritedPortfolioCode,
          portfolioName: inheritedPortfolioName,
          envoltura,
          wrappingName: envoltura,
          usoFinal,
          useFinalName: usoFinal,
          maquinaCliente,
          packingMachineName: maquinaCliente,
          ejecutivoComercial: inheritedExecutiveName || undefined,
          ejecutivoName: inheritedExecutiveName || undefined,
          executiveName: inheritedExecutiveName || undefined,
          plantaName: getRecordValue(selectedPortfolio, ["pl", "plantaName", "plantName"]),
          segmento: inheritedSegment,
          segment: inheritedSegment,
          subSegmento: inheritedSubSegment,
          subSegment: inheritedSubSegment,
          sector: inheritedSector,
          afMarketId: inheritedAfMarketId,

          // Guardar SKU base cuando existe (para Producto Nuevo con referencias o Modificado)
          ...(mustUseCurrentSku || selectedBaseProduct || productoBaseCodigo.trim()) && {
            skuBaseCode: currentSkuCode || undefined,
            productoBaseId: productoBaseId || undefined,
            productoBaseCodigo: productoBaseCodigo.trim(),
            productoBaseNombre: productoBaseNombre.trim(),
            productoBaseVersion: productoBaseVersion.trim(),
            approvedProductCode: currentSkuCode || productoBaseCodigo.trim(),
            approvedProductSnapshot: selectedBaseProduct,
            originProductSnapshot: selectedBaseProduct,
          },

          proyectoReferenciaId: selectedReference?.projectId,
          proyectoReferenciaCodigo: selectedReference?.projectCode,
          proyectoReferenciaNombre: selectedReference?.projectName,
          porcentajeSimilitudPreliminar: selectedReference?.score,
          alcanceReferenciaSimilitud: selectedReference?.scope,
          estadoProductoReferencia: selectedReference?.status,
          referenciaParaMomento2: Boolean(selectedReference),
          datosSugeridosMomento2: selectedReference?.datosSugeridosMomento2,
        },
        createdBy: String(currentUser?.id ?? "system"),
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
      addStep("✓ Guardando datos en el almacenamiento...");

      // Asegurar que el proyecto se guarde en el storage
      try {
        const storageApi = getStorageApi(projectStorage);
        if (typeof storageApi.saveProjectRecord === "function") {
          (storageApi.saveProjectRecord as (record: ProjectRecord) => void)(createdProject as ProjectRecord);
        }
      } catch (saveError) {
        console.error("[ODISEO] Error saving project to storage:", saveError);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const createdProjectCode =
        getRecordValue(createdProject, ["code", "projectCode", "id"]) ||
        getRecordValue(createdProject, ["codigo"]);

      addStep(`✓ ¡Proyecto creado exitosamente! (${createdProjectCode})`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      onProjectCreated?.(createdProjectCode);
      onClose();
      // Navegar a la lista de productos
      navigate("/products");
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
            <h3 className="text-lg font-bold text-slate-900">Nueva solicitud</h3>
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
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declaresApproved"
                    checked={declaresApproved}
                    onChange={(event) => {
                      setDeclaresApproved(
                        event.target.checked,
                      );

                      setErrors((previous) => ({
                        ...previous,
                        declaresApproved: "",
                      }));
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer mt-0.5"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="declaresApproved" className="text-sm font-semibold text-slate-700 cursor-pointer">
                      Declaro que el producto a registrar se encuentra aprobado *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/compliance-document`;
                        window.open(url, "_blank", "width=1000,height=800");
                      }}
                      className="text-xs text-brand-primary hover:text-brand-primary/80 hover:underline font-medium text-left max-w-fit"
                    >
                      Ver documento de cumplimiento normativo
                    </button>
                  </div>
                </div>
                {errors.declaresApproved && (
                  <span className="block text-xs text-red-600">{errors.declaresApproved}</span>
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
                  value={classification}
                  onChange={(value) => {
                    setClassification(value);
                    setModifications([]);
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
                    setComentarios("");

                    if (value !== "Producto Modificado" && value !== "Producto modificado") {
                      setProductoBaseId("");
                      setProductoBaseNombre("");
                      setProductoBaseCodigo("");
                      setProductoBaseVersion("");
                      setSelectedBaseProduct(null);
                      setIsInheritedFromBase(false);
                    }

                    // Generar código SKU para producto nuevo
                    if (value === "Producto Nuevo" || value === "Producto nuevo") {
                      setProductoBaseVersion("00");
                      // Para Nueva estructura, obtener el próximo SKU disponible de la BD
                      if (selectedBaseProduct) {
                        const nextSku = getNextAvailableSku();
                        setNewSkuCode(`${nextSku}-E-00`);
                      } else {
                        setNewSkuCode("");
                      }
                    } else {
                      setProductoBaseVersion("");
                      setNewSkuCode("");
                    }

                    setSimilarityMatches([]);
                    setSelectedReference(null);
                    setErrors((prev) => ({
                      ...prev,
                      classification: "",
                      modifications: "",
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
                      showStepNotice("classification", "Clasificación seleccionada. Se habilitó seleccionar el siguiente paso.");
                    }
                  }}
                  options={getClassificationOptions()}
                  error={errors.classification}
                  placeholder="-- Seleccione --"
                  disabled={!canEditClassification}
                />

                <div className="space-y-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Modificación(es) *
                    </span>
                  </label>
                  <div className="space-y-2">
                    {getModificationOptions(classification).map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`modification-${option.value}`}
                          checked={modifications.includes(option.value)}
                          onChange={(e) => {
                            let newModifications: string[];

                            if (option.value === "Nueva estructura") {
                              if (e.target.checked) {
                                newModifications = ["Nueva estructura"];
                              } else {
                                newModifications = [];
                              }
                            } else {
                              if (modifications.includes("Nueva estructura")) {
                                newModifications = e.target.checked ? [option.value] : [];
                              } else {
                                newModifications = e.target.checked
                                  ? [...modifications, option.value]
                                  : modifications.filter((m) => m !== option.value);
                              }
                            }

                            setModifications(newModifications);
                            setProductoBaseId("");
                            setProductoBaseNombre("");
                            setProductoBaseCodigo("");
                            setProductoBaseVersion("");
                            setSelectedBaseProduct(null);
                            setIsInheritedFromBase(false);
                            setNewSkuCode("");
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
                            setComentarios("");
                            setSimilarityMatches([]);
                            setSelectedReference(null);
                            setErrors((prev) => ({
                              ...prev,
                              modifications: "",
                              projectName: "",
                              volumen: "",
                              unidad: "",
                              descripcion: "",
                              layer1: "",
                              comentarios: "",
                              productoBase: "",
                              productoBaseVersion: "",
                            }));

                            if (newModifications.length > 0) {
                              if (isProductoModificado(classification)) {
                                showStepNotice(
                                  "modifications",
                                  "Modificación(es) seleccionada(s). Producto base se habilitó.",
                                );
                              } else {
                                showStepNotice(
                                  "modifications",
                                  "Modificación(es) seleccionada(s). Nombre del Proyecto se habilitó.",
                                );
                              }
                            }
                          }}
                          disabled={
                            !canEditModifications ||
                            (modifications.includes("Nueva estructura") && option.value !== "Nueva estructura") ||
                            (modifications.length > 0 && !modifications.includes("Nueva estructura") && option.value === "Nueva estructura")
                          }
                          className={`h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary ${
                            (modifications.includes("Nueva estructura") && option.value !== "Nueva estructura") ||
                            (modifications.length > 0 && !modifications.includes("Nueva estructura") && option.value === "Nueva estructura")
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                        />
                        <label
                          htmlFor={`modification-${option.value}`}
                          className={`ml-3 text-sm ${
                            (modifications.includes("Nueva estructura") && option.value !== "Nueva estructura") ||
                            (modifications.length > 0 && !modifications.includes("Nueva estructura") && option.value === "Nueva estructura")
                              ? "text-slate-400 cursor-not-allowed"
                              : "text-slate-700 cursor-pointer"
                          }`}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.modifications && (
                    <span className="block text-xs text-red-600">{errors.modifications}</span>
                  )}
                </div>
              </div>

              {modifications.length > 0 && mustUseCurrentSku && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">
                      {isProductoNuevo(classification)
                        ? "SKU Base / Referencia técnica"
                        : "SKU Actual"}
                      {" "}
                      {mustUseCurrentSku ? "*" : ""}
                    </label>
                    {classification && modifications.length > 0 && (
                      <p className="text-xs text-slate-500 italic">
                        {getOriginProductHelpText(normalizeClassification(classification), modifications[0])}
                      </p>
                    )}
                    <ApprovedProductSearch
                      value={productoBaseNombre}
                      onChange={(value) => {
                        setProductoBaseNombre(value);
                        // Si se vacía el campo, limpiar el producto seleccionado y código
                        if (!value.trim()) {
                          setSelectedBaseProduct(null);
                          setProductoBaseCodigo("");
                          setProductoBaseVersion("");
                        }
                      }}
                      onSelect={(product) => {
                        const productCode = String(product.code || product.id || "");
                        const productVersion = normalizeVersion(String(product.version || ""));

                        setProductoBaseId(String(product.id || productCode));
                        setProductoBaseNombre(String(product.name || product.productName || productCode));
                        setProductoBaseCodigo(productCode);
                        setProductoBaseVersion(productVersion);
                        setSelectedBaseProduct(product as AnyRecord);

                        setErrors((prev) => ({
                          ...prev,
                          productoBase: "",
                          productoBaseVersion: "",
                        }));

                        showStepNotice(
                          "productoBase",
                          "Producto base completado. Datos heredados automáticamente.",
                        );
                      }}
                      portfolioCode={inheritedPortfolioCode || portfolioCode}
                      productType={classification && modifications.length > 0
                        ? (() => {
                            const allowedCodes = getAllowedOriginLifecycle(normalizeClassification(classification), modifications[0]);
                            if (allowedCodes.includes("A") && allowedCodes.includes("B")) {
                              return undefined; // Show all
                            } else if (allowedCodes.includes("A")) {
                              return "approved";
                            } else if (allowedCodes.includes("B")) {
                              return "base";
                            }
                            return undefined;
                          })()
                        : undefined
                      }
                      disabled={!canEditProductoBase}
                    />
                    {errors.productoBase && (
                      <span className="block text-xs text-red-600">
                        {errors.productoBase}
                      </span>
                    )}
                  </div>

                  <FormInput
                    label={isProductoNuevo(classification) ? "Código SKU Base *" : "Código SKU Actual *"}
                    value={formatSkuWithVersion(productoBaseCodigo, productoBaseVersion)}
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
                    placeholder={isProductoNuevo(classification) ? "Ej. SKU-00001-A-00" : "Ej. SKU-00001-A-01"}
                    error={errors.productoBaseVersion}
                    disabled={true}
                  />
                </div>
              )}

              {modifications.length > 0 && newSkuCode && (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    {isProductoModificado(classification) ? "Nuevo Código SKU (N+1)" : "Código SKU Generado"}
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
                    <span className="text-sm font-mono text-slate-900">{newSkuCode}</span>
                  </div>
                  {isProductoNuevo(classification) && mustUseCurrentSku && (
                    <p className="text-xs text-slate-500">
                      El SKU base se usa como referencia técnica. El producto nuevo mantiene nuevo correlativo.
                    </p>
                  )}
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

                      setSimilarityMatches([]);
                      setSelectedReference(null);
                      setErrors((prev) => ({
                        ...prev,
                        projectName: "",
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
                      if (isInheritedFromBase && !(isProductoNuevo(classification) && modifications.includes("Nueva estructura"))) return;
                      const wasEmpty = !volumen.trim();
                      setVolumen(value);
                      setErrors((prev) => ({
                        ...prev,
                        volumen: "",
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
                    disabled={!canEditVolumen || (isInheritedFromBase && !(isProductoNuevo(classification) && modifications.includes("Nueva estructura")))}
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
                      if (isInheritedFromBase && !(isProductoNuevo(classification) && modifications.includes("Nueva estructura"))) return;
                      setUnidad(value);
                      setErrors((prev) => ({
                        ...prev,
                        unidad: "",
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
                    disabled={!canEditUnidad || (isInheritedFromBase && !(isProductoNuevo(classification) && modifications.includes("Nueva estructura")))}
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
                    if (isInheritedFromBase && isModifiedFromApproved) return;
                    const wasEmpty = !descripcion.trim();
                    setDescripcion(event.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      descripcion: "",
                    }));

                    if (wasEmpty && event.target.value.trim()) {
                      showStepNotice(
                        "descripcion",
                        "Descripción completada. Materiales y Comentarios se habilitaron.",
                      );
                    }
                  }}
                  placeholder="Describe la necesidad técnica o comercial..."
                  disabled={!canEditDescripcion || (isInheritedFromBase && isModifiedFromApproved)}
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                    Materiales por capa *
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Configura el tipo de estructura y selecciona los materiales requeridos.
                  </p>
                </div>

                <ProductStructureConfigurator
                  value={productStructure}
                  onChange={handleProductStructureChange}
                  disabled={!canEditMateriales}
                  inherited={isInheritedFromBase}
                  allowStructureChange={canModifyLayerStructure}
                  showCoverageWarning={false}
                  className="w-full"
                  validationErrors={structureValidation.errors}
                  availableStructureTypes={validStructureTypes}
                  headerButton={
                    productStructure.structureType ? (
                      <Button
                        variant="outline"
                        onClick={() =>
                          setIsStructureCombinationsOpen(true)
                        }
                        disabled={!canEditMateriales}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Layers3 size={16} />
                          Consultar combinaciones
                          {productStructure.structureType
                            ? ` (${structureCombinations.length})`
                            : ""}
                        </span>
                      </Button>
                    ) : null
                  }
                />

                {productStructure.structureType && (
                  <div className="space-y-2">
                    {isStructureIncomplete ? (
                      // Estado 1: Incompleta
                      <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
                        <p className="text-sm font-semibold text-yellow-700">
                          ⚠ Estructura incompleta
                        </p>
                        <p className="mt-1 text-xs text-yellow-600">
                          Completa los materiales de todas las capas requeridas.
                        </p>
                      </div>
                    ) : isStructureValidated ? (
                      // Estado 2: Validada (homologada)
                      <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3">
                        <p className="text-sm font-semibold text-green-700">
                          ✓ Estructura válida (homologada)
                        </p>
                      </div>
                    ) : (
                      // Estado 3: No validada (completa pero no homologada)
                      <>
                        <div className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-3">
                          <p className="text-sm font-semibold text-orange-700">
                            ⚠ Estructura no homologada
                          </p>
                          <p className="mt-1 text-xs text-orange-600">
                            La estructura está completa pero no se encuentra en las combinaciones homologadas. Solicita una nueva estructura para validarla.
                          </p>
                        </div>
                        {requiresValidatedStructure && !isModifiedFromApproved && !isInheritedFromBase && (
                          <Button
                            variant="outline"
                            onClick={handleRequestNewStructure}
                            className="w-full"
                          >
                            Solicitar nueva estructura
                          </Button>
                        )}
                      </>
                    )}
                  </div>
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

              {shouldShowSimilaritySearch && (
                <div
                  ref={similarityFiltersRef}
                  className="relative rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Productos similares (referencia Momento 2)
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIsSimilarityFiltersOpen((current) => !current)
                      }
                      aria-expanded={isSimilarityFiltersOpen}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <SlidersHorizontal size={14} />
                      Filtros
                    </button>
                  </div>

                  {isSimilarityFiltersOpen && (
                    <div className="absolute right-4 top-14 z-[10060] w-80 max-w-[calc(100vw-3rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-slate-900/5">
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Dónde buscar
                        </p>

                        <div className="mt-2 space-y-2">
                          {[
                            {
                              key: "sameClientSamePortfolio" as const,
                              label: "Portafolio actual",
                            },
                            {
                              key: "sameClientOtherPortfolio" as const,
                              label: "Otros portafolios del mismo cliente",
                            },
                            {
                              key: "otherClients" as const,
                              label: "Portafolios de otros clientes",
                            },
                          ].map((option) => (
                            <label
                              key={option.key}
                              className="flex cursor-pointer items-start gap-2 text-xs text-slate-700"
                            >
                              <input
                                type="checkbox"
                                checked={similarityScopeFilters[option.key]}
                                onChange={(event) =>
                                  updateSimilarityScopeFilter(
                                    option.key,
                                    event.target.checked,
                                  )
                                }
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>

                        {similarityScopeFilters.otherClients && (
                          <p className="mt-3 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] text-amber-700">
                            Las coincidencias de otros clientes se muestran solo como referencia técnica.
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={resetSimilarityFilters}
                          className="mt-3 w-full border-t border-slate-100 pt-3 text-left text-xs font-semibold text-brand-primary hover:underline"
                        >
                          Restablecer
                        </button>
                      </div>
                    </div>
                  )}

                  {!requiredBaseFieldsFilled || !hasValidatedStructureForSimilarity ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Complete la estructura y los materiales para buscar productos similares.
                    </p>
                  ) : !displayedMatch ? (
                    <p className="mt-3 text-xs text-slate-500">
                      No se encontraron productos similares con los criterios seleccionados.
                    </p>
                  ) : (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                      {isDisplayedReferenceSelected && (
                        <p className="mb-2 text-xs font-bold text-green-700">
                          ✓ Referencia seleccionada
                        </p>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900">
                            {getProductDisplayName(displayedMatch.project)}
                          </p>
                          <p className="mt-0.5 text-[11px] font-mono text-slate-600">
                            {getProjectSkuCode(displayedMatch.project)}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
                          {Math.round(displayedMatch.score)}% similar
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs text-slate-700">
                        {getProductMaterialSummary(displayedMatch.project) ||
                          "Materiales no registrados"}
                      </p>

                      <div className="mt-3">
                        <span
                          className={[
                            "inline-flex max-w-full rounded-full px-2 py-1 text-[11px] font-semibold",
                            displayedMatch.scope === "OTHER_CLIENT"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600",
                          ].join(" ")}
                          title={getScopeLabel(displayedMatch.scope)}
                        >
                          <span className="truncate">
                            {getSimilarityContextLabel(displayedMatch)}
                          </span>
                        </span>
                      </div>

                      {displayedMatch.scope === "OTHER_CLIENT" &&
                        !isDisplayedReferenceSelected && (
                          <p className="mt-2 text-[11px] text-amber-700">
                            Valida su aplicabilidad antes de usar esta estructura.
                          </p>
                        )}

                      {isDisplayedReferenceSelected && (
                        <p className="mt-2 text-[11px] text-slate-500">
                          La estructura se utilizará como referencia para el Momento 2.
                        </p>
                      )}

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setPreviewProject(displayedMatch.project)
                          }
                        >
                          Ver producto
                        </Button>

                        {isDisplayedReferenceSelected ? (
                          <Button
                            variant="outline"
                            onClick={() => setSelectedReference(null)}
                          >
                            Quitar referencia
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() =>
                              applyReferenceProject(displayedMatch)
                            }
                          >
                            Usar referencia
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowValidationSummary(false);
              setErrors({});
              onClose();
            }}
            disabled={isCreating}
          >
            Cancelar
          </Button>

          <div className="relative">
            {showValidationSummary &&
              !isCreating &&
              Object.keys(errors).length > 0 && (
                <div
                  role="dialog"
                  aria-live="polite"
                  aria-label="Campos requeridos incompletos"
                  className="
                    absolute bottom-full right-0 z-[10100]
                    mb-3 w-[390px] max-w-[calc(100vw-3rem)]
                    rounded-xl border border-red-200
                    bg-white p-4 shadow-2xl
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-red-700">
                        Campos requeridos incompletos
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Completa los siguientes campos
                        para registrar la solicitud.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowValidationSummary(false)
                      }
                      className="
                        rounded-full p-1 text-slate-400
                        hover:bg-slate-100
                        hover:text-slate-600
                      "
                      aria-label="Cerrar advertencia"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto">
                    {Object.entries(errors).map(
                      ([field, message]) => (
                        <div
                          key={field}
                          className="flex items-start gap-2 text-xs text-red-700"
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            •
                          </span>

                          <span>{message}</span>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-2">
                    <p className="text-right text-xs font-semibold text-red-600">
                      {Object.keys(errors).length === 1
                        ? "1 campo requerido"
                        : `${Object.keys(errors).length} campos requeridos`}
                    </p>
                  </div>

                  <div
                    className="
                      absolute -bottom-2 right-8
                      h-4 w-4 rotate-45
                      border-b border-r border-red-200
                      bg-white
                    "
                  />
                </div>
              )}

            <Button
              variant="primary"
              onClick={handleCreateClick}
              disabled={isCreating}
            >
              {isCreating
                ? "Guardando..."
                : "Guardar"}
            </Button>
          </div>
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

      {shouldShowSimilaritySearch && previewProject && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">
                Producto de referencia
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
                      label="Nombre de producto"
                      value={
                        [
                          getProjectName(previewProject),
                          getRecordValue(previewProject, [
                            "volumen",
                            "volumenReferencial",
                            "volumenCantidadReferencial",
                            "volumenProducto",
                          ]),
                          getRecordValue(previewProject, [
                            "unidad",
                            "unidadVolumen",
                            "unidadMedida",
                          ]),
                        ]
                          .filter(Boolean)
                          .join(" ") || "—"
                      }
                    />
                    <PreviewRow
                      label="Clasificación / Motivo"
                      value={
                        getProjectClassification(previewProject) ||
                        getRecordValue(previewProject, [
                          "motivo",
                          "clasificacion",
                        ]) ||
                        "—"
                      }
                    />
                    <PreviewRow
                      label="Tipo / Causal"
                      value={
                        getProjectModifications(previewProject).join(", ") ||
                        getRecordValue(previewProject, [
                          "causal",
                          "tipoProyecto",
                          "motivoNuevaValidacion",
                        ]) ||
                        "—"
                      }
                    />
                    <PreviewRow
                      label="Descripción"
                      value={
                        getRecordValue(previewProject, [
                          "descripcionNecesidad",
                          "descripcion",
                          "descripcionProducto",
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
                      label="Estructura"
                      value={
                        getRecordValue(previewProject, [
                          "estructuraCalculada",
                          "structureType",
                        ]) || "—"
                      }
                    />
                    <PreviewRow
                      label="Materiales"
                      value={
                        getProductMaterialSummary(previewProject) ||
                        getRecordValue(previewProject, [
                          "estructuraMaterialesReferencial",
                          "materialSummary",
                        ]) ||
                        "—"
                      }
                    />
                  </div>
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

      <ValidStructureCombinationsModal
        isOpen={isStructureCombinationsOpen}
        structureType={productStructure.structureType}
        currentLayers={productStructure.layers}
        onApply={handleApplyStructureCombination}
        onRequestNew={handleRequestNewStructure}
        onClose={() => setIsStructureCombinationsOpen(false)}
      />

      <NewStructureRequestModal
        isOpen={isNewStructureRequestOpen}
        structureType={productStructure.structureType}
        layers={productStructure.layers}
        sequence={currentStructureSequenceLabel}
        clientName={inheritedClientName || resolvedSelectedClient.name}
        portfolioName={inheritedPortfolioName}
        wrappingName={envoltura}
        useFinal={usoFinal}
        productName={projectName}
        onSave={handleSaveNewStructureRequest}
        onClose={() => setIsNewStructureRequestOpen(false)}
      />
    </div>,
    document.body
  );
}
