import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import type { ProjectProductRecord } from "../../../shared/data/projectProductStorage";
import {
  createProjectProductFromProject,
  createProjectProductFromApprovedProduct,
  saveProjectProduct,
} from "../../../shared/data/projectProductStorage";
import type { ProjectRecord } from "../../../shared/data/projectStorage";
import { UNITS_OF_MEASURE } from "../../../shared/data/unitOfMeasureStorage";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import Button from "../../../shared/components/ui/Button";

const COLOR_OBJECTIVE_OPTIONS = [
  { value: "No existe", label: "No existe" },
  { value: "Muestra física", label: "Muestra física" },
  { value: "Color pantone", label: "Color pantone" },
  { value: "Producción de referencia", label: "Producción de referencia" },
  { value: "Otros", label: "Otros" },
];

const TECHNICAL_APPLICATION_OPTIONS = [
  { value: "Alimentos", label: "Alimentos" },
  { value: "Bebidas", label: "Bebidas" },
  { value: "Químicos", label: "Químicos" },
  { value: "Agrícola", label: "Agrícola" },
  { value: "Industrial", label: "Industrial" },
  { value: "Otros", label: "Otros" },
];

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

  // Quotation is enabled only if product has been exported for quote (quoteRequestedAt is set)
  const isQuotationEnabled = !!(
    initialData?.quoteRequestedAt ||
    initialData?.status === "En Cotización" ||
    initialData?.status === "Cotizado" ||
    initialData?.status === "Aprobado por Cliente"
  );

  const inheritedProjectName =
    initialData?.name ||
    initialData?.productName ||
    project?.projectName ||
    (project as any)?.projectNameLabel ||
    "Producto preliminar";

  const inheritedCustomerPackingCode =
    initialData?.customerPackingCode ||
    project?.customerPackingCode ||
    "";

  const [form, setForm] = useState<FormData>({
    // Info básica
    name: inheritedProjectName,
    productName: inheritedProjectName,
    description: initialData?.description || initialData?.productDescription || "",
    productDescription: initialData?.productDescription || initialData?.description || "",
    customerPackingCode: inheritedCustomerPackingCode,

    // Requerimientos
    requiresDesign: initialData?.requiresDesign || false,
    requiresSample: initialData?.requiresSample || false,

    // Objetivo de color
    colorObjective: initialData?.colorObjective || initialData?.objetivoColor || [],
    colorObjectiveComment: initialData?.colorObjectiveComment || initialData?.comentarioObjetivoColor || "",

    // Campos de producto
    technicalApplication: initialData?.technicalApplication || initialData?.aplicacionTecnica || project?.technicalApplication || "",
    peruvianProductLogo: initialData?.peruvianProductLogo || initialData?.logoProductoPeruano || "No",
    printingFooter: initialData?.printingFooter || initialData?.pieImprenta || "Sí",

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

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: inheritedProjectName,
      productName: inheritedProjectName,
      customerPackingCode: inheritedCustomerPackingCode,
    }));
  }, [inheritedProjectName, inheritedCustomerPackingCode]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorObjectiveChange = (value: string) => {
    setForm((prev) => {
      const current = Array.isArray(prev.colorObjective) ? prev.colorObjective : [];
      const alreadySelected = current.includes(value);

      let nextValues = alreadySelected
        ? current.filter((item) => item !== value)
        : [...current, value];

      if (value === "No existe" && !alreadySelected) {
        nextValues = ["No existe"];
      }

      if (value !== "No existe") {
        nextValues = nextValues.filter((item) => item !== "No existe");
      }

      return {
        ...prev,
        colorObjective: nextValues,
        colorObjectiveComment: nextValues.includes("Otros") ? prev.colorObjectiveComment : "",
      };
    });
  };

  const isNoColorObjectiveSelected =
    Array.isArray(form.colorObjective) && form.colorObjective.includes("No existe");

  const hasAnyColorObjectiveSelected =
    Array.isArray(form.colorObjective) &&
    form.colorObjective.some((item) => item !== "No existe");

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

    // Validaciones de Cotización (solo si está habilitada)
    if (isQuotationEnabled) {
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
    }

    // Validaciones de Objetivo de Color
    if (!Array.isArray(form.colorObjective) || form.colorObjective.length === 0) {
      errs.colorObjective = "Selecciona el objetivo de color.";
    }

    if (
      Array.isArray(form.colorObjective) &&
      form.colorObjective.includes("Otros") &&
      !String(form.colorObjectiveComment || "").trim()
    ) {
      errs.colorObjectiveComment = "Comenta cuál es el objetivo de color cuando seleccionas Otros.";
    }

    if (
      Array.isArray(form.colorObjective) &&
      form.colorObjective.includes("No existe") &&
      form.colorObjective.length > 1
    ) {
      errs.colorObjective = "No existe no puede combinarse con otros objetivos de color.";
    }

    // Validaciones de campos de producto
    if (!form.technicalApplication?.trim()) {
      errs.technicalApplication = "Selecciona la aplicación técnica.";
    }

    if (!form.peruvianProductLogo) {
      errs.peruvianProductLogo = 'Selecciona si aplica Logo "Producto Peruano".';
    }

    if (!form.printingFooter) {
      errs.printingFooter = "Selecciona si aplica Pie de Imprenta.";
    }

    return errs;
  }, [form, isQuotationEnabled]);

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

          // Objetivo de color
          colorObjective: form.colorObjective || [],
          objetivoColor: form.colorObjective || [],
          colorObjectiveComment: form.colorObjectiveComment || "",
          comentarioObjetivoColor: form.colorObjectiveComment || "",

          // Campos de producto
          technicalApplication: form.technicalApplication || "",
          aplicacionTecnica: form.technicalApplication || "",
          peruvianProductLogo: form.peruvianProductLogo || "No",
          logoProductoPeruano: form.peruvianProductLogo || "No",
          printingFooter: form.printingFooter || "Sí",
          pieImprenta: form.printingFooter || "Sí",

          // Dimensiones
          width: form.width ? Number(form.width) : undefined,
          length: form.length ? Number(form.length) : undefined,
          gusset: form.gusset != null ? Number(form.gusset) : undefined,
          estimatedVolume: form.estimatedVolume ? Number(form.estimatedVolume) : undefined,
          unitOfMeasure: form.unitOfMeasure || "",

          // Cotización (solo si está habilitada)
          saleScope: isQuotationEnabled ? (form.saleScope || "Nacional") : "Nacional",
          incoterm: isQuotationEnabled ? (form.incoterm || "") : "",
          destinationCountry: isQuotationEnabled ? (form.destinationCountry || "") : "",
          currencyType: isQuotationEnabled ? (form.currencyType || "") : "",
          targetPriceMin: isQuotationEnabled && form.targetPriceMin ? Number(form.targetPriceMin) : undefined,
          targetPriceMax: isQuotationEnabled && form.targetPriceMax ? Number(form.targetPriceMax) : undefined,
          commercialComments: isQuotationEnabled ? (form.commercialComments || "") : "",
          commercialFinanceComment: isQuotationEnabled ? (form.commercialComments || "") : "",

          updatedAt: new Date().toISOString(),
        };

        // NO incluir campos técnicos: structureType, blueprintFormat, printType, layer*, grammage, etc.
        saved = saveProjectProduct(toSave);
      } else if (baseProductId) {
        // Creación desde producto aprobado
        saved = createProjectProductFromApprovedProduct(projectCode, baseProductId, form);
      } else {
        // Creación desde proyecto: asegurar que cotización está vacía
        const creationForm: FormData = {
          ...form,
          saleScope: "Nacional",
          incoterm: "",
          destinationCountry: "",
          currencyType: "",
          targetPriceMin: undefined,
          targetPriceMax: undefined,
          commercialComments: "",
        };
        saved = createProjectProductFromProject(projectCode, creationForm);
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

            <FormSelect
              label="Aplicación Técnica *"
              value={form.technicalApplication || ""}
              onChange={(value) => updateField("technicalApplication", value)}
              error={errors.technicalApplication}
              options={TECHNICAL_APPLICATION_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              placeholder="-- Seleccione --"
            />

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

            {/* Objetivo de color */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Objetivo de color *
              </label>
              <div className="space-y-2">
                {COLOR_OBJECTIVE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Array.isArray(form.colorObjective) && form.colorObjective.includes(option.value)}
                      onChange={() => handleColorObjectiveChange(option.value)}
                      disabled={
                        isNoColorObjectiveSelected && option.value !== "No existe"
                          ? true
                          : hasAnyColorObjectiveSelected && option.value === "No existe"
                          ? true
                          : false
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.colorObjective && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.colorObjective}
                </p>
              )}
            </div>

            {/* Comentario de objetivo de color - solo si está seleccionado "Otros" */}
            {Array.isArray(form.colorObjective) && form.colorObjective.includes("Otros") && (
              <FormTextarea
                label="Comentario de objetivo de color *"
                value={form.colorObjectiveComment || ""}
                onChange={(value) => updateField("colorObjectiveComment", value)}
                placeholder="Describe cuál es el objetivo de color que necesitas"
                rows={3}
                error={errors.colorObjectiveComment}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label='Logo "Producto Peruano" *'
                value={form.peruvianProductLogo || "No"}
                onChange={(value) => updateField("peruvianProductLogo", value as "Sí" | "No")}
                error={errors.peruvianProductLogo}
                options={[
                  { value: "Sí", label: "Sí" },
                  { value: "No", label: "No" },
                ]}
              />

              <FormSelect
                label="Pie de Imprenta *"
                value={form.printingFooter || "Sí"}
                onChange={(value) => updateField("printingFooter", value as "Sí" | "No")}
                error={errors.printingFooter}
                options={[
                  { value: "Sí", label: "Sí" },
                  { value: "No", label: "No" },
                ]}
              />
            </div>
          </fieldset>

          {/* SECCIÓN 2: DIMENSIONES Y VOLUMEN */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              2. Dimensiones y Volumen
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

              <FormSelect
                label="Unidad de Medida *"
                value={form.unitOfMeasure || ""}
                onChange={(value) => updateField("unitOfMeasure", value)}
                error={errors.unitOfMeasure}
                options={[
                  { value: "", label: "Seleccionar unidad" },
                  ...UNITS_OF_MEASURE.map((unit) => ({
                    value: unit,
                    label: unit === "g" ? "Gramos (g)" :
                           unit === "kg" ? "Kilogramos (kg)" :
                           unit === "ml" ? "Mililitros (ml)" :
                           unit === "L" ? "Litros (L)" :
                           unit === "un" ? "Unidades (un)" :
                           unit === "m" ? "Metros (m)" :
                           unit === "cm" ? "Centímetros (cm)" :
                           unit === "mm" ? "Milímetros (mm)" :
                           unit,
                  })),
                ]}
              />
            </div>
          </fieldset>

          {/* SECCIÓN 3: COTIZACIÓN */}
          <fieldset className="space-y-4 pb-6 border-b border-slate-200">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              3. Cotización
            </legend>

            {!isQuotationEnabled && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                La cotización se habilitará cuando este producto sea exportado para cotizar.
              </div>
            )}

            {isQuotationEnabled && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Producto exportado para cotización. Commercial Finance puede completar moneda, precios y comentarios.
              </div>
            )}

            <FormSelect
              label="Moneda"
              value={form.currencyType || ""}
              onChange={(value) => isQuotationEnabled && updateField("currencyType", value)}
              error={errors.currencyType}
              disabled={!isQuotationEnabled}
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
                onChange={(value) => isQuotationEnabled && updateField("targetPriceMin", value ? Number(value) : undefined)}
                disabled={!isQuotationEnabled}
                placeholder="Ej. 0.50"
              />

              <FormInput
                label="Precio Máximo"
                type="number"
                value={String(form.targetPriceMax ?? "")}
                onChange={(value) => isQuotationEnabled && updateField("targetPriceMax", value ? Number(value) : undefined)}
                error={errors.targetPrice}
                disabled={!isQuotationEnabled}
                placeholder="Ej. 1.00"
              />
            </div>

            <FormTextarea
              label="Comentario Commercial Finance"
              value={form.commercialComments || ""}
              onChange={(value) => isQuotationEnabled && updateField("commercialComments", value)}
              disabled={!isQuotationEnabled}
              placeholder="Notas para el equipo de finanzas"
              rows={3}
            />
          </fieldset>

          {/* SECCIÓN 4: RESUMEN TÉCNICO HEREDADO (SOLO LECTURA) */}
          <fieldset className="space-y-4 pb-6">
            <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              4. Resumen técnico heredado (Solo lectura)
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
