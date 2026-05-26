// Catálogo de unidades de medida
export type UnitOfMeasure = "g" | "kg" | "ml" | "l" | "m" | "cm" | "mm";

export const UNITS_OF_MEASURE: UnitOfMeasure[] = ["g", "kg", "ml", "l", "m", "cm", "mm"];

export const UNIT_LABELS: Record<UnitOfMeasure, string> = {
  g: "Gramos (g)",
  kg: "Kilogramos (kg)",
  ml: "Mililitros (ml)",
  l: "Litros (l)",
  m: "Metros (m)",
  cm: "Centímetros (cm)",
  mm: "Milímetros (mm)",
};

// Mapa de normalización para variantes de unidades
export const UNIT_NORMALIZATION_MAP: Record<string, string> = {
  "gramos": "g",
  "gramo": "g",
  "g": "g",
  "kilogramos": "kg",
  "kilogramo": "kg",
  "kg": "kg",
  "mililitros": "ml",
  "mililitro": "ml",
  "ml": "ml",
  "litros": "l",
  "litro": "l",
  "l": "l",
  "L": "l",
};

export function isValidUnit(unit: string): unit is UnitOfMeasure {
  return UNITS_OF_MEASURE.includes(unit as UnitOfMeasure);
}

export function getUnitLabel(unit: UnitOfMeasure): string {
  return UNIT_LABELS[unit];
}

export function normalizeUnit(value: string): string {
  const normalized = String(value ?? "")
    .toLowerCase()
    .trim();
  return UNIT_NORMALIZATION_MAP[normalized] || normalized;
}
