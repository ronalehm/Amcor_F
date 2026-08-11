import { CheckCircle, AlertCircle, X } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import type { UploadResult } from "../services/catalogTemplateUploadService";

interface CatalogUploadResultModalProps {
  isOpen: boolean;
  result: UploadResult | null;
  onClose: () => void;
}

export function CatalogUploadResultModal({
  isOpen,
  result,
  onClose,
}: CatalogUploadResultModalProps) {
  if (!isOpen || !result) return null;

  const isSuccess = result.success;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden ${isSuccess ? "border-2 border-green-500" : "border-2 border-red-500"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            )}
            <h2 className={`text-2xl font-bold ${isSuccess ? "text-green-900" : "text-red-900"}`}>
              {isSuccess ? "¡Cambios Guardados!" : "Error"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <p className={`text-lg font-semibold ${isSuccess ? "text-green-900" : "text-red-900"}`}>
              {result.message}
            </p>
          </div>

          {isSuccess && result.confirmation && (
            <div className="space-y-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900">Resumen de cambios aplicados:</h3>

              <div className="grid grid-cols-2 gap-3">
                {result.confirmation.summary.newRecords > 0 && (
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-xs text-green-600 font-semibold">Nuevos</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {result.confirmation.summary.newRecords}
                    </p>
                  </div>
                )}

                {result.confirmation.summary.modifiedRecords > 0 && (
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold">Modificados</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {result.confirmation.summary.modifiedRecords}
                    </p>
                  </div>
                )}

                {result.confirmation.summary.inactivatedRecords > 0 && (
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <p className="text-xs text-orange-600 font-semibold">Inactivados</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">
                      {result.confirmation.summary.inactivatedRecords}
                    </p>
                  </div>
                )}

                {result.confirmation.summary.blockedRecords > 0 && (
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="text-xs text-red-600 font-semibold">Bloqueados</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      {result.confirmation.summary.blockedRecords}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Total:</strong> {result.confirmation.summary.totalChanges} cambios registrados
                </p>
                <p className="text-xs text-green-700 mt-2">
                  <strong>Fecha:</strong> {new Date(result.confirmation.confirmedAt).toLocaleString("es-ES")}
                </p>
                {result.confirmation.reason && (
                  <p className="text-xs text-green-700 mt-2">
                    <strong>Motivo:</strong> {result.confirmation.reason}
                  </p>
                )}
              </div>
            </div>
          )}

          {!isSuccess && result.errors && result.errors.length > 0 && (
            <div className="space-y-2 bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-900">Errores encontrados:</h3>
              <ul className="text-sm text-red-800 space-y-1">
                {result.errors.map((error, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>[{error.code}]</strong> {error.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${isSuccess ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <Button onClick={onClose} variant="default" className="w-full">
            {isSuccess ? "Cerrar" : "Reintentar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
