import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  Download,
  RotateCcw,
  Package,
  Lock,
  CheckCircle,
  Eye,
  ChevronDown,
  History,
  Pencil,
} from "lucide-react";
import ActionButton from "../../../shared/components/buttons/ActionButton";
import { CATALOG_REGISTRY } from "../../../shared/catalogs/catalog.registry";
import { getCatalogValues } from "../../../shared/catalogs/catalog.service";
import { CatalogDetailModal } from "../components/CatalogDetailModal";
import { CatalogEditModal } from "../components/CatalogEditModal";
import { RestrictionsEditModal } from "../components/RestrictionsEditModal";
import { CatalogChangeLogTable } from "../components/CatalogChangeLogTable";
import { CatalogChangeLogModal } from "../components/CatalogChangeLogModal";
import {
  getDimensionRestrictions,
  getValidationRestrictions,
} from "../../../shared/data/restrictionCatalogsStorage";
import type { CatalogDefinition } from "../../../shared/catalogs/catalog.types";

type ViewType = "catalogs" | "restrictions";
type TabFilter = "todos" | "dimension" | "validation";

interface CatalogRowData {
  catCode: string;
  catalog: CatalogDefinition;
  totalCount: number;
  activosCount: number;
  inactivosCount: number;
  bloqueadosCount: number;
  isEditable: boolean;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

interface RestrictionRowData {
  id: string;
  code: string;
  name: string;
  category: string;
  type: "dimension" | "validation";
  description: string;
  rule: string;
  status: string;
  updatedAt: string;
}

export function CatalogsViewPage() {
  const [viewType, setViewType] = useState<ViewType>("catalogs");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("todos");

  // Estados separados: selección visual vs. modales
  const [selectedRow, setSelectedRow] = useState<CatalogRowData | RestrictionRowData | null>(null);
  const [detailRow, setDetailRow] = useState<CatalogRowData | RestrictionRowData | null>(null);
  const [editRow, setEditRow] = useState<CatalogRowData | RestrictionRowData | null>(null);

  // Visibilidad de modales
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCatalogEditModal, setShowCatalogEditModal] = useState(false);
  const [showRestrictionEditModal, setShowRestrictionEditModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [showChangeLogModal, setShowChangeLogModal] = useState(false);

  // Datos para bitácora
  const [changeLogData, setChangeLogData] = useState<CatalogRowData | null>(null);

  const handleViewTypeChange = (newViewType: ViewType) => {
    if (newViewType !== viewType) {
      setViewType(newViewType);
      setSearchQuery("");
      setSelectedRow(null);
      setDetailRow(null);
      setEditRow(null);
      setActiveTab("todos");
    }
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return "Sin información";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "—";
    }
  };

  // ====== DATOS DE CATÁLOGOS ======
  const catalogsData = useMemo(() => {
    return CATALOG_REGISTRY.map((catalog, index) => {
      const catCode = `CAT-${String(index + 1).padStart(3, "0")}`;
      const values = getCatalogValues(catalog.code) || [];
      const countByStatus = {
        activos: values.filter((v) => v.status === "Activo").length,
        inactivos: values.filter((v) => v.status === "Inactivo").length,
        bloqueados: values.filter((v) => v.status === "Bloqueado").length,
      };
      const maxUpdatedAt = values
        .filter((v) => v.updatedAt)
        .map((v) => new Date(v.updatedAt!).getTime())
        .reduce((max, current) => Math.max(max, current), 0);
      const lastUpdatedAt = maxUpdatedAt > 0 ? new Date(maxUpdatedAt) : new Date();
      return {
        catCode,
        catalog,
        totalCount: values.length,
        activosCount: countByStatus.activos,
        inactivosCount: countByStatus.inactivos,
        bloqueadosCount: countByStatus.bloqueados,
        isEditable: catalog.ownerSystem === "ODISEO",
        lastUpdatedAt: formatDateTime(lastUpdatedAt.toISOString()),
        lastUpdatedBy: catalog.ownerSystem === "ODISEO" ? "ODISEO" : "SISTEMA",
      };
    });
  }, []);

  // ====== DATOS DE RESTRICCIONES ======
  const dimensionRestrictions = useMemo(() => getDimensionRestrictions() || [], []);
  const validationRestrictions = useMemo(() => getValidationRestrictions() || [], []);

