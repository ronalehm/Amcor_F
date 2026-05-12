import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  getClientByCode,
  deleteClient,
  activateClient,
  deactivateClient,
  blockClient,
  unblockClient,
  STATUS_LABELS,
  STATUS_COLORS,
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

export default function ClientDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { clientCode } = useParams<{ clientCode: string }>();

  const [client, setClient] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "administrador";

  const handleToggleClientStatus = () => {
    if (!client) return;

    const currentStatus = client.status;
    const nextStatus: ClientStatus = currentStatus === "active" ? "inactive" : "active";
    const now = new Date().toISOString();

    if (nextStatus === "active") {
      activateClient(client.id);
    } else {
      deactivateClient(client.id);
    }

    const updatedClient = getClientByCode(client.code);
    setClient(updatedClient);
    setPortfolios(updatedClient ? getPortfoliosByClient(updatedClient) : []);
    setShowStatusModal(false);
  };

  useEffect(() => {
    if (clientCode) {
      const record = getClientByCode(clientCode);
      const clientPortfolios = record ? getPortfoliosByClient(record) : [];
      setClient(record || null);
      setPortfolios(clientPortfolios);

      setHeader({
        title: "Detalle de Cliente",
        breadcrumbs: [
          { label: "Clientes", href: "/clients" },
          { label: clientCode },
          { label: "Ver" },
        ],
        actions: (
          <div className="flex gap-2">
            {isAdmin && portfolios.length === 0 && (
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm("¿Está seguro de que desea eliminar este cliente?")) {
                    deleteClient(record?.id);
                    navigate("/clients");
                  }
                }}
              >
                Eliminar
              </Button>
            )}
            {client?.status === "active" && (
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(true)}
              >
                Desactivar Cliente
              </Button>
            )}
            {client?.status === "inactive" && (
              <Button
                variant="primary"
                onClick={() => setShowStatusModal(true)}
              >
                Activar Cliente
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`/clients/${clientCode}/edit`)}
            >
              Editar Cliente
            </Button>
          </div>
        )
      });
    }

    return () => resetHeader();
  }, [clientCode, setHeader, resetHeader, navigate, isAdmin, portfolios.length]);

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

  const clientStatus = client.status;
  const isClientActive = clientStatus === "active";

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
              <h2 className="text-2xl font-bold">{client.businessName}</h2>
              <p className="text-sm opacity-80 mt-1">Código: {client.code}</p>
            </div>
            <span className={isClientActive
              ? "rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700"
              : "rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
            }>
              {STATUS_LABELS[client.status]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title="Datos Generales" icon="▦" color="#00395A">
          <div className="space-y-4">
            <PreviewRow label="Código" value={client.code} />
            <PreviewRow label="Razón Social" value={client.businessName} />
            <PreviewRow label="RUC" value={client.ruc} />
            <PreviewRow label="Email" value={client.email} />
            <PreviewRow label="Rubro" value={client.industry} />
          </div>
        </FormCard>

        {client.siClientId && (
          <FormCard title="Sistema Integral" icon="◇" color="#0D9488">
            <div className="space-y-4">
              <PreviewRow label="Código SI" value={client.siClientCode} />
              <PreviewRow label="ID SI" value={client.siClientId} />
            </div>
          </FormCard>
        )}
      </div>

      {canClientHavePortfolio(client.status) ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Portafolios Asignados</h3>
            <button
              onClick={() => navigate(`/portfolio/new?clientCode=${client.code}`)}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-primary-hover"
            >
              + Nuevo Portafolio
            </button>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead className="bg-white text-gray-500 border-b border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Código</th>
                <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold">Planta</th>
                <th className="px-6 py-3 text-left font-semibold">Envoltura</th>
                <th className="px-6 py-3 text-left font-semibold">Máquina</th>
                <th className="px-6 py-3 text-left font-semibold">Estado</th>
                <th className="px-6 py-3 text-left font-semibold">Proyectos</th>
                <th className="px-6 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio.codigo || portfolio.id} className={`border-b border-gray-100 hover:bg-gray-50`}>
                  <td className="px-6 py-4 font-bold text-brand-primary">{portfolio.codigo || portfolio.id}</td>
                  <td className="px-6 py-4">{portfolio.nom || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{portfolio.plantaName || portfolio.pl || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{portfolio.envoltura || portfolio.env || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{portfolio.maquinaCliente || portfolio.maq || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={portfolio.status === "Activo"
                      ? "rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700"
                      : portfolio.status === "Inactivo"
                      ? "rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                      : "rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700"
                    }>
                      {portfolio.status || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold bg-brand-secondary-soft text-brand-primary min-w-[2rem]">
                      {(portfolio as any).projectCount || (portfolio as any).activeProjectCount || 0}
                    </span>
                  </td>
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
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic">Este cliente no tiene portafolios asignados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            <strong>Portafolios no disponibles:</strong> {getClientPortfolioEligibilityMessage(client.status)}
          </p>
        </div>
      )}

      {/* Confirmación Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {isClientActive ? "¿Desactivar cliente?" : "¿Activar cliente?"}
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {isClientActive
                ? "El cliente quedará inactivo, pero sus portafolios existentes se mantendrán para consulta y seguimiento."
                : "El cliente volverá a estar disponible para crear nuevos portafolios."}
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant={isClientActive ? "danger" : "primary"}
                onClick={handleToggleClientStatus}
              >
                {isClientActive ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
