import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, Upload, AlertCircle, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import Button from "../ui/Button";
import ClientSearch from "../forms/ClientSearch";
import PreviewRow from "../display/PreviewRow";

import * as portfolioStorage from "../../data/portfolioStorage";
import { createProjectFromPortfolio, saveProjectRecord, getProjectRecords } from "../../data/projectStorage";
import { getActiveUnitMeasureOptions } from "../../data/unitMeasureCatalog";
import { getActiveMaterialGroupOptions, getMaterialLayerOptionsByGroup } from "../../data/productMaterialCatalog";
import { getActiveModificationOptionsByClassification, normalizeProductClassificationToCatalog } from "../../data/productModificationCatalog";
import { generateSKUForNewRequest } from "../../utils/productSkuCodeUtils";
import { generateNewEDAG, generateNewEM } from "../../utils/productCodeRules";
import { isRegisteredProductStructureByCodes, type ProductStructureType } from "../../data/productStructureMatrix";

type AnyRecord = Record<string, unknown>;
type PortfolioRecord = AnyRecord;
type ClientRecord = AnyRecord;

interface BulkProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
  portfolioContext?: {
    portfolioCode?: string;
    clientName?: string;
    [key: string]: any;
  };
}

interface ImportRow {
  rowNum: number;
  classification: string;
  modification: string;
  currentSkuCode?: string;
  currentSkuVersion?: string;
  productName: string;
  volume?: string;
  unit?: string;
  description?: string;
  materials: Array<{ code?: string; micron?: string }>;
  comments?: string;
  validationStatus: "valid" | "observed" | "rejected";
  validationMessage: string;
  errors: Array<{ column: string; message: string }>;
}

type Step = "context" | "template" | "upload" | "preview" | "complete";

const TEMPLATE_COLUMNS = [
  "Clasificación",
  "Modificación",
  "SKU Actual / Base",
  "Versión SKU Actual",
  "Nombre del Producto",
  "Volumen Referencial",
  "Unidad",
  "Descripción de necesidad",
  "Material Capa 1",
  "Micraje Capa 1",
  "Material Capa 2",
  "Micraje Capa 2",
  "Material Capa 3",
  "Micraje Capa 3",
  "Material Capa 4",
  "Micraje Capa 4",
  "Comentarios",
];

const normalizeText = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getRecordValue = (record: unknown, keys: string[]): string => {
  const source = record as AnyRecord | null;
  if (!source) return "";
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
};

const getPortfolioCode = (portfolio: PortfolioRecord | null | undefined) =>
  getRecordValue(portfolio, ["codigo", "code", "id", "portfolioCode"]);

const getPortfolioName = (portfolio: PortfolioRecord | null | undefined) =>
  getRecordValue(portfolio, ["nombre", "name", "nom", "nombrePortafolio"]);

const getClientName = (portfolio: PortfolioRecord | null | undefined) =>
  getRecordValue(portfolio, ["clientName", "cliente", "cli", "nombreCliente"]);

const getMaterialOptions = (): Array<{ value: string; label: string }> => {
  const groups = getActiveMaterialGroupOptions() || [];
  const allMaterials: Array<{ value: string; label: string }> = [];
  for (const group of groups) {
    const materials = getMaterialLayerOptionsByGroup(group.value) || [];
    allMaterials.push(
      ...materials.map((m) => ({
        value: m.code || "",
        label: m.materialName || "",
      }))
    );
  }
  return allMaterials;
};

const getStructureType = (materialCount: number): ProductStructureType => {
  if (materialCount === 2) return "Bilaminado";
  if (materialCount === 3) return "Trilaminado";
  if (materialCount === 4) return "Tetralaminado";
  return "Monocapa";
};

