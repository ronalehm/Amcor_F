import { tableStyles } from "../../../shared/ui/tableStyles";
import type { ChangeLogEntry } from "../types/catalogRestriction.types";

interface ChangeLogPanelProps {
  entries: ChangeLogEntry[];
}

export default function ChangeLogPanel({ entries }: ChangeLogPanelProps) {
  const actionLabels: Record<string, string> = {
    create: "Crear",
    modify: "Modificar",
    block: "Bloquear",
    inactive: "Inactivar",
  };

  const typeLabels: Record<string, string> = {
    catalog: "Catálogo",
    restriction: "Restricción",
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Bitácora reciente</p>
        <p className="text-sm text-slate-500">Historial de cambios aplicados en catálogos y restricciones</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">No hay cambios registrados</p>
        </div>
      ) : (
        <div className={tableStyles.wrapper}>
          <div className={tableStyles.scroll}>
            <table className={tableStyles.table}>
              <thead>
                <tr className={tableStyles.headerRow}>
                  <th className={tableStyles.headerCell}>Fecha/Hora</th>
                  <th className={tableStyles.headerCell}>Usuario</th>
                  <th className={tableStyles.headerCell}>Tipo</th>
                  <th className={tableStyles.headerCell}>Elemento</th>
                  <th className={tableStyles.headerCell}>Acción</th>
                  <th className={tableStyles.headerCell}>Registros</th>
                  <th className={tableStyles.headerCell}>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry.id} className={idx % 2 === 0 ? tableStyles.rowEven : tableStyles.rowOdd}>
                    <td className={tableStyles.cell}>{entry.timestamp}</td>
                    <td className={tableStyles.cell}>{entry.user}</td>
                    <td className={tableStyles.cell}>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700">
                        {typeLabels[entry.managementType]}
                      </span>
                    </td>
                    <td className={tableStyles.cell}>{entry.element}</td>
                    <td className={tableStyles.cell}>
                      <span className="text-sm font-semibold text-slate-700">{actionLabels[entry.action] || entry.action}</span>
                    </td>
                    <td className={tableStyles.cell}>
                      <span className="text-sm font-semibold text-slate-700">{entry.processedRecords}</span>
                    </td>
                    <td className={tableStyles.cell}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          entry.result === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {entry.result === "success" ? "✓ Exitoso" : "✗ Error"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
