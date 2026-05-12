import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";

import {
  STATUS_CATALOG,
  PLANTS_CATALOG,
  WRAPPINGS_CATALOG,
  FINAL_USE_CATALOG,
  getStatusById,
  getPlantById,
  getWrappingById,
  getFinalUseById,
  getPackingMachineById,
  getPackingMachinesByWrappingId,
} from "../../../shared/data/mockDatabase";

import { getClientCatalogRecords, canClientHavePortfolio } from "../../../shared/data/clientStorage";
import { getCommercialExecutives } from "../../../shared/data/userStorage";
import { savePortfolioRecord } from "../../../shared/data/portfolioStorage";
import SmartCatalogSearch from "../../../shared/components/catalog/SmartCatalogSearch";
import FinalUseSelector from "../../../shared/components/catalog/FinalUseSelector";
import FinalUseCatalogModal from "../../../shared/components/catalog/FinalUseCatalogModal";
import PortfolioPreview from "../../../shared/components/ui/PortfolioPreview.tsx";
import SectionCard from "../../../shared/components/ui/SectionCard";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCard,
  FormActionButtons,
} from "../../../shared/components/forms/index.tsx";
import EnvolturaSelector from "../../../shared/components/forms/EnvolturaSelector";
import PlantSelector from "../../../shared/components/forms/PlantSelector";

type PortfolioFormData = {
  codigo: string;
  estadoId: string;
  clienteId: string;
  ejecutivoId: string;
  plantaId: string;
  licitacion: "Sí" | "No";
  codigoRFQ: string;
  nombrePortafolio: string;
  descripcionPortafolio: string;
  envolturaId: string;
  usoFinalId: string;
  envasadoId: string;
  portafolioEstandar: string;
};

const AMCOR = {
  navy: "#00395A",
  navyDark: "#002b43",
  blue: "#00A1DE",
  green: "#27ae60",
  purple: "#7E3FB2",
  amber: "#f39c12",
  border: "#dde3ea",
  bg: "#f6f8fb",
};

function getTemporaryPortfolioCode() {
  const saved = JSON.parse(
    localStorage.getItem("odiseo_created_portfolios") || "[]"
  );

  const savedNumbers = Array.isArray(saved)
    ? saved
      .map((item) => Number(String(item.id || "").replace("PO-", "")))
      .filter((number) => !Number.isNaN(number))
    : [];

  const maxNumber = Math.max(10, ...savedNumbers);

  return `PO-${String(maxNumber + 1).padStart(6, "0")}`;
}

const buildInitialForm = (): PortfolioFormData => ({
  codigo: getTemporaryPortfolioCode(),
  estadoId: String(STATUS_CATALOG[0].id),
  clienteId: "",
  ejecutivoId: "",
  plantaId: "",
  licitacion: "No",
  codigoRFQ: "",
  nombrePortafolio: "",
  descripcionPortafolio: "",
  envolturaId: "",
  usoFinalId: "",
  envasadoId: "",
  portafolioEstandar: "",
});

