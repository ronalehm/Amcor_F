import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";

import { useLayout } from "../../../components/layout/LayoutContext";
import {
  createUser,
  findDuplicateUser,
  getNextUserCode,
  getUserByEmail,
} from "../../../shared/data/userStorage";
import { mockSendEmail } from "../../../shared/data/notificationStorage";
import {
  ROLE_PROFILES,
  suggestRoleByArea,
} from "../../../shared/security/roleProfiles";
import InfoTooltip from "../../../shared/components/ui/InfoTooltip";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import ExcelTemplateActions from "../../../shared/components/forms/ExcelTemplateActions";

const RECENT_NEW_USER_KEY = "odiseo_recent_new_user";

interface FormState {
  email: string;
  odiseoUser: string;
  workerCode: string;
  fullName: string;
  position: string;
  area: string;
  role: string;
}

type ExplicitFlowState = "initial" | "existingEmailFound" | "newEmailConfirmed";
type ComputedFlowState =
  | ExplicitFlowState
  | "incompleteData"
  | "readyToRegister";

interface ImportedUserData extends Partial<FormState> {}

const USER_AREA_OPTIONS = [
  { value: "TI", label: "TI" },
  { value: "Comercial", label: "Comercial" },
  { value: "Master Data", label: "Master Data" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "R&D", label: "R&D" },
];

const EMPTY_VALUE = "-";

const PROFILES_INFO = "Administrador: acceso total al portal ODISEO.\n\nTI Soporte: soporte técnico, gestión de usuarios, auditoría y configuración.\n\nMaster Data: gestión de datos maestros, catálogos, restricciones, productos y portafolios.\n\nComercial: gestión comercial de portafolios, clientes y consulta de productos.\n\nCustomer Service: consulta, seguimiento y creación/actualización de portafolios y productos según casuística.\n\nR&D: creación y actualización de productos; soporte técnico funcional del producto.\n\nSolo Consulta: acceso solo lectura.";

