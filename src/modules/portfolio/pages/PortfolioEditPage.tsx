import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import {
  getActiveExecutiveRecords,
  getExecutiveById,
} from "../../../shared/data/executiveStorage";

import { getPortfolioByCode, updatePortfolioRecord } from "../../../shared/data/portfolioStorage";
import { getCurrentUser, getCommercialExecutives } from "../../../shared/data/userStorage";
import { getClientCatalogRecords } from "../../../shared/data/clientStorage";

import SmartCatalogSearch from "../../../shared/components/catalog/SmartCatalogSearch";
import FinalUseSelector from "../../../shared/components/catalog/FinalUseSelector";
import FinalUseCatalogModal from "../../../shared/components/catalog/FinalUseCatalogModal";
import PortfolioPreview from "../../../shared/components/ui/PortfolioPreview.tsx";import { useLayout } from "../../../components/layout/LayoutContext";
// PageModuleHeader removed as we use useLayout().setHeader()
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

function recordToFormData(record: Record<string, unknown>): PortfolioFormData {
  return {
    codigo: String(record.codigo || record.id || ""),
    estadoId: String(record.estadoId || record.statusId || STATUS_CATALOG[0].id),
    clienteId: String(record.clienteId || record.clienteId || ""),
    ejecutivoId: String(record.ejecutivoId || record.ejecutivoId || ""),
    plantaId: String(record.plantaId || record.plantaId || ""),
    licitacion: (record.licitacion as "Sí" | "No") || "No",
    codigoRFQ: String(record.codigoRFQ || record.codigoRFQ || ""),
    nombrePortafolio: String(record.nombrePortafolio || record.nom || ""),
    descripcionPortafolio: String(record.descripcionPortafolio || record.desc || ""),
    envolturaId: String(record.envolturaId || record.envolturaId || ""),
    usoFinalId: String(record.usoFinalId || record.usoFinalId || ""),
    envasadoId: String(record.envasadoId || record.envasadoId || ""),
    portafolioEstandar: String(record.portafolioEstandar || record.portafolioEstandar || ""),
  };
}

export default function PortfolioEditPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { portfolioCode } = useParams<{ portfolioCode: string }>();

  const [form, setForm] = useState<PortfolioFormData | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showFinalUseCatalog, setShowFinalUseCatalog] = useState(false);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof PortfolioFormData, boolean>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const [canEdit, setCanEdit] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    setCanEdit(!!user);
  }, []);

  const portfolioCodeStr = portfolioCode || "";

  useEffect(() => {
    if (!portfolioCodeStr) {
      setError("Código de portafolio no válido");
      setLoading(false);
      return;
    }

    const record = getPortfolioByCode(portfolioCodeStr);
    if (!record) {
      setError(`Portafolio con código ${portfolioCodeStr} no encontrado`);
      setLoading(false);
      return;
    }

    setForm(recordToFormData(record));
    setLoading(false);
  }, [portfolioCodeStr]);

  const selectedStatus = getStatusById(Number(form?.estadoId));
  const allClients = getClientCatalogRecords();
  const activeClients = useMemo(() => allClients.filter((c) => c.status === "active"), [allClients]);
  const selectedClient = allClients.find((c) => c.id === form?.clienteId);

  const comercialExecutives = useMemo(() => getCommercialExecutives(), []);
  const selectedExecutive = comercialExecutives.find((u) => u.id === form?.ejecutivoId);
  const selectedPlant = getPlantById(Number(form?.plantaId));
  const selectedWrapping = getWrappingById(Number(form?.envolturaId));
  const selectedFinalUse = getFinalUseById(Number(form?.usoFinalId));
  const selectedPackingMachine = getPackingMachineById(Number(form?.envasadoId));

  const packingMachines = useMemo(() => {
    if (!form?.envolturaId) return [];
    return getPackingMachinesByWrappingId(Number(form.envolturaId));
  }, [form?.envolturaId]);

  const requiredChecks = useMemo(() => {
    if (!form) return [];
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
    return requiredChecks.length
      ? Math.round((completed / requiredChecks.length) * 100)
      : 0;
  }, [requiredChecks]);

  // Update header dynamically
  useEffect(() => {
    if (portfolioCodeStr && form) {
      setHeader({
        title: "Editar Portafolio",
        breadcrumbs: [
          { label: "Portafolio", href: "/portfolio" },
          { label: portfolioCodeStr },
          { label: "Editar" },
        ],
        badges: (
          <>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              ID: {form.codigo}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              Edición
            </span>
          </>
        ),
        progress: {
          percentage: completionPercentage,
          label: `${completionPercentage}% completado`,
        }
      });
    }
    return () => resetHeader();
  }, [setHeader, resetHeader, portfolioCodeStr, form?.codigo, completionPercentage]);

  const validationErrors = useMemo(() => {
    if (!form) return {};
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
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );
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
    setForm((prev) =>
      prev
        ? {
            ...prev,
            envolturaId: value,
            envasadoId: "",
          }
        : null
    );
  };

  const handleLicitacionChange = (value: string) => {
    const licitacion = value as "Sí" | "No";
    setForm((prev) =>
      prev
        ? {
            ...prev,
            licitacion,
            codigoRFQ: licitacion === "No" ? "" : prev.codigoRFQ,
          }
        : null
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!form || !portfolioCodeStr) return;

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

    updatePortfolioRecord(portfolioCodeStr, {
      estadoId: selectedStatus.id,
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
      TbPoLici: form.licitacion === "Sí" ? 1 : 0,
      TbPoColic: form.codigoRFQ,
      TbPoNPro: form.nombrePortafolio,
      TbPoDPro: form.descripcionPortafolio,
      TbPoEstdr: form.portafolioEstandar,
      updatedAt: now,
    });

    navigate("/portfolio");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Cargando portafolio...</div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">{error || "Error cargando portafolio"}</div>
        <button
          onClick={() => navigate("/portfolio")}
          className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium"
        >
          Volver a Portafolios
        </button>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 bg-white rounded-xl border border-slate-200">
        <div className="text-amber-600 font-semibold flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Acceso denegado
        </div>
        <p className="text-slate-500 text-sm">Debes iniciar sesión para editar portafolios.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium mt-2"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

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
                  options={activeClients.map((item) => ({
                    id: item.id,
                    code: item.code,
                    name: item.businessName,
                    meta: item.ruc,
                  }))}
                  placeholder="Escribe para buscar cliente..."
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
                  options={comercialExecutives.map((item) => ({
                    id: item.id,
                    code: item.code,
                    name: item.fullName,
                    meta: item.email,
                  }))}
                  placeholder="Escribe para buscar ejecutivo..."
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

            <FormCard title="Información comercial" icon="▤" color={AMCOR.blue}>
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
                  onChange={(value) => updateField("descripcionPortafolio", value)}
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
            submitLabel="Guardar Cambios"
            cancelLabel="Cancelar"
            validationTitle="Faltan campos obligatorios para actualizar el portafolio."
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
