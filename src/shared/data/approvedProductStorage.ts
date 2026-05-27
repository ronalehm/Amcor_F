export type ApprovedProduct = {
  id: string;
  code: string;
  name: string;
  portfolioCode: string;
  type: "base" | "approved";
  version?: string;
  status: "Activo" | "Inactivo";
  // Heredable fields
  wrappingName?: string;
  useFinalName?: string;
  packingMachineName?: string;
  capacityValue?: string;
  capacityUnit?: string;
  hasSpecialDesign?: "Sí" | "No";
};

const APPROVED_PRODUCTS: ApprovedProduct[] = [
  // Productos Base para Portafolio Mayonesa Premium
  {
    id: "APR-001",
    code: "SKU-00001-B",
    name: "Mayonesa Premium Base - Botella 500ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
    wrappingName: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  {
    id: "APR-002",
    code: "SKU-00002-B",
    name: "Mayonesa Premium Base - Sachet 20ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
    wrappingName: "SOBRE",
    useFinalName: "Retail - Dispensers",
    packingMachineName: "Sachets - Horizontal Form Fill Seal",
    capacityValue: "20",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  {
    id: "APR-003",
    code: "SKU-00003-B",
    name: "Mayonesa Premium Base - Balde 5kg",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
    wrappingName: "BALDE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Baldes",
    capacityValue: "5",
    capacityUnit: "kg",
    hasSpecialDesign: "No",
  },
  // Productos Aprobados para Portafolio Mayonesa Premium
  {
    id: "APR-004",
    code: "SKU-00001-A",
    name: "Mayonesa Premium Aprobada - Botella 500ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "2.1",
    status: "Activo",
    wrappingName: "POUCH",
    useFinalName: "Wet Condiments & Sauces",
    packingMachineName: "HFFS - Stand up Pouch - Sello Doy Pack",
    capacityValue: "500",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  {
    id: "APR-005",
    code: "SKU-00002-A",
    name: "Mayonesa Premium Aprobada - Sachet 20ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "2.0",
    status: "Activo",
    wrappingName: "SOBRE",
    useFinalName: "Retail - Dispensers",
    packingMachineName: "Sachets - Horizontal Form Fill Seal",
    capacityValue: "20",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  {
    id: "APR-006",
    code: "SKU-00003-A",
    name: "Mayonesa Premium Aprobada - Balde 5kg",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "1.5",
    status: "Activo",
    wrappingName: "BALDE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Baldes",
    capacityValue: "5",
    capacityUnit: "kg",
    hasSpecialDesign: "No",
  },
  // Productos Base adicionales para Portafolio Mayonesa Premium - Alicorp
  {
    id: "APR-007",
    code: "SKU-00004-B",
    name: "Mayonesa Light Base - Botella 400ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
    wrappingName: "BOTELLA PLÁSTICA",
    useFinalName: "Retail - Premium",
    packingMachineName: "Llenadora de Botellas PET",
    capacityValue: "400",
    capacityUnit: "ml",
    hasSpecialDesign: "Sí",
  },
  {
    id: "APR-008",
    code: "SKU-00005-B",
    name: "Mayonesa Extra Base - Tubo 150ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
    wrappingName: "TUBO",
    useFinalName: "Retail - Travel Size",
    packingMachineName: "Llenadora de Tubos",
    capacityValue: "150",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  {
    id: "APR-009",
    code: "SKU-00006-B",
    name: "Mayonesa Económica Base - Pote 750ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
    wrappingName: "POTE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Potes",
    capacityValue: "750",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  // Productos Aprobados adicionales para Portafolio Mayonesa Premium - Alicorp
  {
    id: "APR-010",
    code: "SKU-00004-A",
    name: "Mayonesa Light Aprobada - Botella 400ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "1.2",
    status: "Activo",
    wrappingName: "BOTELLA PLÁSTICA",
    useFinalName: "Retail - Premium",
    packingMachineName: "Llenadora de Botellas PET",
    capacityValue: "400",
    capacityUnit: "ml",
    hasSpecialDesign: "Sí",
  },
  {
    id: "APR-011",
    code: "SKU-00005-A",
    name: "Mayonesa Extra Aprobada - Tubo 150ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "1.0",
    status: "Activo",
    wrappingName: "TUBO",
    useFinalName: "Retail - Travel Size",
    packingMachineName: "Llenadora de Tubos",
    capacityValue: "150",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
  },
  {
    id: "APR-012",
    code: "SKU-00006-A",
    name: "Mayonesa Económica Aprobada - Pote 750ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "1.1",
    status: "Activo",
    wrappingName: "POTE",
    useFinalName: "Food Service - Bulk",
    packingMachineName: "Llenadora de Potes",
    capacityValue: "750",
    capacityUnit: "ml",
    hasSpecialDesign: "No",
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
  productType?: "base" | "approved"
): ApprovedProduct[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  let results = APPROVED_PRODUCTS.filter(
    (product) => product.status === "Activo"
  );

  if (portfolioCode) {
    results = results.filter((product) => product.portfolioCode === portfolioCode);
  }

  if (productType) {
    results = results.filter((product) => product.type === productType);
  }

  return results.filter((product) => {
    const code = product.code.toLowerCase();
    const name = product.name.toLowerCase();
    return code.includes(searchTerm) || name.includes(searchTerm);
  });
}
