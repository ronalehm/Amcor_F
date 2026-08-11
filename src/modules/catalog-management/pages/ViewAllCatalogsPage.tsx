import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  consolidateAllCatalogs,
  getAllCatalogIds,
} from "../../../shared/catalogs/catalogExtraction";
import { getEnrichedRestrictions } from "../utils/restrictionAdapters";
import { exportAllCatalogs, exportAllRestrictions, exportAllData } from "../services/catalogExportService";
import CatalogRestrictionTabs from "../components/CatalogRestrictionTabs";
import ExportMenu from "../components/ExportMenu";
import CatalogsExplorer from "../components/CatalogsExplorer";
import RestrictionsExplorer from "../components/RestrictionsExplorer";

export default function ViewAllCatalogsPage() {
  const { setHeader, resetHeader } = useLayout();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<"catalogs" | "restrictions">("catalogs");
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Data
  const allCatalogs = useMemo(() => consolidateAllCatalogs(), []);
  const catalogIds = useMemo(() => getAllCatalogIds(), [allCatalogs]);
  const restrictions = useMemo(() => getEnrichedRestrictions(), []);

  // Header
  useEffect(() => {
    setHeader({
      title: "Catálogos y Restricciones",
      breadcrumbs: [
        { label: "Inicio", href: "/dashboard" },
        { label: "Gestión de Catálogos y Restricciones", href: "/catalogs" },
        { label: "Ver todo" },
      ],
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

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

  const handleTabChange = (tab: "catalogs" | "restrictions") => {
    setActiveTab(tab);
    setShowExportMenu(false);
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] min-h-screen">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-700">
                Consulta los catálogos y restricciones vigentes. Las actualizaciones se realizan mediante plantilla desde Gestión.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/catalogs")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ← Volver a gestión
              </button>
              <ExportMenu
                isOpen={showExportMenu}
                onToggle={() => setShowExportMenu(!showExportMenu)}
                isExporting={isExporting}
                onExportCatalogs={handleExportCatalogs}
                onExportRestrictions={handleExportRestrictions}
                onExportAll={handleExportAll}
                restrictionCount={restrictions.length}
              />
            </div>
          </div>

          {/* Tabs */}
          <CatalogRestrictionTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            catalogCount={catalogIds.length}
            restrictionCount={restrictions.length}
          />
        </div>

        {/* Content */}
        <div className="px-6">
          {activeTab === "catalogs" ? (
            <CatalogsExplorer />
          ) : (
            <RestrictionsExplorer />
          )}
        </div>
      </div>
    </div>
  );
}
