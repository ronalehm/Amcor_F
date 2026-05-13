export type ApprovedProductRecord = {
  id: string;
  sku: string;
  version: string;
  productName: string;
  clientName: string;
  clientCode?: string;
  portfolioName?: string;
  portfolioCode?: string;
  status: "Aprobado";
  envoltura: "POUCH" | "BOLSA" | "LÁMINA";
  formatoPlano: string;
  structureType: string;
  materialDescription?: string;
  width?: number;
  length?: number;
  gussetWidth?: number;
  grammage?: number;
  micron?: number;
  printType?: string;
  machine?: string;
  finalUse?: string;
  sector?: string;
  segment?: string;
  subSegment?: string;
  afMarketId?: string;
  approvedAt: string;
};

const APPROVED_PRODUCTS_SEED: ApprovedProductRecord[] = [
  {
    id: "APR-000001",
    sku: "SKU-100245",
    version: "V03",
    productName: "Doypack Mayonesa 250 ml",
    clientName: "Alicorp S.A.A.",
    clientCode: "CLI-001",
    portfolioCode: "PO-000001",
    portfolioName: "Mayonesa",
    status: "Aprobado",
    envoltura: "POUCH",
    formatoPlano: "POUCH STAND UP\\DOY PACK REDONDO\\FUELLE PROPIO",
    structureType: "Multicapa",
    materialDescription: "PET / PE",
    width: 140,
    length: 210,
    gussetWidth: 45,
    grammage: 72,
    micron: 110,
    printType: "Huecograbado",
    machine: "HFFS - Stand up Pouch",
    finalUse: "Food",
    sector: "Food",
    segment: "Sauces",
    subSegment: "Mayonnaise",
    afMarketId: "9000014",
    approvedAt: "2026-04-10",
  },
  {
    id: "APR-000002",
    sku: "SKU-100318",
    version: "V02",
    productName: "Bolsa Lavavajillas 3KG",
    clientName: "CIA IMPORTADORA DERTEANO & STUCKER S.A.C",
    clientCode: "CLI-012",
    portfolioCode: "PO-000022",
    portfolioName: "Lavavajillas",
    status: "Aprobado",
    envoltura: "BOLSA",
    formatoPlano: "SELLO DE FONDO\\CON FUELLE LATERAL",
    structureType: "Monocapa",
    materialDescription: "PEBD",
    width: 320,
    length: 520,
    gussetWidth: 80,
    grammage: 58,
    micron: 90,
    printType: "Flexografía",
    machine: "VFFS - 3 sellos Fuelle Lateral",
    finalUse: "Home Care",
    sector: "HPC",
    segment: "Home Care",
    subSegment: "Dishwashing",
    afMarketId: "9000005",
    approvedAt: "2026-03-18",
  },
  {
    id: "APR-000003",
    sku: "SKU-100411",
    version: "V01",
    productName: "Lámina Corona Light Botella 355ml",
    clientName: "UNIÓN DE CERVECERÍAS PERUANAS BACKUS Y JOHNSTON",
    clientCode: "CLI-020",
    portfolioCode: "PO-000012",
    portfolioName: "Lámina Corona",
    status: "Aprobado",
    envoltura: "LÁMINA",
    formatoPlano: "GENERICA",
    structureType: "Monocapa",
    materialDescription: "BOPP",
    width: 900,
    length: 650,
    gussetWidth: 0,
    grammage: 32,
    micron: 25,
    printType: "Huecograbado",
    machine: "Laminadora / Conversión",
    finalUse: "Alcohol",
    sector: "Beverages",
    segment: "Liquid Beverages",
    subSegment: "Spirit",
    afMarketId: "9000006",
    approvedAt: "2026-02-24",
  },
  {
    id: "APR-000004",
    sku: "SKU-100522",
    version: "V04",
    productName: "Pouch Salsa de Tomate 10g",
    clientName: "Kimberly-Clark Perú",
    clientCode: "CLI-002",
    portfolioCode: "PO-000001",
    portfolioName: "Mayonesa",
    status: "Aprobado",
    envoltura: "POUCH",
    formatoPlano: "POUCH PLANO\\TRES SELLOS",
    structureType: "Multicapa",
    materialDescription: "PET / ALU / PE",
    width: 85,
    length: 120,
    gussetWidth: 0,
    grammage: 65,
    micron: 95,
    printType: "Huecograbado",
    machine: "HFFS - Sachet",
    finalUse: "Food",
    sector: "Food",
    segment: "Sauces",
    subSegment: "Tomato Sauce",
    afMarketId: "9000011",
    approvedAt: "2026-01-30",
  },
  {
    id: "APR-000005",
    sku: "SKU-100633",
    version: "V05",
    productName: "Bolsa Café Andino 500g",
    clientName: "Café Andino Export S.A.C.",
    clientCode: "CLI-013",
    portfolioCode: "PO-000030",
    portfolioName: "Café Exportación",
    status: "Aprobado",
    envoltura: "BOLSA",
    formatoPlano: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO",
    structureType: "Multicapa",
    materialDescription: "PET MET / PE",
    width: 160,
    length: 300,
    gussetWidth: 70,
    grammage: 78,
    micron: 120,
    printType: "Flexografía",
    machine: "VFFS - Bolsa almohada",
    finalUse: "Coffee",
    sector: "Food",
    segment: "Dry Food",
    subSegment: "Coffee",
    afMarketId: "9000021",
    approvedAt: "2026-03-05",
  },
];

export function getApprovedProducts(): ApprovedProductRecord[] {
  return APPROVED_PRODUCTS_SEED;
}

export function searchApprovedProducts(query: string): ApprovedProductRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return APPROVED_PRODUCTS_SEED;

  return APPROVED_PRODUCTS_SEED.filter((product) => {
    const searchable = [
      product.sku,
      product.version,
      product.productName,
      product.clientName,
      product.portfolioCode,
      product.portfolioName,
      product.envoltura,
      product.formatoPlano,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function getApprovedProductById(id: string): ApprovedProductRecord | undefined {
  return APPROVED_PRODUCTS_SEED.find((product) => product.id === id);
}

export function getApprovedProductBySku(sku: string): ApprovedProductRecord | undefined {
  return APPROVED_PRODUCTS_SEED.find((product) => product.sku === sku);
}
