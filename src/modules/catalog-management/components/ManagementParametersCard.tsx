import FormCard from "../../../shared/components/forms/FormCard";
import CatalogSearch from "./CatalogSearch";
import RestrictionSearch from "./RestrictionSearch";
import type { ManagementType, CatalogItem, RestrictionItem } from "../types/catalogRestriction.types";

interface ManagementParametersCardProps {
  type: ManagementType;
  selectedTarget: string;
  selectedTargetId: string;
  onTargetChange: (value: string) => void;
  onTargetIdChange: (id: string) => void;
  errors: Record<string, string>;
  submitAttempted: boolean;
  catalogSource?: "ODISEO" | "SISTEMA_INTEGRAL";
  onCatalogSourceChange?: (source: "ODISEO" | "SISTEMA_INTEGRAL") => void;
}

export default function ManagementParametersCard({
  type,
  selectedTarget,
  selectedTargetId,
  onTargetChange,
  onTargetIdChange,
  errors,
  submitAttempted,
  catalogSource = "ODISEO",
  onCatalogSourceChange,
}: ManagementParametersCardProps) {
  const handleCatalogSelect = (catalog: CatalogItem) => {
    onTargetIdChange(catalog.code);
    if (onCatalogSourceChange) {
      onCatalogSourceChange(catalog.source);
    }
  };

  const handleRestrictionSelect = (restriction: RestrictionItem) => {
    onTargetIdChange(restriction.id);
  };

  return (
    <FormCard title="Parámetros de actualización" icon="⚙️" color="#00395A" required>
      <div className="space-y-6">
        {type === "catalog" && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-3">
              Origen del catálogo *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onCatalogSourceChange?.("ODISEO")}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  catalogSource === "ODISEO"
                    ? "border-brand-primary bg-brand-secondary-soft"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    catalogSource === "ODISEO"
                      ? "border-brand-primary bg-brand-primary"
                      : "border-slate-300"
                  }`}>
                    {catalogSource === "ODISEO" && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">ODISEO</p>
                    <p className="text-xs text-slate-600">Catálogos propios del portal</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onCatalogSourceChange?.("SISTEMA_INTEGRAL")}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  catalogSource === "SISTEMA_INTEGRAL"
                    ? "border-brand-primary bg-brand-secondary-soft"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    catalogSource === "SISTEMA_INTEGRAL"
                      ? "border-brand-primary bg-brand-primary"
                      : "border-slate-300"
                  }`}>
                    {catalogSource === "SISTEMA_INTEGRAL" && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Sistema Integral</p>
                    <p className="text-xs text-slate-600">Catálogos sincronizados</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div>
          {type === "catalog" ? (
            <CatalogSearch
              onSelect={handleCatalogSelect}
              value={selectedTarget}
              onChange={onTargetChange}
              error={submitAttempted ? errors.target : undefined}
              source={catalogSource}
            />
          ) : (
            <RestrictionSearch
              onSelect={handleRestrictionSelect}
              value={selectedTarget}
              onChange={onTargetChange}
              error={submitAttempted ? errors.target : undefined}
            />
          )}
        </div>
      </div>
    </FormCard>
  );
}
