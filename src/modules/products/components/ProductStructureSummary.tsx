import React, { useMemo } from "react";
import type { ProjectEditFormData } from "../pages/ProductEditPage";
import { validateProductStructureValue } from "../../../shared/utils/productStructureValidation";
import type { ProductStructureValue } from "../../../shared/types/productStructure.types";

type Props = {
  form: ProjectEditFormData;
};

export default function ProductStructureSummary({ form }: Props) {
  const structureValue: ProductStructureValue = useMemo(
    () => ({
      structureType: (form.structureType || "") as any,
      layers: [
        {
          materialCode: form.layer1Material || "",
          micronRuleCode: form.layer1MicronRuleCode || "",
          micronValue: form.layer1Micron || "",
        },
        {
          materialCode: form.layer2Material || "",
          micronRuleCode: form.layer2MicronRuleCode || "",
          micronValue: form.layer2Micron || "",
        },
        {
          materialCode: form.layer3Material || "",
          micronRuleCode: form.layer3MicronRuleCode || "",
          micronValue: form.layer3Micron || "",
        },
        {
          materialCode: form.layer4Material || "",
          micronRuleCode: form.layer4MicronRuleCode || "",
          micronValue: form.layer4Micron || "",
        },
      ],
    }),
    [form],
  );

  const validation = useMemo(
    () => validateProductStructureValue(structureValue),
    [structureValue],
  );

  if (!structureValue.structureType) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">
          Estructura: {structureValue.structureType}
        </h4>

        <div className="space-y-2">
          {validation.snapshots.map((snapshot, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded"
            >
              <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-xs font-bold">
                {index + 1}
              </span>
              <div className="flex-1">
                <span className="font-medium">{snapshot.materialName}</span>
                {snapshot.micronValue && (
                  <span className="text-slate-600 ml-2">
                    {snapshot.micronValue} {snapshot.micronUnit}
                  </span>
                )}
              </div>
              {snapshot.grammage && (
                <div className="text-right">
                  <div className="text-xs text-slate-500">Gramaje</div>
                  <div className="font-semibold">
                    {snapshot.grammage} {snapshot.grammageUnit}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 text-xs">
        {validation.isStructureComplete && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded">
            ✓ Completa
          </span>
        )}

        {validation.isStructureRegistered && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded">
            ✓ Registrada
          </span>
        )}

        {validation.areLayersTechnicallyValid && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded">
            ✓ Técnicamente válida
          </span>
        )}

        {!validation.isStructureComplete && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded">
            ⚠ Incompleta
          </span>
        )}

        {!validation.isStructureRegistered &&
          validation.isStructureComplete && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded">
              ✗ No registrada
            </span>
          )}
      </div>
    </div>
  );
}
