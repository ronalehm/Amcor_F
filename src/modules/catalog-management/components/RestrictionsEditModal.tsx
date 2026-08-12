import { useState, useMemo, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Download, Upload, AlertCircle, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { RestrictionUploadConfirmationModal } from "./RestrictionUploadConfirmationModal";
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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
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
    ).slice(0, 10);
  }, [searchQuery, restrictions]);

  useEffect(() => {
    if (inputRef.current && searchQuery && filteredRestrictions.length > 0) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [searchQuery, filteredRestrictions]);

  const selectedRestriction = useMemo(() => {
    if (!selectedRestrictionId) return null;
    return restrictions.find((r) => r.id === selectedRestrictionId);
  }, [selectedRestrictionId, restrictions]);

  const getRestrictionCode = (restriction: DimensionRestrictionCatalog) => {
    return `RES-${restriction.code.substring(0, 3).toUpperCase()}`;
  };

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

      const row = data[0] as any;
      if (!row.ID || !row.Código) {
        setValidationError("El archivo no tiene la estructura correcta (falta ID o Código)");
        setIsValidating(false);
        return;
      }

      const numericFields = [
        "Ancho Mín", "Ancho Máx", "Largo Mín", "Largo Máx",
        "Fuelle Mín", "Fuelle Máx", "Perímetro Mín", "Perímetro Máx"
      ];

      for (const field of numericFields) {
        if (row[field] !== undefined && isNaN(parseFloat(row[field]))) {
          setValidationError(`El campo "${field}" debe ser un número`);
          setIsValidating(false);
          return;
        }
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

  const handleShowConfirmationModal = () => {
    setShowConfirmation(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmUpload = (reason: string) => {
    if (!uploadedData || !selectedRestriction) return;

    try {
      // Crear objeto de cambios con el motivo registrado
      const changes = {
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
      };

      const updated = updateDimensionRestriction(selectedRestriction.id, changes, reason);

      if (updated) {
        setShowConfirmationModal(false);
        setShowConfirmation(false);
        setUploadedData(null);
        setValidationError(null);
        setSelectedRestrictionId(null);
        setSearchQuery("");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full h-fit overflow-y-auto flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Editar Restricción</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col overflow-visible">
          {/* BÚSQUEDA - No Scroll */}
          <div className="p-6 z-50 relative">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Seleccionar Restricción
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Busca por código, nombre o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />

              {/* Dropdown Results - Portal */}
              {searchQuery && filteredRestrictions.length > 0 &&
                ReactDOM.createPortal(
                  <div
                    className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-[9999] max-h-[300px] overflow-y-auto"
                    style={{
                      top: `${dropdownPosition.top + 8}px`,
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`,
                    }}
                  >
                    {filteredRestrictions.map((restriction) => {
                      const resCode = getRestrictionCode(restriction);
                      const isSelected = selectedRestrictionId === restriction.id;
                      return (
                        <button
                          key={restriction.id}
                          onClick={() => {
                            setSelectedRestrictionId(restriction.id);
                            setSearchQuery("");
                          }}
                          className={`w-full px-4 py-3 text-left border-b border-slate-100 transition-colors last:border-0 ${
                            isSelected
                              ? "bg-brand-secondary-soft text-brand-primary"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono font-semibold text-sm">
                                {resCode}
                              </p>
                              <p className="text-sm font-medium text-slate-900">
                                {restriction.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {restriction.productType} • {restriction.formatPlan}
                              </p>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {restriction.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>,
                  document.body
                )
              }
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-0 pb-6 space-y-6">
            {/* Restricción Seleccionada */}
            {selectedRestriction && (
              <div className="bg-brand-secondary-soft rounded-lg p-4 border border-brand-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">
                      Restricción Seleccionada
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {getRestrictionCode(selectedRestriction)} - {selectedRestriction.name}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedRestriction.productType} • {selectedRestriction.formatPlan}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Estado:{" "}
                      <span className="font-semibold text-slate-900">
                        {selectedRestriction.status}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-primary text-white px-4 py-2 text-sm font-medium hover:bg-brand-primary/90 transition-colors whitespace-nowrap"
                  >
                    <Download size={16} />
                    Descargar
                  </button>
                </div>
              </div>
            )}

            {/* Info Text */}
            {selectedRestriction && !showConfirmation && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  Descarga la plantilla Excel, edita los valores mínimos y máximos de los campos (Ancho, Largo, Fuelle, Perímetro, Repetición, Área de Diseño), y cárgala nuevamente.
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
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error de validación</p>
                  <p className="text-sm text-red-700 mt-1">{validationError}</p>
                </div>
              </div>
            )}

            {/* PREVIEW DE CAMBIOS */}
            {showConfirmation && uploadedData && (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="text-sm font-bold text-blue-900 mb-3">
                    Vista Previa de Cambios
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {uploadedData["Ancho Mín"] && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-slate-600">Ancho:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {uploadedData["Ancho Mín"]} - {uploadedData["Ancho Máx"]}
                        </span>
                      </div>
                    )}
                    {uploadedData["Largo Mín"] && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-slate-600">Largo:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {uploadedData["Largo Mín"]} - {uploadedData["Largo Máx"]}
                        </span>
                      </div>
                    )}
                    {uploadedData["Fuelle Mín"] && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-slate-600">Fuelle:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {uploadedData["Fuelle Mín"]} - {uploadedData["Fuelle Máx"]}
                        </span>
                      </div>
                    )}
                    {uploadedData["Perímetro Mín"] && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-slate-600">Perímetro:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {uploadedData["Perímetro Mín"]} - {uploadedData["Perímetro Máx"]}
                        </span>
                      </div>
                    )}
                    {uploadedData["Repetición Mín"] && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-slate-600">Repetición:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {uploadedData["Repetición Mín"]} - {uploadedData["Repetición Máx"]}
                        </span>
                      </div>
                    )}
                    {uploadedData["Área Diseño Ancho Mín"] && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-slate-600">Área Diseño:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {uploadedData["Área Diseño Ancho Mín"]}-{uploadedData["Área Diseño Ancho Máx"]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">
                      Requiere justificación
                    </p>
                    <p className="text-xs text-yellow-800 mt-1">
                      Debes proporcionar un motivo o comentario para todos los cambios en restricciones.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                onClick={handleShowConfirmationModal}
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
              >
                Continuar a Confirmación
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedRestriction && (
        <RestrictionUploadConfirmationModal
          isOpen={showConfirmationModal}
          restrictionName={selectedRestriction.name}
          restrictionCode={selectedRestriction.code}
          changes={{
            ancho: uploadedData ? {
              min: parseFloat(uploadedData["Ancho Mín"]) || 0,
              max: parseFloat(uploadedData["Ancho Máx"]) || 0,
            } : undefined,
            largo: uploadedData ? {
              min: parseFloat(uploadedData["Largo Mín"]) || 0,
              max: parseFloat(uploadedData["Largo Máx"]) || 0,
            } : undefined,
            anchoFuelle: uploadedData ? {
              min: parseFloat(uploadedData["Fuelle Mín"]) || 0,
              max: parseFloat(uploadedData["Fuelle Máx"]) || 0,
            } : undefined,
            perimetro: uploadedData ? {
              min: parseFloat(uploadedData["Perímetro Mín"]) || 0,
              max: parseFloat(uploadedData["Perímetro Máx"]) || 0,
            } : undefined,
            repeticion: uploadedData ? {
              min: parseFloat(uploadedData["Repetición Mín"]) || 0,
              max: parseFloat(uploadedData["Repetición Máx"]) || 0,
            } : undefined,
            designAreaWidth: uploadedData ? {
              min: parseFloat(uploadedData["Área Diseño Ancho Mín"]) || 0,
              max: parseFloat(uploadedData["Área Diseño Ancho Máx"]) || 0,
            } : undefined,
            designAreaHeight: uploadedData ? {
              min: parseFloat(uploadedData["Área Diseño Alto Mín"]) || 0,
              max: parseFloat(uploadedData["Área Diseño Alto Máx"]) || 0,
            } : undefined,
          }}
          onConfirmed={handleConfirmUpload}
          onCancelled={() => setShowConfirmationModal(false)}
        />
      )}
    </div>,
    document.body
  );
}
