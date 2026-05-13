import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RotateCcw, CheckCircle, AlertCircle, Clock, XCircle, Eye } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectRecords } from "../../../shared/data/projectStorage";
import { normalizeProjectWorkflow, getResponsibleAreaForProject } from "../../../shared/data/projectWorkflow";
import ActionButton from "../../../shared/components/buttons/ActionButton";
import { tableStyles } from "../../../shared/ui/tableStyles";

type ValidationAreaFilter = "todas" | "artesGraficas" | "rdTecnica" | "rdDesarrollo";
type ValidationStatusTab = "todas" | "enRevision" | "validados" | "observados" | "sinSolicitar";
type SortDirection = "asc" | "desc";
type SortKey = "code" | "projectName" | "clientName" | "wrappingName" | "validationArea" | "validationStatus" | "validationRequestedAt";

const RECENT_NEW_VALIDATION_KEY = "odiseo_recent_new_validation";

const formatDateTime = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function ValidationListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [searchText, setSearchText] = useState("");
  const [statusTab, setStatusTab] = useState<ValidationStatusTab>("todas");
  const [areaFilter, setAreaFilter] = useState<ValidationAreaFilter>("todas");
  const [sortKey, setSortKey] = useState<SortKey>("validationRequestedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [recentNewValidationProjectCode, setRecentNewValidationProjectCode] = useState<string | null>(null);

  useEffect(() => {
    setHeader({
      title: "Bandeja de Validaciones",
      subtitle: "Proyectos pendientes de validación por áreas",
      breadcrumbs: [
        { label: "Validaciones" },
        { label: "Bandeja de Validaciones" },
      ],
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_NEW_VALIDATION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { projectId?: string; expiresAt?: number };
      if (!parsed.projectId || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
        localStorage.removeItem(RECENT_NEW_VALIDATION_KEY);
        return;
      }
      setRecentNewValidationProjectCode(parsed.projectId);
      const timer = window.setTimeout(() => {
        setRecentNewValidationProjectCode(null);
        localStorage.removeItem(RECENT_NEW_VALIDATION_KEY);
      }, parsed.expiresAt - Date.now());
      return () => window.clearTimeout(timer);
    } catch {
      localStorage.removeItem(RECENT_NEW_VALIDATION_KEY);
    }
  }, []);

  // Obtener todos los proyectos normalizados
  const allProjects = useMemo(() => {
    return getProjectRecords().map(normalizeProjectWorkflow);
  }, []);

  // FILTRO PRINCIPAL: Proyectos con status === "En validación" O que han sido observados por cualquier área
  const projectsInValidation = useMemo(() => {
    return allProjects.filter((project) =>
      project.status === "En validación" ||
      (project.status === "Observado" &&
       (project.lastObservationSource === "Artes Gráficas" ||
        project.lastObservationSource === "R&D Técnica" ||
        project.lastObservationSource === "R&D Desarrollo"))
    );
  }, [allProjects]);

  // Agregar área responsable a cada proyecto
  const projectsWithArea = useMemo(() => {
    return projectsInValidation.map((project) => ({
      project,
      responsibleArea: getResponsibleAreaForProject(project),
    }));
  }, [projectsInValidation]);

  // FILTRAR POR ÁREA SELECCIONADA
  const filteredByArea = useMemo(() => {
    if (areaFilter === "todas") {
      return projectsWithArea;
    }

    return projectsWithArea.filter(({ project, responsibleArea }) => {
      if (areaFilter === "artesGraficas") {
        return responsibleArea === "Artes Gráficas";
      }
      if (areaFilter === "rdTecnica") {
        return responsibleArea === "R&D Área Técnica";
      }
      if (areaFilter === "rdDesarrollo") {
        return responsibleArea === "R&D Desarrollo";
      }
      return false;
    });
  }, [projectsWithArea, areaFilter]);

  // FILTRAR POR ESTADO DE VALIDACIÓN
  const filteredByStatus = useMemo(() => {
    if (statusTab === "todas") return filteredByArea;

    return filteredByArea.filter(({ project }) => {
      const validationStatus = getValidationStatus(project);

      if (statusTab === "enRevision") {
        return validationStatus === "En Revisión";
      }
      if (statusTab === "validados") {
        return validationStatus === "Validado" || validationStatus === "Aprobado automático";
      }
      if (statusTab === "observados") {
        return validationStatus === "Observado";
      }
      if (statusTab === "sinSolicitar") {
        return validationStatus === "Sin solicitar";
      }

      return true;
    });
  }, [filteredByArea, statusTab]);

  // FILTRAR POR BÚSQUEDA
  const filteredBySearch = useMemo(() => {
    if (!searchText) return filteredByStatus;
    const lower = searchText.toLowerCase();
    return filteredByStatus.filter(
      ({ project }) =>
        project.code.toLowerCase().includes(lower) ||
        project.projectName?.toLowerCase().includes(lower) ||
        project.clientName?.toLowerCase().includes(lower)
    );
  }, [filteredByStatus, searchText]);

  const getValidationStatusBadge = (area: string, status: string): string => {
    switch (status) {
      case "En Revisión":
        return "bg-amber-100 text-amber-800";
      case "Observado":
        return "bg-orange-100 text-orange-800";
      case "Validado":
      case "Aprobado automático":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCurrentValidationArea = (project: any): string => {
    return getResponsibleAreaForProject(project);
  };

  const getCurrentValidationStatus = (project: any): string => {
    const area = getResponsibleAreaForProject(project);

    if (area === "Artes Gráficas") {
      return project.graphicArtsValidationStatus || "Sin solicitar";
    }

    if (area === "R&D Área Técnica" || area === "R&D Desarrollo") {
      return project.technicalValidationStatus || "Sin solicitar";
    }

    return "Sin solicitar";
  };

  const getValidationStatus = (project: any): string => {
    // Usar getCurrentValidationStatus que ya aplica la regla de negocio
    return getCurrentValidationStatus(project);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(key === "validationRequestedAt" ? "desc" : "asc");
  };

  const getSortValue = (item: any, key: SortKey) => {
    const project = item.project || item;
    switch (key) {
      case "code":
        return project.code ?? project.projectCode ?? "";
      case "projectName":
        return project.projectName ?? project.name ?? "";
      case "clientName":
        return project.clientName ?? project.client ?? "";
      case "wrappingName":
        return project.wrappingName ?? project.envoltura ?? "";
      case "validationArea":
        return item.responsibleArea ?? getResponsibleAreaForProject(project) ?? "";
      case "validationStatus":
        return getValidationStatus(project) ?? "";
      case "validationRequestedAt":
        return project.validationRequestedAt ?? "";
      default:
        return "";
    }
  };

  const filteredAndSortedValidations = [...filteredBySearch].sort((a, b) => {
    const valueA = getSortValue(a, sortKey);
    const valueB = getSortValue(b, sortKey);

    if (sortKey === "validationRequestedAt") {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;

      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    const result = String(valueA).localeCompare(String(valueB), "es", {
      sensitivity: "base",
      numeric: true,
    });

    return sortDirection === "asc" ? result : -result;
  });

  // Calcular conteos por estado
  const countByStatus = useMemo(() => {
    const enRevision = filteredByArea.filter(
      ({ project }) => getValidationStatus(project) === "En Revisión"
    ).length;
    const validados = filteredByArea.filter(
      ({ project }) => {
        const status = getValidationStatus(project);
        return status === "Validado" || status === "Aprobado automático";
      }
    ).length;
    const observados = filteredByArea.filter(
      ({ project }) => getValidationStatus(project) === "Observado"
    ).length;
    const sinSolicitar = filteredByArea.filter(
      ({ project }) => getValidationStatus(project) === "Sin solicitar"
    ).length;

    return {
      todas: filteredByArea.length,
      enRevision,
      validados,
      observados,
      sinSolicitar,
    };
  }, [filteredByArea]);

  const clearFilters = () => {
    setSearchText("");
    setStatusTab("todas");
    setAreaFilter("todas");
    setSortKey("validationRequestedAt");
    setSortDirection("desc");
  };

  const SortableHeader = ({
    label,
    sortColumn,
  }: {
    label: string;
    sortColumn: SortKey;
  }) => {
    const isActive = sortKey === sortColumn;

    return (
      <button
        type="button"
        onClick={() => handleSort(sortColumn)}
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-white hover:text-white"
      >
        {label}
        {isActive && (
          <span className="text-[10px]">
            {sortDirection === "asc" ? "▲" : "▼"}
          </span>
        )}
      </button>
    );
  };

  const isRecentNewValidation = (project: any) =>
    Boolean(recentNewValidationProjectCode && project.code === recentNewValidationProjectCode);

  return (
    <div className="w-full max-w-none">
      {/* Estadísticas */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 p-5 bg-[#f6f8fb]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total validaciones
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {countByStatus.todas}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                En proceso
              </p>
            </div>

            <div className="rounded-xl bg-brand-secondary-soft p-3 text-brand-primary">
              <Eye size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                En Revisión
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {countByStatus.enRevision}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pendientes revisión
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                Validados
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {countByStatus.validados}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Aprobados
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
                Observados
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {countByStatus.observados}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Requieren corrección
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-700">
              <AlertCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Sin Solicitar
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {countByStatus.sinSolicitar}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                No solicitado
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* Pestañas y Filtros */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm mx-5">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex max-w-full gap-6 overflow-x-auto">
            {[
              { key: "todas", label: "Todos", count: countByStatus.todas },
              { key: "enRevision", label: "En Revisión", count: countByStatus.enRevision },
              { key: "validados", label: "Validados", count: countByStatus.validados },
              { key: "observados", label: "Observados", count: countByStatus.observados },
              { key: "sinSolicitar", label: "Sin Solicitar", count: countByStatus.sinSolicitar },
            ].map((tab) => {
              const isActive = statusTab === (tab.key as ValidationStatusTab);
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusTab(tab.key as ValidationStatusTab)}
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
            Mostrando {filteredBySearch.length} de {countByStatus.todas} registros
          </p>
        </div>

        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-[340px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Buscar por código, proyecto, cliente..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value as ValidationAreaFilter)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              >
                <option value="todas">Todas las áreas</option>
                <option value="artesGraficas">Artes Gráficas</option>
                <option value="rdTecnica">R&D Área Técnica</option>
                <option value="rdDesarrollo">R&D Desarrollo</option>
              </select>

              <ActionButton
                label="Limpiar Filtros"
                onClick={clearFilters}
                variant="outline"
                icon={<RotateCcw size={16} />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Proyectos */}
      <div className="mt-4 mx-5 mb-5">
        {filteredBySearch.length === 0 ? (
          <div className={tableStyles.wrapper}>
            <div className={tableStyles.emptyCell}>
              <div className="text-slate-600 font-medium">
                {projectsInValidation.length === 0
                  ? "No hay proyectos en validación ni observados"
                  : "No hay proyectos que coincidan con los filtros"}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm text-slate-600 font-medium mb-3">
              {filteredBySearch.length} proyecto{filteredBySearch.length !== 1 ? "s" : ""} en validación u observado{filteredBySearch.length !== 1 ? "s" : ""}
            </div>

            <div className={tableStyles.wrapper}>
              <div className={tableStyles.scroll}>
                <table className={tableStyles.table}>
                  <thead>
                    <tr className={tableStyles.headerRow}>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Código" sortColumn="code" />
                      </th>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Proyecto" sortColumn="projectName" />
                      </th>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Cliente" sortColumn="clientName" />
                      </th>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Tipo de Envoltura" sortColumn="wrappingName" />
                      </th>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Área Validadora" sortColumn="validationArea" />
                      </th>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Estado Validación" sortColumn="validationStatus" />
                      </th>
                      <th className={tableStyles.headerCell}>
                        <SortableHeader label="Fecha solicitud" sortColumn="validationRequestedAt" />
                      </th>
                      <th className={tableStyles.headerCellRight}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedValidations.map(({ project }, index) => {
                      const isNew = isRecentNewValidation(project);
                      return (
                      <tr
                        key={project.code}
                        className={`${tableStyles.row} border-b border-slate-100 transition-colors ${
                          isNew ? "bg-blue-50/70" : index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                        } hover:bg-brand-secondary-soft`}
                      >
                        <td className={tableStyles.cellCode}>{project.code}</td>
                        <td className={tableStyles.cellStrong}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{project.projectName}</span>
                            {isNew && (
                              <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-blue-700 shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Nuevo
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={tableStyles.cell}>{project.clientName || "—"}</td>
                        <td className={tableStyles.cell}>{project.wrappingName || project.envoltura || "—"}</td>
                        <td className={tableStyles.cell}>{getCurrentValidationArea(project)}</td>
                        <td className={tableStyles.cell}>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getValidationStatusBadge(getCurrentValidationArea(project), getValidationStatus(project))}`}>
                            {getValidationStatus(project)}
                          </span>
                        </td>
                        <td className={tableStyles.cell}>
                          {formatDateTime(project.validationRequestedAt)}
                        </td>
                        <td className={tableStyles.actions}>
                          <button
                            onClick={() => navigate(`/validaciones/${project.code}`)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
