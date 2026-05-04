import seedUsers from "./seeds/users.json";
import { type PortalRole } from "./areaDepartmentConfig";
import { canTransitionUserStatus, registerUserStatusChange } from "./userStatusStorage";

const USERS_STORAGE_KEY = "odiseo_users";
const CURRENT_USER_KEY = "odiseo_current_user";
const DEFAULT_DEMO_PASSWORD = "123456";

export type UserRole =
  | "admin"
  | "comercial"
  | "artes"
  | "rd"
  | "finance"
  | "viewer";

export type UserStatus =
  | "active"
  | "inactive"
  | "pending_activation"
  | "pending_validation"
  | "blocked";

export type User = {
  id: string;
  code: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: PortalRole;
  status: UserStatus;
  workerCode: string;
  position: string;
  company: string;
  area?: string;
  phone?: string;
  siUserId?: string;
  siUserCode?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

export type UserPublic = Omit<User, "password">;

const SEED_DATE = "2026-01-01T00:00:00.000Z";

const AREA_USERS: User[] = [
  {
    id: "USR-000001",
    code: "US-000001",
    email: "admin@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Administrador",
    lastName: "Sistema",
    fullName: "Administrador Sistema",
    role: "admin" as PortalRole,
    status: "active",
    workerCode: "GEN-ADMIN",
    position: "Administrador del Portal",
    company: "Amcor",
    area: "Sistema",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000002",
    code: "US-000002",
    email: "comercial@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Comercial",
    fullName: "Usuario Comercial",
    role: "comercial" as PortalRole,
    status: "active",
    workerCode: "GEN-COMERCIAL",
    position: "Ejecutivo Comercial",
    company: "Amcor",
    area: "Comercial",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000003",
    code: "US-000003",
    email: "artes@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Artes Gráficas",
    fullName: "Usuario Artes Gráficas",
    role: "artes" as PortalRole,
    status: "active",
    workerCode: "GEN-ARTES",
    position: "Validador Artes Gráficas",
    company: "Amcor",
    area: "Artes Gráficas",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000004",
    code: "US-000004",
    email: "rnd@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "R&D",
    fullName: "Usuario R&D",
    role: "rd" as PortalRole,
    status: "active",
    workerCode: "GEN-RD",
    position: "Validador R&D",
    company: "Amcor",
    area: "R&D",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000005",
    code: "US-000005",
    email: "finance@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Commercial Finance",
    fullName: "Usuario Commercial Finance",
    role: "finance" as PortalRole,
    status: "active",
    workerCode: "GEN-FINANCE",
    position: "Commercial Finance",
    company: "Amcor",
    area: "Commercial Finance",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000006",
    code: "US-000006",
    email: "supply@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Supply",
    fullName: "Usuario Supply",
    role: "viewer" as PortalRole,
    status: "active",
    workerCode: "GEN-SUPPLY",
    position: "Supply",
    company: "Amcor",
    area: "Supply",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000007",
    code: "US-000007",
    email: "produccion@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Producción",
    fullName: "Usuario Producción",
    role: "viewer" as PortalRole,
    status: "active",
    workerCode: "GEN-PRODUCCION",
    position: "Producción",
    company: "Amcor",
    area: "Producción",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000008",
    code: "US-000008",
    email: "planificacion@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Planificación",
    fullName: "Usuario Planificación",
    role: "viewer" as PortalRole,
    status: "active",
    workerCode: "GEN-PLANIFICACION",
    position: "Planificación",
    company: "Amcor",
    area: "Planificación",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000009",
    code: "US-000009",
    email: "customerservice@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Customer Service",
    fullName: "Usuario Customer Service",
    role: "viewer" as PortalRole,
    status: "active",
    workerCode: "GEN-CS",
    position: "Customer Service",
    company: "Amcor",
    area: "Customer Service",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "USR-000010",
    code: "US-000010",
    email: "masterdata@amcor.com",
    password: DEFAULT_DEMO_PASSWORD,
    firstName: "Usuario",
    lastName: "Master Data",
    fullName: "Usuario Master Data",
    role: "viewer" as PortalRole,
    status: "active",
    workerCode: "GEN-MD",
    position: "Master Data",
    company: "Amcor",
    area: "Master Data",
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
];

const JSON_SEED_USERS: User[] = seedUsers as User[];

const INITIAL_USERS: User[] = mergeUsersByIdAndEmail([
  ...AREA_USERS,
  ...JSON_SEED_USERS,
]);

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function normalizeUser(user: User): User {
  return {
    ...user,
    email: normalizeEmail(user.email),
    fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
  };
}

function getUserNumberFromCode(code: string): number {
  const match = code.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function mergeUsersByIdAndEmail(users: User[]): User[] {
  const ids = new Set<string>();
  const emails = new Set<string>();
  const result: User[] = [];

  users.forEach((user) => {
    const normalized = normalizeUser(user);
    const email = normalizeEmail(normalized.email);

    if (ids.has(normalized.id) || emails.has(email)) {
      return;
    }

    ids.add(normalized.id);
    emails.add(email);
    result.push(normalized);
  });

  return result;
}

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistUsers(records: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(records));
}

export function getAllUsers(): User[] {
  const saved = safeParseArray<User>(localStorage.getItem(USERS_STORAGE_KEY));

  const savedIds = new Set(saved.map((u) => u.id));
  const savedEmails = new Set(saved.map((u) => normalizeEmail(u.email)));

  const initialWithoutDuplicates = INITIAL_USERS.filter((user) => {
    return !savedIds.has(user.id) && !savedEmails.has(normalizeEmail(user.email));
  });

  return mergeUsersByIdAndEmail([...saved, ...initialWithoutDuplicates]);
}

export function getUserById(id: string): User | undefined {
  return getAllUsers().find((user) => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  const normalizedEmail = normalizeEmail(email);
  return getAllUsers().find(
    (user) => normalizeEmail(user.email) === normalizedEmail
  );
}

export function getUserByCode(code: string): User | undefined {
  return getAllUsers().find((user) => user.code === code);
}

export function authenticateUser(
  email: string,
  password: string
): UserPublic | null {
  const user = getUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  if (user.status !== "active") {
    return null;
  }

  const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
  saveUserRecord(updatedUser);

  const { password: _, ...publicUser } = updatedUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

  return publicUser;
}

export function getCurrentUser(): UserPublic | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem("odiseo_current_user");
}

export function saveUserRecord(record: User): void {
  const saved = safeParseArray<User>(localStorage.getItem(USERS_STORAGE_KEY));

  const normalizedRecord: User = normalizeUser({
    ...record,
    updatedAt: record.updatedAt || new Date().toISOString(),
  });

  const filtered = saved.filter((user) => {
    const sameId = user.id === normalizedRecord.id;
    const sameEmail = normalizeEmail(user.email) === normalizeEmail(normalizedRecord.email);
    return !sameId && !sameEmail;
  });

  const nextRecords = mergeUsersByIdAndEmail([normalizedRecord, ...filtered]);

  persistUsers(nextRecords);
  saveSeedUsers(nextRecords);
}

export function createUser(
  newUser: Partial<Pick<User, "workerCode" | "position" | "company">> &
    Omit<
      User,
      | "id"
      | "code"
      | "createdAt"
      | "updatedAt"
      | "fullName"
      | "workerCode"
      | "position"
      | "company"
    >
): User {
  const now = new Date().toISOString();
  const allUsers = getAllUsers();

  const maxNumber = Math.max(
    0,
    ...allUsers.map((u) => getUserNumberFromCode(u.code))
  );

  const nextNumber = maxNumber + 1;

  const user: User = {
    ...newUser,
    id: `USR-${String(nextNumber).padStart(6, "0")}`,
    code: `US-${String(nextNumber).padStart(6, "0")}`,
    email: normalizeEmail(newUser.email),
    fullName: `${newUser.firstName} ${newUser.lastName}`.trim(),
    workerCode: newUser.workerCode || "",
    position: newUser.position || "",
    company: newUser.company || "",
    status: newUser.status || "pending_activation",
    createdAt: now,
    updatedAt: now,
  };

  saveUserRecord(user);

  registerUserStatusChange(
    user.id,
    null,
    user.status,
    "system",
    "Usuario creado"
  );

  return user;
}

export function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "code" | "createdAt">>
): User | null {
  const user = getUserById(id);
  if (!user) return null;

  const nextStatus = updates.status || user.status;

  if (
    updates.status &&
    updates.status !== user.status &&
    !canTransitionUserStatus(user.status, updates.status)
  ) {
    throw new Error(
      `Transición de estado no permitida: ${user.status} → ${updates.status}`
    );
  }

  const updated: User = {
    ...user,
    ...updates,
    email: updates.email ? normalizeEmail(updates.email) : user.email,
    fullName:
      updates.firstName || updates.lastName
        ? `${updates.firstName || user.firstName} ${updates.lastName || user.lastName}`.trim()
        : user.fullName,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  saveUserRecord(updated);

  if (updates.status && updates.status !== user.status) {
    registerUserStatusChange(
      user.id,
      user.status,
      updates.status,
      "system",
      "Cambio de estado desde edición de usuario"
    );
  }

  return updated;
}

function changeUserStatus(
  id: string,
  toStatus: UserStatus,
  comment: string,
  changedBy: string = "system"
): boolean {
  const user = getUserById(id);
  if (!user) return false;

  if (user.status === toStatus) {
    return true;
  }

  if (!canTransitionUserStatus(user.status, toStatus)) {
    return false;
  }

  saveUserRecord({
    ...user,
    status: toStatus,
    updatedAt: new Date().toISOString(),
  });

  registerUserStatusChange(
    user.id,
    user.status,
    toStatus,
    changedBy,
    comment
  );

  return true;
}

export function deactivateUser(id: string): boolean {
  return changeUserStatus(id, "inactive", "Usuario desactivado");
}

export function activateUser(id: string): boolean {
  return changeUserStatus(id, "active", "Usuario activado");
}

export function blockUser(id: string): boolean {
  return changeUserStatus(id, "blocked", "Usuario bloqueado");
}

export function unblockUser(id: string): boolean {
  return changeUserStatus(id, "active", "Usuario desbloqueado");
}

export function setPendingActivation(id: string): boolean {
  return changeUserStatus(
    id,
    "pending_activation",
    "Usuario enviado a pendiente de activación"
  );
}

export function setPendingValidation(id: string): boolean {
  return changeUserStatus(
    id,
    "pending_validation",
    "Usuario enviado a pendiente de validación"
  );
}

export function deleteUser(id: string): boolean {
  const saved = safeParseArray<User>(localStorage.getItem(USERS_STORAGE_KEY));
  const filtered = saved.filter((user) => user.id !== id);

  persistUsers(filtered);
  saveSeedUsers(filtered);

  return true;
}

export function getNextUserCode(): string {
  const allUsers = getAllUsers();

  const maxNumber = Math.max(
    0,
    ...allUsers.map((u) => getUserNumberFromCode(u.code))
  );

  return `US-${String(maxNumber + 1).padStart(6, "0")}`;
}

export function getUsersByRole(role: PortalRole): User[] {
  return getAllUsers().filter((user) => user.role === role);
}

export function getCommercialExecutives(): User[] {
  return getAllUsers().filter(
    (user) => user.status === "active" && user.area === "Comercial"
  );
}

export function getActiveUsers(): User[] {
  return getAllUsers().filter((user) => user.status === "active");
}

export function getUserByWorkerCode(workerCode: string): User | undefined {
  return getAllUsers().find((user) => user.workerCode === workerCode);
}

export function findDuplicateUser(
  email: string,
  workerCode?: string
): User | undefined {
  const allUsers = getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  return allUsers.find((user) => {
    const emailMatch = normalizeEmail(user.email) === normalizedEmail;
    const workerCodeMatch = workerCode ? user.workerCode === workerCode : false;
    return emailMatch || workerCodeMatch;
  });
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  comercial: "Ejecutivo Comercial",
  artes: "Artes Gráficas",
  rd: "R&D",
  finance: "Commercial Finance",
  viewer: "Solo Visualización",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  comercial: "bg-blue-100 text-blue-700",
  artes: "bg-pink-100 text-pink-700",
  rd: "bg-green-100 text-green-700",
  finance: "bg-amber-100 text-amber-700",
  viewer: "bg-slate-100 text-slate-700",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  pending_activation: "Pendiente de activación",
  pending_validation: "Pendiente de validación",
  blocked: "Bloqueado",
};

export const STATUS_COLORS: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-600",
  pending_activation: "bg-amber-100 text-amber-700",
  pending_validation: "bg-blue-100 text-blue-700",
  blocked: "bg-red-100 text-red-700",
};

export async function saveSeedUsers(users: User[]): Promise<void> {
  try {
    const response = await fetch("/__update-seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "users", data: users }),
    });

    if (!response.ok) {
      console.error("Failed to save seed users");
    }
  } catch (error) {
    console.error("Error saving seed users:", error);
  }
}