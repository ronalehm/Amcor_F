import { useMemo } from "react";
import { Info } from "lucide-react";

import FormSelect from "../../../shared/components/forms/FormSelect";
import {
  getActiveMaterialGroupOptions,
  getMaterialLayerOptionsByGroup,
  getMicronFrontendControl,
  getMicronRecordByCode,
} from "../../../shared/data/productMaterialCatalog";
import {
  PRODUCT_STRUCTURE_TYPES,
  getStructureLayerCount,
} from "../../../shared/data/productStructureMatrix";
import {
  getMaterialAvailabilityForLayer,
} from "../../../shared/data/productStructureSelectableMaterials";
import type {
  ProductStructureLayerValue,
  ProductStructureValue,
} from "../../../shared/types/productStructure.types";
import {
  validateProductStructureValue,
} from "../../../shared/utils/productStructureValidation";

export interface ProductStructureConfiguratorProps {
  value: ProductStructureValue;
  onChange: (value: ProductStructureValue) => void;
  disabled?: boolean;
  inherited?: boolean;
  allowStructureChange?: boolean;
  showCoverageWarning?: boolean;
  className?: string;
}

const emptyLayer =
  (): ProductStructureLayerValue => ({
    materialCode: "",
    micronRuleCode: "",
    micronValue: "",
  });


