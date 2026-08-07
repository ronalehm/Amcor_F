import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import type { HorizontalReference, VerticalReference, PhotoregisterReference, PhotoregisterDistance } from "../../../shared/utils/photoregisterCalculations";

interface PhotoregisterAccordionProps {
  title: string;
  number: 1 | 2;
  isAutomatic?: boolean;
  isCustom?: boolean;
  isIncomplete?: boolean;
  hasErrors?: boolean;
  width: number;
  height: number;
  reference: PhotoregisterReference;
  distance: PhotoregisterDistance;
  margins: { left: number; right: number; top: number; bottom: number };
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onReferenceChange: (ref: PhotoregisterReference) => void;
  onDistanceChange: (dist: PhotoregisterDistance) => void;
  disabled?: boolean;
  summary?: string;
  canEditDimensions?: boolean;
}

const PhotoregisterAccordion: React.FC<PhotoregisterAccordionProps> = ({
  title,
  number,
  isAutomatic = false,
  isCustom = false,
  isIncomplete = false,
  hasErrors = false,
  width,
  height,
  reference,
  distance,
  margins,
  onWidthChange,
  onHeightChange,
  onReferenceChange,
  onDistanceChange,
  disabled = false,
  summary = "",
  canEditDimensions = true,
}) => {
  const [isOpen, setIsOpen] = useState(number === 1);
  const [localWidth, setLocalWidth] = useState(String(width));
  const [localHeight, setLocalHeight] = useState(String(height));
  const [localDistanceH, setLocalDistanceH] = useState(String(distance.horizontal));
  const [localDistanceV, setLocalDistanceV] = useState(String(distance.vertical));

  useEffect(() => {
    setLocalWidth(String(width));
  }, [width]);

  useEffect(() => {
    setLocalHeight(String(height));
  }, [height]);

  useEffect(() => {
    setLocalDistanceH(String(distance.horizontal));
  }, [distance.horizontal]);

  useEffect(() => {
    setLocalDistanceV(String(distance.vertical));
  }, [distance.vertical]);

  const getStatusLabel = () => {
    if (hasErrors) return "Con errores";
    if (isIncomplete) return "Incompleto";
    return "";
  };

  const getStatusColor = () => {
    if (hasErrors) return "text-red-600";
    if (isIncomplete) return "text-slate-500";
    if (isAutomatic && !isCustom) return "text-blue-600";
    if (isCustom) return "text-amber-600";
    return "text-green-600";
  };

  const getHorizontalLabel = (ref: HorizontalReference) => {
    return ref === "left" ? "Izquierda" : "Derecha";
  };

  const getVerticalLabel = (ref: VerticalReference) => {
    return ref === "top" ? "Arriba" : "Abajo";
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold uppercase text-slate-900">{title}</h3>
            <span className={`text-xs font-semibold ${getStatusColor()}`}>{getStatusLabel()}</span>
          </div>
          {summary && !isOpen && <p className="text-xs text-slate-600 mt-1">{summary}</p>}
        </div>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 px-4 py-4 bg-slate-50">
          {/* Grid para estructura: 140px | 1fr | 1fr */}
          <div
            className="grid gap-y-4 gap-x-4"
            style={{
              gridTemplateColumns: "140px 1fr 1fr",
              alignItems: "end",
            }}
          >
            {/* DIMENSIONES */}
            <label className="text-xs font-bold uppercase text-slate-600">Dimensiones:</label>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Ancho (mm)</div>
              <FormInput
                label=""
                value={localWidth}
                onChange={(val) => setLocalWidth(val)}
                onBlur={() => {
                  const parsed = parseFloat(localWidth.replace(",", "."));
                  if (!isNaN(parsed) && parsed > 0) {
                    onWidthChange(parsed);
                  } else {
                    setLocalWidth(String(width));
                  }
                }}
                placeholder="60.0"
                disabled={disabled || !canEditDimensions}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Alto (mm)</div>
              <FormInput
                label=""
                value={localHeight}
                onChange={(val) => setLocalHeight(val)}
                onBlur={() => {
                  const parsed = parseFloat(localHeight.replace(",", "."));
                  if (!isNaN(parsed) && parsed > 0) {
                    onHeightChange(parsed);
                  } else {
                    setLocalHeight(String(height));
                  }
                }}
                placeholder="40.0"
                disabled={disabled || !canEditDimensions}
              />
            </div>

            {/* HORIZONTAL */}
            <label className="text-xs font-bold uppercase text-slate-600">Horizontal:</label>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Medir desde</div>
              <FormSelect
                label=""
                value={reference.horizontal}
                onChange={(val) =>
                  onReferenceChange({
                    horizontal: val as HorizontalReference,
                    vertical: reference.vertical,
                  })
                }
                options={[
                  { value: "left", label: "Izquierda" },
                  { value: "right", label: "Derecha" },
                ]}
                disabled={disabled}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Distancia (mm)</div>
              <FormInput
                label=""
                value={localDistanceH}
                onChange={(val) => setLocalDistanceH(val)}
                onBlur={() => {
                  const parsed = parseFloat(localDistanceH.replace(",", "."));
                  if (!isNaN(parsed) && parsed >= 0) {
                    onDistanceChange({
                      horizontal: parsed,
                      vertical: distance.vertical,
                    });
                  } else {
                    setLocalDistanceH(String(distance.horizontal));
                  }
                }}
                placeholder="34.0"
                disabled={disabled}
              />
            </div>

            {/* VERTICAL */}
            <label className="text-xs font-bold uppercase text-slate-600">Vertical:</label>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Medir desde</div>
              <FormSelect
                label=""
                value={reference.vertical}
                onChange={(val) =>
                  onReferenceChange({
                    horizontal: reference.horizontal,
                    vertical: val as VerticalReference,
                  })
                }
                options={[
                  { value: "top", label: "Arriba" },
                  { value: "bottom", label: "Abajo" },
                ]}
                disabled={disabled}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Distancia (mm)</div>
              <FormInput
                label=""
                value={localDistanceV}
                onChange={(val) => setLocalDistanceV(val)}
                onBlur={() => {
                  const parsed = parseFloat(localDistanceV.replace(",", "."));
                  if (!isNaN(parsed) && parsed >= 0) {
                    onDistanceChange({
                      horizontal: distance.horizontal,
                      vertical: parsed,
                    });
                  } else {
                    setLocalDistanceV(String(distance.vertical));
                  }
                }}
                placeholder="50.0"
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoregisterAccordion;
