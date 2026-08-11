import { Download, ChevronDown } from "lucide-react";

interface ExportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  isExporting: boolean;
  onExportCatalogs: () => void;
  onExportRestrictions: () => void;
  onExportAll: () => void;
  restrictionCount: number;
}

export default function ExportMenu({
  isOpen,
  onToggle,
  isExporting,
  onExportCatalogs,
  onExportRestrictions,
  onExportAll,
  restrictionCount,
}: ExportMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        {isExporting ? "Exportando..." : "Exportar"}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
          <button
            onClick={onExportCatalogs}
            disabled={isExporting}
            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 first:rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-semibold">Descargar catálogos</div>
            <div className="text-xs text-slate-500">Todos los catálogos en Excel</div>
          </button>

          <button
            onClick={onExportRestrictions}
            disabled={isExporting || restrictionCount === 0}
            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-semibold">Descargar restricciones</div>
            <div className="text-xs text-slate-500">
              Restricciones de dimensiones y validaciones en Excel
            </div>
          </button>

          <button
            onClick={onExportAll}
            disabled={isExporting}
            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-semibold">Descargar todo</div>
            <div className="text-xs text-slate-500">Catálogos y restricciones en un archivo</div>
          </button>
        </div>
      )}
    </div>
  );
}
