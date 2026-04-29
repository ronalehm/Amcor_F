import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";

import {
  getClientByCode,
  updateClient,
  getClientByEmail,
  type ClientStatus,
  STATUS_LABELS,
} from "../../../shared/data/clientStorage";

type ClientFormData = {
  businessName: string;
  email: string;
  ruc: string;
  industry: string;
};

export default function ClientEditPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { clientCode } = useParams<{ clientCode: string }>();

  const [form, setForm] = useState<ClientFormData | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof ClientFormData, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    if (!clientCode) {
      setError("Código de cliente no válido");
      setLoading(false);
      return;
    }

    const client = getClientByCode(clientCode);
    if (!client) {
      setError(`Cliente con código ${clientCode} no encontrado`);
      setLoading(false);
      return;
    }

    setClientId(client.id);
    setForm({
      businessName: client.businessName,
      email: client.email,
      ruc: client.ruc,
      industry: client.industry,
    });
    setLoading(false);
  }, [clientCode]);

  useEffect(() => {
    if (clientCode && !loading) {
      setHeader({
        title: "Editar Cliente",
        breadcrumbs: [
          { label: "Clientes", href: "/clients" },
          { label: clientCode },
          { label: "Editar" },
        ],
      });
    }
    return () => resetHeader();
  }, [clientCode, loading, setHeader, resetHeader]);

  const validationErrors = useMemo(() => {
    if (!form) return {};
    const errors: Partial<Record<keyof ClientFormData, string>> = {};

    if (!form.businessName.trim()) errors.businessName = "Ingresa la razón social.";
    if (!form.email.trim()) {
      errors.email = "Ingresa el correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Ingresa un correo válido.";
    } else {
      const existingClient = getClientByEmail(form.email);
      const currentClient = getClientByCode(clientCode || "");
      if (existingClient && existingClient.id !== currentClient?.id) {
        errors.email = "Este correo ya está registrado en el sistema.";
      }
    }
    if (!form.ruc.trim()) errors.ruc = "Ingresa el RUC.";
    if (!form.industry.trim()) errors.industry = "Ingresa el rubro.";

    return errors;
  }, [form, clientCode]);

  const validationErrorList = Object.values(validationErrors).filter(Boolean) as string[];

  const updateField = (field: keyof ClientFormData, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const markFieldAsTouched = (field: keyof ClientFormData) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const shouldShowFieldError = (field: keyof ClientFormData) => {
    return Boolean(validationErrors[field] && (submitAttempted || touchedFields[field]));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0 || !form || !clientCode) {
      setTouchedFields({
        businessName: true,
        email: true,
        ruc: true,
        industry: true,
      });
      return;
    }

    updateClient(clientId, {
      businessName: form.businessName,
      email: form.email,
      ruc: form.ruc,
      industry: form.industry,
    });

    navigate("/clients");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Cargando cliente...</div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">{error || "Error cargando cliente"}</div>
        <button
          onClick={() => navigate("/clients")}
          className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium"
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto">
          <FormCard title="Datos del Cliente" icon="??" color="#00395A" required>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Razón Social *"
                value={form.businessName}
                onChange={(value) => updateField("businessName", value)}
                onBlur={() => markFieldAsTouched("businessName")}
                error={shouldShowFieldError("businessName") ? validationErrors.businessName : ""}
                placeholder="Ej. Empresa S.A.C."
              />

              <FormInput
                label="Correo Electrónico *"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                onBlur={() => markFieldAsTouched("email")}
                error={shouldShowFieldError("email") ? validationErrors.email : ""}
                placeholder="Ej. contacto@empresa.com"
              />

              <FormInput
                label="Número de RUC *"
                value={form.ruc}
                onChange={(value) => updateField("ruc", value)}
                onBlur={() => markFieldAsTouched("ruc")}
                error={shouldShowFieldError("ruc") ? validationErrors.ruc : ""}
                placeholder="Ej. 20123456789"
              />

              <FormInput
                label="Rubro *"
                value={form.industry}
                onChange={(value) => updateField("industry", value)}
                onBlur={() => markFieldAsTouched("industry")}
                error={shouldShowFieldError("industry") ? validationErrors.industry : ""}
                placeholder="Ej. Distribución, Manufactura, etc."
              />
            </div>
          </FormCard>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/clients")}
            validationErrorList={validationErrorList}
            submitAttempted={submitAttempted}
            submitLabel="Guardar Cambios"
            cancelLabel="Cancelar"
            validationTitle="Faltan campos obligatorios para actualizar el cliente."
          />
        </div>
      </form>
    </div>
  );
}
