import { findMaterialLayerByCode } from "../data/productMaterialCatalog";
import {
  PRODUCT_STRUCTURE_MATRIX,
  getStructureLayerCount,
  type ProductStructureType,
} from "../data/productStructureMatrix";

export type StructureCombinationStatus =
  | "VALIDADA"
  | "PENDIENTE_NEGOCIO"
  | "NO_VALIDADA";

export type StructureMatrixCode =
  | "MC-004"
  | "MC-005"
  | "MC-006"
  | "MC-007";

export interface StructureCombinationOption {
  id: string;
  structureType: ProductStructureType;
  matrixCode: StructureMatrixCode;
  layerCount: number;
  layerLabels: string[];
  sequenceLabel: string;

  /**
   * Alternativas de código válidas para cada posición.
   * - RESOLVED: un solo código.
   * - FAMILY: más de un código.
   * - UNRESOLVED: arreglo vacío.
   */
  materialCodeOptions: string[][];

  /** Código único por capa. Vacío cuando la capa es FAMILY o UNRESOLVED. */
  materialCodes: string[];
  materialNames: string[];

  status: StructureCombinationStatus;
  canApply: boolean;
  pendingReason: string;
}

export interface RankedStructureCombination {
  combination: StructureCombinationOption;
  similarity: number;
  isCompatible: boolean;
  isExact: boolean;
}

const MATRIX_CODE_BY_TYPE: Record<
  ProductStructureType,
  StructureMatrixCode
> = {
  Monocapa: "MC-004",
  Bilaminado: "MC-005",
  Trilaminado: "MC-006",
  Tetralaminado: "MC-007",
  "": "MC-004",
};

const COMBINATION_PREFIX_BY_TYPE: Record<
  ProductStructureType,
  string
> = {
  Monocapa: "EST-MONO",
  Bilaminado: "EST-BILA",
  Trilaminado: "EST-TRIL",
  Tetralaminado: "EST-TETRA",
  "": "EST-UNKNOWN",
};

const normalizeSearchText = (value: unknown): string =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const unique = <T,>(values: T[]): T[] => Array.from(new Set(values));

function getMaterialNames(codes: string[]): string[] {
  return unique(
    codes
      .map((code) => findMaterialLayerByCode(code)?.TbMatCapNom ?? "")
      .filter(Boolean),
  );
}

function buildPendingReason(params: {
  layerLabel: string;
  materialNames: string[];
}): string {
  const { layerLabel, materialNames } = params;

  if (materialNames.length > 1) {
    const variants = ` (${materialNames.join(" / ")})`;
    return `${layerLabel}: definir variante oficial${variants}.`;
  }

  return "";
}

function buildCombination(
  structureType: ProductStructureType,
  layerLabels: string[],
  index: number,
): StructureCombinationOption {
  // materialCodeOptions: cada capa contiene exactamente un código de la matriz
  const materialCodeOptions: string[][] = layerLabels.map((code) => [code]);

  const materialCodes = materialCodeOptions.map((codes) =>
    codes.length === 1 ? codes[0] : "",
  );

  const materialNames = materialCodeOptions.map((codes, layerIndex) => {
    const names = getMaterialNames(codes);
    return names.length > 0 ? names.join(" / ") : layerLabels[layerIndex];
  });

  const pendingReasons = layerLabels
    .map((layerLabel, layerIndex) =>
      buildPendingReason({
        layerLabel,
        materialNames: getMaterialNames(materialCodeOptions[layerIndex]),
      }),
    )
    .filter(Boolean);

  const isResolved = materialCodeOptions.every((codes) => codes.length === 1);

  return {
    id: `${COMBINATION_PREFIX_BY_TYPE[structureType]}-${String(
      index + 1,
    ).padStart(3, "0")}`,
    structureType,
    matrixCode: MATRIX_CODE_BY_TYPE[structureType],
    layerCount: getStructureLayerCount(structureType),
    layerLabels: [...layerLabels],
    sequenceLabel: layerLabels.join(" → "),
    materialCodeOptions,
    materialCodes,
    materialNames,
    status: isResolved ? "VALIDADA" : "PENDIENTE_NEGOCIO",
    canApply: isResolved && materialCodes.every(Boolean),
    pendingReason: pendingReasons.join(" "),
  };
}

export function getStructureCombinationsByType(
  structureType: ProductStructureType,
): StructureCombinationOption[] {
  if (!structureType) return [];

  const matrixSet = PRODUCT_STRUCTURE_MATRIX[structureType];
  if (!matrixSet) return [];

  return Array.from(matrixSet).map((row, index) =>
    buildCombination(structureType, row.split("|").filter(Boolean), index),
  );
}

export function getValidatedStructureCombinationsByType(
  structureType: ProductStructureType,
): StructureCombinationOption[] {
  return getStructureCombinationsByType(structureType).filter(
    (combination) => combination.status === "VALIDADA",
  );
}

