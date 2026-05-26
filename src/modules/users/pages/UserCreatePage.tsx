import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RECENT_NEW_USER_KEY = "odiseo_recent_new_user";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  createUser,
  getNextUserCode,
  findDuplicateUser,
  getCurrentUser,
} from "../../../shared/data/userStorage";
import { registerUserStatusChange } from "../../../shared/data/userStatusStorage";
import { mockSendEmail } from "../../../shared/data/notificationStorage";
import { getRoleByAreaAndPosition } from "../../../shared/data/areaDepartmentConfig";
import { ROLE_LABELS } from "../../../shared/data/userStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import SystemIntegrationUserSearch from "../../../shared/components/forms/SystemIntegrationUserSearch";
import { type VendorMirror } from "../../../shared/data/vendorMirrorStorage";

interface FormState {
  email: string;
  fullName: string;
  workerCode: string;
  position: string;
  area: string;
  role: string;
  siUserId?: string;
  siUserCode?: string;
}

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [userCode] = useState(getNextUserCode());

  const [form, setForm] = useState<FormState>({
    email: "",
    fullName: "",
    workerCode: "",
    position: "",
    area: "",
    role: "",
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = getCurrentUser();

  const handleSiUserSelect = (vendor: VendorMirror) => {
    const suggestedRole = getRoleByAreaAndPosition(vendor.area, vendor.position);
    setForm((prev) => ({
      ...prev,
      siUserId: vendor.id,
      siUserCode: vendor.code,
      workerCode: vendor.code,
      email: vendor.email || "",
      fullName: vendor.name,
      area: vendor.area,
      position: vendor.position || "",
      role: suggestedRole,
    }));
    setSearchQuery("");
  };

  useEffect(() => {
    setHeader({
      title: "Registrar Acceso ODISEO",
      breadcrumbs: [
        { label: "Usuarios", href: "/users" },
        { label: "Registrar Acceso" },
      ],
      badges: (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          ID: {userCode}
        </span>
      ),
    });
    return () => resetHeader();
  }, [setHeader, resetHeader, userCode]);


  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!form.siUserId) {
      errors.siUserId = "Selecciona un usuario válido del Sistema Integral.";
    }

    if (!form.workerCode.trim()) {
      errors.workerCode = "Ingresa el código de trabajador.";
    }

    if (!form.fullName.trim()) {
      errors.fullName = "Ingresa el nombre completo.";
    }

    if (!form.email.trim()) {
      errors.email = "Ingresa el correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "El formato del correo no es válido.";
    }

    if (!form.position.trim()) {
      errors.position = "Selecciona el puesto.";
    }

    if (!form.area) {
      errors.area = "Selecciona el área.";
    }

    if (!form.role) {
      errors.role = "Selecciona el Rol ODISEO que tendrá el usuario dentro del portal.";
    }

    return errors;
  }, [form]);

  const completionPercentage = useMemo(() => {
    const requiredChecks = [
      Boolean(form.siUserId),
      Boolean(form.workerCode.trim()),
      Boolean(form.fullName.trim()),
      Boolean(form.email.trim()),
      Boolean(form.position.trim()),
      Boolean(form.area),
      Boolean(form.role),
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
    setDuplicateMessage(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const duplicate = findDuplicateUser(
        form.email.trim(),
        form.workerCode.trim(),
        form.siUserId,
        form.siUserCode
      );

      if (duplicate) {
        setDuplicateMessage(
          `No se puede registrar el usuario porque ya existe un registro con el mismo correo corporativo o código de trabajador. Usuario existente: ${duplicate.fullName}.`
        );
        setLoading(false);
        return;
      }

      const tempPassword = Math.random().toString(36).substring(2, 10);

      const newUser = createUser({
        email: form.email,
        password: tempPassword,
        fullName: form.fullName,
        workerCode: form.workerCode,
        position: form.position,
        role: form.role as any,
        status: "pending_activation",
        area: form.area || undefined,
        siUserId: form.siUserId,
        siUserCode: form.siUserCode,
      });

      registerUserStatusChange(
        newUser.id,
        null,
        "pending_activation",
        currentUser?.id || "system",
        "Usuario creado - pendiente activación"
      );

      mockSendEmail(
        newUser.email,
        "Bienvenido a ODISEO - Activación de Cuenta",
        `Hola ${newUser.fullName.split(" ")[0]},\n\nTu cuenta ha sido creada en ODISEO. Por favor actívala para continuar.\n\nEquipo ODISEO`,
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

      setSuccessMessage("Usuario creado correctamente. Se envió el correo de activación.");
      setTimeout(() => navigate("/users"), 2000);
    } finally {
      setLoading(false);
    }
  };


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

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <button
        type="button"
        onClick={() => navigate("/users")}
        className="mb-3 flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard title="Datos del Usuario" icon="👤" color="#00395A" required>
              <div className="space-y-4">
                {/* Búsqueda Sistema Integral */}
                <SystemIntegrationUserSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleSiUserSelect}
                  placeholder="Buscar usuario del Sistema Integral..."
                />

                {/* Fila 1: Código Trabajador, Nombre (Read-only) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Código Trabajador"
                    value={form.workerCode}
                    disabled
                    placeholder="Importado desde Sistema Integral"
                  />

                  <FormInput
                    label="Nombre"
                    value={form.fullName}
                    disabled
                    placeholder="Importado desde Sistema Integral"
                  />
                </div>

                {/* Fila 2: Correo Corporativo, Puesto (Read-only) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Correo Corporativo"
                    value={form.email}
                    disabled
                    type="email"
                    placeholder="Importado desde Sistema Integral"
                  />

                  <FormInput
                    label="Puesto"
                    value={form.position}
                    disabled
                    placeholder="Importado desde Sistema Integral"
                  />
                </div>

                {/* Fila 3: Área, Rol ODISEO (Read-only) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Área"
                    value={form.area}
                    disabled
                    placeholder="Importado desde Sistema Integral"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Rol ODISEO</p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{form.role ? ROLE_LABELS[form.role as any] : "No asignado"}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Se asigna automáticamente según Área y Puesto.</p>
                  </div>
                </div>

                {/* Fila 4: Estado */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Estado</p>
                  <div className="flex items-center">
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700">
                      Pendiente de activación
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">El usuario será creado en este estado.</p>
                </div>
              </div>
            </FormCard>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Resumen
                </div>
                <div className="mt-2 text-lg font-extrabold">Registro de Acceso</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                  <p className="text-lg font-bold text-brand-primary">{userCode}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Estado</p>
                  <p className="text-sm font-bold text-amber-600">Pendiente de activación</p>
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
                    7 Campos Requeridos
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className={form.siUserId ? "text-green-600" : "text-slate-400"}>
                      {form.siUserId ? "✓" : "○"} Usuario Sistema Integral
                    </li>
                    <li className={form.workerCode ? "text-green-600" : "text-slate-400"}>
                      {form.workerCode ? "✓" : "○"} Código Trabajador
                    </li>
                    <li className={form.email ? "text-green-600" : "text-slate-400"}>
                      {form.email ? "✓" : "○"} Correo Corporativo
                    </li>
                    <li className={form.fullName ? "text-green-600" : "text-slate-400"}>
                      {form.fullName ? "✓" : "○"} Nombre
                    </li>
                    <li className={form.position ? "text-green-600" : "text-slate-400"}>
                      {form.position ? "✓" : "○"} Puesto
                    </li>
                    <li className={form.area ? "text-green-600" : "text-slate-400"}>
                      {form.area ? "✓" : "○"} Área
                    </li>
                    <li className={form.role ? "text-green-600" : "text-slate-400"}>
                      {form.role ? "✓" : "○"} Rol ODISEO
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

        {duplicateMessage && (
          <div className="mx-auto max-w-3xl mt-4">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {duplicateMessage}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/users")}
            validationErrorList={validationErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Registrar Acceso"
            cancelLabel="Cancelar"
            isLoading={loading}
            validationTitle="Faltan campos obligatorios."
          />
        </div>
      </form>
    </div>
  );
}
