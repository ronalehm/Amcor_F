export type ClientMirror = {
  id: string;
  code: string;
  razonSocial: string;
  nombreComercial?: string;
  ruc: string;
  email?: string;
  status: "Activo" | "Inactivo";
};

const CLIENTS_MIRROR: ClientMirror[] = [
  {
    id: "CMI-001",
    code: "CL-SI-001",
    razonSocial: "Alicorp S.A.A.",
    nombreComercial: "Alicorp",
    ruc: "20100055237",
    email: "contacto@alicorp.com",
    status: "Activo",
  },
  {
    id: "CMI-002",
    code: "CL-SI-002",
    razonSocial: "Kimberly-Clark Perú",
    nombreComercial: "Kimberly-Clark",
    ruc: "20100152941",
    email: "contacto@kimberly-clark.com",
    status: "Activo",
  },
  {
    id: "CMI-003",
    code: "CL-SI-003",
    razonSocial: "Leche Gloria S.A.",
    nombreComercial: "Gloria",
    ruc: "20100190797",
    email: "contacto@gloria.com",
    status: "Activo",
  },
];

const LAST_SYNC_TIMESTAMP_KEY = "odiseo_clients_mirror_last_sync";

export function getAllClientsMirror(): ClientMirror[] {
  return CLIENTS_MIRROR;
}

export function getClientMirrorByCode(code: string): ClientMirror | undefined {
  return CLIENTS_MIRROR.find((client) => client.code === code);
}

export function getClientMirrorByRuc(ruc: string): ClientMirror | undefined {
  return CLIENTS_MIRROR.find((client) => client.ruc === ruc);
}

export function getClientMirrorByRazonSocial(razonSocial: string): ClientMirror | undefined {
  return CLIENTS_MIRROR.find((client) =>
    client.razonSocial.toLowerCase() === razonSocial.toLowerCase()
  );
}

export function getActiveClientsMirror(): ClientMirror[] {
  return CLIENTS_MIRROR.filter((client) => client.status === "Activo");
}

export function getLastSyncTimestamp(): string {
  return localStorage.getItem(LAST_SYNC_TIMESTAMP_KEY) || new Date(2026, 0, 1).toISOString();
}

export function formatSyncTimestamp(timestamp: string): string {
  if (!timestamp) return "Nunca";
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
