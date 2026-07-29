import { Fragment, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Layers3,
  Search,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { resolveMaterialLayer } from "../../data/productMaterialCatalog";
import {
  getStructureLayerCount,
  type ProductStructureType,
} from "../../data/productStructureMatrix";
import type { ProductStructureLayerValue } from "../../types/productStructure.types";
import {
  findExactStructureCombination,
  getStructureCombinationsByType,
  rankStructureCombinations,
  structureCombinationMatchesSearch,
  type StructureCombinationOption,
  type StructureCombinationStatus,
} from "../../utils/productStructureCombinations";

type StatusFilter = "TODAS" | StructureCombinationStatus;

interface ValidStructureCombinationsModalProps {
  isOpen: boolean;
  structureType: ProductStructureType;
  currentLayers: ProductStructureLayerValue[];
  onApply: (combination: StructureCombinationOption) => void;
  onRequestNew: () => void;
  onClose: () => void;
}

const getMaterialName = (materialCode: string): string => {
  if (!materialCode) return "—";
  return resolveMaterialLayer(materialCode)?.TbMatCapNom ?? materialCode;
};

const getMaterialAbbreviation = (materialCode: string): string => {
  if (!materialCode) return "";
  return resolveMaterialLayer(materialCode)?.TbMatCapGmp ?? materialCode;
};

const getStructureAbbreviation = (materialCodes: string[]): string => {
  return materialCodes
    .map((code) => getMaterialAbbreviation(code))
    .join(" / ");
};

export default function ValidStructureCombinationsModal({
  isOpen,
  structureType,
  currentLayers,
  onApply,
  onRequestNew,
  onClose,
}: ValidStructureCombinationsModalProps) {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("TODAS");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCombinationId, setExpandedCombinationId] =
    useState<string | null>(null);

  const expectedLayerCount = getStructureLayerCount(structureType);

  const currentMaterialCodes = useMemo(
    () =>
      Array.from({ length: expectedLayerCount }).map(
        (_, index) => currentLayers[index]?.materialCode ?? "",
      ),
    [currentLayers, expectedLayerCount],
  );

  const allCombinations = useMemo(
    () => getStructureCombinationsByType(structureType),
    [structureType],
  );

  const rankedCombinations = useMemo(
    () =>
      rankStructureCombinations({
        structureType,
        selectedMaterialCodes: currentMaterialCodes,
      }),
    [structureType, currentMaterialCodes],
  );

  const exactMatch = useMemo(
    () =>
      findExactStructureCombination({
        structureType,
        selectedMaterialCodes: currentMaterialCodes,
      }),
    [structureType, currentMaterialCodes],
  );

  const visibleMatches = useMemo(
    () =>
      rankedCombinations.filter(({ combination }) => {
        const matchesStatus =
          statusFilter === "TODAS" ||
          combination.status === statusFilter;

        return (
          matchesStatus &&
          structureCombinationMatchesSearch(combination, searchTerm)
        );
      }),
    [rankedCombinations, searchTerm, statusFilter],
  );

  const validatedCount = allCombinations.filter(
    (combination) => combination.status === "VALIDADA",
  ).length;

  const pendingCount = allCombinations.filter(
    (combination) => combination.status === "PENDIENTE_NEGOCIO",
  ).length;

  const invalidCount = allCombinations.filter(
    (combination) => combination.status === "NO_VALIDADA",
  ).length;

  const hasCompleteCurrentSequence =
    expectedLayerCount > 0 &&
    currentMaterialCodes.length === expectedLayerCount &&
    currentMaterialCodes.every(Boolean);

  const currentSequenceLabel = currentMaterialCodes
    .map(getMaterialName)
    .join(" → ");

  const showRequestNew =
    hasCompleteCurrentSequence && exactMatch === null;

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[10030] flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="flex max-h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-brand-primary" />
              <h3 className="text-lg font-bold text-slate-900">
                Combinaciones para {structureType || "la estructura"}
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Se respeta la secuencia exacta de Capa 1 hacia la última capa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar combinaciones"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 border-b border-slate-200 bg-slate-50/70 px-6 py-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Selección actual
            </span>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {currentMaterialCodes.some(Boolean)
                ? currentSequenceLabel
                : "Sin materiales seleccionados"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-green-200 bg-green-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Validadas
              </span>
              <p className="mt-1 text-xl font-bold text-green-800">
                {validatedCount}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                En validación
              </span>
              <p className="mt-1 text-xl font-bold text-amber-800">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-red-700">
                No válidas
              </span>
              <p className="mt-1 text-xl font-bold text-red-800">
                {invalidCount}
              </p>
            </div>
          </div>

          {showRequestNew && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <div>
                  <p className="text-xs font-bold text-red-800">
                    La secuencia seleccionada no está registrada.
                  </p>
                  <p className="mt-0.5 text-xs text-red-700">
                    Revise las alternativas similares o solicite una nueva estructura.
                  </p>
                </div>
              </div>

              <Button variant="outline" onClick={onRequestNew}>
                Solicitar nueva estructura
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar material, código o secuencia..."
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {([
                ["TODAS", `Todas (${allCombinations.length})`],
                ["VALIDADA", `Validadas (${validatedCount})`],
                [
                  "PENDIENTE_NEGOCIO",
                  `En validación (${pendingCount})`,
                ],
                [
                  "NO_VALIDADA",
                  `No válidas (${invalidCount})`,
                ],
              ] as Array<[StatusFilter, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    statusFilter === value
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {visibleMatches.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
              <Layers3 className="h-9 w-9 text-slate-400" />
              <h4 className="mt-3 text-sm font-bold text-slate-800">
                No se encontraron combinaciones con este filtro.
              </h4>
              <p className="mt-1 max-w-xl text-xs text-slate-500">
                Limpie la búsqueda o cambie el filtro de estado. Cuando la secuencia completa no exista, puede solicitar su homologación.
              </p>
              {showRequestNew && (
                <div className="mt-4">
                  <Button variant="primary" onClick={onRequestNew}>
                    Solicitar nueva estructura
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="min-w-40 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                        Código
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                        Materiales
                      </th>
                      <th className="min-w-32 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                        Estructura
                      </th>
                      <th className="min-w-28 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
                        Estado
                      </th>
                      <th className="min-w-20 px-4 py-2.5 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {visibleMatches.map((match) => {
                      const { combination } = match;
                      const isExpanded =
                        expandedCombinationId === combination.id;

                      return (
                        <Fragment key={combination.id}>
                          <tr
                            className="align-middle transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-2.5">
                              <span className="font-mono text-sm font-bold text-brand-primary">
                                {combination.materialCodes.join("|")}
                              </span>
                            </td>

                            <td className="px-4 py-2.5 text-sm text-slate-900">
                              {combination.materialNames.join(expectedLayerCount > 1 ? " / " : "")}
                            </td>

                            <td className="px-4 py-2.5 text-sm">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono font-bold text-slate-800">
                                {getStructureAbbreviation(combination.materialCodes)}
                              </span>
                            </td>

                            <td className="px-4 py-2.5 text-center">
                              {combination.status === "VALIDADA" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800">
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Validada
                                </span>
                              ) : combination.status === "NO_VALIDADA" ? (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-800">
                                  No válida
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                                  En validación
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-2.5 text-right">
                              {combination.canApply ? (
                                <Button
                                  variant="primary"
                                  onClick={() => onApply(combination)}
                                  size="sm"
                                >
                                  Usar
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setExpandedCombinationId(
                                      isExpanded ? null : combination.id,
                                    )
                                  }
                                  size="sm"
                                >
                                  {isExpanded ? "Ocultar" : "Ver"}
                                </Button>
                              )}
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-amber-50/70">
                              <td
                                colSpan={5}
                                className="px-4 py-3"
                              >
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                                  <div>
                                    <p className="text-xs font-bold text-amber-800">
                                      Pendiente de validación con negocio
                                    </p>
                                    <p className="mt-1 text-xs text-amber-700">
                                      {combination.pendingReason ||
                                        "La combinación requiere completar su homologación técnica."}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          {showRequestNew && (
            <Button variant="outline" onClick={onRequestNew}>
              Solicitar nueva estructura
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}