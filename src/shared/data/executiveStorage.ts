const EXECUTIVES_STORAGE_KEY = "odiseo_commercial_executives";

export type ExecutiveStatus = "Activo" | "Inactivo";

export type CommercialExecutiveRecord = {
  id: number;
  code: string;
  name: string;
  email: string;
  phone?: string;
  area: "Comercial";
  position: string;
  status: ExecutiveStatus;
  createdAt: string;
  updatedAt: string;
};

const INITIAL_EXECUTIVES: CommercialExecutiveRecord[] = [
  {
    id: 1,
    code: "EJC-000001",
    name: "BALDEON, EDUARDO",
    email: "eduardo.baldeon@amcor.com",
    phone: "+51 999 100 001",
    area: "Comercial",
    position: "Ejecutivo Comercial",
    status: "Activo",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    code: "EJC-000002",
    name: "BOERO A.",
    email: "a.boero@amcor.com",
    phone: "+51 999 100 002",
    area: "Comercial",
    position: "Ejecutivo Comercial",
    status: "Activo",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    code: "EJC-000003",
    name: "GUARDAMINO, KATIA",
    email: "katia.guardamino@amcor.com",
    phone: "+51 999 100 003",
    area: "Comercial",
    position: "Ejecutivo Comercial",
    status: "Activo",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 4,
    code: "EJC-000004",
    name: "OTERO, AUGUSTO",
    email: "augusto.otero@amcor.com",
    phone: "+51 999 100 004",
    area: "Comercial",
    position: "Ejecutivo Comercial",
    status: "Activo",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 5,
    code: "EJC-000005",
    name: "HUAMANI, ISMAEL",
    email: "ismael.huamani@amcor.com",
    phone: "+51 999 100 005",
    area: "Comercial",
    position: "Ejecutivo Comercial",
    status: "Activo",
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

function persistExecutives(records: CommercialExecutiveRecord[]) {
  localStorage.setItem(EXECUTIVES_STORAGE_KEY, JSON.stringify(records));
}

export function getCreatedExecutives(): CommercialExecutiveRecord[] {
  return safeParseArray<CommercialExecutiveRecord>(
    localStorage.getItem(EXECUTIVES_STORAGE_KEY)
  );
}

export function getExecutiveRecords(): CommercialExecutiveRecord[] {
  const createdExecutives = getCreatedExecutives();

  const createdCodes = new Set(
    createdExecutives.map((executive) => executive.code)
  );

  const createdEmails = new Set(
    createdExecutives.map((executive) => executive.email)
  );

  const initialWithoutDuplicates = INITIAL_EXECUTIVES.filter(
    (executive) =>
      !createdCodes.has(executive.code) &&
      !createdEmails.has(executive.email)
  );

  return [...createdExecutives, ...initialWithoutDuplicates];
}

export function getActiveExecutiveRecords(): CommercialExecutiveRecord[] {
  return getExecutiveRecords().filter(
    (executive) => executive.status === "Activo"
  );
}

export function getExecutiveById(
  id: number
): CommercialExecutiveRecord | undefined {
  return getExecutiveRecords().find((executive) => executive.id === id);
}

export function getExecutiveByCode(
  code: string
): CommercialExecutiveRecord | undefined {
  return getExecutiveRecords().find((executive) => executive.code === code);
}

export function saveExecutiveRecord(record: CommercialExecutiveRecord) {
  const saved = getCreatedExecutives();

  const filtered = saved.filter(
    (executive) =>
      executive.code !== record.code && executive.email !== record.email
  );

  persistExecutives([record, ...filtered]);
}

export function updateExecutiveRecord(
  code: string,
  updatedRecord: CommercialExecutiveRecord
) {
  const saved = getCreatedExecutives();

  const existsInCreated = saved.some((executive) => executive.code === code);

  if (!existsInCreated) {
    persistExecutives([
      {
        ...updatedRecord,
        code,
        updatedAt: new Date().toISOString(),
      },
      ...saved,
    ]);

    return;
  }

  const updated = saved.map((executive) =>
    executive.code === code
      ? {
          ...executive,
          ...updatedRecord,
          code,
          updatedAt: new Date().toISOString(),
        }
      : executive
  );

  persistExecutives(updated);
}

export function deactivateExecutiveRecord(code: string) {
  const executive = getExecutiveByCode(code);

  if (!executive) return;

  updateExecutiveRecord(code, {
    ...executive,
    status: "Inactivo",
    updatedAt: new Date().toISOString(),
  });
}

export function getNextExecutiveId() {
  const executives = getExecutiveRecords();
  const ids = executives.map((executive) => Number(executive.id)).filter(Boolean);

  return Math.max(0, ...ids) + 1;
}

export function getNextExecutiveCode() {
  const nextId = getNextExecutiveId();
  return `EJC-${String(nextId).padStart(6, "0")}`;
}