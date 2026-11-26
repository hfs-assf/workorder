/**
 * The logged-in user's profile.
 * For now it's sample data; in Step 4 (Login) setUser() is called with the real profile from the server.
 * Same small-store pattern as theme-mode and toast.
 */
import { useSyncExternalStore } from "react";

/** What the user is allowed to do in the app */
export type Role = "user" | "admin" | "system-admin";

/** How each role is shown on screen */
export const ROLE_LABEL: Record<Role, string> = {
  user: "User",
  admin: "Admin",
  "system-admin": "System Admin",
};

export type UserProfile = {
  name: string;
  workdayId: string;
  phone: string;
  role: Role;
  avatarUri?: string | null;
  /** Where the user lives / is assigned. Used to pre-fill forms. */
  area: { facility: "house" | "mess"; name: string };
};

// Sample profile until login exists
let user: UserProfile | null = {
  name: "Token",
  workdayId: "10234567",
  phone: "0812 3456 7890",
  role: "user",
  avatarUri: "https://i.pravatar.cc/150?img=12",
  area: { facility: "house", name: "TS 2-Type FM-Blok GG-25" },
};

const listeners = new Set<() => void>();

/** Set after login, null after logout */
export function setUser(next: UserProfile | null) {
  user = next;
  listeners.forEach((l) => l());
}

/** The current user (re-renders when it changes) */
export function useCurrentUser() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => user,
    () => user,
  );
}
