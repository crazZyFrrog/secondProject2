import { create } from "zustand";
import { api, getToken, setToken } from "@/lib/api";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshProfile: (email: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  bootstrap: async () => {
    if (!getToken()) {
      set({ user: null });
      return;
    }
    set({ loading: true });
    try {
      const user = await api.me();
      set({ user, loading: false });
    } catch {
      setToken(null);
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { access_token } = await api.login(email, password);
      setToken(access_token);
      const user = await api.me();
      set({ user, loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Ошибка входа", loading: false });
      throw e;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { access_token } = await api.register(email, password);
      setToken(access_token);
      const user = await api.me();
      set({ user, loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Ошибка регистрации", loading: false });
      throw e;
    }
  },

  logout: () => {
    setToken(null);
    set({ user: null });
  },

  refreshProfile: async (email) => {
    const user = await api.patchMe(email);
    set({ user });
  },
}));
