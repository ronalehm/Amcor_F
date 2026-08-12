import * as XLSX from "xlsx";
import {
  getDimensionRestrictions,
  getValidationRestrictions,
  updateDimensionRestriction,
  updateValidationRestriction,
} from "../../../shared/data/restrictionCatalogsStorage";
import type {
  DimensionRestrictionCatalog,
  ValidationRestrictionCatalog,
} from "../../../shared/data/restrictionCatalogs";
import type {
  RestrictionExportData,
  RestrictionValidationSummary,
  RestrictionChangePreviewRow,
  RestrictionDetectedChangeAction,
} from "../types/catalogRestriction.types";
import { getCurrentUser } from "../../../shared/data/userStorage";
import { addRestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";

// ============ ESTILOS PROFESIONALES ============

interface CellStyle {
  fill?: { fgColor?: { rgb?: string } };
  font?: { bold?: boolean; color?: { rgb?: string }; size?: number };
  alignment?: { horizontal?: string; vertical?: string; wrapText?: boolean };
  border?: {
    top?: { style?: string; color?: { rgb?: string } };
    bottom?: { style?: string; color?: { rgb?: string } };
    left?: { style?: string; color?: { rgb?: string } };
    right?: { style?: string; color?: { rgb?: string } };
  };
}

// Mapeo de nombres de columnas para encabezados legibles
const headerMappingDimension: Record<string, string> = {
  id: "ID",
  nombre: "Nombre de Restricción",
  codigo: "Código",
  tipoProducto: "Tipo de Producto",
  formatoPlan: "Formato de Plano",
  ancho_min: "Ancho Mín (mm)",
  ancho_max: "Ancho Máx (mm)",
  largo_min: "Largo Mín (mm)",
  largo_max: "Largo Máx (mm)",
  anchoFuelle_min: "Ancho Fuelle Mín (mm)",
  anchoFuelle_max: "Ancho Fuelle Máx (mm)",
  perimetro_min: "Perímetro Mín (mm)",
  perimetro_max: "Perímetro Máx (mm)",
  estado: "Estado",
};

const headerMappingValidation: Record<string, string> = {
  id: "ID",
  nombre: "Nombre de Restricción",
  codigo: "Código",
  tipoProducto: "Tipo de Producto",
  campoOrigen: "Campo Origen",
  valorOrigen: "Valor Origen",
  campoDependiente: "Campo Dependiente",
  valoresPermitidos: "Valores Permitidos",
  estado: "Estado",
};

function applyProfessionalStylesRestrictions(
  ws: XLSX.WorkSheet,
  headerRowIndex: number = 1,
  dataRowCount: number = 0,
  headerMapping: Record<string, string> = {}
): void {
  if (!ws["!ref"]) return;

  const range = XLSX.utils.decode_range(ws["!ref"]);
  const headerColor = "#1F4E78";
  const headerFont = "FFFFFF";
  const evenRowColor = "#F2F2F2";
  const borderColor = "#000000";
  const dataBorderColor = "#CCCCCC";

  // Renombrar encabezados
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + headerRowIndex;
    if (ws[address] && headerMapping[ws[address].v]) {
      ws[address].v = headerMapping[ws[address].v];
    }
  }

  // Estilos para encabezados
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + headerRowIndex;
    if (!ws[address]) continue;

    ws[address].s = {
      fill: { fgColor: { rgb: headerColor } },
      font: { bold: true, color: { rgb: headerFont }, size: 11 },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: borderColor } },
        bottom: { style: "thin", color: { rgb: borderColor } },
        left: { style: "thin", color: { rgb: borderColor } },
        right: { style: "thin", color: { rgb: borderColor } },
      },
    };
  }

  // Estilos para datos (zebra striping)
  for (let R = headerRowIndex + 1; R <= headerRowIndex + dataRowCount; ++R) {
    const isEvenRow = (R - headerRowIndex - 1) % 2 === 0;
    const rowColor = isEvenRow ? evenRowColor : "FFFFFF";

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + R;
      if (!ws[address]) continue;

      ws[address].s = {
        fill: { fgColor: { rgb: rowColor } },
        font: { size: 10 },
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: dataBorderColor } },
          bottom: { style: "thin", color: { rgb: dataBorderColor } },
          left: { style: "thin", color: { rgb: dataBorderColor } },
          right: { style: "thin", color: { rgb: dataBorderColor } },
        },
      };
    }
  }

  // Auto-ajustar ancho de columnas
  const colWidths: number[] = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxLength = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const address = XLSX.utils.encode_col(C) + (R + 1);
      if (ws[address] && ws[address].v) {
        const cellValue = String(ws[address].v);
        maxLength = Math.max(maxLength, cellValue.length);
      }
    }
    colWidths.push(Math.min(maxLength + 2, 50));
  }
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));

  // Congelación de fila de encabezado
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Filtros automáticos
  if (ws["!ref"]) {
    ws["!autofilter"] = { ref: ws["!ref"] };
  }
}

