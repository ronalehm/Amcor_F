import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { getCatalogValues } from "../../../shared/catalogs";
import type { CatalogDefinition } from "../../../shared/catalogs";

interface CatalogsListProps {
  catalogs: CatalogDefinition[];
}

export default function CatalogsList({ catalogs }: CatalogsListProps) {
  return (
    <div className="space-y-3">
      {catalogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No hay catálogos disponibles</p>
        </div>
      ) : (
        catalogs.map((catalog) => <CatalogItem key={catalog.id} catalog={catalog} />)
      )}
    </div>
  );
}

function CatalogItem({ catalog }: { catalog: CatalogDefinition }) {
  const values = useMemo(
    () => getCatalogValues(catalog.code),
    [catalog.code]
  );

  const activeCount = values.filter((v) => v.status === "Activo").length;
  const inactiveCount = values.filter((v) => v.status === "Inactivo").length;
  const blockedCount = values.filter((v) => v.status === "Bloqueado").length;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 text-sm group-hover:text-brand-primary transition-colors">
            {catalog.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Código: {catalog.code}
          </p>
        </div>
        <ChevronRight
          size={16}
          className="text-slate-400 group-hover:text-brand-primary transition-colors flex-shrink-0"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200">
        <div className="text-center">
          <div className="text-sm font-bold text-slate-900">{values.length}</div>
          <div className="text-xs text-slate-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-green-700">{activeCount}</div>
          <div className="text-xs text-green-600">Activos</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-slate-600">
            {inactiveCount + blockedCount}
          </div>
          <div className="text-xs text-slate-600">Inactivos</div>
        </div>
      </div>
    </div>
  );
}
