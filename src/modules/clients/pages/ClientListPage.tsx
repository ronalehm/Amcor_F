import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  CircleOff,
  Clock3,
  FileWarning,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getClientCatalogRecords } from "../../../shared/data/clientStorage";

type ClientStatusKey = "all" | "active" | "inactive" | "validation" | "rejected";
type SourceKey = "all" | "si" | "portal";
type AvailabilityKey = "all" | "available" | "unavailable";
type SortDirection = "asc" | "desc";

type SortKey =
  | "code"
  | "documentType"
  | "documentNumber"
  | "name"
  | "commercialName"
  | "status"
  | "source"
  | "availability"
  | "createdAt"
  | "createdBy";

type ClientListItem = {
  id?: number | string;
  code?: string;
  name?: string;
  businessName?: string;
  razonSocial?: string;
  legalName?: string;
  ruc?: string;
  documentNumber?: string;
  nroDocumento?: string;
  numeroDocumento?: string;
  documentType?: string;
  tipoDocumento?: string;
  documentTypeName?: string;
  commercialName?: string;
  nombreComercial?: string;
  status?: string;
  estado?: string;
  source?: string;
  origin?: string;
  origen?: string;
  importedFrom?: string;
  createdAt?: string;
  createdDate?: string;
  fechaCreacion?: string;
  fecha_creacion?: string;
  createdBy?: string;
  createdByName?: string;
  userName?: string;
  username?: string;
  usuario?: string;
  [key: string]: any;
};

const CLIENT_STATUS_LABELS: Record<Exclude<ClientStatusKey, "all">, string> = {
  active: "Activo",
  inactive: "Inactivo",
  validation: "En validación",
  rejected: "Rechazado",
};

const CLIENT_STATUS_STYLES: Record<Exclude<ClientStatusKey, "all">, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-slate-200 bg-slate-100 text-slate-600",
  validation: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

const SOURCE_LABELS: Record<Exclude<SourceKey, "all">, string> = {
  si: "Sistema Integral",
  portal: "Portal Web",
};

const AVAILABILITY_LABELS: Record<Exclude<AvailabilityKey, "all">, string> = {
  available: "Disponible",
  unavailable: "No disponible",
};

const getText = (...values: any[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== "",
  );

  return value !== undefined && value !== null ? String(value) : "";
};

const normalizeText = (...values: any[]) =>
  getText(...values).trim().toLowerCase();

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

const getClientCode = (client: ClientListItem) => {
  return getText(client.code, client.id);
};

const getClientName = (client: ClientListItem) => {
  return (
    getText(
      client.name,
      client.businessName,
      client.razonSocial,
      client.legalName,
    ) || "—"
  );
};

const getClientCommercialName = (client: ClientListItem) => {
  return getText(client.commercialName, client.nombreComercial);
};

const getClientDocumentNumber = (client: ClientListItem) => {
  return getText(
    client.ruc,
    client.documentNumber,
    client.nroDocumento,
    client.numeroDocumento,
  );
};

const getClientDocumentType = (client: ClientListItem) => {
  const type = getText(
    client.documentType,
    client.tipoDocumento,
    client.documentTypeName,
  );

  if (type) return type;

  const documentNumber = getClientDocumentNumber(client);

  if (documentNumber.length === 11) return "RUC";

  return "";
};

const getClientCreatedBy = (client: ClientListItem) => {
  return getText(
    client.createdByName,
    client.createdBy,
    client.userName,
    client.username,
    client.usuario,
  );
};

