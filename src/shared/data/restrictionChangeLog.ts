// Bitácora de cambios para restricciones

import { getCurrentUser } from "./userStorage";

export interface RestrictionChangeLogEntry {
  id: string;
  timestamp: string;
  user: string;
  restrictionId: string;
  restrictionName: string;
  restrictionType: "dimension" | "validation";
  action: "created" | "updated" | "deleted";
  changes: Record<string, { old: any; new: any }>;
  result: "success" | "error";
  reason?: string; // Motivo del cambio (para importaciones desde Excel)
}

const RESTRICTION_CHANGELOG_KEY = "odiseo_restriction_changelog";

export function getRestrictionChangeLog(): RestrictionChangeLogEntry[] {
  const stored = localStorage.getItem(RESTRICTION_CHANGELOG_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

export function addRestrictionChangeLogEntry(
  entry: Omit<RestrictionChangeLogEntry, "id" | "timestamp" | "user">,
  reason?: string
): RestrictionChangeLogEntry {
  const currentUser = getCurrentUser();
  const newEntry: RestrictionChangeLogEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleDateString("es-ES") + " " + new Date().toLocaleTimeString("es-ES"),
    user: currentUser?.fullName || "Sistema",
    reason: reason || entry.reason,
  };

  const logs = getRestrictionChangeLog();
  logs.unshift(newEntry);
  localStorage.setItem(RESTRICTION_CHANGELOG_KEY, JSON.stringify(logs));

  return newEntry;
}

export function clearRestrictionChangeLog(): void {
  localStorage.removeItem(RESTRICTION_CHANGELOG_KEY);
}

export function getRestrictionChangeLogByType(
  type: "dimension" | "validation"
): RestrictionChangeLogEntry[] {
  return getRestrictionChangeLog().filter((entry) => entry.restrictionType === type);
}
