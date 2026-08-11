import { useState } from "react";
import type { RestrictionValidationSummary } from "../types/catalogRestriction.types";

interface RestrictionChangePreviewModalProps {
  isOpen: boolean;
  summary: RestrictionValidationSummary;
  onClose: () => void;
  onApply?: () => void;
  isApplying?: boolean;
  reason?: string;
}

export default function RestrictionChangePreviewModal({
  isOpen,
  summary,
  onClose,
  onApply,
  isApplying = false,
  reason = "",
}: RestrictionChangePreviewModalProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(
    new Set(summary.rows.map((_, i) => i.toString()))
  );

  if (!isOpen) return null;

  const handleSelectAll = () => {
    if (selectedRows.size === summary.rows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(summary.rows.map((_, i) => i.toString())));
    }
  };

  const handleToggleRow = (index: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              📊 Preview de Cambios en Restricciones
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Revisa los cambios detectados antes de aplicarlos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 uppercase">Total</p>
              <p className="text-2xl font-bold text-blue-900">{summary.totalRecords}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-600 uppercase">Modificados</p>
              <p className="text-2xl font-bold text-green-900">{summary.modifiedRecords}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-xs font-semibold text-amber-600 uppercase">Nuevos</p>
              <p className="text-2xl font-bold text-amber-900">{summary.newRecords}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 uppercase">Válidos</p>
              <p className="text-2xl font-bold text-slate-900">{summary.validRecords}</p>
            </div>
          </div>

          {/* Changes Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === summary.rows.length}
                      onChange={handleSelectAll}
                      className="rounded cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Tipo de Producto
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Cambios
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.rows.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index.toString())}
                        onChange={() => handleToggleRow(index.toString())}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.nombre || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.tipoProducto || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-blue-600 font-semibold">
                        {row.cambiosDetectados || "Múltiples"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          row.status === "valid"
                            ? "bg-green-100 text-green-700"
                            : row.status === "error"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.status === "modificado" ? "Modificado" : row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reason */}
          {reason && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                Motivo del cambio
              </p>
              <p className="text-sm text-slate-700">{reason}</p>
            </div>
          )}

          {/* Warnings */}
          {summary.criticalErrors > 0 && (
            <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
              <p className="text-sm font-semibold text-red-900">
                ⚠️ {summary.criticalErrors} error(es) crítico(s) detectado(s)
              </p>
              <p className="text-xs text-red-800 mt-1">
                Revisa la plantilla y vuelve a cargarla
              </p>
            </div>
          )}

          {summary.observations > 0 && summary.criticalErrors === 0 && (
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
              <p className="text-sm font-semibold text-blue-900">
                ℹ️ {summary.observations} observación(es)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying || selectedRows.size === 0}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isApplying ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Aplicando...
              </>
            ) : (
              <>✓ Aplicar {selectedRows.size} cambio(s)</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
