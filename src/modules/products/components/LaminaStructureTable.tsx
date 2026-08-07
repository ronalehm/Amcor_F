import { useMemo } from "react";
import type { ProjectEditFormData } from "../pages/ProductEditPage";
import { resolveMaterialLayer, getMicronRecordsByMaterial } from "../../../shared/data/productMaterialCatalog";

interface LaminaStructureTableProps {
  structureType: string;
  layer1Material: string;
  layer1Micron: string;
  layer1Grammage: string;
  layer2Material: string;
  layer2Micron: string;
  layer2Grammage: string;
  layer3Material: string;
  layer3Micron: string;
  layer3Grammage: string;
  layer4Material: string;
  layer4Micron: string;
  layer4Grammage: string;
  printClass: string;
  hasMatteFinishVarnish: boolean;
  hasInkProtectionVarnish: boolean;
  grammage: string;
  grammageTolerance: string;
}

type StructureRow = {
  id: string;
  item: number | string;
  type: "varnish" | "material" | "ink";
  description: string;
  micron: string;
  grammage: number;
};

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

function buildLaminaStructureRows({
  structureType,
  layer1Material,
  layer1Micron,
  layer1Grammage,
  layer2Material,
  layer2Micron,
  layer2Grammage,
  layer3Material,
  layer3Micron,
  layer3Grammage,
  layer4Material,
  layer4Micron,
  layer4Grammage,
  printClass,
  hasMatteFinishVarnish,
  hasInkProtectionVarnish,
}: {
  structureType: string;
  layer1Material: string;
  layer1Micron: string;
  layer1Grammage: string;
  layer2Material: string;
  layer2Micron: string;
  layer2Grammage: string;
  layer3Material: string;
  layer3Micron: string;
  layer3Grammage: string;
  layer4Material: string;
  layer4Micron: string;
  layer4Grammage: string;
  printClass: string;
  hasMatteFinishVarnish: boolean;
  hasInkProtectionVarnish: boolean;
}): StructureRow[] {
  const rows: StructureRow[] = [];
  let itemNumber = 0;

  // Barniz de protección (solo para Monocapa)
  if (structureType === "Monocapa" && hasInkProtectionVarnish) {
    rows.push({
      id: "varnish-protection",
      item: "0",
      type: "varnish",
      description: "Barniz protección tinta",
      micron: "—",
      grammage: 0.5,
    });
    itemNumber++;
  }

  // Capas de material según structureType
  const layerCount = getLayerCountByStructureType(structureType);
  const materials = [
    { material: layer1Material, micron: layer1Micron, grammage: layer1Grammage },
    { material: layer2Material, micron: layer2Micron, grammage: layer2Grammage },
    { material: layer3Material, micron: layer3Micron, grammage: layer3Grammage },
    { material: layer4Material, micron: layer4Micron, grammage: layer4Grammage },
  ];

  for (let i = 0; i < layerCount; i++) {
    const { material, micron, grammage } = materials[i];
    if (material) {
      const resolvedMaterial = resolveMaterialLayer(material);
      const materialName = resolvedMaterial?.TbMatCapNom || material;

      let grammageNum = parseFloat(grammage) || 0;
      if (grammageNum === 0 && material && micron) {
        grammageNum = getGrammageFromCatalog(material, micron);
      }

      rows.push({
        id: `material-${i + 1}`,
        item: itemNumber + 1,
        type: "material",
        description: materialName,
        micron: micron ? `${micron} µm` : "—",
        grammage: grammageNum,
      });
      itemNumber++;
    }
  }

  // Barniz acabado mate
  if (hasMatteFinishVarnish) {
    rows.push({
      id: "varnish-matte",
      item: itemNumber + 1,
      type: "varnish",
      description: "Barniz acabado mate",
      micron: "—",
      grammage: 0.5, // Por ahora fijo, debería venir del catálogo
    });
    itemNumber++;
  }

  // Tinta (automática si hay impresión)
  const hasPrinting = printClass && printClass !== "Sin impresión" && printClass.trim() !== "";
  if (hasPrinting) {
    rows.push({
      id: "ink",
      item: itemNumber + 1,
      type: "ink",
      description: "Tinta",
      micron: "—",
      grammage: 2.5,
    });
    itemNumber++;
  }

  return rows;
};

