import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CalculatedMeasuresAccordionProps {
  number: 1 | 2;
  margins: { left: number; right: number; top: number; bottom: number };
}

const CalculatedMeasuresAccordion: React.FC<CalculatedMeasuresAccordionProps> = ({
  number,
  margins,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatValue = (value: number) => {
    // Mostrar con máximo un decimal si es necesario
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-sm font-bold uppercase text-slate-900">
          Medidas calculadas - Fotoregistro {number}
        </h3>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 px-4 py-4 bg-slate-50">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-xs text-slate-600 font-semibold mb-1">Izquierda</div>
              <div className="text-sm font-mono text-slate-900">{formatValue(margins.left)} mm</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 font-semibold mb-1">Derecha</div>
              <div className="text-sm font-mono text-slate-900">{formatValue(margins.right)} mm</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 font-semibold mb-1">Superior</div>
              <div className="text-sm font-mono text-slate-900">{formatValue(margins.top)} mm</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 font-semibold mb-1">Inferior</div>
              <div className="text-sm font-mono text-slate-900">{formatValue(margins.bottom)} mm</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatedMeasuresAccordion;
