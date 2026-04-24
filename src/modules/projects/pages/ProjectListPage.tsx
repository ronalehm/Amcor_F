import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileWarning,
  Layers3,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectRecords } from "../../../shared/data/projectStorage";
import { getAllProjectTrackingStates } from "../../../shared/data/projectTrackingStorage";
import { getProjectSlaSummary } from "../../../shared/data/slaStorage";
import { getStageConfig, type ProjectStage } from "../../../shared/data/projectStageConfig";
import { getProjectObservations } from "../../../shared/data/observationStorage";
import { getPortfolioDisplayRecords } from "../../../shared/data/portfolioStorage";
import { getClientCatalogRecords } from "../../../shared/data/clientStorage";

import SlaStatusBadge from "../../../shared/components/sla/SlaStatusBadge";
import Button from "../../../shared/components/ui/Button";

type ProjectBusinessStatus =
  | "Registrado"
  | "En evaluación"
  | "Observada"
  | "Lista para RFQ"
  | "En desarrollo"
  | "Pendiente de alta"
  | "Dado de alta"
  | "Desestimado";

type ProjectTab = "all" | ProjectBusinessStatus;

type QuickFilter =
  | "all"
  | "portal"
  | "sistemaIntegral"
  | "overdue"
  | "observed"
  | "dueSoon"
  | "withoutSla";

type SortDirection = "asc" | "desc";

type SortKey =
  | "code"
  | "projectName"
  | "clientName"
  | "portfolio"
  | "businessStatus"
  | "stage"
  | "responsibleArea"
  | "sla"
  | "openObs"
  | "createdAt"
  | "createdBy";

const PROJECT_STATUSES: ProjectBusinessStatus[] = [
  "Registrado",
  "En evaluación",
  "Observada",
  "Lista para RFQ",
  "En desarrollo",
  "Pendiente de alta",
  "Dado de alta",
  "Desestimado",
];

const STATUS_STYLES: Record<ProjectBusinessStatus, string> = {
  Registrado: "border-slate-200 bg-slate-50 text-slate-700",
  "En evaluación": "border-blue-200 bg-blue-50 text-blue-700",
  Observada: "border-amber-200 bg-amber-50 text-amber-700",
  "Lista para RFQ": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "En desarrollo": "border-cyan-200 bg-cyan-50 text-cyan-700",
  "Pendiente de alta": "border-orange-200 bg-orange-50 text-orange-700",
  "Dado de alta": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Desestimado: "border-red-200 bg-red-50 text-red-700",
};

const getText = (...values: any[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== ""
  );

  return value ? String(value) : "";
};

const normalizeText = (...values: any[]) => getText(...values).toLowerCase();

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

const getProjectBusinessStatus = (
  project: any,
  stageId: string,
  openObs: number
): ProjectBusinessStatus => {
  const rawStatus = normalizeText(
    project.businessStatus,
    project.projectStatus,
    project.status,
    project.estado,
    project.est
  );

  if (
    rawStatus.includes("desestim") ||
    rawStatus.includes("rechaz") ||
    rawStatus.includes("cancel") ||
    rawStatus.includes("perd")
  ) {
    return "Desestimado";
  }

  if (
    rawStatus.includes("dado de alta") ||
    rawStatus.includes("alta confirmada") ||
    rawStatus.includes("sku confirmado") ||
    rawStatus.includes("sku creado") ||
    rawStatus.includes("confirmado")
  ) {
    return "Dado de alta";
  }

  if (
    rawStatus.includes("pendiente de alta") ||
    rawStatus.includes("lista para alta") ||
    rawStatus.includes("espera de sku")
  ) {
    return "Pendiente de alta";
  }

  if (openObs > 0 || rawStatus.includes("observ")) {
    return "Observada";
  }

  if (rawStatus.includes("rfq") || rawStatus.includes("estimación")) {
    return "Lista para RFQ";
  }

  if (rawStatus.includes("desarrollo")) {
    return "En desarrollo";
  }

  if (
    rawStatus.includes("evaluación") ||
    rawStatus.includes("evaluacion") ||
    rawStatus.includes("validación") ||
    rawStatus.includes("validacion")
  ) {
    return "En evaluación";
  }

  if (rawStatus.includes("aprob")) {
    return "Lista para RFQ";
  }

  if (rawStatus.includes("borrador") || rawStatus.includes("registr")) {
    return "Registrado";
  }

  if (stageId === "P1") return "Registrado";
  if (stageId === "P2" || stageId === "P3") return "En evaluación";
  if (stageId === "P4") return "Lista para RFQ";
  if (stageId === "P5") return "Pendiente de alta";

  if (
    stageId.startsWith("P6") ||
    stageId.startsWith("P7") ||
    stageId.startsWith("P8") ||
    stageId.startsWith("P9")
  ) {
    return "Pendiente de alta";
  }

  return "Registrado";
};

