import { useState } from "react";
import * as XLSX from "xlsx";
import Button from "../../../shared/components/ui/Button";
import { AlertCircle, CheckCircle, AlertTriangle, Upload, Loader2 } from "lucide-react";
import type { ValidationResult } from "../services/catalogTemplateValidator";
import { validateCatalogTemplate } from "../services/catalogTemplateValidator";
import { CatalogUploadConfirmationModal } from "./CatalogUploadConfirmationModal";
import type { UploadResult } from "../services/catalogTemplateUploadService";

export function CatalogUploadValidator() {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setShowPreview(false);
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    try {
      setIsValidating(true);
      const validationResult = await validateCatalogTemplate(file);
      setResult(validationResult);
      setShowPreview(validationResult.isValid);

      // Si es válido, extraer datos para confirmación
      if (validationResult.isValid) {
        try {
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
          const detailSheet = workbook.Sheets["Detalle_Catalogos"];
          const data = XLSX.utils.sheet_to_json(detailSheet);
          setUploadedData(data as any[]);
        } catch {
          console.warn("No se pudieron extraer datos para confirmación");
        }
      }
    } catch (error) {
      console.error("Error validando archivo:", error);
      setResult({
        isValid: false,
        errors: [
          {
            type: "error",
            code: "VALIDATION_ERROR",
            message: `Error al validar: ${error instanceof Error ? error.message : "Error desconocido"}`,
          },
        ],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="font-semibold mb-2">Cargar Plantilla de Catálogos</h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona un archivo XLSX que fue descargado desde este sistema
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="catalog-file-input"
        />

        <label htmlFor="catalog-file-input" className="cursor-pointer">
          <Button type="button" className="mb-2">
            Seleccionar Archivo
          </Button>
        </label>

        {file && (
          <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              Archivo seleccionado: {file.name}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>

      {/* Validate Button */}
      {file && (
        <Button
          onClick={handleValidate}
          disabled={isValidating}
          className="w-full"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            "Validar Plantilla"
          )}
        </Button>
      )}

      {/* Validation Results */}
      {result && (
        <div className="space-y-4">
          {/* Status Header */}
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              result.isValid
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {result.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4
                className={`font-semibold ${
                  result.isValid ? "text-green-900" : "text-red-900"
                }`}
              >
                {result.isValid
                  ? "✓ Plantilla válida"
                  : "✗ Errores de validación"}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  result.isValid ? "text-green-800" : "text-red-800"
                }`}
              >
                {result.errors.length > 0 &&
                  `${result.errors.length} error(es)`}
                {result.errors.length > 0 && result.warnings.length > 0 &&
                  " | "}
                {result.warnings.length > 0 &&
                  `${result.warnings.length} advertencia(s)`}
              </p>
            </div>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Errores Encontrados
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.errors.map((error, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800"
                  >
                    <p className="font-medium">
                      [{error.code}] {error.message}
                    </p>
                    {error.sheet && (
                      <p className="text-xs mt-1">
                        Hoja: <span className="font-mono">{error.sheet}</span>
                        {error.row && ` | Fila: ${error.row}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Advertencias
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {result.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800"
                  >
                    <p className="font-medium">
                      [{warning.code}] {warning.message}
                    </p>
                    {warning.sheet && (
                      <p className="text-xs mt-1">
                        Hoja: <span className="font-mono">{warning.sheet}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {showPreview && result.preview && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">
                Preview de Cambios
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-600 font-semibold">
                    NUEVOS REGISTROS
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {result.preview.newRecords}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                  <p className="text-xs text-purple-600 font-semibold">
                    MODIFICADOS
                  </p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {result.preview.modifiedRecords}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-xs text-orange-600 font-semibold">
                    INACTIVADOS
                  </p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">
                    {result.preview.inactivatedRecords}
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-600 font-semibold">BLOQUEADOS</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">
                    {result.preview.blockedRecords}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {result.isValid && !uploadResult && (
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmation(true)}
              >
                Confirmar Cambios
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setShowPreview(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Upload Success Result */}
          {uploadResult && uploadResult.success && (
            <div className="pt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setShowPreview(false);
                  setUploadResult(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <CatalogUploadConfirmationModal
        isOpen={showConfirmation}
        previewData={result?.preview || {
          newRecords: 0,
          modifiedRecords: 0,
          inactivatedRecords: 0,
          blockedRecords: 0,
        }}
        uploadedData={uploadedData}
        onConfirmed={(uploadRes) => {
          setUploadResult(uploadRes);
          setShowConfirmation(false);
        }}
        onCancelled={() => setShowConfirmation(false)}
      />
    </div>
  );
}
