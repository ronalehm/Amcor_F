import React, { useMemo } from "react";
import type {
  PhotoregisterDimensions,
  PhotoregisterReference,
  PhotoregisterDistance,
} from "../../../shared/utils/photoregisterCalculations";
import { calculateMargins } from "../../../shared/utils/photoregisterCalculations";

interface PhotoregisterPreviewProps {
  laminaWidth: number;
  repetition: number;
  fr1Dimensions?: PhotoregisterDimensions;
  fr1Reference?: PhotoregisterReference;
  fr1Distance?: PhotoregisterDistance;
  fr2Dimensions?: PhotoregisterDimensions;
  fr2Reference?: PhotoregisterReference;
  fr2Distance?: PhotoregisterDistance;
  showFr2: boolean;
  incomplete?: boolean;
}

// ============ CONSTANTES DE MEDIDAS ESTANDARIZADAS ============
// Estas constantes garantizan consistencia visual entre FR1 y FR2
const COTA_OFFSET_MAIN = 38;        // Distancia de la main line desde borde (px)
const COTA_TEXT_DISTANCE = 22;      // Distancia del texto desde la main line (px)
const TICK_SIZE = 12;               // Tamaño total del tick (px)
const TICK_HALF = 6;                // Medio del tick desde main line (px)
const PADDING_SAFE = 80;            // Margen de seguridad alrededor (px) - Aumentado para "Ancho de la lámina" y línea gris

/**
 * Calcula el padding necesario para el SVG basado en offsets de cotas.
 * Garantiza que todas las cotas y texto sean visibles sin ser cortados.
 */
const calculateSVGPadding = () => {
  const cotaPadding = COTA_OFFSET_MAIN + COTA_TEXT_DISTANCE + PADDING_SAFE;
  return { horizontal: cotaPadding, vertical: cotaPadding };
};

/**
 * Formatea un valor numérico para presentación visual.
 * Muestra enteros sin decimal, decimales solo cuando es necesario.
 * Utiliza coma decimal y agrega "mm".
 *
 * @example formatMeasurement(217) → "217 mm"
 * @example formatMeasurement(217.5) → "217,5 mm"
 */
const formatMeasurement = (value: number): string => {
  if (Number.isInteger(value)) {
    return `${Math.round(value)} mm`;
  }
  // Mostrar un decimal si es necesario
  const rounded = parseFloat(value.toFixed(1));
  if (Number.isInteger(rounded)) {
    return `${Math.round(rounded)} mm`;
  }
  // Usar coma decimal para la interfaz
  return `${rounded.toString().replace(".", ",")} mm`;
};


