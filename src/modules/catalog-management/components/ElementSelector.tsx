import { useMemo } from "react";
import SmartCatalogSearch from "../../../shared/components/catalog/SmartCatalogSearch";
import { getCatalogs } from "../../../shared/catalogs";
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
      // Usar catálogo centralizado en lugar de PRODUCT_CATALOGS
      const allCatalogs = getCatalogs();
      return allCatalogs
        .filter((cat) => cat.ownerSystem === catalogSource)
        .map((catalog) => ({
          id: catalog.code, // Usar código del registry como ID
          code: catalog.code,
          name: catalog.name,
          meta: `Código: ${catalog.code}`,
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
  }, [type, restrictionType, catalogSource]);

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
