import type { ProjectProductStatus, ProjectProductType, AreaValidationStatus } from "./projectWorkflow";
import { getProductStateDefinition, getProductStateMeaning } from "./projectProductSemantics";

const STORAGE_KEY = "odiseo_project_products";

export type ProjectProductRecord = {
  id: string;
  projectCode: string;

  productRequestCode: string;
  productName: string;
  productDescription?: string;

  productType: ProjectProductType;
  status: ProjectProductStatus;

  // Relación con producto base
  baseProductId?: string;
  baseProductSku?: string;
  baseProductName?: string;
  createdFromApprovedProduct?: boolean;

  // Jerarquía de productos derivados
  parentProductId?: string;
  rootProductId?: string;
  generationLevel?: number;

  // Indicadores funcionales
  requiresDesign?: boolean;
  requiresSample?: boolean;
  requiresNewStructure?: boolean;

  // Dimensiones propias del producto (pueden diferir del proyecto padre)
  format?: string;              // Formato del empaque
  structure?: string;           // Estructura del material
  width?: number;               // Ancho (mm)
  length?: number;              // Largo (mm)
  gusset?: number;              // Fuelle (mm)
  micron?: number;              // Espesor/micraje
  grammage?: number;            // Gramaje (g/m²)
  estimatedVolume?: number;     // Volumen estimado
  unitOfMeasure?: string;       // Unidad de medida

  // Validaciones a nivel de producto (independientes de validaciones del proyecto)
  agValidationStatus?: AreaValidationStatus;
  rdValidationStatus?: AreaValidationStatus;
  agObservation?: string;
  rdObservation?: string;

  // Cotización y finanzas
  targetPriceMin?: number;
  targetPriceMax?: number;
  commercialFinanceComment?: string;
  selectedForQuote?: boolean;       // "Seleccionado para cotizar"
  selectedForQuoteAt?: string;

  // Seguimiento Sistema Integral
  siRequestId?: string;
  siPreliminarySheetCode?: string;
  siProductCode?: string;
  siSku?: string;

  siStatus?: string;
  siLastSyncAt?: string;
  siObservation?: string;

  createdAt: string;
  updatedAt: string;
  createdBy?: string;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStorage(): ProjectProductRecord[] {
  if (!isBrowser()) return [];
  return safeParseArray<ProjectProductRecord>(localStorage.getItem(STORAGE_KEY));
}

function writeStorage(records: ProjectProductRecord[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getProjectProducts(projectCode: string): ProjectProductRecord[] {
  return readStorage().filter((p) => p.projectCode === projectCode);
}

export function getProjectProductById(id: string): ProjectProductRecord | null {
  const products = readStorage();
  return products.find((p) => p.id === id) || null;
}

export function getProjectProductByRequestCode(
  projectCode: string,
  requestCode: string
): ProjectProductRecord | null {
  return (
    readStorage().find(
      (p) => p.projectCode === projectCode && p.productRequestCode === requestCode
    ) || null
  );
}

export function saveProjectProduct(product: ProjectProductRecord): ProjectProductRecord {
  const products = readStorage();
  const existing = products.findIndex((p) => p.id === product.id);

  const normalized: ProjectProductRecord = {
    ...product,
    updatedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    products[existing] = normalized;
  } else {
    products.push(normalized);
  }

  writeStorage(products);
  return normalized;
}

export function createProjectProductFromProject(
  projectCode: string,
  data: Partial<ProjectProductRecord>
): ProjectProductRecord {
  const product: ProjectProductRecord = {
    id: `PP-${projectCode}-${Date.now()}`,
    projectCode,
    productRequestCode: generateProductRequestCode(projectCode),
    productName: data.productName || "",
    productDescription: data.productDescription,
    productType: data.productType || "Nuevo",
    status: "Solicitado",
    requiresDesign: data.requiresDesign,
    requiresSample: data.requiresSample,
    requiresNewStructure: data.requiresNewStructure,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
  };

  return saveProjectProduct(product);
}

export function createProjectProductFromApprovedProduct(
  projectCode: string,
  baseProductId: string,
  data: Partial<ProjectProductRecord>
): ProjectProductRecord {
  const baseProduct = getProjectProductById(baseProductId);
  if (!baseProduct) throw new Error(`Base product ${baseProductId} not found`);

  // Calcular jerarquía: si el producto base tiene parentProductId, usar ese como root
  const rootProductId = baseProduct.rootProductId || baseProductId;
  const generationLevel = (baseProduct.generationLevel || 1) + 1;

  const product: ProjectProductRecord = {
    id: `PP-${projectCode}-${Date.now()}`,
    projectCode,
    productRequestCode: generateProductRequestCode(projectCode),
    productName: data.productName || baseProduct.productName,
    productDescription: data.productDescription || baseProduct.productDescription,
    productType: data.productType || "Variante",
    status: data.status || "Solicitado",

    // Relación con producto base
    baseProductId: baseProductId,
    baseProductSku: baseProduct.siSku || baseProduct.baseProductSku,
    baseProductName: baseProduct.productName,
    createdFromApprovedProduct: true,

    // Jerarquía de productos derivados
    parentProductId: baseProductId,
    rootProductId: rootProductId,
    generationLevel: generationLevel,

    // Indicadores funcionales
    requiresDesign: data.requiresDesign !== undefined ? data.requiresDesign : baseProduct.requiresDesign,
    requiresSample: data.requiresSample !== undefined ? data.requiresSample : baseProduct.requiresSample,
    requiresNewStructure: data.requiresNewStructure !== undefined ? data.requiresNewStructure : baseProduct.requiresNewStructure,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
  };

  return saveProjectProduct(product);
}

export function updateProjectProductStatus(
  id: string,
  status: ProjectProductStatus
): ProjectProductRecord {
  const product = getProjectProductById(id);
  if (!product) throw new Error(`Product ${id} not found`);

  return saveProjectProduct({
    ...product,
    status,
    updatedAt: new Date().toISOString(),
  });
}

export function destimarProjectProduct(
  id: string,
  reason?: string
): ProjectProductRecord {
  const product = getProjectProductById(id);
  if (!product) throw new Error(`Product ${id} not found`);

  return saveProjectProduct({
    ...product,
    status: "Desestimado",
    updatedAt: new Date().toISOString(),
  });
}

export function deleteProjectProduct(id: string): void {
  const products = readStorage();
  const filtered = products.filter((p) => p.id !== id);
  writeStorage(filtered);
}

export function getNextProjectNumber(): number {
  const products = readStorage();
  const numbers = products
    .map((p) => {
      const match = p.productRequestCode.match(/PP-PR-(\w+)-(\d+)/);
      return match ? Number(match[2]) : 0;
    })
    .filter((n) => !Number.isNaN(n));

  return Math.max(0, ...numbers) + 1;
}

export function generateProductRequestCode(projectCode: string): string {
  const products = getProjectProducts(projectCode);
  const count = products.length + 1;
  return `PP-PR-${projectCode}-${String(count).padStart(3, "0")}`;
}

export function getProjectProductsSummary(projectCode: string) {
  const products = getProjectProducts(projectCode);
  const byStatus = products.reduce<Record<string, number>>((acc, p) => {
    const status = p.status || "Sin estado";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const inSi = products.filter(
    (p) =>
      p.status === "Enviado a SI" ||
      p.status === "Recibido por SI" ||
      p.status === "Ficha Preliminar Creada en SI" ||
      p.status === "En Proceso SI" ||
      p.status === "Dado de Alta"
  ).length;

  const approved = products.filter((p) => p.status === "Dado de Alta").length;

  return {
    total: products.length,
    byStatus,
    inSi,
    approved,
  };
}

export function getProductDerivatives(productId: string): ProjectProductRecord[] {
  return readStorage().filter((p) => p.parentProductId === productId);
}

export function getProductHierarchy(
  productId: string
): { root: ProjectProductRecord | null; ancestors: ProjectProductRecord[]; descendants: ProjectProductRecord[] } {
  const product = getProjectProductById(productId);
  if (!product) return { root: null, ancestors: [], descendants: [] };

  const products = readStorage();
  const ancestors: ProjectProductRecord[] = [];
  let current = product;

  // Rastrear hacia arriba hasta el producto raíz
  while (current.parentProductId) {
    const parent = products.find((p) => p.id === current.parentProductId);
    if (!parent) break;
    ancestors.unshift(parent);
    current = parent;
  }

  // Obtener todos los descendientes
  const descendants: ProjectProductRecord[] = [];
  const queue: ProjectProductRecord[] = [product];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    const children = products.filter((p) => p.parentProductId === current.id);
    descendants.push(...children);
    queue.push(...children);
  }

  return {
    root: current,
    ancestors,
    descendants,
  };
}

// Funciones de acceso a semántica de estados (para UI)
export function getProductStatusMeaning(status: ProjectProductStatus): string {
  return getProductStateMeaning(status);
}

export function getProductStatusDefinition(status: ProjectProductStatus) {
  return getProductStateDefinition(status);
}

export function toggleProductSelectedForQuote(id: string): ProjectProductRecord {
  const product = getProjectProductById(id);
  if (!product) throw new Error(`Product ${id} not found`);

  return saveProjectProduct({
    ...product,
    selectedForQuote: !product.selectedForQuote,
    selectedForQuoteAt: !product.selectedForQuote ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  });
}

export function clearProjectProductStorage(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
