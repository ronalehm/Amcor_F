export type SkuLifecycleCode = "B" | "A" | "P" | "E";

export type ApprovedProduct = {
  id: string;
  code: string;
  name: string;
  productName?: string;
  portfolioCode: string;
  portfolioName?: string;
  clientCode?: string;
  clientName?: string;
  type: "base" | "approved" | "portfolio_standard";
  productType?: "base" | "approved" | "portfolio_standard";
  version?: string;
  status: "Activo" | "Inactivo" | "Base" | "Aprobado" | "Portafolio estándar";
  skuLifecycleCode?: SkuLifecycleCode;
  cicloVida?: SkuLifecycleCode;
  lifecycleLabel?: string;
  // Heredable fields
  wrappingName?: string;
  envoltura?: string;
  useFinalName?: string;
  usoFinal?: string;
  packingMachineName?: string;
  maquinaCliente?: string;
  capacityValue?: string;
  capacityUnit?: string;
  hasSpecialDesign?: "Sí" | "No";
  description?: string;
  // Volumen y unidad
  volumenCantidadReferencial?: string;
  estimatedVolume?: string;
  unidad?: string;
  unitOfMeasure?: string;
  // Descripción de la necesidad
  descripcionNecesidad?: string;
  projectDescription?: string;
  // Materiales por capa
  layer1Material?: string;
  layer1Micron?: string;
  layer2Material?: string;
  layer2Micron?: string;
  layer3Material?: string;
  layer3Micron?: string;
  layer4Material?: string;
  layer4Micron?: string;
};

