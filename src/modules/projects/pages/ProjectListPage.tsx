import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BriefcaseBusiness,
  Clock3,
  Layers3,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectRecords } from "../../../shared/data/projectStorage";
import { getProjectSlaSummary } from "../../../shared/data/slaStorage";
import { getProjectObservations } from "../../../shared/data/observationStorage";
import { getPortfolioDisplayRecords } from "../../../shared/data/portfolioStorage";
import {
  normalizeProjectWorkflow,
  PROJECT_STAGE_LABELS,
  getResponsibleAreaForProject,
  type ProjectStatus,
} from "../../../shared/data/projectWorkflow";
import ProjectStatusBadge from "../../../shared/components/display/ProjectStatusBadge";
import SlaStatusBadge from "../../../shared/components/sla/SlaStatusBadge";
import ActionButton from "../../../shared/components/buttons/ActionButton";

type ProjectTab = "all" | ProjectStatus;

type SortDirection = "asc" | "desc";

type SortKey =
  | "code"
  | "projectName"
  | "clientName"
  | "portfolio"
  | "status"
  | "stage"
  | "responsibleArea"
  | "sla"
  | "openObs"
  | "createdAt"
  | "createdBy";

const PROJECT_STATUSES: ProjectStatus[] = [
  "Registrado",
  "En Preparación",
  "Ficha Completa",
  "En validación",
  "Observado",
  "Validado",
  "En Cotización",
  "Cotización Completa",
  "Aprobado por Cliente",
  "Desestimado",
];

const getText = (...values: any[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== ""
  );

  return value ? String(value) : "";
};

