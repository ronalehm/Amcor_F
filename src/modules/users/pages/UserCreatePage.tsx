import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  createUser,
  getNextUserCode,
  ROLE_LABELS,
  type UserRole,
  type UserStatus,
} from "../../../shared/data/userStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [userCode] = useState(getNextUserCode());

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "viewer" as UserRole,
    status: "active" as UserStatus,
    area: "",
    phone: "",
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setHeader({
      title: "Crear Nuevo Usuario",
      breadcrumbs: [
        { label: "Usuarios", href: "/users" },
        { label: "Crear Usuario" },
      ],
      badges: (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          ID: {userCode}
        </span>
      ),
    });
    return () => resetHeader();
  }, [setHeader, resetHeader, userCode]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!form.email.trim()) {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "El formato del correo no es válido";
    }

    if (!form.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!form.firstName.trim()) {
      errors.firstName = "El nombre es obligatorio";
    }

    if (!form.lastName.trim()) {
      errors.lastName = "El apellido es obligatorio";
    }

    if (!form.role) {
      errors.role = "El rol es obligatorio";
    }

    return errors;
  }, [form]);

  const completionPercentage = useMemo(() => {
    const requiredChecks = [
      Boolean(form.email.trim()),
      Boolean(form.password),
      Boolean(form.confirmPassword),
      Boolean(form.firstName.trim()),
      Boolean(form.lastName.trim()),
      Boolean(form.role),
    ];
    const completed = requiredChecks.filter(Boolean).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0) return;

    createUser({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
      status: form.status,
      area: form.area || undefined,
      phone: form.phone || undefined,
    });

    navigate("/users");
  };

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = [
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
    { value: "pending", label: "Pendiente" },
  ];

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard title="Información de Cuenta" icon="👤" color="#003b5c" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Correo Electrónico *"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  error={submitAttempted ? validationErrors.email : ""}
                  placeholder="usuario@amcor.com"
                  type="email"
                />

                <div className="md:col-span-2" />

                <FormInput
                  label="Contraseña *"
                  value={form.password}
                  onChange={(v) => updateField("password", v)}
                  error={submitAttempted ? validationErrors.password : ""}
                  placeholder="••••••••"
                  type="password"
                />

                <FormInput
                  label="Confirmar Contraseña *"
                  value={form.confirmPassword}
                  onChange={(v) => updateField("confirmPassword", v)}
                  error={submitAttempted ? validationErrors.confirmPassword : ""}
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </FormCard>

            <FormCard title="Datos Personales" icon="📝" color="#1E82D9" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Nombre *"
                  value={form.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  error={submitAttempted ? validationErrors.firstName : ""}
                  placeholder="Ej. Juan"
                />

                <FormInput
                  label="Apellido *"
                  value={form.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  error={submitAttempted ? validationErrors.lastName : ""}
                  placeholder="Ej. Pérez"
                />

                <FormInput
                  label="Teléfono"
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                  placeholder="Ej. +51 999 999 999"
                />

                <FormInput
                  label="Área / Departamento"
                  value={form.area}
                  onChange={(v) => updateField("area", v)}
                  placeholder="Ej. Ventas, R&D, etc."
                />
              </div>
            </FormCard>

            <FormCard title="Rol y Permisos" icon="🔐" color="#7E3FB2" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  label="Rol *"
                  value={form.role}
                  onChange={(v) => updateField("role", v as UserRole)}
                  error={submitAttempted ? validationErrors.role : ""}
                  options={roleOptions}
                  placeholder="-- Seleccione Rol --"
                />

                <FormSelect
                  label="Estado"
                  value={form.status}
                  onChange={(v) => updateField("status", v as UserStatus)}
                  options={statusOptions}
                />
              </div>

              <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-2">Descripción del Rol:</p>
                <p className="text-sm text-slate-600">
                  {form.role === "admin" && "Acceso total al sistema. Puede gestionar usuarios, configuraciones y todas las operaciones."}
                  {form.role === "comercial" && "Gestiona clientes, portafolios y proyectos. Acceso a datos comerciales."}
                  {form.role === "artes" && "Trabaja en especificaciones de diseño y arte de productos."}
                  {form.role === "rd" && "Gestiona especificaciones técnicas, estructura y desarrollo de productos."}
                  {form.role === "finance" && "Acceso a datos financieros, precios y condiciones comerciales."}
                  {form.role === "viewer" && "Solo lectura. Puede visualizar información pero no modificar datos."}
                </p>
              </div>
            </FormCard>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 bg-gradient-to-br from-[#003b5c] to-[#1E82D9] text-white">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Resumen
                </div>
                <div className="mt-2 text-lg font-extrabold">Nuevo Usuario</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                  <p className="text-lg font-bold text-[#003b5c]">{userCode}</p>
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
                    <li className={form.email ? "text-green-600" : "text-slate-400"}>
                      {form.email ? "✓" : "○"} Correo electrónico
                    </li>
                    <li className={form.password ? "text-green-600" : "text-slate-400"}>
                      {form.password ? "✓" : "○"} Contraseña
                    </li>
                    <li className={form.confirmPassword ? "text-green-600" : "text-slate-400"}>
                      {form.confirmPassword ? "✓" : "○"} Confirmar contraseña
                    </li>
                    <li className={form.firstName ? "text-green-600" : "text-slate-400"}>
                      {form.firstName ? "✓" : "○"} Nombre
                    </li>
                    <li className={form.lastName ? "text-green-600" : "text-slate-400"}>
                      {form.lastName ? "✓" : "○"} Apellido
                    </li>
                    <li className={form.role ? "text-green-600" : "text-slate-400"}>
                      {form.role ? "✓" : "○"} Rol
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
            onCancel={() => navigate("/users")}
            validationErrorList={Object.values(validationErrors)}
            submitAttempted={submitAttempted}
            submitLabel="Crear Usuario"
            cancelLabel="Cancelar"
          />
        </div>
      </form>
    </div>
  );
}
