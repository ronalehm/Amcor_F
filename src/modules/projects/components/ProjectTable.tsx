import type { NormalizedProject } from "../../../shared/types"
import type { ReactNode } from "react"

interface ProjectTableProps {
  rows: NormalizedProject[]
  onRowClick: (row: NormalizedProject) => void
  renderActions?: (row: NormalizedProject) => ReactNode
}

const ProjectTable = ({ rows, onRowClick, renderActions }: ProjectTableProps) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <p className="text-sm font-semibold text-gray-900">
        Resultados <span className="text-gray-500 font-medium">({rows.length})</span>
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Proyecto</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Ejecutivo Comercial</th>
            <th className="px-4 py-3 font-medium">Actualizado</th>
            {renderActions && <th className="px-4 py-3 font-medium">Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(r)}
            >
              <td className="px-4 py-3 text-gray-700">{r.code}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{r.name}</p>
                {r.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">{r.client}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-700 bg-white">
                  {r.statusLabel}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{r.owner}</td>
              <td className="px-4 py-3 text-gray-500">{r.updatedAt}</td>
              {renderActions && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  {renderActions(r)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {rows.length === 0 && (
      <div className="p-10 text-center">
        <p className="text-sm font-semibold text-gray-900">No hay resultados</p>
        <p className="text-sm text-gray-500 mt-1">Ajusta filtros o realiza otra b\u00fasqueda.</p>
      </div>
    )}
  </div>
)

export default ProjectTable
