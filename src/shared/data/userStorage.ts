const USERS_STORAGE_KEY = "odiseo_users";
const CURRENT_USER_KEY = "odiseo_current_user";

export type UserRole = "admin" | "comercial" | "artes" | "rd" | "finance" | "viewer";

export type UserStatus = "active" | "inactive" | "pending";

export type User = {
  id: string;
  code: string;
  email: string;
  password: string; // En producción esto debe estar hasheado
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  area?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

export type UserPublic = Omit<User, "password">;

const INITIAL_USERS: User[] = [
  {
    id: "USR-000001",
    code: "US-000001",
    email: "admin@amcor.com",
    password: "admin123", // Solo para demo
    firstName: "Administrador",
    lastName: "Sistema",
    fullName: "Administrador Sistema",
    role: "admin",
    status: "active",
    area: "TI",
    phone: "+51 999 999 999",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "USR-000002",
    code: "US-000002",
    email: "comercial@amcor.com",
    password: "demo123",
    firstName: "Ejecutivo",
    lastName: "Comercial",
    fullName: "Ejecutivo Comercial",
    role: "comercial",
    status: "active",
    area: "Ventas",
    phone: "+51 999 888 888",
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "USR-000003",
    code: "US-000003",
    email: "artes@amcor.com",
    password: "demo123",
    firstName: "Diseñador",
    lastName: "Gráfico",
    fullName: "Diseñador Gráfico",
    role: "artes",
    status: "active",
    area: "Artes Gráficas",
    phone: "+51 999 777 777",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "USR-000004",
    code: "US-000004",
    email: "rnd@amcor.com",
    password: "demo123",
    firstName: "Ingeniero",
    lastName: "R&D",
    fullName: "Ingeniero R&D",
    role: "rd",
    status: "active",
    area: "Research & Development",
    phone: "+51 999 666 666",
    createdAt: "2026-02-10T00:00:00.000Z",
    updatedAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "USR-000005",
    code: "US-000005",
    email: "finance@amcor.com",
    password: "demo123",
    firstName: "Analista",
    lastName: "Finance",
    fullName: "Analista Finance",
    role: "finance",
    status: "active",
    area: "Commercial Finance",
    phone: "+51 999 555 555",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
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

function persistUsers(records: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(records));
}

export function getAllUsers(): User[] {
  const saved = safeParseArray<User>(localStorage.getItem(USERS_STORAGE_KEY));
  const savedIds = new Set(saved.map((u) => u.id));
  const initialWithoutDuplicates = INITIAL_USERS.filter(
    (user) => !savedIds.has(user.id)
  );
  return [...saved, ...initialWithoutDuplicates];
}

export function getUserById(id: string): User | undefined {
  return getAllUsers().find((user) => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getAllUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
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

  // Actualizar último login
  const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
  saveUserRecord(updatedUser);

  // Guardar sesión actual
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
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function saveUserRecord(record: User): void {
  const saved = safeParseArray<User>(localStorage.getItem(USERS_STORAGE_KEY));
  const filtered = saved.filter((user) => user.id !== record.id);
  persistUsers([record, ...filtered]);
}

export function createUser(newUser: Omit<User, "id" | "code" | "createdAt" | "updatedAt" | "fullName">): User {
  const now = new Date().toISOString();
  const allUsers = getAllUsers();
  const maxNumber = Math.max(
    0,
    ...allUsers.map((u) => Number(u.code.replace("US-", "")))
  );
  const nextNumber = maxNumber + 1;

  const user: User = {
    ...newUser,
    id: `USR-${String(nextNumber).padStart(6, "0")}`,
    code: `US-${String(nextNumber).padStart(6, "0")}`,
    fullName: `${newUser.firstName} ${newUser.lastName}`,
    createdAt: now,
    updatedAt: now,
  };

  saveUserRecord(user);
  return user;
}

export function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "code" | "createdAt">>
): User | null {
  const user = getUserById(id);
  if (!user) return null;

  const updated: User = {
    ...user,
    ...updates,
    fullName: updates.firstName || updates.lastName
      ? `${updates.firstName || user.firstName} ${updates.lastName || user.lastName}`
      : user.fullName,
    updatedAt: new Date().toISOString(),
  };

  saveUserRecord(updated);
  return updated;
}

export function deactivateUser(id: string): boolean {
  const user = getUserById(id);
  if (!user) return false;

  saveUserRecord({ ...user, status: "inactive", updatedAt: new Date().toISOString() });
  return true;
}

export function activateUser(id: string): boolean {
  const user = getUserById(id);
  if (!user) return false;

  saveUserRecord({ ...user, status: "active", updatedAt: new Date().toISOString() });
  return true;
}

export function deleteUser(id: string): boolean {
  const saved = safeParseArray<User>(localStorage.getItem(USERS_STORAGE_KEY));
  const filtered = saved.filter((user) => user.id !== id);
  persistUsers(filtered);
  return true;
}

export function getNextUserCode(): string {
  const allUsers = getAllUsers();
  const maxNumber = Math.max(
    0,
    ...allUsers.map((u) => Number(u.code.replace("US-", "")))
  );
  return `US-${String(maxNumber + 1).padStart(6, "0")}`;
}

export function getUsersByRole(role: UserRole): User[] {
  return getAllUsers().filter((user) => user.role === role);
}

export function getActiveUsers(): User[] {
  return getAllUsers().filter((user) => user.status === "active");
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
  pending: "Pendiente",
};

export const STATUS_COLORS: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};
