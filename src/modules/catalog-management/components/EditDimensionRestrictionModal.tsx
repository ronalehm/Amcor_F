import { useState } from "react";
import { X } from "lucide-react";
import {
  getDimensionRestrictionById,
  updateDimensionRestriction,
} from "../../../shared/data/restrictionCatalogsStorage";
import { addRestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";
import type { DimensionRestrictionCatalog } from "../../../shared/data/restrictionCatalogs";

interface EditDimensionRestrictionModalProps {
  isOpen: boolean;
  restrictionId?: string;
  onClose: () => void;
  onSave: () => void;
}

const RangeField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { min: number; max: number };
  onChange: (v: { min: number; max: number }) => void;
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-2">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <input
          type="number"
          placeholder="Min"
          value={value.min}
          onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
          className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Max"
          value={value.max}
          onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
          className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
        />
      </div>
    </div>
  </div>
);

export default function EditDimensionRestrictionModal({
  isOpen,
  restrictionId,
  onClose,
  onSave,
}: EditDimensionRestrictionModalProps) {
  const restriction = restrictionId ? getDimensionRestrictionById(restrictionId) : null;
  const [formData, setFormData] = useState<Partial<DimensionRestrictionCatalog>>(
    restriction || {}
  );

  if (!isOpen || !restriction) return null;

  const handleSave = () => {
    if (restrictionId && restriction) {
      const changes: Record<string, { old: any; new: any }> = {};

      Object.keys(formData).forEach((key) => {
        const oldValue = (restriction as any)[key];
        const newValue = (formData as any)[key];

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes[key] = { old: oldValue, new: newValue };
        }
      });

      updateDimensionRestriction(restrictionId, formData);

      if (Object.keys(changes).length > 0) {
        addRestrictionChangeLogEntry({
          restrictionId,
          restrictionName: restriction.name,
          restrictionType: "dimension",
          action: "updated",
          changes,
          result: "success",
        });
      }

      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Editar Restricción de Dimensión</h3>
            <p className="text-sm text-slate-600 mt-1">{restriction?.name}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Código
              </label>
              <input
                type="text"
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Dimensiones Básicas */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">📐 Dimensiones Básicas</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Ancho (mm)"
                value={formData.ancho || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, ancho: v })}
              />
              <RangeField
                label="Largo (mm)"
                value={formData.largo || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, largo: v })}
              />
              <RangeField
                label="Fuelle (mm)"
                value={formData.anchoFuelle || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoFuelle: v })}
              />
              <RangeField
                label="Perímetro (mm)"
                value={formData.perimetro || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, perimetro: v })}
              />
            </div>
          </div>

          {/* Diseño */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">🎨 Área de Diseño</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Ancho Diseño (mm)"
                value={formData.designAreaWidth || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, designAreaWidth: v })}
              />
              <RangeField
                label="Alto Diseño (mm)"
                value={formData.designAreaHeight || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, designAreaHeight: v })}
              />
              <RangeField
                label="Repetición (mm)"
                value={formData.repeticion || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, repeticion: v })}
              />
            </div>
          </div>

          {/* Microperforación */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">⚡ Microperforación</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Separación Púas (mm)"
                value={formData.separacionPuas || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, separacionPuas: v })}
              />
              <RangeField
                label="Púas Aleta (mm)"
                value={formData.separacionPuasAleta || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, separacionPuasAleta: v })}
              />
            </div>
          </div>

          {/* Distancias */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">📏 Distancias</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Lado Pouch (mm)"
                value={formData.distanciaLadoPouch || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaLadoPouch: v })}
              />
              <RangeField
                label="Lado Aleta (mm)"
                value={formData.distanciaLadoAleta || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaLadoAleta: v })}
              />
              <RangeField
                label="Boca Zipper (mm)"
                value={formData.distanciaAbocaZipper || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaAbocaZipper: v })}
              />
              <RangeField
                label="Boca Válvula (mm)"
                value={formData.distanciaAbocaValvula || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaAbocaValvula: v })}
              />
              <RangeField
                label="Boca Muesca (mm)"
                value={formData.distanciaAbocaMuesca || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaAbocaMuesca: v })}
              />
              <RangeField
                label="Boca Perforación (mm)"
                value={formData.distanciaAbocaPerforacion || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaAbocaPerforacion: v })}
              />
              <RangeField
                label="Boca Precorte (mm)"
                value={formData.distanciaAbocaPrecorte || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distanciaAbocaPrecorte: v })}
              />
              <RangeField
                label="Margen Superior Perf (mm)"
                value={formData.distMargenSuperiorPerforacion || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distMargenSuperiorPerforacion: v })}
              />
              <RangeField
                label="Fuelle Perforación (mm)"
                value={formData.distFuellePerforacion || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, distFuellePerforacion: v })}
              />
            </div>
          </div>

          {/* Wicket */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">🎫 Wicket</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Diámetro (mm)"
                value={formData.wicketDiameter || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, wicketDiameter: v })}
              />
              <RangeField
                label="Dist Superior (mm)"
                value={formData.wicketDistSuperior || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, wicketDistSuperior: v })}
              />
              <RangeField
                label="Dist Derecha (mm)"
                value={formData.wicketDistDerecho || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, wicketDistDerecho: v })}
              />
              <RangeField
                label="Control Diam (mm)"
                value={formData.wicketControlDiameter || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, wicketControlDiameter: v })}
              />
              <RangeField
                label="Control Superior (mm)"
                value={formData.wicketControlDistSuperior || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, wicketControlDistSuperior: v })}
              />
              <RangeField
                label="Control Derecha (mm)"
                value={formData.wicketControlDistDerecho || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, wicketControlDistDerecho: v })}
              />
            </div>
          </div>

          {/* Sellos */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">🔗 Sellos</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Ancho Sello (mm)"
                value={formData.anchoSello || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoSello: v })}
              />
              <RangeField
                label="Ancho Transversal (mm)"
                value={formData.selloAnchoTransversal || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, selloAnchoTransversal: v })}
              />
              <RangeField
                label="Ancho Lateral (mm)"
                value={formData.anchoSelloLateral || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoSelloLateral: v })}
              />
              <RangeField
                label="Ancho Aleta (mm)"
                value={formData.anchoSelloAleta || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoSelloAleta: v })}
              />
              <RangeField
                label="Fuelle Cerrado (mm)"
                value={formData.anchoFuelleCerrado || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoFuelleCerrado: v })}
              />
            </div>
          </div>

          {/* Accesorios */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">🛠️ Accesorios</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Ancho Solapa (mm)"
                value={formData.anchoSolapa || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoSolapa: v })}
              />
              <RangeField
                label="Corta Aliviad (mm)"
                value={formData.cortaAliviadorDistDerecho || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, cortaAliviadorDistDerecho: v })}
              />
              <RangeField
                label="Dispensador (mm)"
                value={formData.dispensadorDistIzquierdo || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, dispensadorDistIzquierdo: v })}
              />
              <RangeField
                label="Precorte Largo (mm)"
                value={formData.precorteWicketLargo || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, precorteWicketLargo: v })}
              />
              <RangeField
                label="Precorte Dist (mm)"
                value={formData.precorteWicketDistDerecho || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, precorteWicketDistDerecho: v })}
              />
              <RangeField
                label="Refuerzo Espesor (mm)"
                value={formData.reinforcementThickness || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, reinforcementThickness: v })}
              />
              <RangeField
                label="Refuerzo Ancho (mm)"
                value={formData.reinforcementWidth || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, reinforcementWidth: v })}
              />
            </div>
          </div>

          {/* Doy Pack */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">📦 Doy Pack</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Base (mm)"
                value={formData.doyPackBase || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, doyPackBase: v })}
              />
              <RangeField
                label="Repetición Exacta (mm)"
                value={formData.doyPackRepeticionExacta || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, doyPackRepeticionExacta: v })}
              />
              <RangeField
                label="Tolerancia Rep Exacta (mm)"
                value={formData.toleranciaRepExactaDoyPack || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, toleranciaRepExactaDoyPack: v })}
              />
              <RangeField
                label="Tolerancia Rep (mm)"
                value={formData.toleranciaRepDoyPack || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, toleranciaRepDoyPack: v })}
              />
            </div>
          </div>

          {/* Photoregister 1 */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">📸 Photoregister 1</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Ancho (mm)"
                value={formData.fr1Width || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr1Width: v })}
              />
              <RangeField
                label="Alto (mm)"
                value={formData.fr1Height || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr1Height: v })}
              />
              <RangeField
                label="Margen Izq (mm)"
                value={formData.fr1MarginLeft || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr1MarginLeft: v })}
              />
              <RangeField
                label="Margen Der (mm)"
                value={formData.fr1MarginRight || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr1MarginRight: v })}
              />
              <RangeField
                label="Margen Sup (mm)"
                value={formData.fr1MarginTop || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr1MarginTop: v })}
              />
              <RangeField
                label="Margen Inf (mm)"
                value={formData.fr1MarginBottom || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr1MarginBottom: v })}
              />
            </div>
          </div>

          {/* Photoregister 2 */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">📸 Photoregister 2</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Ancho (mm)"
                value={formData.fr2Width || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr2Width: v })}
              />
              <RangeField
                label="Alto (mm)"
                value={formData.fr2Height || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr2Height: v })}
              />
              <RangeField
                label="Margen Izq (mm)"
                value={formData.fr2MarginLeft || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr2MarginLeft: v })}
              />
              <RangeField
                label="Margen Der (mm)"
                value={formData.fr2MarginRight || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr2MarginRight: v })}
              />
              <RangeField
                label="Margen Sup (mm)"
                value={formData.fr2MarginTop || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr2MarginTop: v })}
              />
              <RangeField
                label="Margen Inf (mm)"
                value={formData.fr2MarginBottom || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fr2MarginBottom: v })}
              />
            </div>
          </div>

          {/* Otros */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">📋 Otros</h4>
            <div className="grid grid-cols-4 gap-3">
              <RangeField
                label="Altura Bolsa (mm)"
                value={formData.alturaEnLaBolsa || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, alturaEnLaBolsa: v })}
              />
              <RangeField
                label="Ancho Bolsa (mm)"
                value={formData.anchoEnLaBolsa || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, anchoEnLaBolsa: v })}
              />
              <RangeField
                label="Fuelle Cerrado (mm)"
                value={formData.fuelleCerrado || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, fuelleCerrado: v })}
              />
              <RangeField
                label="Sello Ancho Lateral (mm)"
                value={formData.selloAnchoLateral || { min: 0, max: 0 }}
                onChange={(v) => setFormData({ ...formData, selloAnchoLateral: v })}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
              Estado
            </label>
            <select
              value={formData.status || "Activo"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Activo" | "Inactivo" | "Bloqueado",
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option>Activo</option>
              <option>Inactivo</option>
              <option>Bloqueado</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
