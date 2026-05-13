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
    // Info básica
    name: initialData?.name || initialData?.productName || "",
    productName: initialData?.productName || initialData?.name || "",
    description: initialData?.description || initialData?.productDescription || "",
    productDescription: initialData?.productDescription || initialData?.description || "",
    customerPackingCode: initialData?.customerPackingCode || "",

    // Requerimientos
    requiresDesign: initialData?.requiresDesign || false,
    requiresSample: initialData?.requiresSample || false,

    // Dimensiones
    width: initialData?.width ? Number(initialData.width) : undefined,
    length: initialData?.length ? Number(initialData.length) : undefined,
    gusset: initialData?.gusset ? Number(initialData.gusset) : undefined,
    estimatedVolume: initialData?.estimatedVolume ? Number(initialData.estimatedVolume) : undefined,
    unitOfMeasure: initialData?.unitOfMeasure || "",

    // Cotización
    saleScope: initialData?.saleScope || "Nacional",
    incoterm: initialData?.incoterm || "",
    destinationCountry: initialData?.destinationCountry || "",
    currencyType: initialData?.currencyType || "",
    targetPriceMin: initialData?.targetPriceMin ? Number(initialData.targetPriceMin) : undefined,
    targetPriceMax: initialData?.targetPriceMax ? Number(initialData.targetPriceMax) : undefined,
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

    // Validaciones de dimensiones
    if (form.width && Number(form.width) <= 0) {
      errs.width = "El ancho debe ser mayor a 0";
    }

    if (form.length && Number(form.length) <= 0) {
      errs.length = "El largo debe ser mayor a 0";
    }

    if (form.gusset != null && Number(form.gusset) < 0) {
      errs.gusset = "El fuelle no puede ser negativo";
    }

    // Validaciones de Cotización
    if (form.saleScope === "Internacional") {
      if (!form.destinationCountry?.trim()) {
        errs.destinationCountry = "País destino es obligatorio para venta internacional";
      }
      if (!form.incoterm?.trim()) {
        errs.incoterm = "Incoterm es obligatorio para venta internacional";
      }
    }

    // Si hay precios, moneda es obligatoria y precios válidos
    if ((form.targetPriceMin || form.targetPriceMax) && !form.currencyType?.trim()) {
      errs.currencyType = "Moneda es obligatoria cuando se ingresan precios";
    }

    // Validar que precio máximo >= precio mínimo
    if (
      form.targetPriceMin &&
      form.targetPriceMax &&
      Number(form.targetPriceMin) > Number(form.targetPriceMax)
    ) {
      errs.targetPrice = "Precio máximo debe ser mayor o igual al precio mínimo";
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
          // Info básica
          name: form.name?.trim() || "",
          productName: form.name?.trim() || "",
          description: form.description || "",
          productDescription: form.description || "",
          customerPackingCode: form.customerPackingCode || "",

          // Requerimientos
          requiresDesign: form.requiresDesign || false,
          requiresSample: form.requiresSample || false,

          // Dimensiones
          width: form.width ? Number(form.width) : undefined,
          length: form.length ? Number(form.length) : undefined,
          gusset: form.gusset != null ? Number(form.gusset) : undefined,
          estimatedVolume: form.estimatedVolume ? Number(form.estimatedVolume) : undefined,
          unitOfMeasure: form.unitOfMeasure || "",

          // Cotización
          saleScope: form.saleScope || "Nacional",
          incoterm: form.incoterm || "",
          destinationCountry: form.destinationCountry || "",
          currencyType: form.currencyType || "",
          targetPriceMin: form.targetPriceMin ? Number(form.targetPriceMin) : undefined,
          targetPriceMax: form.targetPriceMax ? Number(form.targetPriceMax) : undefined,
          commercialComments: form.commercialComments || "",
          commercialFinanceComment: form.commercialComments || "",

          updatedAt: new Date().toISOString(),
        };

        // NO incluir campos técnicos: structureType, blueprintFormat, printType, layer*, grammage, etc.
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
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

            <FormInput
              label="Código de Empaque del Cliente"
              value={form.customerPackingCode || ""}
              onChange={(value) => updateField("customerPackingCode", value)}
              placeholder="Ej. SKU-001"
            />
          </fieldset>

          {/* SECCIÓN 2: REQUERIMIENTOS */}
          <fieldset className="space-y-3 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              2. Requerimientos
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
          </fieldset>

          {/* SECCIÓN 3: DIMENSIONES Y VOLUMEN */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              3. Dimensiones y Volumen
            </legend>

            <div className="grid grid-cols-3 gap-4">
              <FormInput
                label="Ancho (mm)"
                type="number"
                value={String(form.width ?? "")}
                onChange={(value) => updateField("width", value ? Number(value) : undefined)}
                error={errors.width}
                placeholder="Ej. 150"
              />

              <FormInput
                label="Largo (mm)"
                type="number"
                value={String(form.length ?? "")}
                onChange={(value) => updateField("length", value ? Number(value) : undefined)}
                error={errors.length}
                placeholder="Ej. 200"
              />

              <FormInput
                label="Fuelle (mm)"
                type="number"
                value={String(form.gusset ?? "")}
                onChange={(value) => updateField("gusset", value ? Number(value) : undefined)}
                error={errors.gusset}
                placeholder="Ej. 50"
              />
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

          {/* SECCIÓN 4: COTIZACIÓN */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              4. Cotización
            </legend>

            <FormSelect
              label="Venta"
              value={form.saleScope || "Nacional"}
              onChange={(value) => updateField("saleScope", value as "Nacional" | "Internacional")}
              options={[
                { value: "Nacional", label: "Nacional" },
                { value: "Internacional", label: "Internacional" },
              ]}
            />

            {form.saleScope === "Internacional" && (
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Incoterm *"
                  value={form.incoterm || ""}
                  onChange={(value) => updateField("incoterm", value)}
                  error={errors.incoterm}
                  placeholder="Ej. FOB, CIF"
                />

                <FormInput
                  label="País Destino *"
                  value={form.destinationCountry || ""}
                  onChange={(value) => updateField("destinationCountry", value)}
                  error={errors.destinationCountry}
                  placeholder="Ej. Colombia"
                />
              </div>
            )}

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

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Precio Mínimo"
                type="number"
                value={String(form.targetPriceMin ?? "")}
                onChange={(value) => updateField("targetPriceMin", value ? Number(value) : undefined)}
                placeholder="Ej. 0.50"
              />

              <FormInput
                label="Precio Máximo"
                type="number"
                value={String(form.targetPriceMax ?? "")}
                onChange={(value) => updateField("targetPriceMax", value ? Number(value) : undefined)}
                error={errors.targetPrice}
                placeholder="Ej. 1.00"
              />
            </div>

            <FormTextarea
              label="Comentario Commercial Finance"
              value={form.commercialComments || ""}
              onChange={(value) => updateField("commercialComments", value)}
              placeholder="Notas para el equipo de finanzas"
              rows={3}
            />
          </fieldset>

          {/* SECCIÓN 5: RESUMEN TÉCNICO HEREDADO (SOLO LECTURA) */}
          <fieldset className="space-y-4 pb-6">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              5. Resumen técnico heredado (Solo lectura)
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyField
                label="Cliente"
                value={project.clientName}
              />
              <ReadOnlyField
                label="Portafolio"
                value={project.portfolioName}
              />

              <ReadOnlyField
                label="Planta"
                value={project.plantaName}
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
                label="Aplicación técnica"
                value={project.technicalApplication}
              />

              <ReadOnlyField
                label="Uso final"
                value={project.useFinalName || project.usoFinal}
              />
              <ReadOnlyField
                label="Sector"
                value={project.sector}
              />

              <ReadOnlyField
                label="Segmento"
                value={project.segment}
              />
              <ReadOnlyField
                label="Subsegmento"
                value={project.subSegment}
              />
            </div>

            {/* Estructura con ayuda */}
            <div className="mt-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
              <div className="mb-3">
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Estructura
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  {project.structureType || "—"}
                </div>
              </div>
              <div className="text-xs text-slate-600 italic border-t border-slate-200 pt-3">
                ℹ️ La estructura proviene del proyecto validado. Para modificarla, el proyecto debe volver a validación técnica.
              </div>
            </div>

            {/* Otros datos técnicos */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <ReadOnlyField
                label="Ancho proyecto (mm)"
                value={project.width}
              />
              <ReadOnlyField
                label="Fuelle proyecto (mm)"
                value={project.gussetWidth}
              />

              <ReadOnlyField
                label="Gramaje (g/m²)"
                value={project.grammage}
              />
              <ReadOnlyField
                label="AFMarketID"
                value={project.afMarketId}
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
