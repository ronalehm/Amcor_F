import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getCurrentUser } from "../../../shared/data/userStorage";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import CatalogSourceTabs from "../components/CatalogSourceTabs";
import TemplateDownloadCard from "../components/TemplateDownloadCard";
import ValidationSummaryCard from "../components/ValidationSummaryCard";
import ChangePreviewTable from "../components/ChangePreviewTable";
import RestrictionTemplateDownloadCard from "../components/RestrictionTemplateDownloadCard";
import WorkflowStep from "../components/WorkflowStep";
import ManagementTypeCards from "../components/ManagementTypeCards";
import RecentChangeLogPanel from "../components/RecentChangeLogPanel";
import HistoryModal from "../components/HistoryModal";
import ElementSelector from "../components/ElementSelector";
import { uploadAndValidateTemplate, confirmChanges, getChangeLog } from "../services/catalogRestrictionService";
import { getRestrictionChangeLog, addRestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";
import { validateManagementParams, validateFileUpload, canConfirmChanges } from "../utils/catalogRestrictionValidators";
import type { ManagementType, ValidationSummary, ChangeLogEntry } from "../types/catalogRestriction.types";
import type { RestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";

export default function CatalogRestrictionManagementPage() {
  const { setHeader, resetHeader } = useLayout();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [managementType, setManagementType] = useState<ManagementType>("catalog");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [catalogSource, setCatalogSource] = useState<"ODISEO" | "SISTEMA_INTEGRAL">("ODISEO");
  const [reason, setReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"pending" | "validating" | "with_observations" | "valid" | "applied">("pending");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [restrictionChangeLog, setRestrictionChangeLog] = useState<RestrictionChangeLogEntry[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [activeTab, setActiveTab] = useState<"dimension" | "validation">("dimension");
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    setHeader({
      title: "Gestión de Catálogos y Restricciones",
      breadcrumbs: [
        { label: "Inicio", href: "/dashboard" },
        { label: "Gestión de Catálogos y Restricciones" },
      ],
    });
    setChangeLog(getChangeLog());
    setRestrictionChangeLog(getRestrictionChangeLog());
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const validationErrors = useMemo(() => {
    return validateManagementParams(managementType, selectedTargetId, reason);
  }, [managementType, selectedTargetId, reason]);

  const fileErrors = useMemo(() => {
    return validateFileUpload(uploadedFile);
  }, [uploadedFile]);

  const handleTypeChange = (type: ManagementType) => {
    setManagementType(type);
    setSelectedTarget("");
    setSelectedTargetId("");
    setCatalogSource("ODISEO");
    setValidationSummary(null);
    setUploadedFile(null);
    setUploadedFileName("");
    setUploadStatus("pending");
    setSubmitAttempted(false);
    setReason("");
    setActiveTab("dimension");
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setUploadedFileName(file.name);
    setValidationSummary(null);
    setUploadStatus("pending");
  };

  const handleValidate = async () => {
    if (!uploadedFile) return;

    setIsValidating(true);
    setUploadStatus("validating");

    try {
      const summary = await uploadAndValidateTemplate(
        uploadedFile,
        selectedTargetId
      );

      setValidationSummary(summary);
      setUploadStatus(summary.status === "valid" ? "valid" : "with_observations");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
    setManagementType("catalog");
    setSelectedTarget("");
    setSelectedTargetId("");
    setCatalogSource("ODISEO");
    setReason("");
    setUploadedFile(null);
    setUploadedFileName("");
    setValidationSummary(null);
    setUploadStatus("pending");
    setSubmitAttempted(false);
    setShowConfirmModal(false);
  };

  const handleConfirmClick = () => {
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!canConfirmChanges(validationSummary)) {
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmModal = async () => {
    if (!validationSummary) return;

    setIsSubmitting(true);

    try {
      // Convertir filas de vista previa a formato para confirmación
      const rowsToConfirm = validationSummary.rows
        .filter((row) => row.detectedAction !== "unchanged")
        .map((row) => {
          const item = "item" in row ? row.item : row.ruleCode;
          const name = "newName" in row ? row.newName : row.allowedValue;
          return {
            item,
            name,
            status: (row.newStatus || "Activo") as "Activo" | "Inactivo" | "Bloqueado",
          };
        });

      await confirmChanges(selectedTargetId, rowsToConfirm, reason);

      setUploadStatus("applied");
      setShowConfirmModal(false);

      const totalProcessed = (validationSummary?.newRecords || 0)
        + (validationSummary?.modifiedRecords || 0)
        + (validationSummary?.inactivatedRecords || 0)
        + (validationSummary?.blockedRecords || 0);

      const timestamp = new Date().toLocaleDateString("es-ES") + " " + new Date().toLocaleTimeString("es-ES");
      const userName = currentUser?.fullName || "Administrador";

      if (managementType === "catalog") {
        const newEntry: ChangeLogEntry = {
          id: `log-${Date.now()}`,
          timestamp,
          user: userName,
          managementType,
          element: selectedTarget || "Elemento desconocido",
          action: "Actualización por plantilla",
          processedRecords: totalProcessed,
          result: "success",
          source: catalogSource,
        };
        setChangeLog([newEntry, ...changeLog]);
      } else {
        const changes: Record<string, { old: any; new: any }> = {};
        rowsToConfirm.forEach((row) => {
          changes[row.item] = { old: null, new: row.name };
        });

        const newEntry = addRestrictionChangeLogEntry(
          {
            restrictionId: selectedTargetId,
            restrictionName: selectedTarget || "Restricción desconocida",
            restrictionType: activeTab,
            action: "updated",
            changes,
            result: "success",
            reason,
          },
          reason
        );
        setRestrictionChangeLog([newEntry, ...restrictionChangeLog]);
      }

      setSuccessMessage("La información fue actualizada correctamente y registrada en la bitácora.");

      setTimeout(() => {
        handleCancel();
        setSuccessMessage(null);
        navigate("/catalogs");
      }, 2500);
    } catch (error) {
      console.error("Error confirmando cambios:", error);
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-lg font-bold text-green-900">{successMessage}</p>
          <p className="text-sm text-green-700 mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const totalChanges = (validationSummary?.newRecords || 0)
    + (validationSummary?.modifiedRecords || 0)
    + (validationSummary?.inactivatedRecords || 0)
    + (validationSummary?.blockedRecords || 0);
  const noChangesDetected = validationSummary && totalChanges === 0 && validationSummary.criticalErrors === 0;

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <div className="space-y-6 pb-6">
        {/* Encabezado compacto con texto y botón Ver todo */}
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <p className="text-sm text-slate-700">
            Actualiza catálogos y restricciones mediante plantillas validadas. Los cambios quedan registrados en la bitácora.
          </p>
          <button
            onClick={() => navigate("/catalogs/view-all")}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-primary bg-white px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors whitespace-nowrap"
          >
            👁️ Ver todo
          </button>
        </div>

        {/* Pestañas de fuente global - ODISEO / Sistema Integral */}
        <div className="px-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-600 uppercase mb-3">
              Origen de datos
            </p>
            <CatalogSourceTabs value={catalogSource} onChange={setCatalogSource} />
          </div>
        </div>

        {/* Layout de 2 columnas: 66% flujo | 34% bitácora */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
          {/* Columna Izquierda: Flujo guiado (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* PASO 1: Tipo de información */}
            <WorkflowStep
              number={1}
              title="Tipo de información"
              description="Elige si actualizarás un catálogo o una restricción."
            >
              <ManagementTypeCards
                value={managementType}
                onChange={handleTypeChange}
              />
            </WorkflowStep>

            {/* PASO 2: Configurar actualización */}
            <WorkflowStep
              number={2}
              title="Configurar actualización"
              description={
                managementType === "catalog"
                  ? "Busca y selecciona el catálogo a actualizar."
                  : "Selecciona el tipo de restricción y busca la restricción a actualizar."
              }
            >
              <div className="space-y-4">
                {managementType === "restriction" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Tipo de restricción *
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveTab("dimension")}
                        className={`flex-1 rounded-lg border-2 py-2 px-3 text-sm font-medium transition-all ${
                          activeTab === "dimension"
                            ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        Dimensión
                      </button>
                      <button
                        onClick={() => setActiveTab("validation")}
                        className={`flex-1 rounded-lg border-2 py-2 px-3 text-sm font-medium transition-all ${
                          activeTab === "validation"
                            ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        Validación
                      </button>
                    </div>
                  </div>
                )}

                <ElementSelector
                  type={managementType}
                  selectedTargetId={selectedTargetId}
                  onTargetIdChange={setSelectedTargetId}
                  onTargetChange={setSelectedTarget}
                  error={validationErrors.selectedTargetId}
                  catalogSource={catalogSource}
                  restrictionType={managementType === "restriction" ? activeTab : undefined}
                />

                {selectedTargetId && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                    <p className="text-xs font-medium text-green-700">
                      ✓ Elemento seleccionado:
                    </p>
                    <p className="text-sm font-semibold text-green-900 mt-1">
                      {selectedTarget || "Cargando..."}
                    </p>
                  </div>
                )}
              </div>
            </WorkflowStep>

            {/* PASO 3: Plantilla y validación */}
            <WorkflowStep
              number={3}
              title="Plantilla y validación"
              description="Descarga, carga y valida la plantilla antes de aplicar cambios."
              isVisible={selectedTargetId !== ""}
            >
              <div className="space-y-4">
                {managementType === "catalog" ? (
                  <TemplateDownloadCard
                    type={managementType}
                    targetId={selectedTargetId}
                    uploadStatus={uploadStatus}
                    uploadedFileName={uploadedFileName}
                    reason={reason}
                    reasonError={validationErrors.reason}
                    onFileUpload={handleFileUpload}
                    onValidate={handleValidate}
                    onReasonChange={setReason}
                    isValidating={isValidating}
                    submitAttempted={submitAttempted}
                    catalogSource={catalogSource}
                  />
                ) : (
                  <RestrictionTemplateDownloadCard
                    restrictionType={activeTab}
                    uploadStatus={uploadStatus}
                    uploadedFileName={uploadedFileName}
                    reason={reason}
                    reasonError={validationErrors.reason}
                    onFileUpload={handleFileUpload}
                    onValidate={handleValidate}
                    onReasonChange={setReason}
                    isValidating={isValidating}
                    isApplying={isSubmitting}
                    submitAttempted={submitAttempted}
                    validationSummary={validationSummary}
                    onApplyChanges={() => {}}
                  />
                )}
              </div>
            </WorkflowStep>

            {/* PASO 4: Resultado de validación */}
            {validationSummary && (
              <WorkflowStep
                number={4}
                title="Resultado de la validación"
                description="Revisa el resumen y la vista previa de cambios."
                isVisible={true}
              >
                <div className="space-y-4">
                  <ValidationSummaryCard summary={validationSummary} />

                  {noChangesDetected && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-600">
                        No se detectaron cambios para aplicar.
                      </p>
                    </div>
                  )}

                  {validationSummary.criticalErrors > 0 && (
                    <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-900">
                        ⚠️ La plantilla contiene errores. Corrige todos los registros y vuelve a cargarla para continuar.
                      </p>
                    </div>
                  )}

                  {validationSummary.criticalErrors === 0 && totalChanges > 0 && (
                    <div className="rounded-lg border border-green-300 bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-900">
                        ✓ Plantilla validada y lista para confirmar.
                      </p>
                    </div>
                  )}

                  {totalChanges > 0 && (
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-4">
                        Vista previa de cambios
                      </h4>
                      <ChangePreviewTable
                        type={managementType}
                        rows={validationSummary.rows}
                      />
                    </div>
                  )}
                </div>
              </WorkflowStep>
            )}
          </div>

          {/* Columna Derecha: Bitácora reciente (1/3) */}
          <div className="lg:col-span-1">
            <RecentChangeLogPanel
              type={managementType}
              catalogEntries={changeLog}
              restrictionEntries={restrictionChangeLog}
              onViewHistory={() => setShowHistoryModal(true)}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur px-6">
        <FormActionButtons
          onCancel={handleCancel}
          onSubmit={handleConfirmClick}
          validationErrorList={
            submitAttempted
              ? Object.values(validationErrors).filter((e): e is string => Boolean(e))
              : []
          }
          submitAttempted={submitAttempted}
          submitLabel="Confirmar actualización"
          cancelLabel="Cancelar"
          isLoading={isSubmitting}
          validationTitle="Faltan campos obligatorios."
        />
      </div>

      {/* Modal de historial completo */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        type={managementType}
        catalogEntries={changeLog}
        restrictionEntries={restrictionChangeLog}
      />

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirmar actualización</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-slate-700">
                Los cambios serán aplicados y registrados en la bitácora del sistema. ¿Deseas continuar?
              </p>
              <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-600 uppercase">Resumen</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Nuevos: </span>
                    <span className="font-bold text-green-600">{validationSummary?.newRecords || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Modificados: </span>
                    <span className="font-bold text-blue-600">{validationSummary?.modifiedRecords || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Inactivados: </span>
                    <span className="font-bold text-slate-600">{validationSummary?.inactivatedRecords || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Bloqueados: </span>
                    <span className="font-bold text-red-600">{validationSummary?.blockedRecords || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmModal}
                disabled={isSubmitting}
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
