import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RECENT_NEW_USER_KEY = "odiseo_recent_new_user";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  createUser,
  getNextUserCode,
  findDuplicateUser,
  findActiveSiCodeDuplicate,
  getCurrentUser,
} from "../../../shared/data/userStorage";
import { registerUserStatusChange } from "../../../shared/data/userStatusStorage";
import { mockSendEmail } from "../../../shared/data/notificationStorage";
import { getCatalogOptions } from "../../../shared/catalogs";
import { ROLE_LABELS } from "../../../shared/data/userStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import SystemIntegrationUserSearch from "../../../shared/components/forms/SystemIntegrationUserSearch";

interface FormState {
  // Datos ODISEO (todos editables)
  workerCode: string;
  fullName: string;
  email: string;
  position: string;
  area: string;
  role: string;

  // Sincronización SI (opcional)
  siUserCode?: string;
  siUserName?: string;
  siStatus?: string;
}

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [userCode] = useState(getNextUserCode());

  const [form, setForm] = useState<FormState>({
    workerCode: "",
    fullName: "",
    email: "",
    position: "",
    area: "",
    role: "",
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [siSearchQuery, setSiSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUser = getCurrentUser();

  const areaOptions = useMemo(() => getCatalogOptions("area"), []);
  const roleOptions = useMemo(() =>
    Object.entries(ROLE_LABELS).map(([value, label]) => ({
      value,
      label,
    })), []);

  const handleSiUserSelect = (vendor: any) => {
    setForm((prev) => ({
      ...prev,
      siUserCode: vendor.code,
      siUserName: vendor.name,
      siStatus: vendor.status,
    }));
    setSiSearchQuery("");
  };

  const handleClearSiUser = () => {
    setForm((prev) => ({
      ...prev,
      siUserCode: undefined,
      siUserName: undefined,
      siStatus: undefined,
    }));
    setSiSearchQuery("");
  };

  useEffect(() => {
    setHeader({
      title: "Registrar Usuario ODISEO",
      breadcrumbs: [
        { label: "Usuarios", href: "/users" },
        { label: "Registrar Usuario" },
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
      errors.position = "Ingresa el puesto.";
    }

    if (!form.area) {
      errors.area = "Selecciona el área.";
    }

    if (!form.role) {
      errors.role = "Selecciona el rol ODISEO.";
    }

    return errors;
  }, [form]);

  const completionPercentage = useMemo(() => {
    const requiredChecks = [
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
    setErrorMessage(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Validar duplicados en ODISEO
    const duplicate = findDuplicateUser(
      form.email.trim(),
      form.workerCode.trim()
    );

    if (duplicate) {
      setErrorMessage(
        "No se puede registrar porque ya existe un usuario con el mismo correo o código de trabajador."
      );
      return;
    }

    // Validar duplicado de SI si está vinculado
    if (form.siUserCode) {
      const siDuplicate = findActiveSiCodeDuplicate(form.siUserCode);
      if (siDuplicate) {
        setErrorMessage(
          "Este usuario del Sistema Integral ya está vinculado a otro usuario ODISEO activo."
        );
        return;
      }
    }

    setLoading(true);
    try {
      const tempPassword = Math.random().toString(36).substring(2, 10);
      const syncStatus = form.siUserCode ? "synced" : "pending_sync";
      const userStatus = form.siUserCode ? "pending_activation" : "pending_sync";

      const newUser = createUser({
        email: form.email,
        password: tempPassword,
        fullName: form.fullName,
        workerCode: form.workerCode,
        position: form.position,
        role: form.role as any,
        status: userStatus as any,
        area: form.area || undefined,
        siUserCode: form.siUserCode,
        siUserName: form.siUserName,
        siStatus: form.siStatus,
        syncStatus: syncStatus as any,
      });

      registerUserStatusChange(
        newUser.id,
        null,
        userStatus as any,
        currentUser?.id || "system",
        syncStatus === "synced"
          ? "Usuario creado - vinculado con Sistema Integral"
          : "Usuario creado - pendiente de sincronización"
      );

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

      setSuccessMessage("Usuario registrado correctamente.");
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
            {/* Bloque 1: Datos del Usuario ODISEO */}
            <FormCard title="Datos del Usuario ODISEO" icon="👤" color="#00395A" required>
              <div className="space-y-4">
                {/* Fila 1: Código Trabajador, Nombre */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Código Trabajador"
                    value={form.workerCode}
                    onChange={(value) => setForm({ ...form, workerCode: value })}
                    placeholder="Ej: EJC-000001"
                    error={submitAttempted ? validationErrors.workerCode : undefined}
                  />
                  <FormInput
                    label="Nombre Completo"
                    value={form.fullName}
                    onChange={(value) => setForm({ ...form, fullName: value })}
                    placeholder="Ej: Juan Pérez García"
                    error={submitAttempted ? validationErrors.fullName : undefined}
                  />
                </div>

                {/* Fila 2: Correo Corporativo, Puesto */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Correo Corporativo"
                    value={form.email}
                    onChange={(value) => setForm({ ...form, email: value })}
                    type="email"
                    placeholder="Ej: juan.perez@amcor.com"
                    error={submitAttempted ? validationErrors.email : undefined}
                  />
                  <FormInput
                    label="Puesto"
                    value={form.position}
                    onChange={(value) => setForm({ ...form, position: value })}
                    placeholder="Ej: Ejecutivo de Ventas"
                    error={submitAttempted ? validationErrors.position : undefined}
                  />
                </div>

                {/* Fila 3: Área, Rol ODISEO */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    label="Área"
                    value={form.area}
                    onChange={(value) => setForm({ ...form, area: value })}
                    options={areaOptions}
                    placeholder="Selecciona el área"
                    error={submitAttempted ? validationErrors.area : undefined}
                  />
                  <FormSelect
                    label="Rol ODISEO"
                    value={form.role}
                    onChange={(value) => setForm({ ...form, role: value })}
                    options={roleOptions}
                    placeholder="Selecciona el rol"
                    error={submitAttempted ? validationErrors.role : undefined}
                  />
                </div>

                {/* Estado ODISEO */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Estado ODISEO</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        form.siUserCode
                          ? "bg-amber-100 text-amber-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {form.siUserCode ? "Pendiente de activación" : "Pendiente de sincronización"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {form.siUserCode
                      ? "Usuario vinculado con Sistema Integral."
                      : "Usuario sin vincular. Podrás hacerlo después o desde esta pantalla."}
                  </p>
                </div>
              </div>
            </FormCard>

            {/* Bloque 2: Sincronización con Sistema Integral */}
            <FormCard title="Sincronización con Sistema Integral (Opcional)" icon="🔗" color="#00A1DE">
              <div className="space-y-4">
                {!form.siUserCode ? (
                  <>
                    <SystemIntegrationUserSearch
                      value={siSearchQuery}
                      onChange={setSiSearchQuery}
                      onSelect={handleSiUserSelect}
                      placeholder="Buscar usuario del Sistema Integral..."
                      disabled={false}
                    />
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                      <span className="font-semibold">Información:</span> Si no vinculas ahora, el usuario quedará como "Pendiente de sincronización" y podrás vincularlo después desde la lista de usuarios.
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Código Sistema Integral
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono font-semibold text-slate-900">
                          {form.siUserCode}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Nombre Sistema Integral
                      </p>
                      <p className="text-sm text-slate-700 font-medium">{form.siUserName}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Estado Sistema Integral
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                          form.siStatus === "Activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {form.siStatus}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearSiUser}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Quitar vinculación
                    </button>
                  </div>
                )}
              </div>
            </FormCard>
          </div>

          {/* Resumen lateral */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Resumen
                </div>
                <div className="mt-2 text-lg font-extrabold">Registro de Usuario</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                  <p className="text-lg font-bold text-brand-primary">{userCode}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Estado ODISEO</p>
                  <p
                    className={`text-sm font-bold ${
                      form.siUserCode
                        ? "text-amber-600"
                        : "text-purple-600"
                    }`}
                  >
                    {form.siUserCode ? "Pendiente de activación" : "Pendiente de sincronización"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Sincronización</p>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${
                      form.siUserCode
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {form.siUserCode ? "Sincronizado" : "Pendiente"}
                  </span>
                </div>

                {form.siUserCode && (
                  <>
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Datos Sistema Integral
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-xs text-slate-600">Código:</p>
                          <p className="font-mono font-semibold text-slate-900">{form.siUserCode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Nombre:</p>
                          <p className="font-semibold text-slate-900">{form.siUserName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Estado:</p>
                          <p className="font-semibold text-slate-900">{form.siStatus}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
                    6 Campos Requeridos
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className={form.workerCode ? "text-green-600" : "text-slate-400"}>
                      {form.workerCode ? "✓" : "○"} Código Trabajador
                    </li>
                    <li className={form.fullName ? "text-green-600" : "text-slate-400"}>
                      {form.fullName ? "✓" : "○"} Nombre Completo
                    </li>
                    <li className={form.email ? "text-green-600" : "text-slate-400"}>
                      {form.email ? "✓" : "○"} Correo Corporativo
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

        {errorMessage && (
          <div className="mx-auto max-w-3xl mt-4">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/users")}
            validationErrorList={validationErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Registrar Usuario"
            cancelLabel="Cancelar"
            isLoading={loading}
            validationTitle="Faltan campos obligatorios."
          />
        </div>
      </form>
    </div>
  );
}
