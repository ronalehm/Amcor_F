import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Button from "../../../shared/components/ui/Button";

interface RestrictionUploadConfirmationModalProps {
  isOpen: boolean;
  restrictionName: string;
  restrictionCode: string;
  changes: {
    ancho?: { min: number; max: number };
    largo?: { min: number; max: number };
    anchoFuelle?: { min: number; max: number };
    perimetro?: { min: number; max: number };
    repeticion?: { min: number; max: number };
    designAreaWidth?: { min: number; max: number };
    designAreaHeight?: { min: number; max: number };
  };
  onConfirmed?: (reason: string) => void;
  onCancelled?: () => void;
}

export function RestrictionUploadConfirmationModal({
  isOpen,
  restrictionName,
  restrictionCode,
  changes,
  onConfirmed,
  onCancelled,
}: RestrictionUploadConfirmationModalProps) {
  const [step, setStep] = useState<"review" | "reason">("review");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleReview = () => {
    setStep("reason");
  };

  const handleConfirm = () => {
    if (onConfirmed) {
      onConfirmed(reason);
    }
    setStep("review");
    setReason("");
  };

  const handleCancel = () => {
    setStep("review");
    setReason("");
    if (onCancelled) {
      onCancelled();
    }
  };

  const changeCount = Object.keys(changes).filter(
    (key) => changes[key as keyof typeof changes]
  ).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Confirmar Cambios en Restricción</h2>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "review" && (
            <div className="space-y-6">
              {/* Restricción Info */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Restricción
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {restrictionCode} - {restrictionName}
                </p>
              </div>

              <p className="text-slate-700">
                Revisa el resumen de cambios que se aplicarán a esta restricción:
              </p>

              {/* Changes Summary */}
              <div className="space-y-3">
                {changes.ancho && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Ancho: {changes.ancho.min} - {changes.ancho.max}
                    </p>
                  </div>
                )}
                {changes.largo && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Largo: {changes.largo.min} - {changes.largo.max}
                    </p>
                  </div>
                )}
                {changes.anchoFuelle && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Fuelle: {changes.anchoFuelle.min} - {changes.anchoFuelle.max}
                    </p>
                  </div>
                )}
                {changes.perimetro && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Perímetro: {changes.perimetro.min} - {changes.perimetro.max}
                    </p>
                  </div>
                )}
                {changes.repeticion && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Repetición: {changes.repeticion.min} - {changes.repeticion.max}
                    </p>
                  </div>
                )}
                {changes.designAreaWidth && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Área Diseño Ancho: {changes.designAreaWidth.min} - {changes.designAreaWidth.max}
                    </p>
                  </div>
                )}
                {changes.designAreaHeight && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Área Diseño Alto: {changes.designAreaHeight.min} - {changes.designAreaHeight.max}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  Total de cambios: {changeCount}
                </p>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
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
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Motivo de la actualización (requerido)
                </label>
                <textarea
                  autoFocus
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Corrección de dimensiones, ajuste por normas, actualización de especificaciones, etc."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  rows={4}
                />
                <p className="text-xs text-slate-600 mt-2">
                  Este motivo se registrará en la bitácora para auditoría y trazabilidad.
                </p>
              </div>

              {/* Resumen */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm font-semibold text-slate-900 mb-3">
                  Cambios a aplicar:
                </p>
                <ul className="text-sm text-slate-700 space-y-1">
                  {changes.ancho && <li>• Ancho: {changes.ancho.min} - {changes.ancho.max}</li>}
                  {changes.largo && <li>• Largo: {changes.largo.min} - {changes.largo.max}</li>}
                  {changes.anchoFuelle && <li>• Fuelle: {changes.anchoFuelle.min} - {changes.anchoFuelle.max}</li>}
                  {changes.perimetro && <li>• Perímetro: {changes.perimetro.min} - {changes.perimetro.max}</li>}
                  {changes.repeticion && <li>• Repetición: {changes.repeticion.min} - {changes.repeticion.max}</li>}
                  {changes.designAreaWidth && <li>• Área Diseño Ancho: {changes.designAreaWidth.min} - {changes.designAreaWidth.max}</li>}
                  {changes.designAreaHeight && <li>• Área Diseño Alto: {changes.designAreaHeight.min} - {changes.designAreaHeight.max}</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            Paso {step === "review" ? "1" : "2"} de 2
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline">
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
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!reason.trim()}
                  className={!reason.trim() ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Confirmar Cambios
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
