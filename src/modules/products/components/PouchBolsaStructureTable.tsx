import { useMemo } from "react";
import type { ProjectEditFormData } from "../pages/ProductEditPage";
import { resolveMaterialLayer, getMicronRecordsByMaterial } from "../../../shared/data/productMaterialCatalog";

interface PouchBolsaStructureTableProps {
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
  visibleLayerCount: number;
  printClass: string;
}

type StructureRow = {
  id: string;
  layerNumber: number;
  description: string;
  micron: string;
  grammage: number;
};

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

function buildPouchBolsaStructureRows({
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
  visibleLayerCount,
  printClass,
}: {
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
  visibleLayerCount: number;
  printClass: string;
}): StructureRow[] {
  const rows: StructureRow[] = [];

  // Capas de material según visibleLayerCount (dinámico)
  const materials = [
    { material: layer1Material, micron: layer1Micron, grammage: layer1Grammage },
    { material: layer2Material, micron: layer2Micron, grammage: layer2Grammage },
    { material: layer3Material, micron: layer3Micron, grammage: layer3Grammage },
    { material: layer4Material, micron: layer4Micron, grammage: layer4Grammage },
  ];

  // Agregar capas dinámicas
  for (let i = 0; i < visibleLayerCount; i++) {
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
        layerNumber: i + 1,
        description: materialName,
        micron: micron ? `${micron} µm` : "—",
        grammage: grammageNum,
      });
    }
  }

  // Tinta (automática si hay impresión)
  const hasPrinting = printClass && printClass !== "Sin impresión" && printClass.trim() !== "";
  if (hasPrinting && rows.length > 0) {
    rows.push({
      id: "ink",
      layerNumber: rows.length + 1,
      description: "Tinta",
      micron: "—",
      grammage: 2.5,
    });
  }

  return rows;
}

export default function PouchBolsaStructureTable({
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
  visibleLayerCount,
  printClass,
}: PouchBolsaStructureTableProps) {
  const rows = useMemo(
    () =>
      buildPouchBolsaStructureRows({
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
        visibleLayerCount,
        printClass,
      }),
    [
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
      visibleLayerCount,
      printClass,
    ]
  );

  const totalGrammage = useMemo(
    () => {
      // Excluir tinta del total (la tinta no se cuenta en el gramaje estructural)
      return rows
        .filter(row => row.id !== "ink")
        .reduce((sum, row) => sum + row.grammage, 0);
    },
    [rows]
  );

  const tolerance = useMemo(
    () => totalGrammage * 0.1,
    [totalGrammage]
  );

  // Get printing surface (last material layer, not ink)
  const materialRows = rows.filter((row) => row.id !== "ink");
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

  // Si no hay capas, mostrar estado vacío
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-sm text-slate-600">
          Agrega capas de material usando el botón "+ Nueva capa"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Structure table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-900 text-white">
              <th className="px-4 py-3 text-left font-semibold">Capa</th>
              <th className="px-4 py-3 text-left font-semibold">Descripción del material</th>
              <th className="px-4 py-3 text-left font-semibold">Micraje</th>
              <th className="px-4 py-3 text-right font-semibold">Gramaje (g/m²)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              let bgColor = "bg-white";
              if (row.id === "ink") bgColor = "bg-purple-50";

              return (
                <tr key={row.id} className={`border-b border-slate-100 ${bgColor}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.layerNumber}</td>
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
