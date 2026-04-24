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
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
  Users,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import {
  getAllUsers,
  type User,
  ROLE_LABELS,
  ROLE_COLORS,
} from "../../../shared/data/userStorage";

import ActionButton from "../../../shared/components/buttons/ActionButton";

type UserStatus = "active" | "inactive";
type UserTab = "all" | UserStatus;

type SortDirection = "asc" | "desc";

type SortKey =
  | "code"
  | "fullName"
  | "email"
  | "role"
  | "area"
  | "status"
  | "lastLoginAt"
  | "createdAt";

const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

const USER_STATUS_STYLES: Record<UserStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-rose-200 bg-rose-50 text-rose-700",
};

const getText = (...values: any[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== "",
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

const getUserFullName = (user: User) => {
  return (
    getText(
      user.fullName,
      `${getText(user.firstName)} ${getText(user.lastName)}`.trim(),
    ) || "—"
  );
};

const getUserExtraField = (user: User, ...keys: string[]) => {
  const userRecord = user as any;

  return getText(...keys.map((key) => userRecord[key]));
};

const getNormalizedUserStatus = (user: User): UserStatus => {
  return user.status === "active" ? "active" : "inactive";
};

const getLastLoginLabel = (user: User) => {
  return user.lastLoginAt ? formatDate(user.lastLoginAt) : "Nunca";
};

const getSortValue = (user: User, key: SortKey): string | number => {
  switch (key) {
    case "code":
      return getText(user.code).toLowerCase();

    case "fullName":
      return getUserFullName(user).toLowerCase();

    case "email":
      return getText(user.email).toLowerCase();

    case "role":
      return getText(ROLE_LABELS[user.role], user.role).toLowerCase();

    case "area":
      return getText(user.area).toLowerCase();

    case "status":
      return USER_STATUS_LABELS[getNormalizedUserStatus(user)].toLowerCase();

    case "lastLoginAt": {
      const time = user.lastLoginAt ? new Date(user.lastLoginAt).getTime() : 0;
      return Number.isNaN(time) ? 0 : time;
    }

    case "createdAt": {
      const createdAt = getUserExtraField(
        user,
        "createdAt",
        "createdDate",
        "fechaCreacion",
        "fecha_creacion",
      );

      const time = createdAt ? new Date(createdAt).getTime() : 0;

      return Number.isNaN(time) ? 0 : time;
    }

    default:
      return "";
  }
};

export default function UserListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UserTab>("all");

  const [roleFilter, setRoleFilter] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("");

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
      title: "Gestión de Usuarios",
      breadcrumbs: [{ label: "Usuarios" }, { label: "Lista de Usuarios" }],
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const users = useMemo(() => getAllUsers(), []);

  const activeUsers = useMemo(
    () => users.filter((user) => getNormalizedUserStatus(user) === "active"),
    [users],
  );

  const inactiveUsers = useMemo(
    () => users.filter((user) => getNormalizedUserStatus(user) === "inactive"),
    [users],
  );

  const roleOptions = useMemo(
    () =>
      Object.entries(ROLE_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

  const areaOptions = useMemo(() => {
    const areas = new Set(users.map((user) => getText(user.area)).filter(Boolean));

    return Array.from(areas).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const normalizedStatus = getNormalizedUserStatus(user);
      const roleLabel = getText(ROLE_LABELS[user.role], user.role);
      const statusLabel = USER_STATUS_LABELS[normalizedStatus];

      const createdAt = getUserExtraField(
        user,
        "createdAt",
        "createdDate",
        "fechaCreacion",
        "fecha_creacion",
      );

      const searchableText = [
        user.code,
        user.email,
        user.firstName,
        user.lastName,
        user.fullName,
        user.phone,
        user.area,
        roleLabel,
        statusLabel,
        createdAt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);
      const matchesTab = activeTab === "all" || normalizedStatus === activeTab;
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesArea = !areaFilter || user.area === areaFilter;

      return matchesSearch && matchesTab && matchesRole && matchesArea;
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
  }, [users, query, activeTab, roleFilter, areaFilter, sortConfig]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeTab, roleFilter, areaFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setQuery("");
    setActiveTab("all");
    setRoleFilter("");
    setAreaFilter("");
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
        direction: key === "createdAt" || key === "lastLoginAt" ? "desc" : "asc",
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
      key: "all" as UserTab,
      label: "Todos los usuarios",
      count: users.length,
    },
    {
      key: "active" as UserTab,
      label: "Activos",
      count: activeUsers.length,
    },
    {
      key: "inactive" as UserTab,
      label: "Inactivos",
      count: inactiveUsers.length,
    },
  ];

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total usuarios
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {users.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Registrados en el sistema
              </p>
            </div>

            <div className="rounded-xl bg-[#e8f4f8] p-3 text-[#003b5c]">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Usuarios activos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {activeUsers.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Con acceso habilitado
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
                Usuarios inactivos
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {inactiveUsers.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Acceso deshabilitado
              </p>
            </div>

            <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
              <UserX size={22} />
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
            Mostrando {filteredUsers.length} de {users.length} registros
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 xl:grid-cols-[2.4fr_0.9fr_0.9fr_auto]">
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
                placeholder="Buscar por nombre, email, código, rol o área..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Rol
            </label>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-[#003b5c] focus:outline-none focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos los roles</option>

              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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

              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <ActionButton
              label="Limpiar Filtros"
              onClick={clearFilters}
              variant="outline"
              icon={<RotateCcw size={16} />}
            />

            <ActionButton
              label="Crear Usuario"
              onClick={() => navigate("/users/new")}
              variant="primary"
              icon={<Plus size={16} />}
            />
          </div>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#003b5c] text-white">
                <SortableHeader label="Código" sortKey="code" />
                <SortableHeader label="Usuario" sortKey="fullName" />
                <SortableHeader label="Email" sortKey="email" />
                <SortableHeader label="Rol" sortKey="role" />
                <SortableHeader label="Área" sortKey="area" />
                <SortableHeader label="Estado" sortKey="status" />
                <SortableHeader label="Último acceso" sortKey="lastLoginAt" />

                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user, index) => {
                const normalizedStatus = getNormalizedUserStatus(user);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-[#e8f4f8] ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-extrabold text-[#003b5c]">
                      {user.code || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="font-bold text-slate-800">
                        {getUserFullName(user)}
                      </div>

                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Mail size={12} />
                        {user.phone || "Sin teléfono"}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {user.email || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                          ROLE_COLORS[user.role] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <ShieldCheck size={12} className="mr-1" />
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {user.area || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${USER_STATUS_STYLES[normalizedStatus]}`}
                      >
                        {USER_STATUS_LABELS[normalizedStatus]}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {getLastLoginLabel(user)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          label="Ver"
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/users/${user.id}`)}
                        />

                        <ActionButton
                          label="Editar"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-3">
                        <UserCog size={26} className="text-slate-400" />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        No se encontraron usuarios
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