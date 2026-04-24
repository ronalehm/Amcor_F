import { useEffect, useMemo, useState } from "react"
import { Search, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../../components/layout/LayoutContext"

interface MockUser {
  id: number
  nombre: string
  email: string
  rol: string
  estado: "Activo" | "Inactivo"
}

const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@amcor.com",
    rol: "Project Manager",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Maria Garcia",
    email: "maria.garcia@amcor.com",
    rol: "Coordinadora",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    email: "carlos.ruiz@amcor.com",
    rol: "Ingeniero Técnico",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Ana Diaz",
    email: "ana.diaz@amcor.com",
    rol: "Analista Comercial",
    estado: "Activo",
  },
]

type UserCode = `US-${string}`

const USER_CODES: Record<number, UserCode> = {
  1: "US-000001",
  2: "US-000002",
  3: "US-000003",
  4: "US-000004",
}

export default function UsersPage() {
  const { setHeader, resetHeader } = useLayout()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return MOCK_USERS

    return MOCK_USERS.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q) ||
        USER_CODES[u.id].toLowerCase().includes(q),
    )
  }, [search])

  const stats = useMemo(
    () => ({
      total: MOCK_USERS.length,
      activos: MOCK_USERS.filter((u) => u.estado === "Activo").length,
      inactivos: MOCK_USERS.filter((u) => u.estado === "Inactivo").length,
    }),
    [],
  )

  useEffect(() => {
    setHeader({
      title: "Usuarios",
      subtitle:
        "Usuarios sincronizados desde Sistema Integral. El Portal Web solo permite consultar y administrar roles/permisos.",
    })

    return () => resetHeader()
  }, [setHeader, resetHeader])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Total Usuarios
          </p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            {stats.total}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Sincronizados desde Sistema Integral
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
            Activos
          </p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            {stats.activos}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Pueden operar en el Portal
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Inactivos
          </p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            {stats.inactivos}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            No pueden recibir nuevas asignaciones
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="relative max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por usuario, correo, rol o código..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-[#003b5c]">
              <tr className="text-left text-white">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                  Código
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                  Usuario
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                  Rol
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u, index) => (
                <tr
                  key={u.id}
                  className={`border-b border-gray-100 transition-colors hover:bg-[#e8f4f8] ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#003b5c]">
                    {USER_CODES[u.id]}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <User size={14} className="text-gray-600" />
                      </div>

                      <span className="font-medium text-gray-900">
                        {u.nombre}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{u.email}</td>

                  <td className="px-4 py-3 text-gray-700">{u.rol}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                        u.estado === "Activo"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.estado}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/users/${USER_CODES[u.id]}`)}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-[#003b5c]"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/users/${USER_CODES[u.id]}/edit`)
                        }
                        className="rounded-md border border-[#003b5c] bg-[#003b5c]/5 px-3 py-1.5 text-xs font-bold text-[#003b5c] shadow-sm transition-colors hover:bg-[#003b5c] hover:text-white"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-gray-600">
              No se encontraron usuarios.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Intenta cambiar el criterio de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}