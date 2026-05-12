const PORTFOLIO_DISPLAY_KEY = "odiseo_created_portfolios";
const TABPORT_RECORDS_KEY = "odiseo_tabport_records";
const PORTFOLIO_DELETED_KEY = "odiseo_deleted_portfolios";

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export type PortfolioStatus = "Borrador" | "Activo" | "Inactivo";

export type PortfolioRecord = {
  id: string; // Internal ID or code
  codigo: string; // PO-000001
  clientCode?: string;
  clientName?: string;
  ejecutivoName?: string;
  plantaName?: string;
  
  // Datos de Producto (ADN)
  envoltura?: string;
  usoFinal?: string;
  sector?: string;
  segmento?: string;
  subSegmento?: string;
  afMarketId?: string;
  maquinaCliente?: string;

  status: PortfolioStatus;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
};

export const INITIAL_PORTFOLIOS: PortfolioRecord[] = [
  {
    id: "PO-000001",
    codigo: "PO-000001",
    clientCode: "CLI-000001",
    clientName: "Alicorp S.A.A.",
    ejecutivoName: "BALDEON, EDUARDO",
    plantaName: "Callao",
    envoltura: "Pouch",
    usoFinal: "Galletas",
    sector: "Alimentos y bebidas",
    segmento: "Consumo Humano",
    subSegmento: "Golosinas",
    afMarketId: "AF-10001",
    maquinaCliente: "Bosch",
    status: "Activo",
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z"
  },
  {
    id: "PO-000002",
    codigo: "PO-000002",
    clientCode: "CLI-000002",
    clientName: "Kimberly-Clark Perú",
    ejecutivoName: "BOERO A.",
    plantaName: "Santa Anita",
    envoltura: "Bolsa",
    usoFinal: "Pañales",
    sector: "Manufactura",
    segmento: "Bebés",
    subSegmento: "Higiene",
    afMarketId: "AF-10002",
    maquinaCliente: "Volpak",
    status: "Activo",
    createdAt: "2026-03-01T11:30:00.000Z",
    updatedAt: "2026-03-01T11:30:00.000Z"
  },
  {
    id: "PO-000003",
    codigo: "PO-000003",
    clientCode: "CLI-000003",
    clientName: "Leche Gloria S.A.",
    ejecutivoName: "GUARDAMINO, KATIA",
    plantaName: "Huachipa",
    envoltura: "Pouch",
    usoFinal: "Leche Evaporada",
    sector: "Alimentos y bebidas",
    segmento: "Lácteos",
    subSegmento: "Líquidos",
    afMarketId: "AF-10003",
    maquinaCliente: "Tetrapak",
    status: "Activo",
    createdAt: "2026-03-10T09:15:00.000Z",
    updatedAt: "2026-03-10T09:15:00.000Z"
  },
  {
    id: "PO-000004",
    codigo: "PO-000004",
    clientCode: "CLI-000001",
    clientName: "Alicorp S.A.A.",
    ejecutivoName: "BALDEON, EDUARDO",
    plantaName: "Callao",
    envoltura: "Lámina",
    usoFinal: "Fideos",
    sector: "Alimentos y bebidas",
    segmento: "Pastas",
    subSegmento: "Secos",
    afMarketId: "AF-10004",
    maquinaCliente: "Oystar",
    status: "Borrador",
    createdAt: "2026-04-05T14:20:00.000Z",
    updatedAt: "2026-04-05T14:20:00.000Z"
  },
  {
    id: "PO-000005",
    codigo: "PO-000005",
    clientCode: "CLI-000005",
    clientName: "Nestlé Perú",
    ejecutivoName: "OTERO, AUGUSTO",
    plantaName: "Lima",
    envoltura: "Bolsa",
    usoFinal: "Café Soluble",
    sector: "Bebidas",
    segmento: "Café",
    subSegmento: "Instantáneo",
    afMarketId: "AF-10005",
    maquinaCliente: "Mespack",
    status: "Activo",
    createdAt: "2026-04-12T16:45:00.000Z",
    updatedAt: "2026-04-12T16:45:00.000Z"
  }
];

export function getPortfolioDisplayRecords(): PortfolioRecord[] {
  const created = safeParseArray<PortfolioRecord>(localStorage.getItem(PORTFOLIO_DISPLAY_KEY));
  const deletedIds = safeParseArray<string>(localStorage.getItem(PORTFOLIO_DELETED_KEY));
  
  const createdIds = new Set(created.map(c => c.id || c.codigo));
  const deletedSet = new Set(deletedIds);

  const initials = INITIAL_PORTFOLIOS.filter(p => !createdIds.has(p.id) && !deletedSet.has(p.id));
  
  return [...created, ...initials].filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.codigo));
}

