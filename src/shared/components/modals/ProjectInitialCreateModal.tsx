import { useState, useMemo, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
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

    const project = createProjectFromPortfolio({
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
      },
      createdBy: currentUser?.id,
    });

    onClose();
    navigate(`/projects/${project.code}/edit`);
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
                    label="Portafolio Base"
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

              {portfolioCode && (
                <FormSelect
                  label="Clasificación"
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
                label="Complejidad"
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
                  <div className="relative">
                    <label className="block mb-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                      Cód Producto aprobado *
                    </label>
                    <input
                      type="text"
                      value={approvedProductQuery}
                      onChange={(e) => {
                        setApprovedProductQuery(e.target.value);
                        setShowApprovedProductDropdown(true);
                        setErrors((prev) => ({ ...prev, approvedProductCode: "" }));
                      }}
                      onFocus={() => setShowApprovedProductDropdown(true)}
                      onBlur={() => setTimeout(() => setShowApprovedProductDropdown(false), 200)}
                      placeholder="Buscar por SKU, producto, cliente o formato..."
                      className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
                        errors.approvedProductCode
                          ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-slate-300 bg-white focus:ring-2 focus:border-slate-500 focus:ring-slate-200"
                      }`}
                    />
                    {selectedApprovedProduct && (
                      <button
                        onClick={() => {
                          setSelectedApprovedProduct(null);
                          setApprovedProductQuery("");
                          setMotivoModificacion("");
                          setShowApprovedProductDropdown(false);
                        }}
                        className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                    {showApprovedProductDropdown && approvedProductResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {approvedProductResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setSelectedApprovedProduct(product);
                              setApprovedProductQuery(
                                `${product.sku} - ${product.productName} - ${product.version}`
                              );
                              setShowApprovedProductDropdown(false);
                              setErrors((prev) => ({
                                ...prev,
                                approvedProductCode: "",
                              }));
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-100 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="text-sm font-semibold text-slate-900">
                              {product.sku} · {product.version}
                            </div>
                            <div className="text-sm text-slate-700">{product.productName}</div>
                            <div className="text-xs text-slate-500">
                              {product.clientName} · {product.envoltura} · {product.formatoPlano}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.approvedProductCode && (
                      <span className="mt-1 block text-xs font-normal text-red-600">
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
                label="Motivo"
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
                    label="Licitación"
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
          <Button variant="primary" onClick={handleCreate} disabled={!portfolio}>
            Crear Proyecto
          </Button>
        </div>
      </div>
    </div>
  );
}
