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
} from "lucide-react";
import ActionButton from "../../../shared/components/buttons/ActionButton";
import { CATALOG_REGISTRY } from "../../../shared/catalogs/catalog.registry";
import { getCatalogValues } from "../../../shared/catalogs/catalog.service";
import { downloadAllCatalogsTemplate } from "../services/catalogTemplateGenerator";
import { CatalogDetailModal } from "../components/CatalogDetailModal";
import { CatalogEditModal } from "../components/CatalogEditModal";
import { CatalogChangeLogTable } from "../components/CatalogChangeLogTable";
import { CatalogChangeLogModal } from "../components/CatalogChangeLogModal";
import {
  getDimensionRestrictions,
  getValidationRestrictions,
} from "../../../shared/data/restrictionCatalogsStorage";
import type { CatalogDefinition } from "../../../shared/catalogs/catalog.types";

type TabFilter = "todos" | "ODISEO" | "SISTEMA_INTEGRAL";

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

type ViewType = "catalogs" | "restrictions";

export function CatalogsViewPage() {
  const [viewType, setViewType] = useState<ViewType>("catalogs");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("todos");
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogRowData | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [catalogForChangeLog, setCatalogForChangeLog] = useState<CatalogRowData | null>(
    null
  );
  const [showChangeLogModal, setShowChangeLogModal] = useState(false);

  // Limpiar búsqueda y selecciones al cambiar de vista
  const handleViewTypeChange = (newViewType: ViewType) => {
    if (newViewType !== viewType) {
      setViewType(newViewType);
      setSearchQuery("");
      setSelectedCatalog(null);
      setActiveTab("todos");
    }
  };

  // Funciones helper
  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
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

  // Preparar datos de catálogos
  const catalogsData = useMemo(() => {
    return CATALOG_REGISTRY.map((catalog, index) => {
      const catCode = `CAT-${String(index + 1).padStart(3, "0")}`;
      const values = getCatalogValues(catalog.code) || [];
      const countByStatus = {
        activos: values.filter((v) => v.status === "Activo").length,
        inactivos: values.filter((v) => v.status === "Inactivo").length,
        bloqueados: values.filter((v) => v.status === "Bloqueado").length,
      };

      // Calcular fecha más reciente de actualización
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

  // Filtrar según búsqueda y sistema (solo para catálogos)
  const filteredCatalogs = useMemo(() => {
    if (viewType === "restrictions") return [];

    return catalogsData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.catCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.catalog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.catalog.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSystem =
        activeTab === "todos" || item.catalog.ownerSystem === activeTab;

      return matchesSearch && matchesSystem;
    });
  }, [catalogsData, searchQuery, activeTab, viewType]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = catalogsData.length;
    const odiseo = catalogsData.filter((c) => c.isEditable).length;
    const si = catalogsData.filter((c) => !c.isEditable).length;
    const totalValues = catalogsData.reduce((sum, c) => sum + c.totalCount, 0);
    const activoValues = catalogsData.reduce(
      (sum, c) => sum + c.activosCount,
      0
    );

    return { total, odiseo, si, totalValues, activoValues };
  }, [catalogsData]);

  // Dynamic tabs based on viewType
  const dimensionRestrictions = getDimensionRestrictions();
  const validationRestrictions = getValidationRestrictions();

  const tabs = viewType === "catalogs" ? [
    {
      key: "todos" as TabFilter,
      label: "Todos los catálogos",
      count: catalogsData.length,
    },
    {
      key: "ODISEO" as TabFilter,
      label: "ODISEO",
      count: catalogsData.filter((c) => c.isEditable).length,
    },
    {
      key: "SISTEMA_INTEGRAL" as TabFilter,
      label: "Sistema Integral",
      count: catalogsData.filter((c) => !c.isEditable).length,
    },
  ] : [
    {
      key: "todos" as TabFilter,
      label: "Todas las restricciones",
      count: dimensionRestrictions.length + validationRestrictions.length,
    },
    {
      key: "ODISEO" as TabFilter,
      label: "Dimensiones",
      count: dimensionRestrictions.length,
    },
    {
      key: "SISTEMA_INTEGRAL" as TabFilter,
      label: "Validaciones",
      count: validationRestrictions.length,
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTab("todos");
  };

  const downloadCatalogsExcel = () => {
    // Preparar datos para Excel
    const data = catalogsData.map((cat) => ({
      "Código": cat.catCode,
      "Nombre": cat.catalog.name,
      "Sistema Propietario": cat.catalog.ownerSystem,
      "Total Items": cat.totalCount,
      "Activos": cat.activosCount,
      "Inactivos": cat.inactivosCount,
      "Bloqueados": cat.bloqueadosCount,
      "Actualizado por": cat.lastUpdatedBy,
      "Fecha de Actualización": cat.lastUpdatedAt,
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Catálogos");

    // Aplicar estilos profesionales
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    const headerColor = "#1F4E78";
    const headerFont = "FFFFFF";
    const evenRowColor = "#F2F2F2";
    const borderColor = "#000000";
    const dataBorderColor = "#CCCCCC";

    // Estilos para encabezados
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

    // Estilos para datos (zebra striping)
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

    // Auto-ajustar ancho de columnas
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

    // Congelación y filtros
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    ws["!autofilter"] = { ref: ws["!ref"] };

    XLSX.writeFile(wb, `Catalogos_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const downloadRestrictionsExcel = () => {
    const dimensionRestrictions = getDimensionRestrictions();
    const validationRestrictions = getValidationRestrictions();

    // Preparar datos de restricciones de dimensión
    const dimensionData = dimensionRestrictions.map((r) => ({
      "Categoría": "Dimensión",
      "Envoltura": r.productType,
      "Código": r.code,
      "Nombre": r.name,
      "Ancho Min": r.ancho?.min ?? "-",
      "Ancho Max": r.ancho?.max ?? "-",
      "Largo Min": r.largo?.min ?? "-",
      "Largo Max": r.largo?.max ?? "-",
      "Fuelle Min": r.anchoFuelle?.min ?? "-",
      "Fuelle Max": r.anchoFuelle?.max ?? "-",
      "Perímetro Min": r.perimetro?.min ?? "-",
      "Perímetro Max": r.perimetro?.max ?? "-",
      "Estado": r.status,
    }));

    // Preparar datos de restricciones de validación
    const validationData = validationRestrictions.map((r) => ({
      "Categoría": "Validación",
      "Envoltura": r.productType,
      "Código": r.code,
      "Nombre": r.name,
      "Campo Origen": r.sourceField,
      "Valor Origen": r.sourceValue,
      "Campo Dependiente": r.dependentField,
      "Valores Permitidos": r.allowedValues.join(", "),
      "Estado": r.status,
    }));

    // Crear workbook con múltiples hojas
    const wb = XLSX.utils.book_new();

    // Hoja 1: Restricciones de Dimensión
    if (dimensionData.length > 0) {
      const wsDim = XLSX.utils.json_to_sheet(dimensionData);
      XLSX.utils.book_append_sheet(wb, wsDim, "Dimensión");
      applyRestrictionStyles(wsDim, dimensionData);
    }

    // Hoja 2: Restricciones de Validación
    if (validationData.length > 0) {
      const wsVal = XLSX.utils.json_to_sheet(validationData);
      XLSX.utils.book_append_sheet(wb, wsVal, "Validación");
      applyRestrictionStyles(wsVal, validationData);
    }

    // Hoja 3: Resumen de Catálogos
    const catalogData = catalogsData.map((cat) => ({
      "Código": cat.catCode,
      "Nombre": cat.catalog.name,
      "Sistema": cat.catalog.ownerSystem,
      "Total Valores": cat.totalCount,
      "Activos": cat.activosCount,
      "Inactivos": cat.inactivosCount,
      "Bloqueados": cat.bloqueadosCount,
    }));

    const wsCat = XLSX.utils.json_to_sheet(catalogData);
    XLSX.utils.book_append_sheet(wb, wsCat, "Catálogos");
    applyRestrictionStyles(wsCat, catalogData);

    XLSX.writeFile(wb, `Restricciones_Catalogos_${new Date().getTime()}.xlsx`);
    setShowDownloadMenu(false);
  };

  const applyRestrictionStyles = (ws: XLSX.WorkSheet, data: any[]) => {
    if (data.length === 0) return;

    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    const headerColor = "#1F4E78";
    const headerFont = "FFFFFF";
    const evenRowColor = "#F2F2F2";
    const borderColor = "#000000";
    const dataBorderColor = "#CCCCCC";

    // Estilos para encabezados
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

    // Estilos para datos (zebra striping)
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

    // Auto-ajustar ancho de columnas
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

    // Congelación y filtros
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    ws["!autofilter"] = { ref: ws["!ref"] };
  };

  const downloadBothExcel = () => {
    downloadCatalogsExcel();
    setTimeout(() => {
      downloadRestrictionsExcel();
    }, 500);
  };

  const downloadAllCatalogsWithValues = () => {
    // Descargar todos los catálogos con sus valores en Excel
    downloadAllCatalogsTemplate();
    setShowDownloadMenu(false);
  };

  return (
    <div className="w-full max-w-none">
      <>
        {/* Stats Cards */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Total de catálogos
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {stats.total}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Registrados en plataforma
                  </p>
                </div>
                <div className="rounded-xl bg-brand-secondary-soft p-3 text-brand-primary">
                  <Package size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                    ODISEO
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {stats.odiseo}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Catálogos modificables
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                    Sistema Integral
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {stats.si}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Catálogos de lectura
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Lock size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Restricciones
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {getDimensionRestrictions().length + getValidationRestrictions().length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Restricciones activas
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CheckCircle size={22} />
                </div>
              </div>
            </div>
          </section>

          {/* Tabs and Filters Section - Shared */}
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex max-w-full gap-6 overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
                        isActive
                          ? "border-brand-primary text-brand-primary"
                          : "border-transparent text-slate-500 hover:text-brand-primary"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? "bg-brand-secondary-soft text-brand-primary"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="pb-3 text-xs font-medium text-slate-500">
                Mostrando {filteredCatalogs.length} de {catalogsData.length}{" "}
                registros
              </p>
            </div>

            {/* View Type Selector */}
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

            {/* Search and Actions */}
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
                        ? "Buscar catálogo o descripción..."
                        : "Buscar campo, código o regla..."
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

                  {/* Dropdown de descargas - Siempre visible */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      <Download size={16} />
                      Descargar
                      <ChevronDown size={16} />
                    </button>

                    {showDownloadMenu && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                        <button
                          onClick={downloadCatalogsExcel}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 first:rounded-t-lg"
                        >
                          <div className="font-medium">Catálogos</div>
                          <div className="text-xs text-slate-500">Descargar información de catálogos (Excel)</div>
                        </button>
                        <button
                          onClick={downloadRestrictionsExcel}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                        >
                          <div className="font-medium">Restricciones</div>
                          <div className="text-xs text-slate-500">Descargar restricciones de catálogos (Excel)</div>
                        </button>
                        <button
                          onClick={downloadBothExcel}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                        >
                          <div className="font-medium">Catálogos + Restricciones</div>
                          <div className="text-xs text-slate-500">Descargar ambos archivos</div>
                        </button>
                        <button
                          onClick={downloadAllCatalogsWithValues}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-b-lg"
                        >
                          <div className="font-medium">Todos los Catálogos con Valores</div>
                          <div className="text-xs text-slate-500">Excel con todas las hojas de catálogos</div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Botón de edición - Cambia label según vista */}
                  <ActionButton
                    label={viewType === "catalogs" ? "Editar Catálogo" : "Editar Restricción"}
                    onClick={() => setShowEditModal(true)}
                    variant="primary"
                    size="sm"
                    icon={<Download size={16} />}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1024px] border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-brand-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Nombre del Campo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                      Activos
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                      Inactivos
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                      Bloqueados
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                      Sistema
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Actualizado por
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Fecha de actualización
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCatalogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-12 w-12 text-slate-300" />
                          <p className="text-slate-500">
                            No se encontraron catálogos
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCatalogs.map((row, index) => (
                      <tr
                        key={row.catCode}
                        className={`border-b border-slate-200/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        } hover:bg-slate-100/40`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-brand-primary font-mono">
                          {row.catCode}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <div className="min-w-[280px]">
                            <p className="font-semibold text-slate-900">
                              {row.catalog.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {row.catalog.description}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                          {row.totalCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-emerald-600 font-medium">
                          {row.activosCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-orange-600 font-medium">
                          {row.inactivosCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-red-600 font-medium">
                          {row.bloqueadosCount}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              row.isEditable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {row.isEditable ? "ODISEO" : "SI"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {row.lastUpdatedBy}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {row.lastUpdatedAt}
                        </td>

                        <td className="px-4 py-3 text-right sticky right-0 bg-inherit">
                          <div className="flex items-center justify-end gap-2">
                            {row.isEditable && (
                              <button
                                type="button"
                                title="Descargar valores del catálogo"
                                onClick={() => {
                                  const values = getCatalogValues(row.catalog.code) || [];
                                  const data = values.map((v) => ({
                                    "Código Valor": v.item || "",
                                    "Valor": v.name || "",
                                    "Descripción": v.description || "",
                                    "Estado": v.status || "",
                                  }));

                                  const ws = XLSX.utils.json_to_sheet(data);
                                  const wb = XLSX.utils.book_new();
                                  XLSX.utils.book_append_sheet(wb, ws, row.catalog.name);

                                  // Estilos profesionales
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

                                  XLSX.writeFile(wb, `${row.catCode}_${row.catalog.code}.xlsx`);
                                }}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                              >
                                <Download size={16} />
                              </button>
                            )}

                            <button
                              type="button"
                              title="Ver bitácora de cambios"
                              onClick={() => {
                                setCatalogForChangeLog(row);
                                setShowChangeLogModal(true);
                              }}
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                            >
                              <History size={16} />
                            </button>

                            <button
                              type="button"
                              title="Ver detalle del catálogo"
                              onClick={() => setSelectedCatalog(row)}
                              className="rounded-lg bg-brand-primary p-2 text-white transition-colors hover:bg-brand-primary/90"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Change Log Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <History size={28} className="text-brand-primary" />
                  Bitácora de Cambios
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Registro de todos los cambios realizados a los catálogos
                </p>
              </div>
              <button
                onClick={() => setShowChangeLog(!showChangeLog)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  showChangeLog
                    ? "border-brand-primary bg-brand-secondary-soft text-brand-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {showChangeLog ? "Ocultar" : "Mostrar"} Bitácora
              </button>
            </div>

            {showChangeLog && (
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <CatalogChangeLogTable />
              </div>
            )}
          </div>

      </>

      {/* Detail Modal */}
      {selectedCatalog && (
        <CatalogDetailModal
          catalogData={selectedCatalog}
          onClose={() => setSelectedCatalog(null)}
        />
      )}

      {/* Edit Catalog Modal */}
      <CatalogEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUploadSuccess={() => {
          setShowEditModal(false);
          // Aquí se puede hacer refresh de datos si es necesario
        }}
      />

      {/* Catalog Change Log Modal */}
      {catalogForChangeLog && (
        <CatalogChangeLogModal
          isOpen={showChangeLogModal}
          catalogCode={catalogForChangeLog.catalog.code}
          catalogName={catalogForChangeLog.catalog.name}
          onClose={() => {
            setShowChangeLogModal(false);
            setCatalogForChangeLog(null);
          }}
        />
      )}
    </div>
  );
}
