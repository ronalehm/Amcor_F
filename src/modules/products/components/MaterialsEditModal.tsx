import { useState, useMemo, useEffect } from "react";
import { X, Layers3 } from "lucide-react";
import type { ProjectEditFormData } from "../pages/ProductEditPage";
import type { ProductStructureValue, ProductStructureLayerValue } from "../../../shared/types/productStructure.types";
import ProductStructureConfigurator from "./ProductStructureConfigurator";
import ValidStructureCombinationsModal from "../../../shared/components/modals/ValidStructureCombinationsModal";
import type { StructureCombinationOption } from "../../../shared/utils/productStructureCombinations";
import {
  buildStructureCompositionRows,
  calculateStructureGrammageWithVarnish,
  calculateTolerance,
} from "../../../shared/utils/structureCompositionRules";
import Button from "../../../shared/components/ui/Button";

interface MaterialsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    structureType: string;
    layers: Array<{
      material: string;
      micron: string;
      grammage: string;
    }>;
  }) => void;
  currentStructureType: string;
  currentLayers: {
    material: string;
    micron: string;
    grammage: string;
  }[];
  currentPrintClass: string;
  currentHasMatteFinishVarnish: boolean;
  currentHasInkProtectionVarnish: boolean;
  disabled?: boolean;
  inherited?: boolean;
  allowStructureChange?: boolean;
}