const getClientStatusKey = (
  client: ClientListItem,
): Exclude<ClientStatusKey, "all"> => {
  const rawStatus = normalizeText(client.status, client.estado);

  if (
    rawStatus.includes("rechaz") ||
    rawStatus.includes("reject") ||
    rawStatus.includes("no aprobado")
  ) {
    return "rejected";
  }

  if (
    rawStatus.includes("inactivo") ||
    rawStatus.includes("inactive") ||
    rawStatus.includes("baja") ||
    rawStatus.includes("deshabilitado")
  ) {
    return "inactive";
  }

  if (
    rawStatus.includes("validación") ||
    rawStatus.includes("validacion") ||
    rawStatus.includes("validating") ||
    rawStatus.includes("preliminar") ||
    rawStatus.includes("registrado") ||
    rawStatus.includes("pendiente")
  ) {
    return "validation";
  }

  if (
    rawStatus.includes("activo") ||
    rawStatus.includes("active") ||
    rawStatus.includes("habilitado")
  ) {
    return "active";
  }

  const rawSource = normalizeText(
    client.source,
    client.origin,
    client.origen,
    client.importedFrom,
  );

  if (
    rawSource.includes("sistema integral") ||
    rawSource.includes("si") ||
    rawSource.includes("json") ||
    rawSource.includes("api")
  ) {
    return "active";
  }

  return "validation";
};

const getClientStatusLabel = (client: ClientListItem) => {
  return CLIENT_STATUS_LABELS[getClientStatusKey(client)];
};

const getClientSourceKey = (client: ClientListItem): Exclude<SourceKey, "all"> => {
  const statusKey = getClientStatusKey(client);

  if (statusKey === "active" || statusKey === "inactive") {
    return "si";
  }

  return "portal";
};

const getClientSourceLabel = (client: ClientListItem) => {
  return SOURCE_LABELS[getClientSourceKey(client)];
};

const getClientAvailabilityKey = (
  client: ClientListItem,
): Exclude<AvailabilityKey, "all"> => {
  const statusKey = getClientStatusKey(client);

  if (statusKey === "active" || statusKey === "validation") {
    return "available";
  }

  return "unavailable";
};

const getClientAvailabilityLabel = (client: ClientListItem) => {
  const statusKey = getClientStatusKey(client);

  if (statusKey === "validation") {
    return "Disponible con restricción";
  }

  return AVAILABILITY_LABELS[getClientAvailabilityKey(client)];
};

const getSortValue = (
  client: ClientListItem,
  key: SortKey,
): string | number => {
  switch (key) {
    case "code":
      return getClientCode(client).toLowerCase();

    case "documentType":
      return getClientDocumentType(client).toLowerCase();

    case "documentNumber":
      return getClientDocumentNumber(client).toLowerCase();

    case "name":
      return getClientName(client).toLowerCase();

    case "commercialName":
      return getClientCommercialName(client).toLowerCase();

    case "status": {
      const statusOrder: Record<Exclude<ClientStatusKey, "all">, number> = {
        active: 1,
        validation: 2,
        inactive: 3,
        rejected: 4,
      };

      return statusOrder[getClientStatusKey(client)];
    }

    case "source":
      return getClientSourceLabel(client).toLowerCase();

    case "availability":
      return getClientAvailabilityLabel(client).toLowerCase();

    case "createdAt": {
      const dateValue = getText(
        client.createdAt,
        client.createdDate,
        client.fechaCreacion,
        client.fecha_creacion,
      );

      const time = new Date(dateValue).getTime();

      return Number.isNaN(time) ? 0 : time;
    }

    case "createdBy":
      return getClientCreatedBy(client).toLowerCase();

    default:
      return "";
  }
};

const ClientStatusBadge = ({ client }: { client: ClientListItem }) => {
  const statusKey = getClientStatusKey(client);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${CLIENT_STATUS_STYLES[statusKey]}`}
    >
      {CLIENT_STATUS_LABELS[statusKey]}
    </span>
  );
};

const SourceBadge = ({ client }: { client: ClientListItem }) => {
  const sourceKey = getClientSourceKey(client);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${
        sourceKey === "si"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {SOURCE_LABELS[sourceKey]}
    </span>
  );
};

const AvailabilityBadge = ({ client }: { client: ClientListItem }) => {
  const availabilityKey = getClientAvailabilityKey(client);
  const statusKey = getClientStatusKey(client);

  const style =
    statusKey === "validation"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : availabilityKey === "available"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-red-200 bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${style}`}
    >
      {getClientAvailabilityLabel(client)}
    </span>
  );
};

