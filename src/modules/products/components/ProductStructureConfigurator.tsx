import React, { useMemo } from "react";
import FormSelect from "../../../shared/components/forms/FormSelect";
import {
  getActiveMaterialGroupOptions,
  getMaterialLayerOptionsByGroup,
  getMicronFrontendControl,
} from "../../../shared/data/productMaterialCatalog";
import { PRODUCT_STRUCTURE_TYPES, getStructureLayerCount } from "../../../shared/data/productStructureMatrix";
import {
  validateProductStructureValue,
  getLayerStructureError,
} from "../../../shared/utils/productStructureValidation";
import type { ProductStructureValue } from "../../../shared/types/productStructure.types";

type Props = {
  value: ProductStructureValue;
  onChange: (nextValue: ProductStructureValue) => void;
  disabled?: boolean;
  inherited?: boolean;
  allowStructureChange?: boolean;
  showCoverageWarning?: boolean;
  className?: string;
};

export default function ProductStructureConfigurator({
  value,
  onChange,
  disabled = false,
  inherited = false,
  allowStructureChange = false,
  showCoverageWarning = false,
  className = "",
}: Props) {
  const materialGroupOptions = useMemo(
    () => getActiveMaterialGroupOptions(),
    [],
  );

  const validation = useMemo(
    () => validateProductStructureValue(value),
    [value],
  );

  const expectedLayerCount = getStructureLayerCount(value.structureType);

  const handleStructureTypeChange = (newType: string) => {
    if (disabled || (!allowStructureChange && inherited)) return;

    const clearedLayers = [0, 1, 2, 3].map((i) => ({
      materialCode: "",
      micronRuleCode: "",
      micronValue: "",
    }));

    onChange({
      structureType: newType as any,
      layers: clearedLayers,
    });
  };

  const handleMaterialChange = (layerIndex: number, materialCode: string) => {
    if (disabled) return;

    const newLayers = [...value.layers];
    if (!newLayers[layerIndex]) {
      newLayers[layerIndex] = {
        materialCode: "",
        micronRuleCode: "",
        micronValue: "",
      };
    }

    newLayers[layerIndex].materialCode = materialCode;
    newLayers[layerIndex].micronRuleCode = "";
    newLayers[layerIndex].micronValue = "";

    onChange({
      ...value,
      layers: newLayers,
    });
  };

  const handleMicronChange = (layerIndex: number, micronValue: string) => {
    if (disabled) return;

    const newLayers = [...value.layers];
    if (!newLayers[layerIndex]) {
      newLayers[layerIndex] = {
        materialCode: "",
        micronRuleCode: "",
        micronValue: "",
      };
    }

    newLayers[layerIndex].micronValue = micronValue;
    newLayers[layerIndex].micronRuleCode = "";

    onChange({
      ...value,
      layers: newLayers,
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tipo de Estructura */}
      <div>
        <FormSelect
          label="Tipo de Estructura"
          value={value.structureType}
          onChange={handleStructureTypeChange}
          options={PRODUCT_STRUCTURE_TYPES.filter(Boolean).map((type) => ({
            value: type,
            label: type,
          }))}
          placeholder="-- Seleccione Tipo --"
          disabled={disabled || (!allowStructureChange && inherited)}
        />
      </div>

      {validation.errors.length > 0 && validation.errors[0]?.field === "structureType" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {validation.errors[0].message}
        </div>
      )}

      {/* Capas */}
      {value.structureType && (
        <div className="space-y-4">
          {Array.from({ length: expectedLayerCount }).map((_, index) => {
            const layerNumber = index + 1;
            const layer = value.layers[index];
            const micronControl = getMicronFrontendControl(layer?.materialCode);
            const layerError = getLayerStructureError(validation, layerNumber);

            return (
              <div
                key={layerNumber}
                className={`p-4 border rounded-lg ${
                  disabled ? "bg-slate-100 opacity-60" : "bg-slate-50"
                } border-slate-200`}
              >
                <h4 className="font-semibold text-slate-700 mb-3">
                  CAPA {layerNumber}
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Material */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Material
                    </label>
                    <select
                      value={layer?.materialCode || ""}
                      onChange={(e) =>
                        handleMaterialChange(index, e.target.value)
                      }
                      disabled={disabled}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        disabled
                          ? "bg-slate-100 border-slate-300 text-slate-500"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      <option value="">-- Seleccione Material --</option>
                      {materialGroupOptions.map((group) => {
                        const materialsInGroup = getMaterialLayerOptionsByGroup(group.value);
                        return (
                          <optgroup key={group.value} label={group.label}>
                            {materialsInGroup.map((material) => (
                              <option
                                key={material.code}
                                value={material.code}
                              >
                                {material.label}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                    {layerError && (
                      <p className="text-sm text-red-600 mt-1">{layerError}</p>
                    )}
                  </div>

                  {/* Micraje */}
                  {micronControl.mode === "VALOR" && (() => {
                    const orderedMicronOptions =
                      micronControl.mode === "VALOR"
                        ? [...(micronControl.options || [])].sort((left, right) => {
                            const micronDifference =
                              Number(left.micronValue) - Number(right.micronValue);

                            if (micronDifference !== 0) return micronDifference;

                            if ((left.sortOrder || 0) !== (right.sortOrder || 0)) {
                              return (left.sortOrder || 0) - (right.sortOrder || 0);
                            }

                            return left.label.localeCompare(right.label, "es");
                          })
                        : [];

                    return (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Micraje (µm)
                        </label>
                        <select
                          value={layer?.micronValue || ""}
                          onChange={(e) =>
                            handleMicronChange(index, e.target.value)
                          }
                          disabled={disabled || !layer?.materialCode}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            disabled || !layer?.materialCode
                              ? "bg-slate-100 border-slate-300 text-slate-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          <option value="">-- Seleccione Micraje --</option>
                          {orderedMicronOptions.map((option) => (
                            <option key={option.code} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}

                  {micronControl.mode === "RANGO" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Micraje (µm)
                      </label>
                      <input
                        type="number"
                        value={layer?.micronValue || ""}
                        onChange={(e) =>
                          handleMicronChange(index, e.target.value)
                        }
                        disabled={disabled || !layer?.materialCode}
                        min={micronControl.minValue}
                        max={micronControl.maxValue}
                        step={micronControl.stepValue}
                        placeholder={`${micronControl.minValue} - ${micronControl.maxValue}`}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          disabled || !layer?.materialCode
                            ? "bg-slate-100 border-slate-300 text-slate-500"
                            : "border-slate-300 bg-white"
                        }`}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Rango: {micronControl.minValue}-{micronControl.maxValue} µm
                      </p>
                    </div>
                  )}
                </div>

                {/* Snapshot Técnico */}
                {validation.snapshots[index] && (
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 md:grid-cols-4 text-xs">
                    {validation.snapshots[index]?.micronValue && (
                      <div>
                        <div className="text-slate-500">Micraje</div>
                        <div className="font-medium">
                          {validation.snapshots[index]?.micronValue}{" "}
                          {validation.snapshots[index]?.micronUnit}
                        </div>
                      </div>
                    )}
                    {validation.snapshots[index]?.density !== null && (
                      <div>
                        <div className="text-slate-500">Densidad</div>
                        <div className="font-medium">
                          {validation.snapshots[index]?.density}{" "}
                          {validation.snapshots[index]?.densityUnit}
                        </div>
                      </div>
                    )}
                    {validation.snapshots[index]?.grammage && (
                      <div>
                        <div className="text-slate-500">Gramaje</div>
                        <div className="font-medium">
                          {validation.snapshots[index]?.grammage}{" "}
                          {validation.snapshots[index]?.grammageUnit}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen Validación */}
      {validation.errors.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-2">
            Problemas detectados:
          </h4>
          <ul className="space-y-1">
            {validation.errors.map((error, idx) => (
              <li
                key={idx}
                className="text-sm text-amber-800 flex items-start gap-2"
              >
                <span className="text-amber-600 font-bold">•</span>
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.canSave && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ Estructura válida y registrada en el catálogo.
        </div>
      )}

      {showCoverageWarning && inherited && !allowStructureChange && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          ℹ Estructura heredada del producto base. No se puede modificar el tipo.
        </div>
      )}
    </div>
  );
}
