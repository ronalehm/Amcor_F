import {
  buildLayerTechnicalSnapshot,
  findMicronRecordsForValue,
  getMicronFrontendControl,
  getMicronRecordByCode,
  parseCatalogNumber,
  resolveMaterialLayer,
} from "../data/productMaterialCatalog";
import {
  getStructureLayerCount,
  isRegisteredProductStructureByCodes,
} from "../data/productStructureMatrix";
import type {
  ProductStructureLayerValue,
  ProductStructureValidationError,
  ProductStructureValidationResult,
  ProductStructureValue,
} from "../types/productStructure.types";

export function normalizeProductStructureValue(
  value: ProductStructureValue,
): ProductStructureValue {
  const expectedLayerCount = getStructureLayerCount(value.structureType);

  return {
    structureType: value.structureType,
    layers: Array.from({ length: expectedLayerCount }).map((_, index) => ({
      materialCode: value.layers[index]?.materialCode ?? "",
      micronRuleCode: value.layers[index]?.micronRuleCode ?? "",
      micronValue: value.layers[index]?.micronValue ?? "",
    })),
  };
}

function resolveMicronRuleCode(
  layer: ProductStructureLayerValue,
): string {
  if (layer.micronRuleCode) {
    return layer.micronRuleCode;
  }

  const matches = findMicronRecordsForValue({
    materialValue: layer.materialCode,
    micronValue: layer.micronValue,
  });

  return matches.length === 1 ? matches[0].TbMatMicCod : "";
}

