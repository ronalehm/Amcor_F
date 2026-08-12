import * as XLSX from "xlsx";
import type { CatalogDefinition, CatalogValue } from "../../../shared/catalogs/catalog.types";
import { CATALOG_REGISTRY } from "../../../shared/catalogs/catalog.registry";
import { getCatalogValues } from "../../../shared/catalogs/catalog.service";

export interface CatalogSummaryRow {
  "Código Catálogo": string;
  "Nombre del Campo": string;
  "Dominio": string;
  "Aplicable en": string;
  "Aplica en Otros": string;
  "Sistema": string;
  "Total Valores": number;
  "Activos": number;
  "Inactivos": number;
  "Bloqueados": number;
  "Última Actualización": string;
  "Actualizado Por": string;
}

export interface CatalogDetailRow {
  "Código Catálogo": string;
  "Nombre del Campo": string;
  "Dominio": string;
  "Código Valor": string;
  "Valor": string;
  "Descripción": string;
  "Estado": string;
  "Última Actualización": string;
}

export interface CatalogValueRow {
  "Código Valor": string;
  "Valor": string;
  "Descripción": string;
  "Estado": "Activo" | "Inactivo" | "Bloqueado";
  "Fecha de Creación": string;
  "Última Actualización": string;
  "Actualizado Por": string;
}

export class CatalogTemplateGenerator {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  /**
   * Genera la plantilla Excel completa con todas las hojas
   */
  public generateCompleteTemplate(): Blob {
    const catalogsData = this.getCatalogsData();

    // 1. Construir hoja Resumen_Catalogos
    const summarySheet = this.buildSummarySheet(catalogsData);
    XLSX.utils.book_append_sheet(this.workbook, summarySheet, "Resumen_Catalogos");

    // 2. Construir hoja Detalle_Catalogos
    const detailSheet = this.buildDetailSheet(catalogsData);
    XLSX.utils.book_append_sheet(this.workbook, detailSheet, "Detalle_Catalogos");

    // 3. Construir hojas individuales por catálogo
    catalogsData.forEach((catalogData) => {
      const catalogSheet = this.buildCatalogSheet(catalogData);
      const sheetName = this.generateSheetName(catalogData.catalog);
      XLSX.utils.book_append_sheet(this.workbook, catalogSheet, sheetName);
    });

    // 4. Generar el archivo y retornar como Blob
    return this.writeToBlob();
  }

