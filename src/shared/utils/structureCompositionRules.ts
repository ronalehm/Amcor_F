import { resolveMaterialLayer, getMicronRecordsByMaterial } from "../data/productMaterialCatalog";

export type StructureRowType = "varnish" | "material" | "ink" | "adhesive";

export interface StructureRow {
  id: string;
  layerNumber: number | string;
  type: StructureRowType;
  description: string;
  micron: string;
  grammage: number;
}

interface LayerData {
  material: string;
  micron: string;
  grammage: string;
}

interface StructureCompositionParams {
  structureType: string;
  layers: LayerData[];
  printClass: string;
  hasMatteFinishVarnish: boolean;
  hasInkProtectionVarnish: boolean;
  visibleLayerCount?: number;
}

function getGrammageFromCatalog(material: string, micron: string): number {
  if (!material || !micron) return 0;

  const micronRecords = getMicronRecordsByMaterial(material);
  const micronValue = parseFloat(micron);

  const matchingRecord = micronRecords.find(record => {
    const recordMicron = parseFloat(String(record.TbMatMicVal || 0));
    return recordMicron === micronValue;
  });

  if (matchingRecord && matchingRecord.TbMatMicGram) {
    return parseFloat(String(matchingRecord.TbMatMicGram));
  }

  return 0;
}

function getLayerCountByStructureType(structureType: string): number {
  switch (structureType) {
    case "Monocapa":
      return 1;
    case "Bilaminado":
      return 2;
    case "Trilaminado":
      return 3;
    case "Tetralaminado":
      return 4;
    default:
      return 0;
  }
}

function getAdhesiveCountByStructureType(structureType: string): number {
  const layerCount = getLayerCountByStructureType(structureType);
  return Math.max(0, layerCount - 1);
}

export function buildStructureCompositionRows(params: StructureCompositionParams): StructureRow[] {
  const rows: StructureRow[] = [];
  let itemNumber = 0;

  const {
    structureType,
    layers,
    printClass,
    hasMatteFinishVarnish,
    hasInkProtectionVarnish,
    visibleLayerCount,
  } = params;

  const layerCount = getLayerCountByStructureType(structureType);
  const actualVisibleLayerCount = visibleLayerCount || layerCount;

  // 1. Barniz de protección (solo Monocapa, aparece primero si existe)
  if (structureType === "Monocapa" && hasInkProtectionVarnish) {
    rows.push({
      id: "varnish-protection",
      layerNumber: "0",
      type: "varnish",
      description: "Barniz protección tinta",
      micron: "—",
      grammage: 0.5,
    });
    itemNumber++;
  }

  // 2. Barniz mate (si aplica, antes de las capas)
  if (hasMatteFinishVarnish) {
    rows.push({
      id: "varnish-matte",
      layerNumber: itemNumber + 1,
      type: "varnish",
      description: "Barniz acabado mate",
      micron: "—",
      grammage: 0.5,
    });
    itemNumber++;
  }

  // 3. Capas de material + Adhesivos
  const hasPrinting = printClass && printClass !== "Sin impresión" && printClass.trim() !== "";

  for (let i = 0; i < actualVisibleLayerCount; i++) {
    const layerData = layers[i];

    // Agregar capa de material
    if (layerData && layerData.material) {
      const resolvedMaterial = resolveMaterialLayer(layerData.material);
      const materialName = resolvedMaterial?.TbMatCapNom || layerData.material;

      let grammageNum = parseFloat(layerData.grammage) || 0;
      if (grammageNum === 0 && layerData.material && layerData.micron) {
        grammageNum = getGrammageFromCatalog(layerData.material, layerData.micron);
      }

      rows.push({
        id: `material-${i + 1}`,
        layerNumber: itemNumber + 1,
        type: "material",
        description: materialName,
        micron: layerData.micron ? `${layerData.micron} µm` : "—",
        grammage: grammageNum,
      });
      itemNumber++;
    }

    // Agregar Tinta (después de primera capa, si aplica)
    if (i === 0 && hasPrinting) {
      rows.push({
        id: "ink",
        layerNumber: itemNumber + 1,
        type: "ink",
        description: "Tinta",
        micron: "—",
        grammage: 2.5,
      });
      itemNumber++;
    }

    // Agregar Adhesivo (entre capas, no después de la última)
    if (i < actualVisibleLayerCount - 1) {
      rows.push({
        id: `adhesive-${i + 1}`,
        layerNumber: itemNumber + 1,
        type: "adhesive",
        description: "Adhesivo",
        micron: "—",
        grammage: 2.5,
      });
      itemNumber++;
    }
  }

  return rows;
}

export function calculateStructureGrammage(rows: StructureRow[]): number {
  return rows.reduce((sum, row) => sum + row.grammage, 0);
}

export function calculateStructureGrammageWithVarnish(rows: StructureRow[]): number {
  return rows.reduce((sum, row) => sum + row.grammage, 0);
}

export function calculateTolerance(grammage: number): number {
  return grammage * 0.1;
}
