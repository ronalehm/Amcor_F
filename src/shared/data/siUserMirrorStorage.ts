// Sistema Integral - User Mirror Catalog (read-only, for validation/autocomplete)
// Independent from ODISEO Users and Commercial Executives

import { seedSiUsers } from "./seeds/siUsers";

export type SiUserStatus = "Activo" | "Inactivo";

export interface SiUserMirror {
  id: string;
  siCode: string; // Código trabajador del SI (e.g., "EJC-000001")
  name: string;
  email?: string;
  area?: string;
  position?: string;
  status: SiUserStatus;
}

let siUsersMirrorCache: SiUserMirror[] = [];

function initializeSiUsersMirror(): void {
  if (siUsersMirrorCache.length === 0) {
    const stored = localStorage.getItem("odiseo_si_users_mirror");
    if (stored) {
      siUsersMirrorCache = JSON.parse(stored);
    } else {
      siUsersMirrorCache = seedSiUsers;
      localStorage.setItem("odiseo_si_users_mirror", JSON.stringify(seedSiUsers));
    }
  }
}

export function getSiUsersMirror(): SiUserMirror[] {
  initializeSiUsersMirror();
  return siUsersMirrorCache;
}

export function getActiveSiUsersMirror(): SiUserMirror[] {
  initializeSiUsersMirror();
  return siUsersMirrorCache.filter((user) => user.status === "Activo");
}

export function getSiUserMirrorByCode(code: string): SiUserMirror | undefined {
  initializeSiUsersMirror();
  const normalizedCode = code.trim().toUpperCase();
  return siUsersMirrorCache.find(
    (user) => user.siCode.trim().toUpperCase() === normalizedCode
  );
}

export function getSiUserMirrorById(id: string): SiUserMirror | undefined {
  initializeSiUsersMirror();
  return siUsersMirrorCache.find((user) => user.id === id);
}

export function getSiUserMirrorByEmail(email: string): SiUserMirror | undefined {
  initializeSiUsersMirror();
  const normalizedEmail = email.trim().toLowerCase();
  return siUsersMirrorCache.find(
    (user) => user.email?.trim().toLowerCase() === normalizedEmail
  );
}

export function validateSiWorkerCode(code: string): {
  exists: boolean;
  user?: SiUserMirror;
  message: string;
} {
  const user = getSiUserMirrorByCode(code);

  if (!user) {
    return {
      exists: false,
      message: "Código trabajador no encontrado en Sistema Integral.",
    };
  }

  if (user.status === "Inactivo") {
    return {
      exists: true,
      user,
      message: "Código trabajador encontrado pero INACTIVO en Sistema Integral.",
    };
  }

  return {
    exists: true,
    user,
    message: "Código trabajador encontrado y activo en Sistema Integral.",
  };
}

export function getSiValidationStatus(
  code: string
): "matched" | "not_found" | "inactive" {
  const user = getSiUserMirrorByCode(code);

  if (!user) {
    return "not_found";
  }

  if (user.status === "Inactivo") {
    return "inactive";
  }

  return "matched";
}
