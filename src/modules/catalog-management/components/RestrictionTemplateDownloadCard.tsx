import { useRef, useState } from "react";
import FormCard from "../../../shared/components/forms/FormCard";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import {
  downloadDimensionRestrictionsTemplate,
  downloadValidationRestrictionsTemplate,
  downloadAllRestrictionsTemplate,
  uploadAndValidateDimensionTemplate,
  applyRestrictionChanges,
} from "../services/restrictionExportService";
import { getValidationStatusColor } from "../utils/catalogRestrictionValidators";
import RestrictionChangePreviewModal from "./RestrictionChangePreviewModal";
import type { ValidationStatus, RestrictionValidationSummary } from "../types/catalogRestriction.types";

interface RestrictionTemplateDownloadCardProps {
  restrictionType: "dimension" | "validation" | "all";
  uploadStatus: ValidationStatus;
  uploadedFileName: string;
  reason: string;
  reasonError?: string;
  onFileUpload: (file: File) => void;
  onValidate: () => void;
  onReasonChange: (value: string) => void;
  isValidating: boolean;
  isApplying: boolean;
  submitAttempted: boolean;
  validationSummary?: RestrictionValidationSummary | null;
  onApplyChanges?: () => void;
}

export default function RestrictionTemplateDownloadCard({
  restrictionType,
  uploadStatus,
  uploadedFileName,
  reason,
  reasonError,
  onFileUpload,
  onValidate,
  onReasonChange,
  isValidating,
  isApplying,
  submitAttempted,
  validationSummary,
  onApplyChanges,
}: RestrictionTemplateDownloadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (restrictionType === "dimension") {
        await downloadDimensionRestrictionsTemplate();
      } else if (restrictionType === "validation") {
        await downloadValidationRestrictionsTemplate();
      } else {
        await downloadAllRestrictionsTemplate();
      }
    } catch (error) {
      console.error("Error descargando plantilla:", error);
      alert("Error al descargar la plantilla");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const statusLabels: Record<ValidationStatus, string> = {
    pending: "Pendiente",
    validating: "Validando",
    with_observations: "Con observaciones",
    valid: "Válido",
    applied: "Aplicado",
  };

  const getRestrictionTypeLabel = () => {
    switch (restrictionType) {
      case "dimension":
        return "Restricciones de Dimensión";
      case "validation":
        return "Restricciones de Validación";
      case "all":
        return "Todas las Restricciones";
      default:
        return "Restricciones";
    }
  };

  return (
    <>
      {showPreview && validationSummary && (
        <RestrictionChangePreviewModal
          isOpen={showPreview}
          summary={validationSummary}
          onClose={() => setShowPreview(false)}
          onApply={onApplyChanges}
          isApplying={isApplying}
          reason={reason}
        />
      )}

      <FormCard title="Plantilla de Restricciones" icon="📊" color="#7C3AED">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-3">
              Descarga la plantilla de {getRestrictionTypeLabel().toLowerCase()}, actualiza los valores necesarios y vuelve a cargar el archivo para que ODISEO detecte los cambios automáticamente.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-primary bg-white px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Descargando...
                  </>
                ) : (
                  <>↓ Descargar plantilla</>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Archivo cargado
              </p>
              <p className="text-sm text-slate-700 font-medium">
                {uploadedFileName || "Ningún archivo seleccionado"}
              </p>
            </div>

            {uploadStatus && uploadStatus !== "pending" && (
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${getValidationStatusColor(uploadStatus)}`}
              >
                {uploadStatus === "validating" && (
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {statusLabels[uploadStatus]}
              </div>
            )}

            <div>
              <label className="block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                  📁 Seleccionar archivo Excel
                </span>
              </label>
            </div>

            {uploadStatus === "valid" && validationSummary && validationSummary.modifiedRecords > 0 && (
              <div className="border-l-4 border-blue-400 bg-blue-50 p-3 rounded">
                <p className="text-sm font-semibold text-blue-900">
                  ✓ {validationSummary.modifiedRecords} cambios detectados
                </p>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold mt-2"
                >
                  Ver cambios →
                </button>
              </div>
            )}

            {uploadStatus === "with_observations" && (
              <div className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded">
                <p className="text-sm font-semibold text-amber-900">
                  ⚠️ Sin cambios detectados en la plantilla
                </p>
              </div>
            )}

            {submitAttempted && uploadStatus === "pending" && (
              <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
                <p className="text-sm font-semibold text-red-900">
                  ✗ Debes cargar un archivo y validarlo primero
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onValidate}
                disabled={!uploadedFileName || isValidating}
                className="flex-1 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? "Validando..." : "Validar"}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <FormTextarea
              label="Motivo del cambio"
              value={reason}
              onChange={onReasonChange}
              placeholder="Describe brevemente por qué se realizan estos cambios en las restricciones..."
              rows={3}
              error={reasonError}
              required
            />
            <p className="text-xs text-slate-500 mt-2">
              Este motivo se registrará en la bitácora de cambios
            </p>
          </div>
        </div>
      </FormCard>
    </>
  );
}
