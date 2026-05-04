import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getPortfolioDisplayRecords, TECHNICAL_APPLICATION_OPTIONS } from "../../../shared/data/portfolioStorage";
import { getProjectByCode, updateProjectRecord, type ProjectRecord, type BooleanLike } from "../../../shared/data/projectStorage";
import { getActiveExecutiveRecords } from "../../../shared/data/executiveStorage";
import { getActiveUsers, getCurrentUser } from "../../../shared/data/userStorage";
import { getCatalogOptions } from "../../../shared/data/projectCatalogStorage";
import { getProjectTrackingState } from "../../../shared/data/projectTrackingStorage";
import { PHASE_CONFIGS, type PhaseRole } from "../../../shared/data/projectPhaseConfig";
import { useProjectPhase } from "../../../shared/hooks/useProjectPhase";
import type { ProjectStage } from "../../../shared/data/projectStageConfig";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import PortfolioSearch from "../../../shared/components/forms/PortfolioSearch";
import CommercialExecutiveSearch from "../../../shared/components/forms/CommercialExecutiveSearch";

const POUCH_FORMAT_OPTIONS = [
  { value: "POUCH C/SELLO EN FUELLE\\TIPO 4-1\\FUELLE PROPIO", label: "POUCH C/SELLO EN FUELLE\\TIPO 4-1\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\TIPO K\\FUELLE PROPIO", label: "POUCH STAND UP\\TIPO K\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO", label: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE PROPIO", label: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE PROPIO" },
  { value: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE INSERTADO", label: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE INSERTADO" },
  { value: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE INSERTADO", label: "POUCH STAND UP\\DOY PACK CUADRADO\\FUELLE INSERTADO" },
  { value: "POUCH STAND UP\\NORMAL\\FUELLE PROPIO", label: "POUCH STAND UP\\NORMAL\\FUELLE PROPIO" },
  { value: "POUCH PLANO\\DOS SELLOS", label: "POUCH PLANO\\DOS SELLOS" },
  { value: "POUCH PLANO\\TRES SELLOS", label: "POUCH PLANO\\TRES SELLOS" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE" },
  { value: "POUCH C/SELLO EN FUELLE\\TIPO 1-1", label: "POUCH C/SELLO EN FUELLE\\TIPO 1-1" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE (PE-PE/PE)", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\CON FUELLE (PE-PE/PE)" },
  { value: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE (PE-PE/PE)", label: "POUCH C/SELLO CENTRAL\\TIPO ALETA\\SIN FUELLE (PE-PE/PE)" },
];

const BOLSA_FORMAT_OPTIONS = [
  { value: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO", label: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO" },
  { value: "SELLO LATERAL\\PESTAÑA\\CON FUELLE FONDO", label: "SELLO LATERAL\\PESTAÑA\\CON FUELLE FONDO" },
  { value: "SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO", label: "SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO" },
  { value: "SELLO LATERAL\\CORTE\\SIN FUELLE FONDO", label: "SELLO LATERAL\\CORTE\\SIN FUELLE FONDO" },
  { value: "SELLO DE FONDO\\CON FUELLE LATERAL", label: "SELLO DE FONDO\\CON FUELLE LATERAL" },
  { value: "SELLO DE FONDO\\SIN FUELLE LATERAL", label: "SELLO DE FONDO\\SIN FUELLE LATERAL" },
  { value: "WICKET", label: "WICKET" },
  { value: "HOJAS", label: "HOJAS" },
];

const LAMINA_FORMAT_OPTIONS = [
  { value: "GENERICA", label: "GENERICA" },
  { value: "TISSUE", label: "TISSUE" },
  { value: "FOOD", label: "FOOD" },
];

function normalizeWrapping(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function getBlueprintFormatOptions(wrapping: string | undefined): Array<{ value: string; label: string }> {
  if (!wrapping) return [];
  const normalized = normalizeWrapping(wrapping);
  if (normalized === "pouch") return POUCH_FORMAT_OPTIONS;
  if (normalized === "bolsa") return BOLSA_FORMAT_OPTIONS;
  if (normalized === "lamina") return LAMINA_FORMAT_OPTIONS;
  return [];
}

const SPECIAL_DESIGN_SPECS_OPTIONS = [
  { value: "Tintas Holográficas", label: "Tintas Holográficas" },
  { value: "Efectos/texturas/características especiales", label: "Efectos/texturas/características especiales" },
  { value: "Acabados Especiales o Barnices nuevos", label: "Acabados Especiales o Barnices nuevos" },
  { value: "Otros (comentar cuáles)", label: "Otros (comentar cuáles)" },
  { value: "No aplica", label: "No aplica" },
];

const DOY_PACK_BASE_OPTIONS = [
  { value: "Redonda", label: "Redonda" },
  { value: "Cuadrada", label: "Cuadrada" },
  { value: "No aplica", label: "No aplica" },
];

const CORE_MATERIAL_OPTIONS = [
  { value: "Cartón", label: "Cartón" },
  { value: "Plástico", label: "Plástico" },
  { value: "Metal", label: "Metal" },
  { value: "Otros", label: "Otros" },
];

const GUSSET_TYPE_OPTIONS = [
  { value: "Lateral", label: "Lateral" },
  { value: "Fondo", label: "Fondo" },
];

const ZIPPER_TYPE_OPTIONS = [
  { value: "Convencional", label: "Convencional" },
  { value: "String Zipper", label: "String Zipper" },
];

const VALVE_TYPE_OPTIONS = [
  { value: "Degasificadora", label: "Degasificadora" },
  { value: "Dosificadora", label: "Dosificadora" },
];

const ROUNDED_CORNERS_TYPE_OPTIONS = [
  { value: "Redondeo esquinas del Fondo", label: "Redondeo esquinas del Fondo" },
  { value: "Redondeo todas las esquinas", label: "Redondeo todas las esquinas" },
];

const POUCH_PERFORATION_TYPE_OPTIONS = [
  { value: "Ojal", label: "Ojal" },
  { value: "Circular", label: "Circular" },
  { value: "Europunch", label: "Europunch" },
];

const BAG_PERFORATION_TYPE_OPTIONS = [
  { value: "Cruz", label: "Cruz" },
  { value: "Media luna", label: "Media luna" },
];

const PERFORATION_LOCATION_OPTIONS = [
  { value: "Delantero", label: "Delantero" },
  { value: "Posterior", label: "Posterior" },
];

const PRECUT_TYPE_OPTIONS = [
  { value: "Pre-corte mecánico abre fácil sectorizado", label: "Pre-corte mecánico abre fácil sectorizado" },
  { value: "Pre-corte mecánico abre fácil", label: "Pre-corte mecánico abre fácil" },
];

const OTHER_ACCESSORIES_OPTIONS = [
  { value: "Pega-pega", label: "Pega-pega" },
  { value: "No aplica", label: "No aplica" },
];

export default function ProjectEditPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { projectCode } = useParams<{ projectCode: string }>();

  const [form, setForm] = useState<Partial<ProjectRecord>>({
    // 1. Información General
    portfolioCode: "",
    projectName: "",
    projectDescription: "",
    ejecutivoId: undefined,
    siUserId: "",
    classification: "Nuevo",
    subClassification: "SFDC - R&D",
    projectType: "ICO",
    salesforceAction: "",

    // 3. Datos de Producto Comercial
    blueprintFormat: "",
    technicalApplication: "",
    estimatedVolume: "",
    unitOfMeasure: "KGS",
    customerPackingCode: "",

    // 4. Especificaciones de Diseño
    printClass: "",
    printType: "",
    specialDesignSpecs: "",
    specialDesignComments: "",
    edagCode: "",
    edagVersion: "",
    isPreviousDesign: "No",
    previousEdagCode: "",
    previousEdagVersion: "",

    // 5. Especificaciones de Estructura
    hasReferenceStructure: "No",
    referenceEmCode: "",
    referenceEmVersion: "",
    structureType: "Monocapa",
    layer1Material: "",
    layer1Micron: "",
    layer1Grammage: "",
    layer2Material: "",
    layer2Micron: "",
    layer2Grammage: "",
    layer3Material: "",
    layer3Micron: "",
    layer3Grammage: "",
    layer4Material: "",
    layer4Micron: "",
    layer4Grammage: "",
    specialStructureSpecs: "",
    grammage: "",
    grammageTolerance: "",
    sampleRequest: "No",

    // 6. Dimensiones y Accesorios
    width: "",
    length: "",
    repetition: "",
    doyPackBase: "",
    gussetWidth: "",
    gussetType: "",
    hasZipper: "No",
    zipperType: "",
    hasTinTie: "No",
    hasValve: "No",
    valveType: "",
    hasDieCutHandle: "No",
    hasReinforcement: "No",
    reinforcementThickness: "",
    reinforcementWidth: "",
    hasAngularCut: "No",
    hasRoundedCorners: "No",
    roundedCornersType: "",
    hasNotch: "No",
    hasPerforation: "No",
    pouchPerforationType: "",
    bagPerforationType: "",
    perforationLocation: "",
    hasPreCut: "No",
    preCutType: "",
    otherAccessories: "",

    // 7. Especificaciones Financieras
    saleType: "Nacional",
    incoterm: "No aplica",
    destinationCountry: "Perú",
    targetPrice: "",
    currencyType: "Soles",
    coreMaterial: "",
    coreDiameter: "",
    externalDiameter: "",
    externalVariationPlus: "",
    externalVariationMinus: "",
    maxRollWeight: "",
    customerAdditionalInfo: "",
    peruvianProductLogo: "No",
    printingFooter: "No",
  });
  
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<ProjectStage>("P1");
  const [userRole, setUserRole] = useState<PhaseRole>("Comercial");

  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);
  const executives = useMemo(() => getActiveExecutiveRecords(), []);
  const siUsers = useMemo(() => getActiveUsers(), []);

  const { getFieldStatus } = useProjectPhase({ currentStage, userRole });

  useEffect(() => {
    if (!projectCode) {
      setError("Código de proyecto no válido");
      setLoading(false);
      return;
    }

    const project = getProjectByCode(projectCode);
    if (!project) {
      setError(`Proyecto ${projectCode} no encontrado`);
      setLoading(false);
      return;
    }

    // Get current project stage and user role
    const trackingState = getProjectTrackingState(projectCode);
    if (trackingState) {
      setCurrentStage(trackingState.currentStage as ProjectStage);
    }

    // Determine user role based on current user (simplified - could come from auth system)
    const currentUser = getCurrentUser();
    if (currentUser?.role) {
      const roleMap: Record<string, PhaseRole> = {
        "Comercial": "Comercial",
        "ArteGraficas": "ArteGraficas",
        "RyD": "RyD",
        "CF": "CF",
        "Credito": "Credito",
      };
      setUserRole(roleMap[currentUser.role] || "Comercial");
    }

    // Helper to convert boolean/string to "Sí"/"No"
    const toYesNo = (val: any) => {
      if (val === true || val === "Sí" || val === "Si") return "Sí";
      if (val === false || val === "No" || val === null || val === undefined) return "No";
      return val;
    };

    setForm({
      ...project,
      // Convertir campos booleanos a strings "Sí"/"No"
      hasReferenceStructure: toYesNo(project.hasReferenceStructure),
      sampleRequest: toYesNo(project.sampleRequest),
      hasZipper: toYesNo(project.hasZipper),
      hasTinTie: toYesNo(project.hasTinTie),
      hasValve: toYesNo(project.hasValve),
      hasDieCutHandle: toYesNo(project.hasDieCutHandle),
      hasReinforcement: toYesNo(project.hasReinforcement),
      hasAngularCut: toYesNo(project.hasAngularCut),
      hasRoundedCorners: toYesNo(project.hasRoundedCorners),
      hasNotch: toYesNo(project.hasNotch),
      hasPerforation: toYesNo(project.hasPerforation),
      hasPreCut: toYesNo(project.hasPreCut),
      peruvianProductLogo: toYesNo(project.peruvianProductLogo),
      printingFooter: toYesNo(project.printingFooter),
      // Valores por defecto para campos nuevos si no existen
      classification: project.classification || "Nuevo",
      subClassification: project.subClassification || "SFDC - R&D",
      projectType: project.projectType || "ICO",
      unitOfMeasure: project.unitOfMeasure || "KG",
      structureType: project.structureType || "Monocapa",
      designRoute: project.designRoute || "Sin diseño",
      saleType: project.saleType || "Nacional",
      incoterm: project.incoterm || "No aplica",
      destinationCountry: project.destinationCountry || "Perú",
      currencyType: project.currencyType || "Soles",
      isPreviousDesign: toYesNo(project.isPreviousDesign),
      previousEdagCode: project.previousEdagCode || "",
      previousEdagVersion: project.previousEdagVersion || "",
    });

    setLoading(false);
  }, [projectCode]);

  const selectedPortfolio = useMemo(() => {
    return portfolios.find(p => p.id === form.portfolioCode || p.codigo === form.portfolioCode) || null;
  }, [form.portfolioCode, portfolios]);

  const inheritedWrapping = selectedPortfolio?.env || selectedPortfolio?.envoltura || selectedPortfolio?.wrappingName || "";

  useEffect(() => {
    if (projectCode && !loading) {
      const phaseConfig = PHASE_CONFIGS[currentStage];
      setHeader({
        title: "Editar Proyecto",
        subtitle: `${phaseConfig.name} - ${phaseConfig.description}`,
        breadcrumbs: [{ label: "Proyectos", href: "/projects" }, { label: projectCode }, { label: "Editar" }],
        badges: (
          <div className="flex gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {phaseConfig.name}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              ID: {projectCode}
            </span>
          </div>
        )
      });
    }
    return () => resetHeader();
  }, [setHeader, resetHeader, projectCode, loading, currentStage]);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const markFieldAsTouched = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    if (!form.portfolioCode) errors.portfolioCode = "Seleccione un portafolio base.";
    if (!form.projectName?.trim()) errors.projectName = "Ingrese el nombre del proyecto.";
    if (!form.salesforceAction?.trim()) errors.salesforceAction = "Ingrese la acción Salesforce.";
    if (!form.blueprintFormat) errors.blueprintFormat = "Seleccione el formato de plano.";
    if (!form.technicalApplication) errors.technicalApplication = "Seleccione la aplicación técnica.";
    if (!form.estimatedVolume?.trim()) errors.estimatedVolume = "Ingrese el volumen estimado.";
    if (!form.unitOfMeasure) errors.unitOfMeasure = "Seleccione la unidad de medida.";
    if (!form.designRoute) errors.designRoute = "Seleccione la ruta de diseño.";
    return errors;
  }, [form]);

  const shouldShowFieldError = (field: string) => {
    return Boolean(
      validationErrors[field] && (submitAttempted || touchedFields[field])
    );
  };

  const getError = (field: string) => {
    return shouldShowFieldError(field) ? validationErrors[field] || "" : "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0 || !projectCode) {
      if (Object.keys(validationErrors).length > 0) {
        const fieldsWithErrors = Object.keys(validationErrors).reduce(
          (acc, field) => {
            acc[field] = true;
            return acc;
          },
          {} as Partial<Record<string, boolean>>
        );
        setTouchedFields((prev) => ({
          ...prev,
          ...fieldsWithErrors,
        }));
      }
      return;
    }

    const selectedExecutive = executives.find(ex => ex.id === Number(form.ejecutivoId));
    const selectedSiUser = siUsers.find(user => user.id === form.siUserId);

    updateProjectRecord(projectCode, {
      ...form,
      code: projectCode,
      portfolioCode: form.portfolioCode || "",
      projectName: form.projectName || "",
      ejecutivoId: form.ejecutivoId,
      ejecutivoName: selectedExecutive?.name || form.ejecutivoName,
      siUserId: form.siUserId,
      siUserCode: selectedSiUser?.code || form.siUserCode,
      // Inherited from portfolio
      clientName: selectedPortfolio?.cli || selectedPortfolio?.clientName || form.clientName || "",
      wrappingName: selectedPortfolio?.env || selectedPortfolio?.envoltura || form.wrappingName,
      useFinalName: selectedPortfolio?.uf || selectedPortfolio?.usoFinal || form.useFinalName,
      sector: selectedPortfolio?.sector || form.sector,
      segment: selectedPortfolio?.seg || selectedPortfolio?.segmento || form.segment,
      subSegment: selectedPortfolio?.subseg || selectedPortfolio?.subSegmento || form.subSegment,
      afMarketId: selectedPortfolio?.af || selectedPortfolio?.afMarketId || form.afMarketId,
      requiresDesignWork: (form.printClass as string) === "Sin impresión" ? "No" : "Sí",
      isPreviousDesign: form.isPreviousDesign as BooleanLike,
      previousEdagCode: form.previousEdagCode,
      previousEdagVersion: form.previousEdagVersion,
      status: form.status || "Registrado",
      updatedAt: new Date().toISOString(),
    } as ProjectRecord);

    navigate(`/projects/${projectCode}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando proyecto...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">{error}</div>
        <button onClick={() => navigate("/projects")} className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium">Volver a Proyectos</button>
      </div>
    );
  }

  const phaseConfig = PHASE_CONFIGS[currentStage];
  const canEditField = (fieldName: string) => getFieldStatus(fieldName).editable;

  const isBaseInfoComplete = Boolean(
    form.salesforceAction?.trim() &&
    form.projectName?.trim() &&
    form.projectDescription?.trim()
  );

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <button
        type="button"
        onClick={() => navigate("/projects")}
        className="mb-3 flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <form onSubmit={handleSubmit}>
        {/* Phase Information Panel */}
        <div className="m-5 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-bold uppercase text-blue-700 tracking-wide mb-1">Fase Actual de Edición</div>
              <h3 className="text-lg font-bold text-blue-900">{phaseConfig.name}</h3>
              <p className="text-sm text-blue-800 mt-1">{phaseConfig.description}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-700 font-semibold mb-2">ROL REQUERIDO</div>
              <div className="inline-block bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                {phaseConfig.primaryRole}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">ℹ️ Nota:</span> En esta fase, solo puedes editar campos específicos. Los campos de fases anteriores se muestran como referencia (solo lectura).
            </p>
          </div>
        </div>

        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard title="Datos Iniciales Requeridos" icon="⚡" color="#E98300" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormInput
                  label="Acción Salesforce *"
                  value={form.salesforceAction || ""}
                  onChange={(v) => updateField("salesforceAction", v)}
                  error={getError("salesforceAction")}
                  placeholder="Ej. Nueva oportunidad / RFQ / Muestra"
                />
                <div className="md:col-span-3">
                  <FormInput
                    label="Nombre del Proyecto *"
                    value={form.projectName || ""}
                    onChange={(v) => updateField("projectName", v)}
                    error={getError("projectName")}
                    placeholder="Ej. Mayonesa Light 100ml Doypack"
                  />
                </div>
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Descripción del Proyecto *"
                    value={form.projectDescription || ""}
                    onChange={(v) => updateField("projectDescription", v)}
                    placeholder="Descripción comercial y técnica del proyecto..."
                  />
                </div>
              </div>
            </FormCard>

            <fieldset disabled={!isBaseInfoComplete} className={`space-y-5 transition-all duration-300 ${!isBaseInfoComplete ? "opacity-50 pointer-events-none grayscale-[0.2]" : ""}`}>
              <FormCard title="1. Información general" icon="▦" color="#00395A" required>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <PortfolioSearch
                  label="Portafolio base *"
                  value={form.portfolioCode || ""}
                  onChange={(v) => {
                    updateField("portfolioCode", v);
                    updateField("blueprintFormat", "");
                  }}
                  error={getError("portfolioCode")}
                />
                <CommercialExecutiveSearch
                  label="Ejecutivo Comercial *"
                  value={form.ejecutivoId ? String(form.ejecutivoId) : ""}
                  onChange={(v) => updateField("ejecutivoId", v)}
                  error={getError("ejecutivoId")}
                />
                <FormSelect
                  label="Clasificación"
                  value={form.classification}
                  onChange={(v) => {
                    updateField("classification", v);
                    updateField("subClassification", "");
                    updateField("projectType", "");
                  }}
                  options={[
                    { value: "Nuevo", label: "Nuevo" },
                    { value: "Modificado", label: "Modificado" },
                  ]}
                />
                <FormSelect
                  label="Subsección Clasificación"
                  value={form.subClassification}
                  onChange={(v) => {
                    updateField("subClassification", v);
                    updateField("projectType", "");
                  }}
                  options={
                    form.classification === "Nuevo"
                      ? [
                          { value: "Desarrollo_RD", label: "Desarrollo_RD" },
                          { value: "Área_Técnica", label: "Área_Técnica" },
                        ]
                      : form.classification === "Modificado"
                        ? [
                            { value: "Diseño y Dimensiones", label: "Diseño y Dimensiones" },
                            { value: "Estructura", label: "Estructura" },
                          ]
                        : []
                  }
                  disabled={!form.classification}
                />
                <FormSelect
                  label="Tipo de Proyecto"
                  value={form.projectType}
                  onChange={(v) => updateField("projectType", v)}
                  options={
                    form.subClassification === "Desarrollo_RD" || form.subClassification?.includes("R&D")
                      ? [
                          { value: "Producto nuevo", label: "Producto nuevo" },
                          { value: "Nuevo equipamiento de envasado", label: "Nuevo equipamiento de envasado" },
                          { value: "Nuevos insumos", label: "Nuevos insumos" },
                          { value: "Nueva estructura", label: "Nueva estructura" },
                          { value: "Nuevo formato de envasado", label: "Nuevo formato de envasado" },
                          { value: "Nuevos accesorios", label: "Nuevos accesorios" },
                          { value: "Nuevos procesos por el lado del cliente", label: "Nuevos procesos por el lado del cliente" },
                          { value: "Nuevas temperaturas de envasado y almacenaje", label: "Nuevas temperaturas de envasado y almacenaje" },
                        ]
                      : form.subClassification === "Área_Técnica" || form.subClassification?.includes("T\u00E9cnica")
                        ? [
                            { value: "Extensión de línea por familia (EM de referencia)", label: "Extensión de línea por familia (EM de referencia)" },
                            { value: "Modifica Dimensiones", label: "Modifica Dimensiones" },
                            { value: "Modifica Propiedades", label: "Modifica Propiedades" },
                            { value: "Portafolio Estándar", label: "Portafolio Estándar" },
                            { value: "ICO (Intercompany), BCP (Business Continous Production)", label: "ICO (Intercompany), BCP (Business Continous Production)" },
                          ]
                        : []
                  }
                  disabled={!form.subClassification || (form.classification === "Modificado" && (form.subClassification === "Estructura" || form.subClassification === "Diseño y dimensiones"))}
                />
              </div>
            </FormCard>



            <FormCard title="2. Datos de producto comercial" icon="◈" color="#27ae60" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormInput
                  label="Envoltura (heredado del Portafolio)"
                  value={inheritedWrapping || "— Sin portafolio seleccionado —"}
                  onChange={() => {}}
                  disabled={true}
                />
                <FormSelect
                  label="Formato de Plano *"
                  value={form.blueprintFormat}
                  onChange={(v) => updateField("blueprintFormat", v)}
                  error={getError("blueprintFormat")}
                  placeholder={!inheritedWrapping ? "Seleccione un portafolio primero" : "-- Seleccione --"}
                  options={getBlueprintFormatOptions(inheritedWrapping)}
                  disabled={!inheritedWrapping}
                />
                <FormSelect
                  label="Aplicación Técnica *"
                  value={form.technicalApplication}
                  onChange={(v) => updateField("technicalApplication", v)}
                  error={getError("technicalApplication")}
                  placeholder="-- Seleccione --"
                  options={TECHNICAL_APPLICATION_OPTIONS}
                />
                <FormInput
                  label="Código de Empaque del Cliente"
                  value={form.customerPackingCode}
                  onChange={(v) => updateField("customerPackingCode", v)}
                  placeholder="Ej. COD-CLI-001"
                />
              </div>
            </FormCard>

            <FormCard title="4. Especificaciones de diseño" icon="🎨" color="#8e44ad">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {(() => {
                  const isPrintingDisabled = (form.printClass as string) === "Sin impresión";
                  return (
                    <>
                      <FormSelect
                        label="Clase de Impresión"
                        value={form.printClass}
                        onChange={(v) => updateField("printClass", v)}
                        placeholder="-- Seleccione --"
                        options={[
                          { value: "Flexo", label: "Flexo" },
                          { value: "Huecograbado", label: "Huecograbado" },
                          { value: "Sin impresión", label: "Sin impresión" },
                        ]}
                      />
                      <FormSelect
                        label="Tipo de Impresión"
                        value={form.printType}
                        onChange={(v) => updateField("printType", v)}
                        placeholder="-- Seleccione --"
                        options={[
                          { value: "Nuevo", label: "Nuevo" },
                          { value: "Repetitivo", label: "Repetitivo" },
                        ]}
                        disabled={isPrintingDisabled}
                      />
                      <FormSelect
                        label="Especificaciones de Diseño Especiales"
                        value={form.specialDesignSpecs}
                        onChange={(v) => updateField("specialDesignSpecs", v)}
                        placeholder="-- Seleccione --"
                        options={SPECIAL_DESIGN_SPECS_OPTIONS}
                        disabled={isPrintingDisabled}
                      />
                      <FormSelect
                        label="¿Tiene Diseño de referencia?"
                        value={form.isPreviousDesign as string}
                        onChange={(v) => updateField("isPreviousDesign", v)}
                        placeholder="-- Seleccione --"
                        options={[
                          { value: "Sí", label: "Sí" },
                          { value: "No", label: "No" },
                        ]}
                      />
                    </>
                  );
                })()}
                {form.specialDesignSpecs === "Otros (comentar cuáles)" && (
                  <div className="md:col-span-3">
                    <FormTextarea
                      label="Comentarios de diseños especiales"
                      value={form.specialDesignComments}
                      onChange={(v) => updateField("specialDesignComments", v)}
                      placeholder="Comentarios adicionales de Artes Gráficas..."
                    />
                  </div>
                )}

                {form.isPreviousDesign === "Sí" && (
                  <>
                    <FormInput
                      label="Código EDAG"
                      value={form.edagCode as string}
                      onChange={(v) => updateField("edagCode", v)}
                      placeholder="Ej. EDAG-000001"
                      disabled={(form.printClass as string) === "Sin impresión"}
                    />
                    <FormInput
                      label="Versión EDAG"
                      value={form.edagVersion as string}
                      onChange={(v) => updateField("edagVersion", v)}
                      placeholder="Ej. 01"
                      disabled={(form.printClass as string) === "Sin impresión"}
                    />
                  </>
                )}
                {form.printClass && (
                  <div className="md:col-span-3">
                    <FormSelect
                      label="¿Requiere trabajo de diseño?"
                      value={(form.printClass as string) === "Sin impresión" ? "No" : "Sí"}
                      onChange={() => {}}
                      options={[
                        { value: "Sí", label: "Sí" },
                        { value: "No", label: "No" },
                      ]}
                      disabled={true}
                    />
                  </div>
                )}
              </div>
            </FormCard>

            <FormCard title="5. Especificaciones de estructura" icon="🔩" color="#f39c12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="¿Tiene estructura de referencia?"
                  value={form.hasReferenceStructure as string}
                  onChange={(v) => updateField("hasReferenceStructure", v)}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />
                {form.hasReferenceStructure === "Sí" && (
                  <>
                    <FormInput
                      label="Código E/M Referencia"
                      value={form.referenceEmCode}
                      onChange={(v) => updateField("referenceEmCode", v)}
                      placeholder="Ej. EM-000001"
                    />
                    <FormInput
                      label="Versión E/M"
                      value={form.referenceEmVersion}
                      onChange={(v) => updateField("referenceEmVersion", v)}
                      placeholder="Ej. 01"
                    />
                  </>
                )}
                {form.hasReferenceStructure !== "Sí" && (
                  <FormSelect
                    label="Tipo de Estructura"
                    value={form.structureType}
                    onChange={(v) => updateField("structureType", v)}
                    options={[
                      { value: "Monocapa", label: "Monocapa" },
                      { value: "Bilaminado", label: "Bilaminado" },
                      { value: "Trilaminado", label: "Trilaminado" },
                      { value: "Multicapa", label: "Multicapa" },
                    ]}
                  />
                )}
              </div>

              {form.hasReferenceStructure !== "Sí" && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Capas de estructura
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {(() => {
                    const maxLayers = (() => {
                      switch (form.structureType as string) {
                        case "Monocapa":
                          return 1;
                        case "Bilaminado":
                          return 2;
                        case "Trilaminado":
                          return 3;
                        case "Tetralaminado":
                          return 4;
                        default:
                          return 0;
                      }
                    })();
                    return [1, 2, 3, 4].filter(layer => layer <= maxLayers).map((layer) => (
                    <div key={layer} className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="mb-3 text-xs font-bold uppercase text-brand-primary">Capa {layer}</p>
                      <div className="space-y-3">
                        <FormSelect
                          label="Material"
                          value={(form as any)[`layer${layer}Material`] || ""}
                          onChange={(v) => updateField(`layer${layer}Material`, v)}
                          placeholder="-- Seleccione --"
                          options={[
                            { value: "BOPP - Cristal", label: "BOPP - Cristal" },
                            { value: "BOPP - Metalizado", label: "BOPP - Metalizado" },
                            { value: "PET - Cristal", label: "PET - Cristal" },
                            { value: "PET - Mate", label: "PET - Mate" },
                            { value: "NYLON", label: "NYLON" },
                            { value: "ALU", label: "ALU" },
                            { value: "PE - PEBD", label: "PE - PEBD" },
                            { value: "COEX", label: "COEX" },
                            { value: "ADHESIVO", label: "ADHESIVO" },
                          ]}
                        />
                        <FormInput
                          label="Micraje"
                          value={(form as any)[`layer${layer}Micron`] || ""}
                          onChange={(v) => updateField(`layer${layer}Micron`, v)}
                          placeholder="Ej. 80"
                        />
                        <FormInput
                          label="Gramaje"
                          value={(form as any)[`layer${layer}Grammage`] || ""}
                          onChange={(v) => updateField(`layer${layer}Grammage`, v)}
                          placeholder="Ej. 35"
                        />
                      </div>
                    </div>
                  ));
                  })()}
                </div>

                {(() => {
                  const completedLayers = [];
                  for (let i = 1; i <= 4; i++) {
                    const material = (form as any)[`layer${i}Material`];
                    const micron = (form as any)[`layer${i}Micron`];
                    if (material && micron) {
                      completedLayers.push(`${material} / ${micron}`);
                    }
                  }
                  return completedLayers.length > 0 ? (
                    <div className="mt-4 rounded-lg bg-white border border-slate-200 p-3">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Resumen de Capas:</p>
                      <p className="text-sm text-slate-700 font-medium break-words">
                        {completedLayers.join(" | ")}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormInput
                  label="Gramaje general"
                  value={form.grammage}
                  onChange={(v) => updateField("grammage", v)}
                  placeholder="Ej. 40"
                />
                <FormInput
                  label="Tolerancia de Gramaje"
                  value={form.grammageTolerance}
                  onChange={(v) => updateField("grammageTolerance", v)}
                  placeholder="Ej. ±5%"
                />
                <FormSelect
                  label="¿Solicitud de muestra?"
                  value={form.sampleRequest as string}
                  onChange={(v) => updateField("sampleRequest", v)}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Especificaciones Especiales de Estructura"
                    value={form.specialStructureSpecs}
                    onChange={(v) => updateField("specialStructureSpecs", v)}
                    placeholder="Restricciones, barreras, sellabilidad, resistencia, OTR/WVTR..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard title="6. Dimensiones y accesorios" icon="⌗" color="#16a085">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {(() => {
                  const wrapping = inheritedWrapping?.toLowerCase() || "";
                  const isLamina = wrapping.includes("lamina") || wrapping.includes("lámina");
                  const isPouchOrBolsa = wrapping.includes("pouch") || wrapping.includes("bolsa");
                  return (
                    <>
                      {isPouchOrBolsa && (
                        <FormInput label="Ancho" value={form.width} onChange={(v) => updateField("width", v)} placeholder="mm" />
                      )}
                      <FormInput label="Largo" value={form.length} onChange={(v) => updateField("length", v)} placeholder="mm" />
                      {isLamina && (
                        <FormInput label="Repetición" value={form.repetition} onChange={(v) => updateField("repetition", v)} placeholder="mm" />
                      )}
                      {wrapping.includes("pouch") && (
                        <FormSelect label="Base Doy Pack" value={form.doyPackBase} onChange={(v) => updateField("doyPackBase", v)} placeholder="-- Seleccione --" options={DOY_PACK_BASE_OPTIONS} />
                      )}
                      <FormInput label="Ancho Fuelle" value={form.gussetWidth} onChange={(v) => updateField("gussetWidth", v)} placeholder="mm" />
                      <FormSelect label="Tipo de Fuelle" value={form.gussetType} onChange={(v) => updateField("gussetType", v)} placeholder="-- Seleccione --" options={GUSSET_TYPE_OPTIONS} />
                    </>
                  );
                })()}
              </div>

              <div className="mt-4 space-y-5">
                {(() => {
                  const selectedAccessories = [
                    (form.hasZipper as string) === "Sí" ? "hasZipper" : null,
                    (form.hasTinTie as string) === "Sí" ? "hasTinTie" : null,
                    (form.hasValve as string) === "Sí" ? "hasValve" : null,
                    (form.hasDieCutHandle as string) === "Sí" ? "hasDieCutHandle" : null,
                    (form.hasReinforcement as string) === "Sí" ? "hasReinforcement" : null,
                    (form.hasAngularCut as string) === "Sí" ? "hasAngularCut" : null,
                    (form.hasRoundedCorners as string) === "Sí" ? "hasRoundedCorners" : null,
                    (form.hasNotch as string) === "Sí" ? "hasNotch" : null,
                    (form.hasPerforation as string) === "Sí" ? "hasPerforation" : null,
                    (form.hasPreCut as string) === "Sí" ? "hasPreCut" : null,
                  ].filter(Boolean) as string[];

                  const selectedCount = selectedAccessories.length;
                  const canSelectMore = selectedCount < 3;

                  const toggleAccessory = (field: string) => {
                    const isCurrentlySelected = (form[field as keyof typeof form] as string) === "Sí";
                    if (isCurrentlySelected) {
                      updateField(field, "No");
                    } else if (canSelectMore) {
                      updateField(field, "Sí");
                    }
                  };

                  const AccessoryCheckbox = ({ field, label }: { field: string; label: string }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(form[field as keyof typeof form] as string) === "Sí"}
                        onChange={() => toggleAccessory(field)}
                        disabled={(form[field as keyof typeof form] as string) !== "Sí" && !canSelectMore}
                        className="w-4 h-4 rounded border-slate-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className={`text-sm ${(form[field as keyof typeof form] as string) !== "Sí" && !canSelectMore ? "text-slate-400" : "text-slate-700"}`}>
                        {label}
                      </span>
                    </label>
                  );

                  return (
                    <>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="mb-3 text-xs font-bold uppercase text-slate-600">Accesorios Consumibles</p>
                        <div className="space-y-3">
                          <AccessoryCheckbox field="hasZipper" label="Zipper" />
                          {(form.hasZipper as string) === "Sí" && (
                            <FormSelect label="Tipo de Zipper" value={form.zipperType as string} onChange={(v) => updateField("zipperType", v)} placeholder="-- Seleccione --" options={ZIPPER_TYPE_OPTIONS} />
                          )}
                          <AccessoryCheckbox field="hasTinTie" label="Tin-Tie" />
                          <AccessoryCheckbox field="hasValve" label="Válvula" />
                          {(form.hasValve as string) === "Sí" && (
                            <FormSelect label="Tipo de Válvula" value={form.valveType as string} onChange={(v) => updateField("valveType", v)} placeholder="-- Seleccione --" options={VALVE_TYPE_OPTIONS} />
                          )}
                        </div>
                      </div>

                      {(() => {
                        const wrappingForAccesorios = inheritedWrapping?.toLowerCase() || "";
                        const isBolsa = wrappingForAccesorios.includes("bolsa");
                        return isBolsa ? (
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="mb-3 text-xs font-bold uppercase text-slate-600">Accesorios Producto</p>
                            <div className="space-y-3">
                              <AccessoryCheckbox field="hasDieCutHandle" label="Asa Troquelada" />
                              <AccessoryCheckbox field="hasReinforcement" label="Refuerzo" />
                              {(form.hasReinforcement as string) === "Sí" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <FormInput label="Espesor Refuerzo (g/m2)" value={form.reinforcementThickness as string} onChange={(v) => updateField("reinforcementThickness", v)} placeholder="Ej. 100" />
                                  <FormInput label="Ancho Refuerzo (mm)" value={form.reinforcementWidth as string} onChange={(v) => updateField("reinforcementWidth", v)} placeholder="Ej. 50" />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null;
                      })()}

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="mb-3 text-xs font-bold uppercase text-slate-600">Accesorios Internos</p>
                        <div className="space-y-3">
                          <AccessoryCheckbox field="hasAngularCut" label="Corte Angular" />
                          <AccessoryCheckbox field="hasRoundedCorners" label="Esquinas Redondas" />
                          {(form.hasRoundedCorners as string) === "Sí" && (
                            <FormSelect label="Tipo Esquinas Redondas" value={form.roundedCornersType as string} onChange={(v) => updateField("roundedCornersType", v)} placeholder="-- Seleccione --" options={ROUNDED_CORNERS_TYPE_OPTIONS} />
                          )}
                          <AccessoryCheckbox field="hasNotch" label="Muesca" />
                          <AccessoryCheckbox field="hasPerforation" label="Perforación" />
                          {(form.hasPerforation as string) === "Sí" && (
                            <div className="space-y-3">
                              <FormSelect label="Tipo Perforación Pouch" value={form.pouchPerforationType as string} onChange={(v) => updateField("pouchPerforationType", v)} placeholder="-- Seleccione --" options={POUCH_PERFORATION_TYPE_OPTIONS} />
                              <FormSelect label="Tipo Perforación Bolsa" value={form.bagPerforationType as string} onChange={(v) => updateField("bagPerforationType", v)} placeholder="-- Seleccione --" options={BAG_PERFORATION_TYPE_OPTIONS} />
                              <FormSelect label="Ubicación Perforaciones" value={form.perforationLocation as string} onChange={(v) => updateField("perforationLocation", v)} placeholder="-- Seleccione --" options={PERFORATION_LOCATION_OPTIONS} />
                            </div>
                          )}
                          <AccessoryCheckbox field="hasPreCut" label="Pre-Corte" />
                          {(form.hasPreCut as string) === "Sí" && (
                            <FormSelect label="Tipo de Pre-Corte" value={form.preCutType as string} onChange={(v) => updateField("preCutType", v)} placeholder="-- Seleccione --" options={PRECUT_TYPE_OPTIONS} />
                          )}
                        </div>
                      </div>

                      <FormSelect
                        label="Otros accesorios"
                        value={form.otherAccessories as string}
                        onChange={(v) => updateField("otherAccessories", v)}
                        placeholder="-- Seleccione --"
                        options={OTHER_ACCESSORIES_OPTIONS}
                      />

                      <div className="text-xs text-slate-500 text-center">
                        Accesorios seleccionados: {selectedCount}/3 {!canSelectMore && "(máximo alcanzado)"}
                      </div>
                    </>
                  );
                })()}
              </div>
            </FormCard>

            <FormCard title="7. Especificaciones financieras / comerciales" icon="💰" color="#0d4c5c">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormInput
                  label="Cantidad / Volumen estimado *"
                  value={form.estimatedVolume}
                  onChange={(v) => updateField("estimatedVolume", v)}
                  error={getError("estimatedVolume")}
                  placeholder="Ej. 500"
                />
                <FormSelect
                  label="Unidad de Medida *"
                  value={form.unitOfMeasure}
                  onChange={(v) => updateField("unitOfMeasure", v)}
                  error={getError("unitOfMeasure")}
                  options={[
                    { value: "KGS", label: "KGS" },
                    { value: "MLL", label: "MLL" },
                    { value: "MTS", label: "MTS" },
                    { value: "MT2", label: "MT2" },
                    { value: "LBS", label: "LBS" },
                    { value: "UNI", label: "UNI" },
                  ]}
                />
                <FormSelect label="Venta Nacional / Internacional" value={form.saleType} onChange={(v) => updateField("saleType", v)} options={[{ value: "Nacional", label: "Nacional" }, { value: "Internacional", label: "Internacional" }]} />
                <FormSelect label="Incoterm" value={form.incoterm} onChange={(v) => updateField("incoterm", v)} options={[{ value: "No aplica", label: "No aplica" }, { value: "EXW", label: "EXW" }, { value: "FOB", label: "FOB" }, { value: "CIF", label: "CIF" }, { value: "DAP", label: "DAP" }]} />
                <FormSelect label="País Destino" value={form.destinationCountry} onChange={(v) => updateField("destinationCountry", v)} options={[{ value: "Perú", label: "Perú" }, { value: "Chile", label: "Chile" }, { value: "Colombia", label: "Colombia" }, { value: "Ecuador", label: "Ecuador" }, { value: "Portugal", label: "Portugal" }, { value: "Otro", label: "Otro" }]} />
                <FormInput label="Precio Objetivo" value={form.targetPrice} onChange={(v) => updateField("targetPrice", v)} placeholder="Ej. 45" />
                <FormSelect label="Tipo de Moneda" value={form.currencyType} onChange={(v) => updateField("currencyType", v)} options={[{ value: "Soles", label: "Soles" }, { value: "Dólares", label: "Dólares" }]} />
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Información adicional del cliente"
                    value={form.customerAdditionalInfo}
                    onChange={(v) => updateField("customerAdditionalInfo", v)}
                    placeholder="Condiciones comerciales, restricciones, requisitos adicionales..."
                  />
                </div>
              </div>
            </FormCard>
            </fieldset>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 text-white bg-gradient-to-br from-brand-primary to-brand-secondary">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Herencia de Portafolio
                </div>
                <div className="mt-2 text-lg font-extrabold">
                  {selectedPortfolio ? selectedPortfolio.nom : "Seleccione Portafolio"}
                </div>
              </div>
              <div className="space-y-2 p-5 text-sm">
                <PreviewRow label="Código Portafolio" value={selectedPortfolio?.id || selectedPortfolio?.codigo || "—"} />
                <PreviewRow label="Cliente" value={selectedPortfolio?.cli || selectedPortfolio?.clientName || "—"} />
                <PreviewRow label="Planta" value={selectedPortfolio?.pl || selectedPortfolio?.plantaName || selectedPortfolio?.plantaCode || "—"} />
                <PreviewRow label="Envoltura" value={inheritedWrapping || "—"} />
                <PreviewRow label="Uso Final" value={selectedPortfolio?.uf || selectedPortfolio?.usoFinal || "—"} />
                <PreviewRow label="Sub-segmento" value={selectedPortfolio?.subseg || selectedPortfolio?.subSegmento || "—"} />
                <PreviewRow label="Segmento" value={selectedPortfolio?.seg || selectedPortfolio?.segmento || "—"} />
                <PreviewRow label="Sector" value={selectedPortfolio?.sector || "—"} />
                <PreviewRow label="AFMarketID" value={selectedPortfolio?.af || selectedPortfolio?.afMarketId || "—"} />
                <PreviewRow label="Máquina / Envasado de cliente" value={selectedPortfolio?.maq || selectedPortfolio?.maquinaCliente || "—"} />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate(`/projects/${projectCode}`)}
            validationErrorList={Object.values(validationErrors).filter(
              (error): error is string => Boolean(error)
            )}
            submitAttempted={submitAttempted}
            submitLabel="Guardar Borrador"
            cancelLabel="Cancelar"
            validationTitle="Faltan campos obligatorios."
          />
        </div>
      </form>
    </div>
  );
}
