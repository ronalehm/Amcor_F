export type ApprovedProduct = {
  id: string;
  code: string;
  name: string;
  portfolioCode: string;
  type: "base" | "approved";
  version?: string;
  status: "Activo" | "Inactivo";
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
  },
  {
    id: "APR-002",
    code: "SKU-00002-B",
    name: "Mayonesa Premium Base - Sachet 20ml",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
  },
  {
    id: "APR-003",
    code: "SKU-00003-B",
    name: "Mayonesa Premium Base - Balde 5kg",
    portfolioCode: "PO-000023",
    type: "base",
    version: "1.0",
    status: "Activo",
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
  },
  {
    id: "APR-005",
    code: "SKU-00002-A",
    name: "Mayonesa Premium Aprobada - Sachet 20ml",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "2.0",
    status: "Activo",
  },
  {
    id: "APR-006",
    code: "SKU-00003-A",
    name: "Mayonesa Premium Aprobada - Balde 5kg",
    portfolioCode: "PO-000023",
    type: "approved",
    version: "1.5",
    status: "Activo",
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

export function searchApprovedProducts(query: string, portfolioCode?: string): ApprovedProduct[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  let results = APPROVED_PRODUCTS.filter(
    (product) => product.status === "Activo"
  );

  if (portfolioCode) {
    results = results.filter((product) => product.portfolioCode === portfolioCode);
  }

  return results.filter((product) => {
    const code = product.code.toLowerCase();
    const name = product.name.toLowerCase();
    return code.includes(searchTerm) || name.includes(searchTerm);
  });
}