// ============ EXPORTACIÓN ============

/**
 * Exportar restricciones de dimensión a Excel
 */
export function exportDimensionRestrictionsToExcel(): RestrictionExportData[] {
  const restrictions = getDimensionRestrictions();

  return restrictions.map((r) => ({
    id: r.id,
    nombre: r.name,
    codigo: r.code,
    tipoProducto: r.productType,
    formatoPlan: r.formatPlan,
    ancho_min: r.ancho?.min ?? 0,
    ancho_max: r.ancho?.max ?? 0,
    largo_min: r.largo?.min ?? 0,
    largo_max: r.largo?.max ?? 0,
    anchoFuelle_min: r.anchoFuelle?.min ?? 0,
    anchoFuelle_max: r.anchoFuelle?.max ?? 0,
    perimetro_min: r.perimetro?.min ?? 0,
    perimetro_max: r.perimetro?.max ?? 0,
    estado: r.status,
  }));
}

/**
 * Exportar restricciones de validación a Excel
 */
export function exportValidationRestrictionsToExcel(): RestrictionExportData[] {
  const restrictions = getValidationRestrictions();

  return restrictions.map((r) => ({
    id: r.id,
    nombre: r.name,
    codigo: r.code,
    tipoProducto: r.productType,
    campoOrigen: r.sourceField,
    valorOrigen: r.sourceValue,
    campoDependiente: r.dependentField,
    valoresPermitidos: r.allowedValues.join("; "),
    estado: r.status,
  }));
}

/**
 * Descargar plantilla Excel con restricciones (dimensión)
 */