const formatDate = (...values: any[]) => {
  const value = getText(...values);

  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getDaysRemaining = (dateValue: any) => {
  const value = getText(dateValue);

  if (!value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(value);
  dueDate.setHours(0, 0, 0, 0);

  if (Number.isNaN(dueDate.getTime())) return null;

  const diffTime = dueDate.getTime() - today.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getSlaRemainingLabel = (sla: any) => {
  if (!sla) return "Sin SLA";

  if (sla.completedAt) return "Completado";

  const days = getDaysRemaining(sla.dueAt);

  if (days === null) return "Sin fecha";

  if (days > 1) return `Faltan ${days} días`;
  if (days === 1) return "Falta 1 día";
  if (days === 0) return "Vence hoy";

  return `Vencido hace ${Math.abs(days)} días`;
};


const getSortValue = (project: any, key: SortKey): string | number => {
  switch (key) {
    case "code":
      return getText(project.code, project.id).toLowerCase();

    case "projectName":
      return getText(project.projectName, project.name).toLowerCase();

    case "clientName":
      return getText(project.clientName).toLowerCase();

    case "portfolio":
      return getText(project.portfolioCode, project.portfolioName).toLowerCase();

    case "status":
      return getText(project.status).toLowerCase();

    case "stage":
      return getText(project.stageName).toLowerCase();

    case "responsibleArea":
      return getText(project.responsibleArea).toLowerCase();

    case "sla":
      return typeof project.slaDaysRemaining === "number"
        ? project.slaDaysRemaining
        : 99999;

    case "openObs":
      return Number(project.openObs || 0);

    case "createdAt": {
      const dateValue = getText(
        project.createdAt,
        project.createdDate,
        project.fechaCreacion,
        project.fecha_creacion
      );

      const time = new Date(dateValue).getTime();

      return Number.isNaN(time) ? 0 : time;
    }

    case "createdBy":
      return getText(
        project.createdByName,
        project.createdBy,
        project.userName,
        project.username,
        project.usuario
      ).toLowerCase();

    default:
      return "";
  }
};

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ProjectTab>("all");

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    setHeader({
      title: "Proyectos >> Bandeja de seguimiento",
      breadcrumbs: [{ label: "Proyectos" }, { label: "Lista de Proyectos" }],
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const projects = useMemo(() => getProjectRecords(), []);
  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);
  const observations = useMemo(() => getProjectObservations(), []);

  const augmentedProjects = useMemo(() => {
    return projects.map((project) => {
      const normalizedProject = normalizeProjectWorkflow(project);
      const code = getText(project.code, project.id);

      const slas = getProjectSlaSummary(code);
      const activeSla = slas.find((sla) => !sla.completedAt) || slas[0];

      const projectObservations = observations.filter(
        (observation) => observation.projectCode === code
      );

      const openObs = projectObservations.filter(
        (observation) => observation.status === "Abierta"
      ).length;

      const portfolioCode = getText(
        project.portfolioCode,
        (project as any).portfolioId,
        (project as any).portfolioCodigo
      );

      const relatedPortfolio = portfolios.find(
        (portfolio) =>
          getText(portfolio.codigo, portfolio.id) === portfolioCode
      );

      const portfolioName = getText(
        project.portfolioName,
        relatedPortfolio?.nombre,
        relatedPortfolio?.portfolioName,
        relatedPortfolio?.nom
      );

      const slaDaysRemaining = activeSla
        ? getDaysRemaining(activeSla.dueAt)
        : null;

      const slaStatus = getText(activeSla?.slaStatus);
      const normalizedSlaStatus = slaStatus.toLowerCase();

      const isSlaOverdue =
        Boolean(activeSla) &&
        !activeSla?.completedAt &&
        (normalizedSlaStatus.includes("vencido") ||
          (typeof slaDaysRemaining === "number" && slaDaysRemaining < 0));

      const isSlaDueSoon =
        Boolean(activeSla) &&
        !activeSla?.completedAt &&
        typeof slaDaysRemaining === "number" &&
        slaDaysRemaining >= 0 &&
        slaDaysRemaining <= 2;

      const stageName = PROJECT_STAGE_LABELS[normalizedProject.stage];
      const responsibleArea = getResponsibleAreaForProject(normalizedProject);

      return {
        ...normalizedProject,
        code,
        projectNameLabel: getText(project.projectName, (project as any).name),
        clientNameLabel: getText(project.clientName, (project as any).cli),
        portfolioCodeLabel: portfolioCode,
        portfolioNameLabel: portfolioName,
        stageName,
        responsibleArea,
        activeSla,
        slaStatus,
        slaDaysRemaining,
        isSlaOverdue,
        isSlaDueSoon,
        openObs,
        createdAtLabel: formatDate(
          project.createdAt,
          (project as any).createdDate,
          (project as any).fechaCreacion,
          (project as any).fecha_creacion
        ),
        createdByLabel:
          getText(
            (project as any).createdByName,
            (project as any).createdBy,
            (project as any).userName,
            (project as any).username,
            (project as any).usuario
          ) || "—",
      };
    });
  }, [projects, observations, portfolios]);

  const totalProjects = augmentedProjects.length;

  const portalProjects = useMemo(
    () =>
      augmentedProjects.filter(
        (project) => project.status !== "Desestimado"
      ),
    [augmentedProjects]
  );

  const observedProjects = useMemo(
    () =>
      augmentedProjects.filter(
        (project) =>
          project.openObs > 0 || project.status === "Observado"
      ),
    [augmentedProjects]
  );


  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();

    const filtered = augmentedProjects.filter((project) => {
      const searchableText = [
        project.code,
        project.projectNameLabel,
        project.clientNameLabel,
        project.portfolioCodeLabel,
        project.portfolioNameLabel,
        project.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);
      const matchesTab = activeTab === "all" || project.status === activeTab;

      return matchesSearch && matchesTab;
    });

    return [...filtered].sort((a, b) => {
      const valueA = getSortValue(a, sortConfig.key);
      const valueB = getSortValue(b, sortConfig.key);

      let result = 0;

      if (typeof valueA === "number" && typeof valueB === "number") {
        result = valueA - valueB;
      } else {
        result = String(valueA).localeCompare(String(valueB), "es", {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortConfig.direction === "asc" ? result : result * -1;
    });
  }, [augmentedProjects, query, activeTab, sortConfig]);

  const clearFilters = () => {
    setQuery("");
    setActiveTab("all");
    setSortConfig({ key: "createdAt", direction: "desc" });
    setCurrentPage(1);
  };

  const requestSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: key === "createdAt" ? "desc" : "asc",
      };
    });
  };

  const handleDuplicate = (projectCode: string) => {
    navigate(`/projects/new?duplicateFrom=${projectCode}`);
  };

  const SortIcon = ({ sortKey }: { sortKey: SortKey }) => {
    if (sortConfig.key !== sortKey) {
      return <ArrowUpDown size={14} className="text-white/60" />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="text-white" />
    ) : (
      <ArrowDown size={14} className="text-white" />
    );
  };

  const SortableHeader = ({
    label,
    sortKey,
    align = "left",
  }: {
    label: string;
    sortKey: SortKey;
    align?: "left" | "right";
  }) => (
    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
      <button
        type="button"
        onClick={() => requestSort(sortKey)}
        className={`flex w-full items-center gap-2 ${
          align === "right" ? "justify-end text-right" : "justify-start text-left"
        }`}
      >
        <span>{label}</span>
        <SortIcon sortKey={sortKey} />
      </button>
    </th>
  );

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProjects.slice(startIndex, startIndex + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize);

  const tabs = [
    {
      key: "all" as ProjectTab,
      label: "Todos los proyectos",
      count: augmentedProjects.length,
    },
    ...PROJECT_STATUSES.map((status) => ({
      key: status as ProjectTab,
      label: status,
      count: augmentedProjects.filter(
        (project) => project.status === status
      ).length,
    })),
  ];

  return (
    <div className="w-full max-w-none">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total proyectos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {totalProjects}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Registrados en plataforma
              </p>
            </div>

            <div className="rounded-xl bg-brand-secondary-soft p-3 text-brand-primary">
              <BriefcaseBusiness size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                En Portal Web
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {portalProjects.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Seguimiento P1-P3
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Layers3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Observados
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {observedProjects.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Requieren corrección
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
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
            Mostrando {filteredProjects.length} de {augmentedProjects.length} registros
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
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por código, proyecto, cliente..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ActionButton
                label="Limpiar Filtros"
                onClick={clearFilters}
                variant="outline"
                icon={<RotateCcw size={16} />}
              />

              <ActionButton
                label="Nuevo Proyecto"
                onClick={() => navigate("/projects/new")}
                variant="primary"
                icon={<Plus size={16} />}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1650px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-primary text-white">
                <SortableHeader label="Código" sortKey="code" />
                <SortableHeader label="Proyecto" sortKey="projectName" />
                <SortableHeader label="Cliente" sortKey="clientName" />
                <SortableHeader label="Portafolio" sortKey="portfolio" />
                <SortableHeader label="Estado Proyecto" sortKey="status" />
                <SortableHeader label="Etapa Actual" sortKey="stage" />
                <SortableHeader label="Área Resp." sortKey="responsibleArea" />
                <SortableHeader label="SLA" sortKey="sla" />
                <SortableHeader label="Obs." sortKey="openObs" />
                <SortableHeader label="Fecha creación" sortKey="createdAt" />
                <SortableHeader label="Usuario" sortKey="createdBy" />

                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProjects.map((item, index) => (
                <tr
                  key={item.code || item.id}
                  className={`border-b border-slate-100 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  } hover:bg-brand-secondary-soft`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-extrabold text-brand-primary">
                    {item.code || item.id || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <div className="font-bold text-slate-800">
                      {item.projectNameLabel || "—"}
                    </div>

                    <div className="mt-0.5 text-xs text-slate-500">
                      {getText(item.envoltura, item.wrappingName) || "Sin envoltura"} ·{" "}
                      {getText(item.maquinaCliente, item.packingMachineName) ||
                        "Sin máquina"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-slate-700">
                    {item.clientNameLabel || "Cliente no asignado"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="font-semibold text-slate-700">
                      {item.portfolioCodeLabel || "—"}
                    </div>

                    <div className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500">
                      {item.portfolioNameLabel || "Sin nombre"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <ProjectStatusBadge status={item.status} />
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <div className="font-bold text-brand-primary">
                      {item.stageName}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                      {item.responsibleArea}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {item.activeSla ? (
                      <div className="flex flex-col items-start gap-1">
                        <SlaStatusBadge status={item.activeSla.slaStatus} />

                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            item.isSlaOverdue
                              ? "text-red-600"
                              : item.isSlaDueSoon
                              ? "text-amber-600"
                              : "text-slate-500"
                          }`}
                        >
                          <Clock3 size={12} />
                          {getSlaRemainingLabel(item.activeSla)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400">
                        Sin SLA
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {item.openObs > 0 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                        {item.openObs}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.createdAtLabel}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.createdByLabel}
                  </td>

                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        label="Ver"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${item.code || item.id}`)}
                      />

                      <ActionButton
                        label="Editar"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/projects/${item.code || item.id}/edit`)
                        }
                      />

                      <ActionButton
                        label="Copia"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(item.code || item.id)}
                        className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-3">
                        <BriefcaseBusiness size={26} className="text-slate-400" />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        No se encontraron proyectos
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Intenta limpiar filtros o cambiar el criterio de búsqueda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs font-medium text-slate-600">
              Mostrando {paginatedProjects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} a{" "}
              {Math.min(currentPage * pageSize, filteredProjects.length)} de{" "}
              {filteredProjects.length} registros
            </p>

            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>

              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="text-xs font-medium text-slate-600">
                Página {currentPage} de {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}