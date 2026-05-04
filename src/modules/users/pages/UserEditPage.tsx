import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";

import {
  getUserById,
  updateUser,
  STATUS_LABELS,
  getUserByEmail,
  getCurrentUser,
  type UserStatus,
} from "../../../shared/data/userStorage";
import {
  getActiveVendorsMirror,
  getVendorMirrorByCode,
  getLastSyncTimestamp,
  formatSyncTimestamp,
} from "../../../shared/data/vendorMirrorStorage";
import { AREAS, getPositionsByArea, getRoleByPosition, PORTAL_ROLE_LABELS, PORTAL_ROLE_DESCRIPTIONS } from "../../../shared/data/areaDepartmentConfig";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  workerCode: string;
  position: string;
  company: string;
  phone: string;
  area: string;
  siUserId: string;
  role?: string;
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

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "administrador";

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
      phone: user.phone || "",
      area: user.area || "",
      siUserId: user.siUserId || "",
      role: user.role,
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
      errors.email = "El formato del correo no es válido.";
    } else {
      const existingUser = getUserByEmail(form.email);
      const currentUser = getUserById(userId || "");
      if (existingUser && existingUser.id !== currentUser?.id) {
        errors.email = "Este correo ya está registrado.";
      }
    }
    if (!form.workerCode.trim()) errors.workerCode = "Ingresa el código de trabajador.";
    if (!form.position.trim()) errors.position = "Selecciona el puesto.";
    if (!form.company.trim()) errors.company = "Ingresa la empresa.";
    if (isAdmin && !form.role) {
      errors.role = "Selecciona el rol.";
    }
    if (form.position === "Ejecutivo Comercial" && !form.siUserId) {
      errors.siUserId = "Selecciona el vendedor.";
    }

    return errors;
  }, [form, userId, isAdmin]);

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

  const assignedRole = form?.position ? getRoleByPosition(form.position) : null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0 || !form || !userId) {
      const fieldsWithErrors = Object.keys(validationErrors).reduce(
        (acc, field) => {
          acc[field as keyof UserFormData] = true;
          return acc;
        },
        {} as Partial<Record<keyof UserFormData, boolean>>
      );
      setTouchedFields((prev) => ({
        ...prev,
        ...fieldsWithErrors,
      }));
      return;
    }

    const selectedVendor = activeVendors.find(v => v.id === form.siUserId);
    const finalRole = isAdmin && form.role ? (form.role as any) : (assignedRole as any);

    updateUser(userId, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      workerCode: form.workerCode,
      position: form.position,
      company: form.company,
      role: finalRole,
      phone: form.phone || undefined,
      area: form.area || undefined,
      siUserId: form.siUserId || undefined,
      siUserCode: selectedVendor?.code,
    });

    navigate("/users");
  };

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const areaOptions = AREAS.map((area) => ({
    value: area,
    label: area,
  }));

  const positionOptions = useMemo(() => {
    const positions = getPositionsByArea(form.area);
    return positions.map((pos: string) => ({
      value: pos,
      label: pos,
    }));
  }, [form.area]);

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
          className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium"
        >
          Volver a Usuarios
        </button>
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
        <div className="max-w-3xl mx-auto">
          <FormCard title="Datos del Trabajador" icon="👤" color="#00395A" required>
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

              <FormSelect
                label="Área / Departamento *"
                value={form.area}
                onChange={(value) => {
                  updateField("area", value);
                  updateField("position", "");
                  markFieldAsTouched("area");
                }}
                onBlur={() => markFieldAsTouched("area")}
                error={shouldShowFieldError("area") ? validationErrors.area : ""}
                options={areaOptions}
                placeholder="-- Seleccione Área --"
              />

              <FormSelect
                label="Puesto *"
                value={form.position}
                onChange={(value) => {
                  updateField("position", value);
                  markFieldAsTouched("position");
                }}
                onBlur={() => markFieldAsTouched("position")}
                error={shouldShowFieldError("position") ? validationErrors.position : ""}
                options={positionOptions}
                placeholder="-- Seleccione Puesto --"
                disabled={!form.area}
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
                label="Teléfono"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="Ej. +51 999 888 777"
                helper="Opcional"
              />
            </div>

            {isAdmin ? (
              <div className="mt-4 space-y-4">
                <FormSelect
                  label="Rol Portal ODISEO *"
                  value={form?.role || ""}
                  onChange={(value) => updateField("role", value)}
                  error={shouldShowFieldError("role") ? validationErrors.role : ""}
                  options={[
                    { value: "operador", label: PORTAL_ROLE_LABELS["operador"] },
                    { value: "validador", label: PORTAL_ROLE_LABELS["validador"] },
                    { value: "supervisor", label: PORTAL_ROLE_LABELS["supervisor"] },
                    { value: "administrador", label: PORTAL_ROLE_LABELS["administrador"] },
                  ]}
                  placeholder="-- Seleccione Rol --"
                />
                {form?.role && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-2">Descripción:</p>
                    <p className="text-sm text-blue-600">{PORTAL_ROLE_DESCRIPTIONS[form.role as any]}</p>
                  </div>
                )}
              </div>
            ) : assignedRole ? (
              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-xs font-semibold text-green-800 uppercase mb-2">Rol Asignado Automáticamente</p>
                <p className="text-lg font-bold text-green-900">{PORTAL_ROLE_LABELS[assignedRole]}</p>
                <p className="text-sm text-green-700 mt-3">{PORTAL_ROLE_DESCRIPTIONS[assignedRole]}</p>
              </div>
            ) : null}

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
                label={form.position === "Ejecutivo Comercial" ? "Reasignar Vendedor *" : "Reasignar Vendedor"}
                value={form.siUserId}
                onChange={(value) => updateField("siUserId", value)}
                error={shouldShowFieldError("siUserId") ? validationErrors.siUserId : ""}
                placeholder="-- Seleccione Vendedor Activo --"
                options={activeVendors.map((v) => ({
                  value: v.id,
                  label: `${v.code} - ${v.name}`,
                }))}
              />
              {form.position === "Ejecutivo Comercial" ? (
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
            validationTitle="Faltan campos obligatorios."
          />
        </div>
      </form>
    </div>
  );
}
