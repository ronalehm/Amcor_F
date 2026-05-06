import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getPortfolioDisplayRecords, TECHNICAL_APPLICATION_OPTIONS } from "../../../shared/data/portfolioStorage";
import {
  getProjectByCode,
  updateProjectRecord,
  type ProjectRecord,
  type BooleanLike,
  type YesNoPending,
} from "../../../shared/data/projectStorage";
import { getActiveExecutiveRecords } from "../../../shared/data/executiveStorage";
import { getActiveUsers } from "../../../shared/data/userStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import PortfolioSearch from "../../../shared/components/forms/PortfolioSearch";
import CommercialExecutiveMultiSearch from "../../../shared/components/forms/CommercialExecutiveMultiSearch";
import ProjectDocumentsSection from "../components/ProjectDocumentsSection";
import ProjectPlansUploadSection from "../components/ProjectPlansUploadSection";

type ProjectEditFormData = {
  portfolioCode: string;
  executiveId: string[];
  siUserId: string;

  projectName: string;
  projectDescription: string;
  classification: string;
  subClassification: string;
  projectType: string;
  salesforceAction: string;

  blueprintFormat: string;
  technicalApplication: string;
  estimatedVolume: string;
  unitOfMeasure: string;
  customerPackingCode: string;

  printClass: string;
  printType: string;
  requiresDesignWork: string;
  hasEdagReference: string;
  referenceEdagCode: string;
  referenceEdagVersion: string;
  specialDesignSpecs: string;
  specialDesignComments: string;
  edagCode: string;
  edagVersion: string;

  hasReferenceStructure: string;
  referenceEmCode: string;
  referenceEmVersion: string;
  hasCustomerTechnicalSpec: string;
  customerTechnicalSpecAttachment: string;
  structureType: string;

  layer1MaterialGroup: string;
  layer1Material: string;
  layer1Micron: string;
  layer1Grammage: string;
  layer2MaterialGroup: string;
  layer2Material: string;
  layer2Micron: string;
  layer2Grammage: string;
  layer3MaterialGroup: string;
  layer3Material: string;
  layer3Micron: string;
  layer3Grammage: string;
  layer4MaterialGroup: string;
  layer4Material: string;
  layer4Micron: string;
  layer4Grammage: string;

  specialStructureSpecs: string;
  grammage: string;
  grammageTolerance: string;
  sampleRequest: string;

  width: string;
  length: string;
  repetition: string;
  doyPackBase: string;
  gussetWidth: string;
  gussetType: string;

  hasZipper: string;
  zipperType: string;
  hasTinTie: string;
  hasValve: string;
  valveType: string;
  hasDieCutHandle: string;
  hasReinforcement: string;
  reinforcementThickness: string;
  reinforcementWidth: string;
  hasAngularCut: string;
  hasRoundedCorners: string;
  roundedCornersType: string;
  hasNotch: string;
  hasPerforation: string;
  pouchPerforationType: string;
  bagPerforationType: string;
  perforationLocation: string;
  hasPreCut: string;
  preCutType: string;
  otherAccessories: string;

  saleType: string;
  incoterm: string;
  destinationCountry: string;
  targetPrice: string;
  currencyType: string;
  coreMaterial: string;
  coreDiameter: string;
  externalDiameter: string;
  externalVariationPlus: string;
  externalVariationMinus: string;
  maxRollWeight: string;
  customerAdditionalInfo: string;
  peruvianProductLogo: string;
  printingFooter: string;
  deliveryAddress: string;
  additionalComment: string;

  designPlanFiles: string[];
};

const YES_NO_OPTIONS = [
  { value: "Sí", label: "Sí" },
  { value: "No", label: "No" },
];

const CLASSIFICATION_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Modificado", label: "Modificado" },
];

const SUBCLASSIFICATION_NUEVO_OPTIONS = [
  { value: "Desarrollo_RD", label: "Desarrollo_RD" },
  { value: "Área_Técnica", label: "Área_Técnica" },
];

const SUBCLASSIFICATION_MODIFICADO_OPTIONS = [
  { value: "Diseño y Dimensiones", label: "Diseño y Dimensiones" },
  { value: "Estructura", label: "Estructura" },
];

const PROJECT_TYPE_RD_OPTIONS = [
  { value: "Producto nuevo", label: "Producto nuevo" },
  { value: "Nuevo equipamiento de envasado", label: "Nuevo equipamiento de envasado" },
  { value: "Nuevos insumos", label: "Nuevos insumos" },
  { value: "Nueva estructura", label: "Nueva estructura" },
  { value: "Nuevo formato de envasado", label: "Nuevo formato de envasado" },
  { value: "Nuevos accesorios", label: "Nuevos accesorios" },
  { value: "Nuevos procesos por el lado del cliente", label: "Nuevos procesos por el lado del cliente" },
  { value: "Nuevas temperaturas de envasado y almacenaje", label: "Nuevas temperaturas de envasado y almacenaje" },
];

const PROJECT_TYPE_TECNICA_OPTIONS = [
  { value: "Extensión de línea por familia (EM de referencia)", label: "Extensión de línea por familia (EM de referencia)" },
  { value: "Modifica Dimensiones", label: "Modifica Dimensiones" },
  { value: "Modifica Propiedades", label: "Modifica Propiedades" },
  { value: "Portafolio Estándar", label: "Portafolio Estándar" },
  { value: "ICO (Intercompany), BCP (Business Continous Production)", label: "ICO (Intercompany), BCP (Business Continous Production)" },
];

