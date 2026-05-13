import { useState, useMemo } from "react";
import type { ProjectRecord } from "../../../shared/data/projectStorage";
import {
  normalizeProjectWorkflow,
  PROJECT_STAGE_LABELS,
} from "../../../shared/data/projectWorkflow";
import FormCard from "../../../shared/components/forms/FormCard";

type ViewMode = "visible" | "internal";

interface ProjectStatusPanelProps {
  project: ProjectRecord;
}

export default function ProjectStatusPanel({ project }: ProjectStatusPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("visible");
  const normalizedProject = useMemo(() => normalizeProjectWorkflow(project), [project]);

  const getStatusBadgeColor = (status?: string): string => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "Registrado":
        return "bg-blue-100 text-blue-800";
      case "En Preparación":
        return "bg-blue-100 text-blue-800";
      case "Ficha Completa":
        return "bg-green-100 text-green-800";
      case "En validación":
        return "bg-yellow-100 text-yellow-800";
      case "Observado":
        return "bg-orange-100 text-orange-800";
      case "Validado":
        return "bg-green-100 text-green-800";
      case "En Cotización":
        return "bg-purple-100 text-purple-800";
      case "Cotización Completa":
        return "bg-purple-100 text-purple-800";
      case "Aprobado por Cliente":
        return "bg-green-100 text-green-800";
      case "Desestimado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getValidationBadgeColor = (status?: string): string => {
    if (!status) return "bg-gray-100 text-gray-800";
    if (status === "Sin solicitar" || status === "No solicitado")
      return "bg-gray-100 text-gray-800";
    if (status === "En Revisión")
      return "bg-yellow-100 text-yellow-800";
    if (status === "Validado" || status === "Aprobado automático")
      return "bg-green-100 text-green-800";
    if (status === "Observado" || status === "Rechazado")
      return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getNextAction = (): string => {
    const status = normalizedProject.status;
    switch (status) {
      case "Registrado":
      case "En Preparación":
        return "Completar información del proyecto";
      case "Ficha Completa":
        return "Solicitar validación técnica";
      case "En validación":
        return "Esperar validación técnica";
      case "Observado":
        return "Corregir observaciones";
      case "Validado":
        return "Generar Producto Preliminar";
      case "En Cotización":
        return "Registrar aprobación del cliente";
      case "Cotización Completa":
        return "Registrar aprobación del cliente";
      case "Aprobado por Cliente":
        return "Proyecto aprobado";
      case "Desestimado":
        return "Proyecto cerrado";
      default:
        return "—";
    }
  };

  const stageLabel = normalizedProject.stage ? PROJECT_STAGE_LABELS[normalizedProject.stage] : "—";

  return (
    <FormCard title="Estado del Proyecto" icon="📊" color="#27ae60">
      {/* Toggle buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode("visible")}
          className={`flex-1 px-4 py-2 rounded font-medium text-sm transition-colors ${
            viewMode === "visible"
              ? "bg-brand-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Estados visibles
        </button>
        <button
          onClick={() => setViewMode("internal")}
          className={`flex-1 px-4 py-2 rounded font-medium text-sm transition-colors ${
            viewMode === "internal"
              ? "bg-brand-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Estados internos
        </button>
      </div>

      {/* Estados visibles tab */}
      {viewMode === "visible" && (
        <div className="space-y-4">
          {/* Etapa */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Etapa</label>
            <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm font-medium text-blue-900">
              {stageLabel}
            </div>
          </div>

          {/* Estado visible */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Estado Visible</label>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-2 rounded font-medium text-sm ${getStatusBadgeColor(
                  normalizedProject.status
                )}`}
              >
                {normalizedProject.status || "—"}
              </span>
            </div>
          </div>

          {/* Completitud */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Completitud
            </label>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{
                    width: `${Math.min(normalizedProject.completionPercentage || 0, 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-12">
                {normalizedProject.completionPercentage || 0}%
              </span>
            </div>
          </div>

          {/* Fecha de actualización */}
          {normalizedProject.statusUpdatedAt && (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Actualizado
              </label>
              <div className="mt-1 text-sm text-gray-600">
                {new Date(normalizedProject.statusUpdatedAt).toLocaleDateString("es-AR")}
              </div>
            </div>
          )}

          {/* Acción siguiente */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <label className="text-xs font-semibold text-amber-900 uppercase">
              Siguiente acción
            </label>
            <div className="mt-2 text-sm text-amber-900">{getNextAction()}</div>
          </div>
        </div>
      )}

      {/* Estados internos tab */}
      {viewMode === "internal" && (
        <div className="space-y-4">
          {/* Artes Gráficas */}
          <div className="border border-gray-200 rounded p-3">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              Artes Gráficas
            </div>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getValidationBadgeColor(
                normalizedProject.graphicArtsValidationStatus
              )}`}
            >
              {normalizedProject.graphicArtsValidationStatus || "Sin solicitar"}
            </span>
          </div>

          {/* Validación técnica */}
          <div className="border border-gray-200 rounded p-3">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              Validación técnica
            </div>
            <div className="space-y-2">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${getValidationBadgeColor(
                  normalizedProject.technicalValidationStatus
                )}`}
              >
                {normalizedProject.technicalValidationStatus || "Sin solicitar"}
              </span>
              {normalizedProject.technicalComplexity && (
                <div className="text-sm text-gray-600">
                  Complejidad: <span className="font-medium">{normalizedProject.technicalComplexity}</span>
                </div>
              )}
              {normalizedProject.technicalSubArea && (
                <div className="text-sm text-gray-600">
                  Área técnica: <span className="font-medium">{normalizedProject.technicalSubArea}</span>
                </div>
              )}
            </div>
          </div>

          {/* Paso actual */}
          {normalizedProject.currentValidationStep && (
            <div className="border border-gray-200 rounded p-3">
              <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
                Paso actual
              </div>
              <div className="text-sm font-medium text-blue-700">{normalizedProject.currentValidationStep}</div>
            </div>
          )}

          {/* Ronda de validación */}
          <div className="border border-gray-200 rounded p-3">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              Ronda de validación
            </div>
            <div className="text-sm font-medium">{normalizedProject.validationRound || 0}</div>
          </div>

          {/* Última observación */}
          {normalizedProject.lastObservationComment && (
            <div className="border border-orange-200 bg-orange-50 rounded p-3">
              <div className="text-xs font-semibold text-orange-900 uppercase mb-2">
                Última observación
              </div>
              <div className="text-sm text-orange-900">{normalizedProject.lastObservationComment}</div>
              {normalizedProject.lastObservationSource && (
                <div className="text-xs text-orange-700 mt-2">
                  Fuente: {normalizedProject.lastObservationSource}
                </div>
              )}
              {normalizedProject.lastObservationAt && (
                <div className="text-xs text-orange-700">
                  Fecha:{" "}
                  {new Date(normalizedProject.lastObservationAt).toLocaleDateString("es-AR")}
                </div>
              )}
            </div>
          )}

          {/* Fecha de validación */}
          {normalizedProject.lastValidatedAt && (
            <div className="border border-gray-200 rounded p-3">
              <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
                Última validación
              </div>
              <div className="text-sm text-gray-600">
                {new Date(normalizedProject.lastValidatedAt).toLocaleDateString("es-AR")}
              </div>
            </div>
          )}
        </div>
      )}
    </FormCard>
  );
}