export function getTabportRecords<T>() {
  return safeParseArray<T>(localStorage.getItem(TABPORT_RECORDS_KEY));
}

export function savePortfolioRecord<TDisplay, TTabport>({
  displayRecord,
  tabportRecord,
}: {
  displayRecord: TDisplay;
  tabportRecord: TTabport;
}) {
  const savedDisplay = getPortfolioDisplayRecords();
  const savedTabport = getTabportRecords<TTabport>();

  localStorage.setItem(
    PORTFOLIO_DISPLAY_KEY,
    JSON.stringify([displayRecord, ...savedDisplay])
  );

  localStorage.setItem(
    TABPORT_RECORDS_KEY,
    JSON.stringify([tabportRecord, ...savedTabport])
  );
}

export function getPortfolioByCode(code: string): PortfolioRecord | null {
  const saved = getPortfolioDisplayRecords();
  return saved.find((item) => item.id === code || item.codigo === code) || null;
}

export function updatePortfolioRecord(
  code: string,
  updates: Partial<PortfolioRecord>
): PortfolioRecord | null {
  const saved = getPortfolioDisplayRecords();
  const index = saved.findIndex((item) => item.id === code || item.codigo === code);
  if (index === -1) return null;

  saved[index] = { ...saved[index], ...updates };
  localStorage.setItem(PORTFOLIO_DISPLAY_KEY, JSON.stringify(saved));
  return saved[index];
}

export function deletePortfolioRecord(code: string): boolean {
  const deletedIds = safeParseArray<string>(localStorage.getItem(PORTFOLIO_DELETED_KEY));
  if (!deletedIds.includes(code)) {
    deletedIds.push(code);
    localStorage.setItem(PORTFOLIO_DELETED_KEY, JSON.stringify(deletedIds));
  }

  const created = safeParseArray<PortfolioRecord>(localStorage.getItem(PORTFOLIO_DISPLAY_KEY));
  const filtered = created.filter((item) => item.id !== code && item.codigo !== code);
  localStorage.setItem(PORTFOLIO_DISPLAY_KEY, JSON.stringify(filtered));
  return true;
}

