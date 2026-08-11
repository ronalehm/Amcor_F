import { X } from "lucide-react";
import type { EnrichedRestriction } from "../utils/restrictionAdapters";
import {
  getTypeLabel,
  getProductTypeLabel,
  getStatusColor,
} from "../utils/restrictionAdapters";
import type {
  DimensionRestrictionCatalog,
  ValidationRestrictionCatalog,
} from "../../../shared/data/restrictionCatalogs";

interface RestrictionDetailDrawerProps {
  isOpen: boolean;
  restriction: EnrichedRestriction | null;
  onClose: () => void;
}

export default function RestrictionDetailDrawer({
  isOpen,
  restriction,
  onClose,
}: RestrictionDetailDrawerProps) {
  if (!isOpen || !restriction) return null;

  const isDimension = restriction.type === "dimension";
  const sourceData = restriction.sourceData as
    | DimensionRestrictionCatalog
    | ValidationRestrictionCatalog;

  const statusColor = getStatusColor(restriction.status);
  const statusBgColor =
    statusColor === "green"
      ? "bg-green-100"
      : statusColor === "red"
      ? "bg-red-100"
      : "bg-gray-100";
  const statusTextColor =
    statusColor === "green"
      ? "text-green-700"
      : statusColor === "red"
      ? "text-red-700"
      : "text-gray-700";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-200 bg-slate-50 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {restriction.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Tipo
            </label>
            <p className="text-sm font-semibold text-slate-900">
              {getTypeLabel(restriction.type)}
            </p>
          </div>

          {/* Envoltura */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Envoltura
            </label>
            <p className="text-sm font-semibold text-slate-900">
              {getProductTypeLabel(restriction.productType)}
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Estado
            </label>
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusBgColor} ${statusTextColor}`}
            >
              {restriction.status}
            </span>
          </div>

          {/* Description */}
          {restriction.description && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                Descripción
              </label>
              <p className="text-sm text-slate-700">
                {restriction.description}
              </p>
            </div>
          )}

          {/* Dimension-specific details */}
          {isDimension && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">
                Campos de Dimensión
              </label>
              <div className="space-y-2 text-sm">
                {(
                  sourceData as DimensionRestrictionCatalog
                ).ancho && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ancho:</span>
                    <span className="font-mono text-slate-900">
                      {(sourceData as DimensionRestrictionCatalog).ancho?.min} -{" "}
                      {(sourceData as DimensionRestrictionCatalog).ancho?.max} mm
                    </span>
                  </div>
                )}
                {(
                  sourceData as DimensionRestrictionCatalog
                ).largo && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Largo:</span>
                    <span className="font-mono text-slate-900">
                      {(sourceData as DimensionRestrictionCatalog).largo?.min} -{" "}
                      {(sourceData as DimensionRestrictionCatalog).largo?.max} mm
                    </span>
                  </div>
                )}
                {(
                  sourceData as DimensionRestrictionCatalog
                ).anchoFuelle && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ancho Fuelle:</span>
                    <span className="font-mono text-slate-900">
                      {(sourceData as DimensionRestrictionCatalog).anchoFuelle?.min} -{" "}
                      {(sourceData as DimensionRestrictionCatalog).anchoFuelle?.max} mm
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation-specific details */}
          {!isDimension && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Campo Origen
                </label>
                <p className="text-sm font-mono text-slate-900">
                  {(sourceData as ValidationRestrictionCatalog).sourceField}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Campo Dependiente
                </label>
                <p className="text-sm font-mono text-slate-900">
                  {(sourceData as ValidationRestrictionCatalog).dependentField}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Valores Permitidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    sourceData as ValidationRestrictionCatalog
                  ).allowedValues.map((value) => (
                    <span
                      key={value}
                      className="inline-block px-2 py-1 rounded bg-slate-100 text-xs text-slate-700"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
}
