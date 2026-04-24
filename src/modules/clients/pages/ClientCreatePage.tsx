import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";

import {
  getActiveExecutiveRecords,
  getExecutiveById,
} from "../../../shared/data/executiveStorage";
import { getNextClientCode, getNextClientId, saveClientRecord } from "../../../shared/data/clientStorage";

// PageModuleHeader removed as we use useLayout().setHeader()
import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import SegmentedControl from "../../../shared/components/forms/SegmentedControl";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import SmartCatalogSearch from "../../../shared/components/catalog/SmartCatalogSearch";

type ClientFormData = {
  tipoDocumento: "RUC" | "DNI" | "CE";
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial: string;
  ejecutivoId: string;

  actividadPrincipal: string;
  rubroGeneral: string;
  gestion: "Pública" | "Privada";
  ventasUIT: string;
  empleados: string;
  facturacionEbitda: string;
  cobertura: string;

  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccionFiscal: string;
  culturaOrganizacional: string;
  posicionamiento: string;
};

const ACTIVIDADES_CIIU = [
  "Manufactura",
  "Alimentos y bebidas",
  "Agricultura",
  "Pesca",
  "Minería",
  "Comercio B2B",
  "Servicios industriales",
  "Servicios profesionales",
  "Logística",
  "Otros",
];

const RUBROS = [
  "Consumo masivo",
  "Empaques flexibles",
  "Agroindustria",
  "Industrial",
  "Retail / Distribución",
  "Servicios B2B",
  "Otros",
];

const DEPARTAMENTOS = [
  "Lima",
  "Callao",
  "Ica",
  "La Libertad",
  "Piura",
  "Arequipa",
  "Cusco",
  "San Martín",
];

const PROVINCIAS = [
  "Lima",
  "Callao",
  "Trujillo",
  "Piura",
  "Arequipa",
  "Tarapoto",
  "Ica",
];

const DISTRITOS = [
  "Lima",
  "Miraflores",
  "San Isidro",
  "Ate",
  "Lurín",
  "Callao",
  "Trujillo",
  "Tarapoto",
];

const COBERTURAS = ["Local", "Nacional", "Regional", "Internacional"];

const POSICIONAMIENTOS = [
  "Cliente estratégico",
  "Cliente recurrente",
  "Cliente nuevo",
  "Cliente potencial",
  "Cliente en evaluación",
];

const buildInitialForm = (): ClientFormData => ({
  tipoDocumento: "RUC",
  numeroDocumento: "",
  razonSocial: "",
  nombreComercial: "",
  ejecutivoId: "",

  actividadPrincipal: "",
  rubroGeneral: "",
  gestion: "Privada",
  ventasUIT: "",
  empleados: "",
  facturacionEbitda: "",
  cobertura: "",

  pais: "PERÚ",
  departamento: "",
  provincia: "",
  distrito: "",
  direccionFiscal: "",
  culturaOrganizacional: "",
  posicionamiento: "",
});

