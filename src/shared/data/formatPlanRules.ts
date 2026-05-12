// src/shared/data/formatPlanRules.ts

export interface BolsaParams {
  tipoPresentacionBolsa?: string;
  tipoSelloBolsa?: string;
  acabadoBolsa?: string;
  tieneFuelleBolsa?: string;
}

export function isGuidedFormatEnabled(envoltura?: string): boolean {
  if (!envoltura) return false;
  return envoltura.trim().toUpperCase() === "BOLSA";
}

export function calculateFormatPlanByWrapping(
  envoltura: string | undefined,
  currentFormatPlan: string,
  bolsaParams: BolsaParams
): string {
  if (isGuidedFormatEnabled(envoltura)) {
    return calculateBolsaFormatPlan(bolsaParams);
  }

  // Si no es bolsa, mantenemos el valor actual
  return currentFormatPlan || "";
}

export function calculateBolsaFormatPlan(params: BolsaParams): string {
  const {
    tipoPresentacionBolsa,
    tipoSelloBolsa,
    acabadoBolsa,
    tieneFuelleBolsa,
  } = params;

  if (!tipoPresentacionBolsa) return "";

  if (tipoPresentacionBolsa === "Wicket") return "WICKET";
  if (tipoPresentacionBolsa === "Hojas") return "HOJAS";

  if (tipoPresentacionBolsa === "Bolsa sellada") {
    if (tipoSelloBolsa === "Sello lateral") {
      if (acabadoBolsa === "Corte") {
        if (tieneFuelleBolsa === "Sí") return "SELLO LATERAL\\CORTE\\CON FUELLE FONDO";
        if (tieneFuelleBolsa === "No") return "SELLO LATERAL\\CORTE\\SIN FUELLE FONDO";
      } else if (acabadoBolsa === "Pestaña") {
        if (tieneFuelleBolsa === "Sí") return "SELLO LATERAL\\PESTAÑA\\CON FUELLE FONDO";
        if (tieneFuelleBolsa === "No") return "SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO";
      }
    } else if (tipoSelloBolsa === "Sello de fondo") {
      if (tieneFuelleBolsa === "Sí") return "SELLO DE FONDO\\CON FUELLE LATERAL";
      if (tieneFuelleBolsa === "No") return "SELLO DE FONDO\\SIN FUELLE LATERAL";
    }
  }

  return "";
}
