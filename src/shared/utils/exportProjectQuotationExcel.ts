import * as XLSX from "xlsx";
import type { ProjectRecord } from "../data/projectStorage";
import type { PortfolioRecord } from "../data/portfolioStorage";
import type { ProjectPreliminaryProductRecord } from "../data/projectProductStorage";

export function exportProjectQuotationExcel(params: {
  project: ProjectRecord;
  portfolio: PortfolioRecord | null;
  products: ProjectPreliminaryProductRecord[];
}): void {
  const { project, portfolio, products } = params;
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-AR").replace(/\//g, "");

  // Build rows with all required fields
  const rows = products.map((product) => ({
    // DATOS DEL PROYECTO
    "Código Proyecto": project.code || "",
    "Nombre Proyecto": project.projectName || "",
    "Acción Salesforce": project.salesforceAction || "",
    "Cliente": project.clientName || "",
    "Portafolio": project.portfolioCode || "",
    "Ejecutivo Comercial": project.ejecutivoName || "",
    "Planta": project.plantaName || "",
    "Fecha Exportación": now.toLocaleDateString("es-AR"),

    // DATOS DEL PRODUCTO PRELIMINAR
    "Código Producto": product.preliminaryProductCode || "",
    "Nombre Producto": product.name || "",
    "Tipo Producto": product.productType || "",
    "Producto Origen": product.baseProductName || "",
    "Generación": product.generationLevel || 0,
    "Estado Producto": product.status || "",

    // DATOS COMERCIALES
    "Volumen Estimado": product.estimatedVolume || "",
    "Unidad de Medida": product.unitOfMeasure || "",
    "Precio Objetivo": product.targetPrice || "",
    "Moneda": product.currencyType || "",
    "Tipo de Venta": project.saleType || "",
    "Incoterm": project.incoterm || "",
    "País Destino": project.destinationCountry || "",

    // DATOS TÉCNICOS HEREDADOS
    "Envoltura": portfolio?.envoltura || "",
    "Uso Final": portfolio?.usoFinal || "",
    "Formato": product.blueprintFormat || "",
    "Aplicación Técnica": project.technicalApplication || "",
    "Tipo de Estructura": product.structureType || "",
    "Tipo de Impresión": product.printType || "",
    "Clase de Impresión": product.printClass || "",

    // ESTRUCTURA / CAPAS
    "Capa 1 - Material": product.layer1Material || "",
    "Capa 1 - Micraje": product.layer1Micron || "",
    "Capa 1 - Gramaje": product.layer1Grammage || "",
    "Capa 2 - Material": product.layer2Material || "",
    "Capa 2 - Micraje": product.layer2Micron || "",
    "Capa 2 - Gramaje": product.layer2Grammage || "",
    "Capa 3 - Material": product.layer3Material || "",
    "Capa 3 - Micraje": product.layer3Micron || "",
    "Capa 3 - Gramaje": product.layer3Grammage || "",
    "Capa 4 - Material": product.layer4Material || "",
    "Capa 4 - Micraje": product.layer4Micron || "",
    "Capa 4 - Gramaje": product.layer4Grammage || "",
    "Gramaje Total": product.grammage || "",
    "Tolerancia Gramaje": product.grammageTolerance || "",

    // DIMENSIONES
    "Ancho": product.width || "",
    "Largo": project.length || "",
    "Repetición": project.repetition || "",

    // ACCESORIOS
    "Zipper": product.hasZipper || "",
    "Tipo Zipper": product.zipperType || "",
    "Válvula": product.hasValve || "",
    "Tipo Válvula": product.valveType || "",
    "Refuerzo": product.hasReinforcement || "",
    "Espesor Refuerzo": product.reinforcementThickness || "",
    "Ancho Refuerzo": product.reinforcementWidth || "",
    "Esquinas Redondeadas": product.hasRoundedCorners || "",
    "Tipo Esquinas": product.roundedCornersType || "",
    "Perforación": product.hasPerforation || "",
    "Ubicación Perforación": product.perforationLocation || "",
    "Precorte": product.hasPreCut || "",
    "Tipo Precorte": product.preCutType || "",

    // DISEÑO
    "Requiere Diseño": project.requiresDesignWork ? "Sí" : "No",
    "Comentarios de Diseño": project.specialDesignComments || "",
    "Diseño de Referencia": project.isPreviousDesign ? "Sí" : "No",
    "Código EDAG": project.previousEdagCode || "",
    "Versión EDAG": project.previousEdagVersion || "",

    // OBSERVACIONES
    "Comentarios Comerciales": product.commercialComments || "",
  }));

  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for better readability
  const columnWidths = Array(Object.keys(rows[0] || {}).length).fill(18);
  worksheet["!cols"] = columnWidths.map((w) => ({ wch: w }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos a cotizar");

  // Generate filename
  const filename = `Cotizacion_${project.code}_${dateStr}.xlsx`;

  // Download
  XLSX.writeFile(workbook, filename);
}
