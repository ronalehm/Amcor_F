import { useState, useMemo } from "react";
import { X } from "lucide-react";
import type { ProjectProductRecord } from "../../../shared/data/projectProductStorage";
import {
  createProjectProductFromProject,
  createProjectProductFromApprovedProduct,
  saveProjectProduct,
} from "../../../shared/data/projectProductStorage";
import type { ProjectRecord } from "../../../shared/data/projectStorage";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import Button from "../../../shared/components/ui/Button";

interface ProductFormModalProps {
  projectCode: string;
  project: ProjectRecord;
  initialData?: Partial<ProjectProductRecord>;
  baseProductId?: string;
  onSave: (product: ProjectProductRecord) => void;
  onCancel: () => void;
}

type FormData = Partial<ProjectProductRecord>;

// ============================================================================
// COMPONENTE: CAMPO SOLO LECTURA
// ============================================================================

const ReadOnlyField = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
      {label}
    </div>
    <div className="mt-1 text-sm font-semibold text-slate-700">
      {value || "—"}
    </div>
  </div>
);

// ============================================================================
// MODAL PRINCIPAL
// ============================================================================

export default function ProductFormModal({
  projectCode,
  project,
  initialData,
  baseProductId,
  onSave,
  onCancel,
}: ProductFormModalProps) {
  const isEditMode = !!initialData?.id;
  const isBaseProduct = !initialData?.baseProductId;

  const [form, setForm] = useState<FormData>({
    name: initialData?.name || initialData?.productName || "",
    productName: initialData?.productName || initialData?.name || "",
    description: initialData?.description || initialData?.productDescription || "",
    productDescription: initialData?.productDescription || initialData?.description || "",
    customerPackingCode: initialData?.customerPackingCode || "",
    estimatedVolume: initialData?.estimatedVolume
      ? Number(initialData.estimatedVolume)
      : undefined,
    unitOfMeasure: initialData?.unitOfMeasure || "",
    currencyType: initialData?.currencyType || "",
    targetPrice: initialData?.targetPrice
      ? Number(initialData.targetPrice)
      : undefined,
    commercialComments: initialData?.commercialComments || initialData?.commercialFinanceComment || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = useMemo(() => {
    const errs: Record<string, string> = {};

    // Campos obligatorios básicos
    if (!form.name?.trim()) {
      errs.name = "El nombre del producto es obligatorio";
    }

    if (!form.estimatedVolume || Number(form.estimatedVolume) <= 0) {
      errs.estimatedVolume = "El volumen estimado es obligatorio y debe ser mayor a 0";
    }

    if (!form.unitOfMeasure?.trim()) {
      errs.unitOfMeasure = "La unidad de medida es obligatoria";
    }

    // Si hay precio, moneda es obligatoria
    if (form.targetPrice && !form.currencyType?.trim()) {
      errs.currencyType = "Moneda es obligatoria cuando se ingresa un precio";
    }

    return errs;
  }, [form]);

  const handleSave = () => {
    setErrors(validate);
    if (Object.keys(validate).length > 0) return;

    try {
      let saved: ProjectProductRecord;

      if (isEditMode) {
        // Edición: solo guardar campos editables
        const toSave: ProjectProductRecord = {
          ...(initialData as ProjectProductRecord),
          name: form.name?.trim() || "",
          productName: form.name?.trim() || "",
          description: form.description || "",
          productDescription: form.description || "",
          customerPackingCode: form.customerPackingCode || "",
          estimatedVolume: form.estimatedVolume ? Number(form.estimatedVolume) : undefined,
          unitOfMeasure: form.unitOfMeasure || "",
          currencyType: form.currencyType || "",
          targetPrice: form.targetPrice ? Number(form.targetPrice) : undefined,
          commercialComments: form.commercialComments || "",
          commercialFinanceComment: form.commercialComments || "",
          updatedAt: new Date().toISOString(),
        };

        // NO incluir campos técnicos: format, structure, width, length, gusset, micron, grammage, etc.
        saved = saveProjectProduct(toSave);
      } else if (baseProductId) {
        saved = createProjectProductFromApprovedProduct(projectCode, baseProductId, form);
      } else {
        saved = createProjectProductFromProject(projectCode, form);
      }

      onSave(saved);
    } catch (err) {
      console.error("Error saving product:", err);
      setErrors({ submit: "Error al guardar el producto" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ENCABEZADO */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditMode ? "Editar Producto Preliminar" : "Crear Producto Preliminar"}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* SECCIÓN 1: INFORMACIÓN DEL PRODUCTO */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              1. Información del Producto
            </legend>

            <FormInput
              label="Nombre del Producto *"
              value={form.name || ""}
              onChange={(value) => {
                updateField("name", value);
                updateField("productName", value);
              }}
              error={errors.name}
              placeholder="Ej. Bolsa de polietileno blanca 250ml"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tipo de Producto
                </label>
                <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700">
                  {isEditMode ? (
                    isBaseProduct ? "Producto Base" : "Variación"
                  ) : (
                    <select
                      value={form.productType === "Variación" ? "Variación" : "Base"}
                      onChange={(e) => updateField("productType", e.target.value === "Variación" ? "Variación" : "Base")}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="Base">Producto Base</option>
                      <option value="Variación">Variación</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Código Producto
                </label>
                <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700">
                  {initialData?.preliminaryProductCode || "Se generará automáticamente"}
                </div>
              </div>
            </div>

            <FormTextarea
              label="Descripción"
              value={form.description || ""}
              onChange={(value) => {
                updateField("description", value);
                updateField("productDescription", value);
              }}
              placeholder="Detalles adicionales del producto"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Código de Empaque del Cliente"
                value={form.customerPackingCode || ""}
                onChange={(value) => updateField("customerPackingCode", value)}
                placeholder="Ej. SKU-001"
              />

              <div />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Volumen Estimado *"
                type="number"
                value={String(form.estimatedVolume ?? "")}
                onChange={(value) => updateField("estimatedVolume", value ? Number(value) : undefined)}
                error={errors.estimatedVolume}
                placeholder="Ej. 1000"
              />

              <FormInput
                label="Unidad de Medida *"
                value={form.unitOfMeasure || ""}
                onChange={(value) => updateField("unitOfMeasure", value)}
                error={errors.unitOfMeasure}
                placeholder="Ej. Unidades"
              />
            </div>
          </fieldset>

          {/* SECCIÓN 2: COTIZACIÓN */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              2. Cotización
            </legend>

            <FormSelect
              label="Moneda"
              value={form.currencyType || ""}
              onChange={(value) => updateField("currencyType", value)}
              error={errors.currencyType}
              options={[
                { value: "", label: "Seleccionar moneda" },
                { value: "USD", label: "USD - Dólar Americano" },
                { value: "PEN", label: "PEN - Sol Peruano" },
                { value: "COP", label: "COP - Peso Colombiano" },
                { value: "BRL", label: "BRL - Real Brasileño" },
                { value: "EUR", label: "EUR - Euro" },
              ]}
            />

            <FormInput
              label="Precio Objetivo"
              type="number"
              value={String(form.targetPrice ?? "")}
              onChange={(value) => updateField("targetPrice", value ? Number(value) : undefined)}
              placeholder="Ej. 0.75"
            />

            <FormTextarea
              label="Comentario Commercial Finance"
              value={form.commercialComments || ""}
              onChange={(value) => updateField("commercialComments", value)}
              placeholder="Notas para el equipo de finanzas"
              rows={3}
            />
          </fieldset>

          {/* SECCIÓN 3: RESUMEN TÉCNICO HEREDADO (SOLO LECTURA) */}
          <fieldset className="space-y-4 pb-6">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              3. Resumen técnico heredado (Solo lectura)
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyField
                label="Proyecto"
                value={project.projectName || project.code}
              />
              <ReadOnlyField
                label="Cliente"
                value={project.clientName}
              />

              <ReadOnlyField
                label="Portafolio"
                value={project.portfolioName}
              />
              <ReadOnlyField
                label="Envoltura"
                value={project.wrappingName}
              />

              <ReadOnlyField
                label="Formato de plano"
                value={project.blueprintFormat}
              />
              <ReadOnlyField
                label="Estructura"
                value={project.structureType}
              />

              <ReadOnlyField
                label="Ancho (mm)"
                value={project.width}
              />
              <ReadOnlyField
                label="Fuelle (mm)"
                value={project.gussetWidth}
              />

              <ReadOnlyField
                label="Gramaje (g/m²)"
                value={project.grammage}
              />
              <ReadOnlyField
                label="Clasificación"
                value={project.classification}
              />
            </div>
          </fieldset>

          {/* ERRORES GENERALES */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}
        </div>

        {/* PIE DE MODAL */}
        <div className="sticky bottom-0 flex gap-3 justify-end p-6 border-t border-slate-200 bg-slate-50">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditMode ? "Actualizar" : "Crear"} Producto
          </Button>
        </div>
      </div>
    </div>
  );
}
