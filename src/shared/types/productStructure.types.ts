import type { LayerTechnicalSnapshot } from "../data/productMaterialCatalog";
import type { ProductStructureType } from "../data/productStructureMatrix";

export interface ProductStructureLayerValue {
  materialCode: string;
  micronRuleCode: string;
  micronValue: string;
}

export interface ProductStructureValue {
  structureType: ProductStructureType;
  layers: ProductStructureLayerValue[];
}

export interface ProductStructureValidationError {
  field:
    | "structureType"
    | "structure"
    | "material"
    | "micron"
    | "density"
    | "grammage";
  layerNumber?: number;
  message: string;
}

export interface ProductStructureValidationResult {
  expectedLayerCount: number;
  isStructureComplete: boolean;
  isStructureRegistered: boolean;
  areLayersTechnicallyValid: boolean;
  canSave: boolean;
  snapshots: LayerTechnicalSnapshot[];
  normalizedValue: ProductStructureValue;
  errors: ProductStructureValidationError[];
}

export const EMPTY_STRUCTURE_LAYER: ProductStructureLayerValue = {
  materialCode: "",
  micronRuleCode: "",
  micronValue: "",
};

export const EMPTY_PRODUCT_STRUCTURE: ProductStructureValue = {
  structureType: "",
  layers: [],
};
