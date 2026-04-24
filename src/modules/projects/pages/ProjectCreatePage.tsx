import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useLayout } from "../../../components/layout/LayoutContext";
import { getPortfolioDisplayRecords } from "../../../shared/data/portfolioStorage";
import {
  getNextProjectCode,
  saveProjectRecord,
  getProjectByCode,
} from "../../../shared/data/projectStorage";
import type { BooleanLike, YesNoPending } from "../../../shared/data/projectStorage";
import { getActiveExecutiveRecords } from "../../../shared/data/executiveStorage";
import { getActiveUsers } from "../../../shared/data/userStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormTextarea from "../../../shared/components/forms/FormTextarea";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import PreviewRow from "../../../shared/components/display/PreviewRow";

type ProjectFormData = {
  portfolioCode: string;
  executiveId: string;
  siUserId: string;

  projectName: string;
  projectDescription: string;
  classification: string;
  subClassification: string;
  projectType: string;
  salesforceAction: string;

  graphicResponsible: string;
  graphicComments: string;
  rdResponsible: string;
  rdComments: string;
  commercialFinanceResponsible: string;

  blueprintFormat: string;
  technicalApplication: string;
  estimatedVolume: string;
  unitOfMeasure: string;
  customerPackingCode: string;

  printClass: string;
  printType: string;
  isPreviousDesign: string;
  previousEdagCode: string;
  previousEdagVersion: string;
  specialDesignSpecs: string;
  specialDesignComments: string;
  hasDigitalFiles: string;
  artworkFileType: string;
  artworkAttachments: string;
  requiresDesignWork: string;
  designRoute: string;

  hasReferenceStructure: string;
  referenceEmCode: string;
  referenceEmVersion: string;
  structureType: string;
  hasCustomerTechnicalSpec: string;
  customerTechnicalSpecAttachment: string;

  layer1Material: string;
  layer1Micron: string;
  layer1Grammage: string;
  layer2Material: string;
  layer2Micron: string;
  layer2Grammage: string;
  layer3Material: string;
  layer3Micron: string;
  layer3Grammage: string;
  layer4Material: string;
  layer4Micron: string;
  layer4Grammage: string;

  specialStructureSpecs: string;
  grammage: string;
  grammageTolerance: string;
  sampleRequest: string;

  width: string;
  length: string;
  repetition: string;
  doyPackBase: string;
  gussetWidth: string;

  hasZipper: string;
  zipperType: string;
  hasTinTie: string;
  hasValve: string;
  valveType: string;
  hasDieCutHandle: string;
  hasReinforcement: string;
  reinforcementThickness: string;
  reinforcementWidth: string;
  hasAngularCut: string;
  hasRoundedCorners: string;
  roundedCornersType: string;
  hasNotch: string;
  hasPerforation: string;
  pouchPerforationType: string;
  bagPerforationType: string;
  perforationLocation: string;
  hasPreCut: string;
  preCutType: string;
  otherAccessories: string;

  saleType: string;
  incoterm: string;
  destinationCountry: string;
  targetPrice: string;
  salePrice: string;
  currencyType: string;
  paymentTerms: string;
  coreMaterial: string;
  coreDiameter: string;
  externalDiameter: string;
  externalVariationPlus: string;
  externalVariationMinus: string;
  maxRollWeight: string;
  customerAdditionalInfo: string;
  peruvianProductLogo: string;
  printingFooter: string;
};

const YES_NO_OPTIONS = [
  { value: "Sí", label: "Sí" },
  { value: "No", label: "No" },
];

const CLASSIFICATION_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Modificado", label: "Modificado" },
  { value: "Extensión de línea", label: "Extensión de línea" },
];

const SUBCLASSIFICATION_OPTIONS = [
  { value: "SFDC - R&D", label: "SFDC - R&D" },
  { value: "SFDC - Técnica", label: "SFDC - Técnica" },
  { value: "Extensiones en línea", label: "Extensiones en línea" },
  { value: "Diseño y Dimensiones", label: "Diseño y Dimensiones" },
  { value: "Estructura", label: "Estructura" },
];

const PROJECT_TYPE_OPTIONS = [
  { value: "ICO", label: "ICO" },
  { value: "BCP", label: "BCP" },
  { value: "RFQ", label: "RFQ" },
  { value: "Muestra", label: "Muestra" },
];

const BLUEPRINT_FORMAT_OPTIONS = [
  { value: "Stand Up Pouch", label: "Stand Up Pouch" },
  { value: "Doy Pack Fuelle Cuadrado", label: "Doy Pack Fuelle Cuadrado" },
  { value: "Doy Pack sin fuelle", label: "Doy Pack sin fuelle" },
  { value: "Sachet 4 sellos", label: "Sachet 4 sellos" },
  { value: "Pillow Pack", label: "Pillow Pack" },
  { value: "Flat Bottom", label: "Flat Bottom" },
  { value: "Lámina", label: "Lámina" },
  { value: "Bolsa", label: "Bolsa" },
];

const TECHNICAL_APPLICATION_OPTIONS = [
  { value: "Pastoso/Ketchup, Mayonesa", label: "Pastoso/Ketchup, Mayonesa" },
  { value: "Pastoso/Champú", label: "Pastoso/Champú" },
  { value: "Seco/Café Soluble", label: "Seco/Café Soluble" },
  { value: "Líquido", label: "Líquido" },
  { value: "Congelado", label: "Congelado" },
];

const UNIT_OPTIONS = [
  { value: "KG", label: "KG" },
  { value: "UN", label: "UN" },
  { value: "MILLAR", label: "MILLAR" },
  { value: "TN", label: "TN" },
];

const PRINT_CLASS_OPTIONS = [
  { value: "Flexo", label: "Flexo" },
  { value: "Rotograbado", label: "Rotograbado" },
  { value: "Sin impresión", label: "Sin impresión" },
];

const PRINT_TYPE_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Repetitivo", label: "Repetitivo" },
  { value: "Cambio menor", label: "Cambio menor" },
];