export default function PhotoregisterPreview({
  laminaWidth,
  repetition,
  fr1Dimensions,
  fr1Reference,
  fr1Distance,
  fr2Dimensions,
  fr2Reference,
  fr2Distance,
  showFr2,
  incomplete = false,
}: PhotoregisterPreviewProps) {
  const svgDimensions = useMemo(() => {
    const maxWidth = 500;
    const maxHeight = 350;

    if (!laminaWidth || !repetition) return { scale: 1, width: maxWidth, height: maxHeight };

    const widthRatio = maxWidth / laminaWidth;
    const heightRatio = maxHeight / repetition;
    const scale = Math.min(widthRatio, heightRatio);

    return {
      scale,
      width: laminaWidth * scale,
      height: repetition * scale,
    };
  }, [laminaWidth, repetition]);

  const getCoordinates = (
    reference: PhotoregisterReference,
    distance: PhotoregisterDistance,
    dimensions: PhotoregisterDimensions
  ) => {
    const scale = svgDimensions.scale;

    let x = 0;
    if (reference.horizontal === "left") {
      x = distance.horizontal * scale;
    } else {
      x = (laminaWidth - dimensions.width - distance.horizontal) * scale;
    }

    let y = 0;
    if (reference.vertical === "top") {
      y = distance.vertical * scale;
    } else {
      y = (repetition - dimensions.height - distance.vertical) * scale;
    }

    return { x, y };
  };

  if (incomplete) {
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
        <p className="text-center text-sm text-slate-600">
          Complete el ancho y la repetición de la lámina para visualizar la ubicación del fotoregistro.
        </p>
      </div>
    );
  }

  const fr1Coords =
    fr1Dimensions && fr1Reference && fr1Distance
      ? getCoordinates(fr1Reference, fr1Distance, fr1Dimensions)
      : null;

  const fr2Coords =
    showFr2 && fr2Dimensions && fr2Reference && fr2Distance
      ? getCoordinates(fr2Reference, fr2Distance, fr2Dimensions)
      : null;

  const fr1Margins = useMemo(() => {
    if (!fr1Coords || !fr1Dimensions || !fr1Reference || !fr1Distance) return null;
    return calculateMargins(laminaWidth, repetition, fr1Dimensions, fr1Reference, fr1Distance);
  }, [fr1Coords, fr1Dimensions, fr1Reference, fr1Distance, laminaWidth, repetition]);

  const fr2Margins = useMemo(() => {
    if (!fr2Coords || !fr2Dimensions || !fr2Reference || !fr2Distance) return null;
    return calculateMargins(laminaWidth, repetition, fr2Dimensions, fr2Reference, fr2Distance);
  }, [fr2Coords, fr2Dimensions, fr2Reference, fr2Distance, laminaWidth, repetition]);

  // Usar padding calculado consistentemente
  const padding = calculateSVGPadding();
  const paddingH = padding.horizontal;
  const paddingV = padding.vertical;

  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-300 bg-white p-6 pt-12 overflow-x-auto">
      <svg
        width={svgDimensions.width + paddingH * 2}
        height={svgDimensions.height + paddingV * 2}
        viewBox={`${-paddingH} ${-paddingV} ${svgDimensions.width + paddingH * 2} ${svgDimensions.height + paddingV * 2}`}
        className="bg-white"
        style={{ minWidth: "600px", maxWidth: "100%" }}
      >
        {/* LÁMINA (fondo) */}
        <rect
          x="0"
          y="0"
          width={svgDimensions.width}
          height={svgDimensions.height}
          fill="#ffffff"
          stroke="#6b7280"
          strokeWidth="2.5"
        />

        {/* LÍNEAS DE REFERENCIA VERTICALES - Gris punteado para FR1, gris oscuro para extremos */}
        {fr1Coords && fr1Dimensions && (
          <>
            {/* Extremo izquierdo */}
            <line x1="0" y1="-15" x2="0" y2={svgDimensions.height + 15} stroke="#6b7280" strokeWidth="2" opacity="0.6" />

            {/* Inicio de FR1 - Punteada y gris */}
            <line x1={fr1Coords.x} y1="-15" x2={fr1Coords.x} y2={svgDimensions.height + 15} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Fin de FR1 - Punteada y gris */}
            <line x1={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y1="-15" x2={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y2={svgDimensions.height + 15} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Extremo derecho */}
            <line x1={svgDimensions.width} y1="-15" x2={svgDimensions.width} y2={svgDimensions.height + 15} stroke="#6b7280" strokeWidth="2" opacity="0.6" />
          </>
        )}

        {/* LÍNEAS DE REFERENCIA HORIZONTALES - Gris punteado para FR1, gris oscuro para extremos */}
        {fr1Coords && fr1Dimensions && (
          <>
            {/* Extremo superior */}
            <line x1="-15" y1="0" x2={svgDimensions.width + 15} y2="0" stroke="#6b7280" strokeWidth="2" opacity="0.6" />

            {/* Inicio de FR1 - Punteada y gris */}
            <line x1="-15" y1={fr1Coords.y} x2={svgDimensions.width + 15} y2={fr1Coords.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Fin de FR1 - Punteada y gris */}
            <line x1="-15" y1={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} x2={svgDimensions.width + 15} y2={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Extremo inferior */}
            <line x1="-15" y1={svgDimensions.height} x2={svgDimensions.width + 15} y2={svgDimensions.height} stroke="#6b7280" strokeWidth="2" opacity="0.6" />
          </>
        )}

        {/* LÍNEAS DE REFERENCIA VERTICALES FR2 - Gris punteado para inicio/fin de FR2 */}
        {fr2Coords && fr2Dimensions && (
          <>
            {/* Inicio de FR2 - Punteada y gris */}
            <line x1={fr2Coords.x} y1="-15" x2={fr2Coords.x} y2={svgDimensions.height + 15} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Fin de FR2 - Punteada y gris */}
            <line x1={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y1="-15" x2={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y2={svgDimensions.height + 15} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
          </>
        )}

        {/* LÍNEAS DE REFERENCIA HORIZONTALES FR2 - Gris punteado para inicio/fin de FR2 */}
        {fr2Coords && fr2Dimensions && (
          <>
            {/* Inicio de FR2 - Punteada y gris */}
            <line x1="-15" y1={fr2Coords.y} x2={svgDimensions.width + 15} y2={fr2Coords.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Fin de FR2 - Punteada y gris */}
            <line x1="-15" y1={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} x2={svgDimensions.width + 15} y2={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
          </>
        )}

        {/* FOTOREGISTRO 1 - Relleno azul suave con borde institucional */}
        {fr1Coords && fr1Dimensions && (() => {
          const isFr1Small = fr1Dimensions.height < 25 || fr1Dimensions.width < 25;
          const fr1TextY = isFr1Small ? fr1Coords.y - 15 : fr1Coords.y + (fr1Dimensions.height * svgDimensions.scale) / 2;
          const fr1TextBaseline = isFr1Small ? "auto" : "middle";
          return (
            <g>
              <rect
                x={fr1Coords.x}
                y={fr1Coords.y}
                width={fr1Dimensions.width * svgDimensions.scale}
                height={fr1Dimensions.height * svgDimensions.scale}
                fill="#dbeafe"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <text
                x={fr1Coords.x + (fr1Dimensions.width * svgDimensions.scale) / 2}
                y={fr1TextY}
                textAnchor="middle"
                dominantBaseline={fr1TextBaseline}
                fontSize="14"
                fontWeight="bold"
                fill="#0c4a6e"
              >
                FR1
              </text>
            </g>
          );
        })()}

        {/* GUÍAS INTERNAS FR1 - Líneas punteadas grises para proyectar límites */}
        {fr1Coords && fr1Dimensions && (
          <>
            {/* Línea vertical izquierda de FR1 */}
            <line
              x1={fr1Coords.x}
              y1="0"
              x2={fr1Coords.x}
              y2={svgDimensions.height}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
            {/* Línea vertical derecha de FR1 */}
            <line
              x1={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale}
              y1="0"
              x2={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale}
              y2={svgDimensions.height}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
            {/* Línea horizontal superior de FR1 */}
            <line
              x1="0"
              y1={fr1Coords.y}
              x2={svgDimensions.width}
              y2={fr1Coords.y}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
            {/* Línea horizontal inferior de FR1 */}
            <line
              x1="0"
              y1={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale}
              x2={svgDimensions.width}
              y2={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
          </>
        )}

        {/* GUÍAS INTERNAS FR2 - Líneas punteadas grises para proyectar límites */}
        {fr2Coords && fr2Dimensions && (
          <>
            {/* Línea vertical izquierda de FR2 */}
            <line
              x1={fr2Coords.x}
              y1="0"
              x2={fr2Coords.x}
              y2={svgDimensions.height}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
            {/* Línea vertical derecha de FR2 */}
            <line
              x1={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale}
              y1="0"
              x2={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale}
              y2={svgDimensions.height}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
            {/* Línea horizontal superior de FR2 */}
            <line
              x1="0"
              y1={fr2Coords.y}
              x2={svgDimensions.width}
              y2={fr2Coords.y}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
            {/* Línea horizontal inferior de FR2 */}
            <line
              x1="0"
              y1={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale}
              x2={svgDimensions.width}
              y2={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.35"
            />
          </>
        )}

        {/* FOTOREGISTRO 2 - Relleno indigo suave (distintivo) */}
        {fr2Coords && fr2Dimensions && (() => {
          const isFr2Small = fr2Dimensions.height < 25 || fr2Dimensions.width < 25;
          const fr2TextY = isFr2Small ? fr2Coords.y - 15 : fr2Coords.y + (fr2Dimensions.height * svgDimensions.scale) / 2;
          const fr2TextBaseline = isFr2Small ? "auto" : "middle";
          return (
            <g>
              <rect
                x={fr2Coords.x}
                y={fr2Coords.y}
                width={fr2Dimensions.width * svgDimensions.scale}
                height={fr2Dimensions.height * svgDimensions.scale}
                fill="#e0e7ff"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <text
                x={fr2Coords.x + (fr2Dimensions.width * svgDimensions.scale) / 2}
                y={fr2TextY}
                textAnchor="middle"
                dominantBaseline={fr2TextBaseline}
                fontSize="14"
                fontWeight="bold"
                fill="#3730a3"
              >
                FR2
              </text>
            </g>
          );
        })()}

        {/* COTAS DE ANCHO - Línea horizontal en la parte superior */}
        {fr1Coords && (
          <>
            {/* Línea horizontal principal */}
            <line x1="0" y1="-50" x2={svgDimensions.width} y2="-50" stroke="#6b7280" strokeWidth="2" opacity="0.6" />
            {/* Línea izquierda */}
            <line x1="0" y1="-44" x2="0" y2="-56" stroke="#6b7280" strokeWidth="2" opacity="0.6" />
            {/* Línea derecha */}
            <line x1={svgDimensions.width} y1="-44" x2={svgDimensions.width} y2="-56" stroke="#6b7280" strokeWidth="2" opacity="0.6" />
          </>
        )}

        {/* ANCHO DE LA LÁMINA - En la parte superior, encima de la línea */}
        <text x={svgDimensions.width / 2} y={-68} textAnchor="middle" dominantBaseline="auto" fontSize="13" fontWeight="700" fill="#1f2937" style={{paintOrder: 'stroke', strokeWidth: '3px', stroke: 'white'}}>
          Ancho de la lámina: {formatMeasurement(laminaWidth)}
        </text>

        {/* COTAS HORIZONTALES FR1 - En la parte inferior (estandarizado) */}
        {fr1Coords && fr1Dimensions && fr1Margins && (() => {
          const fr1HMainLineY = svgDimensions.height + 12;
          const fr1HTextY = fr1HMainLineY + COTA_TEXT_DISTANCE;
          const fr1HTickTop = fr1HMainLineY - TICK_HALF;
          const fr1HTickBottom = fr1HMainLineY + TICK_HALF;
          return (
            <>
              {/* Margen izquierdo */}
              <line x1="0" y1={fr1HMainLineY} x2={fr1Coords.x} y2={fr1HMainLineY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1="0" y1={fr1HTickTop} x2="0" y2={fr1HTickBottom} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1Coords.x} y1={fr1HTickTop} x2={fr1Coords.x} y2={fr1HTickBottom} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr1Coords.x / 2} y={fr1HTextY} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {formatMeasurement(fr1Margins.left)}
              </text>

              {/* Ancho FR1 */}
              <line x1={fr1Coords.x} y1={fr1HMainLineY} x2={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y2={fr1HMainLineY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1Coords.x} y1={fr1HTickTop} x2={fr1Coords.x} y2={fr1HTickBottom} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y1={fr1HTickTop} x2={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y2={fr1HTickBottom} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr1Coords.x + (fr1Dimensions.width * svgDimensions.scale) / 2} y={fr1HTextY} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {formatMeasurement(fr1Dimensions.width)}
              </text>

              {/* Margen derecho */}
              <line x1={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y1={fr1HMainLineY} x2={svgDimensions.width} y2={fr1HMainLineY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y1={fr1HTickTop} x2={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale} y2={fr1HTickBottom} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={svgDimensions.width} y1={fr1HTickTop} x2={svgDimensions.width} y2={fr1HTickBottom} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr1Coords.x + fr1Dimensions.width * svgDimensions.scale + (svgDimensions.width - fr1Coords.x - fr1Dimensions.width * svgDimensions.scale) / 2} y={fr1HTextY} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {formatMeasurement(fr1Margins.right)}
              </text>
            </>
          );
        })()}

        {/* COTAS HORIZONTALES FR2 - En la parte superior (estandarizado) */}
        {fr2Coords && fr2Dimensions && fr2Margins && (() => {
          const fr2HMainLineY = -8;
          const fr2HTextY = fr2HMainLineY - COTA_TEXT_DISTANCE;
          const fr2HTickTop = fr2HMainLineY - TICK_HALF;
          const fr2HTickBottom = fr2HMainLineY + TICK_HALF;
          return (
            <>
              {/* Margen izquierdo */}
              <line x1="0" y1={fr2HMainLineY} x2={fr2Coords.x} y2={fr2HMainLineY} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1="0" y1={fr2HTickTop} x2="0" y2={fr2HTickBottom} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2Coords.x} y1={fr2HTickTop} x2={fr2Coords.x} y2={fr2HTickBottom} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr2Coords.x / 2} y={fr2HTextY} textAnchor="middle" fontSize="11" fontWeight="600" fill="#4338ca">
                {formatMeasurement(fr2Margins.left)}
              </text>

              {/* Ancho FR2 */}
              <line x1={fr2Coords.x} y1={fr2HMainLineY} x2={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y2={fr2HMainLineY} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2Coords.x} y1={fr2HTickTop} x2={fr2Coords.x} y2={fr2HTickBottom} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y1={fr2HTickTop} x2={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y2={fr2HTickBottom} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr2Coords.x + (fr2Dimensions.width * svgDimensions.scale) / 2} y={fr2HTextY} textAnchor="middle" fontSize="11" fontWeight="600" fill="#4338ca">
                {formatMeasurement(fr2Dimensions.width)}
              </text>

              {/* Margen derecho */}
              <line x1={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y1={fr2HMainLineY} x2={svgDimensions.width} y2={fr2HMainLineY} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y1={fr2HTickTop} x2={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale} y2={fr2HTickBottom} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={svgDimensions.width} y1={fr2HTickTop} x2={svgDimensions.width} y2={fr2HTickBottom} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr2Coords.x + fr2Dimensions.width * svgDimensions.scale + (svgDimensions.width - fr2Coords.x - fr2Dimensions.width * svgDimensions.scale) / 2} y={fr2HTextY} textAnchor="middle" fontSize="11" fontWeight="600" fill="#4338ca">
                {formatMeasurement(fr2Margins.right)}
              </text>
            </>
          );
        })()}

        {/* COTAS DE REPETICIÓN - Línea vertical del lado izquierdo */}
        {fr1Coords && (
          <>
            {/* Línea vertical principal */}
            <line x1="-75" y1="0" x2="-75" y2={svgDimensions.height} stroke="#6b7280" strokeWidth="2" opacity="0.6" />
            {/* Línea superior */}
            <line x1="-69" y1="0" x2="-81" y2="0" stroke="#6b7280" strokeWidth="2" opacity="0.6" />
            {/* Línea inferior */}
            <line x1="-69" y1={svgDimensions.height} x2="-81" y2={svgDimensions.height} stroke="#6b7280" strokeWidth="2" opacity="0.6" />
          </>
        )}

        {/* COTAS VERTICALES FR2 - Lado izquierdo (estandarizado) */}
        {fr2Coords && fr2Dimensions && fr2Margins && (() => {
          const fr2VMainLineXLeft = -8;
          const fr2VTextXLeft = fr2VMainLineXLeft - COTA_TEXT_DISTANCE;
          const fr2VTickLeftLeft = fr2VMainLineXLeft - TICK_HALF;
          const fr2VTickRightLeft = fr2VMainLineXLeft + TICK_HALF;
          return (
            <>
              {/* Margen superior */}
              <line x1={fr2VMainLineXLeft} y1="0" x2={fr2VMainLineXLeft} y2={fr2Coords.y} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2VTickLeftLeft} y1="0" x2={fr2VTickRightLeft} y2="0" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2VTickLeftLeft} y1={fr2Coords.y} x2={fr2VTickRightLeft} y2={fr2Coords.y} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr2VTextXLeft} y={fr2Coords.y / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#4338ca">
                {formatMeasurement(fr2Margins.top)}
              </text>

              {/* Alto FR2 */}
              <line x1={fr2VMainLineXLeft} y1={fr2Coords.y} x2={fr2VMainLineXLeft} y2={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2VTickLeftLeft} y1={fr2Coords.y} x2={fr2VTickRightLeft} y2={fr2Coords.y} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2VTickLeftLeft} y1={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} x2={fr2VTickRightLeft} y2={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr2VTextXLeft} y={fr2Coords.y + (fr2Dimensions.height * svgDimensions.scale) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#4338ca">
                {formatMeasurement(fr2Dimensions.height)}
              </text>

              {/* Margen inferior */}
              <line x1={fr2VMainLineXLeft} y1={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} x2={fr2VMainLineXLeft} y2={svgDimensions.height} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2VTickLeftLeft} y1={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} x2={fr2VTickRightLeft} y2={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr2VTickLeftLeft} y1={svgDimensions.height} x2={fr2VTickRightLeft} y2={svgDimensions.height} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr2VTextXLeft} y={fr2Coords.y + fr2Dimensions.height * svgDimensions.scale + (svgDimensions.height - fr2Coords.y - fr2Dimensions.height * svgDimensions.scale) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#4338ca">
                {formatMeasurement(fr2Margins.bottom)}
              </text>
            </>
          );
        })()}

        {/* COTAS VERTICALES FR1 - Al lado derecho (estandarizado) */}
        {fr1Coords && fr1Dimensions && fr1Margins && (() => {
          const fr1VMainLineX = svgDimensions.width + 12;
          const fr1VTextX = fr1VMainLineX + COTA_TEXT_DISTANCE;
          const fr1VTickLeft = fr1VMainLineX - TICK_HALF;
          const fr1VTickRight = fr1VMainLineX + TICK_HALF;
          return (
            <>
              {/* Margen superior */}
              <line x1={fr1VMainLineX} y1="0" x2={fr1VMainLineX} y2={fr1Coords.y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1VTickLeft} y1="0" x2={fr1VTickRight} y2="0" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1VTickLeft} y1={fr1Coords.y} x2={fr1VTickRight} y2={fr1Coords.y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr1VTextX} y={fr1Coords.y / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {formatMeasurement(fr1Margins.top)}
              </text>

              {/* Alto FR1 */}
              <line x1={fr1VMainLineX} y1={fr1Coords.y} x2={fr1VMainLineX} y2={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1VTickLeft} y1={fr1Coords.y} x2={fr1VTickRight} y2={fr1Coords.y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1VTickLeft} y1={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} x2={fr1VTickRight} y2={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr1VTextX} y={fr1Coords.y + (fr1Dimensions.height * svgDimensions.scale) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {formatMeasurement(fr1Dimensions.height)}
              </text>

              {/* Margen inferior */}
              <line x1={fr1VMainLineX} y1={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} x2={fr1VMainLineX} y2={svgDimensions.height} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1VTickLeft} y1={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} x2={fr1VTickRight} y2={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <line x1={fr1VTickLeft} y1={svgDimensions.height} x2={fr1VTickRight} y2={svgDimensions.height} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              <text x={fr1VTextX} y={fr1Coords.y + fr1Dimensions.height * svgDimensions.scale + (svgDimensions.height - fr1Coords.y - fr1Dimensions.height * svgDimensions.scale) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {formatMeasurement(fr1Margins.bottom)}
              </text>
            </>
          );
        })()}

        {/* REPETICIÓN - Lado izquierdo, vertical */}
        <text x={-105} y={svgDimensions.height / 2} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#1f2937" transform={`rotate(-90 -105 ${svgDimensions.height / 2})`} style={{paintOrder: 'stroke', strokeWidth: '3px', stroke: 'white'}}>
          Repetición: {formatMeasurement(repetition)}
        </text>
      </svg>
    </div>
  );
}
