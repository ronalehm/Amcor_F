import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import FormSelect from "../forms/FormSelect";
import FormInput from "../forms/FormInput";
import PortfolioSearch from "../forms/PortfolioSearch";
import PreviewRow from "../display/PreviewRow";
import { getPortfolioByCode } from "../../data/portfolioStorage";
import { createProjectFromPortfolio } from "../../data/projectStorage";
import { getCurrentUser } from "../../data/userStorage";

interface ProjectInitialCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPortfolioCode?: string;
}

const CLASSIFICATION_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Modificado", label: "Modificado" },
];

const TIPO_NUEVO_OPTIONS = [
  { value: "Producto nuevo", label: "Producto nuevo" },
  { value: "Nuevo equipamiento de envasado", label: "Nuevo equipamiento de envasado" },
  { value: "Nuevos insumos", label: "Nuevos insumos" },
  { value: "Nueva estructura", label: "Nueva estructura" },
  { value: "Nuevo formato de envasado", label: "Nuevo formato de envasado" },
  { value: "Nuevos accesorios", label: "Nuevos accesorios" },
  { value: "Nuevos procesos por el lado del cliente", label: "Nuevos procesos por el lado del cliente" },
  { value: "Nuevas temperaturas de envasado y almacenaje", label: "Nuevas temperaturas de envasado y almacenaje" },
];

const TIPO_MODIFICADO_OPTIONS = [
  { value: "Extensión de línea por familia (EM de referencia)", label: "Extensión de línea por familia (EM de referencia)" },
  { value: "Modifica Dimensiones", label: "Modifica Dimensiones" },
  { value: "Modifica Propiedades", label: "Modifica Propiedades" },
  { value: "Portafolio Estándar", label: "Portafolio Estándar" },
  { value: "ICO (Intercompany), BCP (Business Continous Production)", label: "ICO (Intercompany), BCP (Business Continous Production)" },
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
  const [tipoProyecto, setTipoProyecto] = useState("");
  const [licitacion, setLicitacion] = useState<"Sí" | "No">("No");
  const [codigoLicitacion, setCodigoLicitacion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const portfolio = useMemo(() => {
    return portfolioCode ? getPortfolioByCode(portfolioCode) : null;
  }, [portfolioCode]);

  useEffect(() => {
    if (isOpen) {
      setPortfolioCode(initialPortfolioCode || "");
      setClasificacion("");
      setTipoProyecto("");
      setLicitacion("No");
      setCodigoLicitacion("");
      setErrors({});
    }
  }, [isOpen, initialPortfolioCode]);

  // Si cambia la clasificación, se resetea el tipo de proyecto
  useEffect(() => {
    setTipoProyecto("");
  }, [clasificacion]);

  if (!isOpen) return null;

  const tipoProyectoOptions =
    clasificacion === "Nuevo"
      ? TIPO_NUEVO_OPTIONS
      : clasificacion === "Modificado"
      ? TIPO_MODIFICADO_OPTIONS
      : [];

  const handleCreate = () => {
    const newErrors: Record<string, string> = {};

    if (!portfolioCode || !portfolio) {
      newErrors.portfolioCode = "Selecciona un portafolio base.";
    }

    if (!clasificacion) {
      newErrors.clasificacion = "Selecciona la clasificación del proyecto.";
    }

    if (!tipoProyecto) {
      newErrors.tipoProyecto = "Selecciona el tipo de proyecto.";
    }

    if (!licitacion) {
      newErrors.licitacion = "Indica si corresponde a licitación.";
    }

    if (licitacion === "Sí" && !codigoLicitacion.trim()) {
      newErrors.codigoLicitacion = "Ingresa el código de licitación.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const project = createProjectFromPortfolio({
      portfolio: portfolio!,
      initialData: {
        clasificacion,
        tipoProyecto,
        licitacion,
        codigoLicitacion,
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

              <FormSelect
                label="Tipo de Proyecto *"
                value={tipoProyecto}
                onChange={(val) => {
                  setTipoProyecto(val);
                  setErrors((prev) => ({ ...prev, tipoProyecto: "" }));
                }}
                options={tipoProyectoOptions}
                error={errors.tipoProyecto}
                placeholder={clasificacion ? "-- Seleccione --" : "Primero seleccione clasificación"}
                disabled={!clasificacion || !portfolioCode}
              />

              <FormSelect
                label="Licitación *"
                value={licitacion}
                onChange={(val) => {
                  setLicitacion(val as "Sí" | "No");
                  if (val === "No") setCodigoLicitacion("");
                  setErrors((prev) => ({ ...prev, licitacion: "", codigoLicitacion: "" }));
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
                  label="Código de Licitación *"
                  value={codigoLicitacion}
                  onChange={(val) => {
                    setCodigoLicitacion(val);
                    setErrors((prev) => ({ ...prev, codigoLicitacion: "" }));
                  }}
                  error={errors.codigoLicitacion}
                  placeholder="Ingrese el código"
                />
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
