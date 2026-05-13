import { useState, useMemo, useEffect } from "react";
import { X, ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import FormSelect from "../forms/FormSelect";
import FormInput from "../forms/FormInput";
import PortfolioSearch from "../forms/PortfolioSearch";
import PreviewRow from "../display/PreviewRow";
import { getPortfolioByCode } from "../../data/portfolioStorage";
import { createProjectFromPortfolio } from "../../data/projectStorage";
import { getCurrentUser } from "../../data/userStorage";
import {
  searchApprovedProducts,
  type ApprovedProductRecord,
} from "../../data/approvedProductStorage";

interface ProjectInitialCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPortfolioCode?: string;
}

const CLASSIFICATION_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Modificado", label: "Modificado" },
];

const COMPLEJIDAD_OPTIONS = [
  { value: "ALTA", label: "ALTA" },
  { value: "BAJA", label: "BAJA" },
];

const TIPO_PROYECTO_ALTA_OPTIONS = [
  { value: "Producto nuevo", label: "Producto nuevo" },
  { value: "Nuevo equipamiento de envasado", label: "Nuevo equipamiento de envasado" },
  { value: "Nuevos insumos", label: "Nuevos insumos" },
  { value: "Nueva estructura", label: "Nueva estructura" },
  { value: "Nuevo formato de envasado", label: "Nuevo formato de envasado" },
  { value: "Nuevos accesorios", label: "Nuevos accesorios" },
  { value: "Nuevos procesos por el lado del cliente", label: "Nuevos procesos por el lado del cliente" },
  { value: "Nuevas temperaturas de envasado y almacenaje", label: "Nuevas temperaturas de envasado y almacenaje" },
];

const TIPO_PROYECTO_BAJA_OPTIONS = [
  { value: "Extensión de línea por familia (EM de referencia)", label: "Extensión de línea por familia (EM de referencia)" },
  { value: "Modifica Dimensiones", label: "Modifica Dimensiones" },
  { value: "Modifica Propiedades", label: "Modifica Propiedades" },
  { value: "Portafolio Estándar", label: "Portafolio Estándar" },
  { value: "ICO (Intercompany), BCP (Business Continous Production)", label: "ICO (Intercompany), BCP (Business Continous Production)" },
];

const MODIFICATION_REASON_OPTIONS = [
  { value: "Diseño y Dimensiones", label: "Diseño y Dimensiones" },
  { value: "Estructura", label: "Estructura" },
  { value: "Diseño y Estructura", label: "Diseño y Estructura" },
];

export default function ProjectInitialCreateModal({
  isOpen,
  onClose,
  initialPortfolioCode,
}: ProjectInitialCreateModalProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [portfolioCode, setPortfolioCode] = useState(initialPortfolioCode || "");
  const [clasificacion, setClasificacion] = useState("");
  const [complejidad, setComplejidad] = useState<"ALTA" | "BAJA" | "">("");
  const [tipoProyecto, setTipoProyecto] = useState("");
  const [approvedProductQuery, setApprovedProductQuery] = useState("");
  const [selectedApprovedProduct, setSelectedApprovedProduct] = useState<ApprovedProductRecord | null>(null);
  const [motivoModificacion, setMotivoModificacion] = useState("");
  const [licitacion, setLicitacion] = useState<"Sí" | "No">("No");
  const [numeroItemsLicitacion, setNumeroItemsLicitacion] = useState("");
  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showApprovedProductDropdown, setShowApprovedProductDropdown] = useState(false);

  const portfolio = useMemo(() => {
    return portfolioCode ? getPortfolioByCode(portfolioCode) : null;
  }, [portfolioCode]);

  useEffect(() => {
    if (isOpen) {
      setPortfolioCode(initialPortfolioCode || "");
      setClasificacion("");
      setComplejidad("");
      setTipoProyecto("");
      setApprovedProductQuery("");
      setSelectedApprovedProduct(null);
      setMotivoModificacion("");
      setLicitacion("No");
      setNumeroItemsLicitacion("");
      setProjectName("");
      setErrors({});
      setShowApprovedProductDropdown(false);
    }
  }, [isOpen, initialPortfolioCode]);

  // Si cambia la clasificación, se resetea el tipo de proyecto y campos dependientes
  useEffect(() => {
  setComplejidad("");
  setTipoProyecto("");
  setApprovedProductQuery("");
  setSelectedApprovedProduct(null);
  setMotivoModificacion("");
  setLicitacion("No");
  setNumeroItemsLicitacion("");
  setShowApprovedProductDropdown(false);
}, [clasificacion]);

useEffect(() => {
  setTipoProyecto("");
}, [complejidad]);