export function validateProductStructureValue(
  rawValue: ProductStructureValue,
): ProductStructureValidationResult {
  const normalizedValue = normalizeProductStructureValue(rawValue);
  const expectedLayerCount = getStructureLayerCount(
    normalizedValue.structureType,
  );
  const errors: ProductStructureValidationError[] = [];

  if (!normalizedValue.structureType) {
    errors.push({
      field: "structureType",
      message: "Selecciona el tipo de estructura.",
    });
  }

  const selectedMaterialCodes = normalizedValue.layers.map(
    (layer) => layer.materialCode,
  );

  const isStructureComplete =
    expectedLayerCount > 0 &&
    normalizedValue.layers.length === expectedLayerCount &&
    selectedMaterialCodes.every(Boolean);

  if (
    normalizedValue.structureType &&
    !isStructureComplete
  ) {
    errors.push({
      field: "structure",
      message:
        "Completa todos los materiales requeridos por el tipo de estructura.",
    });
  }

  const isStructureRegistered =
    isStructureComplete &&
    isRegisteredProductStructureByCodes({
      structureType: normalizedValue.structureType,
      selectedMaterialCodes,
    });

  if (isStructureComplete && !isStructureRegistered) {
    errors.push({
      field: "structure",
      message:
        "La combinación seleccionada no está registrada o contiene etiquetas pendientes de homologación.",
    });
  }

  const snapshots = normalizedValue.layers.map((layer, index) => {
    const layerNumber = index + 1;
    const material = resolveMaterialLayer(layer.materialCode);

    if (!layer.materialCode) {
      errors.push({
        field: "material",
        layerNumber,
        message: `Selecciona el material de la CAPA ${layerNumber}.`,
      });

      return buildLayerTechnicalSnapshot({
        materialValue: "",
        micronValue: "",
      });
    }

    if (!material) {
      errors.push({
        field: "material",
        layerNumber,
        message:
          `El material de la CAPA ${layerNumber} no existe en TABMATCAPAODISEO.`,
      });
    }

    const micronControl = getMicronFrontendControl(layer.materialCode);

    if (micronControl.mode === "NONE") {
      errors.push({
        field: "micron",
        layerNumber,
        message: micronControl.message,
      });

      return buildLayerTechnicalSnapshot({
        materialValue: layer.materialCode,
        micronValue: layer.micronValue,
        micronRuleCode: layer.micronRuleCode,
      });
    }

    if (!layer.micronValue) {
      errors.push({
        field: "micron",
        layerNumber,
        message: `Selecciona o ingresa el micraje de la CAPA ${layerNumber}.`,
      });
    }

    const micronRuleCode = resolveMicronRuleCode(layer);

    if (
      micronControl.mode === "VALOR" &&
      layer.micronValue &&
      !micronRuleCode
    ) {
      const matches = findMicronRecordsForValue({
        materialValue: layer.materialCode,
        micronValue: layer.micronValue,
      });

      errors.push({
        field: "micron",
        layerNumber,
        message:
          matches.length > 1
            ? `El micraje de la CAPA ${layerNumber} tiene más de una especificación técnica. Selecciona la variante correspondiente.`
            : `El micraje de la CAPA ${layerNumber} no está permitido para el material seleccionado.`,
      });
    }

    if (
      micronControl.mode === "RANGO" &&
      layer.micronValue
    ) {
      const micron = parseCatalogNumber(layer.micronValue);
      const offset =
        micron === null
          ? Number.NaN
          : (micron - micronControl.minValue) /
            micronControl.stepValue;
      const respectsStep =
        Number.isFinite(offset) &&
        Math.abs(offset - Math.round(offset)) < 0.000001;

      if (
        micron === null ||
        micron < micronControl.minValue ||
        micron > micronControl.maxValue ||
        !respectsStep
      ) {
        errors.push({
          field: "micron",
          layerNumber,
          message:
            `El micraje de la CAPA ${layerNumber} debe estar entre ` +
            `${micronControl.minValue} y ${micronControl.maxValue} µm ` +
            `en incrementos de ${micronControl.stepValue} µm.`,
        });
      }
    }

    const snapshot = buildLayerTechnicalSnapshot({
      materialValue: layer.materialCode,
      micronValue: layer.micronValue,
      micronRuleCode:
        micronControl.mode === "RANGO"
          ? micronControl.code
          : micronRuleCode,
    });

    if (
      layer.micronValue &&
      !snapshot.micronId
    ) {
      errors.push({
        field: "micron",
        layerNumber,
        message:
          `No se pudo resolver la regla de micraje de la CAPA ${layerNumber}.`,
      });
    }

    if (
      snapshot.micronId &&
      snapshot.density === null
    ) {
      errors.push({
        field: "density",
        layerNumber,
        message:
          `La regla de la CAPA ${layerNumber} no tiene densidad configurada.`,
      });
    }

    if (
      snapshot.micronId &&
      snapshot.density !== null &&
      !snapshot.grammage
    ) {
      errors.push({
        field: "grammage",
        layerNumber,
        message:
          `No se pudo calcular el gramaje de la CAPA ${layerNumber}.`,
      });
    }

    return snapshot;
  });

  const areLayersTechnicallyValid =
    expectedLayerCount > 0 &&
    snapshots.length === expectedLayerCount &&
    snapshots.every(
      (snapshot) =>
        Boolean(snapshot.materialId) &&
        Boolean(snapshot.micronId) &&
        Boolean(snapshot.micronValue) &&
        snapshot.density !== null &&
        Boolean(snapshot.grammage),
    );

  return {
    expectedLayerCount,
    isStructureComplete,
    isStructureRegistered,
    areLayersTechnicallyValid,
    canSave:
      Boolean(normalizedValue.structureType) &&
      isStructureComplete &&
      isStructureRegistered &&
      areLayersTechnicallyValid &&
      errors.length === 0,
    snapshots,
    normalizedValue: {
      ...normalizedValue,
      layers: normalizedValue.layers.map((layer) => {
        const control = getMicronFrontendControl(layer.materialCode);

        return {
          ...layer,
          micronRuleCode:
            control.mode === "RANGO"
              ? control.code
              : resolveMicronRuleCode(layer),
        };
      }),
    },
    errors,
  };
}

export function getFirstStructureError(
  result: ProductStructureValidationResult,
): string {
  return result.errors[0]?.message ?? "";
}

export function getLayerStructureError(
  result: ProductStructureValidationResult,
  layerNumber: number,
): string {
  return (
    result.errors.find(
      (error) => error.layerNumber === layerNumber,
    )?.message ?? ""
  );
}

export function getValidatedMicronRecord(
  layer: ProductStructureLayerValue,
) {
  return layer.micronRuleCode
    ? getMicronRecordByCode(layer.micronRuleCode)
    : null;
}
