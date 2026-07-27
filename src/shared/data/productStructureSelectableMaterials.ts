import {
  getAllMaterialLayerOptions,
  type MaterialLayerOption,
} from "./productMaterialCatalog";
import {
  PRODUCT_STRUCTURE_MATRIX,
  getStructureLayerCount,
  type ProductStructureType,
} from "./productStructureMatrix";

export interface StructureMaterialAvailabilityOption
  extends MaterialLayerOption {
  disabled: boolean;
  availability:
    | "DISPONIBLE"
    | "NO_DISPONIBLE";
  reason: string;
}

const normalizeCode = (value: unknown): string =>
  String(value ?? "").trim().toUpperCase();

const isValidatedStructureRow = (
  matrixLabels: string[],
): boolean =>
  matrixLabels.every((code) => Boolean(code && code.trim()));

const rowMatchesSelectedPrefix = (
  matrixLabels: string[],
  selectedMaterialCodes: string[],
  prefixLength: number,
): boolean =>
  matrixLabels.slice(0, prefixLength).every(
    (code, index) =>
      normalizeCode(code) ===
      normalizeCode(selectedMaterialCodes[index]),
  );

export function getValidatedStructureRows(
  structureType: ProductStructureType,
): string[][] {
  if (!structureType) return [];

  const matrixSet = PRODUCT_STRUCTURE_MATRIX[structureType];
  if (!matrixSet) return [];

  return Array.from(matrixSet)
    .map((row) => row.split("|").filter(Boolean))
    .filter(isValidatedStructureRow);
}

/**
 * Devuelve todos los materiales del catálogo para que sean
 * visibles en el desplegable.
 *
 * - disabled=false: disponible para la secuencia actual.
 * - disabled=true: visible en gris y no seleccionable.
 *
 * Solo se habilitan materiales pertenecientes a estructuras
 * completamente RESUELTAS/HOMOLOGADAS.
 */
export function getMaterialAvailabilityForLayer(params: {
  structureType: ProductStructureType;
  layerIndex: number;
  selectedMaterialCodes: string[];
}): StructureMaterialAvailabilityOption[] {
  const {
    structureType,
    layerIndex,
    selectedMaterialCodes,
  } = params;

  const layerCount =
    getStructureLayerCount(structureType);

  if (
    !structureType ||
    layerIndex < 0 ||
    layerIndex >= layerCount
  ) {
    return [];
  }

  const validatedRows =
    getValidatedStructureRows(structureType);

  const codesUsedInLayer = new Set(
    validatedRows
      .map((row) => row[layerIndex])
      .filter((code): code is string =>
        Boolean(code),
      )
      .map(normalizeCode),
  );

  const compatibleRows = validatedRows.filter(
    (row) =>
      rowMatchesSelectedPrefix(
        row,
        selectedMaterialCodes,
        layerIndex,
      ),
  );

  const availableCodes = new Set(
    compatibleRows
      .map((row) => row[layerIndex])
      .filter((code): code is string =>
        Boolean(code),
      )
      .map(normalizeCode),
  );

  return getAllMaterialLayerOptions()
    .filter((material) => {
      // Only show materials that are used in validated structures for this layer
      const code = normalizeCode(material.value);
      return codesUsedInLayer.has(code);
    })
    .map((material) => {
      const code = normalizeCode(material.value);
      const isAvailable =
        availableCodes.has(code);

      return {
        ...material,
        disabled: !isAvailable,
        availability: isAvailable
          ? "DISPONIBLE"
          : "NO_DISPONIBLE",
        reason: isAvailable
          ? "Disponible para la secuencia seleccionada."
          : "No disponible para la secuencia actual.",
      } satisfies StructureMaterialAvailabilityOption;
    })
    .sort((left, right) => {
      if (left.disabled !== right.disabled) {
        return left.disabled ? 1 : -1;
      }

      if ((left.sortOrder || 0) !== (right.sortOrder || 0)) {
        return (left.sortOrder || 0) - (right.sortOrder || 0);
      }

      return left.label.localeCompare(
        right.label,
        "es",
        {
          sensitivity: "base",
          numeric: true,
        },
      );
    });
}

export function isValidatedStructureByCodes(params: {
  structureType: ProductStructureType;
  selectedMaterialCodes: string[];
}): boolean {
  const {
    structureType,
    selectedMaterialCodes,
  } = params;

  const layerCount =
    getStructureLayerCount(structureType);

  if (
    !structureType ||
    selectedMaterialCodes.length < layerCount ||
    selectedMaterialCodes
      .slice(0, layerCount)
      .some((code) => !code)
  ) {
    return false;
  }

  return getValidatedStructureRows(
    structureType,
  ).some((row) =>
    row.every(
      (code, index) =>
        normalizeCode(code) ===
        normalizeCode(
          selectedMaterialCodes[index],
        ),
    ),
  );
}

export function getValidatedStructureCount(
  structureType: ProductStructureType,
): number {
  return getValidatedStructureRows(
    structureType,
  ).length;
}