const APPROVED_PRODUCTS: ApprovedProduct[] = [
  // Productos Base para Portafolio Mayonesa Premium
  {
    id: "APR-001",
    code: "SKU-00001-B",
    name: "Mayonesa Premium Base - Botella 500ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "01",
    status: "Activo",
    wrappingName: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
    description: "Mayonesa Premium en formato botella de 500ml. Producto base para salsas y condimentos húmedos.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  {
    id: "APR-002",
    code: "SKU-00002-B",
    name: "Mayonesa Premium Base - Sachet 20ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "01",
    status: "Activo",
    wrappingName: "SOBRE",
    useFinalName: "Retail - Dispensers",
    packingMachineName: "Sachets - Horizontal Form Fill Seal",
    capacityValue: "20",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
    description: "Mayonesa Premium en formato sachet de 20ml. Ideal para dispensadores retail.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  {
    id: "APR-003",
    code: "SKU-00003-B",
    name: "Mayonesa Premium Base - Balde 5kg",
    portfolioCode: "PO-000023",
    type: "base",
    version: "01",
    status: "Activo",
    wrappingName: "BALDE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Baldes",
    capacityValue: "5",
    capacityUnit: "kg",
    hasSpecialDesign: "No",
    description: "Mayonesa Premium en formato balde de 5kg. Presentación para food service y distribución a granel.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  // Productos Aprobados para Portafolio Mayonesa Premium
  {
    id: "APR-004",
    code: "SKU-00001-A",
    name: "Mayonesa Premium  - Botella 500ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "02",
    status: "Activo",
    wrappingName: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "ml",
    volumenCantidadReferencial: "500",
    estimatedVolume: "500",
    unidad: "ML",
    unitOfMeasure: "ML",
    hasSpecialDesign: "No",
    description: "Mayonesa Premium aprobada en formato botella de 500ml. Versión 02 con mejoras en formulación.",
    descripcionNecesidad: "Presentación botella para venta retail con volumen de 500ml. Mejoras en cierre de seguridad.",
    projectDescription: "Presentación botella para venta retail con volumen de 500ml. Mejoras en cierre de seguridad.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  {
    id: "APR-005",
    code: "SKU-00002-A",
    name: "Mayonesa Premium  - Sachet 20ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "03",
    status: "Activo",
    wrappingName: "SOBRE",
    useFinalName: "Retail - Dispensers",
    packingMachineName: "Sachets - Horizontal Form Fill Seal",
    capacityValue: "20",
    capacityUnit: "ml",
    volumenCantidadReferencial: "20",
    estimatedVolume: "20",
    unidad: "ML",
    unitOfMeasure: "ML",
    hasSpecialDesign: "No",
    description: "Mayonesa Premium aprobada en formato sachet de 20ml. Perfecto para dispensadores retail.",
    descripcionNecesidad: "Sachets de 20ml para dispensadores. Formato individual de uso retail.",
    projectDescription: "Sachets de 20ml para dispensadores. Formato individual de uso retail.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  {
    id: "APR-006",
    code: "SKU-00003-A",
    name: "Mayonesa Premium  - Balde 5kg",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "04",
    status: "Activo",
    wrappingName: "BALDE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Baldes",
    capacityValue: "5",
    capacityUnit: "kg",
    volumenCantidadReferencial: "5",
    estimatedVolume: "5",
    unidad: "KG",
    unitOfMeasure: "KG",
    hasSpecialDesign: "No",
    description: "Mayonesa Premium aprobada en formato balde de 5kg. Para food service y distribución a granel.",
    descripcionNecesidad: "Balde de 5kg para food service. Presentación a granel con tapa de seguridad.",
    projectDescription: "Balde de 5kg para food service. Presentación a granel con tapa de seguridad.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  // Productos Base adicionales para Portafolio Mayonesa Premium - Alicorp
  {
    id: "APR-007",
    code: "SKU-00004-B",
    name: "Mayonesa Light Base - Botella 400ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "01",
    status: "Activo",
    wrappingName: "BOTELLA PLÁSTICA",
    useFinalName: "Retail - Premium",
    packingMachineName: "Llenadora de Botellas PET",
    capacityValue: "400",
    capacityUnit: "ml",
    hasSpecialDesign: "Sí",
    description: "Mayonesa Light base en botella de 400ml con diseño especial. Versión reducida en calorías.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  {
    id: "APR-008",
    code: "SKU-00005-B",
    name: "Mayonesa Extra Base - Tubo 150ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "01",
    status: "Activo",
    wrappingName: "TUBO",
    useFinalName: "Retail - Travel Size",
    packingMachineName: "Llenadora de Tubos",
    capacityValue: "150",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
    description: "Mayonesa Extra base en tubo de 150ml. Formato portátil ideal para viajes y uso personal.",
    layer1Material: "MATCAP-035",
    layer1Micron: "12",
    layer2Material: "MATCAP-008",
    layer2Micron: "12",
    layer3Material: "MATCAP-016",
    layer3Micron: "93",
  },
  {
    id: "APR-009",
    code: "SKU-00006-B",
    name: "Mayonesa Económica Base - Pote 750ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "01",
    status: "Activo",
    wrappingName: "POTE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Potes",
    capacityValue: "750",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
    description: "Mayonesa Económica base en pote de 750ml. Opción de precio accesible para distribución a granel.",
    layer1Material: "MATCAP-009",
    layer1Micron: "15",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  // Productos Aprobados adicionales para Portafolio Mayonesa Premium - Alicorp
  {
    id: "APR-010",
    code: "SKU-00004-A",
    name: "Mayonesa Light  - Botella 400ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "02",
    status: "Activo",
    wrappingName: "BOTELLA PLÁSTICA",
    useFinalName: "Retail - Premium",
    packingMachineName: "Llenadora de Botellas PET",
    capacityValue: "400",
    capacityUnit: "ml",
    volumenCantidadReferencial: "400",
    estimatedVolume: "400",
    unidad: "ML",
    unitOfMeasure: "ML",
    hasSpecialDesign: "Sí",
    description: "Mayonesa Light aprobada en botella de 400ml con diseño especial premium. Versión 02.",
    descripcionNecesidad: "Mayonesa Light en botella con diseño especial. Versión 02 con mejoras en etiqueta y cierre.",
    projectDescription: "Mayonesa Light en botella con diseño especial. Versión 02 con mejoras en etiqueta y cierre.",
    layer1Material: "MATCAP-008",
    layer1Micron: "12",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  {
    id: "APR-011",
    code: "SKU-00005-A",
    name: "Mayonesa Extra  - Tubo 150ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "02",
    status: "Activo",
    wrappingName: "TUBO",
    useFinalName: "Retail - Travel Size",
    packingMachineName: "Llenadora de Tubos",
    capacityValue: "150",
    capacityUnit: "ml",
    volumenCantidadReferencial: "150",
    estimatedVolume: "150",
    unidad: "ML",
    unitOfMeasure: "ML",
    hasSpecialDesign: "No",
    description: "Mayonesa Extra aprobada en tubo de 150ml. Formato portátil ideal para viajes.",
    descripcionNecesidad: "Tubo de 150ml para formato de viaje. Cierre ergonómico con punta aplicadora.",
    projectDescription: "Tubo de 150ml para formato de viaje. Cierre ergonómico con punta aplicadora.",
    layer1Material: "MATCAP-035",
    layer1Micron: "12",
    layer2Material: "MATCAP-008",
    layer2Micron: "12",
    layer3Material: "MATCAP-016",
    layer3Micron: "93",
  },
  {
    id: "APR-012",
    code: "SKU-00006-A",
    name: "Mayonesa Económica  - Pote 750ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "02",
    status: "Activo",
    wrappingName: "POTE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Potes",
    capacityValue: "750",
    capacityUnit: "ml",
    volumenCantidadReferencial: "750",
    estimatedVolume: "750",
    unidad: "ML",
    unitOfMeasure: "ML",
    hasSpecialDesign: "No",
    description: "Mayonesa Económica aprobada en pote de 750ml. Versión 02 mejorada para distribución.",
    descripcionNecesidad: "Pote de 750ml para food service. Opción económica con tapa de rosca.",
    projectDescription: "Pote de 750ml para food service. Opción económica con tapa de rosca.",
    layer1Material: "MATCAP-009",
    layer1Micron: "15",
    layer2Material: "MATCAP-010",
    layer2Micron: "22",
    layer3Material: "MATCAP-008",
    layer3Micron: "12",
  },
  // Productos Alicorp - Mayonesa Premium (CL-000001 / PO-000023)
  {
    id: "SKU-00021-B-01",
    code: "SKU-00021-B",
    version: "01",
    name: "Mayonesa Premium 500 g",
    productName: "Mayonesa Premium",
    clientCode: "CL-000001",
    clientName: "Alicorp S.A.A.",
    portfolioCode: "PO-000023",
    portfolioName: "Mayonesa Premium",
    type: "base",
    productType: "base",
    skuLifecycleCode: "B",
    cicloVida: "B",
    lifecycleLabel: "Base",
    status: "Base",
    wrappingName: "POUCH",
    envoltura: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    usoFinal: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    maquinaCliente: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "g",
    description: "Producto base técnico reutilizable para solicitudes de mayonesa premium en formato pouch.",
    layer1Material: "PET",
    layer1Micron: "12",
    layer2Material: "BOPP",
    layer2Micron: "20",
    layer3Material: "PE_SELLANTE",
    layer3Micron: "80",
  },
  {
    id: "SKU-00022-A-01",
    code: "SKU-00022-A",
    version: "01",
    name: "Mayonesa Premium 500 g Pouch",
    productName: "Mayonesa Premium",
    clientCode: "CL-000001",
    clientName: "Alicorp S.A.A.",
    portfolioCode: "PO-000023",
    portfolioName: "Mayonesa Premium",
    type: "approved",
    productType: "approved",
    skuLifecycleCode: "A",
    cicloVida: "A",
    lifecycleLabel: "Aprobado",
    status: "Aprobado",
    wrappingName: "POUCH",
    envoltura: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    usoFinal: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    maquinaCliente: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "g",
    description: "SKU aprobado y vigente para operación comercial de Mayonesa Premium 500 g.",
    layer1Material: "PET",
    layer1Micron: "12",
    layer2Material: "BOPP",
    layer2Micron: "20",
    layer3Material: "PE_SELLANTE",
    layer3Micron: "80",
  },
  {
    id: "SKU-00023-A-01",
    code: "SKU-00023-A",
    version: "01",
    name: "Mayonesa Premium 900 g Pouch",
    productName: "Mayonesa Premium",
    clientCode: "CL-000001",
    clientName: "Alicorp S.A.A.",
    portfolioCode: "PO-000023",
    portfolioName: "Mayonesa Premium",
    type: "approved",
    productType: "approved",
    skuLifecycleCode: "A",
    cicloVida: "A",
    lifecycleLabel: "Aprobado",
    status: "Aprobado",
    wrappingName: "POUCH",
    envoltura: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    usoFinal: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    maquinaCliente: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "900",
    capacityUnit: "g",
    description: "SKU aprobado y vigente para operación comercial de Mayonesa Premium 900 g.",
    layer1Material: "PET",
    layer1Micron: "12",
    layer2Material: "ALUMINIO",
    layer2Micron: "7",
    layer3Material: "PE_SELLANTE",
    layer3Micron: "90",
  },
  {
    id: "SKU-00024-P-01",
    code: "SKU-00024-P",
    version: "01",
    name: "Mayonesa Premium Estándar Pouch",
    productName: "Mayonesa Premium",
    clientCode: "CL-000001",
    clientName: "Alicorp S.A.A.",
    portfolioCode: "PO-000023",
    portfolioName: "Mayonesa Premium",
    type: "approved",
    productType: "portfolio_standard",
    skuLifecycleCode: "P",
    cicloVida: "P",
    lifecycleLabel: "Portafolio estándar",
    status: "Portafolio estándar",
    wrappingName: "POUCH",
    envoltura: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    usoFinal: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    maquinaCliente: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "g",
    description: "Producto aprobado que forma parte de una configuración estándar de portafolio.",
    layer1Material: "PET",
    layer1Micron: "12",
    layer2Material: "BOPP",
    layer2Micron: "20",
    layer3Material: "PE_SELLANTE",
    layer3Micron: "80",
  },
];

export function getAllApprovedProducts(): ApprovedProduct[] {
  return APPROVED_PRODUCTS;
}

export function getApprovedProductsByPortfolio(portfolioCode: string): ApprovedProduct[] {
  return APPROVED_PRODUCTS.filter(
    (product) => product.portfolioCode === portfolioCode && product.status === "Activo"
  );
}

export function getApprovedProductByCode(code: string): ApprovedProduct | undefined {
  return APPROVED_PRODUCTS.find((product) => product.code === code);
}

export function searchApprovedProducts(
  query: string,
  portfolioCode?: string,
  productType?: "base" | "approved" | "portfolio_standard"
): ApprovedProduct[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  let results = APPROVED_PRODUCTS.filter(
    (product) => product.status === "Activo"
  );

  if (portfolioCode) {
    results = results.filter((product) => product.portfolioCode === portfolioCode);
  }

  // Filter by productType -> skuLifecycleCode mapping
  if (productType) {
    results = results.filter((product) => {
      const lifecycle = product.skuLifecycleCode || product.cicloVida;

      if (productType === "base") {
        // Base products: skuLifecycleCode "B"
        return lifecycle === "B" || product.type === "base";
      } else if (productType === "approved") {
        // Approved products: skuLifecycleCode "A" and "P"
        return lifecycle === "A" || lifecycle === "P" || product.type === "approved" || product.type === "portfolio_standard";
      } else if (productType === "portfolio_standard") {
        // Portfolio standard products: skuLifecycleCode "P"
        return lifecycle === "P" || product.type === "portfolio_standard";
      }

      return true;
    });
  }

  return results.filter((product) => {
    const code = (product.code || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const productName = (product.productName || "").toLowerCase();

    return (
      code.includes(searchTerm) ||
      name.includes(searchTerm) ||
      productName.includes(searchTerm)
    );
  });
}
