/**
 * Cálculos y validaciones para Fotoregistro en láminas
 */

export type HorizontalReference = "left" | "right";
export type VerticalReference = "top" | "bottom";

export interface PhotoregisterDistance {
  horizontal: number;
  vertical: number;
}

export interface PhotoregisterReference {
  horizontal: HorizontalReference;
  vertical: VerticalReference;
}

export interface PhotoregisterMargins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface PhotoregisterDimensions {
  width: number;
  height: number;
}

/**
 * Calcula márgenes a partir de dimensiones, distancias y referencias
 */
export function calculateMargins(
  laminaWidth: number,
  repetition: number,
  dimensions: PhotoregisterDimensions,
  reference: PhotoregisterReference,
  distance: PhotoregisterDistance
): PhotoregisterMargins {
  // Horizontal
  const marginLeft =
    reference.horizontal === "left"
      ? distance.horizontal
      : laminaWidth - dimensions.width - distance.horizontal;

  const marginRight =
    reference.horizontal === "right"
      ? distance.horizontal
      : laminaWidth - dimensions.width - distance.horizontal;

  // Vertical
  const marginTop =
    reference.vertical === "top"
      ? distance.vertical
      : repetition - dimensions.height - distance.vertical;

  const marginBottom =
    reference.vertical === "bottom"
      ? distance.vertical
      : repetition - dimensions.height - distance.vertical;

  return {
    left: Math.max(0, marginLeft),
    right: Math.max(0, marginRight),
    top: Math.max(0, marginTop),
    bottom: Math.max(0, marginBottom),
  };
}

/**
 * Reconstruye referencia y distancia desde márgenes
 * Usado al cargar registros existentes
 */
export function reconstructReferenceAndDistance(
  laminaWidth: number,
  repetition: number,
  dimensions: PhotoregisterDimensions,
  margins: PhotoregisterMargins
): {
  reference: PhotoregisterReference;
  distance: PhotoregisterDistance;
} {
  // Horizontal: comparar qué margen es menor
  const horizontalReference: HorizontalReference =
    margins.left < margins.right ? "left" : "right";
  const horizontalDistance =
    horizontalReference === "left" ? margins.left : margins.right;

  // Vertical: comparar qué margen es menor
  const verticalReference: VerticalReference =
    margins.top < margins.bottom ? "top" : "bottom";
  const verticalDistance =
    verticalReference === "top" ? margins.top : margins.bottom;

  return {
    reference: { horizontal: horizontalReference, vertical: verticalReference },
    distance: { horizontal: horizontalDistance, vertical: verticalDistance },
  };
}

/**
 * Calcula el segundo fotoregistro de forma simétrica
 */
export function calculateSymmetricSecond(
  laminaWidth: number,
  repetition: number,
  fr1Dimensions: PhotoregisterDimensions,
  fr1Reference: PhotoregisterReference,
  fr1Distance: PhotoregisterDistance
): {
  dimensions: PhotoregisterDimensions;
  reference: PhotoregisterReference;
  distance: PhotoregisterDistance;
  margins: PhotoregisterMargins;
} {
  // El segundo tiene el mismo tamaño
  const dimensions = { ...fr1Dimensions };

  // Referencia horizontal invertida
  const horizontalReference: HorizontalReference =
    fr1Reference.horizontal === "left" ? "right" : "left";

  // Misma referencia vertical
  const verticalReference = fr1Reference.vertical;

  // La distancia horizontal es la misma, pero invertida
  const horizontalDistance = fr1Distance.horizontal;

  // La distancia vertical es la misma
  const verticalDistance = fr1Distance.vertical;

  const reference = {
    horizontal: horizontalReference,
    vertical: verticalReference,
  };

  const distance = { horizontal: horizontalDistance, vertical: verticalDistance };

  const margins = calculateMargins(
    laminaWidth,
    repetition,
    dimensions,
    reference,
    distance
  );

  return { dimensions, reference, distance, margins };
}

/**
 * Detecta si un segundo fotoregistro es automático (simétrico)
 * Usado al cargar registros existentes
 */
export function isSecondPhotoregisterAutomatic(
  laminaWidth: number,
  repetition: number,
  fr1Dimensions: PhotoregisterDimensions,
  fr1Margins: PhotoregisterMargins,
  fr2Dimensions: PhotoregisterDimensions,
  fr2Margins: PhotoregisterMargins,
  tolerance: number = 0.1
): boolean {
  // FR2 debe tener mismo tamaño que FR1
  if (
    Math.abs(fr2Dimensions.width - fr1Dimensions.width) > tolerance ||
    Math.abs(fr2Dimensions.height - fr1Dimensions.height) > tolerance
  ) {
    return false;
  }

  // FR2 debe ser simétrico horizontalmente
  if (
    Math.abs(fr2Margins.left - fr1Margins.right) > tolerance ||
    Math.abs(fr2Margins.right - fr1Margins.left) > tolerance
  ) {
    return false;
  }

  // FR2 debe tener misma posición vertical que FR1
  if (
    Math.abs(fr2Margins.top - fr1Margins.top) > tolerance ||
    Math.abs(fr2Margins.bottom - fr1Margins.bottom) > tolerance
  ) {
    return false;
  }

  return true;
}

/**
 * Convierte un número que puede tener coma decimal a número válido
 */
export function parseDecimalInput(value: string): number | null {
  if (!value || typeof value !== "string") return null;

  const normalized = value.trim().replace(",", ".");
  const parsed = parseFloat(normalized);

  return isFinite(parsed) ? parsed : null;
}

/**
 * Valida si un fotoregistro cabe dentro de la lámina
 */
export function validatePhotoregisterFitsInLamina(
  dimensions: PhotoregisterDimensions,
  distance: PhotoregisterDistance,
  laminaWidth: number,
  repetition: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (dimensions.width <= 0) {
    errors.push("El ancho del fotoregistro debe ser mayor que cero.");
  }
  if (dimensions.height <= 0) {
    errors.push("El alto del fotoregistro debe ser mayor que cero.");
  }

  if (dimensions.width > laminaWidth) {
    errors.push(
      `El ancho del fotoregistro (${dimensions.width} mm) no puede superar el ancho de la lámina (${laminaWidth} mm).`
    );
  }

  if (dimensions.height > repetition) {
    errors.push(
      `El alto del fotoregistro (${dimensions.height} mm) no puede superar la repetición de la lámina (${repetition} mm).`
    );
  }

  if (distance.horizontal < 0) {
    errors.push("La distancia horizontal no puede ser negativa.");
  }

  if (distance.vertical < 0) {
    errors.push("La distancia vertical no puede ser negativa.");
  }

  const maxHorizontalDistance = laminaWidth - dimensions.width;
  if (distance.horizontal > maxHorizontalDistance) {
    errors.push(
      `La distancia horizontal máxima disponible es ${maxHorizontalDistance} mm.`
    );
  }

  const maxVerticalDistance = repetition - dimensions.height;
  if (distance.vertical > maxVerticalDistance) {
    errors.push(
      `La distancia vertical máxima disponible es ${maxVerticalDistance} mm.`
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Obtiene etiqueta legible de referencia
 */
export function getReferenceLabel(
  horizontal: HorizontalReference,
  vertical: VerticalReference
): string {
  const h =
    horizontal === "left" ? "Desde la izquierda" : "Desde la derecha";
  const v = vertical === "top" ? "Desde arriba" : "Desde abajo";
  return `${h}, ${v}`;
}
