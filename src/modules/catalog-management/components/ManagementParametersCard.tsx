import FormCard from "../../../shared/components/forms/FormCard";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import CatalogSearch from "./CatalogSearch";
import RestrictionSearch from "./RestrictionSearch";
import type { ManagementType, CatalogItem, RestrictionItem } from "../types/catalogRestriction.types";

interface ManagementParametersCardProps {
  type: ManagementType;
  selectedTarget: string;
  reason: string;
  selectedTargetId: string;
  onTargetChange: (value: string) => void;
  onTargetIdChange: (id: string) => void;
  onReasonChange: (value: string) => void;
  errors: Record<string, string>;
  submitAttempted: boolean;
}

export default function ManagementParametersCard({
  type,
  selectedTarget,
  reason,
  selectedTargetId,
  onTargetChange,
  onTargetIdChange,
  onReasonChange,
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

        <FormTextarea
          label="Motivo del cambio"
          value={reason}
          onChange={onReasonChange}
          placeholder="Describe el motivo de esta actualización..."
          helper="Este motivo será registrado en la bitácora del sistema."
          error={submitAttempted ? errors.reason : undefined}
          rows={3}
          maxLength={500}
        />
      </div>
    </FormCard>
  );
}
