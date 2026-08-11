import { useState } from "react";
import { getAvailableCatalogs } from "../services/catalogRestrictionService";
import type { CatalogItem } from "../types/catalogRestriction.types";

interface CatalogsTableProps {
  onSelectCatalog: (catalog: CatalogItem) => void;
  selectedCatalogCode?: string;
}

export default function CatalogsTable({
  onSelectCatalog,
  selectedCatalogCode,
}: CatalogsTableProps) {
  const [catalogs] = useState<CatalogItem[]>(getAvailableCatalogs());

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Código
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Origen
              </th>
            </tr>
          </thead>
          <tbody>
            {catalogs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-slate-600">
                  No hay catálogos disponibles
                </td>
              </tr>
            ) : (
              catalogs.map((catalog) => (
                <tr
                  key={catalog.code}
                  onClick={() => onSelectCatalog(catalog)}
                  className={`border-b border-slate-100 cursor-pointer transition-colors ${
                    selectedCatalogCode === catalog.code
                      ? "bg-brand-secondary-soft"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {catalog.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs font-mono">
                    {catalog.code}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        catalog.source === "ODISEO"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {catalog.source === "ODISEO" ? "ODISEO" : "Sistema Integral"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
