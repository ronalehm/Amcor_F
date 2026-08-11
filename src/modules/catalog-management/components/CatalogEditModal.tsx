import { useState, useMemo, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Search, Download, Upload, AlertCircle } from "lucide-react";
import { CATALOG_REGISTRY } from "../../../shared/catalogs/catalog.registry";
import { getCatalogValues } from "../../../shared/catalogs/catalog.service";
import { CatalogTemplateGenerator } from "../services/catalogTemplateGenerator";
import { validateCatalogTemplate } from "../services/catalogTemplateValidator";
import { CatalogUploadConfirmationModal } from "./CatalogUploadConfirmationModal";
import { CatalogUploadResultModal } from "./CatalogUploadResultModal";
import type { UploadResult } from "../services/catalogTemplateUploadService";

interface CatalogEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function CatalogEditModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: CatalogEditModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatalogCode, setSelectedCatalogCode] = useState<string | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [uploadedData, setUploadedData] = useState<any[] | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCatalogs = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return CATALOG_REGISTRY.filter((cat) => {
      const catCode = `CAT-${String(CATALOG_REGISTRY.indexOf(cat) + 1).padStart(
        3,
        "0"
      )}`;
      return (
        catCode.toLowerCase().includes(search) ||
        cat.name.toLowerCase().includes(search) ||
        cat.code.toLowerCase().includes(search) ||
        (cat.description && cat.description.toLowerCase().includes(search))
      );
    }).slice(0, 10); // Limitar a 10 resultados
  }, [searchQuery]);

  // Actualizar posición del dropdown cuando el input se mueve
  useEffect(() => {
    if (inputRef.current && searchQuery && filteredCatalogs.length > 0) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [searchQuery, filteredCatalogs]);

  const selectedCatalog = useMemo(() => {
    if (!selectedCatalogCode) return null;
    return CATALOG_REGISTRY.find((cat) => cat.code === selectedCatalogCode);
  }, [selectedCatalogCode]);

  const getCatCode = (catalog: any) => {
    const index = CATALOG_REGISTRY.findIndex((c) => c.code === catalog.code);
    return `CAT-${String(index + 1).padStart(3, "0")}`;
  };

  const handleDownloadTemplate = () => {
    if (!selectedCatalog) return;

    // Crear plantilla solo para el catálogo seleccionado
    const generator = new CatalogTemplateGenerator();
    const blob = generator.generateSingleCatalogTemplate(selectedCatalog.code);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getCatCode(selectedCatalog)}_${selectedCatalog.code}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    if (!selectedCatalog) {
      setValidationError("Por favor selecciona un catálogo primero");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setValidationError("El archivo debe ser Excel (.xlsx o .xls)");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const result = await validateCatalogTemplate(file, selectedCatalog.code);

      if (result.isValid) {
        // Leer el archivo desde la hoja "valores" (la única que se procesa)
        const buffer = await file.arrayBuffer();
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
        const valoresSheet = workbook.Sheets["valores"];
        const data = XLSX.utils.sheet_to_json(valoresSheet);

        setUploadedData(data as any[]);
        setValidationResult(result);
        setShowConfirmation(true);
      } else {
        const errorMessages = result.errors
          .map((e) => e.message)
          .join(", ");
        setValidationError(`Errores de validación: ${errorMessages}`);
      }
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Error al validar archivo"
      );
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full h-fit overflow-y-auto flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Editar Catálogo</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-visible">
            {/* Search and Select Catalog - No Scroll */}
            <div className="p-6 z-50 relative">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Seleccionar Catálogo
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Busca por código, nombre o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />

                {/* Dropdown Results - Renderizado con Portal */}
                {searchQuery && filteredCatalogs.length > 0 &&
                  ReactDOM.createPortal(
                    <div
                      className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-[9999] max-h-[300px] overflow-y-auto"
                      style={{
                        top: `${dropdownPosition.top + 8}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                      }}
                    >
                    {filteredCatalogs.map((catalog) => {
                      const catCode = getCatCode(catalog);
                      const isSelected = selectedCatalogCode === catalog.code;
                      return (
                        <button
                          key={catalog.code}
                          onClick={() => {
                            setSelectedCatalogCode(catalog.code);
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
                                {catCode}
                              </p>
                              <p className="text-sm font-medium text-slate-900">
                                {catalog.name}
                              </p>
                              {catalog.description && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {catalog.description}
                                </p>
                              )}
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                catalog.ownerSystem === "ODISEO"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {catalog.ownerSystem === "ODISEO" ? "ODISEO" : "SI"}
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
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-0 pb-6 space-y-6">
            {/* Selected Catalog Info */}
            {selectedCatalog && (
              <div className="bg-brand-secondary-soft rounded-lg p-4 border border-brand-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">
                      Catálogo Seleccionado
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {getCatCode(selectedCatalog)} - {selectedCatalog.name}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedCatalog.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Sistema:{" "}
                      <span
                        className={`font-semibold ${
                          selectedCatalog.ownerSystem === "ODISEO"
                            ? "text-emerald-600"
                            : "text-purple-600"
                        }`}
                      >
                        {selectedCatalog.ownerSystem === "ODISEO"
                          ? "ODISEO (Editable)"
                          : "Sistema Integral (Lectura)"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-primary text-white px-4 py-2 text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                  >
                    <Download size={16} />
                    Descargar
                  </button>
                </div>
              </div>
            )}

            {/* Upload Area */}
            {selectedCatalog && selectedCatalog.ownerSystem === "ODISEO" && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Cargar Archivo Actualizado
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    isDragging
                      ? "border-brand-primary bg-brand-secondary-soft"
                      : "border-slate-300 bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  <Upload
                    size={32}
                    className={`mx-auto mb-3 cursor-pointer transition-colors ${
                      isDragging ? "text-brand-primary" : "text-slate-400 hover:text-brand-primary"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <p className="text-sm font-medium text-slate-900">
                    Arrastra el archivo aquí o{" "}
                    <label className="text-brand-primary cursor-pointer hover:underline">
                      selecciona un archivo
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isValidating}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Soporta archivos .xlsx y .xls
                  </p>
                </div>

                {validationError && (
                  <div className="mt-4 flex gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        Error en archivo
                      </p>
                      <p className="text-sm text-red-700 mt-1">{validationError}</p>
                    </div>
                  </div>
                )}

                {isValidating && (
                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
                    <div className="h-4 w-4 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin" />
                    Validando archivo...
                  </div>
                )}
              </div>
            )}

            {selectedCatalog && selectedCatalog.ownerSystem !== "ODISEO" && (
              <div className="flex gap-3 rounded-lg bg-blue-50 p-4 border border-blue-200">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Catálogo de Solo Lectura
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Este catálogo pertenece a Sistema Integral y no puede ser modificado.
                    Solo puedes descargar su información.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && uploadedData && validationResult && selectedCatalog && (
        <CatalogUploadConfirmationModal
          isOpen={showConfirmation}
          previewData={validationResult.preview}
          uploadedData={uploadedData}
          catalogCode={selectedCatalog.code}
          onConfirmed={(result) => {
            setUploadResult(result);
            setShowResultModal(true);
            setShowConfirmation(false);
          }}
          onCancelled={() => {
            setShowConfirmation(false);
            setValidationResult(null);
            setUploadedData(null);
            setValidationError(null);
          }}
        />
      )}

      {/* Result Modal */}
      <CatalogUploadResultModal
        isOpen={showResultModal}
        result={uploadResult}
        onClose={() => {
          setShowResultModal(false);
          setUploadResult(null);
          setValidationResult(null);
          setUploadedData(null);
          setSelectedCatalogCode(null);
          setValidationError(null);
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        }}
      />
    </>
  );
}