function formatPreviewValue(value?: string) {
  return value?.trim() ? value : EMPTY_VALUE;
}

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [userCode] = useState(getNextUserCode());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    email: "",
    odiseoUser: "",
    workerCode: "",
    fullName: "",
    position: "",
    area: "",
    role: "",
  });

  const [explicitFlowState, setExplicitFlowState] =
    useState<ExplicitFlowState>("initial");

  const [emailValidationMessage, setEmailValidationMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingUserPreview, setExistingUserPreview] = useState<any | null>(null);

  const roleOptions = useMemo(
    () =>
      ROLE_PROFILES.map(
        (profile) => ({
          value: profile.code,
          label: profile.name,
        })
      ),
    []
  );

  const selectedRoleProfile = useMemo(
    () => ROLE_PROFILES.find((profile) => profile.code === form.role),
    [form.role]
  );

  const flowState = useMemo((): ComputedFlowState => {
    if (explicitFlowState !== "newEmailConfirmed") return explicitFlowState;

    const requiredFieldsComplete =
      form.email &&
      form.odiseoUser &&
      form.workerCode &&
      form.fullName &&
      form.position &&
      form.area &&
      form.role;

    return requiredFieldsComplete ? "readyToRegister" : "incompleteData";
  }, [explicitFlowState, form]);

  useEffect(() => {
    setHeader({
      title: "Registrar Usuario ODISEO",
      breadcrumbs: [
        { label: "Inicio", href: "/" },
        { label: "Usuarios", href: "/users" },
        { label: "Registrar Usuario" },
      ],
      badges: (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            ID: {userCode}
          </span>
        </div>
      ),
    });

    return () => resetHeader();
  }, [setHeader, resetHeader, userCode]);

  useEffect(() => {
    const normalizedEmail = form.email.toLowerCase().trim();

    if (!normalizedEmail) {
      setEmailValidationMessage(null);
      setExplicitFlowState("initial");
      setIsValidatingEmail(false);
      return;
    }

    setIsValidatingEmail(true);

    const timeoutId = window.setTimeout(() => {
      validateCorporateEmail(normalizedEmail);
      setIsValidatingEmail(false);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [form.email]);

  const validateCorporateEmail = (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail) {
      setEmailValidationMessage(null);
      setExplicitFlowState("initial");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailValidationMessage({
        type: "error",
        text: "El formato del correo no es válido.",
      });
      setExplicitFlowState("initial");
      return;
    }

    const existingUser = getUserByEmail(normalizedEmail);

    if (existingUser) {
      setExistingUserPreview(existingUser);

      setEmailValidationMessage({
        type: "error",
        text: "El correo corporativo ya se encuentra registrado en ODISEO. No es posible continuar con el registro.",
      });

      setExplicitFlowState("existingEmailFound");
      return;
    }

    setExistingUserPreview(null);

    setEmailValidationMessage({
      type: "success",
      text: "Correo no encontrado en ODISEO. Puedes continuar con el registro.",
    });

    setExplicitFlowState("newEmailConfirmed");
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "-";
    return (
      ROLE_PROFILES.find((profile) => profile.code === role)?.name || role
    );
  };

  const getUserStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "pending_activation":
        return "Pendiente de activación";
      case "pending_validation":
        return "Pendiente de validación";
      case "pending_sync":
        return "Pendiente de sincronización";
      case "blocked":
        return "Bloqueado";
      default:
        return status || "-";
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Correo Corporativo",
      "Usuario ODISEO",
      "Código Trabajador",
      "Nombre Completo",
      "Puesto",
      "Área",
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "plantilla_usuario_odiseo.xlsx");
  };

  const parseUserTemplate = (file: File): Promise<ImportedUserData | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            console.error("No data found in template");
            resolve(null);
            return;
          }

          const firstRow = jsonData[0] as Record<string, any>;
          const imported: ImportedUserData = {};

          if (firstRow["Correo Corporativo"]) {
            imported.email = String(firstRow["Correo Corporativo"]).trim();
          }

          if (firstRow["Usuario ODISEO"]) {
            imported.odiseoUser = String(firstRow["Usuario ODISEO"]).trim();
          }

          if (firstRow["Código Trabajador"]) {
            imported.workerCode = String(firstRow["Código Trabajador"]).trim();
          }

          if (firstRow["Nombre Completo"]) {
            imported.fullName = String(firstRow["Nombre Completo"]).trim();
          }

          if (firstRow["Puesto"]) {
            imported.position = String(firstRow["Puesto"]).trim();
          }

          if (firstRow["Área"]) {
            imported.area = String(firstRow["Área"]).trim();
          }

          resolve(imported);
        } catch (error) {
          console.error("Error parsing template:", error);
          resolve(null);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleUploadTemplate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imported = await parseUserTemplate(file);

    if (imported && imported.email) {
      const suggestedRole = imported.area
        ? suggestRoleByArea(imported.area)
        : form.role;

      setForm((prev) => ({
        ...prev,
        ...imported,
        role: suggestedRole,
      }));

      validateCorporateEmail(imported.email);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAreaChange = (area: string) => {
    const suggestedRole = suggestRoleByArea(area);

    setForm((prev) => ({
      ...prev,
      area,
      role: suggestedRole,
    }));
  };

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!form.email.trim()) {
      errors.email = "Ingresa el correo corporativo.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "El formato del correo no es válido.";
    }

    if (flowState !== "initial" && flowState !== "existingEmailFound") {
      if (!form.odiseoUser.trim()) {
        errors.odiseoUser = "Ingresa el usuario ODISEO.";
      }

      if (!form.workerCode.trim()) {
        errors.workerCode = "Ingresa el código de trabajador.";
      }

      if (!form.fullName.trim()) {
        errors.fullName = "Ingresa el nombre completo.";
      }

      if (!form.position.trim()) {
        errors.position = "Ingresa el puesto.";
      }

      if (!form.area) {
        errors.area = "Selecciona el área.";
      }

      if (!form.role) {
        errors.role = "Selecciona el perfil ODISEO.";
      }
    }

    return errors;
  }, [form, flowState]);

  const completionPercentage = useMemo(() => {
    const requiredChecks = [
      Boolean(form.email.trim()) && explicitFlowState === "newEmailConfirmed",
      Boolean(form.odiseoUser.trim()),
      Boolean(form.workerCode.trim()),
      Boolean(form.fullName.trim()),
      Boolean(form.position.trim()),
      Boolean(form.area),
      Boolean(form.role),
    ];

    const completed = requiredChecks.filter(Boolean).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [form, explicitFlowState]);

  const validationErrorList = Object.values(validationErrors).filter(
    (error): error is string => Boolean(error)
  );

  const shouldDisableSubmit =
    Boolean(existingUserPreview) ||
    explicitFlowState === "existingEmailFound" ||
    flowState !== "readyToRegister" ||
    validationErrorList.length > 0;

  const submitErrorList =
    shouldDisableSubmit && flowState !== "readyToRegister"
      ? ["Completa todos los pasos requeridos."]
      : validationErrorList;

  const checklistItems = [
    {
      label: "Correo Corporativo",
      complete:
        Boolean(form.email.trim()) && explicitFlowState === "newEmailConfirmed",
    },
    { label: "Usuario ODISEO", complete: Boolean(form.odiseoUser.trim()) },
    { label: "Código Trabajador", complete: Boolean(form.workerCode.trim()) },
    { label: "Nombre Completo", complete: Boolean(form.fullName.trim()) },
    { label: "Puesto", complete: Boolean(form.position.trim()) },
    { label: "Área", complete: Boolean(form.area) },
    { label: "Perfil ODISEO", complete: Boolean(form.role) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (shouldDisableSubmit || Object.keys(validationErrors).length > 0) {
      return;
    }

    const duplicateByEmail = getUserByEmail(form.email.trim().toLowerCase());

    if (duplicateByEmail) {
      setErrorMessage(
        "No se puede registrar porque el correo corporativo ya existe en ODISEO."
      );
      setExplicitFlowState("existingEmailFound");
      return;
    }

    const duplicateByWorkerCode = findDuplicateUser(
      "",
      form.workerCode.trim()
    );

    if (duplicateByWorkerCode) {
      setErrorMessage(
        "No se puede registrar porque el código de trabajador ya existe en ODISEO. Revisa el código ingresado."
      );
      return;
    }

    setLoading(true);

    try {
      const tempPassword = Math.random().toString(36).substring(2, 10);

      const newUser = createUser({
        email: form.email.trim().toLowerCase(),
        password: tempPassword,
        fullName: form.fullName.trim(),
        workerCode: form.workerCode.trim(),
        position: form.position.trim(),
        role: form.role as any,
        status: "pending_activation" as any,
        area: form.area || undefined,
      });

      mockSendEmail(
        newUser.email,
        "Bienvenido a ODISEO - Activación de Cuenta",
        `Hola ${newUser.fullName.split(" ")[0]},\n\nTu cuenta ha sido creada en ODISEO.\n\nEquipo ODISEO`,
        newUser.id,
        "activation"
      );

      localStorage.setItem(
        RECENT_NEW_USER_KEY,
        JSON.stringify({
          userId: newUser.id,
          expiresAt: Date.now() + 10 * 1000,
        })
      );

      window.dispatchEvent(
        new CustomEvent("newUserCreated", {
          detail: { userId: newUser.id },
        })
      );

      setSuccessMessage("Usuario ODISEO registrado correctamente.");
      setTimeout(() => navigate("/users"), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="max-w-md rounded-lg border-2 border-green-300 bg-green-50 p-8 text-center">
          <div className="mb-4 text-4xl">✓</div>
          <p className="text-lg font-bold text-green-900">{successMessage}</p>
          <p className="mt-2 text-sm text-green-700">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <button
        type="button"
        onClick={() => navigate("/users")}
        className="mb-5 flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-primary"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-270px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard
              title="1. Identificación"
              icon="📧"
              color="#6366F1"
              required
              infoTitle="Identificar usuario"
              infoContent="Ingresa el correo corporativo para validar si el usuario ya existe en ODISEO. Si el correo ya está registrado, no se podrá continuar con el alta."
            >
              <div className="space-y-4">
                <FormInput
                  label="Correo Corporativo"
                  value={form.email}
                  onChange={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      email: value,
                      odiseoUser: "",
                      workerCode: "",
                      fullName: "",
                      position: "",
                      area: "",
                      role: "",
                    }));

                    setExistingUserPreview(null);
                    setEmailValidationMessage(null);
                    setExplicitFlowState("initial");
                    setErrorMessage(null);
                    setSubmitAttempted(false);
                  }}
                  type="email"
                  placeholder="Ej: juan.perez@amcor.com"
                  error={submitAttempted ? validationErrors.email : undefined}
                  required
                />

                {isValidatingEmail && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                    Validando correo corporativo...
                  </div>
                )}

                {emailValidationMessage && (
                  <div
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                      emailValidationMessage.type === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {emailValidationMessage.text}
                  </div>
                )}
              </div>
            </FormCard>

            {explicitFlowState === "newEmailConfirmed" && (
              <>
                <FormCard
                  title="2. Datos ODISEO"
                  icon="👤"
                  color="#00395A"
                  required
                  infoTitle="Datos del usuario ODISEO"
                  infoContent="Completa los datos propios del usuario dentro del portal. Puedes ingresar la información manualmente o cargar una plantilla Excel después de validar que el correo no existe."
                  action={
                    <ExcelTemplateActions
                      onDownloadTemplate={handleDownloadTemplate}
                      onUploadTemplateClick={() => fileInputRef.current?.click()}
                    />
                  }
                >
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleUploadTemplate}
                      className="hidden"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormInput
                        label="Usuario ODISEO"
                        value={form.odiseoUser}
                        onChange={(value) =>
                          setForm({ ...form, odiseoUser: value })
                        }
                        placeholder="Ej: jperez o juan.perez"
                        error={
                          submitAttempted
                            ? validationErrors.odiseoUser
                            : undefined
                        }
                        required
                      />

                      <FormInput
                        label="Código Trabajador"
                        value={form.workerCode}
                        onChange={(value) =>
                          setForm({ ...form, workerCode: value })
                        }
                        placeholder="Ej: TRB-000001 o 102345"
                        error={
                          submitAttempted
                            ? validationErrors.workerCode
                            : undefined
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormInput
                        label="Nombre Completo"
                        value={form.fullName}
                        onChange={(value) =>
                          setForm({ ...form, fullName: value })
                        }
                        placeholder="Ej: Juan Pérez García"
                        error={
                          submitAttempted
                            ? validationErrors.fullName
                            : undefined
                        }
                        required
                      />

                      <FormInput
                        label="Puesto"
                        value={form.position}
                        onChange={(value) =>
                          setForm({ ...form, position: value })
                        }
                        placeholder="Ej: Analista TI, Data Manager o Ejecutivo Comercial"
                        error={
                          submitAttempted
                            ? validationErrors.position
                            : undefined
                        }
                        required
                      />
                    </div>
                  </div>
                </FormCard>

                <FormCard
                  title="3. Área y perfil"
                  icon="🧩"
                  color="#0EA5E9"
                  required
                  infoTitle="Organización y perfil"
                  infoContent="El área y el puesto son datos organizacionales. El Perfil ODISEO es el que define los permisos del usuario dentro del portal."
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormSelect
                        label="Área"
                        value={form.area}
                        onChange={handleAreaChange}
                        options={USER_AREA_OPTIONS}
                        placeholder="Selecciona el área"
                        error={submitAttempted ? validationErrors.area : undefined}
                        required
                      />

                      <FormSelect
                        label="Perfil ODISEO"
                        value={form.role}
                        onChange={(value) => setForm({ ...form, role: value })}
                        options={roleOptions}
                        placeholder="Selecciona el perfil"
                        error={submitAttempted ? validationErrors.role : undefined}
                        required
                        labelAction={
                          <InfoTooltip
                            title="Perfiles ODISEO"
                            content={PROFILES_INFO}
                          />
                        }
                      />
                    </div>
                  </div>
                </FormCard>
              </>
            )}
          </div>

          <div className="space-y-5">
            <div className="sticky top-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="text-lg font-extrabold text-slate-800">
                  {existingUserPreview ? "Usuario encontrado" : "Confirmar alta"}
                </div>
                {!existingUserPreview && (
                  <div className="mt-1 text-xs font-medium text-slate-500">
                    Revisa los datos antes de registrar
                  </div>
                )}
              </div>

              <div className="space-y-5 p-5">
                {existingUserPreview ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                        Usuario encontrado
                      </p>
                      <p className="mt-1 text-sm text-red-700">
                        Este correo ya pertenece a un usuario ODISEO.
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-base font-extrabold text-slate-900">
                        {existingUserPreview.fullName || "-"}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {existingUserPreview.email || "-"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Código ODISEO: {existingUserPreview.code || "-"}
                      </p>

                      <div className="mt-4 grid gap-2 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Código trabajador</span>
                          <span className="font-semibold text-slate-800">
                            {existingUserPreview.workerCode || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Usuario ODISEO</span>
                          <span className="font-semibold text-slate-800">
                            {existingUserPreview.odiseoUser ||
                              existingUserPreview.fullName ||
                              "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Área</span>
                          <span className="font-semibold text-slate-800">
                            {existingUserPreview.area || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Perfil</span>
                          <span className="font-semibold text-slate-800">
                            {getRoleLabel(existingUserPreview.role)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Estado actual</span>
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                            {getUserStatusLabel(existingUserPreview.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : completionPercentage < 100 ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                        Registro incompleto
                      </p>
                      <p className="mt-2 text-sm font-semibold text-amber-900">
                        Faltan {7 - checklistItems.filter((item) => item.complete).length} campos requeridos:
                      </p>
                      <ul className="mt-3 space-y-1">
                        {checklistItems
                          .filter((item) => !item.complete)
                          .map((item) => (
                            <li
                              key={item.label}
                              className="text-sm text-amber-800"
                            >
                              - {item.label}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                        Listo para registrar
                      </p>
                      <p className="mt-1 text-sm text-green-800">
                        Todos los datos requeridos están completos.
                      </p>
                    </div>

                    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          Usuario
                        </p>
                        <div className="mt-1 space-y-1">
                          <p className="font-semibold text-slate-800">
                            {formatPreviewValue(form.fullName)}
                          </p>
                          <p className="text-slate-600">
                            {formatPreviewValue(form.email)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Código: {formatPreviewValue(form.workerCode)}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          Acceso
                        </p>
                        <div className="mt-1 space-y-1">
                          <p className="text-slate-700">
                            <span className="font-semibold">Área:</span>{" "}
                            {formatPreviewValue(form.area)}
                          </p>
                          <p className="text-slate-700">
                            <span className="font-semibold">Perfil:</span>{" "}
                            {selectedRoleProfile?.name || EMPTY_VALUE}
                          </p>
                        </div>
                      </div>

                      {selectedRoleProfile && (
                        <div className="border-t border-slate-200 pt-3">
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Permisos principales
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {selectedRoleProfile.description}
                          </p>
                        </div>
                      )}

                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          Resultado al guardar
                        </p>
                        <p className="mt-1 text-sm font-semibold text-purple-700">
                          Pendiente de activación
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-auto mt-4 max-w-3xl">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/users")}
            validationErrorList={submitErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Registrar Usuario"
            cancelLabel="Cancelar"
            isLoading={loading}
            validationTitle={
              flowState !== "readyToRegister"
                ? "Completa todos los pasos requeridos."
                : "Faltan campos obligatorios."
            }
          />
        </div>
      </form>
    </div>
  );
}