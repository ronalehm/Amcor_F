import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { EnrichedRestriction } from "../utils/restrictionAdapters";
import {
  getEnrichedRestrictions,
  getUniqueProductTypes,
  getProductTypeLabel,
} from "../utils/restrictionAdapters";
import FormSelect from "../../../shared/components/forms/FormSelect";
import RestrictionFilterCards from "./RestrictionFilterCards";
import RestrictionsTableView from "./RestrictionsTableView";
import RestrictionDetailDrawer from "./RestrictionDetailDrawer";

interface RestrictionsExplorerProps {}

export default function RestrictionsExplorer({}: RestrictionsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState<"all" | "LAMINA" | "BOLSA" | "POUCH">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "dimension" | "validation">("all");
  const [selectedRestriction, setSelectedRestriction] = useState<EnrichedRestriction | null>(null);

  const allRestrictions = useMemo(() => getEnrichedRestrictions(), []);
  const productTypes = useMemo(() => getUniqueProductTypes(), []);

  const filteredRestrictions = useMemo(() => {
    return allRestrictions
      .filter((restriction) => {
        const typeMatch = typeFilter === "all" || restriction.type === typeFilter;
        const productTypeMatch = productTypeFilter === "all" || restriction.productType === productTypeFilter;

        const searchLower = searchTerm.toLowerCase();
        const nameMatch = restriction.name.toLowerCase().includes(searchLower);
        const descriptionMatch = restriction.description.toLowerCase().includes(searchLower);
        const typeNameMatch = restriction.type.toLowerCase().includes(searchLower);
        const productTypeNameMatch = restriction.productType.toLowerCase().includes(searchLower);

        const searchMatch = nameMatch || descriptionMatch || typeNameMatch || productTypeNameMatch;

        return typeMatch && productTypeMatch && searchMatch;
      })
      .sort((a, b) => {
        if (a.productType !== b.productType) {
          return a.productType.localeCompare(b.productType);
        }
        if (a.type !== b.type) {
          return a.type.localeCompare(b.type);
        }
        return a.name.localeCompare(b.name);
      });
  }, [allRestrictions, searchTerm, productTypeFilter, typeFilter]);

  const productTypeOptions = [
    { value: "all", label: "Todas" },
    ...productTypes.map((type) => ({
      value: type,
      label: getProductTypeLabel(type),
    })),
  ];

  const displayingCount = filteredRestrictions.length;
  const totalCount = allRestrictions.length;

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Restricciones</h2>
        <p className="text-sm text-slate-600">
          Consulta reglas dimensionales y validaciones vigentes.
        </p>
      </div>

      {/* Search and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por envoltura, campo o regla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <FormSelect
          label=""
          value={productTypeFilter}
          onChange={(value) => setProductTypeFilter(value as any)}
          options={productTypeOptions}
          placeholder="Filtrar por envoltura"
        />
      </div>

      {/* Filter Cards */}
      <RestrictionFilterCards
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
      />

      {/* Info Text */}
      <div className="text-xs text-slate-600">
        Mostrando <span className="font-semibold">{displayingCount}</span> de{" "}
        <span className="font-semibold">{totalCount}</span> restricciones
      </div>

      {/* Restrictions Table */}
      <RestrictionsTableView
        restrictions={filteredRestrictions}
        onRowClick={setSelectedRestriction}
      />

      {/* Detail Drawer */}
      <RestrictionDetailDrawer
        isOpen={selectedRestriction !== null}
        restriction={selectedRestriction}
        onClose={() => setSelectedRestriction(null)}
      />
    </div>
  );
}
