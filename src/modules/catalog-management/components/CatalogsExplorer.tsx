import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { PRODUCT_CATALOGS } from "../../../shared/data/productCatalogs";
import {
  consolidateAllCatalogs,
  getAllCatalogIds,
  type ConsolidatedCatalog,
} from "../../../shared/catalogs/catalogExtraction";
import FormSelect from "../../../shared/components/forms/FormSelect";

interface CatalogsExplorerProps {}

export default function CatalogsExplorer({}: CatalogsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "ODISEO" | "SISTEMA_INTEGRAL">("all");
  const [expandedCatalogId, setExpandedCatalogId] = useState<string>("");

  const allCatalogs = useMemo(() => consolidateAllCatalogs(), []);
  const catalogIds = useMemo(() => getAllCatalogIds(), [allCatalogs]);

  const filteredCatalogIds = useMemo(() => {
    return catalogIds.filter((catalogId) => {
      const catalog = allCatalogs[catalogId];
      if (!catalog) return false;

      const sourceMatch =
        sourceFilter === "all" || catalog.source === sourceFilter;

      const searchLower = searchTerm.toLowerCase();
      const nameMatch = catalog.name.toLowerCase().includes(searchLower);
      const idMatch = catalogId.toLowerCase().includes(searchLower);
      const descriptionMatch = catalog.description
        ?.toLowerCase()
        .includes(searchLower);
      const valueMatch = catalog.values.some(
        (val) =>
          val.code.toLowerCase().includes(searchLower) ||
          val.label.toLowerCase().includes(searchLower) ||
          val.description?.toLowerCase().includes(searchLower)
      );

      return sourceMatch && (nameMatch || idMatch || descriptionMatch || valueMatch);
    });
  }, [catalogIds, allCatalogs, searchTerm, sourceFilter]);

  const sourceOptions = [
    { value: "all", label: "Todas las fuentes" },
    { value: "ODISEO", label: "ODISEO" },
    { value: "SISTEMA_INTEGRAL", label: "Sistema Integral" },
  ];

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "ODISEO":
        return <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">ODISEO</span>;
      case "SISTEMA_INTEGRAL":
        return <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">SI</span>;
      case "PORTFOLIO":
        return <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">Portfolio</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Catálogos</h2>
        <p className="text-sm text-slate-600">
          Explora cada catálogo y sus valores vigentes.
        </p>
      </div>

      {/* Search and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-3 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por nombre, código o valor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <FormSelect
          label=""
          value={sourceFilter}
          onChange={(value) => setSourceFilter(value as any)}
          options={sourceOptions}
          placeholder="Filtrar por fuente"
        />
      </div>

      {/* Catalogs List */}
      {filteredCatalogIds.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            No se encontraron catálogos con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCatalogIds.map((catalogId) => {
            const catalog = allCatalogs[catalogId];
            if (!catalog) return null;

            const isExpanded = expandedCatalogId === catalogId;

            return (
              <div
                key={catalogId}
                className="rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                {/* Catalog Header */}
                <button
                  onClick={() =>
                    setExpandedCatalogId(isExpanded ? "" : catalogId)
                  }
                  className="w-full flex items-start justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {catalog.name}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getSourceBadge(catalog.source)}
                      <span className="text-xs text-slate-500">
                        {catalog.values.length} valor
                        {catalog.values.length !== 1 ? "es" : ""}
                      </span>
                    </div>
                    {catalog.description && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {catalog.description}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-slate-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Catalog Values Table */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left px-3 py-2 font-semibold text-slate-700">
                              Código
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-700">
                              Valor
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-700">
                              Descripción
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {catalog.values.map((value) => (
                            <tr key={value.code} className="hover:bg-white">
                              <td className="px-3 py-2 font-mono text-xs text-slate-600">
                                {value.code}
                              </td>
                              <td className="px-3 py-2 text-slate-900">
                                {value.label}
                              </td>
                              <td className="px-3 py-2 text-slate-600 max-w-xs truncate">
                                {value.description || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
