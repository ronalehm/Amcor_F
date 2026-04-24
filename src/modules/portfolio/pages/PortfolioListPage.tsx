import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BriefcaseBusiness,
  CheckCircle2,
  CircleOff,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getPortfolioDisplayRecords } from "../../../shared/data/portfolioStorage";
import { getClientCatalogRecords } from "../../../shared/data/clientStorage";
import { getActiveExecutiveRecords } from "../../../shared/data/executiveStorage";

type PortfolioTab = "all" | "active" | "inactive";
type QuickFilter = "all" | "withWrapper" | "withMachine" | "withoutMachine";
type SortDirection = "asc" | "desc";

type SortKey =
  | "codigo"
  | "nombre"
  | "clientName"
  | "ejecutivoName"
  | "envoltura"
  | "maquinaCliente"
  | "usoFinal"
  | "createdAt"
  | "createdBy";

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

const getPortfolioStatus = (portfolio: any): "activo" | "inactivo" => {
  const rawStatus = getText(
    portfolio.status,
    portfolio.est,
    portfolio.estado,
    portfolio.isActive === false ? "inactivo" : "",
    portfolio.active === false ? "inactivo" : "",
    "activo"
  ).toLowerCase();

  if (
    rawStatus.includes("inactivo") ||
    rawStatus.includes("inactive") ||
    rawStatus === "false"
  ) {
    return "inactivo";
  }

  return "activo";
};

const getSortValue = (portfolio: any, key: SortKey): string | number => {
  switch (key) {
    case "codigo":
      return getText(portfolio.codigo, portfolio.id).toLowerCase();

    case "nombre":
      return getText(
        portfolio.nombre,
        portfolio.portfolioName,
        portfolio.nom
      ).toLowerCase();

    case "clientName":
      return getText(portfolio.clientName, portfolio.cli).toLowerCase();

    case "ejecutivoName":
      return getText(portfolio.ejecutivoName, portfolio.ej).toLowerCase();

    case "envoltura":
      return getText(portfolio.envoltura, portfolio.env).toLowerCase();

    case "maquinaCliente":
      return getText(portfolio.maquinaCliente, portfolio.maquina).toLowerCase();

    case "usoFinal":
      return getText(portfolio.usoFinal, portfolio.uso).toLowerCase();

    case "createdAt": {
      const dateValue = getText(
        portfolio.createdAt,
        portfolio.createdDate,
        portfolio.fechaCreacion,
        portfolio.fecha_creacion
      );

      const time = new Date(dateValue).getTime();

      return Number.isNaN(time) ? 0 : time;
    }

    case "createdBy":
      return getText(
        portfolio.createdByName,
        portfolio.createdBy,
        portfolio.userName,
        portfolio.username,
        portfolio.usuario
      ).toLowerCase();

    default:
      return "";
  }
};

