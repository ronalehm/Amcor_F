import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectByCode, type ProjectRecord } from "../../../shared/data/projectStorage";
import { getProjectSlaSummary, getProjectStatusHistory } from "../../../shared/data/slaStorage";
import { getProjectObservations } from "../../../shared/data/observationStorage";
import { getProjectTrackingState, advanceProjectStage, initializeProjectTracking } from "../../../shared/data/projectTrackingStorage";
import { getStageConfig, isPortalStage, type ProjectStage } from "../../../shared/data/projectStageConfig";
import { exportProjectToExcelMock } from "../services/projectExportService";

import PreviewRow from "../../../shared/components/display/PreviewRow";
import FormCard from "../../../shared/components/forms/FormCard";
import Button from "../../../shared/components/ui/Button";
import ValidationObservationsTable from "../../../shared/components/display/ValidationObservationsTable";
import ValidationStatusCard from "../../../shared/components/display/ValidationStatusCard";

import ProjectStageStepper from "../../../shared/components/projectTracking/ProjectStageStepper";
import ProjectStageCard from "../../../shared/components/projectTracking/ProjectStageCard";
import ProjectActionPanel from "../components/ProjectActionPanel";
import ProjectFieldImpactList from "../components/ProjectFieldImpactList";
import ProjectObservationPanel from "../../../shared/components/projectTracking/ProjectObservationPanel";
import ProjectSlaPanel from "../../../shared/components/projectTracking/ProjectSlaPanel";
import ProjectTrackingTimeline from "../../../shared/components/projectTracking/ProjectTrackingTimeline";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { projectCode } = useParams<{ projectCode: string }>();

  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [trackingState, setTrackingState] = useState<any | null>(null);
  const [slaSummary, setSlaSummary] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [observations, setObservations] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchProjectData = () => {
    if (projectCode) {
      const p = getProjectByCode(projectCode);
      setProject(p || null);
      if (p) {
        let ts = getProjectTrackingState(projectCode);
        if (!ts) {
          // Initialize for mock purposes if it doesn't exist
          initializeProjectTracking(projectCode, "Sistema");
          ts = getProjectTrackingState(projectCode);
        }
        setTrackingState(ts);
        
        const slas = getProjectSlaSummary(projectCode);
        // Find the active SLA
        const activeSla = slas.find(s => !s.completedAt) || slas[0]; 
        setSlaSummary(activeSla || null);
        
        setHistory(getProjectStatusHistory().filter(h => h.projectCode === projectCode));
        setObservations(getProjectObservations().filter(o => o.projectCode === projectCode));
      }
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectCode, refreshTrigger]);

  useEffect(() => {
    if (projectCode && project) {
      setHeader({
        title: "Tracking de Proyecto",
        breadcrumbs: [
          { label: "Proyectos", href: "/projects" },
          { label: projectCode },
          { label: "Tracking" },
        ],
        actions: (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/projects/${projectCode}/edit`)}>
              Editar Proyecto
            </Button>
            <Button variant="primary" onClick={() => exportProjectToExcelMock(projectCode as string)}>
              Exportar Ficha
            </Button>
          </div>
        )
      });
    }
    return () => resetHeader();
  }, [projectCode, project, setHeader, resetHeader, navigate]);

  if (!project || !trackingState) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Proyecto no encontrado o sin inicializar tracking</div>
        <Button variant="ghost" onClick={() => navigate("/projects")}>Volver a Proyectos</Button>
      </div>
    );
  }

  const currentStage: ProjectStage = trackingState.currentStage;
  const isPortal = isPortalStage(currentStage);
  const openBlockingObs = observations.some(o => o.status === "Abierta" && o.isBlocking);

  const handleAdvanceStage = (nextStage: ProjectStage) => {
    advanceProjectStage(projectCode as string, nextStage, "Usuario Actual", `Transición a ${getStageConfig(nextStage)?.name}`);
    setRefreshTrigger(prev => prev + 1);
  };

  const determineNextStage = (current: ProjectStage): ProjectStage => {
    const sequence: ProjectStage[] = ["P1", "P2", "P3", "P4", "P5", "P6"];
    const idx = sequence.indexOf(current);
    if (idx === -1 || idx === sequence.length - 1) return current;
    
    // Simulate conditional jumping (e.g. skip P2 if no design)
    if (current === "P1" && project?.designRoute === "Sin diseño") {
      return "P3";
    }
    
    return sequence[idx + 1];
  };

  const handleAdvance = () => {
    handleAdvanceStage(determineNextStage(currentStage));
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] space-y-6 pb-12">
      
      {/* 1. Stepper Global */}
      <ProjectStageStepper currentStage={currentStage} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lado Izquierdo: Ficha Única del Proyecto */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-[#003b5c] to-[#1E82D9] text-white">
              <div className="text-xs font-bold uppercase tracking-wide text-white/75 mb-1">
                Proyecto {project.code}
              </div>
              <h2 className="text-2xl font-bold">{project.projectName}</h2>
              <p className="text-sm opacity-90 mt-1">{project.projectDescription || "Sin descripción"}</p>
            </div>
          </div>

          {/* 1. INFORMACIÓN GENERAL */}
          <FormCard title="1. Información General" icon="▦" color="#003b5c">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="Código" value={project.code} />
              <PreviewRow label="Portafolio" value={project.portfolioCode} />
              <PreviewRow label="Planta de Origen" value={project.plantaName} />
              <PreviewRow label="Cliente" value={project.clientName} />
              <PreviewRow label="Ejecutivo Comercial" value={project.ejecutivoName} />
              <PreviewRow label="Nombre del Proyecto" value={project.projectName} />
              <PreviewRow label="Clasificación" value={project.classification} />
              <PreviewRow label="Sub-clasificación" value={project.subClassification} />
              <PreviewRow label="Tipo de Proyecto" value={project.projectType} />
              <PreviewRow label="Acción Salesforce" value={project.salesforceAction} />
              <PreviewRow label="Responsable Artes Gráficas" value={project.graphicResponsible} />
              <PreviewRow label="Comentarios AG" value={project.graphicComments} />
              <PreviewRow label="Responsable R&D" value={project.rdResponsible} />
              <PreviewRow label="Comentarios R&D" value={project.rdComments} />
              <PreviewRow label="Responsable Commercial Finance" value={project.commercialFinanceResponsible} />
              <PreviewRow label="Fecha Registro" value={new Date(project.createdAt).toLocaleDateString()} />
            </div>
          </FormCard>

          {/* 2. DATOS DE PRODUCTO COMERCIAL */}
          <FormCard title="2. Datos de Producto Comercial" icon="◈" color="#27ae60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="Formato de Plano" value={project.blueprintFormat} />
              <PreviewRow label="Aplicación Técnica" value={project.technicalApplication} />
              <PreviewRow label="Uso Final" value={project.useFinalName || project.usoFinal} />
              <PreviewRow label="Sub-segmento" value={project.subSegment} />
              <PreviewRow label="Segmento" value={project.segment} />
              <PreviewRow label="Sector" value={project.sector} />
              <PreviewRow label="AFMarketID" value={project.afMarketId} />
              <PreviewRow label="Volumen Estimado" value={project.estimatedVolume} />
              <PreviewRow label="Unidad de Medida" value={project.unitOfMeasure} />
              <PreviewRow label="Código de Empaque Cliente" value={project.customerPackingCode} />
            </div>
          </FormCard>

          {/* 3. ESPECIFICACIONES DE DISEÑO */}
          <FormCard title="3. Especificaciones de Diseño" icon="🎨" color="#7E3FB2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="Clase de Impresión" value={project.printClass} />
              <PreviewRow label="Tipo de Impresión" value={project.printType} />
              <PreviewRow label="¿Tiene diseño trabajado?" value={String(project.isPreviousDesign)} />
              <PreviewRow label="Código EDAG" value={project.previousEdagCode} />
              <PreviewRow label="Versión EDAG" value={project.previousEdagVersion} />
              <PreviewRow label="Especificaciones Especiales" value={project.specialDesignSpecs} />
              <PreviewRow label="Comentarios de Diseño" value={project.specialDesignComments} />
              <PreviewRow label="¿Archivos digitales?" value={typeof project.hasDigitalFiles === 'boolean' ? (project.hasDigitalFiles ? "Sí" : "No") : String(project.hasDigitalFiles)} />
              <PreviewRow label="Tipo de Archivo de Arte" value={project.artworkFileType} />
              <PreviewRow label="Adjuntos de Arte" value={project.artworkAttachments} />
              <PreviewRow label="¿Requiere trabajo de diseño?" value={project.requiresDesignWork ? "Sí" : "No"} />
            </div>
          </FormCard>

          {/* 4. ESPECIFICACIONES DE ESTRUCTURA */}
          <FormCard title="4. Especificaciones de Estructura" icon="⚙" color="#1E82D9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="¿Estructura de referencia?" value={typeof project.hasReferenceStructure === 'boolean' ? (project.hasReferenceStructure ? "Sí" : "No") : String(project.hasReferenceStructure)} />
              <PreviewRow label="Código EM Referencia" value={project.referenceEmCode} />
              <PreviewRow label="Versión EM Referencia" value={project.referenceEmVersion} />
              <PreviewRow label="Tipo de Estructura" value={project.structureType} />
              <PreviewRow label="¿Especificación técnica cliente?" value={typeof project.hasCustomerTechnicalSpec === 'boolean' ? (project.hasCustomerTechnicalSpec ? "Sí" : "No") : String(project.hasCustomerTechnicalSpec)} />
              <PreviewRow label="Adjunto especificación técnica" value={project.customerTechnicalSpecAttachment} />
              
              <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                <h4 className="font-semibold text-slate-700 mb-3">Capas</h4>
              </div>
              
              <PreviewRow label="Material Capa 1" value={project.layer1Material} />
              <PreviewRow label="Micraje Capa 1" value={project.layer1Micron} />
              <PreviewRow label="Gramaje Capa 1" value={project.layer1Grammage} />
              <PreviewRow label="Material Capa 2" value={project.layer2Material} />
              <PreviewRow label="Micraje Capa 2" value={project.layer2Micron} />
              <PreviewRow label="Gramaje Capa 2" value={project.layer2Grammage} />
              <PreviewRow label="Material Capa 3" value={project.layer3Material} />
              <PreviewRow label="Micraje Capa 3" value={project.layer3Micron} />
              <PreviewRow label="Gramaje Capa 3" value={project.layer3Grammage} />
              <PreviewRow label="Material Capa 4" value={project.layer4Material} />
              <PreviewRow label="Micraje Capa 4" value={project.layer4Micron} />
              <PreviewRow label="Gramaje Capa 4" value={project.layer4Grammage} />
              
              <PreviewRow label="Gramaje Total" value={project.grammage} />
              <PreviewRow label="Tolerancia de Gramaje" value={project.grammageTolerance} />
              <PreviewRow label="Máquina de Envasado" value={project.packingMachineName || project.maquinaCliente} />
              <PreviewRow label="Solicitud de Muestra" value={project.sampleRequest ? "Sí" : "No"} />
            </div>
          </FormCard>

          {/* 5. DIMENSIONES Y ACCESORIOS */}
          <FormCard title="5. Dimensiones y Accesorios" icon="📐" color="#f39c12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="md:col-span-2">
                <h4 className="font-semibold text-slate-700 mb-3">Dimensiones (mm)</h4>
              </div>
              <PreviewRow label="Ancho" value={project.width} />
              <PreviewRow label="Largo" value={project.length} />
              <PreviewRow label="Repetición" value={project.repetition} />
              <PreviewRow label="Base Doy Pack" value={project.doyPackBase} />
              <PreviewRow label="Ancho de Fuelle" value={project.gussetWidth} />
              
              <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                <h4 className="font-semibold text-slate-700 mb-3">Accesorios</h4>
              </div>
              
              <PreviewRow label="Zipper" value={project.hasZipper ? (project.zipperType || "Sí") : "No"} />
              <PreviewRow label="Tin Tie" value={project.hasTinTie ? "Sí" : "No"} />
              <PreviewRow label="Válvula" value={project.hasValve ? (project.valveType || "Sí") : "No"} />
              <PreviewRow label="Troquel Asa" value={project.hasDieCutHandle ? "Sí" : "No"} />
              <PreviewRow label="Refuerzo" value={project.hasReinforcement ? `Sí (${project.reinforcementThickness}x${project.reinforcementWidth})` : "No"} />
              <PreviewRow label="Corte Angular" value={project.hasAngularCut ? "Sí" : "No"} />
              <PreviewRow label="Esquinas Redondeadas" value={project.hasRoundedCorners ? (project.roundedCornersType || "Sí") : "No"} />
              <PreviewRow label="Muesca" value={project.hasNotch ? "Sí" : "No"} />
              <PreviewRow label="Perforación" value={project.hasPerforation ? `${project.pouchPerforationType || ""} ${project.bagPerforationType || ""}` : "No"} />
              <PreviewRow label="Pre-Corte" value={project.hasPreCut ? (project.preCutType || "Sí") : "No"} />
              <PreviewRow label="Otros Accesorios" value={project.otherAccessories} />
              
              <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                <h4 className="font-semibold text-slate-700 mb-3">Datos de Tuco / Core</h4>
              </div>
              
              <PreviewRow label="Material de Tuco" value={project.coreMaterial} />
              <PreviewRow label="Diámetro de Tuco" value={project.coreDiameter} />
              <PreviewRow label="Diámetro Exterior" value={project.externalDiameter} />
              <PreviewRow label="Variación Exterior (+)" value={project.externalVariationPlus} />
              <PreviewRow label="Variación Exterior (-)" value={project.externalVariationMinus} />
              <PreviewRow label="Peso Máximo Bobina" value={project.maxRollWeight} />
            </div>
          </FormCard>

          {/* 6. ESPECIFICACIONES FINANCIERAS */}
          <FormCard title="6. Especificaciones Financieras / Comerciales" icon="💰" color="#16a085">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="Tipo de Venta" value={project.saleType} />
              <PreviewRow label="Incoterm" value={project.incoterm} />
              <PreviewRow label="País de Destino" value={project.destinationCountry} />
              <PreviewRow label="Precio Objetivo" value={project.targetPrice} />
              <PreviewRow label="Precio de Venta" value={project.salePrice} />
              <PreviewRow label="Tipo de Moneda" value={project.currencyType} />
              <PreviewRow label="Condiciones de Pago" value={project.paymentTerms} />
              <PreviewRow label="Logo Producto Peruano" value={project.peruvianProductLogo} />
              <PreviewRow label="Pie de Imprenta" value={project.printingFooter} />
              <PreviewRow label="Información Adicional" value={project.customerAdditionalInfo} />
            </div>
          </FormCard>
        </div>

        {/* Lado Derecho: Tracking, Validaciones, SLAs y Observaciones */}
        <div className="space-y-6">

          <ValidationStatusCard project={project} />

          <ProjectStageCard
            currentStage={currentStage}
            stageUpdatedAt={trackingState.stageUpdatedAt}
          />

          <ProjectFieldImpactList 
            projectData={project} 
            area={currentStage === "P1" ? "P1 - Comercial" : 
                  currentStage === "P2" ? "P2 - Artes Gráficas" :
                  currentStage === "P3" ? "P3 - R&D" :
                  currentStage === "P4" ? "P4 - Commercial Finance" :
                  currentStage === "P5" ? "P5 - Crédito / Cierre" : "P1 - Comercial"}
          />

          {isPortal && (
            <ProjectActionPanel projectCode={projectCode as string} stageCode={currentStage}
              isCompleted={!isPortal}
              openObservationsCount={observations.filter(o => o.status === "Abierta" && o.isBlocking).length}
              hasBlockingObservations={openBlockingObs}
              onAdvance={handleAdvance}
              onObserve={() => alert("Usa el panel de observaciones para añadir una nueva.")}
              onExportExcel={() => exportProjectToExcelMock(projectCode as string)}
              onSendOffer={() => handleAdvance()}
              onRequestCreditEvaluation={() => alert("Solicitando evaluación a Crédito...")}
              onApproveManufacturing={() => handleAdvance()}
              onApproveSample={() => handleAdvance()}
              onReject={() => alert("Proyecto desestimado.")}
            />
          )}

          <ProjectSlaPanel sla={slaSummary} isPortalStage={isPortal} />

          <ProjectObservationPanel
            projectCode={projectCode as string}
            observations={observations}
            onUpdate={() => setRefreshTrigger(prev => prev + 1)}
            isReadOnly={!isPortal}
          />

          {project.validaciones && project.validaciones.length > 0 && (
            <FormCard title="Observaciones y comentarios de validación" icon="✓" color="#003b5c">
              <ValidationObservationsTable validaciones={project.validaciones} />
            </FormCard>
          )}

          <ProjectTrackingTimeline history={history} />
          
        </div>
      </div>
    </div>
  );
}
