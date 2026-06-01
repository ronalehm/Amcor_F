import FormCard from "../../../shared/components/forms/FormCard";
import type { ChangeLogEntry } from "../types/catalogRestriction.types";

interface ChangeLogPanelProps {
  entries: ChangeLogEntry[];
}

export default function ChangeLogPanel({ entries }: ChangeLogPanelProps) {
  return (
    <FormCard title="Bitácora de Cambios" icon="📜" color="#f39c12">
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">No hay cambios registrados aún.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="border-l-4 border-blue-300 bg-blue-50 p-3 rounded">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                  <p className="text-xs text-slate-600">{entry.element}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Registros procesados: {entry.processedRecords}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{entry.timestamp}</p>
                  <p className="text-xs text-slate-600 font-medium">{entry.user}</p>
                  <span className={`inline-flex items-center mt-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    entry.result === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {entry.result === "success" ? "✓ Éxito" : "✗ Error"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormCard>
  );
}