export function getPendingBusinessCombinationsByType(
  structureType: ProductStructureType,
): StructureCombinationOption[] {
  return getStructureCombinationsByType(structureType).filter(
    (combination) => combination.status === "PENDIENTE_NEGOCIO",
  );
}

function getExpectedSelectedCodes(
  structureType: ProductStructureType,
  selectedMaterialCodes: string[],
): string[] {
  const layerCount = getStructureLayerCount(structureType);
  return Array.from({ length: layerCount }).map(
    (_, index) => selectedMaterialCodes[index] ?? "",
  );
}

function candidateAcceptsCode(
  combination: StructureCombinationOption,
  layerIndex: number,
  selectedCode: string,
): boolean {
  if (!selectedCode) return true;
  return combination.materialCodeOptions[layerIndex]?.includes(selectedCode);
}

export function isCompatibleStructureCombination(params: {
  combination: StructureCombinationOption;
  selectedMaterialCodes: string[];
}): boolean {
  const { combination, selectedMaterialCodes } = params;
  const selected = getExpectedSelectedCodes(
    combination.structureType,
    selectedMaterialCodes,
  );

  return selected.every((selectedCode, layerIndex) =>
    candidateAcceptsCode(combination, layerIndex, selectedCode),
  );
}

export function isExactStructureCombination(params: {
  combination: StructureCombinationOption;
  selectedMaterialCodes: string[];
}): boolean {
  const { combination, selectedMaterialCodes } = params;
  const selected = getExpectedSelectedCodes(
    combination.structureType,
    selectedMaterialCodes,
  );

  return (
    selected.length === combination.layerCount &&
    selected.every(Boolean) &&
    selected.every((selectedCode, layerIndex) =>
      candidateAcceptsCode(combination, layerIndex, selectedCode),
    )
  );
}

export function calculateStructureSimilarity(params: {
  combination: StructureCombinationOption;
  selectedMaterialCodes: string[];
}): number {
  const { combination, selectedMaterialCodes } = params;
  const selected = getExpectedSelectedCodes(
    combination.structureType,
    selectedMaterialCodes,
  );

  if (combination.layerCount === 0) return 0;

  const positionalMatches = selected.reduce((matches, selectedCode, index) => {
    if (!selectedCode) return matches;

    return candidateAcceptsCode(combination, index, selectedCode)
      ? matches + 1
      : matches;
  }, 0);

  return Math.round((positionalMatches / combination.layerCount) * 100);
}

export function findExactStructureCombination(params: {
  structureType: ProductStructureType;
  selectedMaterialCodes: string[];
}): StructureCombinationOption | null {
  const { structureType, selectedMaterialCodes } = params;

  return (
    getStructureCombinationsByType(structureType).find((combination) =>
      isExactStructureCombination({
        combination,
        selectedMaterialCodes,
      }),
    ) ?? null
  );
}

export function findCompatibleStructureCombinations(params: {
  structureType: ProductStructureType;
  selectedMaterialCodes: string[];
}): StructureCombinationOption[] {
  const { structureType, selectedMaterialCodes } = params;

  return getStructureCombinationsByType(structureType).filter((combination) =>
    isCompatibleStructureCombination({
      combination,
      selectedMaterialCodes,
    }),
  );
}

export function rankStructureCombinations(params: {
  structureType: ProductStructureType;
  selectedMaterialCodes: string[];
}): RankedStructureCombination[] {
  const { structureType, selectedMaterialCodes } = params;

  return getStructureCombinationsByType(structureType)
    .map((combination) => ({
      combination,
      similarity: calculateStructureSimilarity({
        combination,
        selectedMaterialCodes,
      }),
      isCompatible: isCompatibleStructureCombination({
        combination,
        selectedMaterialCodes,
      }),
      isExact: isExactStructureCombination({
        combination,
        selectedMaterialCodes,
      }),
    }))
    .sort((left, right) => {
      if (left.isExact !== right.isExact) {
        return Number(right.isExact) - Number(left.isExact);
      }

      if (left.isCompatible !== right.isCompatible) {
        return Number(right.isCompatible) - Number(left.isCompatible);
      }

      if (left.similarity !== right.similarity) {
        return right.similarity - left.similarity;
      }

      if (left.combination.status !== right.combination.status) {
        return left.combination.status === "VALIDADA" ? -1 : 1;
      }

      return left.combination.sequenceLabel.localeCompare(
        right.combination.sequenceLabel,
        "es",
      );
    });
}

export function structureCombinationMatchesSearch(
  combination: StructureCombinationOption,
  searchTerm: string,
): boolean {
  const search = normalizeSearchText(searchTerm);
  if (!search) return true;

  const searchable = normalizeSearchText(
    [
      combination.id,
      combination.matrixCode,
      combination.sequenceLabel,
      combination.materialCodes.join(" "),
      combination.materialNames.join(" "),
      combination.pendingReason,
    ].join(" "),
  );

  return searchable.includes(search);
}