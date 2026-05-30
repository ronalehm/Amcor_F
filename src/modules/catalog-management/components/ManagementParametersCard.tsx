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
}

export default function ManagementParametersCard({
  type,
  selectedTarget,
  selectedTargetId,
  onTargetChange,
  onTargetIdChange,
  errors,
  submitAttempted,
}: ManagementParametersCardProps) {
  const handleCatalogSelect = (catalog: CatalogItem) => {
    onTargetIdChange(catalog.code);
  };

  const handleRestrictionSelect = (restriction: RestrictionItem) => {
    onTargetIdChange(restriction.id);
  };

  return (
    <FormCard title="Parámetros de actualización" icon="⚙️" color="#00395A" required>
      <div className="space-y-4">
        {type === "catalog" ? (
          <CatalogSearch
            onSelect={handleCatalogSelect}
            value={selectedTarget}
            onChange={onTargetChange}
            error={submitAttempted ? errors.target : undefined}
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
    </FormCard>
  );
}