export function getPortfoliosByClient(client: any): PortfolioRecord[] {
  const clientId = String(client.id || client.code || client.codigo || "").trim();
  const clientCode = String(client.code || client.codigo || client.id || "").trim();
  const clientName = String(client.nombre || client.name || client.razonSocial || client.businessName || "").trim().toLowerCase();
  const clientRuc = String(client.ruc || client.RUC || "").trim();

  return getPortfolioDisplayRecords().filter((portfolio: any) => {
    const portfolioClientId = String(portfolio.clientId || portfolio.clienteId || portfolio.clientCode || portfolio.codigoCliente || "").trim();
    const portfolioClientName = String(portfolio.clientName || portfolio.cliente || portfolio.cli || portfolio.nombreCliente || "").trim().toLowerCase();
    const portfolioClientRuc = String(portfolio.clientRuc || portfolio.ruc || portfolio.rucCliente || "").trim();

    return (
      (clientId && portfolioClientId === clientId) ||
      (clientCode && portfolioClientId === clientCode) ||
      (clientName && portfolioClientName === clientName) ||
      (clientRuc && portfolioClientRuc === clientRuc)
    );
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Catálogo oficial de Aplicación Técnica
// Fuente única reutilizable para Portafolio y Proyecto
// ──────────────────────────────────────────────────────────────────────────────

export const TECHNICAL_APPLICATION_OPTIONS = [
  // Seco
  { value: "Seco/Galletas", label: "Seco/Galletas" },
  { value: "Seco/Fideos/Fideos", label: "Seco/Fideos/Fideos" },
  { value: "Seco/Fideos/Fideos a granel", label: "Seco/Fideos/Fideos a granel" },
  { value: "Seco/Fideos/Fideos cortos", label: "Seco/Fideos/Fideos cortos" },
  { value: "Seco/Fideos/Fideos largos", label: "Seco/Fideos/Fideos largos" },
  { value: "Seco/Fideos/Fideos en bloque", label: "Seco/Fideos/Fideos en bloque" },
  { value: "Seco/Arroz y menestras", label: "Seco/Arroz y menestras" },
  { value: "Seco/Cereales y cereales procesadas", label: "Seco/Cereales y cereales procesadas" },
  { value: "Seco/Snacks", label: "Seco/Snacks" },
  { value: "Seco/Harinas", label: "Seco/Harinas" },
  { value: "Seco/Detergente/Detergente en Escamas", label: "Seco/Detergente/Detergente en Escamas" },
  { value: "Seco/Detergente/Detergente en Polvo", label: "Seco/Detergente/Detergente en Polvo" },
  { value: "Seco/Jabón", label: "Seco/Jabón" },
  { value: "Seco/Fertilizante", label: "Seco/Fertilizante" },
  { value: "Seco/Postres en Polvo", label: "Seco/Postres en Polvo" },
  { value: "Seco/Refrescos en Polvo", label: "Seco/Refrescos en Polvo" },
  { value: "Seco/Cocoa y Derivados en Polvo", label: "Seco/Cocoa y Derivados en Polvo" },
  { value: "Seco/Leche y Mezclas Lácteas en Polvo", label: "Seco/Leche y Mezclas Lácteas en Polvo" },
  { value: "Seco/Helados", label: "Seco/Helados" },
  { value: "Seco/Quesos", label: "Seco/Quesos" },
  { value: "Seco/Mezclas secas", label: "Seco/Mezclas secas" },
  { value: "Seco/Café Soluble / Molido", label: "Seco/Café Soluble / Molido" },
  { value: "Seco/Embutidos / Carnes Procesadas", label: "Seco/Embutidos / Carnes Procesadas" },
  { value: "Seco/Otro Alimentario", label: "Seco/Otro Alimentario" },
  { value: "Seco/Otro no Alimentario", label: "Seco/Otro no Alimentario" },
  { value: "Seco/Alimentos Balanceados", label: "Seco/Alimentos Balanceados" },
  // Pastoso
  { value: "Pastoso/Cera en Pasta", label: "Pastoso/Cera en Pasta" },
  { value: "Pastoso/Ketchup, Mayonesa, Mostaza", label: "Pastoso/Ketchup, Mayonesa, Mostaza" },
  { value: "Pastoso/Champu, Productos Cosméticos", label: "Pastoso/Champu, Productos Cosméticos" },
  { value: "Pastoso/Mermelada y Purés de Fruta", label: "Pastoso/Mermelada y Purés de Fruta" },
  { value: "Pastoso/Queso Crema", label: "Pastoso/Queso Crema" },
  { value: "Pastoso/Margarina Mantequilla", label: "Pastoso/Margarina Mantequilla" },
  { value: "Pastoso/Otro Alimentario", label: "Pastoso/Otro Alimentario" },
  { value: "Pastoso/Otro No Alimentario", label: "Pastoso/Otro No Alimentario" },
  // Líquido
  { value: "Líquido/Productos Comestibles/Aceites/Aceite de Oliva", label: "Líquido/Productos Comestibles/Aceites/Aceite de Oliva" },
  { value: "Líquido/Productos Comestibles/Aceites/Aceite para cocina", label: "Líquido/Productos Comestibles/Aceites/Aceite para cocina" },
  { value: "Líquido/Productos Comestibles/Vinagre", label: "Líquido/Productos Comestibles/Vinagre" },
  { value: "Líquido/Productos No Comestibles", label: "Líquido/Productos No Comestibles" },
  { value: "Líquido/Ceras y Limpiadores", label: "Líquido/Ceras y Limpiadores" },
  { value: "Líquido/Leche y Mezclas Lácteas", label: "Líquido/Leche y Mezclas Lácteas" },
  { value: "Líquido/Jugos y Néctares de Fruta", label: "Líquido/Jugos y Néctares de Fruta" },
  { value: "Líquido/Detergentes", label: "Líquido/Detergentes" },
  { value: "Líquido/Otro Alimentario", label: "Líquido/Otro Alimentario" },
  { value: "Líquido/Otro No Alimentario", label: "Líquido/Otro No Alimentario" },
  // Otros
  { value: "Otros/Contacto Indirecto/Seco", label: "Otros/Contacto Indirecto/Seco" },
  { value: "Otros/Contacto Indirecto/Pastoso", label: "Otros/Contacto Indirecto/Pastoso" },
  { value: "Otros/Contacto Indirecto/Líquido", label: "Otros/Contacto Indirecto/Líquido" },
];