export default function ProductStructureConfigurator({
  value,
  onChange,
  disabled = false,
  inherited = false,
  allowStructureChange = true,
  className = "",
}: ProductStructureConfiguratorProps) {
  const validation = useMemo(
    () => validateProductStructureValue(value),
    [value],
  );

  const expectedLayerCount =
    getStructureLayerCount(
      value.structureType,
    );

  const updateStructureType = (
    structureType:
      ProductStructureValue["structureType"],
  ) => {
    const layerCount =
      getStructureLayerCount(structureType);

    onChange({
      structureType,
      layers: Array.from({
        length: layerCount,
      }).map(() => emptyLayer()),
    });
  };

  const updateLayer = (
    layerIndex: number,
    patch:
      Partial<ProductStructureLayerValue>,
    clearFollowingLayers = false,
  ) => {
    const layers = Array.from({
      length: expectedLayerCount,
    }).map(
      (_, index) =>
        value.layers[index] ??
        emptyLayer(),
    );

    layers[layerIndex] = {
      ...layers[layerIndex],
      ...patch,
    };

    if (clearFollowingLayers) {
      for (
        let index = layerIndex + 1;
        index < layers.length;
        index += 1
      ) {
        layers[index] = emptyLayer();
      }
    }

    onChange({
      structureType: value.structureType,
      layers,
    });
  };

  const gridClass =
    expectedLayerCount === 1
      ? "grid-cols-1"
      : "grid-cols-1 lg:grid-cols-2";

  return (
    <div
      className={`space-y-2.5 ${className}`}
    >
      <div className="max-w-xs">
        <FormSelect
          label="Tipo de estructura *"
          value={value.structureType}
          onChange={(selected) =>
            updateStructureType(
              selected as ProductStructureValue["structureType"],
            )
          }
          options={PRODUCT_STRUCTURE_TYPES.filter(Boolean).map(
            (type) => ({
              value: type,
              label: type,
            })
          )}
          placeholder="Seleccionar estructura"
          disabled={
            disabled ||
            (inherited &&
              !allowStructureChange)
          }
        />
      </div>

      {inherited &&
        !allowStructureChange && (
          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
            <p className="text-xs text-slate-600">
              Estructura heredada del SKU
              base. Se muestra en modo
              consulta.
            </p>
          </div>
        )}

      {value.structureType && (
        <div
          className={`grid gap-2.5 ${gridClass}`}
        >
          {Array.from({
            length: expectedLayerCount,
          }).map((_, layerIndex) => {
            const layerNumber =
              layerIndex + 1;

            const layer =
              value.layers[layerIndex] ??
              emptyLayer();

            const previousLayerCompleted =
              layerIndex === 0 ||
              Boolean(
                value.layers[
                  layerIndex - 1
                ]?.materialCode,
              );

            const layerDisabled =
              disabled ||
              !previousLayerCompleted ||
              (inherited &&
                !allowStructureChange);

            const selectedMaterialCodes =
              value.layers
                .slice(0, layerIndex)
                .map(
                  (item) =>
                    item.materialCode,
                );

            const materialGroupOptions =
              useMemo(
                () =>
                  getActiveMaterialGroupOptions(),
                [],
              );

            const materialAvailability =
              getMaterialAvailabilityForLayer({
                structureType:
                  value.structureType,
                layerIndex,
                selectedMaterialCodes,
              });

            const availabilityByCode = useMemo(
              () =>
                new Map(
                  materialAvailability.map(
                    (opt) => [opt.value, opt],
                  ),
                ),
              [materialAvailability],
            );

            const micronControl =
              getMicronFrontendControl(
                layer.materialCode,
              );

            const orderedMicronOptions =
              micronControl.mode === "VALOR"
                ? [
                    ...micronControl.options,
                  ].sort(
                    (left, right) =>
                      Number(
                        left.micronValue,
                      ) -
                        Number(
                          right.micronValue,
                        ) ||
                      (left.sortOrder || 0) -
                        (right.sortOrder || 0),
                  )
                : [];

            const snapshot =
              validation.snapshots[
                layerIndex
              ];

            return (
              <div
                key={`structure-layer-${layerNumber}`}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {`CAPA ${layerNumber} *`}
                    </label>
                    <select
                      value={
                        layer.materialCode
                      }
                      onChange={(
                        event,
                      ) =>
                        updateLayer(
                          layerIndex,
                          {
                            materialCode:
                              event.target
                                .value,
                            micronRuleCode:
                              "",
                            micronValue:
                              "",
                          },
                          true,
                        )
                      }
                      disabled={
                        layerDisabled
                      }
                      className={[
                        "h-10 w-full rounded-lg border px-3 text-sm outline-none transition",
                        "border-slate-300 bg-white text-slate-800",
                        "focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
                        "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400",
                      ].join(" ")}
                    >
                      <option value="">
                        {previousLayerCompleted
                          ? "Seleccionar material"
                          : `Completa CAPA ${
                              layerNumber - 1
                            }`}
                      </option>

                      {materialGroupOptions.map(
                        (group) => {
                          const materialsInGroup =
                            getMaterialLayerOptionsByGroup(
                              group.value,
                            );

                          return (
                            <optgroup
                              key={
                                group.value
                              }
                              label={
                                group.label
                              }
                            >
                              {materialsInGroup.map(
                                (material) => {
                                  const avail =
                                    availabilityByCode.get(
                                      material.code,
                                    );

                                  return (
                                    <option
                                      key={
                                        material.code
                                      }
                                      value={
                                        material.code
                                      }
                                      disabled={
                                        avail?.disabled ||
                                        false
                                      }
                                    >
                                      {
                                        material.label
                                      }
                                    </option>
                                  );
                                },
                              )}
                            </optgroup>
                          );
                        },
                      )}
                    </select>
                  </div>

                  <div>
                    {layer.materialCode &&
                      micronControl.mode ===
                        "VALOR" && (
                        <FormSelect
                          label="Micraje *"
                          value={
                            layer.micronRuleCode
                          }
                          onChange={(
                            micronRuleCode,
                          ) => {
                            const rule =
                              getMicronRecordByCode(
                                micronRuleCode,
                              );

                            updateLayer(
                              layerIndex,
                              {
                                micronRuleCode,
                                micronValue:
                                  rule?.TbMatMicVal ===
                                    null ||
                                  rule?.TbMatMicVal ===
                                    undefined
                                    ? ""
                                    : String(
                                        rule.TbMatMicVal,
                                      ),
                              },
                            );
                          }}
                          options={orderedMicronOptions.map(
                            (option) => ({
                              value:
                                option.code,
                              label:
                                option.label,
                            }),
                          )}
                          placeholder="Seleccionar"
                          disabled={
                            layerDisabled
                          }
                        />
                      )}

                    {layer.materialCode &&
                      micronControl.mode ===
                        "RANGO" && (
                        <>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">
                            Micraje * (
                            {
                              micronControl.minValue
                            }
                            –
                            {
                              micronControl.maxValue
                            }{" "}
                            µm)
                          </label>

                          <input
                            type="number"
                            min={
                              micronControl.minValue
                            }
                            max={
                              micronControl.maxValue
                            }
                            step={
                              micronControl.stepValue
                            }
                            value={
                              layer.micronValue
                            }
                            onChange={(
                              event,
                            ) =>
                              updateLayer(
                                layerIndex,
                                {
                                  micronRuleCode:
                                    micronControl.code,
                                  micronValue:
                                    event.target
                                      .value,
                                },
                              )
                            }
                            placeholder={`${micronControl.minValue}-${micronControl.maxValue}`}
                            disabled={
                              layerDisabled
                            }
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
                          />
                        </>
                      )}

                    {!layer.materialCode && (
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-400">
                          Micraje *
                        </label>
                        <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-400">
                          Selecciona material
                        </div>
                      </div>
                    )}

                    {layer.materialCode &&
                      micronControl.mode ===
                        "NONE" && (
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-400">
                            Micraje *
                          </label>
                          <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs text-slate-500">
                            Sin configuración
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {snapshot?.micronId &&
                  snapshot.density !== null &&
                  snapshot.grammage !==
                    null &&
                  snapshot.grammage !==
                    undefined && (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Densidad:{" "}
                      <span className="font-semibold text-slate-700">
                        {snapshot.density}{" "}
                        {
                          snapshot.densityUnit
                        }
                      </span>
                      {" · "}
                      Gramaje:{" "}
                      <span className="font-semibold text-slate-700">
                        {snapshot.grammage}{" "}
                        {
                          snapshot.grammageUnit
                        }
                      </span>
                    </p>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
