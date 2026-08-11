import { CheckCircle2 } from "lucide-react";
import type { ManagementType } from "../types/catalogRestriction.types";

interface ManagementTypeCardsProps {
  value: ManagementType;
  onChange: (type: ManagementType) => void;
}

export default function ManagementTypeCards({
  value,
  onChange,
}: ManagementTypeCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <button
        onClick={() => onChange("catalog")}
        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
          value === "catalog"
            ? "border-brand-primary bg-brand-primary/5"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Catálogo</h4>
            <p className="text-sm text-slate-600 mt-1">
              Actualiza los valores disponibles de un catálogo.
            </p>
          </div>
          {value === "catalog" && (
            <CheckCircle2 className="flex-shrink-0 text-brand-primary" size={20} />
          )}
        </div>
      </button>

      <button
        onClick={() => onChange("restriction")}
        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
          value === "restriction"
            ? "border-brand-primary bg-brand-primary/5"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Restricción</h4>
            <p className="text-sm text-slate-600 mt-1">
              Actualiza reglas de dimensiones o validaciones.
            </p>
          </div>
          {value === "restriction" && (
            <CheckCircle2 className="flex-shrink-0 text-brand-primary" size={20} />
          )}
        </div>
      </button>
    </div>
  );
}
