import FormCard from "../../../shared/components/forms/FormCard";
import CatalogSearch from "./CatalogSearch";
import CatalogsTable from "./CatalogsTable";
import RestrictionSearch from "./RestrictionSearch";
import RestrictionsTable from "./RestrictionsTable";
import type { ManagementType, CatalogItem, RestrictionItem } from "../types/catalogRestriction.types";

interface SourceAndParametersTabProps {
  type: ManagementType;
  selectedTarget: string;
  selectedTargetId: string;
  onTargetChange: (value: string) => void;
  onTargetIdChange: (id: string) => void;
  errors: Record<string, string>;
  submitAttempted: boolean;
  catalogSource?: "ODISEO" | "SISTEMA_INTEGRAL";
  activeTab?: "dimension" | "validation";
  onTabChange?: (tab: "dimension" | "validation") => void;
}

export default function SourceAndParametersTab({
  type,
  selectedTarget,
  selectedTargetId,
  onTargetChange,
  onTargetIdChange,
  errors,
  submitAttempted,
  catalogSource = "ODISEO",
  activeTab,
  onTabChange,
}: SourceAndParametersTabProps) {
  const handleCatalogSelect = (catalog: CatalogItem) => {
    onTargetIdChange(catalog.code);
  };

  const handleRestrictionSelect = (restriction: RestrictionItem) => {
    onTargetIdChange(restriction.id);
  };

  return (
    <FormCard title="Parámetros" icon="⚙️" color="#00395A">
      <div className="space-y-6">
        {type === "catalog" ? (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-3">
                Seleccionar catálogo *
              </label>

              <CatalogsTable
                onSelectCatalog={handleCatalogSelect}
                selectedCatalogCode={selectedTargetId}
              />

              {submitAttempted && errors.targetId && (
                <p className="mt-2 text-sm text-red-600">{errors.targetId}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <RestrictionsTable
              onSelectRestriction={(id, name) => {
                onTargetIdChange(id);
                onTargetChange(name);
              }}
              selectedRestrictionId={selectedTargetId}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />

            {submitAttempted && errors.targetId && (
              <p className="text-sm text-red-600">{errors.targetId}</p>
            )}
          </>
        )}
      </div>
    </FormCard>
  );
}
