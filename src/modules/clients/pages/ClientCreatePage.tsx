import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  createClient,
  getNextClientCode,
  findDuplicateClient,
} from "../../../shared/data/clientStorage";
import { registerClientStatusChange } from "../../../shared/data/clientStatusStorage";
import { mockSendEmail } from "../../../shared/data/notificationStorage";
import { type ClientMirror } from "../../../shared/data/clientMirrorStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import SystemIntegrationClientSearch from "../../../shared/components/forms/SystemIntegrationClientSearch";
import ClientDuplicateHandler from "../../../shared/components/forms/ClientDuplicateHandler";

const INDUSTRIES = ["Distribución", "Manufactura", "Consumo masivo", "Cuidado personal", "Alimentos y bebidas", "Retail"];

interface FormState {
  siClient: ClientMirror | null;
  email: string;
  businessName: string;
  ruc: string;
  industry: string;
}

export default function ClientCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [clientCode] = useState(getNextClientCode());

  const [form, setForm] = useState<FormState>({
    siClient: null,
    email: "",
    businessName: "",
    ruc: "",
    industry: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [duplicateClient, setDuplicateClient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [hasNoSiResults, setHasNoSiResults] = useState(false);
  const [creationMode, setCreationMode] = useState<"manual" | "excel" | null>(null);
  const [isExcelImported, setIsExcelImported] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [excelWarning, setExcelWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeader({
      title: "Crear Nuevo Cliente",
      breadcrumbs: [
        { label: "Clientes", href: "/clients" },
        { label: "Crear Cliente" },
      ],
      badges: (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          ID: {clientCode}
        </span>
      ),
    });
    return () => resetHeader();
  }, [setHeader, resetHeader, clientCode]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markFieldAsTouched = (field: keyof FormState) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const shouldShowFieldError = (field: keyof FormState) => {
    return Boolean(validationErrors[field] && (submitAttempted || touchedFields[field]));
  };

  const handleSiClientSelect = (client: ClientMirror) => {
    setForm((prev) => ({
      ...prev,
      siClient: client,
      ruc: client.ruc,
      email: client.email || "",
      businessName: client.razonSocial,
      industry: "",
    }));
    setSearchQuery("");
    setCreationMode(null);
    setIsExcelImported(false);
    setExcelError(null);
    setExcelWarning(null);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        razonSocial: "",
        correoElectronico: "",
        numerodeRUC: "",
        rubro: "",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PlantillaCliente");
    XLSX.writeFile(wb, "Plantilla_Creacion_Cliente.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelError(null);
    setExcelWarning(null);

    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setExcelError("Formato de archivo no válido. Solo se permiten archivos .xlsx o .xls.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setExcelError("Error al leer el archivo. Intente con otro archivo o verifique que no esté corrupto.");
    };
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        if (!data) {
          setExcelError("No se pudo leer el contenido del archivo.");
          return;
        }
        const wb = XLSX.read(data, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows = XLSX.utils.sheet_to_json<any>(ws);

        if (rows.length === 0) {
          setExcelError("El archivo no contiene datos para importar.");
          return;
        }

        if (rows.length > 1) {
          setExcelError("Faltan campos obligatorios. Para este flujo solo se permite registrar un cliente por vez.");
          return;
        }

        const row = rows[0];

        const expectedColumns = [
          "razonSocial",
          "correoElectronico",
          "numerodeRUC",
          "rubro",
        ];

        const headerData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
        const headers = headerData.length > 0 ? headerData[0] : [];
        const missingCols = expectedColumns.filter(c => !headers.includes(c));
        if (missingCols.length > 0) {
          setExcelError("La plantilla no tiene la estructura requerida. Descargue la plantilla oficial.");
          return;
        }

        const businessName = (row.razonSocial || "").toString().trim();
        const email = (row.correoElectronico || "").toString().trim();
        const ruc = (row.numerodeRUC || "").toString().trim();

        if (!businessName) {
          setExcelError("La razón social es obligatoria.");
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setExcelWarning("El correo importado no tiene un formato válido.");
        }

        let importedIndustry = (row.rubro || "").toString().trim();
        let finalIndustry = "";
        if (importedIndustry) {
          const industryMatch = INDUSTRIES.find(a => a.toLowerCase() === importedIndustry.toLowerCase());
          if (industryMatch) {
            finalIndustry = industryMatch;
          } else {
            setExcelWarning("El rubro importado no existe en el catálogo. Seleccione un rubro válido.");
          }
        }

        setForm(prev => ({
          ...prev,
          siClient: null,
          ruc: ruc,
          email: email,
          businessName: businessName,
          industry: finalIndustry,
        }));

        setIsExcelImported(true);

      } catch (error) {
        setExcelError("Error al procesar el archivo Excel. Asegúrese de que el formato sea correcto.");
      }
    };
    reader.readAsArrayBuffer(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSiClientSelected = form.siClient !== null;

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!form.ruc.trim()) {
      errors.ruc = "Ingresa el RUC.";
    }

    if (!form.email.trim()) {
      errors.email = "Ingresa el correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "El formato del correo no es válido.";
    }

    if (!form.businessName.trim()) {
      errors.businessName = "Ingresa la razón social.";
    }

    if (!form.industry.trim()) {
      errors.industry = "Selecciona el rubro.";
    }

    return errors;
  }, [form]);

  const completionPercentage = useMemo(() => {
    const requiredChecks = [
      Boolean(form.ruc.trim()),
      Boolean(form.email.trim()),
      Boolean(form.businessName.trim()),
      Boolean(form.industry.trim()),
    ];
    const completed = requiredChecks.filter(Boolean).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [form]);

  const validationErrorList = Object.values(validationErrors).filter(
    (error): error is string => Boolean(error)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSuccessMessage(null);

    if (Object.keys(validationErrors).length > 0 || excelError) {
      const fieldsWithErrors = Object.keys(validationErrors).reduce(
        (acc, field) => {
          acc[field as keyof FormState] = true;
          return acc;
        },
        {} as Partial<Record<keyof FormState, boolean>>
      );
      setTouchedFields((prev) => ({
        ...prev,
        ...fieldsWithErrors,
      }));
      return;
    }

    setLoading(true);
    try {
      const duplicate = findDuplicateClient(form.email, form.ruc);
      if (duplicate) {
        setDuplicateClient(duplicate);
        return;
      }

      const newClient = createClient({
        businessName: form.businessName,
        email: form.email,
        ruc: form.ruc,
        industry: form.industry,
        status: "pending_validation",
        siClientId: form.siClient?.id,
        siClientCode: form.siClient?.code,
      });

      registerClientStatusChange(
        newClient.id,
        null,
        "pending_validation",
        "system",
        `Cliente creado - ${form.siClient ? "Información autocompleta de SI" : "Ingreso manual - pendiente validación en SI"}`
      );

      const successMsg = form.siClient
        ? "Cliente enlazado con el sistema integral"
        : "Cliente creado exitosamente y se solicitó la validación de Tesorería";
      setSuccessMessage(successMsg);
      setTimeout(() => navigate("/clients"), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error al crear cliente:", error);
      alert(`Error al crear el cliente: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const industryOptions = INDUSTRIES.map((industry) => ({
    value: industry,
    label: industry,
  }));

  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-lg font-bold text-green-900">{successMessage}</p>
          <p className="text-sm text-green-700 mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (duplicateClient) {
    return (
      <div className="w-full max-w-none bg-[#f6f8fb] p-5">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setDuplicateClient(null)}
            className="mb-4 text-sm text-brand-primary hover:underline"
          >
            ← Volver al formulario
          </button>

          <ClientDuplicateHandler
            existingClient={duplicateClient}
            loading={loading}
            onViewDetails={() => navigate(`/clients/${duplicateClient.code}`)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <button
        type="button"
        onClick={() => navigate("/clients")}
        className="mb-3 flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard title="Buscar en Sistema Integral" icon="🔍" color="#0D9488" required>
              <div className="space-y-3">
                <SystemIntegrationClientSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleSiClientSelect}
                  onNoResults={setHasNoSiResults}
                  placeholder="Buscar por código, razón social, RUC..."
                />

                {!isSiClientSelected && (
                  <button
                    type="button"
                    onClick={() => setCreationMode("excel")}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                      creationMode === "excel"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
                    }`}
                  >
                    Importar plantilla Excel
                  </button>
                )}

                {isSiClientSelected && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      ✓ Cliente del Sistema Integral seleccionado
                    </p>
                    <p className="text-sm text-green-800">
                      Los datos básicos se completarán automáticamente.
                    </p>
                  </div>
                )}
              </div>

              {creationMode === "excel" && (
                <div className="mt-4 p-5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-brand-primary">Importar desde Excel</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Descarga la plantilla, completa los datos y súbela para autocompletar el formulario.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-primary bg-white border border-brand-primary/30 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Download size={16} />
                      Descargar plantilla
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".xlsx, .xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-[#002f4a] transition-colors shadow-sm"
                    >
                      <Upload size={16} />
                      Importar Excel
                    </button>
                  </div>

                  {excelError && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded bg-red-50 border border-red-200">
                      <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800">{excelError}</p>
                    </div>
                  )}

                  {excelWarning && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded bg-amber-50 border border-amber-200">
                      <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">{excelWarning}</p>
                    </div>
                  )}

                  {isExcelImported && !excelError && (
                    <div className="mt-4 p-3 rounded bg-green-50 border border-green-200">
                      <p className="text-sm font-medium text-green-800">
                        ✓ Datos importados desde plantilla Excel. Revise la información antes de crear el cliente.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </FormCard>

            <FormCard
              title={isSiClientSelected ? "Datos del Sistema Integral" : "Datos del Cliente"}
              icon="👤"
              color="#00395A"
              required
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Razón Social *"
                  value={form.businessName}
                  onChange={(v) => updateField("businessName", v)}
                  onBlur={() => markFieldAsTouched("businessName")}
                  error={shouldShowFieldError("businessName") ? validationErrors.businessName : ""}
                  placeholder="Ej. Empresa S.A.C."
                  disabled={isSiClientSelected}
                />

                <FormInput
                  label="Correo Corporativo *"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  onBlur={() => markFieldAsTouched("email")}
                  error={shouldShowFieldError("email") ? validationErrors.email : ""}
                  placeholder="contacto@empresa.com"
                  type="email"
                  disabled={isSiClientSelected}
                />

                <FormInput
                  label="Número de RUC *"
                  value={form.ruc}
                  onChange={(v) => updateField("ruc", v)}
                  onBlur={() => markFieldAsTouched("ruc")}
                  error={shouldShowFieldError("ruc") ? validationErrors.ruc : ""}
                  placeholder="Ej. 20123456789"
                  disabled={isSiClientSelected}
                />

                <FormSelect
                  label="Rubro *"
                  value={form.industry}
                  onChange={(v) => updateField("industry", v)}
                  onBlur={() => markFieldAsTouched("industry")}
                  error={shouldShowFieldError("industry") ? validationErrors.industry : ""}
                  options={industryOptions}
                  placeholder="-- Seleccione Rubro --"
                />
              </div>

              {isSiClientSelected && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex gap-2">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Los campos provenientes del Sistema Integral están bloqueados y no pueden editarse.
                  </p>
                </div>
              )}
            </FormCard>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Resumen
                </div>
                <div className="mt-2 text-lg font-extrabold">Nuevo Cliente</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                  <p className="text-lg font-bold text-brand-primary">{clientCode}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Origen</p>
                  <p className="text-sm font-bold text-brand-primary">
                    {isExcelImported ? "Plantilla Excel" : isSiClientSelected ? "Sistema Integral" : "Manual"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Progreso</p>
                  <div className="mt-1">
                    <div className="text-sm font-bold text-amber-600">
                      {completionPercentage}% completado
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-amber-500 transition-all"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Campos Requeridos
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className={form.businessName ? "text-green-600" : "text-slate-400"}>
                      {form.businessName ? "✓" : "○"} Razón Social
                    </li>
                    <li className={form.email ? "text-green-600" : "text-slate-400"}>
                      {form.email ? "✓" : "○"} Correo Corporativo
                    </li>
                    <li className={form.ruc ? "text-green-600" : "text-slate-400"}>
                      {form.ruc ? "✓" : "○"} RUC
                    </li>
                    <li className={form.industry ? "text-green-600" : "text-slate-400"}>
                      {form.industry ? "✓" : "○"} Rubro
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    <span className="text-red-500">*</span> Campos obligatorios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/clients")}
            validationErrorList={[
              ...validationErrorList,
              ...(excelError ? [excelError] : []),
            ]}
            submitAttempted={submitAttempted}
            submitLabel="Crear Cliente"
            cancelLabel="Cancelar"
            isLoading={loading}
            validationTitle="Faltan campos obligatorios."
          />
        </div>
      </form>
    </div>
  );
}
