import seedClients from "./seeds/clients.json";

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

const INITIAL_CLIENTS: Client[] = seedClients as Client[];

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
  saveSeedClients(clients);
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

export async function saveSeedClients(clients: Client[]): Promise<void> {
  try {
    const response = await fetch("/__update-seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clients", data: clients }),
    });
    if (!response.ok) console.error("Failed to save seed clients");
  } catch (error) {
    console.error("Error saving seed clients:", error);
  }
}

export function canClientHavePortfolio(status?: ClientStatus): boolean {
  return status === "active" || status === "inactive";
}

export function getClientPortfolioEligibilityMessage(status?: ClientStatus): string {
  if (!status) return "";

  if (status === "pending_activation") {
    return "El cliente debe estar Activo para tener portafolios asignados. Estado actual: Pendiente de Activación";
  }

  if (status === "pending_validation") {
    return "El cliente debe estar Activo para tener portafolios asignados. Estado actual: Pendiente de Validación";
  }

  if (status === "blocked") {
    return "El cliente bloqueado no puede tener portafolios asignados.";
  }

  return "";
}