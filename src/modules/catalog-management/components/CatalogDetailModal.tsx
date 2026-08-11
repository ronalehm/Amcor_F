import { useMemo } from "react";
import { X, Download } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import { getCatalogValues } from "../../../shared/catalogs/catalog.service";
import type { CatalogDefinition, CatalogValue } from "../../../shared/catalogs/catalog.types";

interface CatalogRowData {
  catCode: string;
  catalog: CatalogDefinition;
  totalCount: number;
  activosCount: number;
  inactivosCount: number;
  bloqueadosCount: number;
  isEditable: boolean;
}

interface CatalogDetailModalProps {
  catalogData: CatalogRowData;
  onClose: () => void;
}

export function CatalogDetailModal({ catalogData, onClose }: CatalogDetailModalProps) {
  const values = useMemo(() => {
    return getCatalogValues(catalogData.catalog.code) || [];
  }, [catalogData.catalog.code]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800";
      case "Inactivo":
        return "bg-orange-100 text-orange-800";
      case "Bloqueado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return "success";
      case "Inactivo":
        return "warning";
      case "Bloqueado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleDownloadValues = () => {
    // Preparar CSV
    const headers = ["Código Valor", "Valor", "Descripción", "Estado"];
    const rows = values.map((v) => [
      v.item || "",
      v.name,
      v.description || "",
      v.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${cell?.toString().replace(/"/g, '""') || ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${catalogData.catCode}_${catalogData.catalog.code}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono font-semibold text-blue-600">
                {catalogData.catCode}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  catalogData.isEditable
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {catalogData.isEditable ? "ODISEO" : "SI"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {catalogData.catalog.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {catalogData.catalog.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {catalogData.totalCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">
              {catalogData.activosCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Inactivos</p>
            <p className="text-2xl font-bold text-orange-600">
              {catalogData.inactivosCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Bloqueados</p>
            <p className="text-2xl font-bold text-red-600">
              {catalogData.bloqueadosCount}
            </p>
          </div>
        </div>

        {/* Content - Values Table */}
        <div className="flex-1 overflow-y-auto">
          {values.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No hay valores definidos para este catálogo</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Código Valor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {values.map((value, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-600">
                      {value.item || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {value.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {value.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(value.status)}`}>
                        {value.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Mostrando {values.length} valor{values.length !== 1 ? "es" : ""}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadValues}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar CSV
            </Button>
            <Button onClick={onClose} variant="default">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
