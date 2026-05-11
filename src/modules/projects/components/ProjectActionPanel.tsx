import { useMemo } from "react";
import type { ProjectStatus } from "../../../shared/data/projectStorage";
import Button from "../../../shared/components/ui/Button";

type ProjectActionPanelProps = {
  projectCode: string;
  projectStatus: ProjectStatus;
  stageCode?: string;
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
  onRequestValidation?: () => void;
};

export default function ProjectActionPanel({
  projectStatus,
  stageCode = "P0",
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
  onRequestValidation,
}: ProjectActionPanelProps) {

  const actionButtons = useMemo(() => {
    if (isCompleted) {
      return (
        <div className="text-center text-sm font-semibold text-slate-500">
          El tracking del Portal para este proyecto ha concluido.
        </div>
      );
    }

    switch (projectStatus) {
      case "Registrado":
      case "En Preparación":
        return (
          <>
            <Button variant="primary" onClick={onRequestValidation || onAdvance}>
              Solicitar validación
            </Button>
          </>
        );
      case "Ficha Completa":
        return (
          <>
            <Button variant="primary" onClick={onRequestValidation || onAdvance}>
              Solicitar validación
            </Button>
          </>
        );
      case "En validación":
        return (
          <>
            <Button variant="outline" onClick={onObserve}>
              Ver Validaciones
            </Button>
          </>
        );
      case "Observado":
        return (
          <>
            <Button variant="outline" onClick={onObserve}>
              Ver Observaciones
            </Button>
            <Button variant="primary" onClick={onAdvance}>
              Corregir Ficha
            </Button>
          </>
        );
      case "Validado":
        return (
          <>
            <Button variant="primary" onClick={onAdvance}>
              Generar Producto Preliminar
            </Button>
          </>
        );
      case "En Cotización":
        return (
          <>
            <Button variant="outline" onClick={onExportExcel}>
              Ver Productos
            </Button>
            <Button variant="primary" onClick={onSendOffer}>
              Exportar Excel
            </Button>
          </>
        );
      case "Cotización Completa":
        return (
          <>
            <Button variant="primary" onClick={onAdvance}>
              Registrar Aprobación Cliente
            </Button>
          </>
        );
      case "Aprobado por Cliente":
        return (
          <>
            <Button variant="outline" onClick={onSendOffer}>
              Ver Resumen Aprobación
            </Button>
          </>
        );
      case "Desestimado":
        return (
          <>
            <Button variant="outline" onClick={onObserve}>
              Ver Motivo Cierre
            </Button>
          </>
        );
      default:
        return null;
    }
  }, [
    projectStatus,
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
    onRequestValidation,
  ]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-800">
        Acciones del Proyecto ({projectStatus})
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
