import { useMemo } from "react";
import { Clock } from "lucide-react";
import type { ProjectStatusHistory } from "../../../shared/data/slaStorage";
import type { ValidationHistoryRecord } from "../../../shared/data/validationHistoryStorage";
import { getProjectValidationHistory, getValidationEventLabel, getValidationEventColor } from "../../../shared/data/validationHistoryStorage";

interface UnifiedProjectHistoryProps {
  projectCode: string;
  statusHistory: ProjectStatusHistory[];
}

type UnifiedEvent = {
  id: string;
  timestamp: string;
  type: "status_change" | "validation_event";
  statusHistory?: ProjectStatusHistory;
  validationEvent?: ValidationHistoryRecord;
};

export default function UnifiedProjectHistory({ projectCode, statusHistory }: UnifiedProjectHistoryProps) {
  const validationHistory = useMemo(() => {
    return getProjectValidationHistory(projectCode);
  }, [projectCode]);

  const unifiedEvents = useMemo(() => {
    const events: UnifiedEvent[] = [];

    // Add status change events
    statusHistory.forEach((status) => {
      events.push({
        id: status.id,
        timestamp: status.changedAt,
        type: "status_change",
        statusHistory: status,
      });
    });

    // Add validation events
    validationHistory.forEach((validation) => {
      events.push({
        id: validation.id,
        timestamp: validation.timestamp,
        type: "validation_event",
        validationEvent: validation,
      });
    });

    // Sort by timestamp descending (newest first)
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [statusHistory, validationHistory]);

  if (unifiedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-sm">
        No hay historial registrado para este proyecto
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

        {/* Eventos unificados */}
        <div className="space-y-4">
          {unifiedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Punto en la timeline */}
              <div className={`absolute left-0 top-2 w-9 h-9 rounded-full border-2 flex items-center justify-center ${
                event.type === "status_change"
                  ? "bg-white border-blue-300"
                  : "bg-white border-slate-300"
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  event.type === "status_change" ? "bg-blue-400" : "bg-slate-400"
                }`} />
              </div>

              {/* Tarjeta del evento */}
              {event.type === "status_change" && event.statusHistory ? (
                <div className="p-4 rounded-lg border-l-4 border-blue-200 bg-blue-50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">Cambio de Estado</div>
                      <div className="text-xs text-slate-600 mt-1">
                        {new Date(event.timestamp).toLocaleString("es-AR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
                        Más reciente
                      </div>
                    )}
                  </div>

                  <div className="text-sm space-y-2 mt-3">
                    <div>
                      <span className="text-slate-600">Estado:</span>
                      <span className="ml-2 font-mono">
                        {event.statusHistory.fromStatus} → {event.statusHistory.toStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Responsable:</span>
                      <span className="ml-2 font-medium">{event.statusHistory.responsibleArea}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Realizado por:</span>
                      <span className="ml-2">{event.statusHistory.changedBy}</span>
                    </div>
                    {event.statusHistory.comment && (
                      <div className="mt-3 p-3 bg-blue-100 rounded text-sm border-l-2 border-blue-400">
                        <div className="text-xs font-semibold text-blue-700 mb-1">Comentario:</div>
                        <div className="text-blue-900">{event.statusHistory.comment}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : event.type === "validation_event" && event.validationEvent ? (
                <div className={`p-4 rounded-lg border-l-4 ${getValidationEventColor(event.validationEvent.eventType)} space-y-2`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">
                        {getValidationEventLabel(event.validationEvent.eventType)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(event.timestamp).toLocaleString("es-AR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                        Más reciente
                      </div>
                    )}
                  </div>

                  <div className="text-sm space-y-1 mt-3">
                    {event.validationEvent.fromStatus && event.validationEvent.toStatus && (
                      <div>
                        <span className="text-slate-600">Estado:</span>
                        <span className="ml-2 font-mono">
                          {event.validationEvent.fromStatus} → {event.validationEvent.toStatus}
                        </span>
                      </div>
                    )}

                    {event.validationEvent.fromValidationStep && event.validationEvent.toValidationStep && (
                      <div>
                        <span className="text-slate-600">Paso:</span>
                        <span className="ml-2 font-mono">
                          {event.validationEvent.fromValidationStep} → {event.validationEvent.toValidationStep}
                        </span>
                      </div>
                    )}

                    {event.validationEvent.graphicArtsStatus && (
                      <div>
                        <span className="text-slate-600">AG:</span>
                        <span className="ml-2 font-mono">{event.validationEvent.graphicArtsStatus}</span>
                      </div>
                    )}

                    {event.validationEvent.technicalStatus && (
                      <div>
                        <span className="text-slate-600">R&D:</span>
                        <span className="ml-2 font-mono">{event.validationEvent.technicalStatus}</span>
                        {event.validationEvent.technicalSubArea && (
                          <span className="ml-1 text-slate-500">({event.validationEvent.technicalSubArea})</span>
                        )}
                      </div>
                    )}

                    {event.validationEvent.actedByRole && (
                      <div>
                        <span className="text-slate-600">Área:</span>
                        <span className="ml-2 font-medium">{event.validationEvent.actedByRole}</span>
                      </div>
                    )}

                    {event.validationEvent.actedBy && (
                      <div>
                        <span className="text-slate-600">Realizado por:</span>
                        <span className="ml-2">{event.validationEvent.actedBy}</span>
                      </div>
                    )}

                    {event.validationEvent.validationRound && (
                      <div>
                        <span className="text-slate-600">Ronda:</span>
                        <span className="ml-2 font-mono">#{event.validationEvent.validationRound}</span>
                      </div>
                    )}

                    {event.validationEvent.isAutomatic && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
                        ⚡ Aprobación automática
                      </div>
                    )}
                  </div>

                  {event.validationEvent.comment && !event.validationEvent.comment.includes("✅") && (
                    <div className="mt-3 p-3 bg-slate-100 rounded text-sm border-l-2 border-slate-400">
                      <div className="text-xs font-semibold text-slate-600 mb-1">Comentario:</div>
                      <div className="text-slate-700">{event.validationEvent.comment}</div>
                    </div>
                  )}

                  {event.validationEvent.observation && (
                    <div className="mt-3 p-3 bg-orange-100 rounded text-sm border-l-2 border-orange-400">
                      <div className="text-xs font-semibold text-orange-600 mb-1">⚠️ Observación:</div>
                      <div className="text-orange-700">{event.validationEvent.observation}</div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
