const CLIENTS_STORAGE_KEY = "odiseo_created_clients";

export type ClientStatus = "Borrador" | "Registrado" | "Inactivo";

export type ClientRecord = {
  id: number;
  code: string;

  documentType: "RUC" | "DNI" | "CE";
  ruc: string;

  name: string;
  commercialName?: string;

  ejecutivoId?: number;
  ejecutivoName?: string;

  actividadPrincipal?: string;
  rubroGeneral?: string;
  gestion?: "Pública" | "Privada";
  ventasUIT?: string;
  empleados?: string;
  facturacionEbitda?: string;
  resultado?: string;
  cobertura?: string;

  pais?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  direccionFiscal?: string;
  culturaOrganizacional?: string;
  posicionamiento?: string;

  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
};

const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 1,
    code: "CLI-000001",
    documentType: "RUC",
    ruc: "20100055237",
    name: "Alicorp S.A.A.",
    commercialName: "Alicorp",
    actividadPrincipal: "Alimentos y bebidas",
    rubroGeneral: "Consumo masivo",
    gestion: "Privada",
    cobertura: "Nacional",
    pais: "PERÚ",
    departamento: "Lima",
    provincia: "Lima",
    distrito: "Callao",
    direccionFiscal: "Av. Argentina 4793, Callao",
    status: "Registrado",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    code: "CLI-000002",
    documentType: "RUC",
    ruc: "20100152941",
    name: "Kimberly-Clark Perú",
    commercialName: "Kimberly-Clark",
    actividadPrincipal: "Manufactura",
    rubroGeneral: "Cuidado personal",
    gestion: "Privada",
    cobertura: "Nacional",
    pais: "PERÚ",
    departamento: "Lima",
    provincia: "Lima",
    distrito: "Santa Anita",
    direccionFiscal: "Lima, Perú",
    status: "Registrado",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    code: "CLI-000003",
    documentType: "RUC",
    ruc: "20100190797",
    name: "Leche Gloria S.A.",
    commercialName: "Gloria",
    actividadPrincipal: "Alimentos y bebidas",
    rubroGeneral: "Consumo masivo",
    gestion: "Privada",
    cobertura: "Nacional",
    pais: "PERÚ",
    departamento: "Lima",
    provincia: "Lima",
    distrito: "Ate",
    direccionFiscal: "Lima, Perú",
    status: "Registrado",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistClients(records: ClientRecord[]) {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(records));
}

export function getCreatedClients(): ClientRecord[] {
  return safeParseArray<ClientRecord>(
    localStorage.getItem(CLIENTS_STORAGE_KEY)
  );
}

export function getClientCatalogRecords(): ClientRecord[] {
  const createdClients = getCreatedClients();

  const createdRucs = new Set(createdClients.map((client) => client.ruc));
  const createdCodes = new Set(createdClients.map((client) => client.code));

  const initialWithoutDuplicates = INITIAL_CLIENTS.filter(
    (client) => !createdRucs.has(client.ruc) && !createdCodes.has(client.code)
  );

  return [...createdClients, ...initialWithoutDuplicates];
}

export function getClientByCode(code: string): ClientRecord | undefined {
  return getClientCatalogRecords().find((client) => client.code === code);
}

export function getClientById(id: number): ClientRecord | undefined {
  return getClientCatalogRecords().find((client) => client.id === id);
}

export function getClientByRuc(ruc: string): ClientRecord | undefined {
  return getClientCatalogRecords().find((client) => client.ruc === ruc);
}

export function saveClientRecord(record: ClientRecord) {
  const saved = getCreatedClients();

  const filtered = saved.filter(
    (client) => client.ruc !== record.ruc && client.code !== record.code
  );

  persistClients([record, ...filtered]);
}

export function updateClientRecord(code: string, updatedRecord: Partial<ClientRecord>) {
  const saved = getCreatedClients();

  const existing = saved.find((client) => client.code === code);

  if (!existing) {
    const maxId = saved.length > 0 ? Math.max(...saved.map((c) => c.id)) : 0;
    persistClients([
      {
        id: maxId + 1,
        code,
        documentType: "RUC",
        ruc: "",
        name: "",
        status: "Borrador",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...updatedRecord,
      },
      ...saved,
    ]);

    return;
  }

  const updated = saved.map((client) =>
    client.code === code
      ? {
          ...client,
          ...updatedRecord,
          code,
          updatedAt: new Date().toISOString(),
        }
      : client
  );

  persistClients(updated);
}

export function deactivateClientRecord(code: string) {
  const client = getClientByCode(code);

  if (!client) return;

  updateClientRecord(code, {
    ...client,
    status: "Inactivo",
    updatedAt: new Date().toISOString(),
  });
}

export function getNextClientId() {
  const allClients = getClientCatalogRecords();
  const ids = allClients.map((client) => Number(client.id)).filter(Boolean);

  return Math.max(0, ...ids) + 1;
}

export function getNextClientCode() {
  const nextId = getNextClientId();
  return `CLI-${String(nextId).padStart(6, "0")}`;
}