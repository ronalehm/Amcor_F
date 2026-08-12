import { useState, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { X, Download, Upload, AlertCircle, Search } from "lucide-react";
import * as XLSX from "xlsx";
import {
  getDimensionRestrictions,
  updateDimensionRestriction,
} from "../../../shared/data/restrictionCatalogsStorage";
import type { DimensionRestrictionCatalog } from "../../../shared/data/restrictionCatalogs";

interface RestrictionsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function RestrictionsEditModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: RestrictionsEditModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestrictionId, setSelectedRestrictionId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<any | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const restrictions = useMemo(() => getDimensionRestrictions() || [], []);

  const filteredRestrictions = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return restrictions.filter(
      (r) =>
        r.code.toLowerCase().includes(search) ||
        r.name.toLowerCase().includes(search) ||
        r.productType.toLowerCase().includes(search)
    );
  }, [searchQuery, restrictions]);

  const selectedRestriction = useMemo(() => {
    if (!selectedRestrictionId) return null;
    return restrictions.find((r) => r.id === selectedRestrictionId);
  }, [selectedRestrictionId, restrictions]);

  const handleDownloadTemplate = () => {
    if (!selectedRestriction) return;

    const data = {
      ID: selectedRestriction.id,
      Código: selectedRestriction.code,
      Nombre: selectedRestriction.name,
      "Tipo de Producto": selectedRestriction.productType,
      "Plan de Formato": selectedRestriction.formatPlan,
      "Ancho Mín": selectedRestriction.ancho?.min || 0,
      "Ancho Máx": selectedRestriction.ancho?.max || 0,
      "Largo Mín": selectedRestriction.largo?.min || 0,
      "Largo Máx": selectedRestriction.largo?.max || 0,
      "Fuelle Mín": selectedRestriction.anchoFuelle?.min || 0,
      "Fuelle Máx": selectedRestriction.anchoFuelle?.max || 0,
      "Perímetro Mín": selectedRestriction.perimetro?.min || 0,
      "Perímetro Máx": selectedRestriction.perimetro?.max || 0,
      "Repetición Mín": selectedRestriction.repeticion?.min || 0,
      "Repetición Máx": selectedRestriction.repeticion?.max || 0,
      "Área Diseño Ancho Mín": selectedRestriction.designAreaWidth?.min || 0,
      "Área Diseño Ancho Máx": selectedRestriction.designAreaWidth?.max || 0,
      "Área Diseño Alto Mín": selectedRestriction.designAreaHeight?.min || 0,
      "Área Diseño Alto Máx": selectedRestriction.designAreaHeight?.max || 0,
    };

    const ws = XLSX.utils.json_to_sheet([data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Restricción");

    // Aplicar estilos
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    const headerColor = "#1F4E78";
    const headerFont = "FFFFFF";

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (ws[address]) {
        ws[address].s = {
          fill: { fgColor: { rgb: headerColor } },
          font: { bold: true, color: { rgb: headerFont }, size: 11 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }

    // Ancho de columnas
    ws["!cols"] = Array.from({ length: range.e.c + 1 }, () => ({ wch: 20 }));

    XLSX.writeFile(
      wb,
      `Restriccion_${selectedRestriction.code}_${new Date().getTime()}.xlsx`
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedRestriction) {
      setValidationError("Por favor selecciona una restricción primero");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setValidationError("El archivo debe ser Excel (.xlsx o .xls)");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        setValidationError("El archivo Excel está vacío");
        setIsValidating(false);
        return;
      }

      // Validar estructura básica
      const row = data[0] as any;
      if (!row.ID || !row.Código) {
        setValidationError("El archivo no tiene la estructura correcta");
        setIsValidating(false);
        return;
      }

      setUploadedData(row);
      setShowConfirmation(true);
    } catch (error) {
      setValidationError(
        `Error al procesar el archivo: ${error instanceof Error ? error.message : "Desconocido"}`
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmUpload = () => {
    if (!uploadedData || !selectedRestriction) return;

    try {
      // Actualizar la restricción con los nuevos valores
      const updated = updateDimensionRestriction(selectedRestriction.id, {
        ancho: {
          min: parseFloat(uploadedData["Ancho Mín"]) || 0,
          max: parseFloat(uploadedData["Ancho Máx"]) || 0,
        },
        largo: {
          min: parseFloat(uploadedData["Largo Mín"]) || 0,
          max: parseFloat(uploadedData["Largo Máx"]) || 0,
        },
        anchoFuelle: {
          min: parseFloat(uploadedData["Fuelle Mín"]) || 0,
          max: parseFloat(uploadedData["Fuelle Máx"]) || 0,
        },
        perimetro: {
          min: parseFloat(uploadedData["Perímetro Mín"]) || 0,
          max: parseFloat(uploadedData["Perímetro Máx"]) || 0,
        },
        repeticion: {
          min: parseFloat(uploadedData["Repetición Mín"]) || 0,
          max: parseFloat(uploadedData["Repetición Máx"]) || 0,
        },
        designAreaWidth: {
          min: parseFloat(uploadedData["Área Diseño Ancho Mín"]) || 0,
          max: parseFloat(uploadedData["Área Diseño Ancho Máx"]) || 0,
        },
        designAreaHeight: {
          min: parseFloat(uploadedData["Área Diseño Alto Mín"]) || 0,
          max: parseFloat(uploadedData["Área Diseño Alto Máx"]) || 0,
        },
      });

      if (updated) {
        setShowConfirmation(false);
        setUploadedData(null);
        setValidationError(null);
        onUploadSuccess?.();
        onClose();
      }
    } catch (error) {
      setValidationError(
        `Error al actualizar: ${error instanceof Error ? error.message : "Desconocido"}`
      );
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900">Editar Restricción</h2>
          <button
            onClick={onClose}
            className="rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* BÚSQUEDA Y SELECCIÓN */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Seleccionar Restricción
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar por código, nombre o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            {/* DROPDOWN */}
            {searchQuery && filteredRestrictions.length > 0 && (
              <div className="absolute top-full left-6 right-6 mt-1 z-10 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                {filteredRestrictions.map((restriction) => (
                  <button
                    key={restriction.id}
                    onClick={() => {
                      setSelectedRestrictionId(restriction.id);
                      setSearchQuery("");
                      setValidationError(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <div className="font-medium">{restriction.name}</div>
                    <div className="text-xs text-slate-500">
                      {restriction.code} • {restriction.productType}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RESTRICCIÓN SELECCIONADA */}
          {selectedRestriction && (
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {selectedRestriction.name}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div>
                  <span className="font-medium">Código:</span> {selectedRestriction.code}
                </div>
                <div>
                  <span className="font-medium">Tipo:</span>{" "}
                  {selectedRestriction.productType}
                </div>
                <div>
                  <span className="font-medium">Plan:</span>{" "}
                  {selectedRestriction.formatPlan}
                </div>
                <div>
                  <span className="font-medium">Estado:</span>{" "}
                  {selectedRestriction.status}
                </div>
              </div>
            </div>
          )}

          {/* DESCARGAR TEMPLATE */}
          {selectedRestriction && !showConfirmation && (
            <div className="mb-6">
              <button
                onClick={handleDownloadTemplate}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
              >
                <Download size={16} />
                Descargar Plantilla Excel
              </button>
              <p className="mt-2 text-xs text-slate-500">
                Descarga el Excel con los valores actuales, edita los mínimos y máximos,
                y cárgalo nuevamente.
              </p>
            </div>
          )}

          {/* UPLOAD AREA */}
          {selectedRestriction && !showConfirmation && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
                isDragging
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-slate-300"
              }`}
            >
              <Upload
                size={32}
                className={`mx-auto mb-3 ${
                  isDragging ? "text-brand-primary" : "text-slate-400"
                }`}
              />
              <p className="text-sm font-medium text-slate-700 mb-1">
                Arrastra el Excel aquí o{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-brand-primary hover:underline"
                >
                  selecciona un archivo
                </button>
              </p>
              <p className="text-xs text-slate-500">
                Solo archivos .xlsx o .xls con los datos editados
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* VALIDATING STATE */}
          {isValidating && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-600">
                Validando archivo... ⏳
              </p>
            </div>
          )}

          {/* ERROR */}
          {validationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{validationError}</p>
              </div>
            </div>
          )}

          {/* CONFIRMACIÓN */}
          {showConfirmation && uploadedData && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Datos a Actualizar
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ancho:</span>
                    <span className="font-mono text-slate-900">
                      {uploadedData["Ancho Mín"]} - {uploadedData["Ancho Máx"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Largo:</span>
                    <span className="font-mono text-slate-900">
                      {uploadedData["Largo Mín"]} - {uploadedData["Largo Máx"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Fuelle:</span>
                    <span className="font-mono text-slate-900">
                      {uploadedData["Fuelle Mín"]} - {uploadedData["Fuelle Máx"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Perímetro:</span>
                    <span className="font-mono text-slate-900">
                      {uploadedData["Perímetro Mín"]} -{" "}
                      {uploadedData["Perímetro Máx"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Repetición:</span>
                    <span className="font-mono text-slate-900">
                      {uploadedData["Repetición Mín"]} -{" "}
                      {uploadedData["Repetición Máx"]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end bg-slate-50">
          {!showConfirmation ? (
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setUploadedData(null);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmUpload}
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
              >
                Confirmar Cambios
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
