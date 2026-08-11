import { X } from "lucide-react";
import type { ChangeLogEntry } from "../types/catalogRestriction.types";
import type { RestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "catalog" | "restriction";
  catalogEntries: ChangeLogEntry[];
  restrictionEntries: RestrictionChangeLogEntry[];
}

export default function HistoryModal({
  isOpen,
  onClose,
  type,
  catalogEntries,
  restrictionEntries,
}: HistoryModalProps) {
  if (!isOpen) return null;

  const entries = type === "catalog" ? catalogEntries : restrictionEntries;
  const title =
    type === "catalog"
      ? "Historial de Cambios de Catálogos"
      : "Historial de Cambios de Restricciones";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-8">
              No hay registros en el historial.
            </p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) =>
                type === "catalog" ? (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {(entry as ChangeLogEntry).element}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {(entry as ChangeLogEntry).action}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                          (entry as ChangeLogEntry).result === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {(entry as ChangeLogEntry).result === "success"
                          ? "Éxito"
                          : "Error"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3">
                      <div>
                        <span className="font-medium">Fecha:</span>{" "}
                        {(entry as ChangeLogEntry).timestamp}
                      </div>
                      <div>
                        <span className="font-medium">Usuario:</span>{" "}
                        {(entry as ChangeLogEntry).user}
                      </div>
                      <div>
                        <span className="font-medium">Registros:</span>{" "}
                        {(entry as ChangeLogEntry).processedRecords || 0}
                      </div>
                      <div>
                        <span className="font-medium">Fuente:</span>{" "}
                        {(entry as ChangeLogEntry).source}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {(entry as RestrictionChangeLogEntry).restrictionName}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {(entry as RestrictionChangeLogEntry).action ===
                          "updated"
                            ? "Actualizado"
                            : (entry as RestrictionChangeLogEntry).action ===
                            "deleted"
                            ? "Eliminado"
                            : "Creado"}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                        {(entry as RestrictionChangeLogEntry).restrictionType ===
                        "dimension"
                          ? "Dimensión"
                          : "Validación"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3">
                      <div>
                        <span className="font-medium">Fecha:</span>{" "}
                        {(entry as RestrictionChangeLogEntry).timestamp}
                      </div>
                      <div>
                        <span className="font-medium">Usuario:</span>{" "}
                        {(entry as RestrictionChangeLogEntry).user}
                      </div>
                    </div>
                    {(entry as RestrictionChangeLogEntry).reason && (
                      <div className="mt-3 p-2 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-600">
                          <span className="font-medium">Motivo:</span>{" "}
                          {(entry as RestrictionChangeLogEntry).reason}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
