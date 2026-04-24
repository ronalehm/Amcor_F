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
  type UserRole,
  type UserStatus,
} from "../../../shared/data/userStorage";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  area: string;
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
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || "",
      area: user.area || "",
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
    }
    if (!form.role) errors.role = "Selecciona un rol.";

    return errors;
  }, [form]);

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

    updateUser(userId, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      role: form.role,
      status: form.status,
      phone: form.phone || undefined,
      area: form.area || undefined,
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
          <FormCard title="Información del Usuario" icon="👤" color="#003b5c" required>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                label="Rol *"
                value={form.role}
                onChange={(value) => updateField("role", value as UserRole)}
                onBlur={() => markFieldAsTouched("role")}
                error={shouldShowFieldError("role") ? validationErrors.role : ""}
                options={roleOptions}
                placeholder="-- Seleccione --"
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
                label="Estado"
                value={form.status}
                onChange={(value) => updateField("status", value as UserStatus)}
                options={statusOptions}
              />
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
