import type { UserStatus } from "./userStorage";

const USER_STATUS_HISTORY_KEY = "odiseo_user_status_history";

export type UserStatusEvent = {
  id: string; // "UHIS-" + timestamp + random
  userId: string;
  fromStatus: UserStatus | null; // null when user is first created
  toStatus: UserStatus;
  changedBy: string; // user id or system identifier
  changedAt: string; // ISO timestamp
  comment?: string;
  tokenGenerated?: boolean; // for activation tokens
};

// Define allowed transitions between statuses
const ALLOWED_TRANSITIONS: Record<UserStatus, UserStatus[]> = {
  pending_activation: ["active", "inactive"],
  pending_validation: ["active", "inactive", "blocked"],
  active: ["inactive", "blocked", "pending_activation"],
  inactive: ["pending_activation", "active"],
  blocked: ["active", "pending_activation"],
};

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistHistory(events: UserStatusEvent[]) {
  localStorage.setItem(USER_STATUS_HISTORY_KEY, JSON.stringify(events));
}

function generateEventId(): string {
  return `UHIS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function canTransitionUserStatus(fromStatus: UserStatus, toStatus: UserStatus): boolean {
  return ALLOWED_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

export function registerUserStatusChange(
  userId: string,
  fromStatus: UserStatus | null,
  toStatus: UserStatus,
  changedBy: string,
  comment?: string,
  tokenGenerated: boolean = false
): UserStatusEvent {
  const history = safeParseArray<UserStatusEvent>(
    localStorage.getItem(USER_STATUS_HISTORY_KEY)
  );

  const event: UserStatusEvent = {
    id: generateEventId(),
    userId,
    fromStatus,
    toStatus,
    changedBy,
    changedAt: new Date().toISOString(),
    comment,
    tokenGenerated,
  };

  persistHistory([event, ...history]);
  return event;
}

export function getUserStatusHistory(userId: string): UserStatusEvent[] {
  const history = safeParseArray<UserStatusEvent>(
    localStorage.getItem(USER_STATUS_HISTORY_KEY)
  );
  return history.filter((event) => event.userId === userId);
}

export function getAllStatusHistory(): UserStatusEvent[] {
  return safeParseArray<UserStatusEvent>(
    localStorage.getItem(USER_STATUS_HISTORY_KEY)
  );
}

export function getLatestStatusEvent(userId: string): UserStatusEvent | null {
  const history = getUserStatusHistory(userId);
  return history.length > 0 ? history[0] : null;
}