const POUCH_FORMAT_OPTIONS = [
  { value: "POUCH C/SELLO EN FUELLE\\TIPO 4-1\\FUELLE PROPIO", label: "POUCH C/SELLO EN FUELLE\\TIPO 4-1\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\TIPO K\\FUELLE PROPIO", label: "POUCH STAND UP\\TIPO K\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO", label: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE PROPIO", label: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE INSERTADO", label: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE INSERTADO" },
  { value: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE INSERTADO", label: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE INSERTADO" },
  { value: "POUCH STAND UP\\NORMAL\\FUELLE PROPIO", label: "POUCH STAND UP\\NORMAL\\FUELLE PROPIO" },
  { value: "POUCH PLANO\\DOS SELLOS", label: "POUCH PLANO\\DOS SELLOS" },
  { value: "POUCH PLANO\\TRES SELLOS", label: "POUCH PLANO\\TRES SELLOS" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE" },
  { value: "POUCH C/SELLO EN FUELLE\\TIPO 1-1", label: "POUCH C/SELLO EN FUELLE\\TIPO 1-1" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE (PE-PE/PE)", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE (PE-PE/PE)" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE (PE-PE/PE)", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE (PE-PE/PE)" },
];

const BOLSA_FORMAT_OPTIONS = [
  { value: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO", label: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO" },
  { value: "SELLO LATERAL\\PESTAÑA\\CON FUELLE FONDO", label: "SELLO LATERAL\\PESTAÑA\\CON FUELLE FONDO" },
  { value: "SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO", label: "SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO" },
  { value: "SELLO LATERAL\\CORTE\\SIN FUELLE FONDO", label: "SELLO LATERAL\\CORTE\\SIN FUELLE FONDO" },
  { value: "SELLO DE FONDO\\CON FUELLE LATERAL", label: "SELLO DE FONDO\\CON FUELLE LATERAL" },
  { value: "SELLO DE FONDO\\SIN FUELLE LATERAL", label: "SELLO DE FONDO\\SIN FUELLE LATERAL" },
  { value: "WICKET", label: "WICKET" },
  { value: "HOJAS", label: "HOJAS" },
];

const LAMINA_FORMAT_OPTIONS = [
  { value: "GENERICA", label: "GENERICA" },
  { value: "TISSUE", label: "TISSUE" },
  { value: "FOOD", label: "FOOD" },
];

function normalizeWrapping(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function normalizeWrappingName(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function getWrappingImage(name: string): string {
  const normalized = normalizeWrappingName(name);
  if (normalized.includes("lamina")) return "/assets/envolturas/lamina.png";
  if (normalized.includes("bolsa")) return "/assets/envolturas/bolsa.png";
  if (normalized.includes("pouch")) return "/assets/envolturas/pouch.png";
  return "/assets/envolturas/default.png";
}

function normalizeOptionValue(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function parseNumberInput(value: string): number | null {
  if (!value?.trim()) return null;
  const normalizedValue = value.replace(",", ".").trim();
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getBlueprintFormatOptions(wrapping: string | undefined): Array<{ value: string; label: string }> {
  if (!wrapping) return [];
  const normalized = normalizeWrapping(wrapping);
  if (normalized === "pouch") return POUCH_FORMAT_OPTIONS;
  if (normalized === "bolsa") return BOLSA_FORMAT_OPTIONS;
  if (normalized === "lamina") return LAMINA_FORMAT_OPTIONS;
  return [];
}

function extractMaterialGroupFromValue(materialValue: string): string {
  if (!materialValue) return "";
  const group = materialValue.split(" - ")[0];
  return Object.keys(MATERIAL_CATALOG).includes(group) ? group : "";
}

const STRUCTURE_FIXED_GRAMMAGE: Record<string, number> = {
  Monocapa: 2.5,
  Bilaminado: 5,
  Trilaminado: 7.5,
  Tetralaminado: 9.5,
};

function parseGrammageValue(value: string): number {
  if (!value?.trim()) return 0;

  const normalizedValue = value.replace(",", ".").trim();
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function isPdfFileName(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".pdf");
}

function formatGrammageValue(value: number): string {
  if (!Number.isFinite(value)) return "";

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.?0+$/, "");
}
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

function getMaterialTypeForSummary(materialValue: string): string {
  if (!materialValue) return "";

  const parts = materialValue.split(" - ");

  // Ejemplo:
  // "PAPEL - PAPEL ANTIGRASA - 60" => "PAPEL ANTIGRASA"
  // "COEX - PE BLANCO - Libre" => "PE BLANCO"
  if (parts.length >= 3) {
    return parts.slice(1, -1).join(" - ");
  }

  return materialValue;
}
const UNIT_OPTIONS = [
  { value: "KGS", label: "KGS" },
  { value: "MLL", label: "MLL" },
  { value: "MTS", label: "MTS" },
  { value: "MT2", label: "MT2" },
  { value: "LBS", label: "LBS" },
  { value: "UNI", label: "UNI" },
];

const PRINT_CLASS_OPTIONS = [
  { value: "Flexo", label: "Flexo" },
  { value: "Huecograbado", label: "Huecograbado" },
  { value: "Sin impresión", label: "Sin impresión" },
];

const PRINT_TYPE_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Repetitivo", label: "Repetitivo" },
];

const STRUCTURE_TYPE_OPTIONS = [
  { value: "Monocapa", label: "Monocapa" },
  { value: "Bilaminado", label: "Bilaminado" },
  { value: "Trilaminado", label: "Trilaminado" },
  { value: "Tetralaminado", label: "Tetralaminado" },
];

type MaterialEntry = {value: string; label: string; micron: string; grammage: string; isFree: boolean;
};

type MaterialCatalog = Record<string, MaterialEntry[]>;
const fixedMaterial = (
  value: string,
  label: string,
  micron: string,
  grammage: string
): MaterialEntry => ({
  value,
  label,
  micron,
  grammage,
  isFree: false,
});

const freeMaterial = (
  value: string,
  label: string
): MaterialEntry => ({
  value,
  label,
  micron: "",
  grammage: "",
  isFree: true,
});

const MATERIAL_CATALOG: MaterialCatalog = {
  BOPP: [
    fixedMaterial("BOPP - BOPP CRISTAL - 15", "BOPP CRISTAL - 15", "15", "13.5"),
    fixedMaterial("BOPP - BOPP CRISTAL - 17", "BOPP CRISTAL - 17", "17", "15.5"),
    fixedMaterial("BOPP - BOPP CRISTAL - 20", "BOPP CRISTAL - 20", "20", "18"),
    fixedMaterial("BOPP - BOPP CRISTAL - 25", "BOPP CRISTAL - 25", "25", "22.5"),
    fixedMaterial("BOPP - BOPP CRISTAL - 30", "BOPP CRISTAL - 30", "30", "27"),
    fixedMaterial("BOPP - BOPP CRISTAL - 35", "BOPP CRISTAL - 35", "35", "31.5"),
    fixedMaterial("BOPP - BOPP CRISTAL ETIQUETA - 13.5", "BOPP CRISTAL ETIQUETA - 13.5", "13.5", "12.2"),
    fixedMaterial("BOPP - BOPP BLANCO/MATE - 17", "BOPP MATE - 17", "17", "15.5"),
    fixedMaterial("BOPP - BOPP BLANCO/MATE - 20", "BOPP MATE - 20", "20", "18"),
    fixedMaterial("BOPP - BOPP BLANCO/MATE - 27", "BOPP BLANCO - 27", "27", "17.3"),
    fixedMaterial("BOPP - BOPP ALOX - 16", "BOPP ALOX - 16", "16", "14"),
    fixedMaterial("BOPP - BOPP METALIZADO - 15", "BOPP METALIZADO - 15", "15", "13.5"),
    fixedMaterial("BOPP - BOPP METALIZADO - 17", "BOPP METALIZADO - 17", "17", "15.5"),
    fixedMaterial("BOPP - BOPP METALIZADO - 20", "BOPP METALIZADO - 20", "20", "18"),
    fixedMaterial("BOPP - BOPP METALIZADO - 25", "BOPP METALIZADO - 25", "25", "22.5"),
    fixedMaterial("BOPP - BOPP METALIZADO - 30", "BOPP METALIZADO - 30", "30", "27"),
    fixedMaterial("BOPP - BOPP METALIZADO - 35", "BOPP METALIZADO - 35", "35", "32"),
    fixedMaterial("BOPP - BOPP METALIZADO UHB - 18", "BOPP METALIZADO UHB - 18", "18", "16"),
  ],

  POLIESTER: [
    fixedMaterial("POLIESTER - PET CRISTAL - 10", "PET CRISTAL - 10", "10", "14"),
    fixedMaterial("POLIESTER - PET CRISTAL - 12", "PET CRISTAL - 12", "12", "17"),
    fixedMaterial("POLIESTER - PET METALIZADO - 12", "PET METALIZADO - 12", "12", "17"),
    fixedMaterial("POLIESTER - PET METALIZADO UHB - 12", "PET METALIZADO UHB - 12", "12", "17"),
  ],

  PAPEL: [
    fixedMaterial("PAPEL - PAPEL ANTIGRASA - 40", "PAPEL ANTIGRASA - 40", "40", "40"),
    fixedMaterial("PAPEL - PAPEL ANTIGRASA - 60", "PAPEL ANTIGRASA - 60", "60", "60"),
    fixedMaterial("PAPEL - PAPEL ESTUCADO - 40", "PAPEL ESTUCADO - 40", "40", "40"),
    fixedMaterial("PAPEL - PAPEL ESTUCADO - 60", "PAPEL ESTUCADO - 60", "60", "60"),
    fixedMaterial("PAPEL - PAPEL ESTUCADO - 70", "PAPEL ESTUCADO - 70", "70", "70"),
    freeMaterial("PAPEL - PAPEL ESPECIAL - Libre", "PAPEL ESPECIAL - Libre"),
  ],

  COEX: [
    freeMaterial("COEX - PE CRISTAL - Libre", "PE CRISTAL - Libre"),
    freeMaterial("COEX - PE BLANCO - Libre", "PE BLANCO - Libre"),
    freeMaterial("COEX - BARVAL CRISTAL - Libre", "BARVAL CRISTAL - Libre"),
    freeMaterial("COEX - BARVAL BLANCO - Libre", "BARVAL BLANCO - Libre"),
    freeMaterial("COEX - BARLON CRISTAL - Libre", "BARLON CRISTAL - Libre"),
    freeMaterial("COEX - BARLON BLANCO - Libre", "BARLON BLANCO - Libre"),
    freeMaterial("COEX - PE PELABLE CRISTAL - Libre", "PE PELABLE CRISTAL - Libre"),
    freeMaterial("COEX - PE PELABLE BLANCO - Libre", "PE PELABLE BLANCO - Libre"),
    freeMaterial("COEX - UHT - Libre", "UHT - Libre"),
  ],

  ALUMINIO: [
    fixedMaterial("ALUMINIO - ALUMINIO - 7", "ALUMINIO - 7", "7", "19"),
    fixedMaterial("ALUMINIO - ALUMINIO - 8", "ALUMINIO - 8", "8", "22"),
    fixedMaterial("ALUMINIO - ALUMINIO - 9", "ALUMINIO - 9", "9", "24.3"),
  ],

  AMPRIMA: [
    fixedMaterial("AMPRIMA - AMPRIMA - 25", "AMPRIMA - 25", "25", "24.6"),
  ],

  PPCAST: [
    fixedMaterial("PPCAST - CAST CRISTAL - 20", "CAST CRISTAL - 20", "20", "18"),
    fixedMaterial("PPCAST - CAST CRISTAL - 25", "CAST CRISTAL - 25", "25", "22.5"),
    fixedMaterial("PPCAST - CAST CRISTAL - 30", "CAST CRISTAL - 30", "30", "27"),
    fixedMaterial("PPCAST - CAST CRISTAL - 60", "CAST CRISTAL - 60", "60", "54.3"),
  ],

  BOPA: [
    fixedMaterial("BOPA - BOPA CRISTAL - 15", "BOPA CRISTAL - 15", "15", "17"),
  ],

  TERMOFORMADOS: [
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 75", "TERMOFORMADO ALTA - 75", "75", "75"),
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 90", "TERMOFORMADO ALTA - 90", "90", "86"),
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 100", "TERMOFORMADO ALTA - 100", "100", "97.5"),
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 110", "TERMOFORMADO ALTA - 110", "110", "105"),
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 150", "TERMOFORMADO ALTA - 150", "150", "145.5"),
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 178", "TERMOFORMADO ALTA - 178", "178", "170.3"),
    fixedMaterial("TERMOFORMADOS - TERMOFORMADO ALTA - 200", "TERMOFORMADO ALTA - 200", "200", "191"),
  ],
};

const MATERIAL_GROUP_OPTIONS = Object.keys(MATERIAL_CATALOG).map(g => ({ value: g, label: g }));

const SALE_TYPE_OPTIONS = [
  { value: "Nacional", label: "Nacional" },
  { value: "Internacional", label: "Internacional" },
];

const INCOTERM_OPTIONS = [
  { value: "EXW", label: "EXW" },
  { value: "FCA", label: "FCA" },
  { value: "FAS", label: "FAS" },
  { value: "FOB", label: "FOB" },
  { value: "CPT", label: "CPT" },
  { value: "CIP", label: "CIP" },
  { value: "CFR", label: "CFR" },
  { value: "CIF", label: "CIF" },
  { value: "DAP", label: "DAP" },
  { value: "DPU", label: "DPU" },
  { value: "DDP", label: "DDP" },
];

const CURRENCY_OPTIONS = [
  { value: "Soles", label: "Soles" },
  { value: "Dólares", label: "Dólares" },
];

const SPECIAL_DESIGN_SPECS_OPTIONS = [
  { value: "Tintas Holográficas", label: "Tintas Holográficas" },
  { value: "Efectos/texturas/características especiales", label: "Efectos/texturas/características especiales" },
  { value: "Acabados Especiales o Barnices nuevos", label: "Acabados Especiales o Barnices nuevos" },
  { value: "Otros (comentar cuáles)", label: "Otros (comentar cuáles)" },
  { value: "No aplica", label: "No aplica" },
];

const DOY_PACK_BASE_OPTIONS = [
  { value: "Redonda", label: "Redonda" },
  { value: "Cuadrada", label: "Cuadrada" },
  { value: "No aplica", label: "No aplica" },
];

const CORE_MATERIAL_OPTIONS = [
  { value: "Cartón", label: "Cartón" },
  { value: "Plástico", label: "Plástico" },
  { value: "Metal", label: "Metal" },
  { value: "Otros", label: "Otros" },
];

const GUSSET_TYPE_OPTIONS = [
  { value: "Lateral", label: "Lateral" },
  { value: "Fondo", label: "Fondo" },
];

const ZIPPER_TYPE_OPTIONS = [
  { value: "Convencional", label: "Convencional" },
  { value: "String Zipper", label: "String Zipper" },
];

const VALVE_TYPE_OPTIONS = [
  { value: "Degasificadora", label: "Degasificadora" },
  { value: "Dosificadora", label: "Dosificadora" },
];

const ROUNDED_CORNERS_TYPE_OPTIONS = [
  { value: "Redondeo esquinas del Fondo", label: "Redondeo esquinas del Fondo" },
  { value: "Redondeo todas las esquinas", label: "Redondeo todas las esquinas" },
];

const POUCH_PERFORATION_TYPE_OPTIONS = [
  { value: "Ojal", label: "Ojal" },
  { value: "Circular", label: "Circular" },
  { value: "Europunch", label: "Europunch" },
];

const BAG_PERFORATION_TYPE_OPTIONS = [
  { value: "Cruz", label: "Cruz" },
  { value: "Media luna", label: "Media luna" },
];

const PERFORATION_LOCATION_OPTIONS = [
  { value: "Delantero", label: "Delantero" },
  { value: "Posterior", label: "Posterior" },
];

const PRECUT_TYPE_OPTIONS = [
  { value: "Pre-corte mecánico abre fácil sectorizado", label: "Pre-corte mecánico abre fácil sectorizado" },
  { value: "Pre-corte mecánico abre fácil", label: "Pre-corte mecánico abre fácil" },
];

const OTHER_ACCESSORIES_OPTIONS = [
  { value: "Pega-pega", label: "Pega-pega" },
  { value: "No aplica", label: "No aplica" },
];

const DESTINATION_COUNTRY_OPTIONS = [
  { value: "Perú", label: "Perú" },
  { value: "Chile", label: "Chile" },
  { value: "Colombia", label: "Colombia" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Portugal", label: "Portugal" },
  { value: "Otro", label: "Otro" },
];

const POUCH_DOY_PACK_REDONDO_FUELLE_PROPIO = "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO";
const POUCH_DOY_PACK_DIMENSION_RESTRICTIONS = {
  width: { min: 80, max: 230, label: "Ancho" },
  length: { min: 134, max: 340, label: "Largo" },
  gussetWidth: { min: 0, max: 3, label: "Ancho fuelle" },
} as const;

const STEPS = [
  { label: "Información General" },
  { label: "Producto Comercial" },
  { label: "Diseño" },
  { label: "Estructura" },
  { label: "Condiciones comerciales" },
  { label: "Información adicional" },
];

const STEP_FIELDS: Record<number, Array<keyof ProjectEditFormData>> = {
  // 1. Información General
  0: [
    "salesforceAction",
    "projectName",
    "projectDescription",
    "executiveId",
    "portfolioCode",
  ],

  // 2. Producto Comercial
  1: [
    "classification",
    "subClassification",
    "projectType",
    "blueprintFormat",
    "technicalApplication",
    "customerPackingCode",
  ],

  // 3. Diseño
  2: [
    "hasEdagReference",
    "edagCode",
    "edagVersion",
    "printClass",
    "printType",
    "specialDesignSpecs",
    "specialDesignComments",
    "designPlanFiles",
  ],

  // 4. Estructura
  3: [
    "hasReferenceStructure",
    "referenceEmCode",
    "referenceEmVersion",
    "structureType",

    "layer1MaterialGroup",
    "layer1Material",
    "layer1Micron",
    "layer1Grammage",
    "layer2MaterialGroup",
    "layer2Material",
    "layer2Micron",
    "layer2Grammage",
    "layer3MaterialGroup",
    "layer3Material",
    "layer3Micron",
    "layer3Grammage",
    "layer4MaterialGroup",
    "layer4Material",
    "layer4Micron",
    "layer4Grammage",

    "grammage",
    "grammageTolerance",
    "sampleRequest",
    "specialStructureSpecs",

    "width",
    "length",
    "repetition",
    "doyPackBase",
    "gussetWidth",
    "gussetType",

    "hasCustomerTechnicalSpec",
    "customerTechnicalSpecAttachment",
  ],

  // 5. Condiciones comerciales
  4: [
    "estimatedVolume",
    "unitOfMeasure",
    "saleType",
    "incoterm",
    "destinationCountry",
    "targetPrice",
    "currencyType",
  ],

  // 6. Información adicional
  5: [
    "coreMaterial",
    "coreDiameter",
    "externalDiameter",
    "externalVariationPlus",
    "externalVariationMinus",
    "maxRollWeight",
    "customerAdditionalInfo",
    "peruvianProductLogo",
    "printingFooter",
    "deliveryAddress",
    "additionalComment",
  ],
};
const FIELD_LABELS: Partial<Record<keyof ProjectEditFormData, string>> = {
  portfolioCode: "Portafolio base",
  executiveId: "Ejecutivo Comercial",
  salesforceAction: "Acción Salesforce",
  projectName: "Nombre del proyecto",
  projectDescription: "Descripción del proyecto",

  blueprintFormat: "Formato de plano",
  technicalApplication: "Aplicación técnica",
  customerPackingCode: "Código de empaque del cliente",

  printClass: "Impresión",
  printType: "Tipo",

  width: "Ancho",
  length: "Largo",
  repetition: "Repetición",
  gussetWidth: "Ancho Fuelle",

  estimatedVolume: "Cantidad / Volumen estimado",
  unitOfMeasure: "Unidad de medida",
  saleType: "Venta nacional / internacional",
  targetPrice: "Precio objetivo",
  currencyType: "Tipo de moneda",
  coreMaterial: "Material del core",
  coreDiameter: "Diámetro core",
  externalDiameter: "Diámetro externo",
  maxRollWeight: "Peso máximo rollo",
  peruvianProductLogo: "Logo Producto Peruano",
  printingFooter: "Pie de Imprenta",

  grammage: "Gramaje general (g/m2)",
  grammageTolerance: "Tolerancia de Gramaje",
  sampleRequest: "¿Solicitud de muestra?",
  designPlanFiles: "Planos",
  hasCustomerTechnicalSpec: "¿Tiene Especificación Técnica del Cliente?",
  customerTechnicalSpecAttachment: "Especificación Técnica del Cliente Adjunto",
  customerAdditionalInfo: "Información adicional cliente",
  deliveryAddress: "Dirección de entrega",
  additionalComment: "Comentario",
  classification: "Clasificación",
  subClassification: "Subsección Clasificación",
  projectType: "Tipo de Proyecto",

  hasEdagReference: "¿Tiene Diseño de referencia?",
  edagCode: "Código EDAG",
  edagVersion: "Versión EDAG",
  specialDesignSpecs: "Especificaciones Especiales",
  specialDesignComments: "Comentarios de diseños especiales",

  hasReferenceStructure: "¿Tiene estructura de referencia?",
  referenceEmCode: "Código E/M Referencia",
  referenceEmVersion: "Versión E/M",
  structureType: "Tipo de Estructura",

  doyPackBase: "Base Doy Pack",
  gussetType: "Tipo de Fuelle",

  incoterm: "Incoterm",
  destinationCountry: "País Destino",

  externalVariationPlus: "Variación Externa +",
  externalVariationMinus: "Variación Externa -",

  layer1MaterialGroup: "Capa 1 - Grupo Material",
layer1Material: "Capa 1 - Tipo de Material y Micraje",
layer1Micron: "Capa 1 - Micraje",
layer1Grammage: "Capa 1 - Gramaje",

layer2MaterialGroup: "Capa 2 - Grupo Material",
layer2Material: "Capa 2 - Tipo de Material y Micraje",
layer2Micron: "Capa 2 - Micraje",
layer2Grammage: "Capa 2 - Gramaje",

layer3MaterialGroup: "Capa 3 - Grupo Material",
layer3Material: "Capa 3 - Tipo de Material y Micraje",
layer3Micron: "Capa 3 - Micraje",
layer3Grammage: "Capa 3 - Gramaje",

layer4MaterialGroup: "Capa 4 - Grupo Material",
layer4Material: "Capa 4 - Tipo de Material y Micraje",
layer4Micron: "Capa 4 - Micraje",
layer4Grammage: "Capa 4 - Gramaje",
};
const BASE_REQUIRED_FIELDS: Array<keyof ProjectEditFormData> = [
  // Información General
  "portfolioCode",
  "executiveId",
  "salesforceAction",
  "projectName",
  "projectDescription",

  // Producto Comercial
  "classification",
  "blueprintFormat",
  "technicalApplication",

  // Diseño
  "hasEdagReference",
  "printClass",

  // Condiciones comerciales
  "estimatedVolume",
  "unitOfMeasure",
  "saleType",

  // Estructura
  "grammage",
  "grammageTolerance",
  "sampleRequest",
];

const isFieldEmpty = (value: unknown) => {
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || String(value).trim() === "";
};

function hasIllustratorFile(files: string[]): boolean {
  return files.some((file) => file.toLowerCase().endsWith(".ai"));
}

function shouldShowRepetitionField(wrapping: string, blueprintFormat: string): boolean {
  const normalizedWrapping = normalizeWrappingName(wrapping);
  const normalizedFormat = normalizeOptionValue(blueprintFormat);

  const isBolsa = normalizedWrapping.includes("bolsa");

  const isRepetitionFormat =
    normalizedFormat.includes("tissue") ||
    normalizedFormat.includes("generica") ||
    normalizedFormat.includes("food");

  return isBolsa && isRepetitionFormat;
}
type ProjectRecordWithExecutives = ProjectRecord & {
  ejecutivoIds?: Array<string | number>;
  ejecutivoNames?: string;
  executiveIds?: Array<string | number>;
  commercialExecutiveIds?: Array<string | number>;
};

function getProjectExecutiveIds(project: ProjectRecord): string[] {
  const projectWithExecutives = project as ProjectRecordWithExecutives;

  const multiIds =
    projectWithExecutives.ejecutivoIds ||
    projectWithExecutives.executiveIds ||
    projectWithExecutives.commercialExecutiveIds;

  if (Array.isArray(multiIds) && multiIds.length > 0) {
    return multiIds.map(String);
  }

  if (project.ejecutivoId !== undefined && project.ejecutivoId !== null) {
    return [String(project.ejecutivoId)];
  }

  return [];
}

export default function ProjectEditPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { projectCode } = useParams<{ projectCode: string }>();

  const [form, setForm] = useState<ProjectEditFormData>({
    portfolioCode: "",
    executiveId: [],
    siUserId: "",
    projectName: "",
    projectDescription: "",
    classification: "",
    subClassification: "",
    projectType: "",
    salesforceAction: "",
    blueprintFormat: "",
    technicalApplication: "",
    estimatedVolume: "",
    unitOfMeasure: "",
    customerPackingCode: "",
    printClass: "",
    printType: "",
    requiresDesignWork: "",
    hasEdagReference: "",
    referenceEdagCode: "",
    referenceEdagVersion: "",
    specialDesignSpecs: "",
    specialDesignComments: "",
    edagCode: "",
    edagVersion: "",
    hasReferenceStructure: "",
    referenceEmCode: "",
    referenceEmVersion: "",
    hasCustomerTechnicalSpec: "",
    customerTechnicalSpecAttachment: "",
    structureType: "",
    layer1MaterialGroup: "",
    layer1Material: "",
    layer1Micron: "",
    layer1Grammage: "",
    layer2MaterialGroup: "",
    layer2Material: "",
    layer2Micron: "",
    layer2Grammage: "",
    layer3MaterialGroup: "",
    layer3Material: "",
    layer3Micron: "",
    layer3Grammage: "",
    layer4MaterialGroup: "",
    layer4Material: "",
    layer4Micron: "",
    layer4Grammage: "",
    specialStructureSpecs: "",
    grammage: "",
    grammageTolerance: "",
    sampleRequest: "",
    width: "",
    length: "",
    repetition: "",
    doyPackBase: "",
    gussetWidth: "",
    gussetType: "",
    hasZipper: "",
    zipperType: "",
    hasTinTie: "",
    hasValve: "",
    valveType: "",
    hasDieCutHandle: "",
    hasReinforcement: "",
    reinforcementThickness: "",
    reinforcementWidth: "",
    hasAngularCut: "",
    hasRoundedCorners: "",
    roundedCornersType: "",
    hasNotch: "",
    hasPerforation: "",
    pouchPerforationType: "",
    bagPerforationType: "",
    perforationLocation: "",
    hasPreCut: "",
    preCutType: "",
    otherAccessories: "",
    saleType: "",
    incoterm: "",
    destinationCountry: "",
    targetPrice: "",
    currencyType: "",
    coreMaterial: "",
    coreDiameter: "",
    externalDiameter: "",
    externalVariationPlus: "",
    externalVariationMinus: "",
    maxRollWeight: "",
    customerAdditionalInfo: "",
    peruvianProductLogo: "",
    printingFooter: "",
    deliveryAddress: "",
    additionalComment: "",
    designPlanFiles: [],
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof ProjectEditFormData, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [originalProject, setOriginalProject] = useState<ProjectRecord | null>(null);
  const [showValidationSuccessModal, setShowValidationSuccessModal] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [openStructureSections, setOpenStructureSections] = useState({
    specs: true,
    dimensions: true,
    documents: true,
  });
  const allowIncompleteSaveRef = useRef(false);

  const toggleStructureSection = (section: "specs" | "dimensions" | "documents") => {
    setOpenStructureSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);
  const executives = useMemo(() => getActiveExecutiveRecords(), []);
  const siUsers = useMemo(() => getActiveUsers(), []);

  useEffect(() => {
    if (!projectCode) {
      setLoading(false);
      return;
    }

    const project = getProjectByCode(projectCode);
    if (!project) {
      setLoading(false);
      return;
    }

    setOriginalProject(project);

    const toYesNo = (val: any) => {
      if (val === true || val === "Sí" || val === "Si") return "Sí";
      if (val === false || val === "No" || val === null || val === undefined) return "No";
      return val;
    };

    const convertedForm: ProjectEditFormData = {
      portfolioCode: project.portfolioCode || "",
      executiveId: getProjectExecutiveIds(project),
      siUserId: project.siUserId || "",
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
      classification: project.classification || "",
      subClassification: project.subClassification || "",
      projectType: project.projectType || "",
      salesforceAction: project.salesforceAction || "",
      blueprintFormat: project.blueprintFormat || "",
      technicalApplication: project.technicalApplication || "",
      estimatedVolume: project.estimatedVolume || "",
      unitOfMeasure: project.unitOfMeasure || "KGS",
      customerPackingCode: project.customerPackingCode || "",
      printClass: project.printClass || "",
      printType: project.printType || "",
      requiresDesignWork: toYesNo(project.requiresDesignWork),
      hasEdagReference: toYesNo(project.isPreviousDesign),
      referenceEdagCode: project.previousEdagCode || "",
      referenceEdagVersion: project.previousEdagVersion || "",
      specialDesignSpecs: project.specialDesignSpecs || "",
      specialDesignComments: project.specialDesignComments || "",
      edagCode: project.edagCode || "",
      edagVersion: project.edagVersion || "",
      hasReferenceStructure: toYesNo(project.hasReferenceStructure),
      referenceEmCode: project.referenceEmCode || "",
      referenceEmVersion: project.referenceEmVersion || "",
      hasCustomerTechnicalSpec: toYesNo((project as any).hasCustomerTechnicalSpec),
      customerTechnicalSpecAttachment: (project as any).customerTechnicalSpecAttachment || "",
      structureType: project.structureType || "Monocapa",
      layer1MaterialGroup: extractMaterialGroupFromValue(project.layer1Material || ""),
      layer1Material: project.layer1Material || "",
      layer1Micron: project.layer1Micron || "",
      layer1Grammage: project.layer1Grammage || "",
      layer2MaterialGroup: extractMaterialGroupFromValue(project.layer2Material || ""),
      layer2Material: project.layer2Material || "",
      layer2Micron: project.layer2Micron || "",
      layer2Grammage: project.layer2Grammage || "",
      layer3MaterialGroup: extractMaterialGroupFromValue(project.layer3Material || ""),
      layer3Material: project.layer3Material || "",
      layer3Micron: project.layer3Micron || "",
      layer3Grammage: project.layer3Grammage || "",
      layer4MaterialGroup: extractMaterialGroupFromValue(project.layer4Material || ""),
      layer4Material: project.layer4Material || "",
      layer4Micron: project.layer4Micron || "",
      layer4Grammage: project.layer4Grammage || "",
      specialStructureSpecs: project.specialStructureSpecs || "",
      grammage: project.grammage || "",
      grammageTolerance: project.grammageTolerance || "",
      sampleRequest: toYesNo(project.sampleRequest),
      width: project.width || "",
      length: project.length || "",
      repetition: project.repetition || "",
      doyPackBase: project.doyPackBase || "",
      gussetWidth: project.gussetWidth || "",
      gussetType: project.gussetType || "",
      hasZipper: toYesNo(project.hasZipper),
      zipperType: project.zipperType || "",
      hasTinTie: toYesNo(project.hasTinTie),
      hasValve: toYesNo(project.hasValve),
      valveType: project.valveType || "",
      hasDieCutHandle: toYesNo(project.hasDieCutHandle),
      hasReinforcement: toYesNo(project.hasReinforcement),
      reinforcementThickness: project.reinforcementThickness || "",
      reinforcementWidth: project.reinforcementWidth || "",
      hasAngularCut: toYesNo(project.hasAngularCut),
      hasRoundedCorners: toYesNo(project.hasRoundedCorners),
      roundedCornersType: project.roundedCornersType || "",
      hasNotch: toYesNo(project.hasNotch),
      hasPerforation: toYesNo(project.hasPerforation),
      pouchPerforationType: project.pouchPerforationType || "",
      bagPerforationType: project.bagPerforationType || "",
      perforationLocation: project.perforationLocation || "",
      hasPreCut: toYesNo(project.hasPreCut),
      preCutType: project.preCutType || "",
      otherAccessories: project.otherAccessories || "",
      saleType: project.saleType || "Nacional",
      incoterm: project.incoterm || "No aplica",
      destinationCountry: project.destinationCountry || "Perú",
      targetPrice: project.targetPrice || "",
      currencyType: project.currencyType || "Soles",
      coreMaterial: project.coreMaterial || "",
      coreDiameter: project.coreDiameter || "",
      externalDiameter: project.externalDiameter || "",
      externalVariationPlus: project.externalVariationPlus || "",
      externalVariationMinus: project.externalVariationMinus || "",
      maxRollWeight: project.maxRollWeight || "",
      customerAdditionalInfo: project.customerAdditionalInfo || "",
      peruvianProductLogo: toYesNo(project.peruvianProductLogo),
      printingFooter: toYesNo(project.printingFooter),
      deliveryAddress: (project as any).deliveryAddress || "",
      additionalComment: (project as any).additionalComment || "",
      designPlanFiles: (project as any).designPlanFiles || [],
    };

    setForm(convertedForm);
    setLoading(false);
  }, [projectCode]);

  useEffect(() => {
  if (projectCode && !loading) {
    const projectTitle = form.projectName?.trim()
      ? `Editar Proyecto: ${form.projectName}`
      : "Editar Proyecto";

    const projectSubtitle = form.projectDescription?.trim()
      ? form.projectDescription
      : "Completa y gestiona todos los detalles de tu proyecto";

    setHeader({
      title: projectTitle,
      subtitle: projectSubtitle,
      breadcrumbs: [
        { label: "Proyectos", href: "/projects" },
        { label: projectCode },
        { label: "Editar" },
      ],
      badges: (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          ID: {projectCode}
        </span>
      ),
    });
  }

  return () => resetHeader();
}, [
  setHeader,
  resetHeader,
  projectCode,
  loading,
  form.projectName,
  form.projectDescription,
]);

  const selectedPortfolio = useMemo(() => {
    return (
      portfolios.find(
        (portfolio) =>
          portfolio.id === form.portfolioCode ||
          portfolio.codigo === form.portfolioCode ||
          portfolio.code === form.portfolioCode
      ) || null
    );
  }, [form.portfolioCode, portfolios]);

  const selectedExecutives = useMemo(() => {
  const selectedIds = new Set(form.executiveId.map(String));
  return executives.filter((executive) => selectedIds.has(String(executive.id)));
}, [executives, form.executiveId]);

  const inheritedPortfolioCode = selectedPortfolio?.id || selectedPortfolio?.codigo || selectedPortfolio?.code || "";
  const inheritedPortfolioName = selectedPortfolio?.nom || selectedPortfolio?.name || selectedPortfolio?.portfolioName || "";
  const inheritedPortfolioDisplay = inheritedPortfolioCode
    ? `${inheritedPortfolioCode} - ${inheritedPortfolioName || "Sin nombre de portafolio registrado"}`
    : "";

  const inheritedClient = selectedPortfolio?.cli || selectedPortfolio?.clientName || "";
  const inheritedPlant = selectedPortfolio?.pl || selectedPortfolio?.plantaName || selectedPortfolio?.plantaCode || "";
  const inheritedWrapping = selectedPortfolio?.env || selectedPortfolio?.envoltura || selectedPortfolio?.wrappingName || "";
  const inheritedFinalUse = selectedPortfolio?.uf || selectedPortfolio?.usoFinal || selectedPortfolio?.useFinalName || "";
  const inheritedSector = selectedPortfolio?.sector || "";
  const inheritedSegment = selectedPortfolio?.seg || selectedPortfolio?.segmento || selectedPortfolio?.segment || "";
  const inheritedSubSegment = selectedPortfolio?.subseg || selectedPortfolio?.subSegmento || selectedPortfolio?.subSegment || "";
  const inheritedAfMarketId = selectedPortfolio?.af || selectedPortfolio?.afMarketId || "";
  const inheritedMachine = selectedPortfolio?.maq || selectedPortfolio?.maquinaCliente || selectedPortfolio?.packingMachineName || "";

  const isPouchWrapping = normalizeWrapping(inheritedWrapping).includes("pouch");
  const shouldApplyPouchDoyPackRestrictions = isPouchWrapping && form.blueprintFormat === POUCH_DOY_PACK_REDONDO_FUELLE_PROPIO;

  const activeLayerCount = useMemo(() => {
  return getLayerCountByStructureType(form.structureType);
}, [form.structureType]);

  const layerGrammageTotal = useMemo(() => {
    const layerGrammages = [
      form.layer1Grammage,
      form.layer2Grammage,
      form.layer3Grammage,
      form.layer4Grammage,
    ];

    return layerGrammages
      .slice(0, activeLayerCount)
      .reduce((total, value) => total + parseGrammageValue(value), 0);
  }, [
    activeLayerCount,
    form.layer1Grammage,
    form.layer2Grammage,
    form.layer3Grammage,
    form.layer4Grammage,
  ]);

  const fixedInkAdhesiveGrammage = useMemo(() => {
    return STRUCTURE_FIXED_GRAMMAGE[form.structureType] || 0;
  }, [form.structureType]);

  const calculatedGrammageTotal = useMemo(() => {
    if (!form.structureType) return "";

    return formatGrammageValue(layerGrammageTotal + fixedInkAdhesiveGrammage);
  }, [form.structureType, layerGrammageTotal, fixedInkAdhesiveGrammage]);

  useEffect(() => {
    setForm((prev) => {
      if (prev.grammage === calculatedGrammageTotal) return prev;

      return {
        ...prev,
        grammage: calculatedGrammageTotal,
      };
    });
  }, [calculatedGrammageTotal]);
  useEffect(() => {
  setForm((prev) => {
    const updates: Partial<ProjectEditFormData> = {};

    for (let layer = 1; layer <= 4; layer++) {
      const groupKey = `layer${layer}MaterialGroup` as keyof ProjectEditFormData;
      const materialKey = `layer${layer}Material` as keyof ProjectEditFormData;

      const micronKey = `layer${layer}Micron` as
        | "layer1Micron"
        | "layer2Micron"
        | "layer3Micron"
        | "layer4Micron";

      const grammageKey = `layer${layer}Grammage` as
        | "layer1Grammage"
        | "layer2Grammage"
        | "layer3Grammage"
        | "layer4Grammage";

      const group = prev[groupKey] as string;
      const material = prev[materialKey] as string;

      if (!group || !material) continue;

      const entry = MATERIAL_CATALOG[group]?.find(
        (item) => item.value === material || item.label === material
      );

      if (!entry || entry.isFree) continue;

      if (prev[micronKey] !== entry.micron) {
        updates[micronKey] = entry.micron;
      }

      if (prev[grammageKey] !== entry.grammage) {
        updates[grammageKey] = entry.grammage;
      }
    }

    return Object.keys(updates).length > 0
      ? { ...prev, ...updates }
      : prev;
  });
}, [
  form.layer1MaterialGroup,
  form.layer1Material,
  form.layer2MaterialGroup,
  form.layer2Material,
  form.layer3MaterialGroup,
  form.layer3Material,
  form.layer4MaterialGroup,
  form.layer4Material,
]);

  const projectTypeOptions = useMemo(() => {
    if (form.classification === "Modificado") {
      return [];
    }

    if (!form.subClassification) return [];

    if (form.subClassification === "Desarrollo_RD") {
      return PROJECT_TYPE_RD_OPTIONS;
    }

    if (form.subClassification === "Área_Técnica") {
      return PROJECT_TYPE_TECNICA_OPTIONS;
    }

    const normalized = normalizeOptionValue(form.subClassification);

    if (normalized.includes("desarrollo") || normalized.includes("rd")) {
      return PROJECT_TYPE_RD_OPTIONS;
    }

    if (normalized.includes("area") || normalized.includes("tecnica")) {
      return PROJECT_TYPE_TECNICA_OPTIONS;
    }

    return [];
  }, [form.classification, form.subClassification]);

  const requiredFields = useMemo<Array<keyof ProjectEditFormData>>(() => {
    const fields = [...BASE_REQUIRED_FIELDS];
    if (form.hasReferenceStructure !== "Sí") {
      fields.push("structureType");

      for (let layer = 1; layer <= activeLayerCount; layer++) {
        fields.push(
          `layer${layer}MaterialGroup` as keyof ProjectEditFormData,
          `layer${layer}Material` as keyof ProjectEditFormData,
          `layer${layer}Micron` as keyof ProjectEditFormData,
          `layer${layer}Grammage` as keyof ProjectEditFormData
        );
      }
    }
    if (form.printClass && form.printClass !== "Sin impresión") {
      fields.push("printType");
    }

    if (form.classification) {
      fields.push("subClassification");
    }

    const isProjectTypeEnabled =
      Boolean(form.subClassification) &&
      form.classification !== "Modificado" &&
      projectTypeOptions.length > 0;

    if (isProjectTypeEnabled) {
      fields.push("projectType");
    }

    if (shouldShowRepetitionField(inheritedWrapping, form.blueprintFormat)) {
      fields.push("repetition");
    }

    if (shouldApplyPouchDoyPackRestrictions) {
      fields.push("width", "length", "gussetWidth", "doyPackBase", "gussetType");
    }

    if (form.hasEdagReference === "Sí") {
      fields.push("designPlanFiles");
    }

    return fields;
}, [
  inheritedWrapping,
  form.blueprintFormat,
  form.classification,
  form.subClassification,
  form.printClass,
  form.hasReferenceStructure,
  form.structureType,
  activeLayerCount,
  projectTypeOptions,
  shouldApplyPouchDoyPackRestrictions,
  form.hasEdagReference,
  form.hasCustomerTechnicalSpec,
]);
  const updateField = (field: keyof ProjectEditFormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markFieldAsTouched = (field: keyof ProjectEditFormData) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };
  const handleCustomerTechnicalSpecFile = (file?: File | null) => {
  if (!file) {
    updateField("customerTechnicalSpecAttachment", "");
    markFieldAsTouched("customerTechnicalSpecAttachment");
    return;
  }

  updateField("customerTechnicalSpecAttachment", file.name);
  markFieldAsTouched("customerTechnicalSpecAttachment");
};

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<keyof ProjectEditFormData, string>> = {};

    requiredFields.forEach((field) => {
      if (isFieldEmpty(form[field])) {
        const label = FIELD_LABELS[field] || String(field);
        errors[field] = `${label} es obligatorio.`;
      }
    });

    if (shouldApplyPouchDoyPackRestrictions) {
      const dimensionFields = ["width", "length", "gussetWidth"] as const;

      dimensionFields.forEach((field) => {
        const value = form[field];
        const restriction = POUCH_DOY_PACK_DIMENSION_RESTRICTIONS[field];

        if (value && value.trim()) {
          const parsedValue = parseNumberInput(value);

          if (parsedValue === null) {
            errors[field] = `${restriction.label} debe ser un número válido.`;
          } else if (parsedValue < restriction.min || parsedValue > restriction.max) {
            errors[field] = `${restriction.label} debe estar entre ${restriction.min} y ${restriction.max} mm.`;
          }
        }
      });
    }

    if (form.hasEdagReference === "Sí" && !hasIllustratorFile(form.designPlanFiles)) {
      errors.designPlanFiles = "Debe cargar al menos un archivo de Illustrator (.ai).";
    }

    return errors;
  }, [form, requiredFields, shouldApplyPouchDoyPackRestrictions]);

  const shouldShowFieldError = (field: keyof ProjectEditFormData) => {
    return Boolean(validationErrors[field] && (submitAttempted || touchedFields[field]));
  };

  const getError = (field: keyof ProjectEditFormData) => {
    return shouldShowFieldError(field) ? validationErrors[field] || "" : "";
  };

  const missingFieldsByStep = useMemo(() => {
    const missing = requiredFields.filter((field) => isFieldEmpty(form[field]));

    const result: Record<number, string[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    missing.forEach((field) => {
      for (const [step, fields] of Object.entries(STEP_FIELDS)) {
        if (fields.includes(field)) {
          result[Number(step)].push(field);
          return;
        }
      }
    });

    return result;
  }, [form, requiredFields]);

  const stepsWithErrors = useMemo(() => {
    const result: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    Object.keys(validationErrors).forEach((field) => {
      for (const [step, fields] of Object.entries(STEP_FIELDS)) {
        if (fields.includes(field as keyof ProjectEditFormData)) {
          result[Number(step)]++;
          break;
        }
      }
    });

    if (submitAttempted) {
      Object.entries(missingFieldsByStep).forEach(([step, fields]) => {
        result[Number(step)] += fields.length;
      });
    }

    return result;
  }, [validationErrors, missingFieldsByStep, submitAttempted]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const completedCount = requiredFields.filter(
      (field) => !isFieldEmpty(form[field])
    ).length;

    return Math.round((completedCount / requiredFields.length) * 100);
  }, [form, requiredFields]);

  const isProjectCompleteForValidation = completionPercentage === 100;

  const primaryButtonLabel = isProjectCompleteForValidation
    ? "Solicitar validación"
    : "Actualizar proyecto";

  const missingFieldCount = useMemo(() => {
  return Object.values(missingFieldsByStep).flat().length;
}, [missingFieldsByStep]);

const firstMissingStep = useMemo(() => {
  const entry = Object.entries(missingFieldsByStep).find(
    ([, fields]) => fields.length > 0
  );

  return entry ? Number(entry[0]) : 0;
}, [missingFieldsByStep]);

const hasMissingRequiredFields = useMemo(() => {
  return Object.values(missingFieldsByStep).some((fields) => fields.length > 0);
}, [missingFieldsByStep]);

const handleReviewMissingFields = () => {
  setShowMissingFieldsModal(false);
  setSubmitAttempted(true);

  const fieldsWithErrors = Object.values(missingFieldsByStep)
    .flat()
    .reduce((acc, field) => {
      acc[field as keyof ProjectEditFormData] = true;
      return acc;
    }, {} as Partial<Record<keyof ProjectEditFormData, boolean>>);

  setTouchedFields((prev) => ({
    ...prev,
    ...fieldsWithErrors,
  }));

  setActiveStep(firstMissingStep);

  window.setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100);
};

const handleSaveProgressAnyway = () => {
  allowIncompleteSaveRef.current = true;
  setShowMissingFieldsModal(false);

  window.setTimeout(() => {
    const formElement = document.getElementById("project-edit-form") as HTMLFormElement | null;
formElement?.requestSubmit();
  }, 0);
};

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    if (hasValidationErrors || hasMissingRequiredFields || !projectCode) {
      setShowMissingFieldsModal(true);
      return;
    }

    const shouldForceSaveAsDraft = allowIncompleteSaveRef.current;

    allowIncompleteSaveRef.current = false;

    const shouldSubmitForValidation =
      isProjectCompleteForValidation && !shouldForceSaveAsDraft;

    const now = new Date().toISOString();

    // Ensure commercial executives are properly resolved and persisted
    const finalExecutiveIds = form.executiveId.map(String);

    const finalExecutiveId =
      finalExecutiveIds.length > 0
        ? Number(finalExecutiveIds[0])
        : originalProject?.ejecutivoId || undefined;

    const finalExecutiveName =
      selectedExecutives.length > 0
        ? selectedExecutives.map((executive) => executive.name).join(", ")
        : originalProject?.ejecutivoName || "";

    updateProjectRecord(projectCode, {
      id: projectCode,
      code: projectCode,

      portfolioCode: form.portfolioCode,
      portfolioName: selectedPortfolio?.nom || selectedPortfolio?.portfolioName || "",

      clientCode: selectedPortfolio?.clientCode,
      clientName: inheritedClient,

      projectName: form.projectName,
      projectDescription: form.projectDescription,

      ejecutivoId: finalExecutiveId,
      ejecutivoName: finalExecutiveName,

      // Campos múltiples para persistir todos los ejecutivos comerciales seleccionados
      ejecutivoIds: finalExecutiveIds,
      ejecutivoNames: finalExecutiveName,
      executiveIds: finalExecutiveIds,
      commercialExecutiveIds: finalExecutiveIds,
      

      siUserId: form.siUserId,
      siUserCode: siUsers.find(u => u.id === form.siUserId)?.code,

      plantaName: inheritedPlant,
      wrappingName: inheritedWrapping,
      useFinalName: inheritedFinalUse,
      subSegment: inheritedSubSegment,
      segment: inheritedSegment,
      sector: inheritedSector,
      afMarketId: inheritedAfMarketId,
      maquinaCliente: inheritedMachine,
      packingMachineName: inheritedMachine,

      classification: form.classification,
      subClassification: form.subClassification,
      projectType: form.projectType,
      salesforceAction: form.salesforceAction,

      blueprintFormat: form.blueprintFormat,
      technicalApplication: form.technicalApplication,
      estimatedVolume: form.estimatedVolume,
      unitOfMeasure: form.unitOfMeasure,
      customerPackingCode: form.customerPackingCode,

      format: form.blueprintFormat,
      volume: form.estimatedVolume,
      unit: form.unitOfMeasure,

      printClass: form.printClass,
      printType: form.printType,
      specialDesignSpecs: form.specialDesignSpecs,
      specialDesignComments: form.specialDesignComments,
      edagCode: form.edagCode,
      edagVersion: form.edagVersion,
      isPreviousDesign: form.hasEdagReference as BooleanLike,
      previousEdagCode: form.referenceEdagCode,
      previousEdagVersion: form.referenceEdagVersion,
      requiresDesignWork: form.printClass === "Sin impresión" ? "No" : "Sí",

      hasReferenceStructure: form.hasReferenceStructure as BooleanLike,
      referenceEmCode: form.referenceEmCode,
      referenceEmVersion: form.referenceEmVersion,
      hasCustomerTechnicalSpec: form.hasCustomerTechnicalSpec as BooleanLike,
      customerTechnicalSpecAttachment: form.customerTechnicalSpecAttachment,
      structureType: form.structureType,

      layer1Material: form.layer1Material,
      layer1Micron: form.layer1Micron,
      layer1Grammage: form.layer1Grammage,
      layer2Material: form.layer2Material,
      layer2Micron: form.layer2Micron,
      layer2Grammage: form.layer2Grammage,
      layer3Material: form.layer3Material,
      layer3Micron: form.layer3Micron,
      layer3Grammage: form.layer3Grammage,
      layer4Material: form.layer4Material,
      layer4Micron: form.layer4Micron,
      layer4Grammage: form.layer4Grammage,

      layers: form.structureType,
      microns: [form.layer1Micron, form.layer2Micron, form.layer3Micron, form.layer4Micron]
        .filter(Boolean)
        .join(" / "),

      specialStructureSpecs: form.specialStructureSpecs,
      grammage: form.grammage,
      grammageTolerance: form.grammageTolerance,
      sampleRequest: form.sampleRequest === "Sí",

      width: form.width,
      length: form.length,
      repetition: form.repetition,
      doyPackBase: form.doyPackBase,
      gussetWidth: form.gussetWidth,
      gussetType: form.gussetType,
      dimensions: [form.width, form.length, form.gussetWidth]
        .filter(Boolean)
        .join(" x "),

      hasZipper: form.hasZipper as BooleanLike,
      zipperType: form.zipperType,
      hasTinTie: form.hasTinTie as BooleanLike,
      hasValve: form.hasValve as BooleanLike,
      valveType: form.valveType,
      hasDieCutHandle: form.hasDieCutHandle as BooleanLike,
      hasReinforcement: form.hasReinforcement as BooleanLike,
      reinforcementThickness: form.reinforcementThickness,
      reinforcementWidth: form.reinforcementWidth,
      hasAngularCut: form.hasAngularCut as BooleanLike,
      hasRoundedCorners: form.hasRoundedCorners as BooleanLike,
      roundedCornersType: form.roundedCornersType,
      hasNotch: form.hasNotch as BooleanLike,
      hasPerforation: form.hasPerforation as BooleanLike,
      pouchPerforationType: form.pouchPerforationType,
      bagPerforationType: form.bagPerforationType,
      perforationLocation: form.perforationLocation,
      hasPreCut: form.hasPreCut as BooleanLike,
      preCutType: form.preCutType,
      otherAccessories: form.otherAccessories,

      saleType: form.saleType,
      incoterm: form.incoterm,
      destinationCountry: form.destinationCountry,
      targetPrice: form.targetPrice,
      currencyType: form.currencyType,
      coreMaterial: form.coreMaterial,
      coreDiameter: form.coreDiameter,
      externalDiameter: form.externalDiameter,
      externalVariationPlus: form.externalVariationPlus,
      externalVariationMinus: form.externalVariationMinus,
      maxRollWeight: form.maxRollWeight,
      customerAdditionalInfo: form.customerAdditionalInfo,
      peruvianProductLogo: form.peruvianProductLogo as YesNoPending,
      printingFooter: form.printingFooter as BooleanLike,
      deliveryAddress: form.deliveryAddress,
      additionalComment: form.additionalComment,
      designPlanFiles: form.designPlanFiles,

      status: shouldSubmitForValidation ? "Ficha completa" : "Ficha en curso",
      stage: shouldSubmitForValidation ? "P1_PREPARACION_FICHA" : originalProject?.stage || "P0_REGISTRO_COMERCIAL",
      updatedAt: now,

      ...(shouldSubmitForValidation && {
        validacionSolicitada: true,
        estadoValidacionGeneral: "En validación",
        stageUpdatedAt: now,
        fechaSolicitudValidacion: now,
        validaciones: [
          { area: "Artes Gráficas", estado: "Pendiente", comentarios: [] },
          { area: "R&D Técnica", estado: "Pendiente", comentarios: [] },
          { area: "R&D Desarrollo", estado: "Pendiente", comentarios: [] },
        ],
      }),
    } as unknown as ProjectRecord);

    if (shouldSubmitForValidation) {
  setShowValidationSuccessModal(true);
} else {
  navigate("/projects");
}
}; // <-- cierra handleSubmit

const CollapsibleSection = ({
  title,
  icon,
  color,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left transition-colors hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          {title}
        </h3>
      </div>

      <span className="text-lg font-bold text-slate-500">
        {isOpen ? "▾" : "▸"}
      </span>
    </button>

    {isOpen && <div className="p-5">{children}</div>}
  </div>
);

if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando proyecto...</div>;
  }

  if (!originalProject || !projectCode) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Proyecto no encontrado</div>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium"
        >
          Atrás
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] pb-32">
      {/* ========== HEADER REFORMADO ========== */}
      <div className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm">
        {/* Nivel 1: Botón Volver con texto */}
        <div className="border-b border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Atrás
          </button>
        </div>

        {/* Nivel 4: Avance de llenado */}
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-brand-primary">{completionPercentage}%</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nivel 5: Stepper de secciones */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-0 overflow-x-auto pb-1 -mx-4 px-4">
            {STEPS.map((step, index) => {
              const isActive = activeStep === index;
              const hasError = submitAttempted && stepsWithErrors[index] > 0;
              return (
                <Fragment key={index}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className="flex min-w-0 shrink-0 items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                        hasError
                          ? "border-2 border-red-400 text-red-600 bg-red-50"
                          : isActive
                            ? "bg-[#00395A] text-white"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-xs font-medium whitespace-nowrap hidden sm:inline ${
                        hasError
                          ? "text-red-600"
                          : isActive
                            ? "text-[#00395A]"
                            : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className="h-px flex-1 min-w-2 bg-slate-200" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <form id="project-edit-form" onSubmit={handleSubmit}>

        {/* ========== GRID DE 2 COLUMNAS ========== */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* ========== COLUMNA IZQUIERDA: PASOS DEL FORMULARIO ========== */}
          <div className="space-y-5">
            {/* PASO 0: INFORMACIÓN DEL PROYECTO */}
            {activeStep === 0 && (
              <div className="space-y-5">
                <FormCard title="Información del Proyecto" icon="▦" color="#00395A" required>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormInput
                      label="Acción Salesforce *"
                      value={form.salesforceAction}
                      onChange={(value) => updateField("salesforceAction", value)}
                      onBlur={() => markFieldAsTouched("salesforceAction")}
                      error={getError("salesforceAction")}
                      placeholder="Ej. Nueva oportunidad / RFQ / Muestra"
                    />

                    <div className="md:col-span-3">
                      <FormInput
                        label="Nombre del Proyecto *"
                        value={form.projectName}
                        onChange={(value) => updateField("projectName", value)}
                        onBlur={() => markFieldAsTouched("projectName")}
                        error={getError("projectName")}
                        placeholder="Ej. Mayonesa Light 100ml Doypack"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <FormTextarea
                        label="Descripción del Proyecto *"
                        value={form.projectDescription}
                        onChange={(value) => updateField("projectDescription", value)}
                        onBlur={() => markFieldAsTouched("projectDescription")}
                        error={getError("projectDescription")}
                        placeholder="Descripción comercial y técnica del proyecto..."
                      />
                    </div>

                    <div className="md:col-span-3">
                      <CommercialExecutiveMultiSearch
                        label="Ejecutivo Comercial *"
                        value={form.executiveId}
                        onChange={(value) => {
                          updateField("executiveId", value);
                          markFieldAsTouched("executiveId");
                        }}
                        error={getError("executiveId")}
                      />
                    </div>
                  </div>
                </FormCard>
              </div>
            )}

            {/* PASO 1: PRODUCTO COMERCIAL */}
            {activeStep === 1 && (
              <div className="space-y-5">
                <FormCard title="Datos de Producto Comercial" icon="◈" color="#27ae60" required>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 md:col-span-3">
                      <p className="text-xs text-slate-500 font-medium">Envoltura</p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{inheritedWrapping || "—"}</p>
                    </div>

                    <FormSelect
                      label="Clasificación *"
                      value={form.classification}
                      onChange={(value) => {
                        updateField("classification", value);
                        updateField("subClassification", "");
                        updateField("projectType", "");
                      }}
                      onBlur={() => markFieldAsTouched("classification")}
                      error={getError("classification")}
                      options={CLASSIFICATION_OPTIONS}
                      placeholder="-- Seleccione --"
                    />

                    <FormSelect
                      label={form.classification ? "Subsección Clasificación *" : "Subsección Clasificación"}
                      value={form.subClassification}
                      onChange={(value) => {
                        updateField("subClassification", value);
                        updateField("projectType", "");
                      }}
                      onBlur={() => markFieldAsTouched("subClassification")}
                      error={getError("subClassification")}
                      options={
                        form.classification === "Nuevo"
                          ? SUBCLASSIFICATION_NUEVO_OPTIONS
                          : form.classification === "Modificado"
                            ? SUBCLASSIFICATION_MODIFICADO_OPTIONS
                            : []
                      }
                      placeholder="-- Seleccione --"
                      disabled={!form.classification}
                    />

                    <FormSelect
                      label={
                        form.subClassification &&
                        form.classification !== "Modificado" &&
                        projectTypeOptions.length > 0
                          ? "Tipo de Proyecto *"
                          : "Tipo de Proyecto"
                      }
                      value={form.projectType}
                      onChange={(value) => updateField("projectType", value)}
                      onBlur={() => markFieldAsTouched("projectType")}
                      error={getError("projectType")}
                      options={projectTypeOptions}
                      placeholder={
                        form.classification === "Modificado"
                          ? "No aplica para modificado"
                          : !form.subClassification
                            ? "-- Seleccione subsección primero --"
                            : "-- Seleccione --"
                      }
                      disabled={
                        form.classification === "Modificado" ||
                        !form.subClassification ||
                        projectTypeOptions.length === 0
                      }
                    />

                    <FormSelect
                      label="Formato de Plano *"
                      value={form.blueprintFormat}
                      onChange={(value) => updateField("blueprintFormat", value)}
                      onBlur={() => markFieldAsTouched("blueprintFormat")}
                      error={getError("blueprintFormat")}
                      placeholder={!inheritedWrapping ? "Seleccione un portafolio primero" : "-- Seleccione --"}
                      options={getBlueprintFormatOptions(inheritedWrapping)}
                      disabled={!inheritedWrapping}
                    />

                    <FormSelect
                      label="Aplicación Técnica *"
                      value={form.technicalApplication}
                      onChange={(value) => updateField("technicalApplication", value)}
                      onBlur={() => markFieldAsTouched("technicalApplication")}
                      error={getError("technicalApplication")}
                      placeholder="-- Seleccione --"
                      options={TECHNICAL_APPLICATION_OPTIONS}
                    />

                    <FormInput
                      label="Código de Empaque del Cliente"
                      value={form.customerPackingCode}
                      onChange={(value) => updateField("customerPackingCode", value)}
                      placeholder="Ej. COD-CLI-001"
                    />
                  </div>
                </FormCard>
              </div>
            )}

            {/* PASO 2: DISEÑO */}
            {activeStep === 2 && (
              <div className="space-y-5">
                <FormCard title="Especificaciones de diseño" icon="🎨" color="#8e44ad">
                  {(() => {
                    const isPrintingDisabled = form.printClass === "Sin impresión";

                    return (
                      <div className="space-y-4">
                        {/* Línea 1: Diseño de referencia + EDAG */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <FormSelect
                            label="¿Tiene Diseño de referencia? *"
                            value={form.hasEdagReference}
                            onChange={(value) => {
                              updateField("hasEdagReference", value);
                              markFieldAsTouched("hasEdagReference");
                            }}
                            onBlur={() => markFieldAsTouched("hasEdagReference")}
                            error={getError("hasEdagReference")}
                            placeholder="-- Seleccione --"
                            options={YES_NO_OPTIONS}
                          />

                          {form.hasEdagReference === "Sí" && (
                            <>
                              <FormInput
                                label="Código EDAG"
                                value={form.edagCode}
                                onChange={(value) => updateField("edagCode", value)}
                                placeholder="Ej. EDAG-000001"
                                disabled={form.printClass === "Sin impresión"}
                              />

                              <FormInput
                                label="Versión EDAG"
                                value={form.edagVersion}
                                onChange={(value) => updateField("edagVersion", value)}
                                placeholder="Ej. 01"
                                disabled={form.printClass === "Sin impresión"}
                              />
                            </>
                          )}
                        </div>

                        {/* Línea 2: Impresión + especificaciones */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <FormSelect
                            label="Impresión *"
                            value={form.printClass}
                            onChange={(value) => updateField("printClass", value)}
                            onBlur={() => markFieldAsTouched("printClass")}
                            error={getError("printClass")}
                            placeholder="-- Seleccione --"
                            options={PRINT_CLASS_OPTIONS}
                          />

                          <FormSelect
                            label={form.printClass && form.printClass !== "Sin impresión" ? "Tipo *" : "Tipo"}
                            value={form.printType}
                            onChange={(value) => updateField("printType", value)}
                            onBlur={() => markFieldAsTouched("printType")}
                            error={getError("printType")}
                            placeholder="-- Seleccione --"
                            options={PRINT_TYPE_OPTIONS}
                            disabled={isPrintingDisabled}
                          />

                          <FormSelect
                            label="Especificaciones Especiales"
                            value={form.specialDesignSpecs}
                            onChange={(value) => updateField("specialDesignSpecs", value)}
                            placeholder="-- Seleccione --"
                            options={SPECIAL_DESIGN_SPECS_OPTIONS}
                            disabled={isPrintingDisabled}
                          />
                        </div>

                        {/* Línea 3: Comentarios */}
                        {form.specialDesignSpecs === "Otros (comentar cuáles)" && (
                          <FormTextarea
                            label="Comentarios de diseños especiales"
                            value={form.specialDesignComments}
                            onChange={(value) => updateField("specialDesignComments", value)}
                            placeholder="Comentarios adicionales de Artes Gráficas..."
                          />
                        )}

                        {/* Línea final: Requiere trabajo de diseño */}
                        {form.printClass && (
                          <FormSelect
                            label="¿Requiere trabajo de diseño?"
                            value={form.printClass === "Sin impresión" ? "No" : "Sí"}
                            onChange={() => {}}
                            options={YES_NO_OPTIONS}
                            disabled={true}
                          />
                        )}
                      </div>
                    );
                  })()}
                </FormCard>


                <ProjectPlansUploadSection
                  projectCode={projectCode}
                  error={getError("designPlanFiles")}
                  required={form.hasEdagReference === "Sí"}
                  onFilesChange={(fileNames) => {
                    updateField("designPlanFiles", fileNames);
                    markFieldAsTouched("designPlanFiles");
                  }}
                />
              </div>
            )}

            {/* PASO 3: ESTRUCTURA - Mostrar el paso 3 con más contenido */}
            {activeStep === 3 && (
              <div className="space-y-5">
                <CollapsibleSection
                  title="Especificaciones de estructura"
                  icon="🔩"
                  color="#f39c12"
                  isOpen={openStructureSections.specs}
                  onToggle={() => toggleStructureSection("specs")}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormSelect
                      label="¿Tiene estructura de referencia?"
                      value={form.hasReferenceStructure}
                      onChange={(value) => updateField("hasReferenceStructure", value)}
                      placeholder="-- Seleccione --"
                      options={YES_NO_OPTIONS}
                    />
                    {form.hasReferenceStructure === "Sí" && (
                      <>
                        <FormInput
                          label="Código E/M Referencia"
                          value={form.referenceEmCode}
                          onChange={(value) => updateField("referenceEmCode", value)}
                          placeholder="Ej. EM-000001"
                        />
                        <FormInput
                          label="Versión E/M"
                          value={form.referenceEmVersion}
                          onChange={(value) => updateField("referenceEmVersion", value)}
                          placeholder="Ej. 01"
                        />
                      </>
                    )}
                    {form.hasReferenceStructure !== "Sí" && (
                      <FormSelect
                        label="Tipo de Estructura"
                        value={form.structureType}
                        onChange={(value) => updateField("structureType", value)}
                        placeholder="-- Seleccione --"
                        options={STRUCTURE_TYPE_OPTIONS}
                      />
                    )}
                  </div>

                  {form.hasReferenceStructure !== "Sí" && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                      Capas de estructura
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {(() => {
                        const maxLayers = activeLayerCount;
                        return [1, 2, 3, 4].filter(layer => layer <= maxLayers).map((layer) => {
                        const groupKey = `layer${layer}MaterialGroup` as keyof ProjectEditFormData;
                        const materialKey = `layer${layer}Material` as keyof ProjectEditFormData;
                        const micronKey = `layer${layer}Micron` as keyof ProjectEditFormData;
                        const grammageKey = `layer${layer}Grammage` as keyof ProjectEditFormData;

                        const group = form[groupKey] as string;
                        const groupOptions = group ? MATERIAL_CATALOG[group] : [];
                        const selectedMaterial = group ? MATERIAL_CATALOG[group]?.find(m => m.value === form[materialKey]) : null;
                        const isMicronFree = selectedMaterial?.isFree ?? false;

                        return (
                          <div key={layer} className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="mb-3 text-xs font-bold uppercase text-brand-primary">
                              Capa {layer}
                            </p>
                            <div className="space-y-3">
                              <FormSelect
                                label="Grupo Materia Prima *"
                                value={group}
                                onChange={(value) => {
                                  updateField(groupKey, value);
                                  updateField(materialKey, "");
                                  updateField(micronKey, "");
                                  updateField(grammageKey, "");
                                  markFieldAsTouched(groupKey);
                                }}
                                onBlur={() => markFieldAsTouched(groupKey)}
                                error={getError(groupKey)}
                                placeholder="-- Seleccione grupo --"
                                options={MATERIAL_GROUP_OPTIONS}
                              />
                              <FormSelect
                                label="Tipo de Materia Prima *"
                                value={form[materialKey] as string}
                                onChange={(value) => {
                                  updateField(materialKey, value);

                                  const entry = MATERIAL_CATALOG[group]?.find((m) => m.value === value);

                                  if (entry && !entry.isFree) {
                                    updateField(micronKey, entry.micron);
                                    updateField(grammageKey, entry.grammage);
                                  } else {
                                    updateField(micronKey, "");
                                    updateField(grammageKey, "");
                                  }

                                  markFieldAsTouched(materialKey);
                                  markFieldAsTouched(micronKey);
                                  markFieldAsTouched(grammageKey);
                                }}
                                onBlur={() => markFieldAsTouched(materialKey)}
                                error={getError(materialKey)}
                                options={groupOptions}
                                disabled={!group}
                                placeholder="-- Seleccione tipo --"
                              />
                              <FormInput
                                label="Micraje *"
                                value={form[micronKey] as string}
                                onChange={(value) => updateField(micronKey, value)}
                                onBlur={() => markFieldAsTouched(micronKey)}
                                error={getError(micronKey)}
                                disabled={!isMicronFree}
                                placeholder={isMicronFree ? "Ingrese micraje" : "Auto"}
                              />
                              <FormInput
                                label="Gramaje *"
                                value={form[grammageKey] as string}
                                onChange={(value) => updateField(grammageKey, value)}
                                onBlur={() => markFieldAsTouched(grammageKey)}
                                error={getError(grammageKey)}
                                disabled={!isMicronFree}
                                placeholder={isMicronFree ? "Ingrese gramaje" : "Auto"}
                              />
                            </div>
                          </div>
                        );
                      });
                      })()}
                    </div>

                    {(() => {
                      const completedLayers: string[] = [];
                      const missingLayers: string[] = [];

                      for (let i = 1; i <= activeLayerCount; i++) {
                        const material = form[`layer${i}Material` as keyof ProjectEditFormData] as string;
                        const micron = form[`layer${i}Micron` as keyof ProjectEditFormData] as string;
                        const grammage = form[`layer${i}Grammage` as keyof ProjectEditFormData] as string;

                        const isLayerComplete = material && micron && grammage;

                        if (isLayerComplete) {
                          const materialDisplay = getMaterialTypeForSummary(material);
                          completedLayers.push(`${materialDisplay}, ${micron}`);
                        } else {
                          missingLayers.push(`Capa ${i}`);
                        }
                      }

                      return (
                        <div className="mt-4 rounded-lg bg-white border border-slate-200 p-3">
                          <p className="text-xs font-semibold text-slate-600 mb-2">
                            Materia Prima General:
                          </p>

                          {completedLayers.length > 0 ? (
                            <p className="text-sm text-slate-700 font-medium break-words">
                              {completedLayers.join(" | ")}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-500">
                              Aún no hay capas completas.
                            </p>
                          )}

                          {missingLayers.length > 0 && (
                            <p className="mt-2 text-xs font-medium text-red-600">
                              Falta completar: {missingLayers.join(", ")}.
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  )}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormInput
                      label="Gramaje general (g/m2) *"
                      value={form.grammage}
                      onChange={() => {}}
                      onBlur={() => markFieldAsTouched("grammage")}
                      error={getError("grammage")}
                      placeholder="Calculado automáticamente"
                      disabled={true}
                    />

                    <FormInput
                      label="Tolerancia de Gramaje *"
                      value={form.grammageTolerance}
                      onChange={(value) => updateField("grammageTolerance", value)}
                      onBlur={() => markFieldAsTouched("grammageTolerance")}
                      error={getError("grammageTolerance")}
                      placeholder="Ej. ±5%"
                    />

                    <FormSelect
                      label="¿Solicitud de muestra? *"
                      value={form.sampleRequest}
                      onChange={(value) => {
                        updateField("sampleRequest", value);
                        markFieldAsTouched("sampleRequest");
                      }}
                      onBlur={() => markFieldAsTouched("sampleRequest")}
                      error={getError("sampleRequest")}
                      placeholder="-- Seleccione --"
                      options={YES_NO_OPTIONS}
                    />

                    <p className="md:col-span-3 text-xs text-slate-500">
                      Cálculo del gramaje general: suma de gramajes de capas (
                      {formatGrammageValue(layerGrammageTotal)} g/m2) + Tintas y Adhesivos{" "}
                      {form.structureType
                        ? `(${form.structureType}: ${formatGrammageValue(fixedInkAdhesiveGrammage)} g/m2)`
                        : "(según tipo de estructura)"}
                      {" "} = {form.grammage || "0"} g/m2.
                    </p>

                    <div className="md:col-span-3">
                      <FormTextarea
                        label="Comentarios"
                        value={form.specialStructureSpecs}
                        onChange={(value) => updateField("specialStructureSpecs", value)}
                        placeholder="Restricciones, barreras, sellabilidad, resistencia, OTR/WVTR..."
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Dimensiones y accesorios"
                  icon="⌗"
                  color="#16a085"
                  isOpen={openStructureSections.dimensions}
                  onToggle={() => toggleStructureSection("dimensions")}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    {(() => {
                      const wrapping = inheritedWrapping?.toLowerCase() || "";
                      const showRepetition = shouldShowRepetitionField(inheritedWrapping, form.blueprintFormat);
const isPouchOrBolsa = wrapping.includes("pouch") || wrapping.includes("bolsa");
                      return (
                        <>
                          {isPouchOrBolsa && (
                            <FormInput
                              label={shouldApplyPouchDoyPackRestrictions ? "Ancho *" : "Ancho"}
                              value={form.width}
                              onChange={(value) => updateField("width", value)}
                              onBlur={() => markFieldAsTouched("width")}
                              error={getError("width")}
                              placeholder={shouldApplyPouchDoyPackRestrictions ? "80 - 230 mm" : "mm"}
                            />
                          )}
                          <FormInput
                            label={shouldApplyPouchDoyPackRestrictions ? "Largo *" : "Largo"}
                            value={form.length}
                            onChange={(value) => updateField("length", value)}
                            onBlur={() => markFieldAsTouched("length")}
                            error={getError("length")}
                            placeholder={shouldApplyPouchDoyPackRestrictions ? "134 - 340 mm" : "mm"}
                          />
                          {showRepetition && (
                            <FormInput
                              label="Repetición *"
                              value={form.repetition}
                              onChange={(value) => updateField("repetition", value)}
                              onBlur={() => markFieldAsTouched("repetition")}
                              error={getError("repetition")}
                              placeholder="mm"
                            />
                          )}
                          {wrapping.includes("pouch") && (
                            <FormSelect
                              label={shouldApplyPouchDoyPackRestrictions ? "Base Doy Pack *" : "Base Doy Pack"}
                              value={form.doyPackBase}
                              onChange={(value) => {
                                updateField("doyPackBase", value);
                                markFieldAsTouched("doyPackBase");
                              }}
                              error={getError("doyPackBase")}
                              placeholder="-- Seleccione --"
                              options={DOY_PACK_BASE_OPTIONS}
                            />
                          )}
                          <FormInput
                            label={shouldApplyPouchDoyPackRestrictions ? "Ancho Fuelle *" : "Ancho Fuelle"}
                            value={form.gussetWidth}
                            onChange={(value) => updateField("gussetWidth", value)}
                            onBlur={() => markFieldAsTouched("gussetWidth")}
                            error={getError("gussetWidth")}
                            placeholder={shouldApplyPouchDoyPackRestrictions ? "0 - 3 mm" : "mm"}
                          />
                          <FormSelect
                            label={shouldApplyPouchDoyPackRestrictions ? "Tipo de Fuelle *" : "Tipo de Fuelle"}
                            value={form.gussetType}
                            onChange={(value) => {
                              updateField("gussetType", value);
                              markFieldAsTouched("gussetType");
                            }}
                            error={getError("gussetType")}
                            placeholder="-- Seleccione --"
                            options={GUSSET_TYPE_OPTIONS}
                          />
                        </>
                      );
                    })()}
                  </div>

                  <div className="mt-4 space-y-5">
                    {(() => {
                      const selectedAccessories = [
                        form.hasZipper === "Sí" ? "hasZipper" : null,
                        form.hasTinTie === "Sí" ? "hasTinTie" : null,
                        form.hasValve === "Sí" ? "hasValve" : null,
                        form.hasDieCutHandle === "Sí" ? "hasDieCutHandle" : null,
                        form.hasReinforcement === "Sí" ? "hasReinforcement" : null,
                        form.hasAngularCut === "Sí" ? "hasAngularCut" : null,
                        form.hasRoundedCorners === "Sí" ? "hasRoundedCorners" : null,
                        form.hasNotch === "Sí" ? "hasNotch" : null,
                        form.hasPerforation === "Sí" ? "hasPerforation" : null,
                        form.hasPreCut === "Sí" ? "hasPreCut" : null,
                      ].filter(Boolean) as string[];

                      const selectedCount = selectedAccessories.length;
                      const canSelectMore = selectedCount < 3;

                      const toggleAccessory = (field: keyof ProjectEditFormData) => {
                        const isCurrentlySelected = form[field] === "Sí";
                        if (isCurrentlySelected) {
                          updateField(field, "No");
                        } else if (canSelectMore) {
                          updateField(field, "Sí");
                        }
                      };

                      const AccessoryCheckbox = ({ field, label }: { field: keyof ProjectEditFormData; label: string }) => (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form[field] === "Sí"}
                            onChange={() => toggleAccessory(field)}
                            disabled={form[field] !== "Sí" && !canSelectMore}
                            className="w-4 h-4 rounded border-slate-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className={`text-sm ${form[field] !== "Sí" && !canSelectMore ? "text-slate-400" : "text-slate-700"}`}>
                            {label}
                          </span>
                        </label>
                      );

                      return (
                        <>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="mb-3 text-xs font-bold uppercase text-slate-600">Accesorios Consumibles</p>
                            <div className="space-y-3">
                              <AccessoryCheckbox field="hasZipper" label="Zipper" />
                              {form.hasZipper === "Sí" && (
                                <FormSelect label="Tipo de Zipper" value={form.zipperType} onChange={(value) => updateField("zipperType", value)} placeholder="-- Seleccione --" options={ZIPPER_TYPE_OPTIONS} />
                              )}
                              <AccessoryCheckbox field="hasTinTie" label="Tin-Tie" />
                              <AccessoryCheckbox field="hasValve" label="Válvula" />
                              {form.hasValve === "Sí" && (
                                <FormSelect label="Tipo de Válvula" value={form.valveType} onChange={(value) => updateField("valveType", value)} placeholder="-- Seleccione --" options={VALVE_TYPE_OPTIONS} />
                              )}
                            </div>
                          </div>

                          {(() => {
                            const wrappingForAccesorios = inheritedWrapping?.toLowerCase() || "";
                            const isBolsa = wrappingForAccesorios.includes("bolsa");
                            return isBolsa ? (
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-3 text-xs font-bold uppercase text-slate-600">Accesorios Producto</p>
                                <div className="space-y-3">
                                  <AccessoryCheckbox field="hasDieCutHandle" label="Asa Troquelada" />
                                  <AccessoryCheckbox field="hasReinforcement" label="Refuerzo" />
                                  {form.hasReinforcement === "Sí" && (
                                    <div className="grid grid-cols-2 gap-3">
                                      <FormInput label="Espesor Refuerzo (g/m2)" value={form.reinforcementThickness} onChange={(value) => updateField("reinforcementThickness", value)} placeholder="Ej. 100" />
                                      <FormInput label="Ancho Refuerzo (mm)" value={form.reinforcementWidth} onChange={(value) => updateField("reinforcementWidth", value)} placeholder="Ej. 50" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null;
                          })()}

                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="mb-3 text-xs font-bold uppercase text-slate-600">Accesorios Internos</p>
                            <div className="space-y-3">
                              <AccessoryCheckbox field="hasAngularCut" label="Corte Angular" />
                              <AccessoryCheckbox field="hasRoundedCorners" label="Esquinas Redondas" />
                              {form.hasRoundedCorners === "Sí" && (
                                <FormSelect label="Tipo Esquinas Redondas" value={form.roundedCornersType} onChange={(value) => updateField("roundedCornersType", value)} placeholder="-- Seleccione --" options={ROUNDED_CORNERS_TYPE_OPTIONS} />
                              )}
                              <AccessoryCheckbox field="hasNotch" label="Muesca" />
                              <AccessoryCheckbox field="hasPerforation" label="Perforación" />
                              {form.hasPerforation === "Sí" && (
                                <div className="space-y-3">
                                  <FormSelect label="Tipo Perforación Pouch" value={form.pouchPerforationType} onChange={(value) => updateField("pouchPerforationType", value)} placeholder="-- Seleccione --" options={POUCH_PERFORATION_TYPE_OPTIONS} />
                                  <FormSelect label="Tipo Perforación Bolsa" value={form.bagPerforationType} onChange={(value) => updateField("bagPerforationType", value)} placeholder="-- Seleccione --" options={BAG_PERFORATION_TYPE_OPTIONS} />
                                  <FormSelect label="Ubicación Perforaciones" value={form.perforationLocation} onChange={(value) => updateField("perforationLocation", value)} placeholder="-- Seleccione --" options={PERFORATION_LOCATION_OPTIONS} />
                                </div>
                              )}
                              <AccessoryCheckbox field="hasPreCut" label="Pre-Corte" />
                              {form.hasPreCut === "Sí" && (
                                <FormSelect label="Tipo de Pre-Corte" value={form.preCutType} onChange={(value) => updateField("preCutType", value)} placeholder="-- Seleccione --" options={PRECUT_TYPE_OPTIONS} />
                              )}
                            </div>
                          </div>

                          <FormSelect
                            label="Otros accesorios"
                            value={form.otherAccessories}
                            onChange={(value) => updateField("otherAccessories", value)}
                            placeholder="-- Seleccione --"
                            options={OTHER_ACCESSORIES_OPTIONS}
                          />

                          <div className="text-xs text-slate-500 text-center">
                            Accesorios seleccionados: {selectedCount}/3 {!canSelectMore && "(máximo alcanzado)"}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Documentos"
                  icon="📄"
                  color="#e67e22"
                  isOpen={openStructureSections.documents}
                  onToggle={() => toggleStructureSection("documents")}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormSelect
                        label="¿Tiene Especificación Técnica del Cliente?"
                        value={form.hasCustomerTechnicalSpec}
                        onChange={(value) => {
                          updateField("hasCustomerTechnicalSpec", value);

                          if (value !== "Sí") {
                            updateField("customerTechnicalSpecAttachment", "");
                          }

                          markFieldAsTouched("hasCustomerTechnicalSpec");
                        }}
                        onBlur={() => markFieldAsTouched("hasCustomerTechnicalSpec")}
                        error={getError("hasCustomerTechnicalSpec")}
                        placeholder="-- Seleccione --"
                        options={YES_NO_OPTIONS}
                      />

                      {form.hasCustomerTechnicalSpec === "Sí" && (
                        <div
                          className={`md:col-span-3 rounded-xl border bg-slate-50 p-4 ${
                            getError("customerTechnicalSpecAttachment")
                              ? "border-red-400"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm">
                              📎
                            </span>

                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                                Especificación Técnica del Cliente Adjunto *
                              </h4>
                              <p className="text-xs text-slate-500">
                                Archivo permitido: PDF. Nombre sugerido: Empresa_Especificación_Rev.A.pdf
                              </p>
                            </div>
                          </div>

                          <label
                            className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
                              getError("customerTechnicalSpecAttachment")
                                ? "border-red-300 bg-red-50"
                                : "border-slate-300 bg-white hover:bg-slate-50"
                            }`}
                            onDragOver={(event) => {
                              event.preventDefault();
                            }}
                            onDrop={(event) => {
                              event.preventDefault();
                              const file = event.dataTransfer.files?.[0];
                              handleCustomerTechnicalSpecFile(file);
                            }}
                          >
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                handleCustomerTechnicalSpecFile(file);
                              }}
                              onBlur={() => markFieldAsTouched("customerTechnicalSpecAttachment")}
                            />

                            <span className="mb-2 text-sm font-semibold text-slate-700">
                              Soltar PDF aquí o seleccionar archivo
                            </span>

                            <span className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                              Seleccionar archivo PDF
                            </span>

                            <p className="mt-3 text-xs text-slate-500">
                              {form.customerTechnicalSpecAttachment
                                ? `Archivo seleccionado: ${form.customerTechnicalSpecAttachment}`
                                : "Ningún archivo seleccionado"}
                            </p>
                          </label>

                          {getError("customerTechnicalSpecAttachment") && (
                            <p className="mt-2 text-xs font-medium text-red-600">
                              {getError("customerTechnicalSpecAttachment")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <ProjectDocumentsSection
                      projectCode={projectCode}
                      showPlans={false}
                      embedded={true}
                    />
                  </div>
                </CollapsibleSection>
              </div>
            )}

            {/* PASO 4: CONDICIONES COMERCIALES */}
            {activeStep === 4 && (
              <div className="space-y-5">
                <FormCard title="Condiciones comerciales" icon="💰" color="#0d4c5c">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormInput
                      label="Cantidad / Volumen estimado *"
                      value={form.estimatedVolume}
                      onChange={(value) => updateField("estimatedVolume", value)}
                      onBlur={() => markFieldAsTouched("estimatedVolume")}
                      error={getError("estimatedVolume")}
                      placeholder="Ej. 500"
                    />

                    <FormSelect
                      label="Unidad de Medida *"
                      value={form.unitOfMeasure}
                      onChange={(value) => updateField("unitOfMeasure", value)}
                      onBlur={() => markFieldAsTouched("unitOfMeasure")}
                      error={getError("unitOfMeasure")}
                      options={UNIT_OPTIONS}
                      placeholder="-- Seleccione --"
                    />

                    <FormSelect label="Venta Nacional / Internacional *" value={form.saleType} onChange={(value) => updateField("saleType", value)} options={SALE_TYPE_OPTIONS} />
                    <FormSelect label="Incoterm" value={form.incoterm} onChange={(value) => updateField("incoterm", value)} options={INCOTERM_OPTIONS} />
                    <FormSelect label="País Destino" value={form.destinationCountry} onChange={(value) => updateField("destinationCountry", value)} options={DESTINATION_COUNTRY_OPTIONS} />

                    <FormInput label="Precio Objetivo" value={form.targetPrice} onChange={(value) => updateField("targetPrice", value)} placeholder="Ej. 45" />
                    <FormSelect label="Tipo de Moneda" value={form.currencyType} onChange={(value) => updateField("currencyType", value)} options={CURRENCY_OPTIONS} />
                  </div>
                </FormCard>

              </div>
            )}

            {/* PASO 5: INFORMACIÓN ADICIONAL */}
              {activeStep === 5 && (
                <div className="space-y-5">
                  <FormCard title="Información adicional" icon="📝" color="#00395A">
                    <div className="space-y-6">
                      {/* Sección 1: Especificaciones de Core */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm">
                            🧻
                          </span>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                              Especificaciones de Core
                            </h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <FormSelect
                            label="Material del Core"
                            value={form.coreMaterial}
                            onChange={(value) => {
                              updateField("coreMaterial", value);
                              markFieldAsTouched("coreMaterial");
                            }}
                            onBlur={() => markFieldAsTouched("coreMaterial")}
                            error={getError("coreMaterial")}
                            placeholder="-- Seleccione --"
                            options={CORE_MATERIAL_OPTIONS}
                          />

                          <FormInput
                            label="Diámetro Core"
                            value={form.coreDiameter}
                            onChange={(value) => updateField("coreDiameter", value)}
                            onBlur={() => markFieldAsTouched("coreDiameter")}
                            error={getError("coreDiameter")}
                            placeholder="Ej. 76"
                          />

                          <FormInput
                            label="Diámetro Externo"
                            value={form.externalDiameter}
                            onChange={(value) => updateField("externalDiameter", value)}
                            onBlur={() => markFieldAsTouched("externalDiameter")}
                            error={getError("externalDiameter")}
                            placeholder="Ej. 600"
                          />

                          <FormInput
                            label="Variación Externa +"
                            value={form.externalVariationPlus}
                            onChange={(value) => updateField("externalVariationPlus", value)}
                            onBlur={() => markFieldAsTouched("externalVariationPlus")}
                            error={getError("externalVariationPlus")}
                            placeholder="Ej. 5"
                          />

                          <FormInput
                            label="Variación Externa -"
                            value={form.externalVariationMinus}
                            onChange={(value) => updateField("externalVariationMinus", value)}
                            onBlur={() => markFieldAsTouched("externalVariationMinus")}
                            error={getError("externalVariationMinus")}
                            placeholder="Ej. 5"
                          />

                          <FormInput
                            label="Peso Máximo Rollo (kg)"
                            value={form.maxRollWeight}
                            onChange={(value) => updateField("maxRollWeight", value)}
                            onBlur={() => markFieldAsTouched("maxRollWeight")}
                            error={getError("maxRollWeight")}
                            placeholder="Ej. 500"
                          />
                        </div>
                      </div>

                      {/* Sección 2: Datos adicionales del cliente */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm">
                            📌
                          </span>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                              Datos adicionales del cliente
                            </h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="md:col-span-3">
                            <FormTextarea
                              label="Información adicional cliente"
                              value={form.customerAdditionalInfo}
                              onChange={(value) => updateField("customerAdditionalInfo", value)}
                              onBlur={() => markFieldAsTouched("customerAdditionalInfo")}
                              error={getError("customerAdditionalInfo")}
                              placeholder="Información adicional proporcionada por el cliente..."
                            />
                          </div>

                          <FormSelect
                            label='Logo "Producto Peruano"'
                            value={form.peruvianProductLogo}
                            onChange={(value) => {
                              updateField("peruvianProductLogo", value);
                              markFieldAsTouched("peruvianProductLogo");
                            }}
                            onBlur={() => markFieldAsTouched("peruvianProductLogo")}
                            error={getError("peruvianProductLogo")}
                            placeholder="-- Seleccione --"
                            options={YES_NO_OPTIONS}
                          />

                          <FormSelect
                            label="Pie de Imprenta"
                            value={form.printingFooter}
                            onChange={(value) => {
                              updateField("printingFooter", value);
                              markFieldAsTouched("printingFooter");
                            }}
                            onBlur={() => markFieldAsTouched("printingFooter")}
                            error={getError("printingFooter")}
                            placeholder="-- Seleccione --"
                            options={YES_NO_OPTIONS}
                          />

                          <div className="md:col-span-3">
                            <FormTextarea
                              label="Dirección de entrega"
                              value={form.deliveryAddress}
                              onChange={(value) => updateField("deliveryAddress", value)}
                              onBlur={() => markFieldAsTouched("deliveryAddress")}
                              error={getError("deliveryAddress")}
                              placeholder="Ingrese la dirección de entrega..."
                            />
                          </div>

                          <div className="md:col-span-3">
                            <FormTextarea
                              label="Comentario"
                              value={form.additionalComment}
                              onChange={(value) => updateField("additionalComment", value)}
                              onBlur={() => markFieldAsTouched("additionalComment")}
                              error={getError("additionalComment")}
                              placeholder="Comentarios adicionales..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormCard>
                </div>
              )}
          </div>

          {/* ========== COLUMNA DERECHA: PANEL DE CONTEXTO (STICKY) ========== */}
          <div className="space-y-5">
            {/* TARJETA A: PORTAFOLIO BASE */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-sm text-slate-900 mb-3">Portafolio base</h3>
              <PortfolioSearch
                label="Portafolio base *"
                value={form.portfolioCode}
                onChange={(value) => {
                  updateField("portfolioCode", value);
                  updateField("blueprintFormat", "");
                  markFieldAsTouched("portfolioCode");
                }}
                error={getError("portfolioCode")}
              />
              {!form.portfolioCode && (
                <p className="text-xs text-slate-400 mt-3 italic">
                  Selecciona un portafolio para ver la información heredada.
                </p>
              )}
            </div>

            {/* TARJETA B: HERENCIA DEL PORTAFOLIO */}
            {selectedPortfolio && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-sm text-slate-900 mb-3">Herencia del portafolio</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <PreviewRow
                      label="Portafolio Base"
                      value={inheritedPortfolioDisplay || "—"}
                    />
                    <PreviewRow label="Cliente" value={inheritedClient || "—"} />
                    <PreviewRow label="Planta" value={inheritedPlant || "—"} />
                    <PreviewRow label="Envoltura" value={inheritedWrapping || "—"} />
                    <PreviewRow label="Uso Final" value={inheritedFinalUse || "—"} />
                    <PreviewRow label="Sub-segmento" value={inheritedSubSegment || "—"} />
                    <PreviewRow label="Segmento" value={inheritedSegment || "—"} />
                    <PreviewRow label="Sector" value={inheritedSector || "—"} />
                    <PreviewRow label="AFMarketID" value={inheritedAfMarketId || "—"} />
                    <PreviewRow label="Máquina / Envasado" value={inheritedMachine || "—"} />
                  </div>

                  {inheritedWrapping && (
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={getWrappingImage(inheritedWrapping)}
                        alt={inheritedWrapping}
                        className="max-w-full max-h-48 object-contain rounded-lg bg-slate-50 p-2 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/envolturas/default.png";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
            {/* BOTONES DE NAVEGACIÓN ENTRE PASOS */}
            {activeStep < STEPS.length && (
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>

                <div className="text-xs text-slate-500">
                  Paso {activeStep + 1} de {STEPS.length}
                </div>

                {activeStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <div className="w-[80px]" />
                )}
              </div>
            )}
        {/* ========== FOOTER STICKY: BOTONES DE ACCIÓN ========== */}
<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/projects")}
            validationErrorList={Object.values(validationErrors).filter(
              (error): error is string => Boolean(error)
            )}
            submitAttempted={submitAttempted}
            submitLabel={primaryButtonLabel}
            cancelLabel="Cancelar"
            validationTitle="Faltan campos obligatorios."
          />
        </div>
      </form>

      {/* ========== MISSING FIELDS DECISION MODAL ========== */}
      {showMissingFieldsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
              <h3 className="text-lg font-bold text-amber-900">
                Campos obligatorios pendientes
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Este proyecto tiene campos obligatorios sin completar. Puedes revisar
                los campos pendientes antes de actualizar o guardar el avance actual.
              </p>
            </div>

            <div className="max-h-[420px] overflow-y-auto px-6 py-4">
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  Completitud actual: {completionPercentage}%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Faltan {missingFieldCount} campo(s) obligatorio(s) para completar el proyecto.
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(missingFieldsByStep).map(([stepNum, fields]) => {
                  if (fields.length === 0) return null;

                  const step = STEPS[Number(stepNum)];

                  return (
                    <div
                      key={stepNum}
                      className="rounded-lg border border-amber-200 bg-amber-50/60 p-3"
                    >
                      <p className="mb-2 text-sm font-bold text-amber-900">
                        {step.label}
                      </p>

                      <ul className="space-y-1 pl-4 text-sm text-amber-800">
                        {fields.map((field) => (
                          <li key={field} className="list-disc">
                            {FIELD_LABELS[field as keyof ProjectEditFormData] ||
                              field.replace(/([A-Z])/g, " $1").trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReviewMissingFields}
                className="rounded-lg border border-brand-primary bg-white px-4 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-slate-50"
              >
                Revisar campos faltantes
              </button>

              <button
                type="button"
                onClick={handleSaveProgressAnyway}
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/90"
              >
                Guardar avance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== COMPLETION SUCCESS MODAL ========== */}
      {showValidationSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-4">
            <div className="bg-green-50 border-b border-green-200 px-6 py-4">
              <h3 className="text-lg font-bold text-green-900">Solicitud de validación enviada</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-slate-700">
                La ficha ha sido enviada para validación a los equipos de R&D y Artes Gráficas.
              </p>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm">
                <p><span className="font-semibold">Proyecto:</span> {projectCode}</p>
                <p><span className="font-semibold">Estado:</span> Pendiente de validación</p>
              </div>
            </div>
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => navigate(`/validaciones?projectCode=${projectCode}`)}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded font-medium hover:bg-brand-primary/90 transition-colors text-sm"
              >
                Ir a validaciones
              </button>
              <button
                onClick={() => {
                  setShowValidationSuccessModal(false);
                  navigate(`/projects/${projectCode}`);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded font-medium hover:bg-slate-300 transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
