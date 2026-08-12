import { Calendar, User, Hash, Info } from "lucide-react";
import { getRestrictionChangeLog } from "../../../shared/data/restrictionChangeLog";
import { useState, useMemo } from "react";

export function RestrictionChangeLogTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const logs = useMemo(() => {
    const allLogs = getRestrictionChangeLog();
    return allLogs.sort((a, b) => {
      // Parse dates: "25/7/2025 10:30:45"
      const dateA = new Date(a.timestamp.replace(/(\d+)\/(\d+)\/(\d+) (.*)/, "$3-$2-$1 $4"));
      const dateB = new Date(b.timestamp.replace(/(\d+)\/(\d+)\/(\d+) (.*)/, "$3-$2-$1 $4"));
      return dateB.getTime() - dateA.getTime();
    });
  }, []);

  const getStatusColor = (result: string) => {
    if (result === "success") return "bg-green-50 border-green-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusBadgeColor = (result: string) => {
    if (result === "success") return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusIcon = (result: string) => {
    if (result === "success") return "✓";
    return "✕";
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: "Creado",
      updated: "Actualizado",
      deleted: "Eliminado",
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-800";
      case "updated":
        return "bg-blue-100 text-blue-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No hay cambios registrados</p>
        <p className="text-sm text-slate-500 mt-1">
          Los cambios en restricciones aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className={`rounded-lg border ${getStatusColor(log.result)} transition-all`}
        >
          {/* Header */}
          <button
            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
            className="w-full text-left p-4 hover:bg-slate-100/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Status Badge */}
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getStatusBadgeColor(log.result)}`}
                >
                  {getStatusIcon(log.result)}
                </span>

                {/* Main Info */}
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{log.restrictionName}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Hash size={14} />
                      <span>{log.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${getActionColor(log.action)}`}
                >
                  {getActionLabel(log.action)}
                </span>

                {/* Toggle Arrow */}
                <span
                  className={`text-slate-400 transition-transform ${
                    expandedId === log.id ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
          </button>

          {/* Details - Expandable */}
          {expandedId === log.id && (
            <div className="border-t border-slate-200 px-4 py-4 bg-white/50">
              <div className="space-y-4">
                {/* Tipo de Restricción */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Tipo de Restricción
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {log.restrictionType === "dimension" ? "Dimensiones" : "Validación"}
                  </span>
                </div>

                {/* Motivo */}
                {log.reason && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Motivo
                    </p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                      {log.reason}
                    </p>
                  </div>
                )}

                {/* Changes Summary */}
                {log.changes && Object.keys(log.changes).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Cambios Detectados
                    </p>
                    <div className="space-y-2">
                      {Object.entries(log.changes).map(([key, change]) => (
                        <div
                          key={key}
                          className="text-sm bg-slate-50 p-3 rounded border border-slate-200"
                        >
                          <p className="font-semibold text-slate-900 mb-2">{key}</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Antes:</p>
                              <p className="text-xs text-slate-700 font-mono">
                                {JSON.stringify(change.old)?.substring(0, 100)}
                                {JSON.stringify(change.old)?.length > 100 ? "..." : ""}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Después:</p>
                              <p className="text-xs text-slate-700 font-mono">
                                {JSON.stringify(change.new)?.substring(0, 100)}
                                {JSON.stringify(change.new)?.length > 100 ? "..." : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-600 font-semibold">ID de Restricción:</p>
                      <p className="text-slate-700 font-mono">{log.restrictionId}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-semibold">ID de Log:</p>
                      <p className="text-slate-700 font-mono">{log.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