export async function downloadDimensionRestrictionsTemplate(): Promise<void> {
  const exportData = exportDimensionRestrictionsToExcel();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Aplicar estilos profesionales con mapeo de encabezados
  applyProfessionalStylesRestrictions(ws, 1, exportData.length, headerMappingDimension);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Restricciones Dimensión");

  const fileName = `Restricciones_Dimension_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Descargar plantilla Excel con restricciones (validación)
 */
export async function downloadValidationRestrictionsTemplate(): Promise<void> {
  const exportData = exportValidationRestrictionsToExcel();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Aplicar estilos profesionales con mapeo de encabezados
  applyProfessionalStylesRestrictions(ws, 1, exportData.length, headerMappingValidation);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Restricciones Validación");

  const fileName = `Restricciones_Validacion_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Descargar todas las restricciones (dimensión + validación)
 */
export async function downloadAllRestrictionsTemplate(): Promise<void> {
  const dimensionData = exportDimensionRestrictionsToExcel();
  const validationData = exportValidationRestrictionsToExcel();

  const wb = XLSX.utils.book_new();
  const wsDimension = XLSX.utils.json_to_sheet(dimensionData);
  const wsValidation = XLSX.utils.json_to_sheet(validationData);

  // Aplicar estilos profesionales a ambas hojas con mapeos correspondientes
  applyProfessionalStylesRestrictions(wsDimension, 1, dimensionData.length, headerMappingDimension);
  applyProfessionalStylesRestrictions(wsValidation, 1, validationData.length, headerMappingValidation);

  XLSX.utils.book_append_sheet(wb, wsDimension, "Dimensión");
  XLSX.utils.book_append_sheet(wb, wsValidation, "Validación");

  const fileName = `Restricciones_Completa_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// ============ IMPORTACIÓN Y VALIDACIÓN ============

/**
 * Validar y cargar plantilla Excel de restricciones de dimensión
 */
export async function uploadAndValidateDimensionTemplate(
  file: File,
  restrictionType: "dimension" | "validation"
): Promise<RestrictionValidationSummary> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(worksheet);

        if (rows.length === 0) {
          throw new Error("La plantilla no contiene datos");
        }

        // Obtener restricciones actuales
        const currentRestrictions =
          restrictionType === "dimension"
            ? getDimensionRestrictions()
            : getValidationRestrictions();

        const previewRows: RestrictionChangePreviewRow[] = [];
        const detectedChanges: Array<{
          id: string;
          action: RestrictionDetectedChangeAction;
          oldData: any;
          newData: any;
        }> = [];

        // Procesar cada fila del Excel
        rows.forEach((row, index) => {
          const id = row.id || row.Id || "";
          const currentRest = currentRestrictions.find((r) => r.id === id);

          if (!id) {
            throw new Error(`Fila ${index + 1}: ID es requerido`);
          }

          if (!currentRest) {
            throw new Error(`Fila ${index + 1}: Restricción con ID ${id} no encontrada`);
          }

          // Detectar cambios
          const hasChanges = JSON.stringify(currentRest) !== JSON.stringify(row);

          if (hasChanges) {
            previewRows.push({
              id,
              nombre: row.nombre || currentRest.name,
              tipoProducto: row.tipoProducto || currentRest.productType,
              cambiosDetectados: "Sí",
              status: "modificado",
            });

            detectedChanges.push({
              id,
              action: "modified",
              oldData: currentRest,
              newData: row,
            });
          }
        });

        const summary: RestrictionValidationSummary = {
          status: detectedChanges.length > 0 ? "valid" : "with_observations",
          totalRecords: rows.length,
          validRecords: rows.length,
          modifiedRecords: detectedChanges.length,
          newRecords: 0,
          inactivatedRecords: 0,
          blockedRecords: 0,
          criticalErrors: 0,
          observations: detectedChanges.length === 0 ? 1 : 0,
          rows: previewRows,
          detectedChanges,
        };

        resolve(summary);
      } catch (error) {
        reject(new Error(`Error al procesar plantilla: ${error instanceof Error ? error.message : String(error)}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Aplicar cambios de restricciones importadas
 */
export async function applyRestrictionChanges(
  detectedChanges: Array<{ id: string; action: string; oldData?: any; newData: any }>,
  restrictionType: "dimension" | "validation",
  reason: string
): Promise<{ success: boolean; appliedCount: number; errorCount: number }> {
  let appliedCount = 0;
  let errorCount = 0;
  const user = getCurrentUser();

  try {
    for (const change of detectedChanges) {
      try {
        // Obtener datos actuales antes de actualizar (para bitácora)
        const currentRestrictions =
          restrictionType === "dimension"
            ? getDimensionRestrictions()
            : getValidationRestrictions();
        const currentData = currentRestrictions.find((r) => r.id === change.id);

        if (restrictionType === "dimension") {
          updateDimensionRestriction(change.id, change.newData);
          appliedCount++;

          // Construir objeto de cambios detallado
          const changesDetail: Record<string, { old: any; new: any }> = {};
          if (currentData && change.newData) {
            Object.keys(change.newData).forEach((key) => {
              if (JSON.stringify(currentData[key as keyof typeof currentData]) !==
                  JSON.stringify(change.newData[key])) {
                changesDetail[key] = {
                  old: currentData[key as keyof typeof currentData],
                  new: change.newData[key],
                };
              }
            });
          }

          // Registrar en bitácora con detalle de cambios
          addRestrictionChangeLogEntry(
            {
              restrictionId: change.id,
              restrictionName: change.newData.name || currentData?.name || "Unknown",
              restrictionType: "dimension",
              action: "updated",
              changes: Object.keys(changesDetail).length > 0 ? changesDetail : { modified: { old: currentData, new: change.newData } },
              result: "success",
              reason,
            },
            reason
          );
        } else {
          updateValidationRestriction(change.id, change.newData);
          appliedCount++;

          // Construir objeto de cambios detallado
          const changesDetail: Record<string, { old: any; new: any }> = {};
          if (currentData && change.newData) {
            Object.keys(change.newData).forEach((key) => {
              if (JSON.stringify(currentData[key as keyof typeof currentData]) !==
                  JSON.stringify(change.newData[key])) {
                changesDetail[key] = {
                  old: currentData[key as keyof typeof currentData],
                  new: change.newData[key],
                };
              }
            });
          }

          // Registrar en bitácora con detalle de cambios
          addRestrictionChangeLogEntry(
            {
              restrictionId: change.id,
              restrictionName: change.newData.name || currentData?.name || "Unknown",
              restrictionType: "validation",
              action: "updated",
              changes: Object.keys(changesDetail).length > 0 ? changesDetail : { modified: { old: currentData, new: change.newData } },
              result: "success",
              reason,
            },
            reason
          );
        }
      } catch (error) {
        console.error(`Error aplicando cambio para ${change.id}:`, error);

        // Registrar error en bitácora
        addRestrictionChangeLogEntry(
          {
            restrictionId: change.id,
            restrictionName: change.newData?.name || "Unknown",
            restrictionType: restrictionType,
            action: "updated",
            changes: { error: { old: String(error), new: change.newData } },
            result: "error",
            reason,
          },
          reason
        );

        errorCount++;
      }
    }

    // Registrar resumen general en bitácora
    if (appliedCount > 0) {
      console.log(`✓ ${appliedCount} restricción(es) actualizada(s) desde plantilla Excel`);
      console.log(`Motivo: ${reason}`);
    }

    return { success: errorCount === 0, appliedCount, errorCount };
  } catch (error) {
    console.error("Error aplicando cambios de restricciones:", error);
    return { success: false, appliedCount, errorCount };
  }
}
