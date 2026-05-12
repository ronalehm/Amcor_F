/**
 * formatPlanRules.ts
 *
 * Lógica de cálculo de "Formato de Plano" por tipo de envoltura.
 * Actualmente implementa solo BOLSA.
 * Preparado para agregar POUCH y LÁMINA en futuras iteraciones.
 */

function normalize(value?: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// ==============================
// Detección de envoltura guiada
// ==============================

export function isGuidedFormatEnabled(envoltura?: string): boolean {
  const n = normalize(envoltura);
  return n.includes("bolsa");
  // Futuro: || n.includes("pouch")
  // Futuro: || n.includes("lamina")
}

export function isBolsaWrapping(envoltura?: string): boolean {
  return normalize(envoltura).includes("bolsa");
}

// Futuro:
// export function isPouchWrapping(envoltura?: string): boolean { ... }
// export function isLaminaWrapping(envoltura?: string): boolean { ... }

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
  currentFormatPlan: string
): string {
  if (isBolsaWrapping(envoltura)) {
    return calculateBolsaFormatPlan(bolsaParams);
  }

  // Futuro: if (isPouchWrapping(envoltura)) { return calculatePouchFormatPlan(...) }
  // Futuro: if (isLaminaWrapping(envoltura)) { return calculateLaminaFormatPlan(...) }

  // Para envolturas sin lógica guiada, mantener el valor actual
  return currentFormatPlan;
}