  const restrictionsData = useMemo(() => {
    const dimensions = dimensionRestrictions.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      category: r.productType,
      type: "dimension" as const,
      description: `Formato: ${r.formatPlan}`,
      rule: `Ancho: ${r.ancho?.min || 0}-${r.ancho?.max || 0}, Largo: ${r.largo?.min || 0}-${r.largo?.max || 0}`,
      status: r.status,
      updatedAt: formatDateTime(),
    }));

    const validations = validationRestrictions.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      category: r.productType,
      type: "validation" as const,
      description: `Validación: ${r.name}`,
      rule: `Regla de validación`,
      status: r.status,
      updatedAt: formatDateTime(),
    }));

    return [...dimensions, ...validations];
  }, [dimensionRestrictions, validationRestrictions]);

  // ====== PESTAÑAS DINÁMICAS ======
  const tabs = viewType === "catalogs"
    ? [
        { key: "todos", label: "Todos los catálogos", count: catalogsData.length },
        { key: "dimension", label: "ODISEO", count: catalogsData.filter((c) => c.isEditable).length },
        { key: "validation", label: "Sistema Integral", count: catalogsData.filter((c) => !c.isEditable).length },
      ]
    : [
        { key: "todos", label: "Todas las restricciones", count: restrictionsData.length },
        { key: "dimension", label: "Dimensiones", count: dimensionRestrictions.length },
        { key: "validation", label: "Validaciones", count: validationRestrictions.length },
      ];

  // ====== FILTRADO DINÁMICO ======
  const filteredData = useMemo(() => {
    if (viewType === "catalogs") {
      return catalogsData.filter((item) => {
        const matchesSearch =
          searchQuery === "" ||
          item.catCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.catalog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.catalog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.catalog.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
          activeTab === "todos" ||
          (activeTab === "dimension" && item.isEditable) ||
          (activeTab === "validation" && !item.isEditable);

        return matchesSearch && matchesTab;
      });
    } else {
      return restrictionsData.filter((item) => {
        const matchesSearch =
          searchQuery === "" ||
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.rule.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
          activeTab === "todos" ||
          (activeTab === "dimension" && item.type === "dimension") ||
          (activeTab === "validation" && item.type === "validation");

        return matchesSearch && matchesTab;
      });
    }
  }, [viewType, searchQuery, activeTab, catalogsData, restrictionsData]);

  // ====== ESTADÍSTICAS ======
  const stats = useMemo(() => ({
    total: catalogsData.length,
    odiseo: catalogsData.filter((c) => c.isEditable).length,
    si: catalogsData.filter((c) => !c.isEditable).length,
    restrictions: restrictionsData.filter((r) => r.status === "Activo").length,
  }), [catalogsData, restrictionsData]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTab("todos");
  };

  // ====== DESCARGAS ======
  const downloadAllCatalogsExcel = () => {
    const data = catalogsData.map((row) => ({
      "Código": row.catCode,
      "Nombre": row.catalog.name,
      "Total": row.totalCount,
      "Activos": row.activosCount,
      "Inactivos": row.inactivosCount,
      "Bloqueados": row.bloqueadosCount,
      "Sistema": row.isEditable ? "ODISEO" : "SI",
      "Actualizado por": row.lastUpdatedBy,
      "Fecha": row.lastUpdatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Catálogos");
    applyStyles(ws);
    XLSX.writeFile(wb, `Catalogos_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const downloadFilteredCatalogsExcel = () => {
    const data = filteredData.map((row: any) => ({
      "Código": row.catCode,
      "Nombre": row.catalog.name,
      "Total": row.totalCount,
      "Activos": row.activosCount,
      "Inactivos": row.inactivosCount,
      "Bloqueados": row.bloqueadosCount,
      "Sistema": row.isEditable ? "ODISEO" : "SI",
      "Actualizado por": row.lastUpdatedBy,
      "Fecha": row.lastUpdatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Catálogos");
    applyStyles(ws);
    XLSX.writeFile(wb, `Catalogos_filtrados_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const downloadAllRestrictionsExcel = () => {
    const data = restrictionsData.map((row) => ({
      "Código": row.code,
      "Nombre": row.name,
      "Categoría": row.category,
      "Tipo": row.type === "dimension" ? "Dimensión" : "Validación",
      "Descripción": row.description,
      "Regla": row.rule,
      "Estado": row.status,
      "Actualizado": row.updatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Restricciones");
    applyStyles(ws);
    XLSX.writeFile(wb, `Restricciones_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const downloadFilteredRestrictionsExcel = () => {
    const data = filteredData.map((row: any) => ({
      "Código": row.code,
      "Nombre": row.name,
      "Categoría": row.category,
      "Tipo": row.type === "dimension" ? "Dimensión" : "Validación",
      "Descripción": row.description,
      "Regla": row.rule,
      "Estado": row.status,
      "Actualizado": row.updatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Restricciones");
    applyStyles(ws);
    XLSX.writeFile(wb, `Restricciones_filtradas_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const downloadCombinedExcel = () => {
    // Catálogos
    const catalogsData_export = catalogsData.map((row) => ({
      "Código": row.catCode,
      "Nombre": row.catalog.name,
      "Total": row.totalCount,
      "Activos": row.activosCount,
      "Inactivos": row.inactivosCount,
      "Bloqueados": row.bloqueadosCount,
      "Sistema": row.isEditable ? "ODISEO" : "SI",
      "Actualizado por": row.lastUpdatedBy,
      "Fecha": row.lastUpdatedAt,
    }));

    // Restricciones
    const restrictionsData_export = restrictionsData.map((row) => ({
      "Código": row.code,
      "Nombre": row.name,
      "Categoría": row.category,
      "Tipo": row.type === "dimension" ? "Dimensión" : "Validación",
      "Descripción": row.description,
      "Regla": row.rule,
      "Estado": row.status,
      "Actualizado": row.updatedAt,
    }));

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(catalogsData_export);
    const ws2 = XLSX.utils.json_to_sheet(restrictionsData_export);

    XLSX.utils.book_append_sheet(wb, ws1, "Catálogos");
    XLSX.utils.book_append_sheet(wb, ws2, "Restricciones");

    applyStyles(ws1);
    applyStyles(ws2);

    XLSX.writeFile(wb, `Catalogos_Restricciones_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const applyStyles = (ws: XLSX.WorkSheet) => {
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    const headerColor = "#1F4E78";
    const headerFont = "FFFFFF";
    const evenRowColor = "#F2F2F2";
    const borderColor = "#000000";
    const dataBorderColor = "#CCCCCC";

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (ws[address]) {
        ws[address].s = {
          fill: { fgColor: { rgb: headerColor } },
          font: { bold: true, color: { rgb: headerFont }, size: 11 },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: borderColor } },
            bottom: { style: "thin", color: { rgb: borderColor } },
            left: { style: "thin", color: { rgb: borderColor } },
            right: { style: "thin", color: { rgb: borderColor } },
          },
        };
      }
    }

    for (let R = 2; R <= range.e.r + 1; ++R) {
      const isEvenRow = (R - 2) % 2 === 0;
      const rowColor = isEvenRow ? evenRowColor : "FFFFFF";
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + R;
        if (ws[address]) {
          ws[address].s = {
            fill: { fgColor: { rgb: rowColor } },
            font: { size: 10 },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: dataBorderColor } },
              bottom: { style: "thin", color: { rgb: dataBorderColor } },
              left: { style: "thin", color: { rgb: dataBorderColor } },
              right: { style: "thin", color: { rgb: dataBorderColor } },
            },
          };
        }
      }
    }

    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const address = XLSX.utils.encode_col(C) + (R + 1);
        if (ws[address] && ws[address].v) {
          maxLength = Math.max(maxLength, String(ws[address].v).length);
        }
      }
      colWidths.push({ wch: Math.min(maxLength + 2, 50) });
    }
    ws["!cols"] = colWidths;
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    ws["!autofilter"] = { ref: ws["!ref"] };
  };

  return (
    <div className="w-full max-w-none">
      <>
        {/* CARDS DE RESUMEN - SIEMPRE VISIBLES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total de Catálogos</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.total}</p>
                <p className="mt-1 text-xs text-slate-500">Registrados en plataforma</p>
              </div>
              <div className="rounded-xl bg-brand-secondary-soft p-3 text-brand-primary">
                <Package size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">ODISEO</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.odiseo}</p>
                <p className="mt-1 text-xs text-slate-500">Catálogos modificables</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">Sistema Integral</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.si}</p>
                <p className="mt-1 text-xs text-slate-500">Catálogos de lectura</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Lock size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Restricciones Registradas</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{restrictionsData.length}</p>
                <p className="mt-1 text-xs text-slate-500">En el sistema</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* SELECTOR TIPO DE INFORMACIÓN - SIEMPRE VISIBLE */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/50">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Tipo de información
              </label>
              <select
                value={viewType}
                onChange={(e) => handleViewTypeChange(e.target.value as ViewType)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors hover:border-slate-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              >
                <option value="catalogs">Catálogos</option>
                <option value="restrictions">Restricciones</option>
              </select>
            </div>
          </div>

          {/* PESTAÑAS DINÁMICAS */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex max-w-full gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabFilter)}
                  className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
                    activeTab === tab.key
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-slate-500 hover:text-brand-primary"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      activeTab === tab.key
                        ? "bg-brand-secondary-soft text-brand-primary"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <p className="pb-3 text-xs font-medium text-slate-500">
              Mostrando {filteredData.length} de {viewType === "catalogs" ? catalogsData.length : restrictionsData.length}
            </p>
          </div>

          {/* BUSCADOR Y ACCIONES */}
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-[340px]">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    viewType === "catalogs"
                      ? "Buscar por código, nombre, descripción..."
                      : "Buscar por código, nombre, categoría, descripción o regla..."
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ActionButton
                  label="Limpiar Filtros"
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw size={16} />}
                />

                <div className="relative">
                  <button
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-primary/90"
                  >
                    <Download size={16} />
                    Descargar
                    <ChevronDown size={16} />
                  </button>

                  {showDownloadMenu && (
                    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                      {viewType === "catalogs" ? (
                        <>
                          <button
                            onClick={downloadAllCatalogsExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 first:rounded-t-lg"
                          >
                            <div className="font-medium">✓ Todos los Catálogos</div>
                            <div className="text-xs text-slate-500">Descarga completa (Excel)</div>
                          </button>
                          <button
                            onClick={downloadFilteredCatalogsExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                          >
                            <div className="font-medium">Catálogos Filtrados</div>
                            <div className="text-xs text-slate-500">Según búsqueda/filtros (Excel)</div>
                          </button>
                          <button
                            onClick={downloadAllRestrictionsExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                          >
                            <div className="font-medium">Todas las Restricciones</div>
                            <div className="text-xs text-slate-500">Vínculo cruzado (Excel)</div>
                          </button>
                          <button
                            onClick={downloadCombinedExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-b-lg"
                          >
                            <div className="font-medium">Catálogos + Restricciones</div>
                            <div className="text-xs text-slate-500">Ambos en un Excel (2 hojas)</div>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={downloadAllRestrictionsExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 first:rounded-t-lg"
                          >
                            <div className="font-medium">✓ Todas las Restricciones</div>
                            <div className="text-xs text-slate-500">Descarga completa (Excel)</div>
                          </button>
                          <button
                            onClick={downloadFilteredRestrictionsExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                          >
                            <div className="font-medium">Restricciones Filtradas</div>
                            <div className="text-xs text-slate-500">Según búsqueda/filtros (Excel)</div>
                          </button>
                          <button
                            onClick={downloadAllCatalogsExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                          >
                            <div className="font-medium">Todos los Catálogos</div>
                            <div className="text-xs text-slate-500">Vínculo cruzado (Excel)</div>
                          </button>
                          <button
                            onClick={downloadCombinedExcel}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-b-lg"
                          >
                            <div className="font-medium">Catálogos + Restricciones</div>
                            <div className="text-xs text-slate-500">Ambos en un Excel (2 hojas)</div>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABLA ÚNICA DINÁMICA */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">
                {viewType === "catalogs"
                  ? "No se encontraron catálogos con los filtros seleccionados."
                  : "No se encontraron restricciones con los filtros seleccionados."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-brand-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Código</th>
                    {viewType === "catalogs" ? (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Nombre</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Activos</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Inactivos</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Bloqueados</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Sistema</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Categoría</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Descripción / Regla</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Actualización</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((row, idx) => (
                    <tr
                      key={viewType === "catalogs" ? (row as CatalogRowData).catCode : (row as RestrictionRowData).id}
                      className={`cursor-pointer transition-colors ${
                        selectedRow === row ? "bg-brand-secondary-soft" : idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                      } hover:bg-slate-100`}
                      onClick={() => setSelectedRow(row)}
                    >
                      <td className="px-4 py-3 text-sm font-mono font-medium text-slate-600">
                        {viewType === "catalogs" ? (row as CatalogRowData).catCode : (row as RestrictionRowData).code}
                      </td>
                      {viewType === "catalogs" ? (
                        <>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            {(row as CatalogRowData).catalog.name}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-slate-900">
                            {(row as CatalogRowData).totalCount}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">
                            {(row as CatalogRowData).activosCount}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-orange-600 font-medium">
                            {(row as CatalogRowData).inactivosCount}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-red-600 font-medium">
                            {(row as CatalogRowData).bloqueadosCount}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              (row as CatalogRowData).isEditable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-purple-100 text-purple-700"
                            }`}>
                              {(row as CatalogRowData).isEditable ? "ODISEO" : "SI"}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            {(row as RestrictionRowData).name}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {(row as RestrictionRowData).category}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              (row as RestrictionRowData).type === "dimension"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {(row as RestrictionRowData).type === "dimension" ? "Dimensión" : "Validación"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {(row as RestrictionRowData).rule}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (row as any).status === "Activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}>
                          {(row as any).status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {viewType === "catalogs" ? (row as CatalogRowData).lastUpdatedAt : (row as RestrictionRowData).updatedAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            title="Histórico"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (viewType === "catalogs" && "catCode" in row) {
                                setChangeLogData(row as CatalogRowData);
                                setShowChangeLogModal(true);
                              }
                            }}
                            disabled={viewType !== "catalogs"}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <History size={16} />
                          </button>

                          <button
                            type="button"
                            title="Editar"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditRow(row);
                              if (viewType === "catalogs" && "catCode" in row) {
                                setShowCatalogEditModal(true);
                              } else if (viewType === "restrictions" && "id" in row) {
                                setShowRestrictionEditModal(true);
                              }
                            }}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title="Ver detalle"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailRow(row);
                              setShowDetailModal(true);
                            }}
                            className="rounded-lg bg-brand-primary p-2 text-white transition-colors hover:bg-brand-primary/90"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BITÁCORA DE CAMBIOS */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <History size={28} className="text-brand-primary" />
                Bitácora de Cambios
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {viewType === "catalogs"
                  ? "Registro de todos los cambios realizados a los catálogos"
                  : "Bitácora de restricciones (próximamente)"}
              </p>
            </div>
            <button
              onClick={() => setShowChangeLog(!showChangeLog)}
              disabled={viewType !== "catalogs"}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                showChangeLog
                  ? "border-brand-primary bg-brand-secondary-soft text-brand-primary"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {showChangeLog ? "Ocultar" : "Mostrar"} Bitácora
            </button>
          </div>

          {showChangeLog && viewType === "catalogs" && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <CatalogChangeLogTable />
            </div>
          )}
        </div>
      </>

      {/* MODAL DE DETALLES */}
      {showDetailModal && detailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-bold text-slate-900">Detalles</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailRow(null);
                }}
                className="rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {viewType === "catalogs" && "catCode" in detailRow ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                      <p className="text-sm font-mono text-slate-900">{detailRow.catCode}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Nombre</p>
                      <p className="text-sm text-slate-900">{detailRow.catalog.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Total</p>
                      <p className="text-sm font-bold text-slate-900">{detailRow.totalCount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Activos</p>
                      <p className="text-sm font-bold text-green-600">{detailRow.activosCount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Inactivos</p>
                      <p className="text-sm font-bold text-orange-600">{detailRow.inactivosCount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Bloqueados</p>
                      <p className="text-sm font-bold text-red-600">{detailRow.bloqueadosCount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Sistema</p>
                      <p className="text-sm">{detailRow.isEditable ? "ODISEO" : "Sistema Integral"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Última Actualización</p>
                      <p className="text-sm text-slate-600">{detailRow.lastUpdatedAt}</p>
                    </div>
                  </div>
                </div>
              ) : viewType === "restrictions" && "id" in detailRow ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                      <p className="text-sm font-mono text-slate-900">{detailRow.code}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Nombre</p>
                      <p className="text-sm text-slate-900">{detailRow.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Categoría</p>
                      <p className="text-sm text-slate-900">{detailRow.category}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Tipo</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        detailRow.type === "dimension"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {detailRow.type === "dimension" ? "Dimensión" : "Validación"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Estado</p>
                      <p className="text-sm text-slate-900">{detailRow.status}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Actualizado</p>
                      <p className="text-sm text-slate-600">{detailRow.updatedAt}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Descripción</p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{detailRow.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Regla</p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{detailRow.rule}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailRow(null);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALES DE EDICIÓN */}
      <CatalogEditModal
        isOpen={showCatalogEditModal}
        onClose={() => {
          setShowCatalogEditModal(false);
          setEditRow(null);
        }}
        onUploadSuccess={() => {
          setShowCatalogEditModal(false);
          setEditRow(null);
        }}
      />

      <RestrictionsEditModal
        isOpen={showRestrictionEditModal}
        onClose={() => {
          setShowRestrictionEditModal(false);
          setEditRow(null);
        }}
        onUploadSuccess={() => {
          setShowRestrictionEditModal(false);
          setEditRow(null);
        }}
      />

      {/* MODAL BITÁCORA */}
      {changeLogData && (
        <CatalogChangeLogModal
          isOpen={showChangeLogModal}
          catalogCode={changeLogData.catalog.code}
          catalogName={changeLogData.catalog.name}
          onClose={() => {
            setShowChangeLogModal(false);
            setChangeLogData(null);
          }}
        />
      )}
    </div>
  );
}