export default function ClientListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ClientStatusKey>("all");

  const [documentTypeFilter, setDocumentTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceKey>("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityKey>("all");
  const [createdByFilter, setCreatedByFilter] = useState("");

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
      title: "Clientes",
      breadcrumbs: [{ label: "Clientes" }, { label: "Lista de Clientes" }],
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const clients = useMemo<ClientListItem[]>(() => {
    return getClientCatalogRecords() as ClientListItem[];
  }, []);

  const activeClients = useMemo(
    () => clients.filter((client) => getClientStatusKey(client) === "active"),
    [clients],
  );

  const inactiveClients = useMemo(
    () => clients.filter((client) => getClientStatusKey(client) === "inactive"),
    [clients],
  );

  const validationClients = useMemo(
    () => clients.filter((client) => getClientStatusKey(client) === "validation"),
    [clients],
  );

  const rejectedClients = useMemo(
    () => clients.filter((client) => getClientStatusKey(client) === "rejected"),
    [clients],
  );

  const documentTypeOptions = useMemo(() => {
    const values = new Set(
      clients.map((client) => getClientDocumentType(client)).filter(Boolean),
    );

    return Array.from(values).sort();
  }, [clients]);

  const createdByOptions = useMemo(() => {
    const values = new Set(
      clients.map((client) => getClientCreatedBy(client)).filter(Boolean),
    );

    return Array.from(values).sort();
  }, [clients]);

  const filteredClients = useMemo(() => {
    const search = query.trim().toLowerCase();

    const filtered = clients.filter((client) => {
      const statusKey = getClientStatusKey(client);
      const sourceKey = getClientSourceKey(client);
      const availabilityKey = getClientAvailabilityKey(client);
      const documentType = getClientDocumentType(client);
      const createdBy = getClientCreatedBy(client);

      const searchableText = [
        getClientCode(client),
        getClientName(client),
        getClientCommercialName(client),
        documentType,
        getClientDocumentNumber(client),
        getClientStatusLabel(client),
        getClientSourceLabel(client),
        getClientAvailabilityLabel(client),
        createdBy,
        client.createdAt,
        client.createdDate,
        client.fechaCreacion,
        client.fecha_creacion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);

      const matchesTab = activeTab === "all" || statusKey === activeTab;

      const matchesDocumentType =
        !documentTypeFilter || documentType === documentTypeFilter;

      const matchesSource = sourceFilter === "all" || sourceKey === sourceFilter;

      const matchesAvailability =
        availabilityFilter === "all" || availabilityKey === availabilityFilter;

      const matchesCreatedBy = !createdByFilter || createdBy === createdByFilter;

      return (
        matchesSearch &&
        matchesTab &&
        matchesDocumentType &&
        matchesSource &&
        matchesAvailability &&
        matchesCreatedBy
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
    clients,
    query,
    activeTab,
    documentTypeFilter,
    sourceFilter,
    availabilityFilter,
    createdByFilter,
    sortConfig,
  ]);

  const totalRecords = filteredClients.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    activeTab,
    documentTypeFilter,
    sourceFilter,
    availabilityFilter,
    createdByFilter,
    pageSize,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setQuery("");
    setActiveTab("all");
    setDocumentTypeFilter("");
    setSourceFilter("all");
    setAvailabilityFilter("all");
    setCreatedByFilter("");
    setPageSize(25);
    setCurrentPage(1);
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
      key: "all" as ClientStatusKey,
      label: "Todos los clientes",
      count: clients.length,
    },
    {
      key: "active" as ClientStatusKey,
      label: "Activos",
      count: activeClients.length,
    },
    {
      key: "inactive" as ClientStatusKey,
      label: "Inactivos",
      count: inactiveClients.length,
    },
    {
      key: "validation" as ClientStatusKey,
      label: "En validación",
      count: validationClients.length,
    },
    {
      key: "rejected" as ClientStatusKey,
      label: "Rechazados",
      count: rejectedClients.length,
    },
  ];

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total clientes
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {clients.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Registrados en plataforma
              </p>
            </div>

            <div className="rounded-xl bg-[#e8f4f8] p-3 text-[#003b5c]">
              <Building2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Clientes activos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {activeClients.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Confirmados en SI
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
                Clientes inactivos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {inactiveClients.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                No disponibles
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-500">
              <CircleOff size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                En validación
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {validationClients.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                RFQ preliminar
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                Rechazados
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {rejectedClients.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Históricos / huérfanos
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <FileWarning size={22} />
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
            Mostrando {filteredClients.length} de {clients.length} registros
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 xl:grid-cols-[2.3fr_0.85fr_0.95fr_1fr_1fr_auto]">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Buscar
            </label>

            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por cliente, RUC, razón social, nombre comercial, origen o estado..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Tipo Doc.
            </label>

            <select
              value={documentTypeFilter}
              onChange={(event) => setDocumentTypeFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos</option>

              {documentTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Origen
            </label>

            <select
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(event.target.value as SourceKey)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="all">Todos</option>
              <option value="si">Sistema Integral</option>
              <option value="portal">Portal Web</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Disponibilidad
            </label>

            <select
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(event.target.value as AvailabilityKey)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="all">Todas</option>
              <option value="available">Disponible</option>
              <option value="unavailable">No disponible</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Usuario
            </label>

            <select
              value={createdByFilter}
              onChange={(event) => setCreatedByFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos</option>

              {createdByOptions.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
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
              onClick={() => navigate("/clients/new")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#003b5c] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002b43]"
            >
              <Plus size={16} />
              Crear Cliente
            </button>
          </div>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#003b5c] text-white">
                <SortableHeader label="Código" sortKey="code" />
                <SortableHeader label="Tipo Doc." sortKey="documentType" />
                <SortableHeader label="N° Documento" sortKey="documentNumber" />
                <SortableHeader label="Razón Social" sortKey="name" />
                <SortableHeader label="Nombre Comercial" sortKey="commercialName" />
                <SortableHeader label="Estado" sortKey="status" />
                <SortableHeader label="Origen" sortKey="source" />
                <SortableHeader label="Disponibilidad" sortKey="availability" />
                <SortableHeader label="Fecha creación" sortKey="createdAt" />
                <SortableHeader label="Usuario" sortKey="createdBy" />

                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedClients.map((client, index) => {
                const clientCode = getClientCode(client);

                return (
                  <tr
                    key={`${clientCode}-${getClientDocumentNumber(client) || client.id}`}
                    className={`border-b border-slate-100 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                    } hover:bg-[#e8f4f8]`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-extrabold text-[#003b5c]">
                      {clientCode || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {getClientDocumentType(client) || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                      {getClientDocumentNumber(client) || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="font-bold text-slate-800">
                        {getClientName(client)}
                      </div>

                      <div className="mt-0.5 text-xs text-slate-500">
                        Cliente maestro
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {getClientCommercialName(client) || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <ClientStatusBadge client={client} />
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <SourceBadge client={client} />
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <AvailabilityBadge client={client} />
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(
                        client.createdAt,
                        client.createdDate,
                        client.fechaCreacion,
                        client.fecha_creacion,
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {getClientCreatedBy(client) || "—"}
                    </td>

                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/clients/${clientCode}`)}
                          className="rounded-md border border-[#003b5c] bg-[#003b5c] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#002b43]"
                        >
                          Ver
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/clients/${clientCode}/edit`)}
                          className="rounded-md border border-[#003b5c] bg-[#003b5c]/5 px-3 py-1.5 text-xs font-bold text-[#003b5c] shadow-sm transition-colors hover:bg-[#003b5c] hover:text-white"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-3">
                        <Building2 size={26} className="text-slate-400" />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        No se encontraron clientes
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

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <span>N°</span>

            <span className="ml-3 text-xs text-slate-500">
              Mostrando{" "}
              <strong className="text-slate-700">{startRecord}</strong>
              {" - "}
              <strong className="text-slate-700">{endRecord}</strong>
              {" de "}
              <strong className="text-slate-700">{totalRecords}</strong>
              {" registros"}
            </span>
          </div>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#003b5c] hover:text-[#003b5c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                    currentPage === page
                      ? "border-[#003b5c] bg-[#003b5c] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#003b5c] hover:text-[#003b5c]"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#003b5c] hover:text-[#003b5c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}