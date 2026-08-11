import { Calendar, User, Hash, Info } from "lucide-react";
import { getCatalogChangeLogs } from "../../../shared/catalogs/catalog.service";
import type { CatalogChangeLog } from "../../../shared/catalogs/catalog.types";
import { useState, useMemo } from "react";

interface CatalogChangeLogTableProps {
  catalogCode?: string;
}

export function CatalogChangeLogTable({ catalogCode }: CatalogChangeLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const logs = useMemo(() => {
    const allLogs = getCatalogChangeLogs(catalogCode);
    return allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [catalogCode]);

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

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No hay cambios registrados</p>
        <p className="text-sm text-slate-500 mt-1">
          {catalogCode ? "Este catálogo aún no tiene cambios" : "Los cambios de catálogos aparecerán aquí"}
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
                  <p className="font-semibold text-slate-900">{log.catalogName}</p>
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
                      <span>{new Date(log.timestamp).toLocaleString("es-ES")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Summary */}
              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  {log.newRecords > 0 && (
                    <p className="text-green-700 font-semibold">+{log.newRecords} nuevo</p>
                  )}
                  {log.modifiedRecords > 0 && (
                    <p className="text-blue-700 font-semibold">~{log.modifiedRecords} modificado</p>
                  )}
                  {log.inactivatedRecords > 0 && (
                    <p className="text-orange-700 font-semibold">⊘{log.inactivatedRecords} inactivo</p>
                  )}
                  {log.blockedRecords > 0 && (
                    <p className="text-red-700 font-semibold">🔒{log.blockedRecords} bloqueado</p>
                  )}
                </div>

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
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-xs text-green-600 font-semibold">Nuevos</p>
                    <p className="text-xl font-bold text-green-900 mt-1">{log.newRecords}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold">Modificados</p>
                    <p className="text-xl font-bold text-blue-900 mt-1">{log.modifiedRecords}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded border border-orange-200">
                    <p className="text-xs text-orange-600 font-semibold">Inactivados</p>
                    <p className="text-xl font-bold text-orange-900 mt-1">{log.inactivatedRecords}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <p className="text-xs text-red-600 font-semibold">Bloqueados</p>
                    <p className="text-xl font-bold text-red-900 mt-1">{log.blockedRecords}</p>
                  </div>
                </div>

                {/* Reason */}
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

                {/* Details */}
                {log.details && log.details.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Detalles de Cambios ({log.details.length})
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {log.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-slate-50 p-3 rounded border border-slate-200"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {detail.item} - {detail.name}
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                Acción:{" "}
                                <span className="font-mono font-semibold">
                                  {detail.detectedAction}
                                </span>
                              </p>
                              {detail.currentStatus && (
                                <p className="text-xs text-slate-600">
                                  {detail.currentStatus} → {detail.newStatus}
                                </p>
                              )}
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                                detail.detectedAction === "new"
                                  ? "bg-green-100 text-green-700"
                                  : detail.detectedAction === "inactive"
                                    ? "bg-orange-100 text-orange-700"
                                    : detail.detectedAction === "blocked"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {detail.detectedAction}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
