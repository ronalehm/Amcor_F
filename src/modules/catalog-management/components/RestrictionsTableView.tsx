import type { EnrichedRestriction } from "../utils/restrictionAdapters";
import {
  getTypeLabel,
  getProductTypeLabel,
  getTypeColor,
  getStatusColor,
} from "../utils/restrictionAdapters";

interface RestrictionsTableProps {
  restrictions: EnrichedRestriction[];
  onRowClick: (restriction: EnrichedRestriction) => void;
}

export default function RestrictionsTable({
  restrictions,
  onRowClick,
}: RestrictionsTableProps) {
  if (restrictions.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">
          No se encontraron restricciones con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Tipo
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Envoltura
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Restricción
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {restrictions.map((restriction) => {
              const typeColor = getTypeColor(restriction.type);
              const statusColor = getStatusColor(restriction.status);

              const typeBgColor =
                typeColor === "blue" ? "bg-blue-100" : "bg-amber-100";
              const typeTextColor =
                typeColor === "blue" ? "text-blue-700" : "text-amber-700";

              const statusBgColor =
                statusColor === "green"
                  ? "bg-green-100"
                  : statusColor === "red"
                  ? "bg-red-100"
                  : "bg-gray-100";
              const statusTextColor =
                statusColor === "green"
                  ? "text-green-700"
                  : statusColor === "red"
                  ? "text-red-700"
                  : "text-gray-700";

              return (
                <tr
                  key={restriction.id}
                  onClick={() => onRowClick(restriction)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-medium ${typeBgColor} ${typeTextColor}`}
                    >
                      {getTypeLabel(restriction.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">
                      {getProductTypeLabel(restriction.productType)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {restriction.name}
                    </div>
                    {restriction.description && (
                      <div className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {restriction.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusBgColor} ${statusTextColor}`}
                    >
                      {restriction.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
