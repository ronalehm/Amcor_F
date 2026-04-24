import { Search } from "lucide-react"
import type { ProjectStatus } from "../../../shared/types"

const STATUS_OPTIONS: { value: ProjectStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "CREADO", label: "Creado" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "VALIDACION_TECNICA", label: "Validación técnica" },
  { value: "APROBADO", label: "Aprobado" },
]

interface ClientOption {
  value: string
  label: string
}

interface ProjectToolbarProps {
  search: string
  setSearch: (v: string) => void
  status: string
  setStatus: (v: string) => void
  client: string
  setClient: (v: string) => void
  clientOptions: ClientOption[]
}

const ProjectToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  client,
  setClient,
  clientOptions,
}: ProjectToolbarProps) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o código\u2026"
          className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {clientOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)

export default ProjectToolbar
