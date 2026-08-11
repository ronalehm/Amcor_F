import { X } from "lucide-react";
import { CatalogChangeLogTable } from "./CatalogChangeLogTable";

interface CatalogChangeLogModalProps {
  isOpen: boolean;
  catalogCode?: string;
  catalogName?: string;
  onClose: () => void;
}

export function CatalogChangeLogModal({
  isOpen,
  catalogCode,
  catalogName,
  onClose,
}: CatalogChangeLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bitácora de Cambios</h2>
            {catalogName && (
              <p className="text-sm text-slate-600 mt-1">
                Historial de cambios para: <span className="font-semibold">{catalogName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <CatalogChangeLogTable catalogCode={catalogCode} />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
