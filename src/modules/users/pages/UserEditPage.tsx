import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import SystemIntegrationUserSearch from "../../../shared/components/forms/SystemIntegrationUserSearch";

import {
  getUserById,
  updateUser,
  STATUS_LABELS,
  STATUS_COLORS,
  getUserByEmail,
  findActiveSiCodeDuplicate,
} from "../../../shared/data/userStorage";
import {
  AREAS,
  getPositionsByArea,
  getAllowedRolesByAreaAndPosition,
} from "../../../shared/data/areaDepartmentConfig";
import { ROLE_LABELS } from "../../../shared/data/userStorage";
import { type VendorMirror } from "../../../shared/data/vendorMirrorStorage";

type UserFormData = {
  fullName: string;
  email: string;
  workerCode: string;
  position: string;
  area: string;
  role: string;
  siUserId?: string;
  siUserCode?: string;
  siUserName?: string;
  siStatus?: string;
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
  const [siError, setSiError] = useState<string | null>(null);
  const [siSuccess, setSiSuccess] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSiUserSelect = (vendor: VendorMirror) => {
    // Validar que el código SI no esté asignado a otro usuario ODISEO
    const siDuplicate = findActiveSiCodeDuplicate(vendor.code, userId);
    if (siDuplicate) {
      setSiError(
        `Este usuario del Sistema Integral ya está asignado a ${siDuplicate.fullName}. No se puede reasignar.`
      );
      return;
    }

    setSiError(null);
    setSiSuccess(`Usuario del Sistema Integral "${vendor.name}" asignado exitosamente.`);
    setForm((prev) =>
      prev
        ? {
            ...prev,
            siUserId: vendor.id,
            siUserCode: vendor.code,
            workerCode: vendor.code,
            email: vendor.email || "",
            fullName: vendor.name,
            area: vendor.area,
          }
        : null
    );
    setSearchQuery("");
    // Limpiar el mensaje de éxito después de 3 segundos
    setTimeout(() => setSiSuccess(null), 3000);
  };

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
      fullName: user.fullName,
      email: user.email,
      workerCode: user.workerCode,
      position: user.position,
      area: user.area || "",
      role: user.role,
      siUserId: user.siUserId,
      siUserCode: user.siUserCode,
      siUserName: user.siUserName,
      siStatus: user.siStatus,
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

    if (!form.fullName.trim()) {
      errors.fullName = "Ingresa el nombre completo.";
    }
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
    if (!form.area.trim()) errors.area = "Selecciona el área.";
    if (!form.position.trim()) errors.position = "Selecciona el puesto.";

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

    updateUser(userId, {
      fullName: form.fullName,
      email: form.email,
      workerCode: form.workerCode,
      position: form.position,
      area: form.area || undefined,
      role: form.role as any,
      siUserId: form.siUserId,
      siUserCode: form.siUserCode,
      siUserName: form.siUserName,
      siStatus: form.siStatus,
    });

    navigate("/users");
  };

  const areaOptions = AREAS.map((area) => ({
    value: area,
    label: area,
  }));

  const positionOptions = useMemo(() => {
    if (!form?.area) return [];

    const positions = getPositionsByArea(form.area);

    return positions.map((pos: string) => ({
      value: pos,
      label: pos,
    }));
  }, [form?.area]);

  const roleOptions = useMemo(() => {
    if (!form?.area) return [];
    const allowedRoles = getAllowedRolesByAreaAndPosition(form.area, form.position);
    return allowedRoles.map((roleKey) => ({
      value: roleKey,
      label: ROLE_LABELS[roleKey],
    }));
  }, [form?.area, form?.position]);

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
          <FormCard title="Datos del Usuario" icon="👤" color="#00395A" required>
            <div className="space-y-4">
              {/* Búsqueda Sistema Integral */}
              <SystemIntegrationUserSearch
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={handleSiUserSelect}
                placeholder="Buscar usuario del Sistema Integral..."
              />

              {/* Mensaje de éxito SI */}
              {siSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm text-green-800">✓ {siSuccess}</p>
                </div>
              )}

              {/* Error de SI duplicado */}
              {siError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-800">{siError}</p>
                </div>
              )}

              {/* Usuario del Sistema Integral Sincronizado */}
              {form.siUserCode && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="text-sm font-bold text-blue-900 mb-3">Usuario del Sistema Integral Sincronizado</h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormInput
                      label="Código Sistema Integral"
                      value={form.siUserCode}
                      disabled
                      placeholder="Ej. SI-001"
                    />
                    <FormInput
                      label="Nombre Sistema Integral"
                      value={form.siUserName || ""}
                      disabled
                      placeholder="Nombre del usuario"
                    />
                    <FormInput
                      label="Estado Sistema Integral"
                      value={form.siStatus || ""}
                      disabled
                      placeholder="Estado"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              siUserId: undefined,
                              siUserCode: undefined,
                              siUserName: undefined,
                              siStatus: undefined,
                            }
                          : null
                      );
                    }}
                    className="mt-3 text-sm text-blue-700 hover:text-blue-900 font-semibold"
                  >
                    Limpiar sincronización
                  </button>
                </div>
              )}

              {/* Fila 1: Código Trabajador, Nombre (Read-only) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Código Trabajador"
                  value={form.workerCode}
                  disabled
                  placeholder="Ej. EMP-001"
                />

                <FormInput
                  label="Nombre"
                  value={form.fullName}
                  disabled
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              {/* Fila 2: Correo Corporativo, Puesto (Read-only) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Correo Corporativo"
                  value={form.email}
                  disabled
                  placeholder="Ej. juan.perez@amcor.com"
                  type="email"
                />

                <FormSelect
                  label="Puesto"
                  value={form.position}
                  onChange={() => {}}
                  disabled
                  options={positionOptions}
                  placeholder="-- Seleccione Puesto --"
                />
              </div>

              {/* Fila 3: Área (Read-only), Rol ODISEO (Editable) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  label="Área"
                  value={form.area}
                  onChange={() => {}}
                  disabled
                  options={areaOptions}
                  placeholder="-- Seleccione Área --"
                />

                <FormSelect
                  label="Rol ODISEO"
                  value={form.role}
                  onChange={(value) => {
                    updateField("role", value);
                    markFieldAsTouched("role");
                  }}
                  options={roleOptions}
                  placeholder="-- Seleccione Rol ODISEO --"
                />
              </div>
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