export default function ClientCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [clientCode] = useState(getNextClientCode);
  const [clientId] = useState(getNextClientId);
  const [form, setForm] = useState<ClientFormData>(buildInitialForm);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof ClientFormData, boolean>>
  >({});

  const executiveOptions = useMemo(() => getActiveExecutiveRecords(), []);

  const selectedExecutive = getExecutiveById(Number(form.ejecutivoId));

  const resultado = useMemo(() => {
    const ventas = Number(form.ventasUIT || 0);

    if (!ventas) return "--";
    if (ventas <= 150) return "Microempresa";
    if (ventas <= 1700) return "Pequeña empresa";
    if (ventas <= 2300) return "Mediana empresa";

    return "Gran empresa";
  }, [form.ventasUIT]);

  const requiredChecks = useMemo(() => {
    return [
      Boolean(form.tipoDocumento),
      Boolean(form.numeroDocumento.trim()),
      Boolean(form.razonSocial.trim()),
      Boolean(form.ejecutivoId),
      Boolean(form.actividadPrincipal),
      Boolean(form.rubroGeneral),
      Boolean(form.gestion),
      Boolean(form.cobertura),
      Boolean(form.pais),
      Boolean(form.departamento),
      Boolean(form.provincia),
      Boolean(form.distrito),
      Boolean(form.direccionFiscal.trim()),
    ];
  }, [form]);

  const completionPercentage = useMemo(() => {
    const completed = requiredChecks.filter(Boolean).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [requiredChecks]);

  // Update header based on state
  useEffect(() => {
    setHeader({
      title: "Crear Cliente",
      subtitle: "Registra el cliente antes de crear sus portafolios.",
      breadcrumbs: [{ label: "Clientes" }, { label: "Crear Cliente" }]
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<keyof ClientFormData, string>> = {};

    if (!form.tipoDocumento) {
      errors.tipoDocumento = "Selecciona el tipo de documento.";
    }

    if (!form.numeroDocumento.trim()) {
      errors.numeroDocumento = "Ingresa el número de documento.";
    }

    if (
      form.tipoDocumento === "RUC" &&
      form.numeroDocumento.trim().length !== 11
    ) {
      errors.numeroDocumento = "El RUC debe tener 11 dígitos.";
    }

    if (!form.razonSocial.trim()) {
      errors.razonSocial = "Ingresa la razón social del cliente.";
    }

    if (!form.ejecutivoId) {
      errors.ejecutivoId = "Selecciona el ejecutivo asignado.";
    }

    if (!form.actividadPrincipal) {
      errors.actividadPrincipal = "Selecciona la actividad principal.";
    }

    if (!form.rubroGeneral) {
      errors.rubroGeneral = "Selecciona el rubro general.";
    }

    if (!form.gestion) {
      errors.gestion = "Selecciona el tipo de gestión.";
    }

    if (!form.cobertura) {
      errors.cobertura = "Selecciona la cobertura geográfica.";
    }

    if (!form.pais) {
      errors.pais = "Selecciona el país.";
    }

    if (!form.departamento) {
      errors.departamento = "Selecciona el departamento.";
    }

    if (!form.provincia) {
      errors.provincia = "Selecciona la provincia.";
    }

    if (!form.distrito) {
      errors.distrito = "Selecciona el distrito.";
    }

    if (!form.direccionFiscal.trim()) {
      errors.direccionFiscal = "Ingresa la dirección fiscal.";
    }

    return errors;
  }, [form]);

  const validationErrorList = Object.values(validationErrors).filter(
    (error): error is string => Boolean(error)
  );

  const updateField = (field: keyof ClientFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const markFieldAsTouched = (field: keyof ClientFormData) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const shouldShowFieldError = (field: keyof ClientFormData) => {
    return Boolean(
      validationErrors[field] && (submitAttempted || touchedFields[field])
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0) {
      setTouchedFields({
        tipoDocumento: true,
        numeroDocumento: true,
        razonSocial: true,
        ejecutivoId: true,
        actividadPrincipal: true,
        rubroGeneral: true,
        gestion: true,
        cobertura: true,
        pais: true,
        departamento: true,
        provincia: true,
        distrito: true,
        direccionFiscal: true,
      });

      return;
    }

    const now = new Date().toISOString();

    saveClientRecord({
      id: clientId,
      code: clientCode,
      name: form.razonSocial.trim(),
      ruc: form.numeroDocumento.trim(),
      documentType: form.tipoDocumento,
      commercialName: form.nombreComercial.trim(),

      ejecutivoId: selectedExecutive?.id,
      ejecutivoName: selectedExecutive?.name,

      actividadPrincipal: form.actividadPrincipal,
      rubroGeneral: form.rubroGeneral,
      gestion: form.gestion,
      ventasUIT: form.ventasUIT,
      empleados: form.empleados,
      facturacionEbitda: form.facturacionEbitda,
      resultado,
      cobertura: form.cobertura,

      pais: form.pais,
      departamento: form.departamento,
      provincia: form.provincia,
      distrito: form.distrito,
      direccionFiscal: form.direccionFiscal,
      culturaOrganizacional: form.culturaOrganizacional,
      posicionamiento: form.posicionamiento,

      status: "Registrado",
      createdAt: now,
      updatedAt: now,
    });

    navigate("/clients");
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard
              title="Identificación y responsable"
              icon="▦"
              color="#003b5c"
              required
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Tipo Documento *"
                  value={form.tipoDocumento}
                  onChange={(value) =>
                    updateField(
                      "tipoDocumento",
                      value as ClientFormData["tipoDocumento"]
                    )
                  }
                  onBlur={() => markFieldAsTouched("tipoDocumento")}
                  error={
                    shouldShowFieldError("tipoDocumento")
                      ? validationErrors.tipoDocumento
                      : ""
                  }
                  options={[
                    { value: "RUC", label: "RUC" },
                    { value: "DNI", label: "DNI" },
                    { value: "CE", label: "CE" },
                  ]}
                />

                <FormInput
                  label="Número de Documento *"
                  value={form.numeroDocumento}
                  onChange={(value) => updateField("numeroDocumento", value)}
                  onBlur={() => markFieldAsTouched("numeroDocumento")}
                  error={
                    shouldShowFieldError("numeroDocumento")
                      ? validationErrors.numeroDocumento
                      : ""
                  }
                  placeholder="11 dígitos"
                />

                <SmartCatalogSearch
                  label="Ejecutivo Asignado *"
                  value={form.ejecutivoId}
                  onChange={(value) => updateField("ejecutivoId", value)}
                  onBlur={() => markFieldAsTouched("ejecutivoId")}
                  error={
                    shouldShowFieldError("ejecutivoId")
                      ? validationErrors.ejecutivoId
                      : ""
                  }
                  options={executiveOptions.map((item) => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    meta: item.email,
                  }))}
                  placeholder="Buscar ejecutivo..."
                />

                <FormInput
                  label="Cliente / Razón Social *"
                  value={form.razonSocial}
                  onChange={(value) => updateField("razonSocial", value)}
                  onBlur={() => markFieldAsTouched("razonSocial")}
                  error={
                    shouldShowFieldError("razonSocial")
                      ? validationErrors.razonSocial
                      : ""
                  }
                  placeholder="Ej. Mentec Perú S.A.C."
                />

                <FormInput
                  label="Nombre Comercial"
                  value={form.nombreComercial}
                  onChange={(value) => updateField("nombreComercial", value)}
                  placeholder="Ej. Mentec"
                  helper="Opcional"
                />
              </div>
            </FormCard>

            <FormCard
              title="Clasificación estratégica"
              icon="◇"
              color="#1E82D9"
              required
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  label="Actividad Principal CIIU *"
                  value={form.actividadPrincipal}
                  onChange={(value) => updateField("actividadPrincipal", value)}
                  onBlur={() => markFieldAsTouched("actividadPrincipal")}
                  error={
                    shouldShowFieldError("actividadPrincipal")
                      ? validationErrors.actividadPrincipal
                      : ""
                  }
                  options={ACTIVIDADES_CIIU.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  placeholder="-- Seleccione --"
                />

                <FormSelect
                  label="Rubro General *"
                  value={form.rubroGeneral}
                  onChange={(value) => updateField("rubroGeneral", value)}
                  onBlur={() => markFieldAsTouched("rubroGeneral")}
                  error={
                    shouldShowFieldError("rubroGeneral")
                      ? validationErrors.rubroGeneral
                      : ""
                  }
                  options={RUBROS.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  placeholder="-- Seleccione --"
                />

                <SegmentedControl
                  label="Gestión *"
                  value={form.gestion}
                  onChange={(value) =>
                    updateField("gestion", value as ClientFormData["gestion"])
                  }
                  options={[
                    { label: "Pública", value: "Pública" },
                    { label: "Privada", value: "Privada" },
                  ]}
                />

                <FormInput
                  label="Ventas (UIT)"
                  value={form.ventasUIT}
                  onChange={(value) => updateField("ventasUIT", value)}
                  placeholder="0"
                />

                <FormInput
                  label="Empleados"
                  value={form.empleados}
                  onChange={(value) => updateField("empleados", value)}
                  placeholder="0"
                />

                <FormInput
                  label="Facturación / EBITDA"
                  value={form.facturacionEbitda}
                  onChange={(value) => updateField("facturacionEbitda", value)}
                  placeholder="0"
                />

                <FormInput
                  label="Resultado"
                  value={resultado}
                  disabled
                  helper="Calculado por ventas UIT"
                />
              </div>

              <div className="mt-5">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Cobertura Geográfica *
                </span>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  {COBERTURAS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateField("cobertura", item)}
                      className={`rounded-xl border px-4 py-5 text-center text-sm font-bold transition ${form.cobertura === item
                          ? "border-[#003b5c] bg-[#e8f4f8] text-[#003b5c]"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {shouldShowFieldError("cobertura") && (
                  <span className="mt-1 block text-[11px] font-semibold text-red-600">
                    {validationErrors.cobertura}
                  </span>
                )}
              </div>
            </FormCard>
          </div>

          <div className="space-y-5">
            <ClientPreviewCard
              code={clientCode}
              status="Borrador"
              razonSocial={form.razonSocial}
              ruc={form.numeroDocumento}
              nombreComercial={form.nombreComercial}
              resultado={resultado}
              completionPercentage={completionPercentage}
            />

            <FormCard title="Sede Central" icon="▥" color="#003b5c" required>
              <div className="grid grid-cols-1 gap-4">
                <FormSelect
                  label="País *"
                  value={form.pais}
                  onChange={(value) => updateField("pais", value)}
                  onBlur={() => markFieldAsTouched("pais")}
                  error={
                    shouldShowFieldError("pais") ? validationErrors.pais : ""
                  }
                  options={[{ value: "PERÚ", label: "PERÚ" }]}
                />

                <FormSelect
                  label="Departamento *"
                  value={form.departamento}
                  onChange={(value) => updateField("departamento", value)}
                  onBlur={() => markFieldAsTouched("departamento")}
                  error={
                    shouldShowFieldError("departamento")
                      ? validationErrors.departamento
                      : ""
                  }
                  options={DEPARTAMENTOS.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  placeholder="-- Seleccione --"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    label="Provincia *"
                    value={form.provincia}
                    onChange={(value) => updateField("provincia", value)}
                    onBlur={() => markFieldAsTouched("provincia")}
                    error={
                      shouldShowFieldError("provincia")
                        ? validationErrors.provincia
                        : ""
                    }
                    options={PROVINCIAS.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    placeholder="-- Seleccione --"
                  />

                  <FormSelect
                    label="Distrito *"
                    value={form.distrito}
                    onChange={(value) => updateField("distrito", value)}
                    onBlur={() => markFieldAsTouched("distrito")}
                    error={
                      shouldShowFieldError("distrito")
                        ? validationErrors.distrito
                        : ""
                    }
                    options={DISTRITOS.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    placeholder="-- Seleccione --"
                  />
                </div>

                <FormInput
                  label="Dirección Fiscal *"
                  value={form.direccionFiscal}
                  onChange={(value) => updateField("direccionFiscal", value)}
                  onBlur={() => markFieldAsTouched("direccionFiscal")}
                  error={
                    shouldShowFieldError("direccionFiscal")
                      ? validationErrors.direccionFiscal
                      : ""
                  }
                  placeholder="Ingrese dirección fiscal"
                />

                <FormTextarea
                  label="Cultura Organizacional"
                  value={form.culturaOrganizacional}
                  onChange={(value) =>
                    updateField("culturaOrganizacional", value)
                  }
                  placeholder="Descripción..."
                  helper="Opcional"
                />

                <FormSelect
                  label="Posicionamiento"
                  value={form.posicionamiento}
                  onChange={(value) => updateField("posicionamiento", value)}
                  options={POSICIONAMIENTOS.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  placeholder="-- Seleccionar --"
                />
              </div>
            </FormCard>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/clients")}
            validationErrorList={validationErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Registrar Cliente"
            cancelLabel="Cancelar"
            validationTitle="Faltan campos obligatorios para registrar el cliente."
          />
        </div>
      </form>
    </div>
  );
}

function ClientPreviewCard({
  code,
  status,
  razonSocial,
  ruc,
  nombreComercial,
  resultado,
  completionPercentage,
}: {
  code: string;
  status: string;
  razonSocial: string;
  ruc: string;
  nombreComercial: string;
  resultado: string;
  completionPercentage: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        className="px-5 py-4 text-white"
        style={{
          background: "linear-gradient(135deg, #003b5c 0%, #1E82D9 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-white/75">
              Cliente
            </div>

            <div className="mt-2 text-lg font-extrabold">
              {razonSocial || "Nuevo cliente"}
            </div>

            <div className="mt-1 text-xs text-white/80">
              {ruc || "Número de documento pendiente"}
            </div>
          </div>

          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            {resultado}
          </span>
        </div>
      </div>

      <div className="space-y-2 p-5 text-sm">
        <PreviewRow label="ID" value={code} />
        <PreviewRow label="Estado" value={status} />
        <PreviewRow label="Razón Social" value={razonSocial || "Pendiente"} />
        <PreviewRow label="Nombre Comercial" value={nombreComercial || "—"} />
        <PreviewRow label="Avance" value={`${completionPercentage}%`} />
      </div>
    </div>
  );
}