const STRUCTURE_TYPE_OPTIONS = [
  { value: "Monocapa", label: "Monocapa" },
  { value: "Bilaminado", label: "Bilaminado" },
  { value: "Trilaminado", label: "Trilaminado" },
  { value: "Multicapa", label: "Multicapa" },
];

const MATERIAL_OPTIONS = [
  { value: "BOPP - Cristal", label: "BOPP - Cristal" },
  { value: "BOPP - Metalizado", label: "BOPP - Metalizado" },
  { value: "PET - Cristal", label: "PET - Cristal" },
  { value: "PET - Mate", label: "PET - Mate" },
  { value: "NYLON", label: "NYLON" },
  { value: "ALU", label: "ALU" },
  { value: "PE - PEBD", label: "PE - PEBD" },
  { value: "COEX", label: "COEX" },
  { value: "ADHESIVO", label: "ADHESIVO" },
];

const SALE_TYPE_OPTIONS = [
  { value: "Nacional", label: "Nacional" },
  { value: "Internacional", label: "Internacional" },
];

const INCOTERM_OPTIONS = [
  { value: "No aplica", label: "No aplica" },
  { value: "EXW", label: "EXW" },
  { value: "FOB", label: "FOB" },
  { value: "CIF", label: "CIF" },
  { value: "DAP", label: "DAP" },
];

const CURRENCY_OPTIONS = [
  { value: "Soles", label: "Soles" },
  { value: "Dólares", label: "Dólares" },
];

const PAYMENT_TERMS_OPTIONS = [
  { value: "Por definir", label: "Por definir" },
  { value: "Al contado", label: "Al contado" },
  { value: "Crédito 30 días", label: "Crédito 30 días" },
  { value: "Crédito 60 días", label: "Crédito 60 días" },
  { value: "Crédito 90 días", label: "Crédito 90 días" },
];

const FILE_TYPE_OPTIONS = [
  { value: "AI", label: "AI" },
  { value: "PDF", label: "PDF" },
  { value: "ZIP", label: "ZIP" },
  { value: "PSD", label: "PSD" },
  { value: "Otro", label: "Otro" },
];

