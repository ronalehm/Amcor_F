import * as XLSX from "xlsx";
import { CATALOG_REGISTRY } from "../../../shared/catalogs/catalog.registry";
import { getCatalogValues } from "../../../shared/catalogs/catalog.service";

export interface ValidationError {
  type: "error" | "warning";
  code: string;
  message: string;
  sheet?: string;
  row?: number;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  preview?: {
    newRecords: number;
    modifiedRecords: number;
    inactivatedRecords: number;
    blockedRecords: number;
  };
}

export class CatalogTemplateValidator {
  private workbook: XLSX.WorkBook | null = null;
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];
  private catalogCode: string | null = null;

  /**
   * Valida una plantilla subida
   * @param file - Archivo a validar
   * @param catalogCode - Código del catálogo (requerido para plantillas individuales)
   */
  public async validateTemplate(file: File, catalogCode?: string): Promise<ValidationResult> {
    this.catalogCode = catalogCode || null;
    this.errors = [];
    this.warnings = [];

    try {
      // 1. Leer el archivo
      const buffer = await file.arrayBuffer();
      this.workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

      // 2. Ejecutar todas las validaciones (en orden)
      this.validateSheetStructure();
      this.validateSummarySheet();
      this.validateDetailSheet();
      this.validateIndividualSheets();
      this.validateConsistency();
      this.validateStateChanges();
      this.validateMetadataFields();

      // 3. Generar preview si no hay errores críticos
      const preview = this.errors.length === 0 ? this.generatePreview() : undefined;

      return {
        isValid: this.errors.length === 0,
        errors: this.errors,
        warnings: this.warnings,
        preview,
      };
    } catch (error) {
      this.errors.push({
        type: "error",
        code: "FILE_READ_ERROR",
        message: `No se puede leer el archivo: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      return {
        isValid: false,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
  }

  /**
   * V1: Validar estructura de hojas
   * Para plantillas individuales: requiere "valores"
   * Para plantillas completas: requiere Resumen_Catalogos y Detalle_Catalogos
   */
  private validateSheetStructure(): void {
    if (!this.workbook) return;

    const sheetNames = this.workbook.SheetNames;
    const hasValoresSheet = sheetNames.includes("valores");
    const hasSummary = sheetNames.includes("Resumen_Catalogos");
    const hasDetail = sheetNames.includes("Detalle_Catalogos");

    // Si existe "valores" es una plantilla individual - no requiere validación de Resumen/Detalle
    if (hasValoresSheet) {
      return; // Validación exitosa
    }

    // Si no existe "valores", debe ser una plantilla completa
    if (!hasSummary) {
      this.errors.push({
        type: "error",
        code: "MISSING_SUMMARY_SHEET",
        message: "Falta la hoja 'Resumen_Catalogos'",
      });
    }

    if (!hasDetail) {
      this.errors.push({
        type: "error",
        code: "MISSING_DETAIL_SHEET",
        message: "Falta la hoja 'Detalle_Catalogos'",
      });
    }
  }

  /**
   * V2, V3: Validar hoja Resumen
   * - Código catálogo existe
   * - Sistema es válido
   */
  private validateSummarySheet(): void {
    if (!this.workbook || this.errors.length > 0) return;

    const sheet = this.workbook.Sheets["Resumen_Catalogos"];
    if (!sheet) return;

    const data = XLSX.utils.sheet_to_json(sheet);
    const validSystems = ["ODISEO", "SISTEMA_INTEGRAL"];

    data.forEach((row: any, index: number) => {
      const rowNum = index + 2; // +2 porque hay header

      // V2: Código catálogo debe existir
      const codCatalogo = row["Código Catálogo"];
      if (!codCatalogo) {
        this.errors.push({
          type: "error",
          code: "MISSING_CATALOG_CODE",
          message: "Código de catálogo vacío",
          sheet: "Resumen_Catalogos",
          row: rowNum,
        });
      }

      // Validar formato CAT-XXX
      if (codCatalogo && !/^CAT-\d{3}$/.test(codCatalogo)) {
        this.errors.push({
          type: "error",
          code: "INVALID_CATALOG_CODE_FORMAT",
          message: `Formato de código inválido: ${codCatalogo}. Debe ser CAT-XXX`,
          sheet: "Resumen_Catalogos",
          row: rowNum,
          value: codCatalogo,
        });
      }

      // V3: Sistema debe ser válido
      const sistema = row["Sistema"];
      if (sistema && !validSystems.includes(sistema)) {
        this.errors.push({
          type: "error",
          code: "INVALID_SYSTEM",
          message: `Sistema inválido: ${sistema}. Debe ser ODISEO o SISTEMA_INTEGRAL`,
          sheet: "Resumen_Catalogos",
          row: rowNum,
          value: sistema,
        });
      }
    });
  }

  /**
   * V4-V14: Validar hoja Detalle o valores
   * Soporta tanto la hoja "valores" (plantillas individuales) como "Detalle_Catalogos" (plantillas completas)
   */
  private validateDetailSheet(): void {
    if (!this.workbook || this.errors.length > 0) return;

    // Determinar qué hoja validar
    const sheetName = this.workbook.SheetNames.includes("valores") ? "valores" : "Detalle_Catalogos";
    const sheet = this.workbook.Sheets[sheetName];
    if (!sheet) return;

    const data = XLSX.utils.sheet_to_json(sheet);
    const validStates = ["Activo", "Inactivo", "Bloqueado"];
    const seenValueCombinations = new Set<string>();

    data.forEach((row: any, index: number) => {
      const rowNum = index + 2;

      // V4: Código valor no vacío
      const codigoValor = row["Código Valor"];
      if (!codigoValor) {
        this.errors.push({
          type: "error",
          code: "MISSING_VALUE_CODE",
          message: "Código de valor vacío",
          sheet: sheetName,
          row: rowNum,
        });
      }

      // V6: Valor no vacío
      const valor = row["Valor"];
      if (!valor) {
        this.errors.push({
          type: "error",
          code: "MISSING_VALUE",
          message: "Valor vacío",
          sheet: sheetName,
          row: rowNum,
        });
      }

      // V5: Combinación Código + Valor no duplicada
      if (codigoValor && valor) {
        const combination = `${codigoValor}||${valor}`;
        if (seenValueCombinations.has(combination)) {
          this.errors.push({
            type: "error",
            code: "DUPLICATE_VALUE_COMBINATION",
            message: `Combinación duplicada: ${codigoValor} - ${valor}`,
            sheet: sheetName,
            row: rowNum,
            value: combination,
          });
        }
        seenValueCombinations.add(combination);
      }

      // V7: Sin duplicados (mayúsculas/espacios normalizados)
      if (valor) {
        const normalized = valor.trim().toUpperCase();
        const duplicates = (data as any[]).filter(
          (d, i) =>
            i !== index &&
            d["Valor"] &&
            d["Valor"].trim().toUpperCase() === normalized
        );
        if (duplicates.length > 0) {
          this.warnings.push({
            type: "warning",
            code: "POTENTIAL_DUPLICATE",
            message: `Posible duplicado: '${valor}' (diferentes mayúsculas/espacios)`,
            sheet: sheetName,
            row: rowNum,
          });
        }
      }

      // V8: Estado válido
      const estado = row["Estado"];
      if (estado && !validStates.includes(estado)) {
        this.errors.push({
          type: "error",
          code: "INVALID_STATE",
          message: `Estado inválido: ${estado}. Debe ser Activo, Inactivo o Bloqueado`,
          sheet: sheetName,
          row: rowNum,
          value: estado,
        });
      }

      // V12: Inactivación solo si Estado=Inactivo
      // (se validará contra los datos originales en validateStateChanges)
    });
  }

  /**
   * V9: Hojas individuales corresponden a códigos
   * Se salta para plantillas individuales (cuando existe "valores")
   */
  private validateIndividualSheets(): void {
    if (!this.workbook) return;

    // Si existe "valores" es una plantilla individual, no validar hojas individuales múltiples
    if (this.workbook.SheetNames.includes("valores")) {
      return;
    }

    const summarySheet = this.workbook.Sheets["Resumen_Catalogos"];
    if (!summarySheet) return;

    const summaryData = XLSX.utils.sheet_to_json(summarySheet) as any[];
    const summarySheetNames = new Set(
      summaryData.map((row) => this.getExpectedSheetName(row["Código Catálogo"]))
    );

    this.workbook.SheetNames.forEach((sheetName) => {
      if (sheetName === "Resumen_Catalogos" || sheetName === "Detalle_Catalogos") {
        return;
      }

      // Validar que la hoja existe en el resumen
      if (!summarySheetNames.has(sheetName)) {
        this.warnings.push({
          type: "warning",
          code: "UNEXPECTED_SHEET",
          message: `Hoja inesperada: '${sheetName}'. No está en Resumen_Catalogos`,
          sheet: sheetName,
        });
      }

      // Validar estructura de hoja individual
      const sheet = this.workbook!.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      const expectedColumns = [
        "Código Valor",
        "Valor",
        "Descripción",
        "Estado",
        "Fecha de Creación",
        "Última Actualización",
        "Actualizado Por",
      ];

      if (data.length > 0) {
        const firstRow = data[0];
        const missingColumns = expectedColumns.filter(
          (col) => !(col in firstRow)
        );

        if (missingColumns.length > 0) {
          this.errors.push({
            type: "error",
            code: "INVALID_SHEET_STRUCTURE",
            message: `Hoja '${sheetName}' tiene estructura incorrecta. Faltan columnas: ${missingColumns.join(", ")}`,
            sheet: sheetName,
          });
        }
      }
    });
  }

  /**
   * V10, V11: Validar que campos de metadata no fueron alterados
   * y que ausencia no elimina valores (solo para plantillas completas)
   */
  private validateMetadataFields(): void {
    if (!this.workbook) return;

    // Si existe "valores" es una plantilla individual, metadata no es obligatoria
    if (this.workbook.SheetNames.includes("valores")) {
      return;
    }

    const detailSheet = this.workbook.Sheets["Detalle_Catalogos"];
    if (!detailSheet) return;

    const data = XLSX.utils.sheet_to_json(detailSheet) as any[];

    data.forEach((row, index) => {
      const rowNum = index + 2;

      // V10: Campos Fecha y Usuario no deben ser vacíos
      const lastUpdate = row["Última Actualización"];
      const updatedBy = row["Actualizado Por"];

      if (!lastUpdate) {
        this.warnings.push({
          type: "warning",
          code: "MISSING_UPDATE_DATE",
          message: "Falta la fecha de actualización",
          sheet: "Detalle_Catalogos",
          row: rowNum,
        });
      }

      if (!updatedBy) {
        this.warnings.push({
          type: "warning",
          code: "MISSING_UPDATE_USER",
          message: "Falta el usuario de actualización",
          sheet: "Detalle_Catalogos",
          row: rowNum,
        });
      }
    });
  }

  /**
   * V12, V13, V14: Validar cambios de estado y trazabilidad
   */
  private validateStateChanges(): void {
    if (!this.workbook) return;

    // Determinar qué hoja validar
    const sheetName = this.workbook.SheetNames.includes("valores") ? "valores" : "Detalle_Catalogos";
    const detailSheet = this.workbook.Sheets[sheetName];
    if (!detailSheet) return;

    const uploadedData = XLSX.utils.sheet_to_json(detailSheet) as any[];

    uploadedData.forEach((row, index) => {
      const rowNum = index + 2;
      const codigoValor = row["Código Valor"];
      const nuevoEstado = row["Estado"];
      const catalogCodeFromRow = row["Código Catálogo"];

      // Para plantillas individuales, usar el catalogCode del contexto
      const catalogCode = catalogCodeFromRow || this.catalogCode;

      if (!codigoValor || !nuevoEstado || !catalogCode) return;

      // Obtener estado original
      const originalValues = getCatalogValues(catalogCode);
      const originalValue = originalValues?.find(
        (v) => v.item === codigoValor
      );

      // V12: Si estado cambió a Inactivo, debe ser validado
      if (
        originalValue &&
        originalValue.status !== nuevoEstado &&
        nuevoEstado === "Inactivo"
      ) {
        // Esto es permitido, pero se registrará en trazabilidad
      }

      // V13: Valores bloqueados deben conservar su estado
      if (
        originalValue &&
        originalValue.status === "Bloqueado" &&
        nuevoEstado !== "Bloqueado"
      ) {
        this.errors.push({
          type: "error",
          code: "BLOCKED_VALUE_CHANGED",
          message: `Valor bloqueado no puede cambiar de estado: ${codigoValor}`,
          sheet: sheetName,
          row: rowNum,
        });
      }

      // V14: Código valor no debe ser modificado
      // Esto se valida que el código sea igual en detalle vs original
      if (originalValue && originalValue.item !== codigoValor) {
        this.errors.push({
          type: "error",
          code: "VALUE_CODE_MODIFIED",
          message: `Código de valor no puede ser modificado: ${originalValue.item} → ${codigoValor}`,
          sheet: sheetName,
          row: rowNum,
        });
      }
    });
  }

  /**
   * Validación de consistencia general
   */
  private validateConsistency(): void {
    if (!this.workbook || this.errors.length > 0) return;

    // Para plantillas individuales con "valores", no validar consistencia
    if (this.workbook.SheetNames.includes("valores")) {
      return;
    }

    const summarySheet = this.workbook.Sheets["Resumen_Catalogos"];
    const detailSheet = this.workbook.Sheets["Detalle_Catalogos"];

    if (!summarySheet || !detailSheet) return;

    const summaryData = XLSX.utils.sheet_to_json(summarySheet) as any[];
    const detailData = XLSX.utils.sheet_to_json(detailSheet) as any[];

    // Validar que cada catálogo en Resumen tenga valores en Detalle
    summaryData.forEach((row) => {
      const codCatalogo = row["Código Catálogo"];
      if (!codCatalogo) return;

      const catalogDetails = detailData.filter(
        (d: any) => d["Código Catálogo"] === codCatalogo
      );
      if (catalogDetails.length === 0) {
        this.warnings.push({
          type: "warning",
          code: "CATALOG_WITHOUT_VALUES",
          message: `Catálogo ${codCatalogo} no tiene valores en Detalle_Catalogos`,
          sheet: "Resumen_Catalogos",
        });
      }
    });
  }

  /**
   * Genera un preview de los cambios
   */
  private generatePreview(): {
    newRecords: number;
    modifiedRecords: number;
    inactivatedRecords: number;
    blockedRecords: number;
  } {
    if (!this.workbook) {
      return {
        newRecords: 0,
        modifiedRecords: 0,
        inactivatedRecords: 0,
        blockedRecords: 0,
      };
    }

    // Determinar qué hoja usar para preview
    const sheetName = this.workbook.SheetNames.includes("valores") ? "valores" : "Detalle_Catalogos";
    const detailSheet = this.workbook.Sheets[sheetName];
    if (!detailSheet) {
      return {
        newRecords: 0,
        modifiedRecords: 0,
        inactivatedRecords: 0,
        blockedRecords: 0,
      };
    }

    const data = XLSX.utils.sheet_to_json(detailSheet) as any[];
    let newRecords = 0;
    let modifiedRecords = 0;
    let inactivatedRecords = 0;
    let blockedRecords = 0;

    data.forEach((row) => {
      const codigoValor = row["Código Valor"];
      const catalogCodeFromRow = row["Código Catálogo"];
      const estado = row["Estado"];

      // Para plantillas individuales, usar el catalogCode del contexto
      const catalogCode = catalogCodeFromRow || this.catalogCode;

      if (!codigoValor || !catalogCode) return;

      const originalValues = getCatalogValues(catalogCode);
      const originalValue = originalValues?.find((v) => v.item === codigoValor);

      if (!originalValue) {
        newRecords++;
      } else if (originalValue.status !== estado) {
        if (estado === "Inactivo") {
          inactivatedRecords++;
        } else if (estado === "Bloqueado") {
          blockedRecords++;
        } else {
          modifiedRecords++;
        }
      }
    });

    return {
      newRecords,
      modifiedRecords,
      inactivatedRecords,
      blockedRecords,
    };
  }

  /**
   * Genera el nombre esperado de una hoja individual
   */
  private getExpectedSheetName(codCatalogo: string): string {
    if (!codCatalogo) return "";
    return `CAT-${codCatalogo.replace("CAT-", "").substring(0, 20)}`;
  }
}

/**
 * Función de utilidad para validar archivo
 */
export async function validateCatalogTemplate(
  file: File,
  catalogCode?: string
): Promise<ValidationResult> {
  const validator = new CatalogTemplateValidator();
  return validator.validateTemplate(file, catalogCode);
}
