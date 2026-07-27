import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { resolveMaterialLayer } from "../../data/productMaterialCatalog";
import type { ProductStructureValue } from "../../types/productStructure.types";

interface NewStructureRequestModalProps {
  isOpen: boolean;
  structureType: ProductStructureValue["structureType"];
  layers: ProductStructureValue["layers"];
  sequence: string;
  clientName: string;
  portfolioName: string;
  wrappingName: string;
  useFinal: string;
  productName: string;
  onSave: (values: { reason: string; comment: string }) => void;
  onClose: () => void;
}

const getMaterialLabel = (materialCode: string): string => {
  const material = resolveMaterialLayer(materialCode);
  return material?.TbMatCapNom || materialCode || "Pendiente";
};

export default function NewStructureRequestModal({
  isOpen,
  structureType,
  layers,
  sequence,
  clientName,
  portfolioName,
  wrappingName,
  useFinal,
  productName,
  onSave,
  onClose,
}: NewStructureRequestModalProps) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setReason("");
    setComment("");
  }, [isOpen]);

  const sequenceLabel = useMemo(
    () =>
      sequence ||
      layers
        .map((layer) => getMaterialLabel(layer.materialCode))
        .filter(Boolean)
        .join(" → "),
    [layers, sequence],
  );

  const canSubmit = Boolean(
    structureType &&
      layers.length > 0 &&
      layers.every((layer) => Boolean(layer.materialCode)) &&
      reason.trim() &&
      comment.trim(),
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10080] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Solicitar nueva estructura
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              La solicitud quedará pendiente de homologación y no habilitará el
              registro definitivo del producto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <span className="font-semibold text-slate-500">
                  Tipo de estructura
                </span>
                <p className="mt-1 font-bold text-slate-800">
                  {structureType || "—"}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-500">
                  Nombre del producto
                </span>
                <p className="mt-1 font-bold text-slate-800">
                  {productName || "—"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="font-semibold text-slate-500">Secuencia</span>
                <p className="mt-1 font-bold text-slate-800">
                  {sequenceLabel || "—"}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-500">Cliente</span>
                <p className="mt-1 text-slate-700">{clientName || "—"}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-500">Portafolio</span>
                <p className="mt-1 text-slate-700">{portfolioName || "—"}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-500">Envoltura</span>
                <p className="mt-1 text-slate-700">{wrappingName || "—"}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-500">Uso final</span>
                <p className="mt-1 text-slate-700">{useFinal || "—"}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Materiales propuestos
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {layers.map((layer, index) => (
                <div
                  key={`${layer.materialCode}-${index}`}
                  className="grid grid-cols-[80px_1fr_100px] gap-3 px-4 py-3 text-xs"
                >
                  <span className="font-semibold text-slate-500">
                    Capa {index + 1}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {getMaterialLabel(layer.materialCode)}
                  </span>
                  <span className="text-right text-slate-600">
                    {layer.micronValue
                      ? `${layer.micronValue} µm`
                      : "Micraje pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
              Motivo técnico o comercial *
            </label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="Explica por qué se requiere una estructura que no se encuentra en las combinaciones validadas."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
              Comentario para homologación *
            </label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Incluye aplicación, requerimiento del cliente, desempeño esperado u otra evidencia."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={() =>
              onSave({
                reason: reason.trim(),
                comment: comment.trim(),
              })
            }
          >
            Registrar solicitud
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
