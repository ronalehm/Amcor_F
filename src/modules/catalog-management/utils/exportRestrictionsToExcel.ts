import * as XLSX from "xlsx";
import {
  getDimensionRestrictions,
  getValidationRestrictions,
} from "../../../shared/data/restrictionCatalogsStorage";
import type {
  DimensionRestrictionCatalog,
  ValidationRestrictionCatalog,
} from "../../../shared/data/restrictionCatalogs";

export interface DimensionRestrictionRow {
  Categoría: string;
  Envoltura: string;
  Código: string;
  "Nombre Restricción": string;
  Formato: string;
  "Ancho (min-max)": string;
  "Largo (min-max)": string;
  "Ancho Fuelle (min-max)": string;
  Perímetro: string;
  Repetición: string;
  "Diseño Ancho (min-max)": string;
  "Diseño Altura (min-max)": string;
  "Separación Púas (min-max)": string;
  "Distancia Lado Pouch (min-max)": string;
  "Wicket Diámetro (min-max)": string;
  "Ancho Sello (min-max)": string;
  Estado: string;
  Descripción: string;
}

export interface ValidationRestrictionRow {
  Categoría: string;
  Envoltura: string;
  Código: string;
  "Nombre Restricción": string;
  "Campo Origen": string;
  "Valor Origen": string;
  "Campo Dependiente": string;
  "Valores Permitidos": string;
  Estado: string;
  Descripción: string;
}

export function exportRestrictionsToExcel(): void {
  const dimensionRestrictions = getDimensionRestrictions();
  const validationRestrictions = getValidationRestrictions();

  // Procesar restricciones de dimensión
  const dimensionRows: DimensionRestrictionRow[] = dimensionRestrictions.map(
    (restriction) => ({
      Categoría: "Dimensiones",
      Envoltura: getEnvolturaLabel(restriction.productType),
      Código: restriction.code,
      "Nombre Restricción": restriction.name,
      Formato: restriction.formatPlan || "-",
      "Ancho (min-max)": restriction.ancho
        ? `${restriction.ancho.min}-${restriction.ancho.max}`
        : "-",
      "Largo (min-max)": restriction.largo
        ? `${restriction.largo.min}-${restriction.largo.max}`
        : "-",
      "Ancho Fuelle (min-max)": restriction.anchoFuelle
        ? `${restriction.anchoFuelle.min}-${restriction.anchoFuelle.max}`
        : "-",
      Perímetro: restriction.perimetro
        ? `${restriction.perimetro.min}-${restriction.perimetro.max}`
        : "-",
      Repetición: restriction.repeticion
        ? `${restriction.repeticion.min}-${restriction.repeticion.max}`
        : "-",
      "Diseño Ancho (min-max)": restriction.designAreaWidth
        ? `${restriction.designAreaWidth.min}-${restriction.designAreaWidth.max}`
        : "-",
      "Diseño Altura (min-max)": restriction.designAreaHeight
        ? `${restriction.designAreaHeight.min}-${restriction.designAreaHeight.max}`
        : "-",
      "Separación Púas (min-max)": restriction.separacionPuas
        ? `${restriction.separacionPuas.min}-${restriction.separacionPuas.max}`
        : "-",
      "Distancia Lado Pouch (min-max)": restriction.distanciaLadoPouch
        ? `${restriction.distanciaLadoPouch.min}-${restriction.distanciaLadoPouch.max}`
        : "-",
      "Wicket Diámetro (min-max)": restriction.wicketDiameter
        ? `${restriction.wicketDiameter.min}-${restriction.wicketDiameter.max}`
        : "-",
      "Ancho Sello (min-max)": restriction.anchoSello
        ? `${restriction.anchoSello.min}-${restriction.anchoSello.max}`
        : "-",
      Estado: restriction.status,
      Descripción: "",
    })
  );

  // Procesar restricciones de validación
  const validationRows: ValidationRestrictionRow[] = validationRestrictions.map(
    (restriction) => ({
      Categoría: "Validación",
      Envoltura: getEnvolturaLabel(restriction.productType),
      Código: restriction.code,
      "Nombre Restricción": restriction.name,
      "Campo Origen": restriction.sourceField,
      "Valor Origen": restriction.sourceValue,
      "Campo Dependiente": restriction.dependentField,
      "Valores Permitidos": restriction.allowedValues.join(", "),
      Estado: restriction.status,
      Descripción: restriction.description || "",
    })
  );

  // Crear workbook
  const wb = XLSX.utils.book_new();

  // Agregar sheet de dimensiones
  const wsD = XLSX.utils.json_to_sheet(dimensionRows);
  XLSX.utils.book_append_sheet(wb, wsD, "Restricciones Dimensión");
  autoSizeColumns(wsD, dimensionRows);

  // Agregar sheet de validaciones
  const wsV = XLSX.utils.json_to_sheet(validationRows);
  XLSX.utils.book_append_sheet(wb, wsV, "Restricciones Validación");
  autoSizeColumns(wsV, validationRows);

  // Agregar resumen
  const summaryData = [
    ["Resumen de Restricciones"],
    [],
    ["Categoría", "Envoltura", "Cantidad"],
    ...generateSummary(dimensionRestrictions, validationRestrictions),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

  // Descargar
  const fileName = `Restricciones_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

function getEnvolturaLabel(productType: string): string {
  switch (productType) {
    case "LAMINA":
      return "LÁMINA";
    case "BOLSA":
      return "BOLSA";
    case "POUCH":
      return "POUCH";
    default:
      return productType;
  }
}

function generateSummary(
  dimensionRestrictions: DimensionRestrictionCatalog[],
  validationRestrictions: ValidationRestrictionCatalog[]
): (string | number)[][] {
  const summary: (string | number)[][] = [];

  const envolturas = ["LAMINA", "BOLSA", "POUCH"];

  for (const envoltura of envolturas) {
    const dimCount = dimensionRestrictions.filter(
      (r) => r.productType === envoltura
    ).length;
    const valCount = validationRestrictions.filter(
      (r) => r.productType === envoltura
    ).length;

    summary.push([
      "Dimensiones",
      getEnvolturaLabel(envoltura),
      dimCount,
    ]);
  }

  for (const envoltura of envolturas) {
    const valCount = validationRestrictions.filter(
      (r) => r.productType === envoltura
    ).length;

    if (valCount > 0) {
      summary.push([
        "Validación",
        getEnvolturaLabel(envoltura),
        valCount,
      ]);
    }
  }

  summary.push(
    [],
    [
      "Total Dimensiones",
      "",
      dimensionRestrictions.length,
    ],
    [
      "Total Validaciones",
      "",
      validationRestrictions.length,
    ],
    [
      "Total Restricciones",
      "",
      dimensionRestrictions.length + validationRestrictions.length,
    ]
  );

  return summary;
}

function autoSizeColumns(
  ws: XLSX.WorkSheet,
  data: any[]
): void {
  if (data.length === 0) return;

  const colWidths = Object.keys(data[0]).map((key) => ({
    wch: Math.max(
      key.length,
      Math.max(
        ...data.map(
          (row) => String(row[key] || "").length
        )
      )
    ),
  }));

  ws["!cols"] = colWidths;
}
