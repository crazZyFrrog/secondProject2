import { create } from "zustand";
import { api } from "@/lib/api";
import type { PageContent, Project } from "@/types";

type EditorState = {
  projectId: number | null;
  project: Project | null;
  draft: PageContent | null;
  saving: boolean;
  error: string | null;
  load: (id: number) => Promise<void>;
  setDraft: (c: PageContent) => void;
  updateHero: (i: number, title: string, subtitle: string) => void;
  updateText: (i: number, body: string) => void;
  save: () => Promise<void>;
  reset: () => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  project: null,
  draft: null,
  saving: false,
  error: null,

  load: async (id) => {
    set({ error: null });
    const project = await api.project(id);
    const content = project.content as PageContent;
    set({ projectId: id, project, draft: structuredClone(content) });
  },

  setDraft: (c) => set({ draft: c }),

  updateHero: (i, title, subtitle) => {
    const d = get().draft;
    if (!d || !d.blocks[i] || d.blocks[i].type !== "hero") return;
    const blocks = [...d.blocks];
    blocks[i] = { type: "hero", title, subtitle };
    set({ draft: { blocks } });
  },

  updateText: (i, body) => {
    const d = get().draft;
    if (!d || !d.blocks[i] || d.blocks[i].type !== "text") return;
    const blocks = [...d.blocks];
    blocks[i] = { type: "text", body };
    set({ draft: { blocks } });
  },

  save: async () => {
    const { projectId, draft } = get();
    if (projectId == null || !draft) return;
    set({ saving: true, error: null });
    try {
      const project = await api.updateProject(projectId, { content: draft });
      set({ project, draft: structuredClone(project.content as PageContent), saving: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Ошибка сохранения",
        saving: false,
      });
    }
  },

  reset: () =>
    set({
      projectId: null,
      project: null,
      draft: null,
      saving: false,
      error: null,
    }),
}));
