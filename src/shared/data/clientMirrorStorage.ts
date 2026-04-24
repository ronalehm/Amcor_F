const CLIENTS_MIRROR_KEY = "odiseo_clients_mirror";
const SYNC_TIMESTAMP_KEY = "odiseo_clients_sync_timestamp";

export type ClientStatus = "Activo" | "Inactivo";
export type ClientOrigin = "Sistema Integral";

export interface ClientMirror {
  id: string;
  siCode: string; // Código cliente del Sistema Integral
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  status: ClientStatus;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  lastSyncedAt: string;
}

const INITIAL_CLIENTS_MIRROR: ClientMirror[] = [
  {
    id: "CLI-001",
    siCode: "CL-000001",
    ruc: "20123456789",
    razonSocial: "EMPRESA PERUANA SAC",
    nombreComercial: "EMPRESA PERUANA",
    status: "Activo",
    email: "contacto@empresaperuana.com",
    phone: "+51 987 654 321",
    city: "Lima",
    country: "Perú",
    lastSyncedAt: "2026-04-24T10:30:00.000Z",
  },
  {
    id: "CLI-002",
    siCode: "CL-000002",
    ruc: "20987654321",
    razonSocial: "INVERSIONES COMERCIALES LTDA",
    nombreComercial: "INVERSIONES COMERCIALES",
    status: "Activo",
    email: "info@invcomerciales.com",
    phone: "+51 987 123 456",
    city: "Arequipa",
    country: "Perú",
    lastSyncedAt: "2026-04-24T10:30:00.000Z",
  },
  {
    id: "CLI-003",
    siCode: "CL-000003",
    ruc: "20555666777",
    razonSocial: "DISTRIBUIDORA DEL NORTE EIRL",
    nombreComercial: "DISTRIBUIDORA DEL NORTE",
    status: "Activo",
    email: "ventas@distribuiradora-norte.com",
    phone: "+51 976 543 210",
    city: "Trujillo",
    country: "Perú",
    lastSyncedAt: "2026-04-24T10:30:00.000Z",
  },
  {
    id: "CLI-004",
    siCode: "CL-000004",
    ruc: "20888999000",
    razonSocial: "ALIMENTOS FRESCOS IMPORTADOS",
    nombreComercial: "ALIMENTOS FRESCOS",
    status: "Inactivo",
    email: "info@alimentosfrescos.com",
    city: "Lima",
    country: "Perú",
    lastSyncedAt: "2026-04-24T10:30:00.000Z",
  },
  {
    id: "CLI-005",
    siCode: "CL-000005",
    ruc: "20111222333",
    razonSocial: "PRODUCTOS MANUFACTURADOS SA",
    nombreComercial: "PRODUCTOS MANUFACTURADOS",
    status: "Activo",
    email: "contacto@prodmanu.com",
    phone: "+51 956 234 567",
    city: "Callao",
    country: "Perú",
    lastSyncedAt: "2026-04-24T10:30:00.000Z",
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

function safeParse<T>(value: string | null): T | null {
  try {
    return JSON.parse(value || "null");
  } catch {
    return null;
  }
}

function persistClients(records: ClientMirror[]) {
  localStorage.setItem(CLIENTS_MIRROR_KEY, JSON.stringify(records));
}

function persistSyncTimestamp(timestamp: string) {
  localStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
}

export function getLastSyncTimestamp(): string {
  const timestamp = safeParse<string>(localStorage.getItem(SYNC_TIMESTAMP_KEY));
  return timestamp || "2026-04-24T10:30:00.000Z";
}

export function getAllClientsMirror(): ClientMirror[] {
  const synced = safeParseArray<ClientMirror>(localStorage.getItem(CLIENTS_MIRROR_KEY));
  const syncedIds = new Set(synced.map((c) => c.id));
  const initialWithoutDuplicates = INITIAL_CLIENTS_MIRROR.filter(
    (c) => !syncedIds.has(c.id)
  );
  return [...synced, ...initialWithoutDuplicates];
}

export function getActiveClientsMirror(): ClientMirror[] {
  return getAllClientsMirror().filter((c) => c.status === "Activo");
}

export function getClientMirrorByRuc(ruc: string): ClientMirror | undefined {
  return getAllClientsMirror().find((c) => c.ruc === ruc);
}

export function getClientMirrorByRazonSocial(razonSocial: string): ClientMirror | undefined {
  return getAllClientsMirror().find(
    (c) => c.razonSocial.toLowerCase() === razonSocial.toLowerCase()
  );
}

export function getClientMirrorBySiCode(siCode: string): ClientMirror | undefined {
  return getAllClientsMirror().find((c) => c.siCode === siCode);
}

export function getClientMirrorById(id: string): ClientMirror | undefined {
  return getAllClientsMirror().find((c) => c.id === id);
}

export function syncClientsFromSI(clientsList: ClientMirror[]): void {
  const existingIds = new Set(
    safeParseArray<ClientMirror>(localStorage.getItem(CLIENTS_MIRROR_KEY)).map((c) => c.id)
  );

  const newClients = clientsList.filter((c) => !existingIds.has(c.id));
  const existingClients = safeParseArray<ClientMirror>(
    localStorage.getItem(CLIENTS_MIRROR_KEY)
  );

  const updatedClients = existingClients.map((existing) => {
    const updated = clientsList.find((c) => c.id === existing.id);
    return updated ? { ...updated, lastSyncedAt: new Date().toISOString() } : existing;
  });

  const allClients = [
    ...updatedClients,
    ...newClients.map((c) => ({
      ...c,
      lastSyncedAt: new Date().toISOString(),
    })),
  ];

  persistClients(allClients);
  persistSyncTimestamp(new Date().toISOString());
}

export function updateClientStatus(clientId: string, status: ClientStatus): void {
  const client = getClientMirrorById(clientId);
  if (!client) return;

  const synced = safeParseArray<ClientMirror>(localStorage.getItem(CLIENTS_MIRROR_KEY));
  const filtered = synced.filter((c) => c.id !== clientId);
  const updated = {
    ...client,
    status,
    lastSyncedAt: new Date().toISOString(),
  };

  persistClients([updated, ...filtered]);
}

export function formatSyncTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
