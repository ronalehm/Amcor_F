import { useState } from "react";
import { type ObservationRecord, saveProjectObservation, closeProjectObservation } from "../../../shared/data/observationStorage";
import Button from "../ui/Button";

interface ProjectObservationPanelProps {
  projectCode: string;
  observations: ObservationRecord[];
  onUpdate: () => void;
  isReadOnly: boolean;
}

export default function ProjectObservationPanel({ projectCode, observations, onUpdate, isReadOnly }: ProjectObservationPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [isBlocking, setIsBlocking] = useState(true);

  const openObservations = observations.filter(o => o.status === "Abierta");
  const closedObservations = observations.filter(o => o.status === "Cerrada");

  const handleSave = () => {
    if (!desc.trim()) return;
    saveProjectObservation({
      projectCode,
      area: "Área actual", // In real app, from user session Context
      observationType: isBlocking ? "Bloqueante" : "Informativa",
      description: desc,
      isBlocking,
      createdBy: "Usuario Actual"
    });
    setDesc("");
    setShowForm(false);
    onUpdate();
  };

  const handleClose = (id: string) => {
    closeProjectObservation(id, "Usuario Actual");
    onUpdate();
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mt-6">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm uppercase">
          Observaciones
          {openObservations.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
              {openObservations.length} abiertas
            </span>
          )}
        </h3>
        {!isReadOnly && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>+ Registrar</Button>
        )}
      </div>

      <div className="p-5">
        {showForm && (
          <div className="bg-amber-50 rounded-lg p-4 mb-5 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-2 text-sm">Nueva Observación</h4>
            <textarea
              className="w-full p-3 border border-amber-300 rounded text-sm mb-3 bg-white"
              rows={3}
              placeholder="Describa la observación detalladamente..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                id="isBlocking" 
                checked={isBlocking} 
                onChange={e => setIsBlocking(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded border-amber-300"
              />
              <label htmlFor="isBlocking" className="text-sm font-semibold text-amber-900">
                Observación Bloqueante (Impide avanzar la etapa)
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button variant="warning" size="sm" onClick={handleSave}>Guardar Observación</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {openObservations.map(obs => (
            <div key={obs.id} className={`p-4 rounded-lg border ${obs.isBlocking ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${obs.isBlocking ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {obs.isBlocking ? "Bloqueante" : "Informativa"}
                  </span>
                  <span className="text-xs text-slate-500 ml-2 font-semibold">{obs.area} - {new Date(obs.createdAt).toLocaleString()}</span>
                </div>
                {!isReadOnly && (
                  <Button variant="outline" size="sm" onClick={() => handleClose(obs.id)}>
                    Resolver
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-800">{obs.description}</p>
              <div className="text-xs text-slate-500 mt-2 font-medium">Registrado por: {obs.createdBy}</div>
            </div>
          ))}

          {closedObservations.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Observaciones Resueltas</h4>
              <div className="space-y-3">
                {closedObservations.map(obs => (
                  <div key={obs.id} className="p-3 rounded-lg border bg-slate-50 border-slate-200 opacity-70">
                    <div className="text-xs text-slate-500 mb-1">
                      <span className="font-bold line-through">{obs.isBlocking ? "Bloqueante" : "Informativa"}</span>
                      <span className="ml-2">Resuelto por {obs.resolvedBy} el {new Date(obs.resolvedAt || '').toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">{obs.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {observations.length === 0 && !showForm && (
            <div className="text-center py-6 text-slate-500 text-sm">
              No se han registrado observaciones para este proyecto.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
