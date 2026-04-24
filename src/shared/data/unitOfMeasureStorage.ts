// Catálogo de unidades de medida
export type UnitOfMeasure = "g" | "kg" | "ml" | "L" | "un" | "m" | "cm" | "mm";

export const UNITS_OF_MEASURE: UnitOfMeasure[] = ["g", "kg", "ml", "L", "un", "m", "cm", "mm"];

export const UNIT_LABELS: Record<UnitOfMeasure, string> = {
  g: "Gramos (g)",
  kg: "Kilogramos (kg)",
  ml: "Mililitros (ml)",
  L: "Litros (L)",
  un: "Unidades (un)",
  m: "Metros (m)",
  cm: "Centímetros (cm)",
  mm: "Milímetros (mm)",
};

export function isValidUnit(unit: string): unit is UnitOfMeasure {
  return UNITS_OF_MEASURE.includes(unit as UnitOfMeasure);
}

export function getUnitLabel(unit: UnitOfMeasure): string {
  return UNIT_LABELS[unit];
}