const generateTemplate = (portfolio?: PortfolioRecord): void => {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Datos (solo 1 registro de ejemplo)
  const dataSheet = [TEMPLATE_COLUMNS];
  const sample = [
    "Producto Nuevo",
    "Nueva estructura",
    "",
    "",
    "Producto Ejemplo",
    "1000",
    "Kg",
    "Nueva solicitud de producto",
    "PEBD Blanco",
    "100",
    "",
    "",
    "",
    "",
    "",
    "",
    "Comentarios opcionales",
  ];
  dataSheet.push(sample);
  const wsData = XLSX.utils.aoa_to_sheet(dataSheet);
  wsData['!cols'] = [
    { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 18 },
    { wch: 28 }, { wch: 18 }, { wch: 10 }, { wch: 28 },
    { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
    { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 25 }
  ];
  XLSX.utils.book_append_sheet(wb, wsData, "Importación Masiva");

  // Hoja 2: Instrucciones (mejorada)
  const instructions = [
    ["📋 GUÍA RÁPIDA - IMPORTACIÓN MASIVA DE PRODUCTOS"],
    [],
    ["1️⃣ ANTES DE EMPEZAR"],
    ["• Usa la hoja 'Catálogos' para ver los valores válidos"],
    ["• Todos los campos obligatorios deben completarse"],
    ["• Los materiales pueden ser nombres o códigos (ej: PEBD Blanco = MATCAP-033)"],
    [],
    ["2️⃣ CAMPOS OBLIGATORIOS"],
    ["Clasificación", "Producto Nuevo o Producto Modificado"],
    ["Modificación", "Según la clasificación (ver Catálogos)"],
    ["Nombre del Producto", "Descripción clara del producto"],
    ["Volumen", "Número en cantidad"],
    ["Unidad", "G, ML, L, KG, OZ o UNI"],
    ["Descripción", "Explicar la necesidad del producto"],
    ["Material Capa 1", "Nombre del material (obligatorio)"],
    ["Micraje Capa 1", "Espesor en micrones"],
    [],
    ["3️⃣ CAMPOS PARA PRODUCTO MODIFICADO"],
    ["SKU Actual/Base", "Código del producto a modificar"],
    ["Versión SKU", "Número de versión actual"],
    [],
    ["4️⃣ TIPOS DE ESTRUCTURA"],
    ["Monocapa", "1 material"],
    ["Bilaminado", "2 materiales (Material Capa 2 obligatorio)"],
    ["Trilaminado", "3 materiales (Material Capa 3 obligatorio)"],
    ["Tetralaminado", "4 materiales (Material Capa 4 obligatorio)"],
    [],
    ["5️⃣ CÓMO CARGAR"],
    ["Paso 1: Completa los datos en la hoja 'Importación Masiva'"],
    ["Paso 2: Abre ODISEO → Gestión de Productos → Importar"],
    ["Paso 3: Selecciona Cliente y Portafolio"],
    ["Paso 4: Carga este archivo Excel"],
    ["Paso 5: Revisa los errores (si existen)"],
    ["Paso 6: Importa las filas válidas"],
    [],
    ["⚠️ ERRORES COMUNES"],
    ["Material no válido", "Verifica que esté en Catálogos"],
    ["Unidad incorrecta", "Solo G, ML, L, KG, OZ, UNI"],
    ["Combinación no válida", "Esa combinación de materiales no existe"],
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
  wsInstructions['!cols'] = [{ wch: 35 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, "Guía");

  // Hoja 3: Catálogos en columnas (obtener dinámicamente)
  const catalogsData: string[][] = [];

  // Obtener datos dinámicamente
  const clasificaciones = ["Producto Nuevo", "Producto Modificado"];
  const modNuevaOptions = getActiveModificationOptionsByClassification("Producto Nuevo") || [];
  const modNueva = modNuevaOptions.map((m) => m.label);
  const modModificadaOptions = getActiveModificationOptionsByClassification("Producto Modificado") || [];
  const modModificada = modModificadaOptions.map((m) => m.label);
  const unidadesOptions = getActiveUnitMeasureOptions() || [];
  const unidades = unidadesOptions.map((u) => u.label);
  const materialsAll = getMaterialOptions() || [];
  const materiales = materialsAll.map((m) => ({ codigo: m.value, nombre: m.label }));

  // Fila de encabezados
  catalogsData.push([
    "CLASIFICACIÓN",
    "MODIFICACIÓN NUEVA",
    "MODIFICACIÓN MODIFICADO",
    "UNIDAD",
    "MATERIAL (Código)",
    "MATERIAL (Nombre)",
  ]);

  const maxRows = Math.max(
    clasificaciones.length,
    modNueva.length,
    modModificada.length,
    unidades.length,
    materiales.length
  );

  for (let i = 0; i < maxRows; i++) {
    catalogsData.push([
      clasificaciones[i] || "",
      modNueva[i] || "",
      modModificada[i] || "",
      unidades[i] || "",
      materiales[i]?.codigo || "",
      materiales[i]?.nombre || "",
    ]);
  }

  const wsCatalogs = XLSX.utils.aoa_to_sheet(catalogsData);
  wsCatalogs['!cols'] = [
    { wch: 20 }, { wch: 28 }, { wch: 28 }, { wch: 12 },
    { wch: 18 }, { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(wb, wsCatalogs, "Catálogos");

  XLSX.writeFile(wb, "plantilla-importar-productos.xlsx");
};

const validateRow = (
  row: any,
  index: number,
  materials: Array<{ value: string; label?: string }>,
  portfolioCode?: string,
  existingProducts?: Array<{ projectName?: string; name?: string; nombreProducto?: string }>
): ImportRow => {
  const classification = String(row["Clasificación"] || "").trim();
  const modification = String(row["Modificación"] || "").trim();
  const productName = String(row["Nombre del Producto"] || "").trim();
  const volume = String(row["Volumen Referencial"] || "").trim();
  const unit = String(row["Unidad"] || "").trim();
  const description = String(row["Descripción de necesidad"] || "").trim();
  const currentSkuCode = String(row["SKU Actual / Base"] || "").trim();
  const currentSkuVersion = String(row["Versión SKU Actual"] || "").trim();
  const comments = String(row["Comentarios"] || "").trim();

  const materialsCodes = materials.map((m) => m.value);

  // Mapa bidireccional: nombre→código y código→código
  const materialMap = new Map<string, string>();
  materials.forEach((m) => {
    materialMap.set(normalizeText(m.label || ""), m.value);
    materialMap.set(normalizeText(m.value), m.value); // código mapea a sí mismo
  });

  const importMaterials = [
    { code: row["Material Capa 1"], micron: row["Micraje Capa 1"] },
    { code: row["Material Capa 2"], micron: row["Micraje Capa 2"] },
    { code: row["Material Capa 3"], micron: row["Micraje Capa 3"] },
    { code: row["Material Capa 4"], micron: row["Micraje Capa 4"] },
  ].map((m) => {
    if (!m.code) return m;
    const mappedCode = materialMap.get(normalizeText(m.code));
    return { ...m, code: mappedCode || m.code };
  }).filter((m) => m.code);

  const errors: Array<{ column: string; message: string }> = [];

  if (!classification) errors.push({ column: "Clasificación", message: "Clasificación obligatoria" });
  const normalizedClassification = normalizeProductClassificationToCatalog(classification);
  if (normalizedClassification !== "Producto Nuevo" && normalizedClassification !== "Producto Modificado") {
    errors.push({ column: "Clasificación", message: "Clasificación inválida (debe ser Producto Nuevo o Producto Modificado)" });
  }

  if (!modification) errors.push({ column: "Modificación", message: "Modificación obligatoria" });
  if (modification && normalizedClassification) {
    const validModifications = getActiveModificationOptionsByClassification(normalizedClassification);
    const modValid = validModifications.some((m) => normalizeText(m.label) === normalizeText(modification));
    if (!modValid) errors.push({ column: "Modificación", message: `Modificación inválida para ${normalizedClassification}` });
  }

  if (!productName) errors.push({ column: "Nombre del Producto", message: "Nombre del Producto obligatorio" });

  // Validar si el producto ya existe en el portafolio
  if (productName && existingProducts && existingProducts.length > 0) {
    const existingProduct = existingProducts.find((p) => {
      const existingName = String(
        p.projectName ||
        (p as any).projectName ||
        p.name ||
        (p as any).name ||
        p.nombreProducto ||
        (p as any).nombreProducto ||
        (p as any).productName ||
        ""
      ).trim();
      return normalizeText(existingName) === normalizeText(productName);
    });
    if (existingProduct) {
      errors.push({ column: "Nombre del Producto", message: "Producto existente - Ya existe un producto con este nombre en el portafolio" });
    }
  }

  if (!volume) errors.push({ column: "Volumen Referencial", message: "Volumen Referencial obligatorio" });
  if (!unit) errors.push({ column: "Unidad", message: "Unidad obligatoria" });
  const unitOptions = getActiveUnitMeasureOptions();
  if (unit && !unitOptions.some((u) => normalizeText(u.value) === normalizeText(unit) || normalizeText(u.label) === normalizeText(unit))) {
    errors.push({ column: "Unidad", message: "Unidad no válida" });
  }
  if (!description) errors.push({ column: "Descripción de necesidad", message: "Descripción de necesidad obligatoria" });

  if (normalizedClassification === "Producto Modificado") {
    if (!currentSkuCode) errors.push({ column: "SKU Actual / Base", message: "SKU Actual / Base requerido para Producto Modificado" });
    if (!currentSkuVersion) errors.push({ column: "Versión SKU Actual", message: "Versión SKU Actual requerida para Producto Modificado" });
  }

  // Validar materiales individuales (ahora con códigos normalizados)
  for (let i = 0; i < importMaterials.length; i++) {
    const mat = importMaterials[i];
    if (mat.code && !materialsCodes.includes(mat.code)) {
      const layerNum = i + 1;
      errors.push({ column: `Material Capa ${layerNum}`, message: `Material "${mat.code}" no válido` });
    }
  }

  // Validar combinación de materiales contra matriz de homologaciones
  if (importMaterials.length > 0 && errors.length === 0) {
    const materialCount = importMaterials.filter((m) => m.code).length;
    const structureType = getStructureType(materialCount);
    const selectedMaterialCodes = importMaterials.map((m) => m.code).filter(Boolean);

    const isValidCombination = isRegisteredProductStructureByCodes({
      structureType,
      selectedMaterialCodes,
    });

    if (!isValidCombination) {
      // Mostrar nombres de materiales en lugar de códigos en el error
      const materialNames = importMaterials
        .filter((m) => m.code)
        .map((m) => {
          const material = materials.find((mat) => mat.value === m.code);
          return material?.label || m.code;
        });
      const combinationStr = materialNames.join(" + ");
      errors.push({ column: "Materiales", message: `Combinación ${structureType} no validada: ${combinationStr}` });
    }
  }

  const validationMessage = errors.length > 0
    ? errors.map((e) => `${e.column}: ${e.message}`).join(" | ")
    : "Válido";

  return {
    rowNum: index + 1,
    classification,
    modification,
    currentSkuCode: currentSkuCode || undefined,
    currentSkuVersion: currentSkuVersion || undefined,
    productName,
    volume,
    unit,
    description,
    materials: importMaterials,
    comments,
    validationStatus: errors.length > 0 ? "rejected" : "valid",
    validationMessage,
    errors,
  };
};

export default function BulkProductImportModal({
  isOpen,
  onClose,
  onImportComplete,
  portfolioContext,
}: BulkProductImportModalProps) {
  const [step, setStep] = useState<Step>("context");
  const [clientSearchValue, setClientSearchValue] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<{ id: string; code: string; businessName: string } | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioRecord | null>(null);
  const [uploadedRows, setUploadedRows] = useState<ImportRow[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [importSummary, setImportSummary] = useState<{
    total: number;
    valid: number;
    observed: number;
    rejected: number;
    created: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("context");
      setClientSearchValue("");
      setSelectedClient(null);
      setSelectedPortfolio(null);
      setUploadedRows([]);
      setValidationError("");
      setImportSummary(null);
    }
  }, [isOpen]);

  const materialOptions = useMemo(() => getMaterialOptions(), []);
  const unitOptions = useMemo(() => getActiveUnitMeasureOptions(), []);

  const portfolioMatches = useMemo(() => {
    if (!selectedClient) return [];
    const allPortfolios = portfolioStorage.getPortfolioDisplayRecords();
    return allPortfolios.filter((p) => {
      const pClientCode = normalizeText(getRecordValue(p, ["clientCode", "codigoCliente", "cli", "codigo"]));
      const pClientName = normalizeText(getClientName(p));
      const selectedCode = normalizeText(selectedClient.code);
      const selectedName = normalizeText(selectedClient.businessName);
      return (selectedCode && pClientCode === selectedCode) || (selectedName && pClientName === selectedName);
    });
  }, [selectedClient]);

  const portfolioInheritance = useMemo(() => {
    if (!selectedPortfolio) return null;
    return {
      portfolio: getPortfolioCode(selectedPortfolio),
      cliente: getClientName(selectedPortfolio),
      planta: getRecordValue(selectedPortfolio, ["plantaName", "plantName", "planta", "pl"]),
      ejecutivo: getRecordValue(selectedPortfolio, ["ejecutivoName", "ejecutivo", "ej"]),
      envoltura: getRecordValue(selectedPortfolio, ["envoltura", "wrappingName", "env"]),
      usoFinal: getRecordValue(selectedPortfolio, ["usoFinal", "useFinalName", "uf"]),
      segmento: getRecordValue(selectedPortfolio, ["segmento", "seg"]),
      subSegmento: getRecordValue(selectedPortfolio, ["subSegmento", "subseg"]),
      sector: getRecordValue(selectedPortfolio, ["sector"]),
      afMarketId: getRecordValue(selectedPortfolio, ["afMarketId", "af"]),
      maquinaEnvasado: getRecordValue(selectedPortfolio, ["maquinaCliente", "maq", "maquina"]),
    };
  }, [selectedPortfolio]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet);

        // Obtener productos existentes del portafolio
        const portfolioCode = selectedPortfolio ? getPortfolioCode(selectedPortfolio) : undefined;
        const existingProjects = portfolioCode ? getProjectRecords().filter((p) => {
          // Buscar portafolio del proyecto en múltiples propiedades
          const pPortfolioCode = String(
            p.portfolioCode ||
            (p as any).portfolioId ||
            (p as any).portfolioCodigo ||
            (p as any).codigo ||
            ""
          ).trim();

          // Comparar normalizando ambos códigos
          const portfolioMatches = normalizeText(pPortfolioCode) === normalizeText(portfolioCode);
          return portfolioMatches;
        }) : [];

        const validated = rows.map((row, idx) =>
          validateRow(row, idx, materialOptions, portfolioCode, existingProjects)
        );
        setUploadedRows(validated);
        setStep("preview");
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Error al leer el archivo");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    const validRows = uploadedRows.filter((r) => r.validationStatus === "valid");
    let created = 0;

    try {
      for (const row of validRows) {
        if (!selectedPortfolio) break;

        const normalizedClassification = normalizeProductClassificationToCatalog(row.classification);
        const isNuevo = normalizedClassification === "Producto Nuevo";

        let skuCode = "";
        if (isNuevo) {
          const skuResult = generateSKUForNewRequest("Producto Nuevo", []);
          skuCode = skuResult.skuCode;
        } else if (row.currentSkuCode && row.currentSkuVersion) {
          const skuResult = generateSKUForNewRequest("Producto Modificado", [], row.currentSkuCode);
          skuCode = skuResult.skuCode;
        }

        const edagCode = generateNewEDAG(1);
        const emCode = generateNewEM(1);

        const materialCount = row.materials.filter((m) => m.code).length;
        const structureType = getStructureType(materialCount);

        const technicalName = [
          row.productName,
          row.volume,
          row.unit,
          portfolioInheritance?.envoltura,
          ...row.materials.map((m) => m.code).filter(Boolean),
        ]
          .filter(Boolean)
          .join(" - ");

        const projectData = createProjectFromPortfolio({
          portfolio: selectedPortfolio,
          initialData: {
            clasificacion: row.classification,
            tipoProyecto: row.modification,
            motivoModificacion: row.modification,
            licitacion: "No" as const,
            projectName: row.productName,
            volumenCantidadReferencial: row.volume,
            unidad: row.unit,
            descripcionNecesidad: row.description,
            comentarios: row.comments,
            estructuraCalculada: structureType,
            nombreCalculado: technicalName,
            layer1Material: row.materials[0]?.code || "",
            layer1Micron: row.materials[0]?.micron || "",
            layer2Material: row.materials[1]?.code || "",
            layer2Micron: row.materials[1]?.micron || "",
            layer3Material: row.materials[2]?.code || "",
            layer3Micron: row.materials[2]?.micron || "",
            layer4Material: row.materials[3]?.code || "",
            layer4Micron: row.materials[3]?.micron || "",
          },
        });

        // Store the generated SKU code
        if (skuCode) {
          projectData.skuCode = skuCode;
          projectData.currentSkuCode = skuCode;
        }

        saveProjectRecord(projectData);
        created++;
      }

      setImportSummary({
        total: uploadedRows.length,
        valid: validRows.length,
        observed: uploadedRows.filter((r) => r.validationStatus === "observed").length,
        rejected: uploadedRows.filter((r) => r.validationStatus === "rejected").length,
        created,
      });

      setStep("complete");
    } catch (error) {
      console.error("Error importing products:", error);
      alert("Error al importar productos");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-[1400px] w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Importar Productos</h2>
              <p className="text-sm text-slate-500 mt-1">Carga masiva de productos desde plantilla</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Portafolio Context Banner */}
          {selectedPortfolio && step !== "context" && (
            <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
              <p className="text-xs font-semibold text-blue-900">
                📋 Portafolio: <span className="font-bold">{getPortfolioCode(selectedPortfolio)}</span> ({getPortfolioName(selectedPortfolio)})
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Todos los productos se importarán a este portafolio
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "context" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Cliente *</label>
                <ClientSearch
                  value={clientSearchValue}
                  onChange={(value) => {
                    setClientSearchValue(value);
                    if (!value) {
                      setSelectedClient(null);
                      setSelectedPortfolio(null);
                      setValidationError("");
                    }
                  }}
                  onSelect={(client) => {
                    setClientSearchValue(client.id);
                    setSelectedClient({
                      id: client.id,
                      code: client.code || "",
                      businessName: client.businessName || "",
                    });
                    setSelectedPortfolio(null);
                    setValidationError("");
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Portafolio Base *
                  {!selectedClient && <span className="text-slate-400 font-normal text-xs ml-2">(Selecciona cliente primero)</span>}
                </label>
                <select
                  value={selectedPortfolio ? getPortfolioCode(selectedPortfolio) : ""}
                  onChange={(e) => {
                    const portfolio = portfolioMatches.find((p) => getPortfolioCode(p) === e.target.value);
                    setSelectedPortfolio(portfolio || null);
                    if (portfolio) setValidationError("");
                  }}
                  disabled={!selectedClient}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedClient ? "Selecciona un cliente primero" : "Seleccionar portafolio..."}
                  </option>
                  {portfolioMatches.map((p) => (
                    <option key={getPortfolioCode(p)} value={getPortfolioCode(p)}>
                      {getPortfolioCode(p)} - {getPortfolioName(p)}
                    </option>
                  ))}
                </select>
              </div>

              {portfolioInheritance && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Herencia del Portafolio</h3>
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">PORTAFOLIO</p>
                      <p className="text-slate-900">{portfolioInheritance.portfolio}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">CLIENTE</p>
                      <p className="text-slate-900">{portfolioInheritance.cliente}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">PLANTA</p>
                      <p className="text-slate-900">{portfolioInheritance.planta}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">EJECUTIVO</p>
                      <p className="text-slate-900">{portfolioInheritance.ejecutivo || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">ENVOLTURA</p>
                      <p className="text-slate-900">{portfolioInheritance.envoltura}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">USO FINAL</p>
                      <p className="text-slate-900">{portfolioInheritance.usoFinal}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">SUBSEGMENTO</p>
                      <p className="text-slate-900">{portfolioInheritance.subSegmento || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">SECTOR</p>
                      <p className="text-slate-900">{portfolioInheritance.sector || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">AF MARKET ID</p>
                      <p className="text-slate-900">{portfolioInheritance.afMarketId || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-slate-600 font-medium">MÁQUINA DE ENVASADO</p>
                      <p className="text-slate-900">{portfolioInheritance.maquinaEnvasado || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "template" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Plantilla de Importación</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Descarga la plantilla vacía con un registro de ejemplo
                  </p>
                </div>
                <Button onClick={() => generateTemplate(selectedPortfolio || undefined)} variant="secondary" size="sm">
                  <Download size={16} /> Descargar
                </Button>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-mono text-slate-700 break-words">
                  {TEMPLATE_COLUMNS.join(" | ")}
                </p>
              </div>
            </div>
          )}

          {step === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                  <p className="font-semibold text-slate-900">Haz clic para subir archivo</p>
                  <p className="text-xs text-slate-500">Soporta .xlsx, .xls o .csv</p>
                </label>
              </div>
            </div>
          )}

          {step === "preview" && uploadedRows.length > 0 && (
            <div className="space-y-4">
              {/* Resumen de validación */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">Total filas cargadas</p>
                    <p className="text-lg text-slate-700">{uploadedRows.length}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Filas válidas</p>
                    <p className="text-lg text-green-700 font-bold">{uploadedRows.filter(r => r.validationStatus === "valid").length}</p>
                  </div>
                  {uploadedRows.filter(r => r.validationStatus === "rejected").length > 0 && (
                    <div className="col-span-2">
                      <p className="font-semibold text-slate-900">Filas rechazadas</p>
                      <p className="text-lg text-red-700 font-bold">{uploadedRows.filter(r => r.validationStatus === "rejected").length}</p>
                      <p className="text-xs text-red-600 mt-1">Revisa los errores abajo para cada fila rechazada</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 w-12">Fila</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 w-[117px]">SKU</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 w-[117px]">Clasificación</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 w-32">Modificación</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 w-[192px]">Producto</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 w-[324px]">Materiales</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-900 w-24">Estado</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 flex-1">Detalles de Errores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedRows.map((row) => (
                      <tr key={row.rowNum} className={`border-t border-slate-200 hover:bg-slate-50 ${
                        row.validationStatus === "rejected" ? "bg-red-50" : row.validationStatus === "valid" ? "bg-green-50" : "bg-yellow-50"
                      }`}>
                        <td className="px-4 py-3 font-semibold text-slate-900">{row.rowNum}</td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {row.currentSkuCode ? (
                            <span className="text-slate-900 font-semibold">{row.currentSkuCode}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{row.classification}</td>
                        <td className="px-4 py-3 text-slate-700">{row.modification}</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{row.productName}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {row.materials && row.materials.length > 0 ? (
                            <span className="text-sm">
                              {row.materials.map((mat, idx) => {
                                const materialLabel = materialOptions.find((m) => m.value === mat.code)?.label || mat.code;
                                return (
                                  <span key={idx}>
                                    {materialLabel} - {mat.micron}
                                    {idx < row.materials.length - 1 && " / "}
                                  </span>
                                );
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Sin materiales</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              row.validationStatus === "valid"
                                ? "bg-green-200 text-green-800"
                                : row.validationStatus === "observed"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-red-200 text-red-800"
                            }`}
                          >
                            {row.validationStatus === "valid" && <CheckCircle size={14} />}
                            {row.validationStatus === "observed" && <AlertCircle size={14} />}
                            {row.validationStatus === "rejected" && <XCircle size={14} />}
                            {row.validationStatus === "valid" ? "Válido" : row.validationStatus === "observed" ? "Observado" : "Rechazado"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {row.validationStatus === "valid" ? (
                            <span className="text-green-700 font-medium">✓ Válido</span>
                          ) : row.errors && row.errors.length > 0 ? (
                            <div className="space-y-0.5 text-xs">
                              {row.errors.map((error, idx) => (
                                <div key={idx} className="text-red-700">
                                  <span className="font-bold">{error.column}:</span> {error.message}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">Sin detalles</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === "complete" && importSummary && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900">
                  ✅ {importSummary.created} productos importados a:{" "}
                  <span className="text-blue-700">
                    {getPortfolioCode(selectedPortfolio)} - {getPortfolioName(selectedPortfolio)}
                  </span>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Resumen de Importación</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Total filas leídas:</span> {importSummary.total}
                  </p>
                  <p>
                    <span className="font-medium text-green-700">Filas válidas:</span> {importSummary.valid}
                  </p>
                  <p>
                    <span className="font-medium text-yellow-700">Filas observadas:</span> {importSummary.observed}
                  </p>
                  <p>
                    <span className="font-medium text-red-700">Filas rechazadas:</span> {importSummary.rejected}
                  </p>
                  <p>
                    <span className="font-medium text-blue-700">Productos creados:</span> {importSummary.created}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-600">
              {step === "context" && "Paso 1 de 5: Selección de contexto"}
              {step === "template" && "Paso 2 de 5: Plantilla"}
              {step === "upload" && "Paso 3 de 5: Carga de archivo"}
              {step === "preview" && "Paso 4 de 5: Validación"}
              {step === "complete" && "Paso 5 de 5: Completado"}
            </div>
          </div>

          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs font-medium text-red-700">⚠️ {validationError}</p>
            </div>
          )}
          {step === "preview" && uploadedRows.filter(r => r.validationStatus === "valid").length === 0 && (
            <div className="text-xs text-red-600 font-medium mb-3">
              ❌ No hay filas válidas para importar. Revisa los errores arriba y corrige el archivo.
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              style={{ backgroundColor: "#9ca3af", color: "white" }}
              className="hover:bg-[#6b7280]"
            >
              Cancelar
            </Button>

            {step === "context" && (
              <Button
                onClick={() => {
                  if (!selectedClient || !selectedPortfolio) {
                    setValidationError(!selectedClient ? "Debes seleccionar un cliente" : "Debes seleccionar un portafolio");
                  } else {
                    setValidationError("");
                    setStep("template");
                  }
                }}
              >
                Siguiente <ChevronRight size={16} />
              </Button>
            )}

            {step === "template" && (
              <>
                <Button
                  onClick={() => setStep("context")}
                >
                  Atrás
                </Button>
                <Button onClick={() => setStep("upload")}>
                  Siguiente <ChevronRight size={16} />
                </Button>
              </>
            )}

            {step === "upload" && (
              <>
                <Button onClick={() => setStep("template")}>
                  Atrás
                </Button>
              </>
            )}

            {step === "preview" && uploadedRows.length > 0 && (
              <>
                <Button onClick={() => setStep("upload")}>
                  Atrás
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={uploadedRows.filter((r) => r.validationStatus === "valid").length === 0}
                  title={uploadedRows.filter((r) => r.validationStatus === "valid").length === 0 ? "No hay filas válidas para importar" : ""}
                >
                  Importar filas válidas ({uploadedRows.filter((r) => r.validationStatus === "valid").length})
                </Button>
              </>
            )}

            {step === "complete" && (
              <Button
                onClick={() => {
                  onClose();
                  onImportComplete?.();
                }}
              >
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
