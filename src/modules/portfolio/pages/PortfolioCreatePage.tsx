import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
// ... el resto de tus importaciones

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

import { getClientCatalogRecords } from "../../../shared/data/clientStorage";
import { getCommercialExecutives } from "../../../shared/data/userStorage";
import { savePortfolioRecord } from "../../../shared/data/portfolioStorage";
import SmartCatalogSearch from "../../../shared/components/catalog/SmartCatalogSearch";
import FinalUseSelector from "../../../shared/components/catalog/FinalUseSelector";
import FinalUseCatalogModal from "../../../shared/components/catalog/FinalUseCatalogModal";
import PortfolioPreview from "../../../shared/components/ui/PortfolioPreview.tsx";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCard,
  FormActionButtons,
} from "../../../shared/components/forms/index.tsx";

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
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof PortfolioFormData, boolean>>
  >({});

  const selectedStatus = getStatusById(Number(form.estadoId));
  const allClients = getClientCatalogRecords();
  const realClients = allClients.filter((c) => c.status === "active");
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

  // Update header dynamically
  useEffect(() => {
    setHeader({
      title: "Crear Portafolio",
      subtitle: "Registra primero el cliente, responsable comercial y planta. Luego completa la información comercial, taxonomía del producto y datos técnicos.",
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
    if (!form.envasadoId) errors.envasadoId = "Selecciona el envasado / máquina de cliente.";

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
      setTouchedFields({
        clienteId: true,
        ejecutivoId: true,
        plantaId: true,
        codigoRFQ: true,
        nombrePortafolio: true,
        envolturaId: true,
        usoFinalId: true,
        envasadoId: true,
      });

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

      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard
              title="Identificación y responsable"
              icon="▦"
              color={AMCOR.navy}
              required
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                  options={realClients.map((item) => ({
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

                <FormSelect
                  label="Planta de Origen *"
                  value={form.plantaId}
                  onChange={(value) => updateField("plantaId", value)}
                  onBlur={() => markFieldAsTouched("plantaId")}
                  error={
                    shouldShowFieldError("plantaId")
                      ? validationErrors.plantaId
                      : ""
                  }
                  options={PLANTS_CATALOG.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                  }))}
                  placeholder="-- Seleccione --"
                />

                <FormSelect
                  label="Licitación *"
                  value={form.licitacion}
                  onChange={handleLicitacionChange}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />

                <FormInput
                  label="Código RFQ"
                  value={form.codigoRFQ}
                  onChange={(value) => updateField("codigoRFQ", value)}
                  onBlur={() => markFieldAsTouched("codigoRFQ")}
                  error={
                    shouldShowFieldError("codigoRFQ")
                      ? validationErrors.codigoRFQ
                      : ""
                  }
                  disabled={form.licitacion === "No"}
                  placeholder="Ej. RFQ-093456"
                  helper={
                    form.licitacion === "Sí"
                      ? "Obligatorio si existe licitación"
                      : "No aplica"
                  }
                />
              </div>
            </FormCard>

            <FormCard
              title="Información comercial"
              icon="▤"
              color={AMCOR.blue}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  helper="Opcional"
                />
              </div>
            </FormCard>
          </div>

          <div className="space-y-5">
            <PortfolioPreview
              codigo={form.codigo}
              estado={selectedStatus?.name || "Registrado"}
              completionPercentage={completionPercentage}
              items={[
                { label: "Cliente", value: selectedClient?.businessName },
                { label: "Ejecutivo", value: selectedExecutive?.fullName },
                { label: "Planta", value: selectedPlant?.name },
                { label: "Portafolio", value: form.nombrePortafolio },
              ]}
            />

            <FormCard
              title="Datos de producto"
              icon="◈"
              color={AMCOR.green}
              required
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <FormSelect
                  label="Envoltura *"
                  value={form.envolturaId}
                  onChange={handleEnvolturaChange}
                  onBlur={() => markFieldAsTouched("envolturaId")}
                  error={
                    shouldShowFieldError("envolturaId")
                      ? validationErrors.envolturaId
                      : ""
                  }
                  options={WRAPPINGS_CATALOG.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                  }))}
                  placeholder="-- Seleccione --"
                />

                <FinalUseSelector
                  label="Uso Final *"
                  value={form.usoFinalId}
                  onChange={(value) => updateField("usoFinalId", value)}
                  onBlur={() => markFieldAsTouched("usoFinalId")}
                  error={
                    shouldShowFieldError("usoFinalId")
                      ? validationErrors.usoFinalId
                      : ""
                  }
                  onOpenTable={() => setShowFinalUseCatalog(true)}
                  options={FINAL_USE_CATALOG.map((item) => ({
                    value: String(item.id),
                    label: item.useFinal,
                  }))}
                  placeholder="-- Seleccione --"
                />

                <FormInput
                  label="Sector"
                  value={selectedFinalUse?.sector || ""}
                  disabled
                  helper="Autocompletado"
                />

                <FormInput
                  label="Segmento"
                  value={selectedFinalUse?.segment || ""}
                  disabled
                  helper="Autocompletado"
                />

                <FormInput
                  label="Sub-segmento"
                  value={selectedFinalUse?.subSegment || ""}
                  disabled
                  helper="Autocompletado"
                />

                <FormInput
                  label="AFMarketID"
                  value={selectedFinalUse?.afMarketId || ""}
                  disabled
                  helper="Autocompletado"
                />
              </div>
            </FormCard>

            <FormCard title="Técnico" icon="⚙" color={AMCOR.purple} required>
              <div className="grid grid-cols-1 gap-4">
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
                />

                <FormInput
                  label="Portafolio Estándar"
                  value={form.portafolioEstandar}
                  onChange={(value) => updateField("portafolioEstandar", value)}
                  placeholder="Ej. 564356"
                  helper="Opcional / condicional"
                />
              </div>
            </FormCard>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
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