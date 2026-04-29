import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Mail,
  Plus,
  RotateCcw,
  Search,
  UserX,
  Users,
  ShieldCheck,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import {
  getAllClients,
  type Client,
  type ClientStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from "../../../shared/data/clientStorage";

import ActionButton from "../../../shared/components/buttons/ActionButton";

type ClientTab = "all" | ClientStatus;
type SortDirection = "asc" | "desc";
type SortKey = "code" | "businessName" | "email" | "ruc" | "industry" | "status" | "createdAt";

const getText = (...values: any[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== "",
  );
  return value ? String(value) : "";
};

const getClientStatus = (client: Client): ClientStatus => {
  return client.status;
};

const getSortValue = (client: Client, key: SortKey): string | number => {
  switch (key) {
    case "code": return getText(client.code).toLowerCase();
    case "businessName": return getText(client.businessName).toLowerCase();
    case "email": return getText(client.email).toLowerCase();
    case "ruc": return getText(client.ruc).toLowerCase();
    case "industry": return getText(client.industry).toLowerCase();
    case "status": return STATUS_LABELS[getClientStatus(client)].toLowerCase();
    case "createdAt": {
      const createdAt = client.createdAt;
      const time = createdAt ? new Date(createdAt).getTime() : 0;
      return Number.isNaN(time) ? 0 : time;
    }
    default: return "";
  }
};

export default function ClientListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ClientTab>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    setHeader({
      title: "Gestión de Clientes",
      breadcrumbs: [{ label: "Clientes" }, { label: "Lista de Clientes" }],
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const clients = useMemo(() => getAllClients(), []);

  const activeClients = useMemo(
    () => clients.filter((client) => getClientStatus(client) === "active"),
    [clients],
  );

  const inactiveClients = useMemo(
    () => clients.filter((client) => getClientStatus(client) === "inactive"),
    [clients],
  );

  const pendingActivationClients = useMemo(
    () => clients.filter((client) => getClientStatus(client) === "pending_activation"),
    [clients],
  );

  const pendingValidationClients = useMemo(
    () => clients.filter((client) => getClientStatus(client) === "pending_validation"),
    [clients],
  );

  const blockedClients = useMemo(
    () => clients.filter((client) => getClientStatus(client) === "blocked"),
    [clients],
  );

  const industryOptions = useMemo(() => {
    const industries = new Set(clients.map((client) => getText(client.industry)).filter(Boolean));
    return Array.from(industries).sort();
  }, [clients]);

  const filteredClients = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = clients.filter((client) => {
      const clientStatus = getClientStatus(client);
      const statusLabel = STATUS_LABELS[clientStatus];
      const searchableText = [
        client.code, client.email, client.businessName, client.ruc, client.industry, statusLabel, client.createdAt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);
      const matchesTab = activeTab === "all" || clientStatus === activeTab;
      const matchesIndustry = !industryFilter || client.industry === industryFilter;

      return matchesSearch && matchesTab && matchesIndustry;
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
  }, [clients, query, activeTab, industryFilter, sortConfig]);

  const totalRecords = filteredClients.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeTab, industryFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setQuery("");
    setActiveTab("all");
    setIndustryFilter("");
    setPageSize(25);
    setCurrentPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
  };

  const requestSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "createdAt" ? "desc" : "asc" };
    });
  };

  const SortIcon = ({ sortKey }: { sortKey: SortKey }) => {
    if (sortConfig.key !== sortKey) return <ArrowUpDown size={14} className="text-white/60" />;
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
    { key: "all" as ClientTab, label: "Todos", count: clients.length },
    { key: "active" as ClientTab, label: "Activos", count: activeClients.length },
    { key: "pending_activation" as ClientTab, label: "Pendiente Act.", count: pendingActivationClients.length },
    { key: "pending_validation" as ClientTab, label: "Pendiente Val.", count: pendingValidationClients.length },
    { key: "blocked" as ClientTab, label: "Bloqueados", count: blockedClients.length },
    { key: "inactive" as ClientTab, label: "Inactivos", count: inactiveClients.length },
  ];

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{clients.length}</p></div>
            <div className="rounded-lg bg-[#e8f4f8] p-2 text-[#003b5c]"><Users size={18} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-green-600">Activos</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{activeClients.length}</p></div>
            <div className="rounded-lg bg-green-50 p-2 text-green-600"><Users size={18} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-amber-600">Pend. Activación</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{pendingActivationClients.length}</p></div>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600"><Mail size={18} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Pend. Validación</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{pendingValidationClients.length}</p></div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><ShieldCheck size={18} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-red-600">Bloqueados</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{blockedClients.length}</p></div>
            <div className="rounded-lg bg-red-50 p-2 text-red-600"><UserX size={18} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-slate-600">Inactivos</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{inactiveClients.length}</p></div>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600"><UserX size={18} /></div>
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
                  className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${isActive ? "border-[#003b5c] text-[#003b5c]" : "border-transparent text-slate-500 hover:text-[#003b5c]"}`}
                >
                  {tab.label}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-[#e8f4f8] text-[#003b5c]" : "bg-slate-100 text-slate-500"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="pb-3 text-xs font-medium text-slate-500">
            Mostrando {filteredClients.length} de {clients.length} registros
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 xl:grid-cols-[2.4fr_0.9fr_auto]">
          <div><label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Buscar</label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, email, RUC, código o rubro..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]" />
            </div>
          </div>

          <div><label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Rubro</label>
            <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]">
              <option value="">Todos los rubros</option>
              {industryOptions.map((industry) => (<option key={industry} value={industry}>{industry}</option>))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <ActionButton label="Limpiar Filtros" onClick={clearFilters} variant="outline" icon={<RotateCcw size={16} />} />
            <ActionButton label="Crear Cliente" onClick={() => navigate("/clients/new")} variant="primary" icon={<Plus size={16} />} />
          </div>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#003b5c] text-white">
                <SortableHeader label="Código" sortKey="code" />
                <SortableHeader label="Razón Social" sortKey="businessName" />
                <SortableHeader label="Email" sortKey="email" />
                <SortableHeader label="RUC" sortKey="ruc" />
                <SortableHeader label="Rubro" sortKey="industry" />
                <SortableHeader label="Estado" sortKey="status" />
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClients.map((client, index) => (
                <tr key={client.id} className={`transition-colors hover:bg-[#e8f4f8] ${index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-extrabold text-[#003b5c]">{client.code || "—"}</td>
                  <td className="px-4 py-3 text-sm"><div className="font-bold text-slate-800">{client.businessName}</div></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{client.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{client.ruc || "—"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{client.industry || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[client.status]}`}>
                      {STATUS_LABELS[client.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton label="Ver" size="sm" variant="primary" onClick={() => navigate(`/clients/${client.code}`)} />
                      <ActionButton label="Editar" variant="outline" size="sm" onClick={() => navigate(`/clients/${client.code}/edit`)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-3">
                        <Users size={26} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No se encontraron clientes</p>
                      <p className="mt-1 text-xs text-slate-400">Intenta limpiar filtros o cambiar el criterio de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>N°</span>
            <span className="ml-3 text-xs text-slate-500">
              Mostrando <strong className="text-slate-700">{startRecord}</strong> - <strong className="text-slate-700">{endRecord}</strong> de <strong className="text-slate-700">{totalRecords}</strong> registros
            </span>
          </div>

          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#003b5c] hover:text-[#003b5c] disabled:cursor-not-allowed disabled:opacity-50">
              ‹ Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${currentPage === page ? "border-[#003b5c] bg-[#003b5c] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#003b5c] hover:text-[#003b5c]"}`}>
                {page}
              </button>
            ))}

            <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#003b5c] hover:text-[#003b5c] disabled:cursor-not-allowed disabled:opacity-50">
              Next ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
