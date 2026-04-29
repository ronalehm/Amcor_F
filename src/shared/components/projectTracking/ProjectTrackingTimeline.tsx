import { type ProjectStatusHistory } from "../../../shared/data/slaStorage";
import { History } from "lucide-react";

interface ProjectTrackingTimelineProps {
  history: ProjectStatusHistory[];
}

export default function ProjectTrackingTimeline({ history }: ProjectTrackingTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-sm text-slate-500 text-center shadow-sm mt-6">
        No hay historial registrado para este proyecto.
      </div>
    );
  }

  // Ordenar el historial del más reciente al más antiguo para visualización cronológica inversa
  const sortedHistory = [...history].sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <History size={16} className="text-brand-primary" />
        <h3 className="font-bold text-slate-800 text-sm uppercase">Historial de Cambios</h3>
      </div>
      
      <div className="p-6">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          {sortedHistory.map((item, index) => (
            <div key={item.id} className="relative pl-6">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                index === 0 ? 'bg-brand-primary' : 'bg-slate-300'
              }`} />
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                <div className="text-sm font-bold text-brand-primary">
                  Transición a: {item.toStatus}
                </div>
                <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block self-start">
                  {new Date(item.changedAt).toLocaleString()}
                </div>
              </div>
              
              <div className="text-xs text-slate-600 mb-2">
                <span className="font-semibold text-slate-700">Por:</span> {item.changedBy} 
                <span className="mx-1 text-slate-300">•</span> 
                <span className="font-semibold text-slate-700">Área:</span> {item.responsibleArea}
              </div>

              {item.comment && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 italic">
                  "{item.comment}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
