/**
 * SEMÁNTICA DE ESTADOS DE PRODUCTO EN ODISEO
 *
 * Este archivo documenta el significado y contexto de cada estado
 * del producto asociado al proyecto.
 *
 * Los productos en ODISEO son fichas preliminares o solicitudes de producto,
 * NO SKUs técnicos. El SKU es responsabilidad del Sistema Integral (SI).
 *
 * TODO: Este archivo será eliminado en PASO 3 - contiene estados del Sistema Integral
 */

import type { PreliminaryProductStatus } from "./projectWorkflow";

export interface ProductStateDefinition {
  state: PreliminaryProductStatus;
  meaning: string;
  actions: string[];
  nextPossibleStates: PreliminaryProductStatus[];
  owner: "ODISEO" | "SI";
  isTerminal: boolean;
}

export const PROJECT_PRODUCT_STATE_DEFINITIONS: Record<PreliminaryProductStatus, ProductStateDefinition> = ({
  // Estados en ODISEO (antes de enviar a SI)
  "Solicitado": {
    state: "Solicitado",
    meaning:
      "Se registró una ficha/producto preliminar dentro del proyecto. " +
      "El usuario creó el producto pero aún no ha completado la información necesaria.",
    actions: ["Completar información", "Editar datos básicos", "Desestimar"],
    nextPossibleStates: ["En Preparación", "Desestimado"],
    owner: "ODISEO",
    isTerminal: false,
  },

  "En Preparación": {
    state: "En Preparación",
    meaning:
      "Se está completando la información necesaria antes de enviarlo al Sistema Integral. " +
      "El usuario está rellenando campos técnicos, especificaciones, diseño, etc.",
    actions: ["Actualizar información", "Marcar listo para SI", "Desestimar"],
    nextPossibleStates: ["Listo para SI", "Desestimado"],
    owner: "ODISEO",
    isTerminal: false,
  },

  "Listo para SI": {
    state: "Listo para SI",
    meaning:
      "La ficha preliminar tiene la información mínima requerida para enviarse al Sistema Integral. " +
      "El producto cumple con validaciones internas y puede ser enviado.",
    actions: ["Enviar a Sistema Integral", "Desestimar"],
    nextPossibleStates: ["Enviado a SI", "Desestimado"],
    owner: "ODISEO",
    isTerminal: false,
  },

  // Transición ODISEO → SI
  "Enviado a SI": {
    state: "Enviado a SI",
    meaning:
      "ODISEO envió la ficha preliminar al Sistema Integral. " +
      "El archivo ha salido de ODISEO y está en tránsito o en inbox de SI.",
    actions: ["Ver envío", "Rastrear envío"],
    nextPossibleStates: ["Recibido por SI", "Observado / Bloqueado en SI"],
    owner: "ODISEO",
    isTerminal: false,
  },

  // Estados en SI (después del envío)
  "Recibido por SI": {
    state: "Recibido por SI",
    meaning:
      "Sistema Integral confirmó recepción de la ficha preliminar. " +
      "SI inició el procesamiento interno.",
    actions: ["Ver seguimiento SI", "Rastrear en SI"],
    nextPossibleStates: ["Ficha Preliminar Creada en SI", "Observado / Bloqueado en SI"],
    owner: "SI",
    isTerminal: false,
  },

  "Ficha Preliminar Creada en SI": {
    state: "Ficha Preliminar Creada en SI",
    meaning:
      "Sistema Integral creó la ficha técnica preliminar. " +
      "SI ha sistematizado la información y creó un registro técnico interno.",
    actions: ["Ver ficha SI", "Rastrear en SI"],
    nextPossibleStates: ["En Proceso SI", "Observado / Bloqueado en SI"],
    owner: "SI",
    isTerminal: false,
  },

  "En Proceso SI": {
    state: "En Proceso SI",
    meaning:
      "Sistema Integral está realizando registro, validación técnica, estructura, " +
      "manufactura, costo o trámites de alta (EDAG, EVOL, BOM, PIYE, EM, HCT, ROT, CO). " +
      "El producto está en evaluación activa dentro de SI.",
    actions: ["Ver seguimiento SI", "Ver detalles del proceso"],
    nextPossibleStates: ["Aprobado", "Observado / Bloqueado en SI"],
    owner: "SI",
    isTerminal: false,
  },

  "Observado / Bloqueado en SI": {
    state: "Observado / Bloqueado en SI",
    meaning:
      "Sistema Integral devolvió observación, requiere ajustes o existe un bloqueo en el proceso. " +
      "SI pide cambios en especificaciones, dimensiones, materiales, costos u otro aspecto técnico. " +
      "ODISEO debe revisar la observación y reenviar información si aplica.",
    actions: ["Ver observación", "Descargar reporte de SI", "Reenviar información", "Corregir y reenviar"],
    nextPossibleStates: ["En Preparación", "En Proceso SI", "Desestimado"],
    owner: "SI",
    isTerminal: false,
  },

  "Aprobado": {
    state: "Aprobado",
    meaning:
      "Sistema Integral aprobó el producto y devolvió el resultado a ODISEO. " +
      "El producto ha pasado todas las validaciones técnicas y está listo para ser dado de alta. " +
      "Desde este estado se puede generar un nuevo producto derivado.",
    actions: [
      "Ver detalles aprobado",
      "Crear producto desde aprobado",
      "Solicitar alta a SI",
    ],
    nextPossibleStates: ["Dado de Alta", "Desestimado"],
    owner: "SI",
    isTerminal: false,
  },

  "Dado de Alta": {
    state: "Dado de Alta",
    meaning:
      "Sistema Integral confirmó SKU/producto dado de alta en el sistema. " +
      "El producto tiene asignado un código técnico (SKU) y está registrado en el catálogo de SI. " +
      "Desde este estado se puede generar productos derivados (variantes, modificaciones).",
    actions: [
      "Ver SKU asignado",
      "Ver ficha técnica final",
      "Crear producto desde aprobado",
      "Consultar en SI",
    ],
    nextPossibleStates: [],
    owner: "SI",
    isTerminal: true,
  },

  // Estado de cierre
  "Desestimado": {
    state: "Desestimado",
    meaning:
      "La ficha/producto preliminar no continúa. " +
      "Puede ser desestimado por decisión de ODISEO (antes de enviar) " +
      "o por SI (después del envío si no cumple requisitos).",
    actions: ["Ver motivo", "Ver detalles históricos"],
    nextPossibleStates: [],
    owner: "ODISEO",
    isTerminal: true,
  },
} as any);

