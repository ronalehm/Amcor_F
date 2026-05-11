import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ProjectStatusHistory } from "../../../shared/data/slaStorage";
import FormCard from "../../../shared/components/forms/FormCard";

interface ProjectChangeHistoryProps {
  history: ProjectStatusHistory[];
}

export default function ProjectChangeHistory({ history }: ProjectChangeHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!history || history.length === 0) {
    return (
      <FormCard title="Historial de Cambios" icon="📋" color="#2c3e50">
        <div className="text-center py-4 text-gray-500 text-sm">
          No hay cambios registrados
        </div>
      </FormCard>
    );
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  const getStatusColor = (status?: string): string => {
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

  const getAreaColor = (area?: string): string => {
    if (!area) return "text-gray-600";
    switch (area) {
      case "Comercial":
        return "text-blue-600";
      case "Artes Gráficas":
        return "text-purple-600";
      case "R&D":
        return "text-green-600";
      case "Commercial Finance":
        return "text-orange-600";
      case "Sistema Integral":
        return "text-indigo-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <FormCard title="Historial de Cambios" icon="📋" color="#2c3e50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">
            {history.length} cambio{history.length !== 1 ? "s" : ""} registrado{history.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-gray-500">
            Últimos: {new Date(sortedHistory[0].changedAt).toLocaleDateString("es-AR")}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
          {sortedHistory.map((entry, idx) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.fromStatus)}`}>
                    {entry.fromStatus || "—"}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.toStatus)}`}>
                    {entry.toStatus || "—"}
                  </span>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {new Date(entry.changedAt).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                  {new Date(entry.changedAt).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Responsable: </span>
                  <span className={`${getAreaColor(entry.responsibleArea)}`}>
                    {entry.responsibleArea}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Realizado por: </span>
                  <span className="text-gray-700">{entry.changedBy || "—"}</span>
                </div>
                {entry.comment && (
                  <div className="bg-gray-50 p-2 rounded border-l-2 border-gray-300 text-sm mt-2">
                    <span className="font-medium">Comentario: </span>
                    <span className="text-gray-700">{entry.comment}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </FormCard>
  );
}
