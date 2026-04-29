const CLIENTS_STORAGE_KEY = "odiseo_clients";

export type ClientStatus = "active" | "inactive" | "pending_activation" | "pending_validation" | "blocked";

export type Client = {
  id: string;
  code: string;
  businessName: string;
  email: string;
  ruc: string;
  industry: string;
  status: ClientStatus;
  siClientId?: string;
  siClientCode?: string;
  createdAt: string;
  updatedAt: string;
};

const INITIAL_CLIENTS: Client[] = [
  {
    id: "CLI-000001",
    code: "CL-000001",
    businessName: "Alicorp S.A.A.",
    email: "contacto@alicorp.com",
    ruc: "20100055237",
    industry: "Consumo masivo",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "CLI-000002",
    code: "CL-000002",
    businessName: "Kimberly-Clark Perú",
    email: "contacto@kimberly-clark.com",
    ruc: "20100152941",
    industry: "Cuidado personal",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "CLI-000003",
    code: "CL-000003",
    businessName: "Leche Gloria S.A.",
    email: "contacto@gloria.com",
    ruc: "20100190797",
    industry: "Alimentos y bebidas",
    status: "active",
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

function persistClients(records: Client[]) {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(records));
}

export function getAllClients(): Client[] {
  const saved = safeParseArray<Client>(localStorage.getItem(CLIENTS_STORAGE_KEY));
  const savedIds = new Set(saved.map((c) => c.id));
  const initialWithoutDuplicates = INITIAL_CLIENTS.filter(
    (client) => !savedIds.has(client.id)
  );
  return [...saved, ...initialWithoutDuplicates];
}

export function getClientById(id: string): Client | undefined {
  return getAllClients().find((client) => client.id === id);
}

export function getClientByCode(code: string): Client | undefined {
  return getAllClients().find((client) => client.code === code);
}

export function getClientByEmail(email: string): Client | undefined {
  return getAllClients().find(
    (client) => client.email.toLowerCase() === email.toLowerCase()
  );
}

export function getClientByRuc(ruc: string): Client | undefined {
  return getAllClients().find((client) => client.ruc === ruc);
}

export function findDuplicateClient(email: string, ruc: string): Client | undefined {
  return getAllClients().find(
    (client) =>
      client.email.toLowerCase() === email.toLowerCase() ||
      client.ruc === ruc
  );
}

export function getNextClientCode(): string {
  const clients = getAllClients();
  if (clients.length === 0) return "CL-000001";

  const codes = clients
    .map((c) => c.code)
    .filter((code) => code.startsWith("CL-"))
    .sort();

  const lastCode = codes[codes.length - 1];
  const match = lastCode.match(/CL-(\d+)/);

  if (!match) return "CL-000001";

  const nextNum = String(parseInt(match[1], 10) + 1).padStart(6, "0");
  return `CL-${nextNum}`;
}

export function createClient(data: {
  businessName: string;
  email: string;
  ruc: string;
  industry: string;
  status?: ClientStatus;
  siClientId?: string;
  siClientCode?: string;
}): Client {
  const clients = getAllClients();
  const newClient: Client = {
    id: `CLI-${String(clients.length + 1).padStart(6, "0")}`,
    code: getNextClientCode(),
    businessName: data.businessName,
    email: data.email,
    ruc: data.ruc,
    industry: data.industry,
    status: data.status || "pending_activation",
    siClientId: data.siClientId,
    siClientCode: data.siClientCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  clients.push(newClient);
  persistClients(clients);
  return newClient;
}

export function updateClient(
  id: string,
  data: Partial<Omit<Client, "id" | "code" | "createdAt">>
): Client | undefined {
  const clients = getAllClients();
  const index = clients.findIndex((c) => c.id === id);

  if (index === -1) return undefined;

  clients[index] = {
    ...clients[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  persistClients(clients);
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getAllClients();
  const filtered = clients.filter((c) => c.id !== id);

  if (filtered.length === clients.length) return false;

  persistClients(filtered);
  return true;
}

export function activateClient(id: string): void {
  updateClient(id, { status: "active" });
}

export function deactivateClient(id: string): void {
  updateClient(id, { status: "inactive" });
}

export function blockClient(id: string): void {
  updateClient(id, { status: "blocked" });
}

export function unblockClient(id: string): void {
  updateClient(id, { status: "active" });
}

export function setPendingValidationClient(id: string): void {
  updateClient(id, { status: "pending_validation" });
}

export const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  pending_activation: "Pendiente de Activación",
  pending_validation: "Pendiente de Validación",
  blocked: "Bloqueado",
};

export const STATUS_COLORS: Record<ClientStatus, string> = {
  active: "border-green-200 bg-green-50 text-green-700 font-bold",
  inactive: "border-slate-300 bg-slate-50 text-slate-700 font-bold",
  pending_activation: "border-amber-200 bg-amber-50 text-amber-700 font-bold",
  pending_validation: "border-blue-200 bg-blue-50 text-blue-700 font-bold",
  blocked: "border-red-200 bg-red-50 text-red-700 font-bold",
};

export function getClientCatalogRecords(): Client[] {
  return getAllClients();
}