import FormCard from "../../../shared/components/forms/FormCard";
import { getValidationStatusColor } from "../utils/catalogRestrictionValidators";
import type { ValidationSummary } from "../types/catalogRestriction.types";

interface ValidationSummaryCardProps {
  summary: ValidationSummary | null;
}

export default function ValidationSummaryCard({ summary }: ValidationSummaryCardProps) {
  if (!summary) {
    return (
      <FormCard title="Resultado de validación" icon="✅" color="#00A551">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Estado</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold">
              Pendiente de validación
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 pt-4">
            {[
              { label: "Nuevos", count: 0 },
              { label: "Modificados", count: 0 },
              { label: "Inactivos/Bloqueados", count: 0 },
              { label: "Observaciones", count: 0 },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-semibold text-slate-500 uppercase">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </FormCard>
    );
  }

  const statusLabels: Record<string, string> = {
    pending: "Pendiente de validación",
    validating: "Validando archivo",
    with_observations: "Archivo con observaciones",
    valid: "Archivo válido",
    applied: "Cambios aplicados",
  };

  const statusColor = getValidationStatusColor(summary.status);

  return (
    <FormCard title="Resultado de validación" icon="✅" color="#00A551">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Estado</p>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>
            {statusLabels[summary.status]}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-2">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Nuevos</p>
            <p className="text-2xl font-bold text-green-600">{summary.newRecords}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Modificados</p>
            <p className="text-2xl font-bold text-blue-600">{summary.modifiedRecords}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Inactivos/Bloqueados</p>
            <p className="text-2xl font-bold text-slate-600">{summary.inactivatedRecords}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Observaciones</p>
            <p className={`text-2xl font-bold ${summary.observations > 0 ? "text-red-600" : "text-slate-600"}`}>
              {summary.observations}
            </p>
          </div>
        </div>

        {summary.observations > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              className="text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              ↓ Descargar observaciones
            </button>
            <p className="text-xs text-slate-500 mt-2">Corrige la plantilla y vuelve a cargar el archivo.</p>
          </div>
        )}
      </div>
    </FormCard>
  );
}
