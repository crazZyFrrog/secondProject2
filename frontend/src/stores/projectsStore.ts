import { create } from "zustand";
import { api } from "@/lib/api";
import type { Project } from "@/types";

type ProjectsState = {
  items: Project[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  create: (name: string) => Promise<Project>;
  remove: (id: number) => Promise<void>;
  rename: (id: number, name: string) => Promise<void>;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const items = await api.projects();
      set({ items, loading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Не удалось загрузить проекты",
        loading: false,
      });
    }
  },

  create: async (name) => {
    const p = await api.createProject(name);
    set({ items: [p, ...get().items] });
    return p;
  },

  remove: async (id) => {
    await api.deleteProject(id);
    set({ items: get().items.filter((x) => x.id !== id) });
  },

  rename: async (id, name) => {
    const updated = await api.updateProject(id, { name });
    set({
      items: get().items.map((x) => (x.id === id ? updated : x)),
    });
  },
}));
