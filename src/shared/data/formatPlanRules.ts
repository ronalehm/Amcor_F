/**
 * formatPlanRules.ts
 *
 * Lógica de cálculo de "Formato de Plano" por tipo de envoltura.
 * Implementa BOLSA y LÁMINA.
 * POUCH mantiene select tradicional.
 */

export function normalizeWrapping(value?: string): string {
  return String(value || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function normalize(value?: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// ==============================
// Detección de envoltura guiada
// ==============================

export function isGuidedFormatEnabled(envoltura?: string): boolean {
  return isBolsaWrapping(envoltura) || isLaminaWrapping(envoltura) || isPouchWrapping(envoltura);
}

export function isBolsaWrapping(envoltura?: string): boolean {
  return normalize(envoltura).includes("bolsa");
}

export function isLaminaWrapping(envoltura?: string): boolean {
  return normalize(envoltura).includes("lamina");
}

export function isPouchWrapping(envoltura?: string): boolean {
  return normalize(envoltura).includes("pouch");
}

// ==============================
// Parámetros de entrada BOLSA
// ==============================

export interface BolsaFormatParams {
  tipoPresentacionBolsa: string;
  tipoSelloBolsa: string;
  acabadoBolsa: string;
  tieneFuelleBolsa: string;
}

// ==============================
// Parámetros de entrada LÁMINA
// ==============================

export type LaminaFormatType = "GENERICA" | "TISSUE" | "FOOD" | "";

export interface LaminaFormatParams {
  tipoFormatoLamina?: LaminaFormatType | string;
}

// ==============================
// Cálculo para BOLSA
// ==============================

export function calculateBolsaFormatPlan(params: BolsaFormatParams): string {
  const { tipoPresentacionBolsa, tipoSelloBolsa, acabadoBolsa, tieneFuelleBolsa } = params;

  if (!tipoPresentacionBolsa) return "";

  // Caso directo: Wicket
  if (tipoPresentacionBolsa === "Wicket") return "WICKET";

  // Caso directo: Hojas
  if (tipoPresentacionBolsa === "Hojas") return "HOJAS";

  // Caso: Bolsa sellada
  if (tipoPresentacionBolsa === "Bolsa sellada") {
    if (!tipoSelloBolsa) return "";

    if (tipoSelloBolsa === "Sello lateral") {
      if (!acabadoBolsa || !tieneFuelleBolsa) return "";

      const acabadoPart = acabadoBolsa === "Corte" ? "CORTE" : "PESTAÑA";
      const fuellePart = tieneFuelleBolsa === "Sí" ? "CON FUELLE FONDO" : "SIN FUELLE FONDO";

      return `SELLO LATERAL\\${acabadoPart}\\${fuellePart}`;
    }

    if (tipoSelloBolsa === "Sello de fondo") {
      if (!tieneFuelleBolsa) return "";

      const fuellePart = tieneFuelleBolsa === "Sí" ? "CON FUELLE LATERAL" : "SIN FUELLE LATERAL";

      return `SELLO DE FONDO\\${fuellePart}`;
    }
  }

  return "";
}

// ==============================
// Cálculo para LÁMINA
// ==============================

export function calculateLaminaFormatPlan(params: LaminaFormatParams): string {
  const tipo = String(params.tipoFormatoLamina || "").trim().toUpperCase();

  if (tipo === "GENERICA") return "GENERICA";
  if (tipo === "TISSUE") return "TISSUE";
  if (tipo === "FOOD") return "FOOD";

  return "";
}

// ==============================
// Validación para LÁMINA
// ==============================

export function validateLaminaFormatPlan(params: {
  envoltura?: string;
  tipoFormatoLamina?: string;
  blueprintFormat?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!isLaminaWrapping(params.envoltura)) return errors;

  if (!params.tipoFormatoLamina) {
    errors.tipoFormatoLamina = "Selecciona el tipo de lámina.";
    return errors;
  }

  const calculated = calculateLaminaFormatPlan({
    tipoFormatoLamina: params.tipoFormatoLamina,
  });

  if (!calculated) {
    errors.blueprintFormat = "No se pudo calcular el formato de plano de la lámina.";
  }

  return errors;
}

// ==============================
// Parámetros de entrada POUCH
// ==============================

export interface PouchFormatParams {
  tipoFamiliaPouch?: string;
  tipoStandUpPouch?: string;
  formaDoyPackPouch?: string;
  tipoFuelleStandUpPouch?: string;
  cantidadSellosPouchPlano?: string;
  tieneFuelleSelloCentralPouch?: string;
  materialSelloCentralPouch?: string;
  tipoSelloEnFuellePouch?: string;
}

// ==============================
// Cálculo para POUCH
// ==============================

export function calculatePouchFormatPlan(params: PouchFormatParams): string {
  const familia = String(params.tipoFamiliaPouch || "").trim();
  const standUp = String(params.tipoStandUpPouch || "").trim();
  const formaDoyPack = String(params.formaDoyPackPouch || "").trim();
  const fuelleStandUp = String(params.tipoFuelleStandUpPouch || "").trim();
  const sellosPlano = String(params.cantidadSellosPouchPlano || "").trim();
  const tieneFuelleCentral = String(params.tieneFuelleSelloCentralPouch || "").trim();
  const materialCentral = String(params.materialSelloCentralPouch || "").trim();
  const tipoSelloEnFuelle = String(params.tipoSelloEnFuellePouch || "").trim();

  if (familia === "Pouch Stand Up") {
    if (standUp === "Tipo K") {
      return "POUCH STAND UP\\TIPO K\\FUELLE PROPIO";
    }

    if (standUp === "Normal") {
      return "POUCH STAND UP\\NORMAL\\FUELLE PROPIO";
    }

    if (standUp === "Doy Pack") {
      if (formaDoyPack === "Redondo" && fuelleStandUp === "Fuelle Propio") {
        return "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO";
      }

      if (formaDoyPack === "Cuadrado" && fuelleStandUp === "Fuelle Propio") {
        return "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE PROPIO";
      }

      if (formaDoyPack === "Redondo" && fuelleStandUp === "Fuelle Insertado") {
        return "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE INSERTADO";
      }

      if (formaDoyPack === "Cuadrado" && fuelleStandUp === "Fuelle Insertado") {
        return "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE INSERTADO";
      }
    }
  }

  if (familia === "Pouch Plano") {
    if (sellosPlano === "Dos sellos") {
      return "POUCH PLANO\\DOS SELLOS";
    }

    if (sellosPlano === "Tres sellos") {
      return "POUCH PLANO\\TRES SELLOS";
    }
  }

  if (familia === "Pouch con Sello Central") {
    const isPePe = materialCentral === "PE-PE/PE";

    if (tieneFuelleCentral === "Sí" && isPePe) {
      return "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE (PE-PE/PE)";
    }

    if (tieneFuelleCentral === "No" && isPePe) {
      return "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE (PE-PE/PE)";
    }

    if (tieneFuelleCentral === "Sí") {
      return "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE";
    }

    if (tieneFuelleCentral === "No") {
      return "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE";
    }
  }

  if (familia === "Pouch con Sello en Fuelle") {
    if (tipoSelloEnFuelle === "Tipo 4-1") {
      return "POUCH C/SELLO EN FUELLE\\TIPO 4-1\\FUELLE PROPIO";
    }

    if (tipoSelloEnFuelle === "Tipo 1-1") {
      return "POUCH C/SELLO EN FUELLE\\TIPO 1-1";
    }
  }

  return "";
}

// ==============================
// Validación para POUCH
// ==============================

export function validatePouchFormatPlan(params: {
  envoltura?: string;
  tipoFamiliaPouch?: string;
  tipoStandUpPouch?: string;
  formaDoyPackPouch?: string;
  tipoFuelleStandUpPouch?: string;
  cantidadSellosPouchPlano?: string;
  tieneFuelleSelloCentralPouch?: string;
  materialSelloCentralPouch?: string;
  tipoSelloEnFuellePouch?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!isPouchWrapping(params.envoltura)) return errors;

  if (!params.tipoFamiliaPouch) {
    errors.tipoFamiliaPouch = "Selecciona la familia de pouch.";
    return errors;
  }

  if (params.tipoFamiliaPouch === "Pouch Stand Up") {
    if (!params.tipoStandUpPouch) {
      errors.tipoStandUpPouch = "Selecciona el tipo de Stand Up.";
    }

    if (params.tipoStandUpPouch === "Doy Pack") {
      if (!params.formaDoyPackPouch) {
        errors.formaDoyPackPouch = "Selecciona la forma del Doy Pack.";
      }

      if (!params.tipoFuelleStandUpPouch) {
        errors.tipoFuelleStandUpPouch = "Selecciona el tipo de fuelle.";
      }
    }
  }

  if (params.tipoFamiliaPouch === "Pouch Plano") {
    if (!params.cantidadSellosPouchPlano) {
      errors.cantidadSellosPouchPlano = "Selecciona la cantidad de sellos.";
    }
  }

  if (params.tipoFamiliaPouch === "Pouch con Sello Central") {
    if (!params.tieneFuelleSelloCentralPouch) {
      errors.tieneFuelleSelloCentralPouch = "Indica si tendrá fuelle.";
    }

    if (!params.materialSelloCentralPouch) {
      errors.materialSelloCentralPouch = "Selecciona la especificación de material.";
    }
  }

  if (params.tipoFamiliaPouch === "Pouch con Sello en Fuelle") {
    if (!params.tipoSelloEnFuellePouch) {
      errors.tipoSelloEnFuellePouch = "Selecciona el tipo de sello en fuelle.";
    }
  }

  const calculated = calculatePouchFormatPlan(params);

  if (Object.keys(errors).length === 0 && !calculated) {
    errors.blueprintFormat = "No se pudo calcular el formato de plano del pouch.";
  }

  return errors;
}

// ==============================
// Tipo de fuelle inferido (BOLSA)
// ==============================

export function inferBolsaGussetType(params: BolsaFormatParams): string {
  const { tipoPresentacionBolsa, tipoSelloBolsa, tieneFuelleBolsa } = params;

  if (tieneFuelleBolsa !== "Sí") return "";

  if (tipoPresentacionBolsa === "Bolsa sellada") {
    if (tipoSelloBolsa === "Sello lateral") return "Fondo";
    if (tipoSelloBolsa === "Sello de fondo") return "Lateral";
  }

  return "";
}

// ==============================
// Dispatcher principal
// ==============================

export function calculateFormatPlanByWrapping(
  envoltura: string | undefined,
  bolsaParams: BolsaFormatParams,
  laminaParams: LaminaFormatParams,
  currentFormatPlan: string
): string {
  if (isBolsaWrapping(envoltura)) {
    return calculateBolsaFormatPlan(bolsaParams);
  }

  if (isLaminaWrapping(envoltura)) {
    return calculateLaminaFormatPlan(laminaParams);
  }

  return currentFormatPlan;
}
