import { create } from "zustand";
import type { SessionUser } from "@shared/schema";
import { apiRequest } from "./queryClient";

type AuthUser = SessionUser;

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasLoadedSession: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: (force?: boolean) => Promise<void>;
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

let sessionLoadPromise: Promise<void> | null = null;
let authMutationVersion = 0;

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasLoadedSession: false,

  login: async (email, password) => {
    const requestVersion = ++authMutationVersion;
    set({ isLoading: true });
    try {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = (await response.json()) as { user: AuthUser };
      if (requestVersion === authMutationVersion) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          hasLoadedSession: true,
        });
      }
      return true;
    } catch (error) {
      if (requestVersion === authMutationVersion) {
        set({ user: null, isAuthenticated: false, isLoading: false, hasLoadedSession: true });
      }
      throw error;
    }
  },

  signup: async (name, email, phone, password) => {
    const requestVersion = ++authMutationVersion;
    set({ isLoading: true });
    try {
      const response = await apiRequest("POST", "/api/auth/signup", { name, email, phone, password });
      const data = (await response.json()) as { user: AuthUser };
      if (requestVersion === authMutationVersion) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          hasLoadedSession: true,
        });
      }
      return true;
    } catch (error) {
      if (requestVersion === authMutationVersion) {
        set({ user: null, isAuthenticated: false, isLoading: false, hasLoadedSession: true });
      }
      throw error;
    }
  },

  forgotPassword: async (email) => {
    await apiRequest("POST", "/api/auth/forgot-password", { email });
  },

  resetPassword: async (token, password) => {
    await apiRequest("POST", "/api/auth/reset-password", { token, password });
  },

  logout: async () => {
    ++authMutationVersion;
    try {
      await apiRequest("POST", "/api/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, hasLoadedSession: true });
    }
  },

  loadSession: async (force = false) => {
    if (!force && get().hasLoadedSession) {
      return;
    }

    if (sessionLoadPromise) {
      return sessionLoadPromise;
    }

    const requestVersion = authMutationVersion;
    set({ isLoading: true });

    sessionLoadPromise = (async () => {
      try {
        const data = await fetchCurrentSession();
        if (requestVersion === authMutationVersion) {
          set({
            user: data.user,
            isAuthenticated: Boolean(data.user),
            isLoading: false,
            hasLoadedSession: true,
          });
        }
      } catch {
        if (requestVersion === authMutationVersion) {
          set({ user: null, isAuthenticated: false, isLoading: false, hasLoadedSession: true });
        }
      } finally {
        sessionLoadPromise = null;
      }
    })();

    return sessionLoadPromise;
  },
}));