const ProjectBusinessStatusBadge = ({
  status,
}: {
  status: ProjectBusinessStatus;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);

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

    case "businessStatus":
      return getText(project.businessStatus).toLowerCase();

    case "stage":
      return getText(project.stageId, project.stageName).toLowerCase();

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
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  const [clientFilter, setClientFilter] = useState("");
  const [portfolioFilter, setPortfolioFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [envolturaFilter, setEnvolturaFilter] = useState("");
  const [usoFinalFilter, setUsoFinalFilter] = useState("");
  const [maquinaFilter, setMaquinaFilter] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    setHeader({
      title: "Proyectos >> Bandeja de seguimiento",
      breadcrumbs: [{ label: "Proyectos" }, { label: "Lista de Proyectos" }],
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const projects = useMemo(() => getProjectRecords(), []);
  const trackingStates = useMemo(() => getAllProjectTrackingStates(), []);
  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);
  const clients = useMemo(() => getClientCatalogRecords(), []);
  const observations = useMemo(() => getProjectObservations(), []);

  const recentClients = useMemo(() => {
    return [...clients]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [clients]);

  const portfolioOptions = useMemo(() => {
    return portfolios.map((portfolio) => ({
      code: getText(portfolio.codigo, portfolio.id),
      name: getText(portfolio.nombre, portfolio.portfolioName, portfolio.nom),
    }));
  }, [portfolios]);

  const uniqueStages = useMemo(() => {
    const stages = new Set(
      trackingStates.map((tracking) => getText(tracking.currentStage)).filter(Boolean)
    );

    return Array.from(stages).sort();
  }, [trackingStates]);

  const uniqueAreas = useMemo(() => {
    const areas = new Set(
      trackingStates
        .map((tracking) => {
          const config = getStageConfig(tracking.currentStage);
          return getText(config?.responsibleArea);
        })
        .filter(Boolean)
    );

    return Array.from(areas).sort();
  }, [trackingStates]);

  const uniqueEnvolturas = useMemo(() => {
    const values = new Set(
      projects
        .map((project) => getText(project.envoltura, project.wrappingName))
        .filter(Boolean)
    );

    return Array.from(values).sort();
  }, [projects]);

  const uniqueUsosFinales = useMemo(() => {
    const values = new Set(
      projects
        .map((project) => getText(project.usoFinal, project.useFinalName))
        .filter(Boolean)
    );

    return Array.from(values).sort();
  }, [projects]);

  const uniqueMaquinas = useMemo(() => {
    const values = new Set(
      projects
        .map((project) =>
          getText(project.maquinaCliente, project.packingMachineName)
        )
        .filter(Boolean)
    );

    return Array.from(values).sort();
  }, [projects]);

  const augmentedProjects = useMemo(() => {
    return projects.map((project) => {
      const code = getText(project.code, project.id);
      const tracking = trackingStates.find(
        (trackingState) => trackingState.projectCode === code
      );

      const stageId = getText(
        tracking?.currentStage,
        project.currentPortalStage,
        (project as any).stageId,
        "P1"
      );

      const config = getStageConfig(stageId as ProjectStage);

      const slas = getProjectSlaSummary(code);
      const activeSla = slas.find((sla) => !sla.completedAt) || slas[0];

      const projectObservations = observations.filter(
        (observation) => observation.projectCode === code
      );

      const openObs = projectObservations.filter(
        (observation) => observation.status === "Abierta"
      ).length;

      const businessStatus = getProjectBusinessStatus(project, stageId, openObs);

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

      const isExternal =
        !config ||
        stageId.startsWith("P6") ||
        stageId.startsWith("P7") ||
        stageId.startsWith("P8") ||
        stageId.startsWith("P9") ||
        businessStatus === "Pendiente de alta" ||
        businessStatus === "Dado de alta";

      return {
        ...project,
        code,
        projectNameLabel: getText(project.projectName, (project as any).name),
        clientNameLabel: getText(project.clientName, (project as any).cli),
        portfolioCodeLabel: portfolioCode,
        portfolioNameLabel: portfolioName,
        stageId,
        stageName: getText(config?.name, "Registro de Proyecto"),
        responsibleArea: getText(config?.responsibleArea, "Comercial"),
        isExternal,
        activeSla,
        slaStatus,
        slaDaysRemaining,
        isSlaOverdue,
        isSlaDueSoon,
        openObs,
        businessStatus,
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
  }, [projects, trackingStates, observations, portfolios]);

  const totalProjects = augmentedProjects.length;

  const portalProjects = useMemo(
    () =>
      augmentedProjects.filter(
        (project) =>
          !project.isExternal &&
          project.businessStatus !== "Dado de alta" &&
          project.businessStatus !== "Desestimado"
      ),
    [augmentedProjects]
  );

  const observedProjects = useMemo(
    () =>
      augmentedProjects.filter(
        (project) =>
          project.openObs > 0 || project.businessStatus === "Observada"
      ),
    [augmentedProjects]
  );

  const overdueProjects = useMemo(
    () => augmentedProjects.filter((project) => project.isSlaOverdue),
    [augmentedProjects]
  );

  const completedProjects = useMemo(
    () =>
      augmentedProjects.filter(
        (project) => project.businessStatus === "Dado de alta"
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
        project.businessStatus,
        project.stageId,
        project.stageName,
        project.responsibleArea,
        project.envoltura,
        project.wrappingName,
        project.usoFinal,
        project.useFinalName,
        project.maquinaCliente,
        project.packingMachineName,
        project.createdByLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const wrapper = getText(project.envoltura, project.wrappingName);
      const usoFinal = getText(project.usoFinal, project.useFinalName);
      const machine = getText(project.maquinaCliente, project.packingMachineName);

      const matchesSearch = !search || searchableText.includes(search);

      const matchesTab =
        activeTab === "all" || project.businessStatus === activeTab;

      const matchesQuickFilter =
        quickFilter === "all" ||
        (quickFilter === "portal" && !project.isExternal) ||
        (quickFilter === "sistemaIntegral" && project.isExternal) ||
        (quickFilter === "overdue" && project.isSlaOverdue) ||
        (quickFilter === "observed" && project.openObs > 0) ||
        (quickFilter === "dueSoon" && project.isSlaDueSoon) ||
        (quickFilter === "withoutSla" && !project.activeSla);

      const matchesClient =
        !clientFilter || project.clientNameLabel === clientFilter;

      const matchesPortfolio =
        !portfolioFilter || project.portfolioCodeLabel === portfolioFilter;

      const matchesStage = !stageFilter || project.stageId === stageFilter;

      const matchesArea =
        !areaFilter || project.responsibleArea === areaFilter;

      const matchesEnvoltura =
        !envolturaFilter || wrapper === envolturaFilter;

      const matchesUsoFinal = !usoFinalFilter || usoFinal === usoFinalFilter;

      const matchesMaquina = !maquinaFilter || machine === maquinaFilter;

      return (
        matchesSearch &&
        matchesTab &&
        matchesQuickFilter &&
        matchesClient &&
        matchesPortfolio &&
        matchesStage &&
        matchesArea &&
        matchesEnvoltura &&
        matchesUsoFinal &&
        matchesMaquina
      );
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
  }, [
    augmentedProjects,
    query,
    activeTab,
    quickFilter,
    clientFilter,
    portfolioFilter,
    stageFilter,
    areaFilter,
    envolturaFilter,
    usoFinalFilter,
    maquinaFilter,
    sortConfig,
  ]);

  const clearFilters = () => {
    setQuery("");
    setActiveTab("all");
    setQuickFilter("all");
    setClientFilter("");
    setPortfolioFilter("");
    setStageFilter("");
    setAreaFilter("");
    setEnvolturaFilter("");
    setUsoFinalFilter("");
    setMaquinaFilter("");
    setSortConfig({ key: "createdAt", direction: "desc" });
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
        (project) => project.businessStatus === status
      ).length,
    })),
  ];

  const quickFilters = [
    { key: "all" as QuickFilter, label: "Todos" },
    { key: "portal" as QuickFilter, label: "En Portal Web" },
    { key: "sistemaIntegral" as QuickFilter, label: "Sistema Integral" },
    { key: "overdue" as QuickFilter, label: "SLA vencido" },
    { key: "observed" as QuickFilter, label: "Con observaciones" },
    { key: "dueSoon" as QuickFilter, label: "Por vencer" },
    { key: "withoutSla" as QuickFilter, label: "Sin SLA" },
  ];

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
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

            <div className="rounded-xl bg-[#e8f4f8] p-3 text-[#003b5c]">
              <BriefcaseBusiness size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                En Portal Web
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {portalProjects.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Seguimiento P1-P5
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Layers3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                Observados
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {observedProjects.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Requieren corrección
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FileWarning size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                SLA vencido
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {overdueProjects.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Proyectos críticos
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Dados de alta
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {completedProjects.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                SKU confirmado
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
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
                      ? "border-[#003b5c] text-[#003b5c]"
                      : "border-transparent text-slate-500 hover:text-[#003b5c]"
                  }`}
                >
                  {tab.label}

                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-[#e8f4f8] text-[#003b5c]"
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

        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
              Filtros rápidos
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickFilters.map((filter) => {
                const isActive = quickFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setQuickFilter(filter.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      isActive
                        ? "border-[#003b5c] bg-[#003b5c] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#003b5c] hover:text-[#003b5c]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
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
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-[#003b5c] hover:text-[#003b5c]"
              >
                <RotateCcw size={16} />
                Limpiar Filtros
              </button>

              <button
                type="button"
                onClick={() => navigate("/projects/new")}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#003b5c] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002b43]"
              >
                <Plus size={16} />
                Nuevo Proyecto
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 px-5 py-4">
          <details className="group">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-slate-600 transition-colors hover:text-[#003b5c]">
              Filtros adicionales
            </summary>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Cliente
            </label>

            <select
              value={clientFilter}
              onChange={(event) => setClientFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos los clientes</option>

              {recentClients.map((client) => (
                <option key={client.code} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Portafolio
            </label>

            <select
              value={portfolioFilter}
              onChange={(event) => setPortfolioFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos los portafolios</option>

              {portfolioOptions.map((portfolio) => (
                <option key={portfolio.code} value={portfolio.code}>
                  {portfolio.code} - {portfolio.name || "Sin nombre"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Etapa
            </label>

            <select
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todas las etapas</option>

              {uniqueStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Área
            </label>

            <select
              value={areaFilter}
              onChange={(event) => setAreaFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todas las áreas</option>

              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Envoltura
            </label>

            <select
              value={envolturaFilter}
              onChange={(event) => setEnvolturaFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todas</option>

              {uniqueEnvolturas.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Uso Final
            </label>

            <select
              value={usoFinalFilter}
              onChange={(event) => setUsoFinalFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos</option>

              {uniqueUsosFinales.map((uso) => (
                <option key={uso} value={uso}>
                  {uso}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Máquina Cliente
            </label>

            <select
              value={maquinaFilter}
              onChange={(event) => setMaquinaFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todas</option>

              {uniqueMaquinas.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
          </div>
            </div>
          </details>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1650px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#003b5c] text-white">
                <SortableHeader label="Código" sortKey="code" />
                <SortableHeader label="Proyecto" sortKey="projectName" />
                <SortableHeader label="Cliente" sortKey="clientName" />
                <SortableHeader label="Portafolio" sortKey="portfolio" />
                <SortableHeader label="Estado Proyecto" sortKey="businessStatus" />
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
              {filteredProjects.map((item, index) => (
                <tr
                  key={item.code || item.id}
                  className={`border-b border-slate-100 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  } hover:bg-[#e8f4f8]`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-extrabold text-[#003b5c]">
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
                    <ProjectBusinessStatusBadge status={item.businessStatus} />
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <div
                      className={`font-bold ${
                        item.isExternal ? "text-slate-500" : "text-[#003b5c]"
                      }`}
                    >
                      {item.stageId} - {item.stageName}
                    </div>

                    {item.isExternal && (
                      <div className="mt-0.5 text-xs text-slate-400">
                        Seguimiento externo
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-bold ${
                        item.isExternal
                          ? "border-slate-200 bg-slate-100 text-slate-500"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}
                    >
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${item.code || item.id}`)}
                      >
                        Tracking
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/projects/${item.code || item.id}/edit`)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(item.code || item.id)}
                        className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        Duplicar
                      </Button>
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
      </div>
    </div>
  );
}