export default function PortfolioListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PortfolioTab>("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  const [clientFilter, setClientFilter] = useState("");
  const [executiveFilter, setExecutiveFilter] = useState("");
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
      title: "Portafolios",
      breadcrumbs: [{ label: "Portafolios" }, { label: "Lista de Portafolios" }],
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);

  const recentClients = useMemo(() => {
    const clients = getClientCatalogRecords();

    return clients
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, []);

  const executiveOptions = useMemo(() => getActiveExecutiveRecords(), []);

  const uniqueEnvolturas = useMemo(() => {
    const values = new Set(
      portfolios.map((p) => getText(p.envoltura, p.env)).filter(Boolean)
    );

    return Array.from(values).sort();
  }, [portfolios]);

  const uniqueUsosFinales = useMemo(() => {
    const values = new Set(
      portfolios.map((p) => getText(p.usoFinal, p.uso)).filter(Boolean)
    );

    return Array.from(values).sort();
  }, [portfolios]);

  const uniqueMaquinas = useMemo(() => {
    const values = new Set(
      portfolios.map((p) => getText(p.maquinaCliente, p.maquina)).filter(Boolean)
    );

    return Array.from(values).sort();
  }, [portfolios]);

  const activePortfolios = useMemo(
    () => portfolios.filter((portfolio) => getPortfolioStatus(portfolio) === "activo"),
    [portfolios]
  );

  const inactivePortfolios = useMemo(
    () => portfolios.filter((portfolio) => getPortfolioStatus(portfolio) === "inactivo"),
    [portfolios]
  );

  const filteredPortfolios = useMemo(() => {
    const search = query.trim().toLowerCase();

    const filtered = portfolios.filter((portfolio) => {
      const status = getPortfolioStatus(portfolio);

      const searchableText = [
        portfolio.codigo,
        portfolio.id,
        portfolio.nombre,
        portfolio.portfolioName,
        portfolio.nom,
        portfolio.clientName,
        portfolio.cli,
        portfolio.ejecutivoName,
        portfolio.ej,
        portfolio.envoltura,
        portfolio.env,
        portfolio.maquinaCliente,
        portfolio.maquina,
        portfolio.usoFinal,
        portfolio.uso,
        portfolio.createdByName,
        portfolio.createdBy,
        portfolio.userName,
        portfolio.username,
        portfolio.usuario,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const wrapper = getText(portfolio.envoltura, portfolio.env);
      const machine = getText(portfolio.maquinaCliente, portfolio.maquina);

      const matchesSearch = !search || searchableText.includes(search);

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && status === "activo") ||
        (activeTab === "inactive" && status === "inactivo");

      const matchesQuickFilter =
        quickFilter === "all" ||
        (quickFilter === "withWrapper" && Boolean(wrapper)) ||
        (quickFilter === "withMachine" && Boolean(machine)) ||
        (quickFilter === "withoutMachine" && !machine);

      const matchesClient =
        !clientFilter ||
        portfolio.clientName === clientFilter ||
        portfolio.clientCode === clientFilter;

      const matchesExecutive =
        !executiveFilter || portfolio.ejecutivoName === executiveFilter;

      const matchesEnvoltura = !envolturaFilter || wrapper === envolturaFilter;

      const matchesUsoFinal =
        !usoFinalFilter ||
        getText(portfolio.usoFinal, portfolio.uso) === usoFinalFilter;

      const matchesMaquina = !maquinaFilter || machine === maquinaFilter;

      return (
        matchesSearch &&
        matchesTab &&
        matchesQuickFilter &&
        matchesClient &&
        matchesExecutive &&
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
    portfolios,
    query,
    activeTab,
    quickFilter,
    clientFilter,
    executiveFilter,
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
    setExecutiveFilter("");
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
      key: "all" as PortfolioTab,
      label: "Todos los portafolios",
      count: portfolios.length,
    },
    {
      key: "active" as PortfolioTab,
      label: "Activos",
      count: activePortfolios.length,
    },
    {
      key: "inactive" as PortfolioTab,
      label: "Inactivos",
      count: inactivePortfolios.length,
    },
  ];

  const quickFilters = [
    { key: "all" as QuickFilter, label: "Todos" },
    { key: "withWrapper" as QuickFilter, label: "Con envoltura" },
    { key: "withMachine" as QuickFilter, label: "Con máquina cliente" },
    { key: "withoutMachine" as QuickFilter, label: "Sin máquina cliente" },
  ];

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total portafolios
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {portfolios.length}
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

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Portafolios activos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {activePortfolios.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Disponibles para gestión
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Portafolios inactivos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {inactivePortfolios.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Fuera de gestión activa
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-500">
              <CircleOff size={22} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`border-b-2 pb-3 text-sm font-bold transition-colors ${
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
            Mostrando {filteredPortfolios.length} de {portfolios.length} registros
          </p>
        </div>

        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por código, nombre, cliente..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
                />
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-[#003b5c] hover:text-[#003b5c]"
              >
                <RotateCcw size={16} />
                Limpiar filtros
              </button>

              <button
                type="button"
                onClick={() => navigate("/portfolio/new")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003b5c] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002b43]"
              >
                <Plus size={16} />
                Crear Portafolio
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Cliente
            </label>

            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
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
              Ejecutivo
            </label>

            <select
              value={executiveFilter}
              onChange={(e) => setExecutiveFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos los ejecutivos</option>

              {executiveOptions.map((exec) => (
                <option key={exec.id} value={exec.name}>
                  {exec.name}
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
              onChange={(e) => setEnvolturaFilter(e.target.value)}
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
              onChange={(e) => setUsoFinalFilter(e.target.value)}
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
              onChange={(e) => setMaquinaFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todas</option>

              {uniqueMaquinas.map((maq) => (
                <option key={maq} value={maq}>
                  {maq}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#003b5c] text-white">
                <SortableHeader label="Código" sortKey="codigo" />
                <SortableHeader label="Nombre Portafolio" sortKey="nombre" />
                <SortableHeader label="Cliente" sortKey="clientName" />
                <SortableHeader label="Ejecutivo" sortKey="ejecutivoName" />
                <SortableHeader label="Envoltura" sortKey="envoltura" />
                <SortableHeader label="Máquina Cliente" sortKey="maquinaCliente" />
                <SortableHeader label="Uso Final" sortKey="usoFinal" />
                <SortableHeader label="Fecha de creación" sortKey="createdAt" />
                <SortableHeader label="Usuario" sortKey="createdBy" />

                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPortfolios.map((item, index) => (
                <tr
                  key={item.codigo || item.id}
                  className={`border-b border-slate-100 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  } hover:bg-[#e8f4f8]`}
                >
                  <td className="px-4 py-3 text-sm font-extrabold text-[#003b5c]">
                    {item.codigo || item.id || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                    {getText(item.nombre, item.portfolioName, item.nom) || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-slate-700">
                    {getText(item.clientName, item.cli) || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getText(item.ejecutivoName, item.ej) || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getText(item.envoltura, item.env) || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getText(item.maquinaCliente, item.maquina) || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getText(item.usoFinal, item.uso) || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(
                      item.createdAt,
                      item.createdDate,
                      item.fechaCreacion,
                      item.fecha_creacion
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getText(
                      item.createdByName,
                      item.createdBy,
                      item.userName,
                      item.username,
                      item.usuario
                    ) || "—"}
                  </td>

                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/portfolio/${item.codigo || item.id}`)}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-[#003b5c]"
                      >
                        Ver Detalle
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/portfolio/${item.codigo || item.id}/edit`)
                        }
                        className="rounded-md border border-[#003b5c] bg-[#003b5c]/5 px-3 py-1.5 text-xs font-bold text-[#003b5c] shadow-sm transition-colors hover:bg-[#003b5c] hover:text-white"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPortfolios.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-3">
                        <BriefcaseBusiness size={26} className="text-slate-400" />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        No se encontraron portafolios
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