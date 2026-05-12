import { useMemo } from "react";
import { getProjectValidationHistory, getValidationEventLabel, getValidationEventColor } from "../../../shared/data/validationHistoryStorage";
import type { ValidationHistoryRecord } from "../../../shared/data/validationHistoryStorage";

interface ValidationHistoryTimelineProps {
  projectCode: string;
}

export default function ValidationHistoryTimeline({ projectCode }: ValidationHistoryTimelineProps) {
  const history = useMemo(() => {
    return getProjectValidationHistory(projectCode);
  }, [projectCode]);

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500 text-sm">
        No hay eventos registrados para este proyecto
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

        {/* Eventos */}
        <div className="space-y-4">
          {history.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Punto en la timeline */}
              <div className="absolute left-0 top-2 w-9 h-9 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
              </div>

              {/* Tarjeta del evento */}
              <div className={`p-4 rounded-lg border-l-4 ${getValidationEventColor(event.eventType)} space-y-2`}>
                {/* Encabezado */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">
                      {getValidationEventLabel(event.eventType)}
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
                  {index === history.length - 1 && (
                    <div className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                      Más reciente
                    </div>
                  )}
                </div>

                {/* Detalles del evento */}
                <div className="text-sm space-y-1 mt-3">
                  {event.fromStatus && event.toStatus && (
                    <div>
                      <span className="text-slate-600">Estado:</span>
                      <span className="ml-2 font-mono">
                        {event.fromStatus} → {event.toStatus}
                      </span>
                    </div>
                  )}

                  {event.fromValidationStep && event.toValidationStep && (
                    <div>
                      <span className="text-slate-600">Paso:</span>
                      <span className="ml-2 font-mono">
                        {event.fromValidationStep} → {event.toValidationStep}
                      </span>
                    </div>
                  )}

                  {event.graphicArtsStatus && (
                    <div>
                      <span className="text-slate-600">AG:</span>
                      <span className="ml-2 font-mono">{event.graphicArtsStatus}</span>
                    </div>
                  )}

                  {event.technicalStatus && (
                    <div>
                      <span className="text-slate-600">R&D:</span>
                      <span className="ml-2 font-mono">{event.technicalStatus}</span>
                      {event.technicalSubArea && (
                        <span className="ml-1 text-slate-500">({event.technicalSubArea})</span>
                      )}
                    </div>
                  )}

                  {event.validationRound && (
                    <div>
                      <span className="text-slate-600">Ronda:</span>
                      <span className="ml-2 font-mono">#{event.validationRound}</span>
                    </div>
                  )}

                  {event.isAutomatic && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
                      ⚡ Aprobación automática
                    </div>
                  )}
                </div>

                {/* Comentario */}
                {event.comment && !event.comment.includes("✅") && (
                  <div className="mt-3 p-3 bg-slate-100 rounded text-sm border-l-2 border-slate-400">
                    <div className="text-xs font-semibold text-slate-600 mb-1">Comentario:</div>
                    <div className="text-slate-700">{event.comment}</div>
                  </div>
                )}

                {/* Observación */}
                {event.observation && (
                  <div className="mt-3 p-3 bg-orange-100 rounded text-sm border-l-2 border-orange-400">
                    <div className="text-xs font-semibold text-orange-600 mb-1">⚠️ Observación:</div>
                    <div className="text-orange-700">{event.observation}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen final */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-slate-900">{history.length}</div>
            <div className="text-xs text-slate-600">Eventos registrados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {history.filter((e) => e.eventType.includes("approved")).length}
            </div>
            <div className="text-xs text-slate-600">Aprobaciones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {history.filter((e) => e.eventType.includes("observed")).length}
            </div>
            <div className="text-xs text-slate-600">Observaciones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {history[history.length - 1]?.validationRound || 1}
            </div>
            <div className="text-xs text-slate-600">Ronda actual</div>
          </div>
        </div>
      </div>
    </div>
  );
}
