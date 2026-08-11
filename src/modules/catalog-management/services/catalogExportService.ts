import * as XLSX from "xlsx";
import { getCatalogs, getCatalogValues, exportCatalogToExcel } from "../../../shared/catalogs";
import { getAvailableRestrictions } from "./catalogRestrictionService";
import { exportRestrictionsToExcel } from "../utils/exportRestrictionsToExcel";
import { getDimensionRestrictions, getValidationRestrictions } from "../../../shared/data/restrictionCatalogsStorage";

export async function exportAllCatalogs(): Promise<void> {
  const catalogs = getCatalogs();
  const wb = XLSX.utils.book_new();

  // Crear una hoja por cada catálogo
  for (const catalog of catalogs) {
    const values = getCatalogValues(catalog.code);

    const data = values.map((v) => ({
      Item: v.item,
      Nombre: v.name,
      Descripción: v.description || "",
      Estado: v.status,
      "Orden": v.sortOrder,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-ajustar ancho de columnas
    ws["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 30 },
      { wch: 12 },
      { wch: 8 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, catalog.code);
  }

  // Crear una hoja de resumen
  const summaryData = catalogs.map((catalog) => {
    const values = getCatalogValues(catalog.code);
    const activeCount = values.filter((v) => v.status === "Activo").length;
    const inactiveCount = values.filter((v) => v.status === "Inactivo").length;
    const blockedCount = values.filter((v) => v.status === "Bloqueado").length;

    return {
      Catálogo: catalog.name,
      Código: catalog.code,
      Total: values.length,
      Activos: activeCount,
      Inactivos: inactiveCount,
      Bloqueados: blockedCount,
      Sistema: catalog.ownerSystem,
      Módulo: catalog.ownerModule,
    };
  });

  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs["!cols"] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 8 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, summaryWs, "Resumen");
  // Move summary sheet to the beginning
  wb.SheetNames.unshift(wb.SheetNames.pop()!);

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Catalogos_${timestamp}.xlsx`);
}

export async function exportAllRestrictions(): Promise<void> {
  const restrictions = getAvailableRestrictions();

  if (restrictions.length === 0) {
    alert("No hay restricciones disponibles para exportar");
    return;
  }

  const wb = XLSX.utils.book_new();

  const data = restrictions.map((r) => ({
    ID: r.id,
    Nombre: r.name,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [
    { wch: 20 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Restricciones");

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Restricciones_${timestamp}.xlsx`);
}

export async function exportAllData(): Promise<void> {
  const catalogs = getCatalogs();
  const wb = XLSX.utils.book_new();

  // Agregar catálogos con datos completos
  for (const catalog of catalogs) {
    const exportData = exportCatalogToExcel(catalog.code);
    const ws = XLSX.utils.json_to_sheet(exportData.data);

    // Auto-ajustar ancho de columnas
    const colWidths = Object.keys(exportData.data[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        Math.max(
          ...exportData.data.map((row) => String(row[key] || "").length)
        )
      ),
    }));
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, `CAT_${catalog.code}`);
  }

  // Agregar restricciones de dimensión
  const dimensionRestrictions = getDimensionRestrictions();
  if (dimensionRestrictions.length > 0) {
    // Usar la exportación completa de restricciones (que ya tiene las columnas correctas)
    exportRestrictionsToExcel(); // Esto descarga el archivo, pero necesitamos extraer solo los datos

    // Por ahora, agregamos un resumen básico de restricciones
    const dimensionData = dimensionRestrictions.map((r) => ({
      Categoría: "Dimensiones",
      Envoltura: getEnvolturaLabel(r.productType),
      Formato: r.formatPlan || "-",
      Código: r.code,
      "Nombre Restricción": r.name,
      Estado: r.status,
    }));

    const dimWs = XLSX.utils.json_to_sheet(dimensionData);
    XLSX.utils.book_append_sheet(wb, dimWs, "REST_Dimensiones");
  }

  // Agregar restricciones de validación
  const validationRestrictions = getValidationRestrictions();
  if (validationRestrictions.length > 0) {
    const validationData = validationRestrictions.map((r) => ({
      Categoría: "Validación",
      Envoltura: getEnvolturaLabel(r.productType),
      Código: r.code,
      "Nombre Restricción": r.name,
      "Campo Origen": r.sourceField,
      "Campo Dependiente": r.dependentField,
      Estado: r.status,
    }));

    const valWs = XLSX.utils.json_to_sheet(validationData);
    XLSX.utils.book_append_sheet(wb, valWs, "REST_Validaciones");
  }

  // Crear hoja de resumen de catálogos
  const catalogSummaryData = catalogs.map((catalog) => {
    const values = getCatalogValues(catalog.code);
    const activeCount = values.filter((v) => v.status === "Activo").length;
    const inactiveCount = values.filter((v) => v.status === "Inactivo").length;
    const blockedCount = values.filter((v) => v.status === "Bloqueado").length;

    return {
      Catálogo: catalog.name,
      Código: catalog.code,
      Total: values.length,
      Activos: activeCount,
      Inactivos: inactiveCount,
      Bloqueados: blockedCount,
    };
  });

  const catalogSummaryWs = XLSX.utils.json_to_sheet(catalogSummaryData);
  catalogSummaryWs["!cols"] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 8 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(wb, catalogSummaryWs, "0_Resumen");
  // Move summary sheet to the beginning
  wb.SheetNames.unshift(wb.SheetNames.pop()!);

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Catalogos_Restricciones_${timestamp}.xlsx`);
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