  /**
   * Genera la plantilla Excel con TODOS los catálogos (ODISEO + Sistema Integral)
   */
  public generateAllCatalogsTemplate(): Blob {
    // Crear un nuevo workbook para evitar conflictos con otros usos
    const newWorkbook = XLSX.utils.book_new();
    const catalogsData = this.getAllCatalogsData();

    // 1. Construir hoja Resumen_Catalogos
    const summarySheet = this.buildSummarySheet(catalogsData);
    XLSX.utils.book_append_sheet(newWorkbook, summarySheet, "Resumen_Catalogos");
    // Aplicar formato profesional (se extrae dinámicamente de la hoja)
    applyProfessionalFormattingToSheetAuto(summarySheet, { headerColor: "1F4E78" });

    // 2. Construir hoja Detalle_Catalogos
    const detailSheet = this.buildDetailSheet(catalogsData);
    XLSX.utils.book_append_sheet(newWorkbook, detailSheet, "Detalle_Catalogos");
    applyProfessionalFormattingToSheetAuto(detailSheet, { headerColor: "2E5090" });

    // 3. Construir hojas individuales por catálogo
    catalogsData.forEach((catalogData) => {
      const catalogSheet = this.buildCatalogSheet(catalogData);
      const sheetName = this.generateSheetName(catalogData.catalog);
      XLSX.utils.book_append_sheet(newWorkbook, catalogSheet, sheetName);
      applyProfessionalFormattingToSheetAuto(catalogSheet, { headerColor: "3D5A80" });
    });

    // 4. Generar el archivo y retornar como Blob
    const wbout = XLSX.write(newWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  /**
   * Obtiene datos de todos los catálogos (solo ODISEO editables)
   */
  /**
   * Genera plantilla editable con tres hojas para un catálogo específico
   * Primera hoja "valores" es la única que se procesa en la web
   * Usuario puede: modificar descripción, cambiar estado a Inactivo/Activo, agregar nuevos valores
   */
  public generateSingleCatalogTemplate(catalogCode: string): Blob {
    const catalog = CATALOG_REGISTRY.find((cat) => cat.code === catalogCode);
    if (!catalog) throw new Error(`Catálogo ${catalogCode} no encontrado`);

    const values = getCatalogValues(catalogCode) || [];
    const catIndex = CATALOG_REGISTRY.findIndex((cat) => cat.code === catalogCode) + 1;
    const catCode = `CAT-${String(catIndex).padStart(3, "0")}`;
    const workbook = XLSX.utils.book_new();

    // 1. Hoja EDITABLE "valores" (primera - la única que se procesa)
    const editableData: Array<{
      "Código Valor": string;
      "Valor": string;
      "Descripción": string;
      "Estado": string;
    }> = values.map((value) => ({
      "Código Valor": value.item,
      "Valor": value.name,
      "Descripción": value.description || "",
      "Estado": value.status,
    }));

    const editableSheet = XLSX.utils.json_to_sheet(editableData);
    editableSheet["!cols"] = [
      { wch: 15 }, // Código Valor
      { wch: 20 }, // Valor
      { wch: 30 }, // Descripción
      { wch: 12 }, // Estado
    ];

    XLSX.utils.book_append_sheet(workbook, editableSheet, "valores");

    // 2. Hoja Resumen_Catalogos (informativa)
    const countByStatus = this.countValuesByStatus(values);
    const summaryData: CatalogSummaryRow[] = [
      {
        "Código Catálogo": catCode,
        "Nombre del Campo": catalog.name,
        "Dominio": this.getDomain(catalog),
        "Aplicable en": this.getApplicableIn(catalog),
        "Aplica en Otros": this.getApplicableInOthers(catalog),
        "Sistema": "ODISEO",
        "Total Valores": values.length,
        "Activos": countByStatus.activos,
        "Inactivos": countByStatus.inactivos,
        "Bloqueados": countByStatus.bloqueados,
        "Última Actualización": this.getCurrentDate(),
        "Actualizado Por": "ODISEO_SYSTEM",
      },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!cols"] = [
      { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 15 },
      { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen_Catalogos");

    // 3. Hoja Detalle_Catalogos (informativa)
    const detailData: CatalogDetailRow[] = values.map((value) => ({
      "Código Catálogo": catCode,
      "Nombre del Campo": catalog.name,
      "Dominio": this.getDomain(catalog),
      "Código Valor": value.item || "",
      "Valor": value.name,
      "Descripción": value.description || "",
      "Estado": value.status,
      "Última Actualización": this.getCurrentDate(),
    }));

    const detailSheet = XLSX.utils.json_to_sheet(detailData);
    detailSheet["!cols"] = [
      { wch: 18 }, // Código Catálogo
      { wch: 25 }, // Nombre del Campo
      { wch: 18 }, // Código Valor
      { wch: 25 }, // Valor
      { wch: 35 }, // Descripción
      { wch: 15 }, // Estado
      { wch: 20 }, // Última Actualización
    ];
    XLSX.utils.book_append_sheet(workbook, detailSheet, "Detalle_Catalogos");

    // Generar Blob
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  private getCatalogsData() {
    return CATALOG_REGISTRY.filter((cat) => cat.ownerSystem === "ODISEO").map(
      (catalog) => {
        const values = getCatalogValues(catalog.code) || [];
        return { catalog, values };
      }
    );
  }

  private getAllCatalogsData() {
    return CATALOG_REGISTRY.map((catalog) => {
      const values = getCatalogValues(catalog.code) || [];
      return { catalog, values };
    });
  }

  /**
   * Construye la hoja Resumen_Catalogos (11 columnas)
   */
  private buildSummarySheet(
    catalogsData: Array<{ catalog: CatalogDefinition; values: CatalogValue[] }>
  ): XLSX.WorkSheet {
    const summaryRows: CatalogSummaryRow[] = catalogsData.map((data, index) => {
      const { catalog, values } = data;
      const catCode = `CAT-${String(index + 1).padStart(3, "0")}`;
      const countByStatus = this.countValuesByStatus(values);

      return {
        "Código Catálogo": catCode,
        "Nombre del Campo": catalog.name,
        "Dominio": this.getDomain(catalog),
        "Aplicable en": this.getApplicableIn(catalog),
        "Aplica en Otros": this.getApplicableInOthers(catalog),
        "Sistema": catalog.ownerSystem || "ODISEO",
        "Total Valores": values.length,
        "Activos": countByStatus.activos,
        "Inactivos": countByStatus.inactivos,
        "Bloqueados": countByStatus.bloqueados,
        "Última Actualización": this.getCurrentDate(),
        "Actualizado Por": "ODISEO_SYSTEM",
      };
    });

    const sheet = XLSX.utils.json_to_sheet(summaryRows);

    // Ajustar ancho de columnas
    sheet["!cols"] = [
      { wch: 18 }, // Código Catálogo
      { wch: 25 }, // Nombre del Campo
      { wch: 15 }, // Dominio
      { wch: 18 }, // Aplicable en
      { wch: 18 }, // Aplica en Otros
      { wch: 15 }, // Sistema
      { wch: 12 }, // Total Valores
      { wch: 10 }, // Activos
      { wch: 10 }, // Inactivos
      { wch: 10 }, // Bloqueados
      { wch: 20 }, // Última Actualización
      { wch: 18 }, // Actualizado Por
    ];

    return sheet;
  }

  /**
   * Construye la hoja Detalle_Catalogos (consolidada)
   */
  private buildDetailSheet(
    catalogsData: Array<{ catalog: CatalogDefinition; values: CatalogValue[] }>
  ): XLSX.WorkSheet {
    const detailRows: CatalogDetailRow[] = [];

    catalogsData.forEach((data, catalogIndex) => {
      const { catalog, values } = data;
      const catCode = `CAT-${String(catalogIndex + 1).padStart(3, "0")}`;

      values.forEach((value) => {
        detailRows.push({
          "Código Catálogo": catCode,
          "Nombre del Campo": catalog.name,
          "Dominio": this.getDomain(catalog),
          "Código Valor": value.item || "",
          "Valor": value.name,
          "Descripción": value.description || "",
          "Estado": value.status,
          "Última Actualización": this.getCurrentDate(),
        });
      });
    });

    const sheet = XLSX.utils.json_to_sheet(detailRows);

    // Ajustar ancho de columnas
    sheet["!cols"] = [
      { wch: 18 }, // Código Catálogo
      { wch: 25 }, // Nombre del Campo
      { wch: 15 }, // Dominio
      { wch: 18 }, // Código Valor
      { wch: 25 }, // Valor
      { wch: 35 }, // Descripción
      { wch: 15 }, // Estado
      { wch: 20 }, // Última Actualización
    ];

    return sheet;
  }

  /**
   * Construye una hoja individual para un catálogo específico
   */
  private buildCatalogSheet(data: {
    catalog: CatalogDefinition;
    values: CatalogValue[];
  }): XLSX.WorkSheet {
    const { values } = data;

    const valueRows: CatalogValueRow[] = values.map((value) => ({
      "Código Valor": value.item || "",
      "Valor": value.name,
      "Descripción": value.description || "",
      "Estado": value.status as "Activo" | "Inactivo" | "Bloqueado",
      "Fecha de Creación": value.createdAt ? this.formatDate(value.createdAt) : this.getCurrentDate(),
      "Última Actualización": this.getCurrentDate(),
      "Actualizado Por": "ODISEO_SYSTEM",
    }));

    const sheet = XLSX.utils.json_to_sheet(valueRows);

    // Ajustar ancho de columnas
    sheet["!cols"] = [
      { wch: 18 }, // Código Valor
      { wch: 25 }, // Valor
      { wch: 35 }, // Descripción
      { wch: 15 }, // Estado
      { wch: 18 }, // Fecha de Creación
      { wch: 20 }, // Última Actualización
      { wch: 18 }, // Actualizado Por
    ];

    return sheet;
  }

  /**
   * Cuenta valores por estado
   */
  private countValuesByStatus(values: CatalogValue[]): Record<string, number> {
    return {
      activos: values.filter((v) => v.status === "Activo").length,
      inactivos: values.filter((v) => v.status === "Inactivo").length,
      bloqueados: values.filter((v) => v.status === "Bloqueado").length,
    };
  }

  /**
   * Obtiene en qué tipos de envoltura aplica el catálogo
   */
  private getApplicableIn(catalog: CatalogDefinition): string {
    // Mapeo de códigos a tipos de envoltura
    const applicableMap: Record<string, string[]> = {
      // LÁMINA
      lamina_format: ["LÁMINA"],
      winding_direction: ["LÁMINA"],
      photocell_location: ["LÁMINA"],

      // BOLSA
      bag_perforation_type: ["BOLSA"],
      wicket_perforation_type: ["BOLSA"],
      precut_type: ["BOLSA"],
      handle_type: ["BOLSA"],
      handle_color: ["BOLSA"],
      presentation_type: ["BOLSA"],
      bag_seal_type: ["BOLSA"],
      finish: ["BOLSA"],
      bag_bellows_type: ["BOLSA"],
      wicket_diameter: ["BOLSA"],
      control_wicket_diameter: ["BOLSA"],
      control_wicket_location: ["BOLSA"],
      precut_wicket_location: ["BOLSA"],
      margin_distance: ["BOLSA"],
      stitching_separation: ["BOLSA"],

      // POUCH
      zipper_type: ["POUCH"],
      valve_type: ["POUCH"],
      rounded_corners_type: ["POUCH"],
      pouch_perforation_type: ["POUCH"],
      eyelet_perforation_type: ["POUCH"],
      pouch_family: ["POUCH"],
      standup_type: ["POUCH"],
      doypack_base: ["POUCH"],
    };

    const applicable = applicableMap[catalog.code] || [];
    return applicable.length > 0 ? applicable.join(", ") : "General";
  }

  /**
   * Obtiene otros tipos aplicables si existen
   */
  private getApplicableInOthers(catalog: CatalogDefinition): string {
    // Algunos catálogos aplican en múltiples tipos
    const multiApplicable: Record<string, string[]> = {
      zipper_type: ["BOLSA"], // también puede ser Wicket
      valve_type: ["BOLSA"], // también puede ser Pouch
    };
    const others = multiApplicable[catalog.code] || [];
    return others.length > 0 ? others.join(", ") : "";
  }

  /**
   * Obtiene el dominio al que pertenece un catálogo
   */
  private getDomain(catalog: CatalogDefinition): string {
    const domainMap: Record<string, string> = {
      // Portafolio
      classification: "Portafolio",
      project_type: "Portafolio",
      modification_type: "Portafolio",
      format_plan: "Portafolio",

      // Clientes
      client: "Clientes",

      // Usuarios
      user: "Usuarios",
      executive: "Usuarios",

      // Producto - todos los demás
    };

    // Si está en el mapa, retornar el dominio; sino, es Producto
    return domainMap[catalog.code] || "Producto";
  }

  /**
   * Genera el nombre de la hoja para un catálogo
   */
  private generateSheetName(catalog: CatalogDefinition, index?: number): string {
    // Convertir nombre a formato válido para hoja Excel
    // Máximo 31 caracteres, sin caracteres especiales
    let sheetName = `${catalog.code}`.replace(/[\/\\?*\[\]]/g, "");

    // Si la hoja es muy larga, truncar dejando espacio para el índice si es necesario
    if (sheetName.length > 31) {
      sheetName = sheetName.substring(0, 30);
    }

    return sheetName;
  }

  /**
   * Formatea una fecha al formato DD/MM/YYYY
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return this.getCurrentDate();
    }
  }

  /**
   * Obtiene la fecha actual en formato DD/MM/YYYY
   */
  private getCurrentDate(): string {
    return new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  /**
   * Escribe el workbook a un Blob
   */
  private writeToBlob(): Blob {
    const wbout = XLSX.write(this.workbook, {
      bookType: "xlsx",
      type: "array",
    });
    return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  /**
   * Método auxiliar: genera la plantilla y la descarga
   */
  public downloadTemplate(): void {
    const blob = this.generateCompleteTemplate();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Catalogs_Template_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Función de conveniencia para generar y descargar la plantilla (solo ODISEO)
 */
export function downloadCatalogsTemplate(): void {
  const generator = new CatalogTemplateGenerator();
  generator.downloadTemplate();
}

/**
 * Función de conveniencia para descargar TODOS los catálogos (ODISEO + Sistema Integral)
 */
export function downloadAllCatalogsTemplate(): void {
  try {
    const generator = new CatalogTemplateGenerator();
    const blob = generator.generateAllCatalogsTemplate();

    if (!blob || blob.size === 0) {
      console.error("Error: El blob está vacío");
      alert("Error: No se pudo generar el archivo. Verifique la consola.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Todos_Catalogos_Completo_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("Descarga iniciada correctamente");
  } catch (error) {
    console.error("Error al descargar catálogos:", error);
    alert("Error al descargar catálogos. Verifique la consola.");
  }
}

/**
 * Función de conveniencia para generar la plantilla como Blob
 */
export function generateCatalogsTemplateBlob(): Blob {
  const generator = new CatalogTemplateGenerator();
  return generator.generateCompleteTemplate();
}

/**
 * Aplica formato profesional a un worksheet
 * Incluye: encabezados de color, zebra striping, bordes, alineación, congelación y filtros
 */
export function applyProfessionalFormattingToSheet(
  ws: XLSX.WorkSheet,
  data: any[],
  options?: {
    frozenRows?: number;
    headerColor?: string;
    alternateRowColor?: string;
  }
): void {
  if (data.length === 0) return;

  const frozenRows = options?.frozenRows ?? 1;
  const headerColor = options?.headerColor ?? "1F4E78";
  const alternateRowColor = options?.alternateRowColor ?? "F2F2F2";

  const keys = Object.keys(data[0]);

  // Estilos para encabezados
  const headerStyle = {
    fill: { fgColor: { rgb: headerColor } },
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
    fill: { fgColor: { rgb: alternateRowColor } },
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
    fill: { fgColor: { rgb: "FFFFFF" } },
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

  // Ajustar ancho de columnas
  const colWidths = keys.map((key) => ({
    wch: Math.max(
      key.length + 2,
      Math.max(
        ...data.map((row) => String(row[key] || "").length + 2)
      )
    ),
  }));
  ws["!cols"] = colWidths;

  // Congelar fila de encabezado
  ws["!freeze"] = { xSplit: 0, ySplit: frozenRows };

  // Agregar filtros automáticos
  ws["!autofilter"] = {
    ref: `A1:${XLSX.utils.encode_col(keys.length - 1)}${data.length + 1}`,
  };
}

/**
 * Aplica formato profesional a un worksheet existente sin necesidad de pasar datos
 * Detecta dinámicamente filas y columnas del worksheet
 */
export function applyProfessionalFormattingToSheetAuto(
  ws: XLSX.WorkSheet,
  options?: {
    headerColor?: string;
    alternateRowColor?: string;
  }
): void {
  const headerColor = options?.headerColor ?? "1F4E78";
  const alternateRowColor = options?.alternateRowColor ?? "F2F2F2";

  // Detectar rango de datos
  if (!ws["!ref"]) return;

  const range = XLSX.utils.decode_range(ws["!ref"]);
  const colCount = range.e.c + 1;
  const rowCount = range.e.r + 1;

  // Estilos para encabezados
  const headerStyle = {
    fill: { fgColor: { rgb: headerColor } },
    font: { bold: true, color: { rgb: "FFFFFF" }, size: 11 },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Estilos para filas pares
  const evenRowStyle = {
    fill: { fgColor: { rgb: alternateRowColor } },
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
    fill: { fgColor: { rgb: "FFFFFF" } },
    font: { size: 10 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  };

  // Aplicar estilos a encabezados (fila 1)
  for (let col = 0; col < colCount; col++) {
    const cellRef = XLSX.utils.encode_col(col) + "1";
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle;
    }
  }

  // Aplicar estilos a datos
  for (let row = 1; row < rowCount; row++) {
    const rowStyle = row % 2 === 1 ? evenRowStyle : oddRowStyle;
    for (let col = 0; col < colCount; col++) {
      const cellRef = XLSX.utils.encode_col(col) + (row + 1);
      if (ws[cellRef]) {
        ws[cellRef].s = rowStyle;
      }
    }
  }

  // Congelar fila de encabezado
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Agregar filtros automáticos
  ws["!autofilter"] = {
    ref: `A1:${XLSX.utils.encode_col(colCount - 1)}${rowCount}`,
  };
}
