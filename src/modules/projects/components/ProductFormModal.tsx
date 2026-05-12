import { useState, useMemo } from "react";
import { X } from "lucide-react";
import type { ProjectProductRecord } from "../../../shared/data/projectProductStorage";
import {
  createProjectProductFromProject,
  createProjectProductFromApprovedProduct,
  saveProjectProduct,
} from "../../../shared/data/projectProductStorage";
import type { ProjectRecord } from "../../../shared/data/projectStorage";
import type { PreliminaryProductType } from "../../../shared/data/projectWorkflow";
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

export default function ProductFormModal({
  projectCode,
  project,
  initialData,
  baseProductId,
  onSave,
  onCancel,
}: ProductFormModalProps) {
  const isEditMode = !!initialData?.id;

  const [form, setForm] = useState<FormData>({
    productName: initialData?.productName || "",
    productType: (initialData?.productType || "Base") as PreliminaryProductType,
    productDescription: initialData?.productDescription || "",
    requiresDesign: initialData?.requiresDesign || false,
    requiresSample: initialData?.requiresSample || false,
    requiresNewStructure: initialData?.requiresNewStructure || false,
    format: initialData?.format || project.blueprintFormat || "",
    structure: initialData?.structure || project.structureType || "",
    width: initialData?.width ?? (project.width ? Number(project.width) : undefined),
    length: initialData?.length ?? (project.length ? Number(project.length) : undefined),
    gusset: initialData?.gusset ?? (project.gussetWidth ? Number(project.gussetWidth) : undefined),
    micron: initialData?.micron,
    grammage: initialData?.grammage ?? (project.grammage ? Number(project.grammage) : undefined),
    estimatedVolume: initialData?.estimatedVolume ?? (project.estimatedVolume ? Number(project.estimatedVolume) : undefined),
    unitOfMeasure: initialData?.unitOfMeasure || project.unitOfMeasure || "",
    targetPriceMin: initialData?.targetPriceMin,
    targetPriceMax: initialData?.targetPriceMax,
    commercialFinanceComment: initialData?.commercialFinanceComment || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [changedSensitiveFields, setChangedSensitiveFields] = useState(new Set<string>());

  const sensitiveFields = [
    "format",
    "structure",
    "width",
    "length",
    "gusset",
    "micron",
    "grammage",
    "requiresDesign",
    "requiresNewStructure",
  ];

  const updateField = (key: string, value: any) => {
    if (isEditMode && sensitiveFields.includes(key)) {
      const oldValue = initialData?.[key as keyof ProjectProductRecord];
      if (oldValue !== value) {
        setChangedSensitiveFields((prev) => new Set([...prev, key]));
      }
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!form.productName?.trim()) {
      errs.productName = "El nombre del producto es obligatorio";
    }
    if (form.targetPriceMin && form.targetPriceMax && form.targetPriceMin > form.targetPriceMax) {
      errs.targetPrice = "Precio mínimo no puede ser mayor que máximo";
    }
    return errs;
  }, [form]);

  const handleSave = () => {
    setErrors(validate);
    if (Object.keys(validate).length > 0) return;

    try {
      let saved: ProjectProductRecord;

      if (isEditMode) {
        const toSave: ProjectProductRecord = {
          ...(initialData as ProjectProductRecord),
          ...form,
          updatedAt: new Date().toISOString(),
        };

        // Reset validations if sensitive fields changed
        if (changedSensitiveFields.size > 0) {
          toSave.agValidationStatus = "Sin solicitar";
          toSave.rdValidationStatus = "Sin solicitar";
        }

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
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditMode ? "Editar Producto" : "Crear Producto Preliminar"}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info básica */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase">
              Información General
            </legend>
            <FormInput
              label="Nombre del Producto *"
              value={form.productName || ""}
              onChange={(value) => updateField("productName", value)}
              error={errors.productName}
              placeholder="Ej. Bolsa de polietileno blanca"
            />
            <FormSelect
              label="Tipo de Producto"
              value={form.productType || "Base"}
              onChange={(value) => updateField("productType", value as PreliminaryProductType)}
              options={[
                { value: "Base", label: "Producto Base" },
                { value: "Variación", label: "Variación" },
              ]}
            />
            <FormTextarea
              label="Descripción"
              value={form.productDescription || ""}
              onChange={(value) => updateField("productDescription", value)}
              placeholder="Detalles adicionales del producto"
              rows={3}
            />
          </fieldset>

          {/* Indicadores */}
          <fieldset className="space-y-3 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase">
              Requerimientos
            </legend>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.requiresDesign || false}
                onChange={(e) => updateField("requiresDesign", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Requiere Diseño Especial</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.requiresSample || false}
                onChange={(e) => updateField("requiresSample", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Requiere Muestra</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.requiresNewStructure || false}
                onChange={(e) => updateField("requiresNewStructure", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Requiere Nueva Estructura</span>
            </label>
          </fieldset>

          {/* Dimensiones */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase">
              Especificaciones Técnicas
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Formato"
                value={form.format || ""}
                onChange={(value) => updateField("format", value)}
              />
              <FormInput
                label="Estructura"
                value={form.structure || ""}
                onChange={(value) => updateField("structure", value)}
              />
              <FormInput
                label="Ancho (mm)"
                type="number"
                value={String(form.width ?? "")}
                onChange={(value) => updateField("width", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Largo (mm)"
                type="number"
                value={String(form.length ?? "")}
                onChange={(value) => updateField("length", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Fuelle (mm)"
                type="number"
                value={String(form.gusset ?? "")}
                onChange={(value) => updateField("gusset", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Espesor/Micraje"
                type="number"
                value={String(form.micron ?? "")}
                onChange={(value) => updateField("micron", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Gramaje (g/m²)"
                type="number"
                value={String(form.grammage ?? "")}
                onChange={(value) => updateField("grammage", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Volumen Estimado"
                type="number"
                value={String(form.estimatedVolume ?? "")}
                onChange={(value) => updateField("estimatedVolume", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Unidad de Medida"
                value={form.unitOfMeasure || ""}
                onChange={(value) => updateField("unitOfMeasure", value)}
              />
            </div>
          </fieldset>

          {/* Cotización */}
          <fieldset className="space-y-4 pb-6">
            <legend className="text-sm font-semibold text-slate-700 uppercase">
              Cotización
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Precio Mínimo"
                type="number"
                value={String(form.targetPriceMin ?? "")}
                onChange={(value) => updateField("targetPriceMin", value ? Number(value) : undefined)}
              />
              <FormInput
                label="Precio Máximo"
                type="number"
                value={String(form.targetPriceMax ?? "")}
                onChange={(value) => updateField("targetPriceMax", value ? Number(value) : undefined)}
              />
            </div>
            {errors.targetPrice && (
              <p className="text-sm text-red-600">{errors.targetPrice}</p>
            )}
            <FormTextarea
              label="Comentario Comercial Finance"
              value={form.commercialFinanceComment || ""}
              onChange={(value) => updateField("commercialFinanceComment", value)}
              rows={3}
            />
          </fieldset>

          {/* Resumen de cambios sensibles */}
          {isEditMode && changedSensitiveFields.size > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              ⚠️ Los cambios en dimensiones o requerimientos resetearán las validaciones de AG y R&D
            </div>
          )}

          {/* Errores generales */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}
        </div>

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