useEffect(() => {
  if (clasificacion !== "Modificado") {
    setApprovedProductQuery("");
    setSelectedApprovedProduct(null);
    setMotivoModificacion("");
    return;
  }

  if (!selectedApprovedProduct) {
    setMotivoModificacion("");
  }
}, [clasificacion, selectedApprovedProduct]);

  if (!isOpen) return null;

  const approvedProductResults =
    clasificacion === "Modificado" && approvedProductQuery.trim()
      ? searchApprovedProducts(approvedProductQuery)
      : [];

  const shouldShowModificationReason =
    clasificacion === "Modificado" && selectedApprovedProduct !== null;

  const tipoProyectoOptions =
  complejidad === "ALTA"
    ? TIPO_PROYECTO_ALTA_OPTIONS
    : complejidad === "BAJA"
    ? TIPO_PROYECTO_BAJA_OPTIONS
    : [];

  const handleCreate = () => {
    const newErrors: Record<string, string> = {};
    const normalizedProjectName = projectName.trim();

    if (!normalizedProjectName) {
      newErrors.projectName = "Ingresa el nombre del proyecto.";
    }

    if (!portfolioCode || !portfolio) {
      newErrors.portfolioCode = "Selecciona un portafolio base.";
    }

    if (!clasificacion) {
      newErrors.clasificacion = "Selecciona la clasificación del proyecto.";
    }

    if (clasificacion === "Nuevo" && !complejidad) {
      newErrors.complejidad = "Selecciona la complejidad del proyecto.";
    }

    if (clasificacion === "Nuevo" && !tipoProyecto) {
      newErrors.tipoProyecto = "Selecciona el tipo de proyecto.";
    }

    if (clasificacion === "Nuevo" && !licitacion) {
      newErrors.licitacion = "Indica si el proyecto corresponde a licitación.";
    }

    if (clasificacion === "Nuevo" && licitacion === "Sí" && (!numeroItemsLicitacion || Number(numeroItemsLicitacion) <= 0)) {
      newErrors.numeroItemsLicitacion = "Ingresa un número válido de ítems.";
    }

    if (clasificacion === "Modificado" && !selectedApprovedProduct) {
      newErrors.approvedProductCode = "Selecciona un producto aprobado.";
    }

    if (
      clasificacion === "Modificado" &&
      selectedApprovedProduct &&
      !motivoModificacion
    ) {
      newErrors.motivoModificacion = "Selecciona el motivo de modificación.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const createdProject = createProjectFromPortfolio({
      portfolio: portfolio!,
      initialData: {
        clasificacion,
        complejidad: clasificacion === "Nuevo" ? complejidad : "",
        tipoProyecto: clasificacion === "Nuevo" ? tipoProyecto : "",
        approvedProductId: selectedApprovedProduct?.id || "",
        approvedProductCode: selectedApprovedProduct?.sku || "",
        approvedProductSku: selectedApprovedProduct?.sku || "",
        approvedProductVersion: selectedApprovedProduct?.version || "",
        approvedProductName: selectedApprovedProduct?.productName || "",
        approvedProductSnapshot:
          clasificacion === "Modificado" && selectedApprovedProduct
            ? selectedApprovedProduct
            : null,
        motivoModificacion:
          clasificacion === "Modificado" && selectedApprovedProduct
            ? motivoModificacion
            : "",
        licitacion: clasificacion === "Nuevo" ? licitacion : "No",
        numeroItemsLicitacion: clasificacion === "Nuevo" && licitacion === "Sí" ? Number(numeroItemsLicitacion) : null,
        projectName: normalizedProjectName,
      },
      createdBy: currentUser?.id,
    });

    // Save "Nuevo" badge indicator to localStorage
    const RECENT_NEW_PROJECT_KEY = "odiseo_recent_new_project";
    localStorage.setItem(RECENT_NEW_PROJECT_KEY, JSON.stringify({
      projectId: createdProject.code || createdProject.id,
      expiresAt: Date.now() + 25000,
    }));

    // Dispara custom event para notificar que se creó un nuevo proyecto
    window.dispatchEvent(new CustomEvent("newProjectCreated", {
      detail: { projectId: createdProject.code || createdProject.id }
    }));

    onClose();
    navigate("/projects");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Crear Proyecto</h3>
            <p className="text-sm text-slate-500">
              Completa la información inicial para registrar el proyecto.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Lado izquierdo: Formulario */}
            <div className="space-y-5">
              {!initialPortfolioCode && (
                <div className="space-y-1">
                  <PortfolioSearch
                    label="Portafolio Base *"
                    value={portfolioCode}
                    onChange={(val) => {
                      setPortfolioCode(val);
                      setErrors((prev) => ({ ...prev, portfolioCode: "" }));
                    }}
                    error={errors.portfolioCode}
                  />
                  {!portfolioCode && (
                    <p className="text-xs text-slate-500">
                      Busca un portafolio para heredar sus datos y crear el proyecto.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Nombre del Proyecto *
                </label>

                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => {
                    setProjectName(event.target.value);
                    setErrors((prev) => ({ ...prev, projectName: "" }));
                  }}
                  placeholder="Ej. Doypack Mayonesa 250 ml"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />

                {errors.projectName && (
                  <span className="block mt-1 text-xs font-normal text-red-600">
                    {errors.projectName}
                  </span>
                )}
              </div>

              {portfolioCode && (
                <FormSelect
                  label="Clasificación *"
                  value={clasificacion}
                  onChange={(val) => {
                    setClasificacion(val);
                    setErrors((prev) => ({ ...prev, clasificacion: "" }));
                  }}
                  options={CLASSIFICATION_OPTIONS}
                  error={errors.clasificacion}
                  placeholder="-- Seleccione --"
                  disabled={!portfolioCode}
                />
              )}
              {clasificacion === "Nuevo" && (
              <FormSelect
                label="Complejidad *"
                value={complejidad}
                onChange={(val) => {
                  setComplejidad(val as "ALTA" | "BAJA");
                  setErrors((prev) => ({ ...prev, complejidad: "" }));
                }}
                options={COMPLEJIDAD_OPTIONS}
                error={errors.complejidad}
                placeholder="-- Seleccione --"
                disabled={!portfolioCode}
              />
            )}

              {clasificacion === "Modificado" && (
                <>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Producto Aprobado (SKU) *
                    </label>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={selectedApprovedProduct ? `${selectedApprovedProduct.sku} · ${selectedApprovedProduct.version} · ${selectedApprovedProduct.productName}` : approvedProductQuery}
                        onChange={(e) => {
                          setApprovedProductQuery(e.target.value);
                          setSelectedApprovedProduct(null);
                          setMotivoModificacion("");
                          setShowApprovedProductDropdown(true);
                          setErrors((prev) => ({ ...prev, approvedProductCode: "" }));
                        }}
                        onFocus={() => {
                          if (!selectedApprovedProduct) {
                            setShowApprovedProductDropdown(true);
                          }
                        }}
                        onBlur={() => setTimeout(() => setShowApprovedProductDropdown(false), 200)}
                        placeholder="Buscar por SKU, producto, cliente o formato..."
                        className={[
                          "h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm transition-all",
                          "placeholder:text-slate-400",
                          "focus:border-[#004B6E] focus:outline-none focus:ring-4 focus:ring-[#004B6E]/10",
                          errors.approvedProductCode
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300 hover:border-slate-400",
                        ].join(" ")}
                      />

                      {(approvedProductQuery || selectedApprovedProduct) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApprovedProduct(null);
                            setApprovedProductQuery("");
                            setMotivoModificacion("");
                            setShowApprovedProductDropdown(false);
                            setErrors((prev) => ({ ...prev, approvedProductCode: "" }));
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          aria-label="Limpiar producto aprobado"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {!selectedApprovedProduct && (
                      <p className="text-xs text-slate-500">
                        Busca y selecciona el SKU aprobado que servirá como base para el proyecto modificado.
                      </p>
                    )}

                    {showApprovedProductDropdown && approvedProductQuery && approvedProductResults.length > 0 && (
                      <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                        {approvedProductResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedApprovedProduct(product);
                              setApprovedProductQuery("");
                              setShowApprovedProductDropdown(false);
                              setErrors((prev) => ({
                                ...prev,
                                approvedProductCode: "",
                              }));
                            }}
                            className="w-full border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-sky-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {product.sku} · {product.version}
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-slate-700">
                                  {product.productName}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {product.clientName}
                                </p>
                              </div>

                              <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-[#004B6E]">
                                {product.envoltura}
                              </span>
                            </div>

                            <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                              {product.formatoPlano}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                    {showApprovedProductDropdown && approvedProductQuery && approvedProductResults.length === 0 && (
                      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        No se encontraron productos aprobados con ese criterio.
                      </div>
                    )}

                    {selectedApprovedProduct && (
                      <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/60 p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#004B6E]">
                          Producto aprobado seleccionado
                        </p>

                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                          <div>
                            <span className="font-semibold text-slate-500">SKU</span>
                            <p className="font-bold text-slate-900">{selectedApprovedProduct.sku}</p>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-500">Versión</span>
                            <p className="font-bold text-slate-900">{selectedApprovedProduct.version}</p>
                          </div>

                          <div className="col-span-2">
                            <span className="font-semibold text-slate-500">Producto</span>
                            <p className="font-bold text-slate-900">{selectedApprovedProduct.productName}</p>
                          </div>

                          <div className="col-span-2">
                            <span className="font-semibold text-slate-500">Cliente</span>
                            <p className="font-medium text-slate-800">{selectedApprovedProduct.clientName}</p>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-500">Envoltura</span>
                            <p className="font-medium text-slate-800">{selectedApprovedProduct.envoltura}</p>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-500">Formato</span>
                            <p className="font-medium text-slate-800">{selectedApprovedProduct.formatoPlano}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {errors.approvedProductCode && (
                      <span className="block text-xs font-normal text-red-600">
                        {errors.approvedProductCode}
                      </span>
                    )}
                  </div>

                  {shouldShowModificationReason && (
                    <FormSelect
                      label="Motivo *"
                      value={motivoModificacion}
                      onChange={(val) => {
                        setMotivoModificacion(val);
                        setErrors((prev) => ({ ...prev, motivoModificacion: "" }));
                      }}
                      options={MODIFICATION_REASON_OPTIONS}
                      error={errors.motivoModificacion}
                      placeholder="-- Seleccione --"
                      disabled={!portfolioCode}
                    />
                  )}
                </>
              )}

              {clasificacion === "Nuevo" && complejidad && (
              <FormSelect
                label="Motivo *"
                value={tipoProyecto}
                onChange={(val) => {
                  setTipoProyecto(val);
                  setErrors((prev) => ({ ...prev, tipoProyecto: "" }));
                }}
                options={tipoProyectoOptions}
                error={errors.tipoProyecto}
                placeholder="-- Seleccione --"
                disabled={!complejidad}
              />
            )}

              {clasificacion === "Nuevo" && (
                <>
                  <FormSelect
                    label="Licitación *"
                    value={licitacion}
                    onChange={(val) => {
                      setLicitacion(val as "Sí" | "No");
                      if (val === "No") setNumeroItemsLicitacion("");
                      setErrors((prev) => ({ ...prev, licitacion: "", numeroItemsLicitacion: "" }));
                    }}
                    options={[
                      { value: "Sí", label: "Sí" },
                      { value: "No", label: "No" },
                    ]}
                    error={errors.licitacion}
                    disabled={!portfolioCode}
                  />

                  {licitacion === "Sí" && (
                    <FormInput
                      label="N° de ítems *"
                      type="number"
                      value={numeroItemsLicitacion}
                      onChange={(val) => {
                        const numericVal = val.replace(/[^\d]/g, "");
                        setNumeroItemsLicitacion(numericVal);
                        setErrors((prev) => ({ ...prev, numeroItemsLicitacion: "" }));
                      }}
                      error={errors.numeroItemsLicitacion}
                      placeholder="Ej: 5, 10, 15..."
                    />
                  )}
                </>
              )}
            </div>

            {/* Lado derecho: Herencia */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
              <h4 className="mb-4 font-bold text-brand-primary border-b border-brand-primary/10 pb-2">
                Herencia del portafolio
              </h4>
              
              {portfolio ? (
                <div className="space-y-3">
                  <PreviewRow label="Portafolio" value={portfolio.nom || portfolio.id} />
                  <PreviewRow label="Cliente" value={portfolio.cli || portfolio.clientName || "—"} />
                  <PreviewRow label="Planta" value={portfolio.pl || portfolio.plantaName || "—"} />
                  <PreviewRow label="Envoltura" value={portfolio.env || portfolio.envoltura || "—"} />
                  <PreviewRow label="Uso Final" value={portfolio.uf || portfolio.usoFinal || "—"} />
                  <PreviewRow label="Segmento" value={portfolio.seg || portfolio.segmento || "—"} />
                  <PreviewRow label="Sub-segmento" value={portfolio.subseg || portfolio.subSegmento || "—"} />
                  <PreviewRow label="Sector" value={portfolio.sector || "—"} />
                  <PreviewRow label="AFMarketID" value={portfolio.af || portfolio.afMarketId || "—"} />
                  <PreviewRow label="Máquina / Envasado" value={portfolio.maq || portfolio.maquinaCliente || "—"} />
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-slate-500">
                  <p>Aún no has seleccionado un portafolio base.</p>
                  <p className="mt-1">Selecciona uno para ver los datos que heredará el proyecto.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={!portfolio || !projectName.trim()}>
            Crear Proyecto
          </Button>
        </div>
      </div>
    </div>
  );
}
