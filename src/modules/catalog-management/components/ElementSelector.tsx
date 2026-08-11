import { useMemo } from "react";
import SmartCatalogSearch from "../../../shared/components/catalog/SmartCatalogSearch";
import { PRODUCT_CATALOGS } from "../../../shared/data/productCatalogs";
import { getAvailableRestrictions } from "../services/catalogRestrictionService";
import type { SmartCatalogOption } from "../../../shared/components/catalog/SmartCatalogSearch";
import type { ManagementType } from "../types/catalogRestriction.types";

interface ElementSelectorProps {
  type: ManagementType;
  selectedTargetId: string;
  onTargetIdChange: (id: string) => void;
  onTargetChange: (name: string) => void;
  error?: string;
  catalogSource?: "ODISEO" | "SISTEMA_INTEGRAL";
  restrictionType?: "dimension" | "validation";
}

export default function ElementSelector({
  type,
  selectedTargetId,
  onTargetIdChange,
  onTargetChange,
  error,
  catalogSource = "ODISEO",
  restrictionType,
}: ElementSelectorProps) {
  const options: SmartCatalogOption[] = useMemo(() => {
    if (type === "catalog") {
      return Object.entries(PRODUCT_CATALOGS)
        .filter(([_, catalog]) => catalog && "label" in catalog)
        .map(([key, catalog]) => ({
          id: key,
          code: (catalog as any).code || key,
          name: (catalog as any).label || key,
          meta: `Código: ${(catalog as any).code || key}`,
        }));
    }

    if (type === "restriction") {
      const allRestrictions = getAvailableRestrictions();
      return allRestrictions.map((r) => ({
        id: r.id,
        code: r.id,
        name: r.name,
        meta: restrictionType === "dimension" ? "Restricción de Dimensión" : "Restricción de Validación",
      }));
    }

    return [];
  }, [type, restrictionType]);

  const handleChange = (selectedId: string) => {
    onTargetIdChange(selectedId);
    const selected = options.find((opt) => String(opt.id) === selectedId);
    if (selected) {
      onTargetChange(selected.name);
    }
  };

  return (
    <SmartCatalogSearch
      label={
        type === "catalog"
          ? "Catálogo a actualizar *"
          : "Restricción a actualizar *"
      }
      value={selectedTargetId}
      onChange={handleChange}
      options={options}
      placeholder={
        type === "catalog"
          ? "Buscar catálogo por nombre..."
          : "Buscar restricción por nombre..."
      }
      error={error}
      emptyMessage={
        type === "catalog"
          ? "No se encontraron catálogos"
          : "No se encontraron restricciones"
      }
    />
  );
}
