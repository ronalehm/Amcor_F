import { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import {
  processUploadChanges,
  confirmUpload,
  type UploadConfirmationData,
  type UploadResult,
} from "../services/catalogTemplateUploadService";

interface CatalogUploadConfirmationModalProps {
  previewData: {
    newRecords: number;
    modifiedRecords: number;
    inactivatedRecords: number;
    blockedRecords: number;
  };
  uploadedData: any[];
  catalogCode?: string;
  onConfirmed?: (result: UploadResult) => void;
  onCancelled?: () => void;
  isOpen: boolean;
}

export function CatalogUploadConfirmationModal({
  previewData,
  uploadedData,
  catalogCode,
  onConfirmed,
  onCancelled,
  isOpen,
}: CatalogUploadConfirmationModalProps) {
  const [step, setStep] = useState<"review" | "reason">("review");
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocallyOpen, setIsLocallyOpen] = useState(true);

  if (!isOpen || !isLocallyOpen) return null;

  const handleReview = () => {
    setStep("reason");
  };

  const handleReason = async () => {
    setIsProcessing(true);
    try {
      // Procesar cambios
      const confirmation = await processUploadChanges(
        uploadedData,
        reason || undefined,
        "ODISEO_SYSTEM",
        catalogCode
      );

      // Confirmar cambios
      const uploadResult = await confirmUpload(confirmation);

      // Cerrar este modal inmediatamente
      setIsLocallyOpen(false);
      setStep("review");
      setReason("");

      // Notificar al componente padre con el resultado después de cerrar
      setTimeout(() => {
        if (onConfirmed) {
          onConfirmed(uploadResult);
        }
      }, 50);
    } catch (error) {
      const errorResult = {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
        errors: [
          {
            code: "CONFIRMATION_ERROR",
            message: error instanceof Error ? error.message : "Error desconocido",
          },
        ],
      };

      // Cerrar este modal
      setIsLocallyOpen(false);
      setStep("review");
      setReason("");

      // Notificar al componente padre con el error después de cerrar
      setTimeout(() => {
        if (onConfirmed) {
          onConfirmed(errorResult as any);
        }
      }, 50);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setStep("review");
    setReason("");
    setIsLocallyOpen(false);
    if (onCancelled) {
      onCancelled();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Confirmar Cambios</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "review" && (
            <div className="space-y-6">
              <p className="text-gray-600">
                Revisa el resumen de cambios que se aplicarán a los catálogos:
              </p>

              {/* Summary Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-600 font-semibold">
                    NUEVOS REGISTROS
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {previewData.newRecords}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                  <p className="text-xs text-purple-600 font-semibold">
                    MODIFICADOS
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {previewData.modifiedRecords}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-xs text-orange-600 font-semibold">
                    INACTIVADOS
                  </p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {previewData.inactivatedRecords}
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-600 font-semibold">BLOQUEADOS</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">
                    {previewData.blockedRecords}
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700 font-semibold">
                  Total de cambios:
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {previewData.newRecords +
                    previewData.modifiedRecords +
                    previewData.inactivatedRecords +
                    previewData.blockedRecords}{" "}
                  cambios
                </p>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">
                    Acción irreversible
                  </p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Una vez aplicados, estos cambios se registrarán en la bitácora.
                    Asegúrate de revisar correctamente antes de confirmar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === "reason" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Motivo de la carga (opcional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Actualización semestral de catálogos, corrección de valores, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Este motivo se registrará en la bitácora para auditoría.
                </p>
              </div>

              {/* Resumen */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Resumen de cambios:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Nuevos: {previewData.newRecords}</li>
                  <li>• Modificados: {previewData.modifiedRecords}</li>
                  <li>• Inactivados: {previewData.inactivatedRecords}</li>
                  <li>• Bloqueados: {previewData.blockedRecords}</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Paso {step === "review" ? "1" : "2"} de 2
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" disabled={isProcessing}>
              Cancelar
            </Button>

            {step === "review" && (
              <Button onClick={handleReview} variant="outline">
                Continuar
              </Button>
            )}

            {step === "reason" && (
              <>
                <Button
                  onClick={() => setStep("review")}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleReason}
                  variant="outline"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : "Confirmar Cambios"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