export default function MaterialsEditModal({
  isOpen,
  onClose,
  onSave,
  currentStructureType,
  currentLayers,
  currentPrintClass,
  currentHasMatteFinishVarnish,
  currentHasInkProtectionVarnish,
  disabled = false,
  inherited = false,
  allowStructureChange = true,
}: MaterialsEditModalProps) {
  // Estado temporal para el modal
  const [tempStructureType, setTempStructureType] = useState(currentStructureType);
  const [tempLayers, setTempLayers] = useState(
    currentLayers.map((layer) => ({
      materialCode: layer.material,
      micronRuleCode: "",
      micronValue: layer.micron,
    }))
  );
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showCombinationsModal, setShowCombinationsModal] = useState(false);

  // Sincronizar estado temporal cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setTempStructureType(currentStructureType);
      setTempLayers(
        currentLayers.map((layer) => ({
          materialCode: layer.material,
          micronRuleCode: "",
          micronValue: layer.micron,
        }))
      );
      setValidationAttempted(false);
      setValidationMessage("");
    }
  }, [isOpen, currentStructureType, currentLayers]);

  // Convertir a formato ProductStructureValue
  const productStructure: ProductStructureValue = useMemo(
    () => ({
      structureType: tempStructureType as any,
      layers: tempLayers,
    }),
    [tempStructureType, tempLayers]
  );

  // Determinar si estructura está completa
  const isStructureComplete = useMemo(() => {
    if (!productStructure.structureType) return false;

    const expectedLayerCount = {
      "Monocapa": 1,
      "Bilaminado": 2,
      "Trilaminado": 3,
      "Tetralaminado": 4,
    }[productStructure.structureType] || 0;

    return productStructure.layers
      .slice(0, expectedLayerCount)
      .every((layer) => layer.materialCode && layer.micronValue);
  }, [productStructure]);

  // Calcular tabla de composición para mostrar estado
  const compositionRows = useMemo(() => {
    if (!isStructureComplete) return [];

    try {
      return buildStructureCompositionRows({
        structureType: productStructure.structureType,
        layers: productStructure.layers.map((layer) => ({
          material: layer.materialCode,
          micron: layer.micronValue,
          grammage: "", // Se calculará automáticamente
        })),
        printClass: currentPrintClass,
        hasMatteFinishVarnish: currentHasMatteFinishVarnish,
        hasInkProtectionVarnish: currentHasInkProtectionVarnish,
      });
    } catch (error) {
      console.error("Error building structure composition:", error);
      return [];
    }
  }, [
    isStructureComplete,
    productStructure,
    currentPrintClass,
    currentHasMatteFinishVarnish,
    currentHasInkProtectionVarnish,
  ]);

  const totalGrammage = useMemo(
    () => calculateStructureGrammageWithVarnish(compositionRows),
    [compositionRows]
  );

  const tolerance = useMemo(
    () => calculateTolerance(totalGrammage),
    [totalGrammage]
  );

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
      return String(num);
    }
    return num.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
  };

  const handleStructureChange = (value: ProductStructureValue) => {
    setTempStructureType(value.structureType);
    setTempLayers(value.layers);
    setValidationMessage("");
  };

  const handleApplyCombination = (combination: StructureCombinationOption) => {
    if (!combination.canApply) return;

    // Mapear materialCodes a ProductStructureLayerValue
    const newLayers: ProductStructureLayerValue[] = combination.materialCodes.map(
      (materialCode, index) => {
        const previousLayer = tempLayers[index];
        const sameMaterial = previousLayer?.materialCode === materialCode;

        return {
          materialCode,
          micronRuleCode: sameMaterial ? previousLayer?.micronRuleCode ?? "" : "",
          micronValue: sameMaterial ? previousLayer?.micronValue ?? "" : "",
        };
      }
    );

    setTempStructureType(combination.structureType);
    setTempLayers(newLayers);
    setValidationMessage("");
    setShowCombinationsModal(false);
  };

  const handleValidateAndSave = () => {
    setValidationAttempted(true);

    if (!isStructureComplete) {
      setValidationMessage("⚠ Estructura incompleta. Completa todos los materiales y micrajes requeridos.");
      return;
    }

    if (!onSave) {
      setValidationMessage("✓ Cambios validados correctamente. La aplicación a la tabla se realizará en la Fase 2.");
      return;
    }

    // Construir objeto con datos a guardar
    const expectedLayerCount = {
      "Monocapa": 1,
      "Bilaminado": 2,
      "Trilaminado": 3,
      "Tetralaminado": 4,
    }[tempStructureType] || 0;

    const layersToSave = tempLayers
      .slice(0, expectedLayerCount)
      .map((layer, index) => {
        const row = compositionRows.find(
          (r) => r.type === "material" && r.layerNumber === String(index + 1)
        );
        return {
          material: layer.materialCode,
          micron: layer.micronValue,
          grammage: row ? String(row.grammage) : "",
        };
      });

    // Llamar callback con estructura actualizada
    onSave({
      structureType: tempStructureType,
      layers: layersToSave,
    });

    // Mostrar confirmación y cerrar
    setValidationMessage("✓ Materiales actualizados correctamente. Recuerde guardar el producto para conservar los cambios.");

    // Cerrar modal después de pequeño delay para que se vea el mensaje
    setTimeout(() => {
      setTempStructureType(currentStructureType);
      setTempLayers(
        currentLayers.map((layer) => ({
          materialCode: layer.material,
          micronRuleCode: "",
          micronValue: layer.micron,
        }))
      );
      setValidationAttempted(false);
      setValidationMessage("");
      onClose();
    }, 1500);
  };

  const handleCancel = () => {
    setTempStructureType(currentStructureType);
    setTempLayers(
      currentLayers.map((layer) => ({
        materialCode: layer.material,
        micronRuleCode: "",
        micronValue: layer.micron,
      }))
    );
    setValidationAttempted(false);
    setValidationMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Edición de materiales
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Configura la estructura y selecciona los materiales requeridos.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            {/* Configurador de estructura */}
            <div className="space-y-3">
              <ProductStructureConfigurator
                value={productStructure}
                onChange={handleStructureChange}
                disabled={disabled}
                inherited={inherited}
                allowStructureChange={allowStructureChange}
                showCoverageWarning={false}
                className="w-full"
                headerButton={
                  productStructure.structureType ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowCombinationsModal(true)}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Layers3 size={16} />
                        Consultar combinaciones
                      </span>
                    </Button>
                  ) : null
                }
              />

              {/* Estados de validación */}
              {productStructure.structureType && (
                <div className="space-y-2">
                  {!isStructureComplete ? (
                    <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
                      <p className="text-sm font-semibold text-yellow-700">
                        ⚠ Estructura incompleta
                      </p>
                      <p className="mt-1 text-xs text-yellow-600">
                        Completa los materiales de todas las capas requeridas.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3">
                      <p className="text-sm font-semibold text-green-700">
                        ✓ Estructura válida
                      </p>
                    </div>
                  )}

                  {/* Tabla de composición */}
                  {isStructureComplete && compositionRows.length > 0 && (
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-900 text-white">
                            <th className="px-3 py-2 text-left font-semibold">Capa</th>
                            <th className="px-3 py-2 text-left font-semibold">Material</th>
                            <th className="px-3 py-2 text-left font-semibold">Micraje</th>
                            <th className="px-3 py-2 text-right font-semibold">Gramaje (g/m²)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compositionRows.map((row) => {
                            let bgColor = "bg-white";
                            if (row.type === "ink") bgColor = "bg-purple-50";
                            if (row.type === "varnish") bgColor = "bg-blue-50";

                            return (
                              <tr key={row.id} className={`border-b border-slate-100 ${bgColor}`}>
                                <td className="px-3 py-2 font-medium text-slate-900">
                                  {row.layerNumber}
                                </td>
                                <td className="px-3 py-2 text-slate-700">{row.description}</td>
                                <td className="px-3 py-2 text-slate-600">{row.micron}</td>
                                <td className="px-3 py-2 text-right text-slate-900 font-medium">
                                  {formatNumber(row.grammage)}
                                </td>
                              </tr>
                            );
                          })}
                          {/* Total row */}
                          <tr className="bg-slate-100 font-semibold">
                            <td colSpan={3} className="px-3 py-2 text-right text-slate-900">
                              Gramaje total
                            </td>
                            <td className="px-3 py-2 text-right text-slate-900">
                              {formatNumber(totalGrammage)} g/m²
                            </td>
                          </tr>
                          {/* Tolerance row */}
                          <tr className="bg-slate-50">
                            <td colSpan={3} className="px-3 py-2 text-right text-slate-700">
                              Tolerancia ±10 %
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700">
                              ±{formatNumber(tolerance)} g/m²
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Mensaje de validación */}
              {validationMessage && (
                <div
                  className={`rounded-lg px-4 py-3 ${
                    validationMessage.includes("✓")
                      ? "border border-green-300 bg-green-50"
                      : "border border-yellow-300 bg-yellow-50"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      validationMessage.includes("✓")
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {validationMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>

          {/* Solicitar nueva combinación - mostrar si existe flujo */}
          {isStructureComplete && (
            <Button
              variant="outline"
              disabled={true}
              title="La solicitud de nuevas combinaciones estará disponible próximamente."
            >
              Solicitar nueva combinación
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleValidateAndSave}
            disabled={disabled}
          >
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* COMBINATIONS MODAL */}
      {productStructure.structureType && (
        <ValidStructureCombinationsModal
          isOpen={showCombinationsModal}
          structureType={productStructure.structureType}
          currentLayers={productStructure.layers}
          onApply={handleApplyCombination}
          onRequestNew={() => {
            // TODO: Implementar solicitud de nueva combinación en Fase 1
            console.log("Solicitar nueva combinación - no implementado en Fase 1");
          }}
          onClose={() => setShowCombinationsModal(false)}
        />
      )}
    </div>
  );
}
