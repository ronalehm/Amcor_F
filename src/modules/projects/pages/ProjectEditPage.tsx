import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getPortfolioDisplayRecords } from "../../../shared/data/portfolioStorage";
import { getProjectByCode, updateProjectRecord, type ProjectRecord } from "../../../shared/data/projectStorage";
import { getActiveExecutiveRecords } from "../../../shared/data/executiveStorage";
import { getCatalogOptions } from "../../../shared/data/projectCatalogStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import PreviewRow from "../../../shared/components/display/PreviewRow";

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
    classification: "Nuevo",
    subClassification: "SFDC - R&D",
    projectType: "ICO",
    salesforceAction: "",

    // 2. Responsables
    graphicResponsible: "",
    graphicComments: "",
    rdResponsible: "",
    rdComments: "",
    commercialFinanceResponsible: "",

    // 3. Datos de Producto Comercial
    blueprintFormat: "",
    technicalApplication: "",
    estimatedVolume: "",
    unitOfMeasure: "KG",
    customerPackingCode: "",

    // 4. Especificaciones de Diseño
    printClass: "",
    printType: "",
    isPreviousDesign: "No",
    previousEdagCode: "",
    previousEdagVersion: "",
    specialDesignSpecs: "",
    specialDesignComments: "",
    hasDigitalFiles: "No",
    artworkFileType: "",
    artworkAttachments: "",
    requiresDesignWork: "No",
    designRoute: "Sin diseño",

    // 5. Especificaciones de Estructura
    hasReferenceStructure: "No",
    referenceEmCode: "",
    referenceEmVersion: "",
    structureType: "Monocapa",
    hasCustomerTechnicalSpec: "No",
    customerTechnicalSpecAttachment: "",
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
    salePrice: "",
    currencyType: "Soles",
    paymentTerms: "Por definir",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);
  const executives = useMemo(() => getActiveExecutiveRecords(), []);

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

    // Helper to convert boolean/string to "Sí"/"No"
    const toYesNo = (val: any) => {
      if (val === true || val === "Sí" || val === "Si") return "Sí";
      if (val === false || val === "No" || val === null || val === undefined) return "No";
      return val;
    };

    setForm({
      ...project,
      // Convertir campos booleanos a strings "Sí"/"No"
      isPreviousDesign: toYesNo(project.isPreviousDesign),
      hasReferenceStructure: toYesNo(project.hasReferenceStructure),
      hasDigitalFiles: toYesNo(project.hasDigitalFiles),
      requiresDesignWork: toYesNo(project.requiresDesignWork),
      hasCustomerTechnicalSpec: toYesNo(project.hasCustomerTechnicalSpec),
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
      paymentTerms: project.paymentTerms || "Por definir",
    });
    
    setLoading(false);
  }, [projectCode]);

  const selectedPortfolio = useMemo(() => {
    return portfolios.find(p => p.id === form.portfolioCode || p.codigo === form.portfolioCode) || null;
  }, [form.portfolioCode, portfolios]);

  useEffect(() => {
    if (projectCode && !loading) {
      setHeader({
        title: "Editar Proyecto",
        subtitle: "Modifica los datos del proyecto y guarda el progreso.",
        breadcrumbs: [{ label: "Proyectos", href: "/projects" }, { label: projectCode }, { label: "Editar" }],
        badges: <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">ID: {projectCode}</span>
      });
    }
    return () => resetHeader();
  }, [setHeader, resetHeader, projectCode, loading]);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

  const getError = (field: string) => {
    return submitAttempted ? validationErrors[field] || "" : "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0 || !projectCode) return;

    const selectedExecutive = executives.find(ex => String(ex.id) === form.ejecutivoId);

    updateProjectRecord(projectCode, {
      ...form,
      code: projectCode,
      portfolioCode: form.portfolioCode || "",
      projectName: form.projectName || "",
      ejecutivoId: form.ejecutivoId,
      ejecutivoName: selectedExecutive?.name || form.ejecutivoName,
      // Inherited from portfolio
      clientName: selectedPortfolio?.cli || selectedPortfolio?.clientName || form.clientName || "",
      wrappingName: selectedPortfolio?.env || selectedPortfolio?.envoltura || form.wrappingName,
      useFinalName: selectedPortfolio?.uf || selectedPortfolio?.usoFinal || form.useFinalName,
      sector: selectedPortfolio?.sector || form.sector,
      segment: selectedPortfolio?.seg || selectedPortfolio?.segmento || form.segment,
      subSegment: selectedPortfolio?.subseg || selectedPortfolio?.subSegmento || form.subSegment,
      afMarketId: selectedPortfolio?.af || selectedPortfolio?.afMarketId || form.afMarketId,
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
        <button onClick={() => navigate("/projects")} className="px-4 py-2 bg-[#003b5c] text-white rounded-md text-sm font-medium">Volver a Proyectos</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            <FormCard title="1. Información general" icon="▦" color="#003b5c" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Portafolio base *"
                  value={form.portfolioCode}
                  onChange={(v) => updateField("portfolioCode", v)}
                  error={getError("portfolioCode")}
                  placeholder="-- Seleccione Portafolio --"
                  options={portfolios.map(p => ({
                    value: String(p.id || p.codigo || p.code),
                    label: `${p.id || p.codigo || p.code} - ${p.nom || p.portfolioName}`
                  }))}
                />
                <FormSelect
                  label="Ejecutivo Comercial *"
                  value={form.ejecutivoId ? String(form.ejecutivoId) : ""}
                  onChange={(v) => updateField("ejecutivoId", v)}
                  error={getError("ejecutivoId")}
                  placeholder="-- Seleccione Ejecutivo --"
                  options={executives.map(e => ({ value: String(e.id), label: e.name }))}
                />
                <FormSelect
                  label="Tipo de Proyecto"
                  value={form.projectType}
                  onChange={(v) => updateField("projectType", v)}
                  options={[
                    { value: "ICO", label: "ICO" },
                    { value: "BCP", label: "BCP" },
                    { value: "RFQ", label: "RFQ" },
                    { value: "Muestra", label: "Muestra" },
                  ]}
                />
                <FormSelect
                  label="Clasificación"
                  value={form.classification}
                  onChange={(v) => updateField("classification", v)}
                  options={[
                    { value: "Nuevo", label: "Nuevo" },
                    { value: "Modificado", label: "Modificado" },
                    { value: "Extensión de línea", label: "Extensión de línea" },
                  ]}
                />
                <FormSelect
                  label="Subclasificación"
                  value={form.subClassification}
                  onChange={(v) => updateField("subClassification", v)}
                  options={[
                    { value: "SFDC - R&D", label: "SFDC - R&D" },
                    { value: "SFDC - Técnica", label: "SFDC - Técnica" },
                    { value: "Extensiones en línea", label: "Extensiones en línea" },
                    { value: "Diseño y Dimensiones", label: "Diseño y Dimensiones" },
                    { value: "Estructura", label: "Estructura" },
                  ]}
                />
                <FormInput
                  label="Acción Salesforce *"
                  value={form.salesforceAction}
                  onChange={(v) => updateField("salesforceAction", v)}
                  error={getError("salesforceAction")}
                  placeholder="Ej. Nueva oportunidad / RFQ / Muestra"
                />
                <div className="md:col-span-3">
                  <FormInput
                    label="Nombre del Proyecto *"
                    value={form.projectName}
                    onChange={(v) => updateField("projectName", v)}
                    error={getError("projectName")}
                    placeholder="Ej. Mayonesa Light 100ml Doypack"
                  />
                </div>
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Descripción del Proyecto"
                    value={form.projectDescription || ""}
                    onChange={(v) => updateField("projectDescription", v)}
                    placeholder="Descripción comercial y técnica del proyecto..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard title="2. Responsables y comentarios por área" icon="☷" color="#0d4c5c">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormInput
                  label="Responsable Artes Gráficas"
                  value={form.graphicResponsible}
                  onChange={(v) => updateField("graphicResponsible", v)}
                  placeholder="Ej. BALDEÓN, J."
                />
                <FormInput
                  label="Responsable R&D"
                  value={form.rdResponsible}
                  onChange={(v) => updateField("rdResponsible", v)}
                  placeholder="Ej. GUARDAMINO, K."
                />
                <FormInput
                  label="Responsable Commercial Finance"
                  value={form.commercialFinanceResponsible}
                  onChange={(v) => updateField("commercialFinanceResponsible", v)}
                  placeholder="Ej. Analista CF"
                />
                <FormTextarea
                  label="Comentarios generales AG"
                  value={form.graphicComments}
                  onChange={(v) => updateField("graphicComments", v)}
                  placeholder="Comentarios de diseño, arte, impresión..."
                />
                <FormTextarea
                  label="Comentarios generales R&D"
                  value={form.rdComments}
                  onChange={(v) => updateField("rdComments", v)}
                  placeholder="Comentarios técnicos, estructura, viabilidad..."
                />
              </div>
            </FormCard>

            <FormCard title="3. Datos de producto comercial" icon="◈" color="#27ae60" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Formato de Plano *"
                  value={form.blueprintFormat}
                  onChange={(v) => updateField("blueprintFormat", v)}
                  error={getError("blueprintFormat")}
                  placeholder="-- Seleccione --"
                  options={[
                    { value: "Stand Up Pouch", label: "Stand Up Pouch" },
                    { value: "Doy Pack Fuelle Cuadrado", label: "Doy Pack Fuelle Cuadrado" },
                    { value: "Doy Pack sin fuelle", label: "Doy Pack sin fuelle" },
                    { value: "Sachet 4 sellos", label: "Sachet 4 sellos" },
                    { value: "Pillow Pack", label: "Pillow Pack" },
                    { value: "Flat Bottom", label: "Flat Bottom" },
                    { value: "Lámina", label: "Lámina" },
                    { value: "Bolsa", label: "Bolsa" },
                  ]}
                />
                <FormSelect
                  label="Aplicación Técnica *"
                  value={form.technicalApplication}
                  onChange={(v) => updateField("technicalApplication", v)}
                  error={getError("technicalApplication")}
                  placeholder="-- Seleccione --"
                  options={[
                    { value: "Pastoso/Ketchup, Mayonesa", label: "Pastoso/Ketchup, Mayonesa" },
                    { value: "Pastoso/Champú", label: "Pastoso/Champú" },
                    { value: "Seco/Café Soluble", label: "Seco/Café Soluble" },
                    { value: "Líquido", label: "Líquido" },
                    { value: "Congelado", label: "Congelado" },
                  ]}
                />
                <FormInput
                  label="Código de Empaque del Cliente"
                  value={form.customerPackingCode}
                  onChange={(v) => updateField("customerPackingCode", v)}
                  placeholder="Ej. COD-CLI-001"
                />
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
                    { value: "KG", label: "KG" },
                    { value: "UN", label: "UN" },
                    { value: "MILLAR", label: "MILLAR" },
                    { value: "TN", label: "TN" },
                  ]}
                />
              </div>
            </FormCard>

            <FormCard title="4. Especificaciones de diseño" icon="🎨" color="#8e44ad">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Ruta de Diseño *"
                  value={form.designRoute}
                  onChange={(v) => updateField("designRoute", v)}
                  error={getError("designRoute")}
                  options={[
                    { value: "Con diseño", label: "Con diseño" },
                    { value: "Sin diseño", label: "Sin diseño" },
                  ]}
                />
                <FormSelect
                  label="Clase de Impresión"
                  value={form.printClass}
                  onChange={(v) => updateField("printClass", v)}
                  placeholder="-- Seleccione --"
                  options={[
                    { value: "Flexo", label: "Flexo" },
                    { value: "Rotograbado", label: "Rotograbado" },
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
                    { value: "Cambio menor", label: "Cambio menor" },
                  ]}
                />
                <FormSelect
                  label="¿Diseño ya trabajado?"
                  value={form.isPreviousDesign}
                  onChange={(v) => updateField("isPreviousDesign", v)}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />
                {form.isPreviousDesign === "Sí" && (
                  <>
                    <FormInput
                      label="Cód. EDAG del Diseño"
                      value={form.previousEdagCode}
                      onChange={(v) => updateField("previousEdagCode", v)}
                      placeholder="Ej. 40267"
                    />
                    <FormInput
                      label="Versión EDAG"
                      value={form.previousEdagVersion}
                      onChange={(v) => updateField("previousEdagVersion", v)}
                      placeholder="Ej. 05"
                    />
                  </>
                )}
                <FormSelect
                  label="¿Tiene archivos digitales?"
                  value={form.hasDigitalFiles}
                  onChange={(v) => updateField("hasDigitalFiles", v)}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />
                {form.hasDigitalFiles === "Sí" && (
                  <>
                    <FormSelect
                      label="Tipo Archivo Arte"
                      value={form.artworkFileType}
                      onChange={(v) => updateField("artworkFileType", v)}
                      placeholder="-- Seleccione --"
                      options={[
                        { value: "AI", label: "AI" },
                        { value: "PDF", label: "PDF" },
                        { value: "ZIP", label: "ZIP" },
                        { value: "PSD", label: "PSD" },
                        { value: "Otro", label: "Otro" },
                      ]}
                    />
                    <FormInput
                      label="Archivos adjuntos"
                      value={form.artworkAttachments}
                      onChange={(v) => updateField("artworkAttachments", v)}
                      placeholder="Nombre/link del archivo"
                    />
                  </>
                )}
                <FormSelect
                  label="¿Requiere trabajo de diseño?"
                  value={form.requiresDesignWork}
                  onChange={(v) => updateField("requiresDesignWork", v)}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Especificaciones de Diseño Especiales"
                    value={form.specialDesignSpecs}
                    onChange={(v) => updateField("specialDesignSpecs", v)}
                    placeholder="Efectos, texturas, acabados, restricciones de impresión..."
                  />
                </div>
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Comentarios de Diseño"
                    value={form.specialDesignComments}
                    onChange={(v) => updateField("specialDesignComments", v)}
                    placeholder="Comentarios adicionales de Artes Gráficas..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard title="5. Especificaciones de estructura" icon="🔩" color="#f39c12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="¿Tiene estructura de referencia?"
                  value={form.hasReferenceStructure}
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
                <FormSelect
                  label="¿Tiene especificación técnica cliente?"
                  value={form.hasCustomerTechnicalSpec}
                  onChange={(v) => updateField("hasCustomerTechnicalSpec", v)}
                  options={[
                    { value: "Sí", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                />
                {form.hasCustomerTechnicalSpec === "Sí" && (
                  <FormInput
                    label="Adjunto especificación técnica"
                    value={form.customerTechnicalSpecAttachment}
                    onChange={(v) => updateField("customerTechnicalSpecAttachment", v)}
                    placeholder="Nombre/link del archivo"
                  />
                )}
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Capas de estructura
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[1, 2, 3, 4].map((layer) => (
                    <div key={layer} className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="mb-3 text-xs font-bold uppercase text-[#003b5c]">Capa {layer}</p>
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
                  ))}
                </div>
              </div>

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
                  value={form.sampleRequest}
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
                <FormInput label="Ancho" value={form.width} onChange={(v) => updateField("width", v)} placeholder="mm" />
                <FormInput label="Largo" value={form.length} onChange={(v) => updateField("length", v)} placeholder="mm" />
                <FormInput label="Repetición" value={form.repetition} onChange={(v) => updateField("repetition", v)} placeholder="mm" />
                <FormInput label="Base Doy Pack" value={form.doyPackBase} onChange={(v) => updateField("doyPackBase", v)} placeholder="Ej. Cuadrada" />
                <FormInput label="Ancho Fuelle" value={form.gussetWidth} onChange={(v) => updateField("gussetWidth", v)} placeholder="mm" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormSelect label="Zipper" value={form.hasZipper} onChange={(v) => updateField("hasZipper", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                {form.hasZipper === "Sí" && (
                  <FormInput label="Tipo de Zipper" value={form.zipperType} onChange={(v) => updateField("zipperType", v)} />
                )}
                <FormSelect label="Tin-Tie" value={form.hasTinTie} onChange={(v) => updateField("hasTinTie", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                <FormSelect label="Válvula" value={form.hasValve} onChange={(v) => updateField("hasValve", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                {form.hasValve === "Sí" && (
                  <FormInput label="Tipo de Válvula" value={form.valveType} onChange={(v) => updateField("valveType", v)} />
                )}
                <FormSelect label="Asa Troquelada" value={form.hasDieCutHandle} onChange={(v) => updateField("hasDieCutHandle", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                <FormSelect label="Refuerzo" value={form.hasReinforcement} onChange={(v) => updateField("hasReinforcement", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                {form.hasReinforcement === "Sí" && (
                  <>
                    <FormInput label="Espesor Refuerzo" value={form.reinforcementThickness} onChange={(v) => updateField("reinforcementThickness", v)} />
                    <FormInput label="Ancho Refuerzo" value={form.reinforcementWidth} onChange={(v) => updateField("reinforcementWidth", v)} />
                  </>
                )}
                <FormSelect label="Corte Angular" value={form.hasAngularCut} onChange={(v) => updateField("hasAngularCut", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                <FormSelect label="Esquinas Redondas" value={form.hasRoundedCorners} onChange={(v) => updateField("hasRoundedCorners", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                {form.hasRoundedCorners === "Sí" && (
                  <FormInput label="Tipo Esquinas Redondas" value={form.roundedCornersType} onChange={(v) => updateField("roundedCornersType", v)} />
                )}
                <FormSelect label="Muesca" value={form.hasNotch} onChange={(v) => updateField("hasNotch", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                <FormSelect label="Perforación" value={form.hasPerforation} onChange={(v) => updateField("hasPerforation", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                {form.hasPerforation === "Sí" && (
                  <>
                    <FormInput label="Tipo Perforación Pouch" value={form.pouchPerforationType} onChange={(v) => updateField("pouchPerforationType", v)} />
                    <FormInput label="Tipo Perforación Bolsa" value={form.bagPerforationType} onChange={(v) => updateField("bagPerforationType", v)} />
                    <FormInput label="Ubicación Perforaciones" value={form.perforationLocation} onChange={(v) => updateField("perforationLocation", v)} />
                  </>
                )}
                <FormSelect label="Pre-Corte" value={form.hasPreCut} onChange={(v) => updateField("hasPreCut", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                {form.hasPreCut === "Sí" && (
                  <FormInput label="Tipo de Pre-Corte" value={form.preCutType} onChange={(v) => updateField("preCutType", v)} />
                )}
                <div className="md:col-span-4">
                  <FormTextarea
                    label="Otros accesorios"
                    value={form.otherAccessories}
                    onChange={(v) => updateField("otherAccessories", v)}
                    placeholder="Otros accesorios, restricciones o detalles especiales..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard title="7. Especificaciones financieras / comerciales" icon="💰" color="#0d4c5c">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect label="Venta Nacional / Internacional" value={form.saleType} onChange={(v) => updateField("saleType", v)} options={[{ value: "Nacional", label: "Nacional" }, { value: "Internacional", label: "Internacional" }]} />
                <FormSelect label="Incoterm" value={form.incoterm} onChange={(v) => updateField("incoterm", v)} options={[{ value: "No aplica", label: "No aplica" }, { value: "EXW", label: "EXW" }, { value: "FOB", label: "FOB" }, { value: "CIF", label: "CIF" }, { value: "DAP", label: "DAP" }]} />
                <FormSelect label="País Destino" value={form.destinationCountry} onChange={(v) => updateField("destinationCountry", v)} options={[{ value: "Perú", label: "Perú" }, { value: "Chile", label: "Chile" }, { value: "Colombia", label: "Colombia" }, { value: "Ecuador", label: "Ecuador" }, { value: "Portugal", label: "Portugal" }, { value: "Otro", label: "Otro" }]} />
                <FormInput label="Precio Objetivo" value={form.targetPrice} onChange={(v) => updateField("targetPrice", v)} placeholder="Ej. 45" />
                <FormInput label="Precio Venta" value={form.salePrice} onChange={(v) => updateField("salePrice", v)} placeholder="Ej. 46" />
                <FormSelect label="Tipo de Moneda" value={form.currencyType} onChange={(v) => updateField("currencyType", v)} options={[{ value: "Soles", label: "Soles" }, { value: "Dólares", label: "Dólares" }]} />
                <FormSelect label="Condiciones de Pago" value={form.paymentTerms} onChange={(v) => updateField("paymentTerms", v)} options={[{ value: "Por definir", label: "Por definir" }, { value: "Al contado", label: "Al contado" }, { value: "Crédito 30 días", label: "Crédito 30 días" }, { value: "Crédito 60 días", label: "Crédito 60 días" }, { value: "Crédito 90 días", label: "Crédito 90 días" }]} />
                <FormInput label="Material de Tuco / Core" value={form.coreMaterial} onChange={(v) => updateField("coreMaterial", v)} />
                <FormInput label="Tuco / Core (mm)" value={form.coreDiameter} onChange={(v) => updateField("coreDiameter", v)} />
                <FormInput label="Externo (mm)" value={form.externalDiameter} onChange={(v) => updateField("externalDiameter", v)} />
                <FormInput label="Variación Externo (+)" value={form.externalVariationPlus} onChange={(v) => updateField("externalVariationPlus", v)} />
                <FormInput label="Variación Externo (-)" value={form.externalVariationMinus} onChange={(v) => updateField("externalVariationMinus", v)} />
                <FormInput label="Peso máximo de bobina" value={form.maxRollWeight} onChange={(v) => updateField("maxRollWeight", v)} />
                <FormSelect label="Logo Producto Peruano" value={form.peruvianProductLogo} onChange={(v) => updateField("peruvianProductLogo", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
                <FormSelect label="Pie de Imprenta" value={form.printingFooter} onChange={(v) => updateField("printingFooter", v)} options={[{ value: "Sí", label: "Sí" }, { value: "No", label: "No" }]} />
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
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 text-white bg-gradient-to-br from-[#003b5c] to-[#1E82D9]">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Herencia de Portafolio
                </div>
                <div className="mt-2 text-lg font-extrabold">
                  {selectedPortfolio ? selectedPortfolio.nom : "Seleccione Portafolio"}
                </div>
              </div>
              <div className="space-y-2 p-5 text-sm">
                <PreviewRow label="Cliente" value={selectedPortfolio?.cli || selectedPortfolio?.clientName || "—"} />
                <PreviewRow label="Planta" value={selectedPortfolio?.pl || selectedPortfolio?.plantaCode || "—"} />
                <PreviewRow label="Envoltura" value={selectedPortfolio?.env || selectedPortfolio?.envoltura || "—"} />
                <PreviewRow label="Uso Final" value={selectedPortfolio?.uf || selectedPortfolio?.usoFinal || "—"} />
                <PreviewRow label="Sector" value={selectedPortfolio?.sector || "—"} />
                <PreviewRow label="Máquina" value={selectedPortfolio?.maq || selectedPortfolio?.maquinaCliente || "—"} />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate(`/projects/${projectCode}`)}
            validationErrorList={Object.values(validationErrors)}
            submitAttempted={submitAttempted}
            submitLabel="Guardar Borrador"
            cancelLabel="Cancelar"
          />
        </div>
      </form>
    </div>
  );
}