export default function LaminaStructureTable({
  structureType,
  layer1Material,
  layer1Micron,
  layer1Grammage,
  layer2Material,
  layer2Micron,
  layer2Grammage,
  layer3Material,
  layer3Micron,
  layer3Grammage,
  layer4Material,
  layer4Micron,
  layer4Grammage,
  printClass,
  hasMatteFinishVarnish,
  hasInkProtectionVarnish,
  grammage,
  grammageTolerance,
}: LaminaStructureTableProps) {
  const rows = useMemo(
    () =>
      buildLaminaStructureRows({
        structureType,
        layer1Material,
        layer1Micron,
        layer1Grammage,
        layer2Material,
        layer2Micron,
        layer2Grammage,
        layer3Material,
        layer3Micron,
        layer3Grammage,
        layer4Material,
        layer4Micron,
        layer4Grammage,
        printClass,
        hasMatteFinishVarnish,
        hasInkProtectionVarnish,
      }),
    [
      structureType,
      layer1Material,
      layer1Micron,
      layer1Grammage,
      layer2Material,
      layer2Micron,
      layer2Grammage,
      layer3Material,
      layer3Micron,
      layer3Grammage,
      layer4Material,
      layer4Micron,
      layer4Grammage,
      printClass,
      hasMatteFinishVarnish,
      hasInkProtectionVarnish,
    ]
  );

  const totalGrammage = useMemo(
    () => rows.reduce((sum, row) => sum + row.grammage, 0),
    [rows]
  );

  const tolerance = useMemo(
    () => totalGrammage * 0.1,
    [totalGrammage]
  );

  // Get printing surface (last material, not ink or varnish)
  const materialRows = rows.filter((row) => row.type === "material");
  const printingSurface =
    materialRows.length > 0
      ? materialRows[materialRows.length - 1].description
      : null;

  const hasPrinting =
    printClass === "Flexo" || printClass === "Huecograbado";

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
      return String(num);
    }
    return num.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
  };

  return (
    <div className="space-y-4">
      {/* Structure table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-900 text-white">
              <th className="px-4 py-3 text-left font-semibold">Ítem</th>
              <th className="px-4 py-3 text-left font-semibold">Descripción del material</th>
              <th className="px-4 py-3 text-left font-semibold">Micraje</th>
              <th className="px-4 py-3 text-right font-semibold">Gramaje (g/m²)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              let bgColor = "bg-white";
              if (row.type === "ink") bgColor = "bg-purple-50";
              if (row.type === "varnish") bgColor = "bg-blue-50";

              return (
                <tr key={row.id} className={`border-b border-slate-100 ${bgColor}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.item}</td>
                  <td className="px-4 py-3 text-slate-700">{row.description}</td>
                  <td className="px-4 py-3 text-slate-600">{row.micron}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-medium">
                    {formatNumber(row.grammage)}
                  </td>
                </tr>
              );
            })}
            {/* Total row */}
            <tr className="bg-slate-100 font-semibold">
              <td colSpan={3} className="px-4 py-3 text-right text-slate-900">
                Gramaje total
              </td>
              <td className="px-4 py-3 text-right text-slate-900">
                {formatNumber(totalGrammage)} g/m²
              </td>
            </tr>
            {/* Tolerance row */}
            <tr className="bg-slate-50">
              <td colSpan={3} className="px-4 py-3 text-right text-slate-700">
                Tolerancia ±10 %
              </td>
              <td className="px-4 py-3 text-right text-slate-700">
                ±{formatNumber(tolerance)} g/m²
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Printing surface */}
      {hasPrinting && printingSurface && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
            Superficie a imprimir
          </p>
          <p className="text-sm font-semibold text-slate-900">{printingSurface}</p>
        </div>
      )}

      {!hasPrinting && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
            Superficie a imprimir
          </p>
          <p className="text-sm text-slate-600">
            No aplica — producto sin impresión
          </p>
        </div>
      )}
    </div>
  );
}
