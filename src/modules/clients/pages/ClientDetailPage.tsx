import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  getClientByCode,
  STATUS_LABELS,
  STATUS_COLORS,
  activateClient,
  deactivateClient,
  blockClient,
  unblockClient,
  deleteClient,
  type ClientStatus,
} from "../../../shared/data/clientStorage";
import FormCard from "../../../shared/components/forms/FormCard";
import ActionButton from "../../../shared/components/buttons/ActionButton";

const STATUS_DESCRIPTIONS: Record<ClientStatus, string> = {
  active: "El cliente está activo y puede crear portafolios y proyectos.",
  inactive: "El cliente está inactivo. Puede ser reactivado en cualquier momento.",
  pending_validation: "El cliente está en validación por tesorería. Es posible crear portafolios y proyectos mientras se completa la evaluación.",
  pending_activation: "Estado de transición (no debería verse).",
  blocked: "El cliente está bloqueado. Solo un administrador puede desbloquearlo.",
};

export default function ClientDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { clientCode } = useParams<{ clientCode: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<any>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [modalState, setModalState] = useState<{
    type: "delete" | "deactivate" | "block" | "unblock" | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });

  useEffect(() => {
    if (!clientCode) {
      setError("Código de cliente no válido");
      setLoading(false);
      return;
    }

    const clientData = getClientByCode(clientCode);
    if (!clientData) {
      setError(`Cliente con código ${clientCode} no encontrado`);
      setLoading(false);
      return;
    }

    setClient(clientData);
    setLoading(false);
  }, [clientCode]);

  useEffect(() => {
    if (client) {
      setHeader({
        title: client.businessName,
        breadcrumbs: [
          { label: "Clientes", href: "/clients" },
          { label: client.code },
        ],
      });
    }
    return () => resetHeader();
  }, [client, setHeader, resetHeader]);

  const handleStatusChange = (newStatus: ClientStatus) => {
    if (!client) return;
    setActionInProgress(true);

    try {
      if (newStatus === "active") {
        activateClient(client.id);
      } else if (newStatus === "inactive") {
        deactivateClient(client.id);
      } else if (newStatus === "blocked") {
        blockClient(client.id);
      }

      const updatedClient = getClientByCode(client.code);
      setClient(updatedClient);
      setModalState({ type: null, isOpen: false });
    } finally {
      setActionInProgress(false);
    }
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false });
  };

  const handleDeleteClient = () => {
    if (!client) return;
    setActionInProgress(true);

    try {
      deleteClient(client.id);
      navigate("/clients");
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Cargando cliente...</div>
      </div>
    );
  }

  if (error || !client) {
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

  const statusColor = STATUS_COLORS[client.status] || "bg-slate-100 text-slate-700";

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(380px,0.5fr)] p-5">
        <div className="space-y-5">
          <FormCard title="Datos del Cliente" icon="??" color="#00395A">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                  <p className="text-sm font-medium text-slate-900">{client.code}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Razón Social</p>
                  <p className="text-sm font-medium text-slate-900">{client.businessName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Correo</p>
                  <p className="text-sm font-medium text-slate-900">{client.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">RUC</p>
                  <p className="text-sm font-medium text-slate-900">{client.ruc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Rubro</p>
                  <p className="text-sm font-medium text-slate-900">{client.industry || "—"}</p>
                </div>
              </div>
            </div>
          </FormCard>

          {client.siClientId && (
            <FormCard title="Sistema Integral" icon="??" color="#0D9488">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Cód. SI</p>
                  <p className="text-sm font-medium text-slate-900">{client.siClientCode || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">ID SI</p>
                  <p className="text-sm font-medium text-slate-900">{client.siClientId}</p>
                </div>
              </div>
            </FormCard>
          )}
        </div>

        <div className="space-y-5">
          <FormCard title="Estado Actual" icon="?" color="#EA580C">
            <div className="space-y-4">
              <div>
                <div className={`rounded-lg px-4 py-3 ${statusColor}`}>
                  <p className="text-sm font-bold">{STATUS_LABELS[client.status]}</p>
                  <p className="text-xs mt-1 opacity-90">
                    {STATUS_DESCRIPTIONS[client.status] || ""}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {client.status === "pending_validation" && (
                  <>
                    <ActionButton
                      onClick={() => handleStatusChange("active")}
                      disabled={actionInProgress}
                      variant="primary"
                      size="sm"
                      label="Activar Cliente"
                      fullWidth
                    />
                    <ActionButton
                      onClick={() => handleStatusChange("inactive")}
                      disabled={actionInProgress}
                      variant="outline"
                      size="sm"
                      label="Rechazar"
                      fullWidth
                    />
                  </>
                )}

                {client.status === "active" && (
                  <>
                    <ActionButton
                      onClick={() => setModalState({ type: "deactivate", isOpen: true })}
                      disabled={actionInProgress}
                      variant="outline"
                      size="sm"
                      label="Desactivar"
                      fullWidth
                    />
                    <ActionButton
                      onClick={() => setModalState({ type: "block", isOpen: true })}
                      disabled={actionInProgress}
                      variant="danger"
                      size="sm"
                      label="Bloquear"
                      fullWidth
                    />
                  </>
                )}

                {client.status === "inactive" && (
                  <ActionButton
                    onClick={() => handleStatusChange("active")}
                    disabled={actionInProgress}
                    variant="primary"
                    size="sm"
                    label="Reactivar"
                    fullWidth
                  />
                )}

                {client.status === "blocked" && (
                  <ActionButton
                    onClick={() => setModalState({ type: "unblock", isOpen: true })}
                    disabled={actionInProgress}
                    variant="success"
                    size="sm"
                    label="Desbloquear"
                    fullWidth
                  />
                )}
              </div>
            </div>
          </FormCard>

          <div className="space-y-2">
            <ActionButton
              onClick={() => navigate(`/clients/${client.code}/edit`)}
              variant="outline"
              size="sm"
              label="Editar Cliente"
              fullWidth
            />
            <ActionButton
              onClick={() => setModalState({ type: "delete", isOpen: true })}
              variant="danger"
              size="sm"
              label="Eliminar Cliente"
              fullWidth
            />
          </div>
        </div>
      </div>

      {modalState.type === "deactivate" && modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Desactivar Cliente</h3>
            <p className="text-sm text-slate-600 mb-6">
              ¿Desea desactivar a <strong>{client.businessName}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleStatusChange("inactive");
                }}
                disabled={actionInProgress}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState.type === "block" && modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Bloquear Cliente</h3>
            <p className="text-sm text-slate-600 mb-6">
              ¿Desea bloquear a <strong>{client.businessName}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleStatusChange("blocked");
                }}
                disabled={actionInProgress}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Bloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState.type === "unblock" && modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Desbloquear Cliente</h3>
            <p className="text-sm text-slate-600 mb-6">
              ¿Desea desbloquear a <strong>{client.businessName}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleStatusChange("active");
                }}
                disabled={actionInProgress}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState.type === "delete" && modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Eliminar Cliente</h3>
            <p className="text-sm text-slate-600 mb-6">
              ¿Está seguro de que desea eliminar a <strong>{client.businessName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteClient}
                disabled={actionInProgress}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
