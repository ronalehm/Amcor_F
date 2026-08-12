import { useMemo } from "react";
import * as XLSX from "xlsx";
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
    // Preparar Excel
    const data = values.map((v) => ({
      "Código Valor": v.item || "",
      "Valor": v.name,
      "Descripción": v.description || "",
      "Estado": v.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, catalogData.catalog.name);

    // Aplicar estilos profesionales
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    const headerColor = "#1F4E78";
    const headerFont = "FFFFFF";
    const evenRowColor = "#F2F2F2";
    const borderColor = "#000000";
    const dataBorderColor = "#CCCCCC";

    // Estilos para encabezados
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (ws[address]) {
        ws[address].s = {
          fill: { fgColor: { rgb: headerColor } },
          font: { bold: true, color: { rgb: headerFont }, size: 11 },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: borderColor } },
            bottom: { style: "thin", color: { rgb: borderColor } },
            left: { style: "thin", color: { rgb: borderColor } },
            right: { style: "thin", color: { rgb: borderColor } },
          },
        };
      }
    }

    // Estilos para datos (zebra striping)
    for (let R = 2; R <= range.e.r + 1; ++R) {
      const isEvenRow = (R - 2) % 2 === 0;
      const rowColor = isEvenRow ? evenRowColor : "FFFFFF";

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + R;
        if (ws[address]) {
          ws[address].s = {
            fill: { fgColor: { rgb: rowColor } },
            font: { size: 10 },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: dataBorderColor } },
              bottom: { style: "thin", color: { rgb: dataBorderColor } },
              left: { style: "thin", color: { rgb: dataBorderColor } },
              right: { style: "thin", color: { rgb: dataBorderColor } },
            },
          };
        }
      }
    }

    // Auto-ajustar ancho de columnas
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const address = XLSX.utils.encode_col(C) + (R + 1);
        if (ws[address] && ws[address].v) {
          maxLength = Math.max(maxLength, String(ws[address].v).length);
        }
      }
      colWidths.push({ wch: Math.min(maxLength + 2, 50) });
    }
    ws["!cols"] = colWidths;

    // Congelación y filtros
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    ws["!autofilter"] = { ref: ws["!ref"] };

    XLSX.writeFile(wb, `${catalogData.catCode}_${catalogData.catalog.code}.xlsx`);
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
              Descargar Excel
            </Button>
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