export default function PortfolioCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [form, setForm] = useState<PortfolioFormData>(buildInitialForm);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showFinalUseCatalog, setShowFinalUseCatalog] = useState(false);
  const [showTaxonomyDetail, setShowTaxonomyDetail] = useState(false);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof PortfolioFormData, boolean>>
  >({});

  const selectedStatus = getStatusById(Number(form.estadoId));
  const allClients = getClientCatalogRecords();
  const eligibleClients = allClients.filter((c) => canClientHavePortfolio(c.status));
  const selectedClient = allClients.find((c) => c.id === form.clienteId);
  const comercialUsers = getCommercialExecutives();
  const selectedExecutive = comercialUsers.find((u) => u.id === form.ejecutivoId);

  const selectedPlant = getPlantById(Number(form.plantaId));
  const selectedWrapping = getWrappingById(Number(form.envolturaId));
  const selectedFinalUse = getFinalUseById(Number(form.usoFinalId));
  const selectedPackingMachine = getPackingMachineById(Number(form.envasadoId));

  const packingMachines = useMemo(() => {
    if (!form.envolturaId) return [];
    return getPackingMachinesByWrappingId(Number(form.envolturaId));
  }, [form.envolturaId]);

  const requiredChecks = useMemo(() => {
    const checks: Array<{ field: string; label: string; completed: boolean }> = [
      { field: "clienteId", label: "Cliente", completed: Boolean(form.clienteId) },
      { field: "ejecutivoId", label: "Ejecutivo comercial", completed: Boolean(form.ejecutivoId) },
      { field: "plantaId", label: "Planta de origen", completed: Boolean(form.plantaId) },
      { field: "nombrePortafolio", label: "Nombre de portafolio", completed: Boolean(form.nombrePortafolio.trim()) },
      { field: "envolturaId", label: "Envoltura", completed: Boolean(form.envolturaId) },
      { field: "usoFinalId", label: "Uso final", completed: Boolean(form.usoFinalId) },
      { field: "envasadoId", label: "Envasado / Máquina de cliente", completed: Boolean(form.envasadoId) },
    ];

    if (form.licitacion === "Sí") {
      checks.splice(4, 0, {
        field: "codigoRFQ",
        label: "Código RFQ",
        completed: Boolean(form.codigoRFQ.trim()),
      });
    }

    return checks;
  }, [form]);

  const completionPercentage = useMemo(() => {
    const completed = requiredChecks.filter((item) => item.completed).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [requiredChecks]);

  const getSectionStatus = (sectionFields: string[]): "pending" | "completed" | "error" => {
    const allCompleted = sectionFields.every((field) => {
      if (field === "codigoRFQ" && form.licitacion === "No") return true;
      if (field === "clienteId") return Boolean(form.clienteId);
      if (field === "ejecutivoId") return Boolean(form.ejecutivoId);
      if (field === "plantaId") return Boolean(form.plantaId);
      if (field === "nombrePortafolio") return Boolean(form.nombrePortafolio.trim());
      if (field === "descripcionPortafolio") return true; // optional
      if (field === "licitacion") return true;
      if (field === "codigoRFQ") return Boolean(form.codigoRFQ.trim());
      if (field === "envolturaId") return Boolean(form.envolturaId);
      if (field === "usoFinalId") return Boolean(form.usoFinalId);
      if (field === "envasadoId") return Boolean(form.envasadoId);
      return false;
    });

    if (submitAttempted && !allCompleted) {
      const hasError = sectionFields.some(
        (field) =>
          validationErrors[field as keyof PortfolioFormData] &&
          !(field === "codigoRFQ" && form.licitacion === "No")
      );
      return hasError ? "error" : "pending";
    }

    return allCompleted ? "completed" : "pending";
  };

  // Update header dynamically
  useEffect(() => {
    setHeader({
      title: "Crear Portafolio",
      breadcrumbs: [{ label: "Portafolio", href: "/portfolio" }, { label: "Crear Portafolio" }],
      badges: <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">ID: {form.codigo}</span>,
      progress: {
        percentage: completionPercentage,
        label: `${completionPercentage}% completado`
      }
    });
    return () => resetHeader();
  }, [setHeader, resetHeader, form.codigo, completionPercentage]);

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<keyof PortfolioFormData, string>> = {};

    if (!form.clienteId) errors.clienteId = "Selecciona el nombre del cliente.";
    if (!form.ejecutivoId) errors.ejecutivoId = "Selecciona el ejecutivo comercial.";
    if (!form.plantaId) errors.plantaId = "Selecciona la planta de origen.";

    if (form.licitacion === "Sí" && !form.codigoRFQ.trim()) {
      errors.codigoRFQ = "Ingresa el código RFQ.";
    }

    if (!form.nombrePortafolio.trim()) {
      errors.nombrePortafolio = "Ingresa el nombre del portafolio.";
    }

    if (!form.envolturaId) errors.envolturaId = "Selecciona la envoltura.";
    if (!form.usoFinalId) errors.usoFinalId = "Selecciona el uso final.";
    if (!form.envasadoId) errors.envasadoId = "Ingresa la máquina del cliente.";

    return errors;
  }, [form]);

  const validationErrorList = Object.values(validationErrors).filter(
    (error): error is string => Boolean(error)
  );

  const updateField = (field: keyof PortfolioFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const markFieldAsTouched = (field: keyof PortfolioFormData) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const shouldShowFieldError = (field: keyof PortfolioFormData) => {
    return Boolean(
      validationErrors[field] && (submitAttempted || touchedFields[field])
    );
  };

  const getEnvolturaOption = (id: string): "LAMINA" | "BOLSA" | "POUCH" | "" => {
    if (!id) return "";
    const wrapping = getWrappingById(Number(id));
    if (!wrapping) return "";

    const name = wrapping.name.toLowerCase();
    if (name.includes("lámina")) return "LAMINA";
    if (name.includes("bolsa")) return "BOLSA";
    if (name.includes("pouch")) return "POUCH";
    return "";
  };

  const getIdFromEnvolturaOption = (option: "LAMINA" | "BOLSA" | "POUCH"): string => {
    const wrapping = WRAPPINGS_CATALOG.find((w) => {
      const name = w.name.toLowerCase();
      if (option === "LAMINA" && name.includes("lámina")) return true;
      if (option === "BOLSA" && name.includes("bolsa")) return true;
      if (option === "POUCH" && name.includes("pouch")) return true;
      return false;
    });
    return wrapping ? String(wrapping.id) : "";
  };

  const getPlantOption = (id: string): "AF_LIMA" | "AF_CALI" | "AF_SANTIAGO" | "AF_SAN_LUIS" | "" => {
    if (!id) return "";
    const plant = getPlantById(Number(id));
    if (!plant) return "";

    const code = plant.code.toLowerCase();
    if (code.includes("lim")) return "AF_LIMA";
    if (code.includes("cal")) return "AF_CALI";
    if (code.includes("stn")) return "AF_SANTIAGO";
    if (code.includes("sl")) return "AF_SAN_LUIS";
    return "";
  };

  const getIdFromPlantOption = (option: "AF_LIMA" | "AF_CALI" | "AF_SANTIAGO" | "AF_SAN_LUIS"): string => {
    const plant = PLANTS_CATALOG.find((p) => {
      const code = p.code.toLowerCase();
      if (option === "AF_LIMA" && code.includes("lim")) return true;
      if (option === "AF_CALI" && code.includes("cal")) return true;
      if (option === "AF_SANTIAGO" && code.includes("stn")) return true;
      if (option === "AF_SAN_LUIS" && code.includes("sl")) return true;
      return false;
    });
    return plant ? String(plant.id) : "";
  };

  const handleEnvolturaChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      envolturaId: value,
      envasadoId: "",
    }));
  };

  const handleLicitacionChange = (value: string) => {
    const licitacion = value as "Sí" | "No";

    setForm((prev) => ({
      ...prev,
      licitacion,
      codigoRFQ: licitacion === "No" ? "" : prev.codigoRFQ,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0) {
      const fieldsWithErrors = Object.keys(validationErrors).reduce(
        (acc, field) => {
          acc[field as keyof PortfolioFormData] = true;
          return acc;
        },
        {} as Partial<Record<keyof PortfolioFormData, boolean>>
      );

      setTouchedFields((prev) => ({
        ...prev,
        ...fieldsWithErrors,
      }));

      return;
    }

    if (
      !selectedStatus ||
      !selectedClient ||
      !selectedExecutive ||
      !selectedPlant ||
      !selectedWrapping ||
      !selectedFinalUse ||
      !selectedPackingMachine
    ) {
      return;
    }

    const now = new Date().toISOString();

    const tabportRecord = {
      TbPoCodi: form.codigo,
      TbPoEsta: selectedStatus.id,
      TbPoLici: form.licitacion === "Sí" ? 1 : 0,
      TbPoColic: form.codigoRFQ,
      TbPoNPro: form.nombrePortafolio,
      TbPoDPro: form.descripcionPortafolio,
      TbPoEstdr: form.portafolioEstandar,
      TbPoIdpr: crypto.randomUUID(),
      TbPoFReg: now,
      TbPoActi: true,
      TbPoUCre: "usuario.frontend",
      TbPoFCre: now,
      TbPoUUlt: "usuario.frontend",
      TbPoFUlt: now,

      CLMaCCLi: selectedClient.id,
      TbVeCVen: selectedExecutive.id,
      TbPoLlavOr: selectedPlant.id,
      EdMaNEDAG: selectedWrapping.id,
      FaMKNId: selectedFinalUse.id,
      TbCLCUni: selectedPackingMachine.id,
    };

    const portfolioDisplayRecord = {
      id: form.codigo,

      statusId: selectedStatus.id,
      est: selectedStatus.name,

      clienteId: selectedClient.id,
      clienteCode: selectedClient.code,
      cli: selectedClient.businessName,

      ejecutivoId: selectedExecutive.id,
      ejecutivoCode: selectedExecutive.code,
      ej: selectedExecutive.fullName,

      plantaId: selectedPlant.id,
      plantaCode: selectedPlant.code,
      pl: selectedPlant.name,

      nom: form.nombrePortafolio,
      desc: form.descripcionPortafolio,

      envolturaId: selectedWrapping.id,
      envolturaCode: selectedWrapping.code,
      env: selectedWrapping.name,

      usoFinalId: selectedFinalUse.id,
      usoFinalCode: selectedFinalUse.code,
      uf: selectedFinalUse.useFinal,
      subseg: selectedFinalUse.subSegment,
      seg: selectedFinalUse.segment,
      sector: selectedFinalUse.sector,
      af: selectedFinalUse.afMarketId,

      envasadoId: selectedPackingMachine.id,
      envasadoCode: selectedPackingMachine.code,
      maq: selectedPackingMachine.name,

      lic: form.licitacion,
      codigoRFQ: form.codigoRFQ,
      portafolioEstandar: form.portafolioEstandar,

      createdAt: now,
      fch: new Intl.DateTimeFormat("es-PE").format(new Date()),
      proy: [],
    };

    savePortfolioRecord({
      displayRecord: portfolioDisplayRecord,
      tabportRecord,
    });

    navigate("/portfolio");
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <button
        type="button"
        onClick={() => navigate("/portfolio")}
        className="mb-2 flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65%_1fr]">
          {/* ═══════════ COLUMNA IZQUIERDA (65%) ═══════════ */}
          <div className="space-y-4">
            {/* SECCIÓN 1: Cliente y responsable */}
            <SectionCard
              number={1}
              title="Cliente y responsable"
              status={getSectionStatus(form.licitacion === "Sí" ? ["clienteId", "ejecutivoId", "licitacion", "codigoRFQ"] : ["clienteId", "ejecutivoId", "licitacion"])}
              required
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <SmartCatalogSearch
                  label="Nombre del Cliente *"
                  value={form.clienteId}
                  onChange={(value) => updateField("clienteId", value)}
                  onBlur={() => markFieldAsTouched("clienteId")}
                  error={
                    shouldShowFieldError("clienteId")
                      ? validationErrors.clienteId
                      : ""
                  }
                  options={eligibleClients.map((item) => ({
                    id: item.id,
                    code: item.code,
                    name: item.businessName,
                    meta: item.ruc,
                  }))}
                  placeholder="Escribe para buscar cliente..."
                  emptyMessage="Cliente no encontrado. Regístrelo en el módulo Clientes."
                />

                <SmartCatalogSearch
                  label="Ejecutivo Comercial *"
                  value={form.ejecutivoId}
                  onChange={(value) => updateField("ejecutivoId", value)}
                  onBlur={() => markFieldAsTouched("ejecutivoId")}
                  error={
                    shouldShowFieldError("ejecutivoId")
                      ? validationErrors.ejecutivoId
                      : ""
                  }
                  options={comercialUsers.map((item) => ({
                    id: item.id,
                    code: item.code,
                    name: item.fullName,
                    meta: item.email,
                  }))}
                  placeholder="Escribe para buscar ejecutivo..."
                  emptyMessage="Usuario no encontrado. Regístrelo en el módulo Usuarios."
                />
              </div>
            </SectionCard>

            {/* SECCIÓN 2: Información del portafolio */}
            <SectionCard
              number={2}
              title="Información del portafolio"
              status={getSectionStatus(["nombrePortafolio"])}
              required
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FormInput
                  label="Nombre de Portafolio *"
                  value={form.nombrePortafolio}
                  onChange={(value) => updateField("nombrePortafolio", value)}
                  onBlur={() => markFieldAsTouched("nombrePortafolio")}
                  error={
                    shouldShowFieldError("nombrePortafolio")
                      ? validationErrors.nombrePortafolio
                      : ""
                  }
                  placeholder="Ej. Fundas great value"
                />

                <FormTextarea
                  label="Descripción del Portafolio"
                  value={form.descripcionPortafolio}
                  onChange={(value) =>
                    updateField("descripcionPortafolio", value)
                  }
                  placeholder="Descripción breve de la familia de productos"
                  rows={2}
                />
              </div>
            </SectionCard>

            {/* SECCIÓN 3: Producto y uso final */}
            <SectionCard
              number={3}
              title="Producto y uso final"
              status={getSectionStatus(["envolturaId", "usoFinalId"])}
              required
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                    Envoltura <span className="text-red-600">*</span>
                  </label>
                  <EnvolturaSelector
                    value={getEnvolturaOption(form.envolturaId)}
                    onChange={(value) => {
                      const id = getIdFromEnvolturaOption(value);
                      handleEnvolturaChange(id);
                      markFieldAsTouched("envolturaId");
                    }}
                    error={
                      shouldShowFieldError("envolturaId")
                        ? validationErrors.envolturaId
                        : ""
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(280px,0.8fr)] lg:items-end">
                  <FormSelect
                    label="Uso Final *"
                    value={form.usoFinalId}
                    onChange={(value) => updateField("usoFinalId", value)}
                    onBlur={() => markFieldAsTouched("usoFinalId")}
                    error={
                      shouldShowFieldError("usoFinalId")
                        ? validationErrors.usoFinalId
                        : ""
                    }
                    options={FINAL_USE_CATALOG.map((item) => ({
                      value: String(item.id),
                      label: item.useFinal,
                    }))}
                    placeholder="-- Seleccione --"
                  />

                  <button
                    type="button"
                    onClick={() => setShowFinalUseCatalog(true)}
                    className="h-[38px] rounded-lg border border-[#00395A] px-4 text-sm font-semibold text-[#00395A] hover:bg-[#00395A] hover:text-white transition-colors"
                  >
                    Ver tabla
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTaxonomyDetail((prev) => !prev)}
                    className="flex h-[38px] w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span className="truncate">
                      {selectedFinalUse 
                        ? `${selectedFinalUse.sector} / ${selectedFinalUse.segment} / ${selectedFinalUse.subSegment}`
                        : "No definido"}
                    </span>
                    <span className="ml-2 flex-none text-xs text-slate-400">
                      {showTaxonomyDetail ? "▲" : "▼"}
                    </span>
                  </button>
                </div>

                {/* Detalle de taxonomía desplegable */}
                {showTaxonomyDetail && (
                  <div className="mt-3 border border-slate-100 p-3 bg-slate-50/50 rounded-lg grid grid-cols-2 gap-2 md:grid-cols-4">
                    <FormInput
                      label="Sector"
                      value={selectedFinalUse?.sector || ""}
                      disabled
                    />
                    <FormInput
                      label="Segmento"
                      value={selectedFinalUse?.segment || ""}
                      disabled
                    />
                    <FormInput
                      label="Sub-segmento"
                      value={selectedFinalUse?.subSegment || ""}
                      disabled
                    />
                    <FormInput
                      label="AFMarketID"
                      value={selectedFinalUse?.afMarketId || ""}
                      disabled
                    />
                  </div>
                )}
              </div>
            </SectionCard>

            {/* SECCIÓN 4: Configuración técnica */}
            <SectionCard
              number={4}
              title="Configuración técnica"
              status={getSectionStatus(["envasadoId"])}
              required
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FormSelect
                  label="Envasado / Máquina de Cliente *"
                  value={form.envasadoId}
                  onChange={(value) => updateField("envasadoId", value)}
                  onBlur={() => markFieldAsTouched("envasadoId")}
                  error={
                    shouldShowFieldError("envasadoId")
                      ? validationErrors.envasadoId
                      : ""
                  }
                  options={packingMachines.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                  }))}
                  placeholder={
                    form.envolturaId
                      ? "-- Seleccione --"
                      : "Primero seleccione una envoltura"
                  }
                  disabled={!form.envolturaId}
                />

                <FormInput
                  label="Portafolio Estándar"
                  value={form.portafolioEstandar}
                  onChange={(value) => updateField("portafolioEstandar", value)}
                  placeholder="Ej. 564356"
                />
              </div>
            </SectionCard>
          </div>

          {/* ═══════════ COLUMNA DERECHA (35%) ═══════════ */}
          <div className="space-y-4 h-fit lg:sticky lg:top-20">
            {/* Vista rápida */}
            <PortfolioPreview
              codigo={form.codigo}
              estado={selectedStatus?.name || "Registrado"}
              completionPercentage={completionPercentage}
              items={[
                { label: "Cliente", value: selectedClient?.businessName || "—" },
                { label: "Ejecutivo", value: selectedExecutive?.fullName || "—" },
                { label: "Planta", value: selectedPlant?.name || "—" },
                { label: "Portafolio", value: form.nombrePortafolio || "—" },
                { label: "Envoltura", value: selectedWrapping?.name || "—" },
                { label: "Uso final", value: selectedFinalUse?.useFinal || "—" },
                { label: "Máquina", value: selectedPackingMachine?.name || "—" },
              ]}
            />

            {/* SECCIÓN 5: Planta de Origen */}
            <SectionCard
              number={5}
              title="Planta de Origen"
              status={getSectionStatus(["plantaId"])}
              required
            >
              <PlantSelector
                value={getPlantOption(form.plantaId)}
                onChange={(value) => {
                  const id = getIdFromPlantOption(value);
                  updateField("plantaId", id);
                  markFieldAsTouched("plantaId");
                }}
                error={
                  shouldShowFieldError("plantaId")
                    ? validationErrors.plantaId
                    : ""
                }
              />
            </SectionCard>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-4 border-t border-slate-200 bg-[#f6f8fb]/95 py-3 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/portfolio")}
            validationErrorList={validationErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Guardar Portafolio"
            cancelLabel="Cancelar"
          />
        </div>
      </form>

      {showFinalUseCatalog && (
        <FinalUseCatalogModal
          selectedId={form.usoFinalId}
          onClose={() => setShowFinalUseCatalog(false)}
          onSelect={(id) => {
            updateField("usoFinalId", id);
            setShowFinalUseCatalog(false);
          }}
        />
      )}
    </div>
  );
}