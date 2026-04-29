import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";

import {
  getUserById,
  updateUser,
  ROLE_LABELS,
  STATUS_LABELS,
  getUserByEmail,
  type UserRole,
  type UserStatus,
} from "../../../shared/data/userStorage";
import {
  getActiveVendorsMirror,
  getVendorMirrorByCode,
  getLastSyncTimestamp,
  formatSyncTimestamp,
} from "../../../shared/data/vendorMirrorStorage";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  workerCode: string;
  position: string;
  company: string;
  role: UserRole;
  phone: string;
  area: string;
  siUserId: string;
};

export default function UserEditPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { userId } = useParams<{ userId: string }>();

  const [form, setForm] = useState<UserFormData | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof UserFormData, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [currentVendorCode, setCurrentVendorCode] = useState<string>("");

  const activeVendors = useMemo(() => getActiveVendorsMirror(), []);
  const lastSyncTime = useMemo(() => getLastSyncTimestamp(), []);

  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no válido");
      setLoading(false);
      return;
    }

    const user = getUserById(userId);
    if (!user) {
      setError(`Usuario con ID ${userId} no encontrado`);
      setLoading(false);
      return;
    }

    setUserCode(user.code);
    setCurrentVendorCode(user.siUserCode || "");
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      workerCode: user.workerCode,
      position: user.position,
      company: user.company,
      role: user.role,
      phone: user.phone || "",
      area: user.area || "",
      siUserId: user.siUserId || "",
    });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId && !loading && userCode) {
      setHeader({
        title: "Editar Usuario",
        breadcrumbs: [
          { label: "Usuarios", href: "/users" },
          { label: userCode },
          { label: "Editar" },
        ],
      });
    }
    return () => resetHeader();
  }, [userId, loading, userCode, setHeader, resetHeader]);

  const validationErrors = useMemo(() => {
    if (!form) return {};
    const errors: Partial<Record<keyof UserFormData, string>> = {};

    if (!form.firstName.trim()) errors.firstName = "Ingresa el nombre.";
    if (!form.lastName.trim()) errors.lastName = "Ingresa el apellido.";
    if (!form.email.trim()) {
      errors.email = "Ingresa el correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Ingresa un correo válido.";
    } else {
      const existingUser = getUserByEmail(form.email);
      const currentUser = getUserById(userId || "");
      if (existingUser && existingUser.id !== currentUser?.id) {
        errors.email = "Este correo ya está registrado en el sistema.";
      }
    }
    if (!form.workerCode.trim()) errors.workerCode = "Ingresa el código de trabajador.";
    if (!form.position.trim()) errors.position = "Ingresa el puesto.";
    if (!form.company.trim()) errors.company = "Ingresa la empresa.";
    if (!form.role) errors.role = "Selecciona un rol.";
    if (form.role === "comercial" && !form.siUserId) {
      errors.siUserId = "El vendedor es obligatorio para ejecutivos comerciales.";
    }

    return errors;
  }, [form, userId]);

  const validationErrorList = Object.values(validationErrors).filter(Boolean) as string[];

  const updateField = (field: keyof UserFormData, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const markFieldAsTouched = (field: keyof UserFormData) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const shouldShowFieldError = (field: keyof UserFormData) => {
    return Boolean(validationErrors[field] && (submitAttempted || touchedFields[field]));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0 || !form || !userId) {
      setTouchedFields({
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      });
      return;
    }

    const selectedVendor = activeVendors.find(v => v.id === form.siUserId);

    updateUser(userId, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      workerCode: form.workerCode,
      position: form.position,
      company: form.company,
      role: form.role,
      phone: form.phone || undefined,
      area: form.area || undefined,
      siUserId: form.siUserId || undefined,
      siUserCode: selectedVendor?.code,
    });

    navigate("/users");
  };

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Cargando usuario...</div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">{error || "Error cargando usuario"}</div>
        <button
          onClick={() => navigate("/users")}
          className="px-4 py-2 bg-[#003b5c] text-white rounded-md text-sm font-medium"
        >
          Volver a Usuarios
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto">
          <FormCard title="Datos del Trabajador" icon="👤" color="#003b5c" required>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Cod. Trabajador *"
                value={form.workerCode}
                onChange={(value) => updateField("workerCode", value)}
                onBlur={() => markFieldAsTouched("workerCode")}
                error={shouldShowFieldError("workerCode") ? validationErrors.workerCode : ""}
                placeholder="Ej. EMP-001"
              />

              <FormInput
                label="Nombre *"
                value={form.firstName}
                onChange={(value) => updateField("firstName", value)}
                onBlur={() => markFieldAsTouched("firstName")}
                error={shouldShowFieldError("firstName") ? validationErrors.firstName : ""}
                placeholder="Ej. Juan"
              />

              <FormInput
                label="Apellido *"
                value={form.lastName}
                onChange={(value) => updateField("lastName", value)}
                onBlur={() => markFieldAsTouched("lastName")}
                error={shouldShowFieldError("lastName") ? validationErrors.lastName : ""}
                placeholder="Ej. Pérez"
              />

              <FormInput
                label="Correo Electrónico *"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                onBlur={() => markFieldAsTouched("email")}
                error={shouldShowFieldError("email") ? validationErrors.email : ""}
                placeholder="Ej. juan.perez@amcor.com"
              />

              <FormInput
                label="Puesto *"
                value={form.position}
                onChange={(value) => updateField("position", value)}
                onBlur={() => markFieldAsTouched("position")}
                error={shouldShowFieldError("position") ? validationErrors.position : ""}
                placeholder="Ej. Ejecutivo Comercial"
              />

              <FormInput
                label="Empresa *"
                value={form.company}
                onChange={(value) => updateField("company", value)}
                onBlur={() => markFieldAsTouched("company")}
                error={shouldShowFieldError("company") ? validationErrors.company : ""}
                placeholder="Ej. Amcor"
              />

              <FormInput
                label="Área / Departamento"
                value={form.area}
                onChange={(value) => updateField("area", value)}
                placeholder="Ej. Ventas, R&D, etc."
              />

              <FormInput
                label="Teléfono"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="Ej. +51 999 888 777"
                helper="Opcional"
              />

              <FormSelect
                label="Rol *"
                value={form.role}
                onChange={(value) => updateField("role", value as UserRole)}
                onBlur={() => markFieldAsTouched("role")}
                error={shouldShowFieldError("role") ? validationErrors.role : ""}
                options={roleOptions}
                placeholder="-- Seleccione --"
              />
            </div>

            {(() => {
              const currentUser = getUserById(userId || "");
              const statusLabel = currentUser ? STATUS_LABELS[currentUser.status] : "Desconocido";
              return (
                <div className="mt-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Estado (Solo lectura)</p>
                  <p className="text-sm font-medium text-slate-900">{statusLabel}</p>
                  <p className="text-xs text-slate-500 mt-1">El estado se gestiona desde la vista de detalle del usuario.</p>
                </div>
              );
            })()}
          </FormCard>

          <FormCard title="Sistema Integral - Catálogo de Vendedores" icon="🔗" color="#0D9488">
            <div className="grid grid-cols-1 gap-4">
              {currentVendorCode && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Vendedor Actual</p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-amber-900">{currentVendorCode}</p>
                    {(() => {
                      const vendor = getVendorMirrorByCode(currentVendorCode);
                      return vendor && vendor.status === "Inactivo" ? (
                        <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 whitespace-nowrap">
                          Vendedor inactivo
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}

              <FormSelect
                label={form.role === "comercial" ? "Reasignar Vendedor *" : "Reasignar Vendedor"}
                value={form.siUserId}
                onChange={(value) => updateField("siUserId", value)}
                error={shouldShowFieldError("siUserId") ? validationErrors.siUserId : ""}
                placeholder="-- Seleccione Vendedor Activo --"
                options={activeVendors.map((v) => ({
                  value: v.id,
                  label: `${v.code} - ${v.name}`,
                }))}
              />
              {form.role === "comercial" ? (
                <p className="text-xs text-slate-500 italic">
                  Obligatorio para ejecutivos comerciales. Solo se pueden seleccionar vendedores activos del Sistema Integral.
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Opcional. Vincula este usuario con un vendedor activo del Sistema Integral para sincronización de datos.
                </p>
              )}
              <p className="text-xs text-slate-400">
                Última sincronización: {formatSyncTimestamp(lastSyncTime)}
              </p>
            </div>
          </FormCard>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/users")}
            validationErrorList={validationErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Guardar Cambios"
            cancelLabel="Cancelar"
            validationTitle="Faltan campos obligatorios para actualizar el usuario."
          />
        </div>
      </form>
    </div>
  );
}
