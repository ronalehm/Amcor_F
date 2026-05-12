import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  getClientByCode,
  STATUS_LABELS,
  activateClient,
  deactivateClient,
  blockClient,
  unblockClient,
  deleteClient,
  canClientHavePortfolio,
  getClientPortfolioEligibilityMessage,
  type ClientStatus,
} from "../../../shared/data/clientStorage";
import { getPortfoliosByClient, type PortfolioRecord } from "../../../shared/data/portfolioStorage";
import { getCurrentUser } from "../../../shared/data/userStorage";
import Button from "../../../shared/components/ui/Button";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import FormCard from "../../../shared/components/forms/FormCard";
import RowActionButtons from "../../../shared/components/table/RowActionButtons";

const getText = (...values: any[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== ""
  );

  return value ? String(value) : "—";
};

export default function ClientDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { clientCode } = useParams<{ clientCode: string }>();

  const [client, setClient] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalAction, setModalAction] = useState<"activate" | "deactivate" | "block" | "unblock" | "delete" | null>(null);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "administrador";

  const handleStatusChange = () => {
    if (!client || !modalAction) return;

    if (modalAction === "activate") {
      activateClient(client.id);
    } else if (modalAction === "deactivate") {
      deactivateClient(client.id);
    } else if (modalAction === "block") {
      blockClient(client.id);
    } else if (modalAction === "unblock") {
      unblockClient(client.id);
    } else if (modalAction === "delete") {
      deleteClient(client.id);
      navigate("/clients");
      return;
    }

    const updatedClient = getClientByCode(client.code);
    setClient(updatedClient);
    setPortfolios(getPortfoliosByClient(updatedClient));
    setShowStatusModal(false);
    setModalAction(null);
  };

  useEffect(() => {
    if (clientCode) {
      const clientData = getClientByCode(clientCode);
      if (clientData) {
        setClient(clientData);
        setPortfolios(getPortfoliosByClient(clientData));

        setHeader({
          title: "Detalle de Cliente",
          breadcrumbs: [
            { label: "Clientes", href: "/clients" },
            { label: clientData.code },
            { label: "Ver" },
          ],
        });
      }
    }

    return () => resetHeader();
  }, [clientCode, setHeader, resetHeader]);

  useEffect(() => {
    if (client) {
      setHeader({
        title: "Detalle de Cliente",
        breadcrumbs: [
          { label: "Clientes", href: "/clients" },
          { label: client.code },
          { label: "Ver" },
        ],
        actions: (
          <div className="flex gap-2">
            {isAdmin && portfolios.length === 0 && (
              <Button
                variant="danger"
                onClick={() => {
                  setModalAction("delete");
                  setShowStatusModal(true);
                }}
              >
                Eliminar
              </Button>
            )}
            
            {client.status === "active" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setModalAction("deactivate");
                    setShowStatusModal(true);
                  }}
                >
                  Inactivar Cliente
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setModalAction("block");
                    setShowStatusModal(true);
                  }}
                >
                  Bloquear Cliente
                </Button>
              </>
            )}

            {client.status === "inactive" && (
              <Button
                variant="primary"
                onClick={() => {
                  setModalAction("activate");
                  setShowStatusModal(true);
                }}
              >
                Activar Cliente
              </Button>
            )}

            {client.status === "blocked" && (
              <Button
                variant="primary"
                onClick={() => {
                  setModalAction("unblock");
                  setShowStatusModal(true);
                }}
              >
                Desbloquear Cliente
              </Button>
            )}

            {(client.status === "pending_validation" || client.status === "pending_activation") && (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalAction("activate");
                    setShowStatusModal(true);
                  }}
                >
                  Activar Cliente
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setModalAction("block");
                    setShowStatusModal(true);
                  }}
                >
                  Bloquear Cliente
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => navigate(`/clients/${client.code}/edit`)}
            >
              Editar Cliente
            </Button>
          </div>
        )
      });
    }
  }, [client, portfolios.length, isAdmin, setHeader, navigate]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Cliente no encontrado</div>
        <button onClick={() => navigate("/clients")} className="text-brand-primary hover:underline">
          Volver a Clientes
        </button>
      </div>
    );
  }

  const clientCodeValue = getText(client.code, client.codigo, client.id);
  const clientName = getText(client.razonSocial, client.businessName, client.nombre, client.name);
  const clientRuc = getText(client.ruc, client.RUC);
  const clientEmail = getText(client.email, client.correo);
  const clientPhone = getText(client.telefono, client.phone);
  const clientContact = getText(client.contacto, client.contactName);
  const clientIndustry = getText(client.rubro, client.industry, client.segmento);
  
  // Custom badges for Client Status similar to Portfolio Status
  const getBadgeStyle = (status: string) => {
    if (status === "active") return "border-green-200 bg-green-50 text-green-700";
    if (status === "inactive") return "border-slate-300 bg-slate-50 text-slate-700";
    if (status === "blocked") return "border-red-200 bg-red-50 text-red-700";
    return "border-blue-200 bg-blue-50 text-blue-700";
  };

  const statusLabel = STATUS_LABELS[client.status as ClientStatus] || client.status;

  const renderModalContent = () => {
    switch (modalAction) {
      case "deactivate":
        return {
          title: "¿Inactivar cliente?",
          message: "El cliente quedará inactivo. Sus portafolios existentes se mantendrán para consulta y seguimiento.",
          buttonText: "Inactivar",
          buttonVariant: "danger" as const
        };
      case "activate":
      case "unblock":
        return {
          title: modalAction === "activate" ? "¿Activar cliente?" : "¿Desbloquear cliente?",
          message: modalAction === "activate" 
            ? "El cliente volverá a estar disponible para la gestión de portafolios." 
            : "El cliente volverá a quedar disponible según su estado operativo.",
          buttonText: modalAction === "activate" ? "Activar" : "Desbloquear",
          buttonVariant: "primary" as const
        };
      case "block":
        return {
          title: "¿Bloquear cliente?",
          message: "El cliente quedará bloqueado y no podrá utilizarse para nuevos portafolios.",
          buttonText: "Bloquear",
          buttonVariant: "danger" as const
        };
      case "delete":
        return {
          title: "¿Eliminar cliente?",
          message: "¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.",
          buttonText: "Eliminar",
          buttonVariant: "danger" as const
        };
      default:
        return null;
    }
  };

  const modalContent = renderModalContent();

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] space-y-6">
      <button
        type="button"
        onClick={() => navigate("/clients")}
        className="flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{clientName}</h2>
              <p className="text-sm opacity-80 mt-1">Código: {clientCodeValue}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getBadgeStyle(client.status)}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title="Datos Generales" icon="▦" color="#00395A">
          <div className="space-y-4">
            <PreviewRow label="Código de Cliente" value={clientCodeValue} />
            <PreviewRow label="Razón Social / Nombre" value={clientName} />
            <PreviewRow label="RUC" value={clientRuc} />
            <PreviewRow label="Email" value={clientEmail} />
            <PreviewRow label="Teléfono" value={clientPhone} />
            <PreviewRow label="Contacto" value={clientContact} />
            <PreviewRow label="Fecha de Registro" value={client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "—"} />
          </div>
        </FormCard>

        <FormCard title="Información Comercial / Estado" icon="◇" color="#00A1DE">
          <div className="space-y-4">
            <PreviewRow label="Rubro / Industria" value={clientIndustry} />
            <PreviewRow label="Segmento" value={getText(client.segmento)} />
            <PreviewRow label="Estado" value={statusLabel} />
            {client.siClientId && (
              <>
                <PreviewRow label="Código SI" value={client.siClientCode || "—"} />
                <PreviewRow label="Estado SI" value="Vinculado" />
              </>
            )}
            <PreviewRow label="Última Actualización" value={client.updatedAt ? new Date(client.updatedAt).toLocaleDateString() : "—"} />
            <PreviewRow label="Realizado por" value={client.updatedBy || "Sistema"} />
          </div>
        </FormCard>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-800">Portafolios Asociados</h3>
            <p className="text-sm text-slate-500 mt-1">Portafolios registrados para este cliente.</p>
          </div>
          
          {canClientHavePortfolio(client.status) ? (
            <button
              onClick={() => navigate(`/portfolio/new?clientCode=${clientCodeValue}`)}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-primary-hover"
            >
              + Nuevo Portafolio
            </button>
          ) : null}
        </div>

        {!canClientHavePortfolio(client.status) && (
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Aviso:</strong> {getClientPortfolioEligibilityMessage(client.status)}
            </p>
          </div>
        )}
        
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white text-gray-500 border-b border-gray-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Código</th>
              <th className="px-6 py-3 text-left font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold">Planta de Origen</th>
              <th className="px-6 py-3 text-left font-semibold">Envoltura</th>
              <th className="px-6 py-3 text-left font-semibold">Envasado / Máquina</th>
              <th className="px-6 py-3 text-left font-semibold">Estado</th>
              <th className="px-6 py-3 text-left font-semibold text-center">Proyectos</th>
              <th className="px-6 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio) => (
              <tr key={portfolio.codigo || portfolio.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-brand-primary">{portfolio.codigo || portfolio.id}</td>
                <td className="px-6 py-4">{portfolio.nom || portfolio.nombre || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{portfolio.plantaName || portfolio.pl || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{portfolio.envoltura || portfolio.env || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{portfolio.maquinaCliente || portfolio.maq || '—'}</td>
                <td className="px-6 py-4">
                  <span className={portfolio.status === "Activo"
                    ? "rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700"
                    : portfolio.status === "Inactivo"
                    ? "rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                    : "rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700"
                  }>
                    {portfolio.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-center">—</td>
                <td className="px-6 py-4">
                  <RowActionButtons 
                    viewPath={`/portfolio/${portfolio.codigo || portfolio.id}`}
                    editPath={`/portfolio/${portfolio.codigo || portfolio.id}/edit`}
                  />
                </td>
              </tr>
            ))}
            {portfolios.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic">Este cliente no tiene portafolios asociados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmación Modal */}
      {showStatusModal && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {modalContent.title}
              </h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setModalAction(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {modalContent.message}
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusModal(false);
                  setModalAction(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant={modalContent.buttonVariant}
                onClick={handleStatusChange}
              >
                {modalContent.buttonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
