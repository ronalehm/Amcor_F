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
  Formato: string;
  Código: string;
  "Nombre Restricción": string;
  // Ancho
  "Ancho Min": string;
  "Ancho Max": string;
  // Largo
  "Largo Min": string;
  "Largo Max": string;
  // Ancho Fuelle
  "Ancho Fuelle Min": string;
  "Ancho Fuelle Max": string;
  // Perímetro
  "Perímetro Min": string;
  "Perímetro Max": string;
  // Repetición
  "Repetición Min": string;
  "Repetición Max": string;
  // Diseño Ancho
  "Diseño Ancho Min": string;
  "Diseño Ancho Max": string;
  // Diseño Altura
  "Diseño Altura Min": string;
  "Diseño Altura Max": string;
  // Separación Púas
  "Separación Púas Min": string;
  "Separación Púas Max": string;
  // Distancia Lado Pouch
  "Distancia Lado Pouch Min": string;
  "Distancia Lado Pouch Max": string;
  // Wicket Diámetro
  "Wicket Diámetro Min": string;
  "Wicket Diámetro Max": string;
  // Ancho Sello
  "Ancho Sello Min": string;
  "Ancho Sello Max": string;
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
      Formato: restriction.formatPlan || "-",
      Código: restriction.code,
      "Nombre Restricción": restriction.name,
      // Ancho
      "Ancho Min": restriction.ancho ? String(restriction.ancho.min) : "-",
      "Ancho Max": restriction.ancho ? String(restriction.ancho.max) : "-",
      // Largo
      "Largo Min": restriction.largo ? String(restriction.largo.min) : "-",
      "Largo Max": restriction.largo ? String(restriction.largo.max) : "-",
      // Ancho Fuelle
      "Ancho Fuelle Min": restriction.anchoFuelle ? String(restriction.anchoFuelle.min) : "-",
      "Ancho Fuelle Max": restriction.anchoFuelle ? String(restriction.anchoFuelle.max) : "-",
      // Perímetro
      "Perímetro Min": restriction.perimetro ? String(restriction.perimetro.min) : "-",
      "Perímetro Max": restriction.perimetro ? String(restriction.perimetro.max) : "-",
      // Repetición
      "Repetición Min": restriction.repeticion ? String(restriction.repeticion.min) : "-",
      "Repetición Max": restriction.repeticion ? String(restriction.repeticion.max) : "-",
      // Diseño Ancho
      "Diseño Ancho Min": restriction.designAreaWidth ? String(restriction.designAreaWidth.min) : "-",
      "Diseño Ancho Max": restriction.designAreaWidth ? String(restriction.designAreaWidth.max) : "-",
      // Diseño Altura
      "Diseño Altura Min": restriction.designAreaHeight ? String(restriction.designAreaHeight.min) : "-",
      "Diseño Altura Max": restriction.designAreaHeight ? String(restriction.designAreaHeight.max) : "-",
      // Separación Púas
      "Separación Púas Min": restriction.separacionPuas ? String(restriction.separacionPuas.min) : "-",
      "Separación Púas Max": restriction.separacionPuas ? String(restriction.separacionPuas.max) : "-",
      // Distancia Lado Pouch
      "Distancia Lado Pouch Min": restriction.distanciaLadoPouch ? String(restriction.distanciaLadoPouch.min) : "-",
      "Distancia Lado Pouch Max": restriction.distanciaLadoPouch ? String(restriction.distanciaLadoPouch.max) : "-",
      // Wicket Diámetro
      "Wicket Diámetro Min": restriction.wicketDiameter ? String(restriction.wicketDiameter.min) : "-",
      "Wicket Diámetro Max": restriction.wicketDiameter ? String(restriction.wicketDiameter.max) : "-",
      // Ancho Sello
      "Ancho Sello Min": restriction.anchoSello ? String(restriction.anchoSello.min) : "-",
      "Ancho Sello Max": restriction.anchoSello ? String(restriction.anchoSello.max) : "-",
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
      key.length + 2,
      Math.max(
        ...data.map(
          (row) => String(row[key] || "").length
        )
      ) + 2
    ),
  }));

  ws["!cols"] = colWidths;

  // Aplicar estilos profesionales
  applyProfessionalFormatting(ws, data);
}

function applyProfessionalFormatting(
  ws: XLSX.WorkSheet,
  data: any[]
): void {
  const keys = Object.keys(data[0]);

  // Estilos para encabezados
  const headerStyle = {
    fill: { fgColor: { rgb: "1F4E78" } }, // Azul oscuro profesional
    font: { bold: true, color: { rgb: "FFFFFF" }, size: 11 },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Estilos para filas pares (zebra striping)
  const evenRowStyle = {
    fill: { fgColor: { rgb: "F2F2F2" } }, // Gris claro
    font: { size: 10 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  };

  // Estilos para filas impares
  const oddRowStyle = {
    fill: { fgColor: { rgb: "FFFFFF" } }, // Blanco
    font: { size: 10 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  };

  // Aplicar estilos a encabezados
  for (let i = 0; i < keys.length; i++) {
    const cellRef = XLSX.utils.encode_col(i) + "1";
    if (!ws[cellRef]) ws[cellRef] = { t: "s", v: keys[i] };
    ws[cellRef].s = headerStyle;
  }

  // Aplicar estilos a datos
  for (let row = 0; row < data.length; row++) {
    const rowStyle = row % 2 === 0 ? evenRowStyle : oddRowStyle;
    for (let col = 0; col < keys.length; col++) {
      const cellRef = XLSX.utils.encode_col(col) + (row + 2);
      if (ws[cellRef]) {
        ws[cellRef].s = rowStyle;
      }
    }
  }

  // Congelar fila de encabezado
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Agregar filtros automáticos
  ws["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(keys.length - 1)}${data.length + 1}` };
}
