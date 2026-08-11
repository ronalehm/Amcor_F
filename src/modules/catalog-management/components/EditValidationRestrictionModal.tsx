import { useState } from "react";
import { X } from "lucide-react";
import {
  getValidationRestrictionById,
  updateValidationRestriction,
} from "../../../shared/data/restrictionCatalogsStorage";
import { addRestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";
import type { ValidationRestrictionCatalog } from "../../../shared/data/restrictionCatalogs";

interface EditValidationRestrictionModalProps {
  isOpen: boolean;
  restrictionId?: string;
  onClose: () => void;
  onSave: () => void;
}

export default function EditValidationRestrictionModal({
  isOpen,
  restrictionId,
  onClose,
  onSave,
}: EditValidationRestrictionModalProps) {
  const restriction = restrictionId ? getValidationRestrictionById(restrictionId) : null;
  const [formData, setFormData] = useState<Partial<ValidationRestrictionCatalog>>(
    restriction || {}
  );
  const [newValue, setNewValue] = useState("");

  if (!isOpen || !restriction) return null;

  const handleAddValue = () => {
    if (newValue.trim()) {
      const currentValues = formData.allowedValues || [];
      setFormData({
        ...formData,
        allowedValues: [...currentValues, newValue.trim()],
      });
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    const updated = (formData.allowedValues || []).filter((_, i) => i !== index);
    setFormData({ ...formData, allowedValues: updated });
  };

  const handleSave = () => {
    if (restrictionId && restriction) {
      const changes: Record<string, { old: any; new: any }> = {};

      // Detectar cambios
      Object.keys(formData).forEach((key) => {
        const oldValue = (restriction as any)[key];
        const newValue = (formData as any)[key];

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes[key] = { old: oldValue, new: newValue };
        }
      });

      // Actualizar restricción
      updateValidationRestriction(restrictionId, formData);

      // Registrar en bitácora
      if (Object.keys(changes).length > 0) {
        addRestrictionChangeLogEntry({
          restrictionId,
          restrictionName: restriction.name,
          restrictionType: "validation",
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
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Editar Restricción de Validación</h3>
            <p className="text-sm text-slate-600 mt-1">{restriction?.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
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
                Descripción
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Tipo de Producto
                </label>
                <select
                  value={formData.productType || "LAMINA"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productType: e.target.value as "LAMINA" | "BOLSA" | "POUCH",
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="LAMINA">LÁMINA</option>
                  <option value="BOLSA">BOLSA</option>
                  <option value="POUCH">POUCH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuración de Validación */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Configuración de Validación</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Campo Origen
                </label>
                <input
                  type="text"
                  value={formData.sourceField || ""}
                  onChange={(e) => setFormData({ ...formData, sourceField: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Valor Origen
                </label>
                <input
                  type="text"
                  value={formData.sourceValue || ""}
                  onChange={(e) => setFormData({ ...formData, sourceValue: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Campo Dependiente
              </label>
              <input
                type="text"
                value={formData.dependentField || ""}
                onChange={(e) => setFormData({ ...formData, dependentField: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Valores Permitidos */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Valores Permitidos</h4>

            <div className="space-y-3">
              {(formData.allowedValues || []).map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm">
                    {value}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(index)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddValue();
                  }
                }}
                placeholder="Nuevo valor permitido..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddValue}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition-colors"
              >
                Agregar
              </button>
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
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
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