/**
 * Obtener la definición de un estado
 */
export function getProductStateDefinition(
  status: PreliminaryProductStatus
): ProductStateDefinition | undefined {
  return PROJECT_PRODUCT_STATE_DEFINITIONS[status];
}

/**
 * Obtener descripción breve de un estado
 */
export function getProductStateMeaning(status: PreliminaryProductStatus): string {
  const def = getProductStateDefinition(status);
  return def?.meaning || "Estado desconocido";
}

/**
 * Verificar si un estado es terminal (sin transiciones posibles)
 */
export function isProductStateTerminal(status: PreliminaryProductStatus): boolean {
  const def = getProductStateDefinition(status);
  return def?.isTerminal ?? false;
}

/**
 * Obtener quién es responsable del estado
 */
export function getProductStateOwner(status: PreliminaryProductStatus): "ODISEO" | "SI" | undefined {
  const def = getProductStateDefinition(status);
  return def?.owner;
}

/**
 * Estados donde ODISEO tiene control directo
 */
export const ODISEO_CONTROLLED_STATES: PreliminaryProductStatus[] = [
  "Solicitado",
  "En Preparación",
  "Listo para SI",
  "Enviado a SI",
] as any;

/**
 * Estados donde SI tiene control directo
 */
export const SI_CONTROLLED_STATES: PreliminaryProductStatus[] = [
  "Recibido por SI",
  "Ficha Preliminar Creada en SI",
  "En Proceso SI",
  "Observado / Bloqueado en SI",
  "Aprobado",
  "Dado de Alta",
] as any;

/**
 * Estados que permiten crear productos derivados
 */
export const DERIVABLE_STATES: PreliminaryProductStatus[] = [
  "Aprobado",
  "Dado de Alta",
] as any;

/**
 * Estados donde se puede reenviar información a SI
 */
export const RESUBMITTABLE_STATES: PreliminaryProductStatus[] = [
  "En Preparación",
  "Listo para SI",
  "Observado / Bloqueado en SI",
] as any;
