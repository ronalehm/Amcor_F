import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getPortfolioByCode, deletePortfolioRecord, updatePortfolioRecord, type PortfolioRecord } from "../../../shared/data/portfolioStorage";
import { getProjectsByPortfolioCode } from "../../../shared/data/projectStorage";
import { getCurrentUser } from "../../../shared/data/userStorage";
import Button from "../../../shared/components/ui/Button";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import ProjectStatusBadge from "../../../shared/components/display/ProjectStatusBadge";
import FormCard from "../../../shared/components/forms/FormCard";
import RowActionButtons from "../../../shared/components/table/RowActionButtons";
import ProjectInitialCreateModal from "../../../shared/components/modals/ProjectInitialCreateModal";

const getPortfolioStatus = (portfolio: any): "active" | "inactive" => {
  const rawStatus = String(
    portfolio.status ||
    portfolio.est ||
    portfolio.estado ||
    (portfolio.isActive === false ? "inactive" : "") ||
    (portfolio.active === false ? "inactive" : "") ||
    "active"
  ).toLowerCase();

  if (
    rawStatus.includes("inactivo") ||
    rawStatus.includes("inactive") ||
    rawStatus === "false"
  ) {
    return "inactive";
  }

  return "active";
};

export default function PortfolioDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { portfolioCode } = useParams<{ portfolioCode: string }>();

  const [portfolio, setPortfolio] = useState<PortfolioRecord | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "administrador";

  const handleTogglePortfolioStatus = () => {
    if (!portfolio) return;

    const currentStatus = getPortfolioStatus(portfolio);
    const nextStatusLabel = currentStatus === "active" ? "Inactivo" : "Activo";
    const now = new Date().toISOString();
    const updatedByName = currentUser?.fullName || "Sistema";

    const portfolioCode = portfolio.codigo || portfolio.id;

    updatePortfolioRecord(portfolioCode, {
      status: nextStatusLabel as any,
      est: nextStatusLabel,
      estado: nextStatusLabel,
      isActive: currentStatus === "inactive",
      active: currentStatus === "inactive",
      statusUpdatedAt: now,
      updatedAt: now,
      updatedByName,
      updatedBy: currentUser?.id || "system",
    });

    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            status: nextStatusLabel as any,
            est: nextStatusLabel,
            estado: nextStatusLabel,
            isActive: currentStatus === "inactive",
            active: currentStatus === "inactive",
            statusUpdatedAt: now,
            updatedAt: now,
            updatedByName,
            updatedBy: currentUser?.id || "system",
          }
        : prev
    );

    setShowStatusModal(false);
  };

  useEffect(() => {
    if (portfolioCode) {
      const record = getPortfolioByCode(portfolioCode);
      const portfolioProjects = getProjectsByPortfolioCode(portfolioCode);
      setPortfolio(record || null);
      setProjects(portfolioProjects);

      setHeader({
        title: "Detalle de Portafolio",
        breadcrumbs: [
          { label: "Portafolios", href: "/portfolio" },
          { label: portfolioCode },
          { label: "Ver" },
        ],
      });
    }

    return () => resetHeader();
  }, [portfolioCode, setHeader, resetHeader]);

  useEffect(() => {
    if (portfolio) {
      const portfolioStatus = getPortfolioStatus(portfolio);
      const isPortfolioActive = portfolioStatus === "active";
      const portfolioCodeValue = portfolio.codigo || portfolio.id;

      setHeader({
        title: "Detalle de Portafolio",
        breadcrumbs: [
          { label: "Portafolios", href: "/portfolio" },
          { label: portfolioCodeValue },
          { label: "Ver" },
        ],
        actions: (
          <div className="flex gap-2">
            {isAdmin && projects.length === 0 && (
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm("¿Está seguro de que desea eliminar este portafolio?")) {
                    deletePortfolioRecord(portfolioCodeValue);
                    navigate("/portfolio");
                  }
                }}
              >
                Eliminar
              </Button>
            )}
            <Button
              variant={isPortfolioActive ? "outline" : "primary"}
              onClick={() => setShowStatusModal(true)}
            >
              {isPortfolioActive ? "Inactivar Portafolio" : "Activar Portafolio"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/portfolio/${portfolioCodeValue}/edit`)}
            >
              Editar Portafolio
            </Button>
          </div>
        )
      });
    }
  }, [portfolio, projects.length, isAdmin, setHeader, navigate]);

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Portafolio no encontrado</div>
        <button onClick={() => navigate("/portfolio")} className="text-brand-primary hover:underline">
          Volver a Portafolios
        </button>
      </div>
    );
  }

  const portfolioStatus = getPortfolioStatus(portfolio);
  const isPortfolioActive = portfolioStatus === "active";

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] space-y-6">
      <button
        type="button"
        onClick={() => navigate("/portfolio")}
        className="flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{portfolio.nom}</h2>
              <p className="text-sm opacity-80 mt-1">Código: {portfolio.codigo || portfolio.id}</p>
            </div>
            <span className={isPortfolioActive
              ? "rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700"
              : "rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
            }>
              {isPortfolioActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title="Datos Generales" icon="▦" color="#00395A">
          <div className="space-y-4">
            <PreviewRow label="Cliente" value={portfolio.clientName || portfolio.cli} />
            <PreviewRow label="Ejecutivo Comercial" value={portfolio.ejecutivoName || portfolio.ej} />
            <PreviewRow label="Planta" value={portfolio.plantaName || portfolio.pl} />
            <PreviewRow label="Fecha Registro" value={portfolio.fch || new Date().toLocaleDateString()} />
          </div>
        </FormCard>

        <FormCard title="Datos de Producto (ADN)" icon="◇" color="#00A1DE">
          <div className="space-y-4">
            <PreviewRow label="Envoltura" value={portfolio.envoltura || portfolio.env} />
            <PreviewRow label="Sector" value={portfolio.sector} />
            <PreviewRow label="Segmento" value={portfolio.segmento || portfolio.seg} />
            <PreviewRow label="Sub-segmento" value={portfolio.subSegmento || portfolio.subseg} />
            <PreviewRow label="Uso Final" value={portfolio.usoFinal || portfolio.uf} />
            <PreviewRow label="AFMarketID" value={portfolio.afMarketId || portfolio.af} />
            <PreviewRow label="Máquina Cliente" value={portfolio.maquinaCliente || portfolio.maq} />
          </div>
        </FormCard>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Proyectos Asociados</h3>
          <button
            onClick={() => setShowCreateProjectModal(true)}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-primary-hover"
          >
            + Nuevo Proyecto
          </button>
        </div>
        
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white text-gray-500 border-b border-gray-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Código</th>
              <th className="px-6 py-3 text-left font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold">Formato</th>
              <th className="px-6 py-3 text-left font-semibold">Estado</th>
              <th className="px-6 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={project.code || project.id} className={`border-b border-gray-100 hover:bg-gray-50`}>
                <td className="px-6 py-4 font-bold text-brand-primary">{project.code || project.id}</td>
                <td className="px-6 py-4">{project.projectName || project.n}</td>
                <td className="px-6 py-4 text-gray-500">{project.format || project.fmt || '—'}</td>
                <td className="px-6 py-4"><ProjectStatusBadge status={project.status || project.e} /></td>
                <td className="px-6 py-4">
                  <RowActionButtons 
                    viewPath={`/projects/${project.code || project.id}`}
                    editPath={`/projects/${project.code || project.id}/edit`}
                  />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No hay proyectos asociados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmación Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {isPortfolioActive ? "¿Inactivar portafolio?" : "¿Activar portafolio?"}
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {isPortfolioActive
                ? "Este portafolio dejará de estar disponible para crear nuevos proyectos. Los proyectos ya asociados se mantendrán para consulta y seguimiento."
                : "Este portafolio volverá a estar disponible para crear nuevos proyectos."}
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant={isPortfolioActive ? "danger" : "primary"}
                onClick={handleTogglePortfolioStatus}
              >
                {isPortfolioActive ? "Inactivar" : "Activar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inicial Crear Proyecto */}
      <ProjectInitialCreateModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        initialPortfolioCode={portfolio.codigo || portfolio.id}
      />
    </div>
  );
}
