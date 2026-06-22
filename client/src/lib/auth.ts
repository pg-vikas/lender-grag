import { create } from "zustand";
import type { SessionUser } from "@shared/schema";
import { apiRequest } from "./queryClient";

type AuthUser = SessionUser;

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

async function fetchCurrentSession() {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to load session");
  }

  return (await response.json()) as { user: AuthUser | null };
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = (await response.json()) as { user: AuthUser };
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    return true;
  },

  signup: async (name, email, phone, password) => {
    const response = await apiRequest("POST", "/api/auth/signup", { name, email, phone, password });
    const data = (await response.json()) as { user: AuthUser };
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchCurrentSession();
      set({
        user: data.user,
        isAuthenticated: Boolean(data.user),
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
