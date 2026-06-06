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

export function getPackingMachines(): CatalogItem[] {
  const values = getCatalogValues("packaging_machine", { activeOnly: true });
  return values.map((v, idx) => ({
    id: idx + 1,
    code: v.item,
    name: v.name,
    wrappingId: 1, // Default - deberá ajustarse
    status: v.status,
  }));
}

export function getPackingMachineById(id: number): CatalogItem | undefined {
  const machines = getPackingMachines();
  return machines.find((m) => m.id === id);
}

export function getPackingMachinesByWrappingId(wrappingId: number): CatalogItem[] {
  // Esta es una simplificación - en producción necesitaría mapeo real
  const allMachines = getPackingMachines();
  return allMachines.slice(0, 3); // Retornar algunas máquinas por defecto
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
