/**
 * ADAPTADORES PARA PORTFOLIO
 *
 * Proporciona funciones que reemplazan las de mockDatabase.ts
 * pero utilizan catalog.service como fuente única de verdad
 */

import { getCatalogValues } from "./catalog.service";

// ═════════════════════════════════════════════════════════════════════
// TIPOS
// ═════════════════════════════════════════════════════════════════════

export interface CatalogItem {
  id: string | number;
  code?: string;
  name: string;
  [key: string]: any;
}

// ═════════════════════════════════════════════════════════════════════
// ESTADO (portfolio_status)
// ═════════════════════════════════════════════════════════════════════

export function getPortfolioStatuses(): CatalogItem[] {
  const values = getCatalogValues("portfolio_status", { activeOnly: true });
  return values.map((v, idx) => ({
    id: idx + 1,
    code: v.item,
    name: v.name,
    status: v.status,
  }));
}

export function getStatusById(id: number): CatalogItem | undefined {
  const statuses = getPortfolioStatuses();
  return statuses.find((s) => s.id === id);
}

// ═════════════════════════════════════════════════════════════════════
// PLANTAS (plant)
// ═════════════════════════════════════════════════════════════════════

export function getPlants(): CatalogItem[] {
  const values = getCatalogValues("plant", { activeOnly: true });
  return values.map((v, idx) => ({
    id: idx + 1,
    code: v.item,
    name: v.name,
    status: v.status,
  }));
}

export function getPlantById(id: number): CatalogItem | undefined {
  const plants = getPlants();
  return plants.find((p) => p.id === id);
}

export function getPlantByCode(code: string): CatalogItem | undefined {
  const plants = getPlants();
  return plants.find((p) => p.code === code);
}

// ═════════════════════════════════════════════════════════════════════
// ENVOLTURAS (wrapping_type)
// ═════════════════════════════════════════════════════════════════════

export function getWrappings(): CatalogItem[] {
  const values = getCatalogValues("wrapping_type", { activeOnly: true });
  return values.map((v, idx) => ({
    id: idx + 1,
    code: v.item,
    name: v.name,
    status: v.status,
  }));
}

export function getWrappingById(id: number): CatalogItem | undefined {
  const wrappings = getWrappings();
  return wrappings.find((w) => w.id === id);
}

export function getWrappingByCode(code: string): CatalogItem | undefined {
  const wrappings = getWrappings();
  return wrappings.find((w) => w.code === code);
}

// ═════════════════════════════════════════════════════════════════════
// USO FINAL (final_use)
// ═════════════════════════════════════════════════════════════════════

// Para Uso Final, usamos productCatalogs porque es más completo
import { PRODUCT_CATALOGS } from "../data/productCatalogs";

export function getFinalUses(): any[] {
  return PRODUCT_CATALOGS.usoFinal.values.map((name: string, idx: number) => ({
    id: idx + 1,
    name,
    useFinal: name,
    sector: "General",
    segment: "General",
    subSegment: "General",
    afMarketId: "",
  }));
}

export function getFinalUseById(id: number): any | undefined {
  const uses = getFinalUses();
  return uses.find((u) => u.id === id);
}

// ═════════════════════════════════════════════════════════════════════
// MÁQUINAS DE EMPAQUE (packaging_machine)
// ═════════════════════════════════════════════════════════════════════

// Mapeo de envoltura a máquinas basado en nombres
const WRAPPING_TO_MACHINES_MAP: Record<string, string[]> = {
  "lamina": ["film", "lámina", "laminar", "lam"],
  "bolsa": ["bolsa", "bag", "bolsas"],
  "pouch": ["pouch", "doy", "standup"],
};

function getWrappingType(wrappingName: string): string | null {
  const normalized = wrappingName.toLowerCase();
  for (const [type, keywords] of Object.entries(WRAPPING_TO_MACHINES_MAP)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return type;
    }
  }
  return null;
}

function getMachineWrappingType(machineName: string): string | null {
  const normalized = machineName.toLowerCase();
  for (const [type, keywords] of Object.entries(WRAPPING_TO_MACHINES_MAP)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return type;
    }
  }
  return null;
}

export function getPackingMachines(): CatalogItem[] {
  const values = getCatalogValues("packaging_machine", { activeOnly: true });
  return values.map((v, idx) => ({
    id: idx + 1,
    code: v.item,
    name: v.name,
    wrappingType: getMachineWrappingType(v.name),
    status: v.status,
  }));
}

export function getPackingMachineById(id: number): CatalogItem | undefined {
  const machines = getPackingMachines();
  return machines.find((m) => m.id === id);
}

export function getPackingMachinesByWrappingId(wrappingId: number): CatalogItem[] {
  const wrapping = getWrappingById(wrappingId);
  if (!wrapping) return [];

  const wrappingType = getWrappingType(wrapping.name);
  if (!wrappingType) {
    // Si no se puede determinar el tipo, retornar todas las máquinas
    return getPackingMachines();
  }

  const allMachines = getPackingMachines();
  return allMachines.filter((m) =>
    m.wrappingType === wrappingType || !m.wrappingType
  );
}

// ═════════════════════════════════════════════════════════════════════
// CATÁLOGOS COMPLETOS (para compatibilidad)
// ═════════════════════════════════════════════════════════════════════

export function getStatusCatalog(): CatalogItem[] {
  return getPortfolioStatuses();
}

export function getPlantsCatalog(): CatalogItem[] {
  return getPlants();
}

export function getWrappingsCatalog(): CatalogItem[] {
  return getWrappings();
}

export function getPackingMachinesCatalog(): CatalogItem[] {
  return getPackingMachines();
}
