const PORTFOLIO_DISPLAY_KEY = "odiseo_created_portfolios";
const TABPORT_RECORDS_KEY = "odiseo_tabport_records";

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
    envoltura: "Flowpack",
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
    envoltura: "Bolsa Doypack",
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
    envoltura: "Sachet",
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
    envoltura: "Stick Pack",
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
  const createdIds = new Set(created.map(c => c.id || c.codigo));
  const initials = INITIAL_PORTFOLIOS.filter(p => !createdIds.has(p.id));
  return [...created, ...initials];
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