const DESTINATION_COUNTRY_OPTIONS = [
  { value: "Perú", label: "Perú" },
  { value: "Chile", label: "Chile" },
  { value: "Colombia", label: "Colombia" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Portugal", label: "Portugal" },
  { value: "Otro", label: "Otro" },
];

const initialForm = (portfolioCode: string): ProjectFormData => ({
  portfolioCode,
  executiveId: "",
  siUserId: "",

  projectName: "",
  projectDescription: "",
  classification: "Nuevo",
  subClassification: "SFDC - R&D",
  projectType: "ICO",
  salesforceAction: "",

  graphicResponsible: "",
  graphicComments: "",
  rdResponsible: "",
  rdComments: "",
  commercialFinanceResponsible: "",

  blueprintFormat: "",
  technicalApplication: "",
  estimatedVolume: "",
  unitOfMeasure: "KG",
  customerPackingCode: "",

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

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [searchParams] = useSearchParams();

  const portfolioCodeParam = searchParams.get("portfolioCode") || "";
  const duplicateFromParam = searchParams.get("duplicateFrom") || "";
  const isDuplicateMode = Boolean(duplicateFromParam);
  const [projectCode] = useState(getNextProjectCode());
  const [form, setForm] = useState<ProjectFormData>(() =>
    initialForm(portfolioCodeParam)
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [originalProject, setOriginalProject] = useState<any>(null);

  const portfolios = useMemo(() => getPortfolioDisplayRecords(), []);
  const executives = useMemo(() => getActiveExecutiveRecords(), []);
  const siUsers = useMemo(() => getActiveUsers(), []);

  const selectedPortfolio = useMemo(() => {
    return (
      portfolios.find(
        (portfolio) =>
          portfolio.id === form.portfolioCode ||
          portfolio.codigo === form.portfolioCode ||
          portfolio.code === form.portfolioCode
      ) || null
    );
  }, [form.portfolioCode, portfolios]);

  const selectedExecutive = useMemo(() => {
    return executives.find((executive) => String(executive.id) === form.executiveId);
  }, [executives, form.executiveId]);

  // Load original project data when in duplicate mode
  useEffect(() => {
    if (isDuplicateMode && duplicateFromParam) {
      const original = getProjectByCode(duplicateFromParam);
      if (original) {
        setOriginalProject(original);
        // Pre-fill form with original project data
        setForm({
          portfolioCode: original.portfolioCode || "",
          executiveId: original.ejecutivoId ? String(original.ejecutivoId) : "",
          siUserId: original.siUserId || "",
          projectName: `${original.projectName || ""} (Copia)`,
          projectDescription: original.projectDescription || "",
          classification: original.classification || "Nuevo",
          subClassification: original.subClassification || "SFDC - R&D",
          projectType: original.projectType || "ICO",
          salesforceAction: "",
          graphicResponsible: original.graphicResponsible || "",
          graphicComments: original.graphicComments || "",
          rdResponsible: original.rdResponsible || "",
          rdComments: original.rdComments || "",
          commercialFinanceResponsible: original.commercialFinanceResponsible || "",
          blueprintFormat: original.blueprintFormat || "",
          technicalApplication: original.technicalApplication || "",
          estimatedVolume: original.estimatedVolume || "",
          unitOfMeasure: original.unitOfMeasure || "KG",
          customerPackingCode: "",
          printClass: original.printClass || "",
          printType: original.printType || "",
          isPreviousDesign: original.isPreviousDesign === true ? "Sí" : original.isPreviousDesign === false ? "No" : (original.isPreviousDesign || "No"),
          previousEdagCode: original.previousEdagCode || "",
          previousEdagVersion: original.previousEdagVersion || "",
          specialDesignSpecs: original.specialDesignSpecs || "",
          specialDesignComments: original.specialDesignComments || "",
          hasDigitalFiles: original.hasDigitalFiles === true ? "Sí" : original.hasDigitalFiles === false ? "No" : (original.hasDigitalFiles || "No"),
          artworkFileType: original.artworkFileType || "",
          artworkAttachments: original.artworkAttachments || "",
          requiresDesignWork: original.requiresDesignWork === true ? "Sí" : original.requiresDesignWork === false ? "No" : (original.requiresDesignWork || "No"),
          designRoute: original.designRoute || "Sin diseño",
          hasReferenceStructure: original.hasReferenceStructure === true ? "Sí" : original.hasReferenceStructure === false ? "No" : (original.hasReferenceStructure || "No"),
          referenceEmCode: original.referenceEmCode || "",
          referenceEmVersion: original.referenceEmVersion || "",
          structureType: original.structureType || "Monocapa",
          hasCustomerTechnicalSpec: original.hasCustomerTechnicalSpec === true ? "Sí" : original.hasCustomerTechnicalSpec === false ? "No" : (original.hasCustomerTechnicalSpec || "No"),
          customerTechnicalSpecAttachment: original.customerTechnicalSpecAttachment || "",
          layer1Material: original.layer1Material || "",
          layer1Micron: original.layer1Micron || "",
          layer1Grammage: original.layer1Grammage || "",
          layer2Material: original.layer2Material || "",
          layer2Micron: original.layer2Micron || "",
          layer2Grammage: original.layer2Grammage || "",
          layer3Material: original.layer3Material || "",
          layer3Micron: original.layer3Micron || "",
          layer3Grammage: original.layer3Grammage || "",
          layer4Material: original.layer4Material || "",
          layer4Micron: original.layer4Micron || "",
          layer4Grammage: original.layer4Grammage || "",
          specialStructureSpecs: original.specialStructureSpecs || "",
          grammage: original.grammage || "",
          grammageTolerance: original.grammageTolerance || "",
          sampleRequest: original.sampleRequest ? "Sí" : "No",
          width: original.width || "",
          length: original.length || "",
          repetition: original.repetition || "",
          doyPackBase: original.doyPackBase || "",
          gussetWidth: original.gussetWidth || "",
          hasZipper: original.hasZipper === true ? "Sí" : original.hasZipper === false ? "No" : (original.hasZipper || "No"),
          zipperType: original.zipperType || "",
          hasTinTie: original.hasTinTie === true ? "Sí" : original.hasTinTie === false ? "No" : (original.hasTinTie || "No"),
          hasValve: original.hasValve === true ? "Sí" : original.hasValve === false ? "No" : (original.hasValve || "No"),
          valveType: original.valveType || "",
          hasDieCutHandle: original.hasDieCutHandle === true ? "Sí" : original.hasDieCutHandle === false ? "No" : (original.hasDieCutHandle || "No"),
          hasReinforcement: original.hasReinforcement === true ? "Sí" : original.hasReinforcement === false ? "No" : (original.hasReinforcement || "No"),
          reinforcementThickness: original.reinforcementThickness || "",
          reinforcementWidth: original.reinforcementWidth || "",
          hasAngularCut: original.hasAngularCut === true ? "Sí" : original.hasAngularCut === false ? "No" : (original.hasAngularCut || "No"),
          hasRoundedCorners: original.hasRoundedCorners === true ? "Sí" : original.hasRoundedCorners === false ? "No" : (original.hasRoundedCorners || "No"),
          roundedCornersType: original.roundedCornersType || "",
          hasNotch: original.hasNotch === true ? "Sí" : original.hasNotch === false ? "No" : (original.hasNotch || "No"),
          hasPerforation: original.hasPerforation === true ? "Sí" : original.hasPerforation === false ? "No" : (original.hasPerforation || "No"),
          pouchPerforationType: original.pouchPerforationType || "",
          bagPerforationType: original.bagPerforationType || "",
          perforationLocation: original.perforationLocation || "",
          hasPreCut: original.hasPreCut === true ? "Sí" : original.hasPreCut === false ? "No" : (original.hasPreCut || "No"),
          preCutType: original.preCutType || "",
          otherAccessories: original.otherAccessories || "",
          saleType: original.saleType || "Nacional",
          incoterm: original.incoterm || "No aplica",
          destinationCountry: original.destinationCountry || "Perú",
          targetPrice: original.targetPrice || "",
          salePrice: original.salePrice || "",
          currencyType: original.currencyType || "Soles",
          paymentTerms: original.paymentTerms || "Por definir",
          coreMaterial: original.coreMaterial || "",
          coreDiameter: original.coreDiameter || "",
          externalDiameter: original.externalDiameter || "",
          externalVariationPlus: original.externalVariationPlus || "",
          externalVariationMinus: original.externalVariationMinus || "",
          maxRollWeight: original.maxRollWeight || "",
          customerAdditionalInfo: original.customerAdditionalInfo || "",
          peruvianProductLogo: original.peruvianProductLogo || "No",
          printingFooter: original.printingFooter || "No",
        });
      }
    }
  }, [isDuplicateMode, duplicateFromParam]);

  const inheritedClient =
    selectedPortfolio?.cli || selectedPortfolio?.clientName || "";
  const inheritedPlant =
    selectedPortfolio?.pl || selectedPortfolio?.plantaName || selectedPortfolio?.plantaCode || "";
  const inheritedWrapping =
    selectedPortfolio?.env || selectedPortfolio?.envoltura || selectedPortfolio?.wrappingName || "";
  const inheritedFinalUse =
    selectedPortfolio?.uf || selectedPortfolio?.usoFinal || selectedPortfolio?.useFinalName || "";
  const inheritedSector = selectedPortfolio?.sector || "";
  const inheritedSegment =
    selectedPortfolio?.seg || selectedPortfolio?.segmento || selectedPortfolio?.segment || "";
  const inheritedSubSegment =
    selectedPortfolio?.subseg || selectedPortfolio?.subSegmento || selectedPortfolio?.subSegment || "";
  const inheritedAfMarketId =
    selectedPortfolio?.af || selectedPortfolio?.afMarketId || "";
  const inheritedMachine =
    selectedPortfolio?.maq || selectedPortfolio?.maquinaCliente || selectedPortfolio?.packingMachineName || "";

  useEffect(() => {
    setHeader({
      title: isDuplicateMode ? "Proyectos >> Duplicar Proyecto" : "Proyectos >> Crear Proyecto",
      subtitle: isDuplicateMode
        ? `Duplicando proyecto ${duplicateFromParam}. La estructura está bloqueada y debe mantenerse igual. Modifica solo los datos de diseño y comercial.`
        : "Selecciona un portafolio base, hereda su información común y completa la ficha única del proyecto.",
      breadcrumbs: [
        { label: "Proyectos", href: "/projects" },
        { label: isDuplicateMode ? "Duplicar Proyecto" : "Crear Proyecto" },
      ],
      badges: (
        <div className="flex items-center gap-2">
          {isDuplicateMode && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
              Modo: Duplicar
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            ID: {projectCode}
          </span>
        </div>
      ),
    });

    return () => resetHeader();
  }, [setHeader, resetHeader, projectCode, isDuplicateMode, duplicateFromParam]);

  const updateField = (field: keyof ProjectFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!form.portfolioCode) errors.portfolioCode = "Seleccione un portafolio base.";
    if (!form.executiveId) errors.executiveId = "Seleccione un ejecutivo comercial.";
    if (!form.projectName.trim()) errors.projectName = "Ingrese el nombre del proyecto.";
    if (!form.salesforceAction.trim()) errors.salesforceAction = "Ingrese la acción Salesforce.";
    if (!form.blueprintFormat) errors.blueprintFormat = "Seleccione el formato de plano.";
    if (!form.technicalApplication) errors.technicalApplication = "Seleccione la aplicación técnica.";
    if (!form.estimatedVolume.trim()) errors.estimatedVolume = "Ingrese el volumen estimado.";
    if (!form.unitOfMeasure) errors.unitOfMeasure = "Seleccione la unidad de medida.";
    if (!form.designRoute) errors.designRoute = "Seleccione la ruta de diseño.";

    return errors;
  }, [form]);

  const getError = (field: keyof ProjectFormData) => {
    return submitAttempted ? validationErrors[field] || "" : "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(validationErrors).length > 0) return;

    const now = new Date().toISOString();

    saveProjectRecord({
      id: projectCode,
      code: projectCode,

      portfolioCode: form.portfolioCode,
      portfolioName: selectedPortfolio?.nom || selectedPortfolio?.portfolioName || "",

      clientCode: selectedPortfolio?.clientCode,
      clientName: inheritedClient,

      projectName: form.projectName,
      projectDescription: form.projectDescription,

      ejecutivoId: Number(form.executiveId) || undefined,
      ejecutivoName: selectedExecutive?.name,

      siUserId: form.siUserId,
      siUserCode: siUsers.find(u => u.id === form.siUserId)?.code,

      plantaName: inheritedPlant,
      wrappingName: inheritedWrapping,
      useFinalName: inheritedFinalUse,
      subSegment: inheritedSubSegment,
      segment: inheritedSegment,
      sector: inheritedSector,
      afMarketId: inheritedAfMarketId,
      maquinaCliente: inheritedMachine,
      packingMachineName: inheritedMachine,

      classification: form.classification,
      subClassification: form.subClassification,
      projectType: form.projectType,
      salesforceAction: form.salesforceAction,

      graphicResponsible: form.graphicResponsible,
      graphicComments: form.graphicComments,
      rdResponsible: form.rdResponsible,
      rdComments: form.rdComments,
      commercialFinanceResponsible: form.commercialFinanceResponsible,

      blueprintFormat: form.blueprintFormat,
      technicalApplication: form.technicalApplication,
      estimatedVolume: form.estimatedVolume,
      unitOfMeasure: form.unitOfMeasure,
      customerPackingCode: form.customerPackingCode,

      format: form.blueprintFormat,
      volume: form.estimatedVolume,
      unit: form.unitOfMeasure,

      printClass: form.printClass,
      printType: form.printType,
      isPreviousDesign: form.isPreviousDesign as BooleanLike,
      previousEdagCode: form.previousEdagCode,
      previousEdagVersion: form.previousEdagVersion,
      specialDesignSpecs: form.specialDesignSpecs,
      specialDesignComments: form.specialDesignComments,
      hasDigitalFiles: form.hasDigitalFiles as BooleanLike,
      artworkFileType: form.artworkFileType,
      artworkAttachments: form.artworkAttachments,
      requiresDesignWork: form.requiresDesignWork as BooleanLike,
      designRoute: form.designRoute,
      routeType: form.designRoute === "Con diseño" ? "Con diseño" : "Sin diseño",
      hasArtworkDesign: form.designRoute === "Con diseño",

      hasReferenceStructure: form.hasReferenceStructure as BooleanLike,
      referenceEmCode: form.referenceEmCode,
      referenceEmVersion: form.referenceEmVersion,
      structureType: form.structureType,
      hasCustomerTechnicalSpec: form.hasCustomerTechnicalSpec as BooleanLike,
      customerTechnicalSpecAttachment: form.customerTechnicalSpecAttachment,

      layer1Material: form.layer1Material,
      layer1Micron: form.layer1Micron,
      layer1Grammage: form.layer1Grammage,
      layer2Material: form.layer2Material,
      layer2Micron: form.layer2Micron,
      layer2Grammage: form.layer2Grammage,
      layer3Material: form.layer3Material,
      layer3Micron: form.layer3Micron,
      layer3Grammage: form.layer3Grammage,
      layer4Material: form.layer4Material,
      layer4Micron: form.layer4Micron,
      layer4Grammage: form.layer4Grammage,

      layers: form.structureType,
      microns: [
        form.layer1Micron,
        form.layer2Micron,
        form.layer3Micron,
        form.layer4Micron,
      ]
        .filter(Boolean)
        .join(" / "),

      specialStructureSpecs: form.specialStructureSpecs,
      grammage: form.grammage,
      grammageTolerance: form.grammageTolerance,
      sampleRequest: form.sampleRequest === "Sí",

      width: form.width,
      length: form.length,
      repetition: form.repetition,
      doyPackBase: form.doyPackBase,
      gussetWidth: form.gussetWidth,
      dimensions: [form.width, form.length, form.gussetWidth]
        .filter(Boolean)
        .join(" x "),

      hasZipper: form.hasZipper as BooleanLike,
      zipperType: form.zipperType,
      hasTinTie: form.hasTinTie as BooleanLike,
      hasValve: form.hasValve as BooleanLike,
      valveType: form.valveType,
      hasDieCutHandle: form.hasDieCutHandle as BooleanLike,
      hasReinforcement: form.hasReinforcement as BooleanLike,
      reinforcementThickness: form.reinforcementThickness,
      reinforcementWidth: form.reinforcementWidth,
      hasAngularCut: form.hasAngularCut as BooleanLike,
      hasRoundedCorners: form.hasRoundedCorners as BooleanLike,
      roundedCornersType: form.roundedCornersType,
      hasNotch: form.hasNotch as BooleanLike,
      hasPerforation: form.hasPerforation as BooleanLike,
      pouchPerforationType: form.pouchPerforationType,
      bagPerforationType: form.bagPerforationType,
      perforationLocation: form.perforationLocation,
      hasPreCut: form.hasPreCut as BooleanLike,
      preCutType: form.preCutType,
      otherAccessories: form.otherAccessories,

      saleType: form.saleType,
      incoterm: form.incoterm,
      destinationCountry: form.destinationCountry,
      targetPrice: form.targetPrice,
      salePrice: form.salePrice,
      currencyType: form.currencyType,
      paymentTerms: form.paymentTerms,
      coreMaterial: form.coreMaterial,
      coreDiameter: form.coreDiameter,
      externalDiameter: form.externalDiameter,
      externalVariationPlus: form.externalVariationPlus,
      externalVariationMinus: form.externalVariationMinus,
      maxRollWeight: form.maxRollWeight,
      customerAdditionalInfo: form.customerAdditionalInfo,
      peruvianProductLogo: form.peruvianProductLogo as YesNoPending,
      printingFooter: form.printingFooter,

      status: "Registrado",
      createdAt: now,
      updatedAt: now,
    });

    navigate("/projects");
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] pb-12">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <div className="space-y-5">
            <FormCard title="1. Información general" icon="▦" color="#003b5c" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Portafolio base *"
                  value={form.portfolioCode}
                  onChange={(value) => updateField("portfolioCode", value)}
                  error={getError("portfolioCode")}
                  placeholder="-- Seleccione Portafolio --"
                  options={portfolios.map((portfolio) => ({
                    value: String(portfolio.id || portfolio.codigo || portfolio.code),
                    label: `${portfolio.id || portfolio.codigo || portfolio.code} - ${
                      portfolio.nom || portfolio.portfolioName
                    }`,
                  }))}
                />

                <FormSelect
                  label="Ejecutivo Comercial *"
                  value={form.executiveId}
                  onChange={(value) => updateField("executiveId", value)}
                  error={getError("executiveId")}
                  placeholder="-- Seleccione Ejecutivo --"
                  options={executives.map((executive) => ({
                    value: String(executive.id),
                    label: executive.name,
                  }))}
                />

                <FormSelect
                  label="Usuario Sistema Integral"
                  value={form.siUserId}
                  onChange={(value) => updateField("siUserId", value)}
                  placeholder="-- Seleccione Usuario --"
                  options={siUsers.map((u) => ({
                    value: u.id,
                    label: `${u.code} - ${u.fullName}`,
                  }))}
                />

                <FormSelect
                  label="Tipo de Proyecto"
                  value={form.projectType}
                  onChange={(value) => updateField("projectType", value)}
                  options={PROJECT_TYPE_OPTIONS}
                />

                <FormSelect
                  label="Clasificación"
                  value={form.classification}
                  onChange={(value) => updateField("classification", value)}
                  options={CLASSIFICATION_OPTIONS}
                />

                <FormSelect
                  label="Subclasificación"
                  value={form.subClassification}
                  onChange={(value) => updateField("subClassification", value)}
                  options={SUBCLASSIFICATION_OPTIONS}
                />

                <div className={isDuplicateMode ? "rounded-lg bg-amber-50/50 border border-amber-200 p-3" : ""}>
                  {isDuplicateMode && (
                    <div className="mb-2 flex items-center gap-2 text-amber-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wide">Ingresa nueva acción Salesforce</span>
                    </div>
                  )}
                  <FormInput
                    label="Acción Salesforce *"
                    value={form.salesforceAction}
                    onChange={(value) => updateField("salesforceAction", value)}
                    error={getError("salesforceAction")}
                    placeholder="Ej. Nueva oportunidad / RFQ / Muestra"
                    className={isDuplicateMode ? "bg-white" : ""}
                  />
                </div>

                <div className={`md:col-span-3 ${isDuplicateMode ? "rounded-lg bg-amber-50/50 border border-amber-200 p-3" : ""}`}>
                  {isDuplicateMode && (
                    <div className="mb-2 flex items-center gap-2 text-amber-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wide">Modifica el nombre para el nuevo proyecto</span>
                    </div>
                  )}
                  <FormInput
                    label="Nombre del Proyecto *"
                    value={form.projectName}
                    onChange={(value) => updateField("projectName", value)}
                    error={getError("projectName")}
                    placeholder="Ej. Mayonesa Light 100ml Doypack"
                    className={isDuplicateMode ? "bg-white" : ""}
                  />
                </div>

                <div className="md:col-span-3">
                  <FormTextarea
                    label="Descripción del Proyecto"
                    value={form.projectDescription}
                    onChange={(value) => updateField("projectDescription", value)}
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
                  onChange={(value) => updateField("graphicResponsible", value)}
                  placeholder="Ej. BALDEÓN, J."
                />
                <FormInput
                  label="Responsable R&D"
                  value={form.rdResponsible}
                  onChange={(value) => updateField("rdResponsible", value)}
                  placeholder="Ej. GUARDAMINO, K."
                />
                <FormInput
                  label="Responsable Commercial Finance"
                  value={form.commercialFinanceResponsible}
                  onChange={(value) =>
                    updateField("commercialFinanceResponsible", value)
                  }
                  placeholder="Ej. Analista CF"
                />
                <FormTextarea
                  label="Comentarios generales AG"
                  value={form.graphicComments}
                  onChange={(value) => updateField("graphicComments", value)}
                  placeholder="Comentarios de diseño, arte, impresión..."
                />
                <FormTextarea
                  label="Comentarios generales R&D"
                  value={form.rdComments}
                  onChange={(value) => updateField("rdComments", value)}
                  placeholder="Comentarios técnicos, estructura, viabilidad..."
                />
              </div>
            </FormCard>

            <FormCard title="3. Datos de producto comercial" icon="◈" color="#27ae60" required>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Formato de Plano *"
                  value={form.blueprintFormat}
                  onChange={(value) => updateField("blueprintFormat", value)}
                  error={getError("blueprintFormat")}
                  placeholder="-- Seleccione --"
                  options={BLUEPRINT_FORMAT_OPTIONS}
                />
                <FormSelect
                  label="Aplicación Técnica *"
                  value={form.technicalApplication}
                  onChange={(value) => updateField("technicalApplication", value)}
                  error={getError("technicalApplication")}
                  placeholder="-- Seleccione --"
                  options={TECHNICAL_APPLICATION_OPTIONS}
                />
                <FormInput
                  label="Código de Empaque del Cliente"
                  value={form.customerPackingCode}
                  onChange={(value) => updateField("customerPackingCode", value)}
                  placeholder="Ej. COD-CLI-001"
                />
                <FormInput
                  label="Cantidad / Volumen estimado *"
                  value={form.estimatedVolume}
                  onChange={(value) => updateField("estimatedVolume", value)}
                  error={getError("estimatedVolume")}
                  placeholder="Ej. 500"
                />
                <FormSelect
                  label="Unidad de Medida *"
                  value={form.unitOfMeasure}
                  onChange={(value) => updateField("unitOfMeasure", value)}
                  error={getError("unitOfMeasure")}
                  options={UNIT_OPTIONS}
                />
              </div>
            </FormCard>

            <FormCard title="4. Especificaciones de diseño" icon="🎨" color="#8e44ad">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Ruta de Diseño *"
                  value={form.designRoute}
                  onChange={(value) => updateField("designRoute", value)}
                  error={getError("designRoute")}
                  options={[
                    { value: "Con diseño", label: "Con diseño" },
                    { value: "Sin diseño", label: "Sin diseño" },
                  ]}
                />
                <FormSelect
                  label="Clase de Impresión"
                  value={form.printClass}
                  onChange={(value) => updateField("printClass", value)}
                  placeholder="-- Seleccione --"
                  options={PRINT_CLASS_OPTIONS}
                />
                <FormSelect
                  label="Tipo de Impresión"
                  value={form.printType}
                  onChange={(value) => updateField("printType", value)}
                  placeholder="-- Seleccione --"
                  options={PRINT_TYPE_OPTIONS}
                />
                <FormSelect
                  label="¿Diseño ya trabajado?"
                  value={form.isPreviousDesign}
                  onChange={(value) => updateField("isPreviousDesign", value)}
                  options={YES_NO_OPTIONS}
                />
                {form.isPreviousDesign === "Sí" && (
                  <>
                    <FormInput
                      label="Cód. EDAG del Diseño"
                      value={form.previousEdagCode}
                      onChange={(value) => updateField("previousEdagCode", value)}
                      placeholder="Ej. 40267"
                    />
                    <FormInput
                      label="Versión EDAG"
                      value={form.previousEdagVersion}
                      onChange={(value) => updateField("previousEdagVersion", value)}
                      placeholder="Ej. 05"
                    />
                  </>
                )}
                <FormSelect
                  label="¿Tiene archivos digitales?"
                  value={form.hasDigitalFiles}
                  onChange={(value) => updateField("hasDigitalFiles", value)}
                  options={YES_NO_OPTIONS}
                />
                {form.hasDigitalFiles === "Sí" && (
                  <>
                    <FormSelect
                      label="Tipo Archivo Arte"
                      value={form.artworkFileType}
                      onChange={(value) => updateField("artworkFileType", value)}
                      options={FILE_TYPE_OPTIONS}
                      placeholder="-- Seleccione --"
                    />
                    <FormInput
                      label="Archivos adjuntos"
                      value={form.artworkAttachments}
                      onChange={(value) => updateField("artworkAttachments", value)}
                      placeholder="Nombre/link del archivo"
                    />
                  </>
                )}
                <FormSelect
                  label="¿Requiere trabajo de diseño?"
                  value={form.requiresDesignWork}
                  onChange={(value) => updateField("requiresDesignWork", value)}
                  options={YES_NO_OPTIONS}
                />
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Especificaciones de Diseño Especiales"
                    value={form.specialDesignSpecs}
                    onChange={(value) => updateField("specialDesignSpecs", value)}
                    placeholder="Efectos, texturas, acabados, restricciones de impresión..."
                  />
                </div>
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Comentarios de Diseño"
                    value={form.specialDesignComments}
                    onChange={(value) => updateField("specialDesignComments", value)}
                    placeholder="Comentarios adicionales de Artes Gráficas..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard
              title="5. Especificaciones de estructura"
              icon="🔩"
              color="#f39c12"
              className={isDuplicateMode ? "relative" : ""}
            >
              {isDuplicateMode && (
                <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-semibold text-amber-800">
                    Estructura bloqueada - Se mantiene igual al proyecto original
                  </span>
                </div>
              )}
              <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${isDuplicateMode ? "opacity-70 pointer-events-none" : ""}`}>
                <FormSelect
                  label="¿Tiene estructura de referencia?"
                  value={form.hasReferenceStructure}
                  onChange={(value) => updateField("hasReferenceStructure", value)}
                  options={YES_NO_OPTIONS}
                />
                {form.hasReferenceStructure === "Sí" && (
                  <>
                    <FormInput
                      label="Código E/M Referencia"
                      value={form.referenceEmCode}
                      onChange={(value) => updateField("referenceEmCode", value)}
                      placeholder="Ej. EM-000001"
                    />
                    <FormInput
                      label="Versión E/M"
                      value={form.referenceEmVersion}
                      onChange={(value) => updateField("referenceEmVersion", value)}
                      placeholder="Ej. 01"
                    />
                  </>
                )}
                <FormSelect
                  label="Tipo de Estructura"
                  value={form.structureType}
                  onChange={(value) => updateField("structureType", value)}
                  options={STRUCTURE_TYPE_OPTIONS}
                />
                <FormSelect
                  label="¿Tiene especificación técnica cliente?"
                  value={form.hasCustomerTechnicalSpec}
                  onChange={(value) =>
                    updateField("hasCustomerTechnicalSpec", value)
                  }
                  options={YES_NO_OPTIONS}
                />
                {form.hasCustomerTechnicalSpec === "Sí" && (
                  <FormInput
                    label="Adjunto especificación técnica"
                    value={form.customerTechnicalSpecAttachment}
                    onChange={(value) =>
                      updateField("customerTechnicalSpecAttachment", value)
                    }
                    placeholder="Nombre/link del archivo"
                  />
                )}
              </div>

              <div className={`mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 ${isDuplicateMode ? "opacity-70 pointer-events-none" : ""}`}>
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Capas de estructura
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[1, 2, 3, 4].map((layer) => (
                    <div key={layer} className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="mb-3 text-xs font-bold uppercase text-[#003b5c]">
                        Capa {layer}
                      </p>
                      <div className="space-y-3">
                        <FormSelect
                          label="Material"
                          value={form[`layer${layer}Material` as keyof ProjectFormData]}
                          onChange={(value) =>
                            updateField(`layer${layer}Material` as keyof ProjectFormData, value)
                          }
                          placeholder="-- Seleccione --"
                          options={MATERIAL_OPTIONS}
                        />
                        <FormInput
                          label="Micraje"
                          value={form[`layer${layer}Micron` as keyof ProjectFormData]}
                          onChange={(value) =>
                            updateField(`layer${layer}Micron` as keyof ProjectFormData, value)
                          }
                          placeholder="Ej. 80"
                        />
                        <FormInput
                          label="Gramaje"
                          value={form[`layer${layer}Grammage` as keyof ProjectFormData]}
                          onChange={(value) =>
                            updateField(`layer${layer}Grammage` as keyof ProjectFormData, value)
                          }
                          placeholder="Ej. 35"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 ${isDuplicateMode ? "opacity-70 pointer-events-none" : ""}`}>
                <FormInput
                  label="Gramaje general"
                  value={form.grammage}
                  onChange={(value) => updateField("grammage", value)}
                  placeholder="Ej. 40"
                />
                <FormInput
                  label="Tolerancia de Gramaje"
                  value={form.grammageTolerance}
                  onChange={(value) => updateField("grammageTolerance", value)}
                  placeholder="Ej. ±5%"
                />
                <FormSelect
                  label="¿Solicitud de muestra?"
                  value={form.sampleRequest}
                  onChange={(value) => updateField("sampleRequest", value)}
                  options={YES_NO_OPTIONS}
                />
                <div className="md:col-span-3">
                  <FormTextarea
                    label="Especificaciones Especiales de Estructura"
                    value={form.specialStructureSpecs}
                    onChange={(value) => updateField("specialStructureSpecs", value)}
                    placeholder="Restricciones, barreras, sellabilidad, resistencia, OTR/WVTR..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard title="6. Dimensiones y accesorios" icon="⌗" color="#16a085">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <FormInput label="Ancho" value={form.width} onChange={(value) => updateField("width", value)} placeholder="mm" />
                <FormInput label="Largo" value={form.length} onChange={(value) => updateField("length", value)} placeholder="mm" />
                <FormInput label="Repetición" value={form.repetition} onChange={(value) => updateField("repetition", value)} placeholder="mm" />
                <FormInput label="Base Doy Pack" value={form.doyPackBase} onChange={(value) => updateField("doyPackBase", value)} placeholder="Ej. Cuadrada" />
                <FormInput label="Ancho Fuelle" value={form.gussetWidth} onChange={(value) => updateField("gussetWidth", value)} placeholder="mm" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormSelect label="Zipper" value={form.hasZipper} onChange={(value) => updateField("hasZipper", value)} options={YES_NO_OPTIONS} />
                {form.hasZipper === "Sí" && (
                  <FormInput label="Tipo de Zipper" value={form.zipperType} onChange={(value) => updateField("zipperType", value)} />
                )}

                <FormSelect label="Tin-Tie" value={form.hasTinTie} onChange={(value) => updateField("hasTinTie", value)} options={YES_NO_OPTIONS} />

                <FormSelect label="Válvula" value={form.hasValve} onChange={(value) => updateField("hasValve", value)} options={YES_NO_OPTIONS} />
                {form.hasValve === "Sí" && (
                  <FormInput label="Tipo de Válvula" value={form.valveType} onChange={(value) => updateField("valveType", value)} />
                )}

                <FormSelect label="Asa Troquelada" value={form.hasDieCutHandle} onChange={(value) => updateField("hasDieCutHandle", value)} options={YES_NO_OPTIONS} />
                <FormSelect label="Refuerzo" value={form.hasReinforcement} onChange={(value) => updateField("hasReinforcement", value)} options={YES_NO_OPTIONS} />

                {form.hasReinforcement === "Sí" && (
                  <>
                    <FormInput label="Espesor Refuerzo" value={form.reinforcementThickness} onChange={(value) => updateField("reinforcementThickness", value)} />
                    <FormInput label="Ancho Refuerzo" value={form.reinforcementWidth} onChange={(value) => updateField("reinforcementWidth", value)} />
                  </>
                )}

                <FormSelect label="Corte Angular" value={form.hasAngularCut} onChange={(value) => updateField("hasAngularCut", value)} options={YES_NO_OPTIONS} />
                <FormSelect label="Esquinas Redondas" value={form.hasRoundedCorners} onChange={(value) => updateField("hasRoundedCorners", value)} options={YES_NO_OPTIONS} />

                {form.hasRoundedCorners === "Sí" && (
                  <FormInput label="Tipo Esquinas Redondas" value={form.roundedCornersType} onChange={(value) => updateField("roundedCornersType", value)} />
                )}

                <FormSelect label="Muesca" value={form.hasNotch} onChange={(value) => updateField("hasNotch", value)} options={YES_NO_OPTIONS} />
                <FormSelect label="Perforación" value={form.hasPerforation} onChange={(value) => updateField("hasPerforation", value)} options={YES_NO_OPTIONS} />

                {form.hasPerforation === "Sí" && (
                  <>
                    <FormInput label="Tipo Perforación Pouch" value={form.pouchPerforationType} onChange={(value) => updateField("pouchPerforationType", value)} />
                    <FormInput label="Tipo Perforación Bolsa" value={form.bagPerforationType} onChange={(value) => updateField("bagPerforationType", value)} />
                    <FormInput label="Ubicación Perforaciones" value={form.perforationLocation} onChange={(value) => updateField("perforationLocation", value)} />
                  </>
                )}

                <FormSelect label="Pre-Corte" value={form.hasPreCut} onChange={(value) => updateField("hasPreCut", value)} options={YES_NO_OPTIONS} />

                {form.hasPreCut === "Sí" && (
                  <FormInput label="Tipo de Pre-Corte" value={form.preCutType} onChange={(value) => updateField("preCutType", value)} />
                )}

                <div className="md:col-span-4">
                  <FormTextarea
                    label="Otros accesorios"
                    value={form.otherAccessories}
                    onChange={(value) => updateField("otherAccessories", value)}
                    placeholder="Otros accesorios, restricciones o detalles especiales..."
                  />
                </div>
              </div>
            </FormCard>

            <FormCard title="7. Especificaciones financieras / comerciales" icon="💰" color="#0d4c5c">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect label="Venta Nacional / Internacional" value={form.saleType} onChange={(value) => updateField("saleType", value)} options={SALE_TYPE_OPTIONS} />
                <FormSelect label="Incoterm" value={form.incoterm} onChange={(value) => updateField("incoterm", value)} options={INCOTERM_OPTIONS} />
                <FormSelect label="País Destino" value={form.destinationCountry} onChange={(value) => updateField("destinationCountry", value)} options={DESTINATION_COUNTRY_OPTIONS} />

                <FormInput label="Precio Objetivo" value={form.targetPrice} onChange={(value) => updateField("targetPrice", value)} placeholder="Ej. 45" />
                <FormInput label="Precio Venta" value={form.salePrice} onChange={(value) => updateField("salePrice", value)} placeholder="Ej. 46" />
                <FormSelect label="Tipo de Moneda" value={form.currencyType} onChange={(value) => updateField("currencyType", value)} options={CURRENCY_OPTIONS} />

                <FormSelect label="Condiciones de Pago" value={form.paymentTerms} onChange={(value) => updateField("paymentTerms", value)} options={PAYMENT_TERMS_OPTIONS} />
                <FormInput label="Material de Tuco / Core" value={form.coreMaterial} onChange={(value) => updateField("coreMaterial", value)} />
                <FormInput label="Tuco / Core (mm)" value={form.coreDiameter} onChange={(value) => updateField("coreDiameter", value)} />

                <FormInput label="Externo (mm)" value={form.externalDiameter} onChange={(value) => updateField("externalDiameter", value)} />
                <FormInput label="Variación Externo (+)" value={form.externalVariationPlus} onChange={(value) => updateField("externalVariationPlus", value)} />
                <FormInput label="Variación Externo (-)" value={form.externalVariationMinus} onChange={(value) => updateField("externalVariationMinus", value)} />

                <FormInput label="Peso máximo de bobina" value={form.maxRollWeight} onChange={(value) => updateField("maxRollWeight", value)} />
                <FormSelect label="Logo Producto Peruano" value={form.peruvianProductLogo} onChange={(value) => updateField("peruvianProductLogo", value)} options={YES_NO_OPTIONS} />
                <FormSelect label="Pie de Imprenta" value={form.printingFooter} onChange={(value) => updateField("printingFooter", value)} options={YES_NO_OPTIONS} />

                <div className="md:col-span-3">
                  <FormTextarea
                    label="Información adicional del cliente"
                    value={form.customerAdditionalInfo}
                    onChange={(value) => updateField("customerAdditionalInfo", value)}
                    placeholder="Condiciones comerciales, restricciones, requisitos adicionales..."
                  />
                </div>
              </div>
            </FormCard>
          </div>

          <div className="space-y-5">
            <div className="sticky top-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-[#003b5c] to-[#1E82D9] px-5 py-4 text-white">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Herencia de Portafolio
                </div>
                <div className="mt-2 text-lg font-extrabold">
                  {selectedPortfolio
                    ? selectedPortfolio.nom || selectedPortfolio.portfolioName
                    : "Seleccione Portafolio"}
                </div>
              </div>

              <div className="space-y-2 p-5 text-sm">
                <PreviewRow label="Código Proyecto" value={projectCode} />
                <PreviewRow label="Cliente" value={inheritedClient || "—"} />
                <PreviewRow label="Planta" value={inheritedPlant || "—"} />
                <PreviewRow label="Envoltura" value={inheritedWrapping || "—"} />
                <PreviewRow label="Uso Final" value={inheritedFinalUse || "—"} />
                <PreviewRow label="Sub-segmento" value={inheritedSubSegment || "—"} />
                <PreviewRow label="Segmento" value={inheritedSegment || "—"} />
                <PreviewRow label="Sector" value={inheritedSector || "—"} />
                <PreviewRow label="AFMarketID" value={inheritedAfMarketId || "—"} />
                <PreviewRow label="Máquina" value={inheritedMachine || "—"} />
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500">
                Los datos del portafolio se heredan para evitar duplicidad y mantener trazabilidad entre Cliente → Portafolio → Proyecto.
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/projects")}
            validationErrorList={Object.values(validationErrors)}
            submitAttempted={submitAttempted}
            submitLabel="Crear Proyecto"
            cancelLabel="Cancelar"
          />
        </div>
      </form>
    </div>
  );
}