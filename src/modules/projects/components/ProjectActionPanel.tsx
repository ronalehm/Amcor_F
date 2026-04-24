import { useMemo } from "react";
import Button from "../../../shared/components/ui/Button";

type ProjectActionPanelProps = {
  projectCode: string;
  stageCode: string;
  isCompleted: boolean;
  openObservationsCount: number;
  hasBlockingObservations: boolean;
  onAdvance: () => void;
  onObserve: () => void;
  onExportExcel: () => void;
  onSendOffer: () => void;
  onRequestCreditEvaluation: () => void;
  onApproveManufacturing: () => void;
  onApproveSample: () => void;
  onReject: () => void;
};

export default function ProjectActionPanel({
  stageCode,
  isCompleted,
  openObservationsCount,
  hasBlockingObservations,
  onAdvance,
  onObserve,
  onExportExcel,
  onSendOffer,
  onRequestCreditEvaluation,
  onApproveManufacturing,
  onApproveSample,
  onReject,
}: ProjectActionPanelProps) {

  const actionButtons = useMemo(() => {
    if (isCompleted) {
      return (
        <div className="text-center text-sm font-semibold text-slate-500">
          El tracking del Portal para este proyecto ha concluido.
        </div>
      );
    }

    switch (stageCode) {
      case "P1":
        return (
          <>
            <Button variant="primary" onClick={onAdvance}>
              Solicitar validación
            </Button>
          </>
        );
      case "P2":
      case "P3":
        return (
          <>
            <Button
              variant="outline"
              onClick={onObserve}
            >
              Registrar Observación
            </Button>
            <Button
              variant="primary"
              onClick={onAdvance}
              disabled={hasBlockingObservations}
            >
              Aprobar validación
            </Button>
          </>
        );
      case "P4":
        return (
          <>
            <Button variant="outline" onClick={onExportExcel}>
              Exportar ficha Excel
            </Button>
            <Button variant="primary" onClick={onSendOffer}>
              Enviar Oferta y Avanzar
            </Button>
          </>
        );
      case "P5":
        return (
          <>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" onClick={onRequestCreditEvaluation}>
                Evaluación Crediticia
              </Button>
              <Button variant="danger" onClick={onReject}>
                Desestimar oportunidad
              </Button>
              <Button variant="success" onClick={onApproveSample}>
                Aprobar desarrollo de muestra
              </Button>
              <Button variant="primary" onClick={onApproveManufacturing}>
                Aprobar pase a fabricación
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  }, [
    stageCode,
    isCompleted,
    hasBlockingObservations,
    onAdvance,
    onObserve,
    onExportExcel,
    onSendOffer,
    onRequestCreditEvaluation,
    onApproveManufacturing,
    onApproveSample,
    onReject,
  ]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-800">
        Acciones de Etapa ({stageCode})
      </h3>

      {hasBlockingObservations && !isCompleted && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-100">
          <strong>Atención:</strong> Existen {openObservationsCount} observación(es) bloqueante(s) abierta(s). 
          No se puede aprobar la etapa hasta resolverlas.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {actionButtons}
      </div>
    </div>
  );
}
