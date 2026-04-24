import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ScanBarcode,
  BriefcaseBusiness,
  TrendingUp,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getClientCatalogRecords } from "../../../shared/data/clientStorage";
import { getPortfolioDisplayRecords } from "../../../shared/data/portfolioStorage";
import { getProjectRecords, getProjectsSummary } from "../../../shared/data/projectStorage";
import { getProjectObservations, getObservedProjectsSummary, type ObservedProjectSummary } from "../../../shared/data/observationStorage";
import { getProjectSlaSummary, getProjectStatusHistory} from "../../../shared/data/slaStorage";
import { getAllProjectTrackingStates } from "../../../shared/data/projectTrackingStorage";
import { isPortalStage } from "../../../shared/data/projectStageConfig";

import SummaryCard from "../../../shared/components/display/SummaryCard";
import SlaStatusBadge from "../../../shared/components/sla/SlaStatusBadge";

const QUICK_ACTIONS = [
  {
    label: "Portafolios",
    description: "Gestionar familias de oportunidades por cliente",
    icon: FolderKanban,
    path: "/portfolio",
  },
  {
    label: "Proyectos",
    description: "Revisar oportunidades comerciales activas",
    icon: BriefcaseBusiness,
    path: "/projects",
  },
  {
    label: "Clientes",
    description: "Registrar y administrar clientes",
    icon: Building2,
    path: "/clients",
  },
  {
    label: "Fichas de Producto",
    description: "Consultar información técnica consolidada",
    icon: ScanBarcode,
    path: "/datasheets",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [clients, setClients] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [slas, setSlas] = useState<any[]>([]);
  const [observations, setObservations] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [trackingStates, setTrackingStates] = useState<any[]>([]);
  const [observedProjects, setObservedProjects] = useState<ObservedProjectSummary[]>([]);

  useEffect(() => {
    setHeader({
      title: "Portal Web ODISEO",
      subtitle: "Cuadro de mando operativo - Visualiza el avance de oportunidades, retrasos, observaciones y actividades pendientes para mantener trazabilidad desde el cliente hasta la ficha de producto.",
    });

    // Load data from storage
    setClients(getClientCatalogRecords());
    setPortfolios(getPortfolioDisplayRecords());
    
    const allProjects = getProjectRecords();
    setProjects(allProjects);
    
    const allSlas = allProjects.flatMap(p => getProjectSlaSummary(p.code));
    setSlas(allSlas);
    
    setObservations(getProjectObservations());
    setHistory(getProjectStatusHistory());
    setTrackingStates(getAllProjectTrackingStates());
    
    // Obtener resumen de proyectos observados y enriquecer con datos de proyectos
    const observedSummary = getObservedProjectsSummary();
    const enrichedObserved = observedSummary.map(obs => {
      const project = allProjects.find(p => p.code === obs.projectCode);
      const tracking = trackingStates.find(t => t.projectCode === obs.projectCode);
      return {
        ...obs,
        clientName: project?.clientName || "—",
        currentStage: tracking?.currentStage || "—",
      };
    });
    setObservedProjects(enrichedObserved);

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const activePortalProjects = trackingStates.filter(t => isPortalStage(t.currentStage) && !t.isCompleted);
  const externalSiProjects = trackingStates.filter(t => !isPortalStage(t.currentStage) && !t.isCompleted);
  const overdueProjects = slas.filter(s => s.slaStatus === "Vencido" && !s.completedAt);
  const openObservations = observations.filter(o => o.status === "Abierta" && o.isBlocking);
  
  const funnelStages = [
    { code: "P1", name: "Registro", count: activePortalProjects.filter(p => p.currentStage === "P1").length },
    { code: "P2", name: "Arte", count: activePortalProjects.filter(p => p.currentStage === "P2").length },
    { code: "P3", name: "R&D", count: activePortalProjects.filter(p => p.currentStage === "P3").length },
    { code: "P4", name: "Finance", count: activePortalProjects.filter(p => p.currentStage === "P4").length },
    { code: "P5", name: "Cierre", count: activePortalProjects.filter(p => p.currentStage === "P5").length },
  ];
  
  // Basic metrics
  const totalClients = clients.length;
  const totalPortfolios = portfolios.length;

  const kpis = [
    {
      label: "Portafolios",
      value: String(totalPortfolios),
      description: "Familias registradas",
      icon: <FolderKanban size={24} />,
      colorClass: "text-blue-600 bg-blue-50",
    },
    {
      label: "En Portal Web",
      value: String(activePortalProjects.length),
      description: "Seguimiento P1-P5",
      icon: <BriefcaseBusiness size={24} />,
      colorClass: "text-[#003b5c] bg-blue-50",
    },
    {
      label: "En Sistema Integral",
      value: String(externalSiProjects.length),
      description: "Seguimiento externo",
      icon: <CheckCircle2 size={24} />,
      colorClass: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Vencidos",
      value: String(overdueProjects.length),
      description: "Proyectos críticos",
      icon: <AlertTriangle size={24} />,
      colorClass: "text-red-600 bg-red-50",
    },
    {
      label: "Observados",
      value: String(openObservations.length),
      description: "Frenan el avance",
      icon: <AlertTriangle size={24} />,
      colorClass: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <SummaryCard
            key={idx}
            title={kpi.label}
            value={kpi.value}
            subtitle={kpi.description}
            icon={kpi.icon}
            colorClass={kpi.colorClass.split(' ')[0]}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 mb-4">
          ETAPAS DEL PROYECTO (Portal Web)
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          {funnelStages.map((stage, idx) => (
            <div key={stage.code} className="flex-1 flex items-center relative group">
              <div className={`flex-1 rounded-lg p-4 transition-all ${
                stage.count > 0 ? "bg-[#e8f4f8] border border-[#1E82D9]" : "bg-slate-50 border border-slate-200"
              }`}>
                <div className="text-xs font-bold text-slate-500 uppercase">{stage.code} - {stage.name}</div>
                <div className={`text-3xl font-extrabold mt-1 ${stage.count > 0 ? "text-[#003b5c]" : "text-slate-400"}`}>
                  {stage.count}
                </div>
              </div>
              {idx < funnelStages.length - 1 && (
                <div className="hidden sm:flex items-center justify-center px-2 text-slate-300">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-gray-50">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
                Bandeja de seguimiento (SLA)
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Proyecto</th>
                  <th className="px-5 py-3 font-semibold">Área responsable</th>
                  <th className="px-5 py-3 font-semibold">Vencimiento</th>
                  <th className="px-5 py-3 font-semibold">Días restantes</th>
                  <th className="px-5 py-3 font-semibold">Estado SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {slas.slice(0, 10).map((sla) => {
                  // Calcular días restantes
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dueDate = new Date(sla.dueAt);
                  dueDate.setHours(0, 0, 0, 0);
                  const diffTime = dueDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  let daysText = "";
                  let daysClass = "";
                  if (diffDays > 1) {
                    daysText = `Faltan ${diffDays} días`;
                    daysClass = "text-green-600";
                  } else if (diffDays === 1) {
                    daysText = "Falta 1 día";
                    daysClass = "text-amber-600";
                  } else if (diffDays === 0) {
                    daysText = "Vence hoy";
                    daysClass = "text-red-600 font-semibold";
                  } else {
                    daysText = `Vencido hace ${Math.abs(diffDays)} días`;
                    daysClass = "text-red-600 font-semibold";
                  }
                  
                  return (
                    <tr key={sla.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/projects/${sla.projectCode}`)}>
                      <td className="px-5 py-4 font-bold text-[#003b5c]">{sla.projectCode}</td>
                      <td className="px-5 py-4 text-gray-600">{sla.responsibleArea}</td>
                      <td className="px-5 py-4 text-gray-500">{new Date(sla.dueAt).toLocaleDateString()}</td>
                      <td className={`px-5 py-4 ${daysClass}`}>{daysText}</td>
                      <td className="px-5 py-4">
                        <SlaStatusBadge status={sla.slaStatus} />
                      </td>
                    </tr>
                  );
                })}
                {slas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500 italic">No hay registros SLA</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 mb-4">
              Accesos rápidos
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-[#003b5c] hover:bg-[#f8fbfd] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#003b5c]">
                      <action.icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{action.label}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-[#003b5c]" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col max-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-gray-50">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
                Actividad reciente
              </h2>
            </div>
            <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
              {history.slice(0, 10).map((h) => (
                <div key={h.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-gray-800">{h.projectCode}</span>
                    <span className="text-xs text-gray-400">{new Date(h.changedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Cambio a <b>{h.toStatus}</b> por {h.changedBy} ({h.responsibleArea})
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="p-8 text-center text-gray-500 italic">No hay actividad reciente</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Proyectos Observados */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-gray-50">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
              Proyectos observados
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Proyecto</th>
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Etapa actual</th>
                <th className="px-5 py-3 font-semibold">Obs. abiertas</th>
                <th className="px-5 py-3 font-semibold">Veces observado</th>
                <th className="px-5 py-3 font-semibold">Última observación</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {observedProjects.slice(0, 10).map((obs) => (
                <tr key={obs.projectCode} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-bold text-[#003b5c]">{obs.projectCode}</td>
                  <td className="px-5 py-4 text-gray-600">{obs.clientName}</td>
                  <td className="px-5 py-4 text-gray-600">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {obs.currentStage}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {obs.openObservations > 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-700 font-bold rounded-full text-xs">
                        {obs.openObservations}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {obs.timesObserved} {obs.timesObserved === 1 ? "vez" : "veces"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-500">
                      {obs.lastObservationDate ? new Date(obs.lastObservationDate).toLocaleDateString() : "—"}
                    </div>
                    <div className="text-sm text-gray-700 truncate max-w-[200px]" title={obs.lastObservationDescription}>
                      {obs.lastObservationDescription || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/projects/${obs.projectCode}`)}
                      className="text-xs font-semibold text-[#003b5c] hover:text-[#1E82D9] underline"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {observedProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500 italic">
                    No hay proyectos con observaciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}