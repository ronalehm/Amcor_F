import { useState, useMemo, useEffect } from "react";
import { Download, ChevronDown, AlertCircle } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getCurrentUser } from "../../../shared/data/userStorage";
import { getAvailableRestrictions } from "../services/catalogRestrictionService";
import {
  consolidateAllCatalogs,
  getAllCatalogIds,
  calculateCatalogDiff,
  type ConsolidatedCatalog,
  type CatalogValue,
} from "../../../shared/catalogs/catalogExtraction";
import RestrictionsList from "../components/RestrictionsList";
import { exportAllCatalogs, exportAllRestrictions, exportAllData } from "../services/catalogExportService";

export default function ViewAllCatalogsPage() {
  const { setHeader, resetHeader } = useLayout();
  const currentUser = getCurrentUser();

  // State
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [mergeStrategy, setMergeStrategy] = useState<"overwrite" | "keep" | "selective">("selective");
  const [showDiff, setShowDiff] = useState(true);

  // Data
  const allCatalogs = useMemo(() => consolidateAllCatalogs(), []);
  const catalogIds = useMemo(() => getAllCatalogIds(), [allCatalogs]);
  const restrictions = useMemo(() => getAvailableRestrictions(), []);

  // Get selected catalog
  const selectedCatalog = selectedCatalogId ? allCatalogs[selectedCatalogId] : null;

  // Export handlers
  const handleExportCatalogs = async () => {
    setIsExporting(true);
    try {
      await exportAllCatalogs();
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportRestrictions = async () => {
    setIsExporting(true);
    try {
      await exportAllRestrictions();
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportAllData();
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleAddValue = () => {
    if (!selectedCatalog) return;
    // TODO: Implement add value dialog
    console.log("Add value to:", selectedCatalog.id);
  };

  const handleEditValue = (value: CatalogValue) => {
    if (!selectedCatalog) return;
    // TODO: Implement edit value dialog
    console.log("Edit value:", value.code);
  };

  const handleDeleteValue = (valueCode: string) => {
    if (!selectedCatalog) return;
    // TODO: Implement delete value confirmation
    console.log("Delete value:", valueCode);
  };

  const handleSaveCatalog = () => {
    if (!selectedCatalog) return;

    if (selectedCatalog.source === "SISTEMA_INTEGRAL") {
      console.log("SI catalogs are read-only");
      return;
    }

    // ODISEO: Save logic
    // 1. Validate all values
    // 2. Save to storage
    // 3. Log audit trail
    // 4. Show success message

    console.log("Saving ODISEO catalog:", selectedCatalog.id);
  };

  const handleClearSelection = () => {
    setSelectedCatalogId("");
    setMergeStrategy("selective");
  };

  // Header
  useEffect(() => {
    setHeader({
      title: "Gestión de Catálogos",
      breadcrumbs: [
        { label: "Inicio", href: "/dashboard" },
        { label: "Gestión de Catálogos" },
      ],
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const getCatalogLabel = (catalogId: string): string => {
    const catalog = allCatalogs[catalogId];
    return catalog?.name || catalogId;
  };

  const getCatalogSource = (catalogId: string) => {
    const catalog = allCatalogs[catalogId];
    return catalog?.source || "UNKNOWN";
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Gestión de Catálogos</h2>
            <p className="text-sm text-slate-600 mt-1">
              Selecciona UN catálogo para editar, pre-poblado desde ProductEditPage y PortfolioEditPage
            </p>
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Exportar
              <ChevronDown size={16} className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                <button
                  onClick={handleExportCatalogs}
                  disabled={isExporting}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 first:rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-semibold">Descargar catálogos</div>
                  <div className="text-xs text-slate-500">Exporta todos los catálogos en Excel</div>
                </button>

                <button
                  onClick={handleExportRestrictions}
                  disabled={isExporting || restrictions.length === 0}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-semibold">Descargar restricciones</div>
                  <div className="text-xs text-slate-500">Exporta restricciones en Excel</div>
                </button>

                <button
                  onClick={handleExportAll}
                  disabled={isExporting}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-semibold">Descargar todo</div>
                  <div className="text-xs text-slate-500">Catálogos + Restricciones</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          {/* ═══════ LEFT: CATALOG SELECTOR ═══════ */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 h-fit lg:sticky lg:top-20">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Seleccionar Catálogo
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {catalogIds.length} catálogos disponibles
            </p>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {catalogIds.map((catalogId) => (
                <label
                  key={catalogId}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                >
                  <input
                    type="radio"
                    name="selectedCatalog"
                    value={catalogId}
                    checked={selectedCatalogId === catalogId}
                    onChange={() => setSelectedCatalogId(catalogId)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">
                      {getCatalogLabel(catalogId)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {getCatalogSource(catalogId) === "ODISEO" && (
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          ODISEO
                        </span>
                      )}
                      {getCatalogSource(catalogId) === "PORTFOLIO" && (
                        <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          Portfolio
                        </span>
                      )}
                      {getCatalogSource(catalogId) === "SISTEMA_INTEGRAL" && (
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          SI
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ═══════ RIGHT: CATALOG EDITOR ═══════ */}
          <div className="space-y-6">
            {selectedCatalog ? (
              <>
                {/* Header */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedCatalog.name}
                      </h2>
                      <p className="text-sm text-slate-600 mt-2">
                        {selectedCatalog.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-500 uppercase">
                        {selectedCatalog.source}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {selectedCatalog.pageOrigin}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500">Total de valores</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {selectedCatalog.values.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Versión</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {selectedCatalog.version}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Editable</div>
                      <div className={`text-sm font-semibold ${selectedCatalog.editable ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCatalog.editable ? "Sí" : "No"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Fuente</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {selectedCatalog.pageOrigin === "ProductEditPage" ? "Product" : "Portfolio"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ODISEO Only: Merge Strategy */}
                {selectedCatalog.editable && (
                  <div className="rounded-lg border border-slate-200 bg-white p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Estrategia de Actualización
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                        <input
                          type="radio"
                          name="mergeStrategy"
                          value="overwrite"
                          checked={mergeStrategy === "overwrite"}
                          onChange={() => setMergeStrategy("overwrite")}
                        />
                        <div>
                          <div className="font-semibold text-sm">Reemplazar todo</div>
                          <div className="text-xs text-slate-500">Usa todos los valores de la fuente</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                        <input
                          type="radio"
                          name="mergeStrategy"
                          value="keep"
                          checked={mergeStrategy === "keep"}
                          onChange={() => setMergeStrategy("keep")}
                        />
                        <div>
                          <div className="font-semibold text-sm">Mantener existentes</div>
                          <div className="text-xs text-slate-500">Ignora nuevos valores de la fuente</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                        <input
                          type="radio"
                          name="mergeStrategy"
                          value="selective"
                          checked={mergeStrategy === "selective"}
                          onChange={() => setMergeStrategy("selective")}
                          className="accent-brand-primary"
                        />
                        <div>
                          <div className="font-semibold text-sm">Fusión selectiva</div>
                          <div className="text-xs text-slate-500">Elige qué valores agregar/actualizar</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Values List */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      Valores del Catálogo ({selectedCatalog.values.length})
                    </h3>
                    {selectedCatalog.editable && (
                      <button
                        onClick={handleAddValue}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                      >
                        <span>+</span>
                        Agregar
                      </button>
                    )}
                  </div>

                  {selectedCatalog.source === "SISTEMA_INTEGRAL" && (
                    <div className="p-3 rounded bg-gray-50 border border-gray-200 mb-4">
                      <div className="text-sm text-gray-700">
                        🔒 <strong>Lectura solamente.</strong> Los valores del Sistema Integral no se pueden modificar aquí.
                      </div>
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {selectedCatalog.values.map((value) => (
                      <div
                        key={value.code}
                        className="p-3 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-xs text-slate-500">
                              {value.code}
                            </div>
                            <div className="font-semibold text-slate-900">
                              {value.label}
                            </div>
                            {value.description && (
                              <div className="text-xs text-slate-600 mt-1">
                                {value.description}
                              </div>
                            )}
                          </div>

                          {selectedCatalog.editable && (
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => handleEditValue(value)}
                                className="p-1 rounded hover:bg-white text-slate-600 hover:text-blue-600 transition-colors"
                                title="Editar"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteValue(value.code)}
                                className="p-1 rounded hover:bg-white text-slate-600 hover:text-red-600 transition-colors"
                                title="Eliminar"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  {selectedCatalog.editable ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleClearSelection}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveCatalog}
                        className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleClearSelection}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cerrar
                      </button>
                      <div className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-semibold text-center cursor-not-allowed">
                        🔒 Solo Lectura
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
                <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Selecciona un catálogo
                </h3>
                <p className="text-sm text-slate-600">
                  Elige uno de los {catalogIds.length} catálogos disponibles para comenzar
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Restrictions Section */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Restricciones</h3>
            <p className="text-sm text-slate-600 mt-1">
              {restrictions.length} restricción{restrictions.length !== 1 ? "es" : ""} disponible{restrictions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <RestrictionsList restrictions={restrictions} />
        </div>
      </div>
    </div>
  );
}
