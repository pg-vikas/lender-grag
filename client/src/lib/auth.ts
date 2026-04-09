import { create } from "zustand";

interface AuthUser {
  name: string;
  email: string;
  phone: string;
  joined: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  loadSession: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, _password) => {
    try {
      const stored = localStorage.getItem("lg_user");
      if (stored) {
        const user = JSON.parse(stored) as AuthUser;
        if (user.email === email) {
          set({ user, isAuthenticated: true });
          return true;
        }
      }
    } catch {
      localStorage.removeItem("lg_user");
    }
    const user: AuthUser = { name: email.split("@")[0], email, phone: "", joined: new Date().toISOString() };
    localStorage.setItem("lg_user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return true;
  },

  signup: (name, email, phone, _password) => {
    const user: AuthUser = { name, email, phone, joined: new Date().toISOString() };
    localStorage.setItem("lg_user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: () => {
    localStorage.removeItem("lg_user");
    set({ user: null, isAuthenticated: false });
  },

  loadSession: () => {
    const stored = localStorage.getItem("lg_user");
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthUser;
        set({ user, isAuthenticated: true });
      } catch {
        localStorage.removeItem("lg_user");
      }
    }
  },
}));
